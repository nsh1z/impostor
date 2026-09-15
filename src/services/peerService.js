import { Peer } from 'peerjs';
import { ServerlessEngine } from './serverlessEngine.js';

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

  // CREAR SALA COMO ANFITRIÓN P2P
  createRoom(name, avatar, callback) {
    this.disconnect();
    this.isHost = true;

    // Generar código único de 4 caracteres
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.roomCode = code;
    const targetPeerId = `impfutbol-${code.toLowerCase()}`;

    try {
      this.peer = new Peer(targetPeerId, {
        debug: 1
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        this.connected = true;
        this.trigger('connect');

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

      this.peer.on('connection', (conn) => {
        this.connections.set(conn.peer, conn);

        conn.on('data', (data) => {
          this.handleHostReceivedData(conn.peer, data);
        });

        conn.on('close', () => {
          this.connections.delete(conn.peer);
          if (this.engine) this.engine.removePlayer(conn.peer);
        });

        conn.on('error', (err) => {
          console.warn('Error en conexión con peer:', err);
          this.connections.delete(conn.peer);
        });
      });

      this.peer.on('error', (err) => {
        console.error('Error de PeerJS Host:', err);
        if (callback) callback({ error: 'No se pudo crear la sala P2P. Prueba nuevamente.' });
      });
    } catch (e) {
      console.error(e);
      if (callback) callback({ error: 'Error al inicializar P2P.' });
    }
  }

  // UNIRSE A SALA COMO CLIENTE P2P
  joinRoom(roomCode, name, avatar, callback) {
    this.disconnect();
    this.isHost = false;
    const cleanCode = roomCode.trim().toUpperCase();
    this.roomCode = cleanCode;
    const targetHostPeerId = `impfutbol-${cleanCode.toLowerCase()}`;

    try {
      this.peer = new Peer({ debug: 1 });

      this.peer.on('open', (id) => {
        this.myPeerId = id;

        // Conectar al anfitrión
        const conn = this.peer.connect(targetHostPeerId, {
          reliable: true
        });

        this.hostConnection = conn;

        let responded = false;
        const joinTimeout = setTimeout(() => {
          if (!responded) {
            responded = true;
            if (callback) callback({ error: 'No se pudo encontrar la sala. Verifica que el anfitrión tenga la sala abierta.' });
          }
        }, 8000);

        conn.on('open', () => {
          this.connected = true;
          this.trigger('connect');

          // Enviar solicitud de unirse
          conn.send({
            action: 'join_room',
            name,
            avatar
          });
        });

        conn.on('data', (msg) => {
          if (msg.action === 'join_response') {
            if (!responded) {
              responded = true;
              clearTimeout(joinTimeout);
              if (callback) callback(msg.payload);
            }
          } else if (msg.action === 'game_state') {
            this.trigger('game_state', msg.state);
          } else if (msg.action === 'event') {
            this.trigger(msg.event, msg.data);
          }
        });

        conn.on('close', () => {
          this.connected = false;
          this.trigger('disconnect', 'El anfitrión cerró la sala.');
        });

        conn.on('error', (err) => {
          if (!responded) {
            responded = true;
            clearTimeout(joinTimeout);
            if (callback) callback({ error: 'Error al conectar con la sala.' });
          }
        });
      });

      this.peer.on('error', (err) => {
        console.error('Error de PeerJS Cliente:', err);
        if (callback) callback({ error: 'Código de sala no encontrado o anfitrión no conectado.' });
      });
    } catch (e) {
      console.error(e);
      if (callback) callback({ error: 'Error al iniciar conexión.' });
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
      } else if (event === 'submit_impostor_guess') {
        this.engine.submitImpostorGuess(this.myPeerId, data?.guessedName);
        if (callback) callback({ success: true });
      } else if (event === 'rematch') {
        this.engine.rematch();
      } else if (event === 'leave_room') {
        this.disconnect();
      }
    } else if (this.hostConnection && this.hostConnection.open) {
      // Los jugadores envían su acción por el canal WebRTC al host
      this.hostConnection.send({
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
      if (conn && conn.open) {
        if (res.error) {
          conn.send({ action: 'join_response', payload: { error: res.error } });
        } else {
          const state = this.engine.getSanitizedState(fromPeerId);
          conn.send({ action: 'join_response', payload: { success: true, roomCode: this.roomCode, state } });
        }
      }
    } else if (msg.action === 'role_ready') {
      this.engine.playerReady(fromPeerId);
    } else if (msg.action === 'submit_clue') {
      this.engine.submitClue(fromPeerId, msg.data?.clueText);
    } else if (msg.action === 'cast_vote') {
      this.engine.castVote(fromPeerId, msg.data?.targetPlayerId);
    } else if (msg.action === 'submit_impostor_guess') {
      this.engine.submitImpostorGuess(fromPeerId, msg.data?.guessedName);
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
      if (conn.open) {
        const playerState = engine.getSanitizedState(peerId);
        conn.send({
          action: 'game_state',
          state: playerState
        });
      }
    });
  }

  broadcastEvent(event, data) {
    this.trigger(event, data);
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send({ action: 'event', event, data });
      }
    });
  }

  connect() {
    // No-op en P2P
  }

  disconnect() {
    this.connected = false;
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
