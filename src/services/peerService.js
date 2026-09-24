import { Peer } from 'peerjs';
import { ServerlessEngine } from './serverlessEngine.js';

// Alfabeto legible para códigos de sala sin caracteres confusos (0/O, 1/I)
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generatePeerRoomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

// Servidores STUN verificados y de latencia ultra-baja (Google y Cloudflare)
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' }
    ]
  }
};

class PeerManager {
  constructor() {
    this.peer = null;
    this.hostConnection = null;
    this.connections = new Map(); // Para el anfitrión: peerId -> conn
    this.isHost = false;
    this.myPeerId = null;
    this.engine = null;
    this.listeners = new Map();
    this.connected = false;
    this.roomCode = null;
    this.heartbeatTimer = null;
    this._hasSetupVisibility = false;

    this.setupVisibilityHandlers();
  }

  setupVisibilityHandlers() {
    if (typeof window === 'undefined' || this._hasSetupVisibility) return;
    this._hasSetupVisibility = true;

    const handleWakeup = () => {
      if (this.peer && !this.peer.destroyed && this.peer.disconnected) {
        console.log('[PeerJS Watchdog] Pestaña reactivada. Reconectando al servidor central...');
        try {
          this.peer.reconnect();
        } catch (e) {
          console.warn('[PeerJS] Error en reconnect al despertar:', e);
        }
      }
    };

    window.addEventListener('focus', handleWakeup);
    window.addEventListener('pageshow', handleWakeup);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          handleWakeup();
        }
      });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.set(event, this.listeners.get(event).filter(cb => cb !== callback));
  }

  trigger(event, data) {
    const list = this.listeners.get(event) || [];
    list.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Error en listener P2P:', e); }
    });
  }

  // ENVÍO SEGURO DE MENSAJES (espera a que el canal esté abierto)
  safeSend(conn, msg) {
    if (!conn) return;
    const doSend = () => {
      try {
        conn.send(msg);
      } catch (err) {
        console.warn('[P2P] Error al enviar mensaje:', err);
      }
    };

    if (conn.open) {
      doSend();
    } else if (conn.dataChannel && conn.dataChannel.readyState === 'open') {
      doSend();
    } else {
      if (typeof conn.once === 'function') {
        conn.once('open', doSend);
      } else {
        conn.on('open', doSend);
      }
    }
  }

  // CREAR SALA COMO ANFITRIÓN P2P
  createRoom(name, avatar, callback, retryCount = 0) {
    this.disconnect();
    this.isHost = true;

    // Generar código único de 4 caracteres legibles
    const code = generatePeerRoomCode();
    this.roomCode = code;
    const targetPeerId = `impfutbol-${code.toLowerCase()}`;

    console.log(`[P2P Host] Registrando sala en la nube: ${code} (${targetPeerId})...`);

    try {
      this.peer = new Peer(targetPeerId, PEER_CONFIG);

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        this.connected = true;
        this.trigger('connect');
        console.log(`[P2P Host] Sala lista y registrada en servidor de señalización con ID: ${id}`);

        // Inicializar motor serverless
        this.engine = new ServerlessEngine(
          (eng) => this.broadcastEngineState(eng),
          (event, data) => this.broadcastEvent(event, data)
        );

        this.engine.createRoom(id, name, avatar, code);
        const state = this.engine.getSanitizedState(id);

        if (callback) callback({ success: true, roomCode: code, state });
        this.trigger('game_state', state);
      });

      // Reconexión automática si el móvil suspende la conexión de señalización
      this.peer.on('disconnected', () => {
        console.warn('[P2P Host] Desconectado del servidor de señalización. Reconectando...');
        if (this.peer && !this.peer.destroyed) {
          try {
            this.peer.reconnect();
          } catch (e) {
            console.error('[P2P Host] Error al reconectar:', e);
          }
        }
      });

      // Watchdog periódico para asegurar que el anfitrión siga en línea para nuevos jugadores
      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => {
        if (this.isHost && this.peer && !this.peer.destroyed && this.peer.disconnected) {
          console.log('[P2P Watchdog] Anfitrión en segundo plano reconectando señalización...');
          try { this.peer.reconnect(); } catch (e) {}
        }
      }, 3000);

      this.peer.on('connection', (conn) => {
        console.log(`[P2P Host] Nueva conexión entrante desde jugador: ${conn.peer}`);
        this.connections.set(conn.peer, conn);

        conn.on('data', (data) => {
          this.handleHostReceivedData(conn.peer, data);
        });

        conn.on('close', () => {
          console.log(`[P2P Host] Jugador desconectado: ${conn.peer}`);
          this.connections.delete(conn.peer);
          if (this.engine) this.engine.removePlayer(conn.peer);
        });

        conn.on('error', (err) => {
          console.warn('[P2P Host] Advertencia en conexión con jugador:', err);
          this.connections.delete(conn.peer);
        });
      });

      this.peer.on('error', (err) => {
        console.error('[P2P Host] Error:', err);
        if (err.type === 'unavailable-id' && retryCount < 3) {
          console.log('[P2P Host] Código en uso, generando nuevo código...');
          this.createRoom(name, avatar, callback, retryCount + 1);
          return;
        }
        if (callback) callback({ error: 'No se pudo crear la sala P2P. Prueba nuevamente.' });
      });
    } catch (e) {
      console.error('[P2P Host] Error fatal:', e);
      if (callback) callback({ error: 'Error al inicializar la sala P2P.' });
    }
  }

  // UNIRSE A SALA COMO CLIENTE P2P
  joinRoom(roomCode, name, avatar, callback) {
    this.disconnect();
    this.isHost = false;

    const cleanCode = (roomCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    this.roomCode = cleanCode;
    const targetHostPeerId = `impfutbol-${cleanCode.toLowerCase()}`;

    console.log(`[P2P Cliente] Intentando conectar a sala ${cleanCode} (${targetHostPeerId})...`);

    try {
      this.peer = new Peer(PEER_CONFIG);

      let responded = false;
      let joinTimeout = null;
      let retryTimer = null;

      const finish = (res) => {
        if (!responded) {
          responded = true;
          if (joinTimeout) clearTimeout(joinTimeout);
          if (retryTimer) clearTimeout(retryTimer);
          if (typeof callback === 'function') callback(res);
        }
      };

      // Tiempo límite de conexión
      joinTimeout = setTimeout(() => {
        console.warn('[P2P Cliente] Tiempo de espera agotado.');
        finish({
          error: 'Tiempo de espera agotado al conectar con el anfitrión. Asegúrate de que el creador de la sala esté dentro del vestuario con la app abierta e intenta de nuevo.'
        });
      }, 20000);

      this.peer.on('disconnected', () => {
        if (this.peer && !this.peer.destroyed) {
          try { this.peer.reconnect(); } catch (e) {}
        }
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        console.log(`[P2P Cliente] Registrado en señalización con ID: ${id}`);
        console.log(`[P2P Cliente] Solicitando enlace WebRTC con el anfitrión ${targetHostPeerId}...`);

        let conn = null;
        let hasSentJoin = false;

        const attemptConnect = () => {
          if (hasSentJoin || responded) return;
          try {
            if (conn) {
              try { conn.close(); } catch (e) {}
            }
            conn = this.peer.connect(targetHostPeerId, { reliable: true });
            this.hostConnection = conn;

            const sendJoin = () => {
              if (hasSentJoin || responded) return;
              hasSentJoin = true;
              this.connected = true;
              this.trigger('connect');
              console.log('[P2P Cliente] ¡Canal WebRTC abierto! Enviando datos para unirse...');
              try {
                conn.send({
                  action: 'join_room',
                  name: (name || '').trim().substring(0, 16),
                  avatar: avatar || 'shirt-7'
                });
              } catch (e) {
                console.warn('[P2P Cliente] Error al enviar join_room:', e);
              }
            };

            conn.on('open', sendJoin);
            if (conn.open || (conn.dataChannel && conn.dataChannel.readyState === 'open')) {
              sendJoin();
            }

            conn.on('data', (msg) => {
              console.log('[P2P Cliente] Mensaje recibido del anfitrión:', msg?.action);
              if (msg.action === 'join_response') {
                finish(msg.payload);
              } else if (msg.action === 'game_state') {
                this.trigger('game_state', msg.state);
                // Si recibimos game_state pero join_response tardó, dar por conectado con éxito
                if (!responded) {
                  finish({ success: true, roomCode: cleanCode, state: msg.state });
                }
              } else if (msg.action === 'event') {
                this.trigger(msg.event, msg.data);
              }
            });

            conn.on('close', () => {
              this.connected = false;
              this.trigger('disconnect', 'El anfitrión cerró la sala.');
            });

            conn.on('error', (err) => {
              console.warn('[P2P Cliente] Advertencia de conexión:', err);
            });
          } catch (err) {
            console.warn('[P2P Cliente] Error en peer.connect:', err);
          }
        };

        attemptConnect();

        // Si pasan 6 segundos sin abrir el canal, reintentar la conexión
        retryTimer = setTimeout(() => {
          if (!hasSentJoin && !responded) {
            console.log('[P2P Cliente] Reintentando conexión con el anfitrión...');
            attemptConnect();
          }
        }, 6000);
      });

      this.peer.on('error', (err) => {
        console.error('[P2P Cliente] Error PeerJS:', err);
        if (err.type === 'peer-unavailable') {
          finish({
            error: `No se encontró la sala "${cleanCode}". Verifica que el anfitrión tenga la sala abierta y la pantalla encendida.`
          });
        } else if (err.type === 'network') {
          finish({
            error: 'Error de red con el servidor de señalización. Revisa tu conexión a internet.'
          });
        } else {
          finish({
            error: 'Error al conectar con la sala. Prueba nuevamente.'
          });
        }
      });
    } catch (e) {
      console.error('[P2P Cliente] Error al iniciar:', e);
      if (callback) callback({ error: 'Error al iniciar conexión P2P.' });
    }
  }

  // ACCIONES ENVIADAS POR CLIENTES AL ANFITRIÓN
  emit(event, data, callback) {
    if (this.isHost) {
      // El anfitrión ejecuta directamente en su motor
      if (event === 'start_game') {
        const res = this.engine.startGame(this.myPeerId);
        if (callback) callback(res);
      } else if (event === 'role_ready') {
        this.engine.playerReady(this.myPeerId);
      } else if (event === 'force_start_clues') {
        this.engine.forceStartClues();
      } else if (event === 'submit_clue') {
        this.engine.submitClue(this.myPeerId, data?.clueText);
        if (callback) callback({ success: true });
      } else if (event === 'skip_clue_turn') {
        this.engine.advanceTurn();
      } else if (event === 'cast_vote') {
        this.engine.castVote(this.myPeerId, data?.targetPlayerId);
      } else if (event === 'force_resolve_voting') {
        this.engine.forceResolveVoting(this.myPeerId);
      } else if (event === 'submit_impostor_guess') {
        this.engine.submitImpostorGuess(this.myPeerId, data?.guessedName);
        if (callback) callback({ success: true });
      } else if (event === 'update_settings') {
        this.engine.updateSettings(data);
      } else if (event === 'rematch') {
        this.engine.rematch();
      } else if (event === 'leave_room') {
        this.disconnect();
      }
    } else if (this.hostConnection) {
      // Los jugadores envían su acción por el canal WebRTC al host
      this.safeSend(this.hostConnection, {
        action: event,
        data
      });
      if (callback) callback({ success: true });
    }
  }

  handleHostReceivedData(fromPeerId, msg) {
    if (!this.engine) return;

    if (msg.action === 'join_room') {
      const res = this.engine.joinRoom(fromPeerId, msg.name, msg.avatar);
      const conn = this.connections.get(fromPeerId);
      if (conn) {
        if (res.error) {
          this.safeSend(conn, { action: 'join_response', payload: { error: res.error } });
        } else {
          const state = this.engine.getSanitizedState(fromPeerId);
          this.safeSend(conn, { action: 'join_response', payload: { success: true, roomCode: this.roomCode, state } });
        }
      }
    } else if (msg.action === 'role_ready') {
      this.engine.playerReady(fromPeerId);
    } else if (msg.action === 'submit_clue') {
      this.engine.submitClue(fromPeerId, msg.data?.clueText);
    } else if (msg.action === 'cast_vote') {
      this.engine.castVote(fromPeerId, msg.data?.targetPlayerId);
    } else if (msg.action === 'force_resolve_voting') {
      this.engine.forceResolveVoting(fromPeerId);
    } else if (msg.action === 'submit_impostor_guess') {
      this.engine.submitImpostorGuess(fromPeerId, msg.data?.guessedName);
    } else if (msg.action === 'update_settings') {
      this.engine.updateSettings(msg.data);
    } else if (msg.action === 'rematch') {
      this.engine.rematch();
    } else if (msg.action === 'leave_room') {
      this.engine.removePlayer(fromPeerId);
    }
  }

  broadcastEngineState(engine) {
    // 1. Notificar al host en su propia pantalla
    const hostState = engine.getSanitizedState(this.myPeerId);
    this.trigger('game_state', hostState);

    // 2. Enviar a cada jugador conectado su estado sanitizado
    this.connections.forEach((conn, peerId) => {
      const playerState = engine.getSanitizedState(peerId);
      this.safeSend(conn, {
        action: 'game_state',
        state: playerState
      });
    });
  }

  broadcastEvent(event, data) {
    this.trigger(event, data);
    this.connections.forEach((conn) => {
      this.safeSend(conn, { action: 'event', event, data });
    });
  }

  connect() {
    // No-op en P2P
  }

  disconnect() {
    this.connected = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.hostConnection) {
      try { this.hostConnection.close(); } catch (e) {}
      this.hostConnection = null;
    }
    this.connections.forEach((conn) => {
      try { conn.close(); } catch (e) {}
    });
    this.connections.clear();

    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
    }
    this.engine = null;
  }
}

export const peerService = new PeerManager();
