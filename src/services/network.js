import { socket } from './socket.js';
import { peerService } from './peerService.js';

class NetworkManager {
  constructor() {
    this.mode = 'AUTO'; // 'SOCKET_IO' | 'P2P_SERVERLESS' | 'AUTO'
    this.activeProvider = null;
    this.listeners = new Map();
    this.hasTestedSocket = false;

    // Escuchar eventos de Socket.IO
    socket.on('connect', () => {
      if (this.mode === 'AUTO' || this.mode === 'SOCKET_IO') {
        this.activeProvider = socket;
        this.trigger('connect');
      }
    });

    socket.on('disconnect', (reason) => {
      if (this.activeProvider === socket) {
        this.trigger('disconnect', reason);
      }
    });

    socket.on('game_state', (state) => {
      if (this.activeProvider === socket) {
        this.trigger('game_state', state);
      }
    });

    // Escuchar eventos de P2P PeerJS
    peerService.on('connect', () => {
      if (this.activeProvider === peerService) {
        this.trigger('connect');
      }
    });

    peerService.on('disconnect', (reason) => {
      if (this.activeProvider === peerService) {
        this.trigger('disconnect', reason);
      }
    });

    peerService.on('game_state', (state) => {
      if (this.activeProvider === peerService) {
        this.trigger('game_state', state);
      }
    });

    // Si ya hay conexión a Socket.IO (ej. localhost)
    if (socket.connected) {
      this.activeProvider = socket;
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
      try { cb(data); } catch (e) { console.error('Error en listener network:', e); }
    });
  }

  isConnected() {
    if (this.activeProvider === socket) return socket.connected;
    if (this.activeProvider === peerService) return peerService.connected;
    return true; // En modo serverless listo para crear/unirse
  }

  getModeName() {
    if (this.activeProvider === peerService) return 'P2P Serverless (Sin backend)';
    if (this.activeProvider === socket) return 'Servidor WebSockets';
    return 'Multijugador Listo';
  }

  createRoom(name, avatar, callback) {
    // Si socket.io está conectado activamente (ej: en localhost con node corriendo), usarlo
    if (socket.connected) {
      this.activeProvider = socket;
      socket.emit('create_room', { name, avatar }, (res) => {
        if (callback) callback(res);
      });
      return;
    }

    // SI NO HAY BACKEND (ej: Vercel): Usar modo Serverless P2P
    console.log('[Network] No se detectó backend activo. Iniciando en modo Serverless P2P (WebRTC)...');
    this.activeProvider = peerService;
    peerService.createRoom(name, avatar, (res) => {
      if (callback) callback(res);
    });
  }

  joinRoom(roomCode, name, avatar, callback) {
    // Si socket.io está conectado activamente, intentar por socket.io primero
    if (socket.connected) {
      this.activeProvider = socket;
      socket.emit('join_room', { roomCode, name, avatar }, (res) => {
        if (callback) callback(res);
      });
      return;
    }

    // SI NO HAY BACKEND: Conectar por Serverless P2P WebRTC
    console.log('[Network] Conectando a sala en modo Serverless P2P...');
    this.activeProvider = peerService;
    peerService.joinRoom(roomCode, name, avatar, (res) => {
      if (callback) callback(res);
    });
  }

  emit(event, data, callback) {
    if (this.activeProvider === socket) {
      socket.emit(event, data, callback);
    } else if (this.activeProvider === peerService) {
      peerService.emit(event, data, callback);
    }
  }

  leaveRoom() {
    if (this.activeProvider === socket) {
      socket.emit('leave_room');
    } else if (this.activeProvider === peerService) {
      peerService.disconnect();
    }
    this.activeProvider = null;
  }
}

export const network = new NetworkManager();
