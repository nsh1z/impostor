import { io } from 'socket.io-client';

// Permite configurar un servidor backend separado mediante VITE_SERVER_URL
// o usar el mismo host en despliegues unificados y desarrollo local
const socketUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;

export const socket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('[Socket conectado]:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('[Socket desconectado]:', reason);
});
