import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GameEngine } from './gameEngine.js';
import { getAllPlayerNames } from './playersData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// API pública para obtener lista de futbolistas (para autocompletado del impostor)
app.get('/api/players', (req, res) => {
  res.json(getAllPlayerNames());
});

// Inicializar motor de juego
const engine = new GameEngine(io);

// Servir archivos estáticos del frontend de producción si existen
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Socket.io handlers
io.on('connection', (socket) => {
  console.log(`[Socket conectado] ${socket.id}`);

  // CREAR SALA
  socket.on('create_room', ({ name, avatar }, callback) => {
    try {
      const room = engine.createRoom(socket.id, name || 'Capitán', avatar || 'shirt-10');
      socket.join(room.code);

      const state = engine.getSanitizedState(room, socket.id);
      if (typeof callback === 'function') {
        callback({ success: true, roomCode: room.code, state });
      }
      engine.broadcastState(room);
    } catch (err) {
      console.error('Error al crear sala:', err);
      if (typeof callback === 'function') callback({ error: 'Error al crear la sala.' });
    }
  });

  // UNIRSE A SALA
  socket.on('join_room', ({ roomCode, name, avatar }, callback) => {
    try {
      const res = engine.joinRoom(roomCode, socket.id, name || 'Jugador', avatar || 'shirt-7');
      if (res.error) {
        if (typeof callback === 'function') callback({ error: res.error });
        return;
      }

      socket.join(res.room.code);
      const state = engine.getSanitizedState(res.room, socket.id);
      if (typeof callback === 'function') {
        callback({ success: true, roomCode: res.room.code, state });
      }
      engine.broadcastState(res.room);
    } catch (err) {
      console.error('Error al unirse a sala:', err);
      if (typeof callback === 'function') callback({ error: 'Error al unirse a la sala.' });
    }
  });

  // ACTUALIZAR PERFIL (NOMBRE/AVATAR)
  socket.on('update_profile', ({ name, avatar }) => {
    const room = engine.updatePlayerProfile(socket.id, name, avatar);
    if (room) engine.broadcastState(room);
  });

  // ACTUALIZAR CONFIGURACIÓN DE PARTIDA
  socket.on('update_settings', (settings) => {
    const room = engine.updateSettings(socket.id, settings);
    if (room) engine.broadcastState(room);
  });

  // INICIAR PARTIDA
  socket.on('start_game', (callback) => {
    const res = engine.startGame(socket.id);
    if (res.error) {
      if (typeof callback === 'function') callback({ error: res.error });
      return;
    }
    if (typeof callback === 'function') callback({ success: true });
    engine.broadcastState(res.room);
  });

  // JUGADOR LISTO TRAS REVELAR ROL
  socket.on('role_ready', () => {
    const room = engine.playerReadyForClues(socket.id);
    if (room) engine.broadcastState(room);
  });

  // FORZAR INICIO DE PISTAS (HOST)
  socket.on('force_start_clues', () => {
    const room = engine.getRoomByPlayerId(socket.id);
    if (room && room.hostId === socket.id && room.state === 'ROLE_REVEAL') {
      engine.startCluesRound(room.code);
    }
  });

  // ENVIAR PISTA
  socket.on('submit_clue', ({ clueText }, callback) => {
    const res = engine.submitClue(socket.id, clueText);
    if (res?.error) {
      if (typeof callback === 'function') callback({ error: res.error });
      return;
    }
    if (typeof callback === 'function') callback({ success: true });
  });

  // SALTAR TURNO DE PISTA
  socket.on('skip_clue_turn', () => {
    const room = engine.getRoomByPlayerId(socket.id);
    if (room && room.state === 'CLUES') {
      const currentTurnPlayerId = room.turnOrder[room.currentTurnIndex];
      if (currentTurnPlayerId === socket.id || room.hostId === socket.id) {
        engine.advanceTurn(room.code);
      }
    }
  });

  // EMITIR VOTO
  socket.on('cast_vote', ({ targetPlayerId }) => {
    const room = engine.castVote(socket.id, targetPlayerId);
    if (room) engine.broadcastState(room);
  });

  // FORZAR CIERRE DE VOTACIÓN (HOST)
  socket.on('force_resolve_voting', () => {
    engine.forceResolveVoting(socket.id);
  });

  // ADIVINANZA DEL IMPOSTOR
  socket.on('submit_impostor_guess', ({ guessedName }, callback) => {
    const res = engine.submitImpostorGuess(socket.id, guessedName);
    if (res?.error) {
      if (typeof callback === 'function') callback({ error: res.error });
      return;
    }
    if (typeof callback === 'function') callback({ success: true });
  });

  // REVANCHA
  socket.on('rematch', () => {
    const room = engine.rematch(socket.id);
    if (room) engine.broadcastState(room);
  });

  // SALIR DE SALA
  socket.on('leave_room', () => {
    const room = engine.leaveRoom(socket.id);
    socket.leave(room?.code);
    if (room) engine.broadcastState(room);
  });

  // DESCONEXIÓN
  socket.on('disconnect', () => {
    console.log(`[Socket desconectado] ${socket.id}`);
    const room = engine.handleDisconnect(socket.id);
    if (room) engine.broadcastState(room);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`[Servidor Impostor Futbol] Corriendo en:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`=============================================`);
});
