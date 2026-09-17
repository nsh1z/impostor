import { io } from 'socket.io-client';

// Determinar si hay un backend WebSocket real configurado:
// 1. Variable de entorno VITE_SERVER_URL
// 2. Localhost o 127.0.0.1 (desarrollo local)
const hasDedicatedBackend = () => {
  if (typeof window === 'undefined') return true;
  if (import.meta.env.VITE_SERVER_URL) return true;
  const { hostname } = window.location;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

const getSocketUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
  }
  return 'http://localhost:3000';
};

const shouldConnect = hasDedicatedBackend();
const socketUrl = getSocketUrl();

if (shouldConnect) {
  console.log('[Socket] Conectando a servidor backend:', socketUrl);
} else {
  console.log('[Socket] Modo Serverless en la nube: conexión P2P WebRTC activa.');
}

// Transports: solo autoconectar si existe un servidor dedicado
export const socket = io(socketUrl, {
  transports: ['polling', 'websocket'],
  autoConnect: shouldConnect,
  reconnection: shouldConnect,
  reconnectionAttempts: 4,
  reconnectionDelay: 2000,
  timeout: 8000
});

if (shouldConnect) {
  socket.on('connect', () => {
    console.log('[Socket Conectado con éxito! ID:]', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket Error de conexión]:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket Desconectado]:', reason);
  });
}
