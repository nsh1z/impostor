import { io } from 'socket.io-client';

// Determinar la URL del servidor WebSocket:
// 1. Variable de entorno VITE_SERVER_URL (si está definida)
// 2. Si estamos en localhost o 127.0.0.1 (cualquier puerto, ej: 5173 de Vite), conectar directamente al puerto 3000
// 3. De lo contrario, usar window.location.origin
const getSocketUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
    return window.location.origin;
  }
  return 'http://localhost:3000';
};

const socketUrl = getSocketUrl();
console.log('[Socket] Conectando a:', socketUrl);

// Transports por defecto: polling primero para handshake instantáneo, luego upgrade a websocket
export const socket = io(socketUrl, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 10000
});

socket.on('connect', () => {
  console.log('[Socket Conectado con éxito! ID:]', socket.id);
});

socket.on('connect_error', (err) => {
  console.warn('[Socket Error de conexión]:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket Desconectado]:', reason);
});
