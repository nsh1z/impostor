import { getRandomPlayer, checkGuess, getAllPlayerNames } from './playersData.js';

// Estructura en memoria de salas
const rooms = new Map();
const playerToRoom = new Map();
const roomTimers = new Map();

// Alfabeto legible para códigos de sala
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function clearTimer(roomCode) {
  if (roomTimers.has(roomCode)) {
    clearInterval(roomTimers.get(roomCode));
    roomTimers.delete(roomCode);
  }
}

export class GameEngine {
  constructor(io) {
    this.io = io;
  }

  getRoom(roomCode) {
    return rooms.get(roomCode?.toUpperCase());
  }

  getRoomByPlayerId(socketId) {
    const code = playerToRoom.get(socketId);
    return code ? rooms.get(code) : null;
  }

  createRoom(socketId, playerName, avatar) {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      hostId: socketId,
      state: 'LOBBY', // 'LOBBY' | 'ROLE_REVEAL' | 'CLUES' | 'VOTING' | 'RESULTS' | 'IMPOSTOR_GUESS' | 'GAME_OVER'
      settings: {
        clueTime: 35, // segundos por turno de pista
        votingTime: 40, // segundos para votar
        clueRounds: 1, // 1 ronda de pistas
        hintsEnabled: true // Pistas tácticas para el impostor
      },
      players: [
        {
          id: socketId,
          name: playerName.trim().substring(0, 16) || 'Capitán 1',
          avatar: avatar || 'shirt-10',
          isHost: true,
          connected: true,
          ready: false,
          isImpostor: false,
          score: 0
        }
      ],
      recentPlayerIds: [],
      secretPlayer: null,
      impostorId: null,
      turnOrder: [],
      currentTurnIndex: 0,
      turnTimeLeft: 0,
      currentRound: 1,
      cluesHistory: [],
      votes: {},
      votingTimeLeft: 0,
      votingResult: null,
      guessTimeLeft: 0,
      impostorGuess: null,
      winner: null,
      winReason: ''
    };

    rooms.set(roomCode, room);
    playerToRoom.set(socketId, roomCode);
    return room;
  }

  joinRoom(roomCode, socketId, playerName, avatar) {
    const code = roomCode.toUpperCase().trim();
    const room = rooms.get(code);

    if (!room) {
      return { error: 'No se encontró la sala con ese código.' };
    }

    if (room.state !== 'LOBBY') {
      return { error: 'La partida ya comenzó. Espera a que termine.' };
    }

    if (room.players.length >= 10) {
      return { error: 'La sala está completa (máximo 10 jugadores).' };
    }

    // Comprobar si el socket ya está en la sala
    const existing = room.players.find(p => p.id === socketId);
    if (existing) {
      existing.connected = true;
      existing.name = playerName.trim().substring(0, 16) || existing.name;
      existing.avatar = avatar || existing.avatar;
    } else {
      room.players.push({
        id: socketId,
        name: playerName.trim().substring(0, 16) || `Jugador ${room.players.length + 1}`,
        avatar: avatar || 'shirt-7',
        isHost: false,
        connected: true,
        ready: false,
        isImpostor: false,
        score: 0
      });
    }

    playerToRoom.set(socketId, code);
    return { room };
  }

  updatePlayerProfile(socketId, name, avatar) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room) return null;
    const player = room.players.find(p => p.id === socketId);
    if (!player) return null;

    if (name) player.name = name.trim().substring(0, 16);
    if (avatar) player.avatar = avatar;
    return room;
  }

  updateSettings(socketId, newSettings) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.hostId !== socketId || room.state !== 'LOBBY') return null;

    if (newSettings.clueTime && newSettings.clueTime >= 20 && newSettings.clueTime <= 90) {
      room.settings.clueTime = newSettings.clueTime;
    }
    if (newSettings.votingTime && newSettings.votingTime >= 20 && newSettings.votingTime <= 90) {
      room.settings.votingTime = newSettings.votingTime;
    }
    if (newSettings.clueRounds && [1, 2].includes(newSettings.clueRounds)) {
      room.settings.clueRounds = newSettings.clueRounds;
    }
    if (newSettings.hintsEnabled !== undefined) {
      room.settings.hintsEnabled = Boolean(newSettings.hintsEnabled);
    }
    return room;
  }

  handleDisconnect(socketId) {
    const roomCode = playerToRoom.get(socketId);
    if (!roomCode) return null;

    const room = rooms.get(roomCode);
    if (!room) {
      playerToRoom.delete(socketId);
      return null;
    }

    const player = room.players.find(p => p.id === socketId);
    if (player) {
      player.connected = false;
    }

    // Si la sala está en LOBBY y el host se va, pasar host al siguiente conectado
    if (room.hostId === socketId) {
      const nextHost = room.players.find(p => p.connected && p.id !== socketId);
      if (nextHost) {
        nextHost.isHost = true;
        room.hostId = nextHost.id;
      }
    }

    // Si ya no queda nadie conectado, limpiar la sala tras 30 segundos
    const anyConnected = room.players.some(p => p.connected);
    if (!anyConnected) {
      setTimeout(() => {
        const check = rooms.get(roomCode);
        if (check && !check.players.some(p => p.connected)) {
          clearTimer(roomCode);
          rooms.delete(roomCode);
        }
      }, 30000);
    }

    return room;
  }

  leaveRoom(socketId) {
    const roomCode = playerToRoom.get(socketId);
    if (!roomCode) return null;

    const room = rooms.get(roomCode);
    playerToRoom.delete(socketId);

    if (!room) return null;

    // Remover al jugador
    room.players = room.players.filter(p => p.id !== socketId);

    if (room.players.length === 0) {
      clearTimer(roomCode);
      rooms.delete(roomCode);
      return null;
    }

    // Reasignar host si era el host
    if (room.hostId === socketId && room.players.length > 0) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }

    // Si estábamos en partida y quedan menos de 3, volver a LOBBY
    if (room.state !== 'LOBBY' && room.players.length < 3) {
      clearTimer(roomCode);
      room.state = 'LOBBY';
      room.winner = null;
      room.winReason = 'Partida cancelada: menos de 3 jugadores disponibles.';
    }

    return room;
  }

  // INICIAR PARTIDA
  startGame(socketId) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room) return { error: 'Sala no encontrada.' };
    if (room.hostId !== socketId) return { error: 'Solo el anfitrión puede iniciar el partido.' };

    const activePlayers = room.players.filter(p => p.connected);
    if (activePlayers.length < 3) {
      return { error: 'Se necesitan al menos 3 jugadores para comenzar el partido.' };
    }

    clearTimer(room.code);

    // Seleccionar futbolista secreto que no se haya jugado recientemente
    const secret = getRandomPlayer(room.recentPlayerIds);
    room.secretPlayer = secret;
    room.recentPlayerIds.push(secret.id);
    if (room.recentPlayerIds.length > 8) {
      room.recentPlayerIds.shift();
    }

    // Elegir aleatoriamente al Impostor
    const impostorIndex = Math.floor(Math.random() * activePlayers.length);
    const chosenImpostor = activePlayers[impostorIndex];
    room.impostorId = chosenImpostor.id;

    // Asignar banderas en los jugadores
    room.players.forEach(p => {
      p.isImpostor = (p.id === room.impostorId);
      p.ready = false;
    });

    // Barajar orden de turnos para las pistas
    const shuffledOrder = [...activePlayers.map(p => p.id)].sort(() => Math.random() - 0.5);
    room.turnOrder = shuffledOrder;
    room.currentTurnIndex = 0;
    room.currentRound = 1;
    room.cluesHistory = [];
    room.votes = {};
    room.votingResult = null;
    room.impostorGuess = null;
    room.winner = null;
    room.winReason = '';

    // Pasar al estado de Revelación de Rol
    room.state = 'ROLE_REVEAL';

    return { room };
  }

  // JUGADOR CONFIRMA QUE VIO SU ROL
  playerReadyForClues(socketId) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.state !== 'ROLE_REVEAL') return null;

    const player = room.players.find(p => p.id === socketId);
    if (player) {
      player.ready = true;
    }

    // Si todos los jugadores conectados están listos, iniciar la ronda de pistas
    const allReady = room.players.filter(p => p.connected).every(p => p.ready);
    if (allReady) {
      this.startCluesRound(room.code);
    }

    return room;
  }

  // FORZAR INICIO DE PISTAS (POR EL HOST O TEMPORIZADOR)
  startCluesRound(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room) return;

    clearTimer(room.code);
    room.state = 'CLUES';
    room.currentTurnIndex = 0;
    room.turnTimeLeft = room.settings.clueTime;

    this.runTurnTimer(room);
    this.broadcastState(room);
  }

  runTurnTimer(room) {
    clearTimer(room.code);
    room.turnTimeLeft = room.settings.clueTime;

    const interval = setInterval(() => {
      room.turnTimeLeft -= 1;

      if (room.turnTimeLeft <= 0) {
        // Pasar al siguiente turno automáticamente
        this.advanceTurn(room.code);
      } else {
        // Emitir pulso de tiempo cada segundo
        this.io.to(room.code).emit('turn_timer_tick', { timeLeft: room.turnTimeLeft });
      }
    }, 1000);

    roomTimers.set(room.code, interval);
  }

  // ENVIAR PISTA (OPCIONAL O POR TEXTO) Y PASAR TURNO
  submitClue(socketId, clueText) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.state !== 'CLUES') return null;

    const currentTurnPlayerId = room.turnOrder[room.currentTurnIndex];
    if (currentTurnPlayerId !== socketId && room.hostId !== socketId) {
      return { error: 'No es tu turno de hablar.' };
    }

    const speaker = room.players.find(p => p.id === currentTurnPlayerId);
    if (clueText && clueText.trim().length > 0) {
      room.cluesHistory.push({
        playerId: currentTurnPlayerId,
        playerName: speaker ? speaker.name : 'Jugador',
        avatar: speaker ? speaker.avatar : 'shirt-10',
        text: clueText.trim().substring(0, 120),
        timestamp: Date.now()
      });
    }

    this.advanceTurn(room.code);
    return room;
  }

  advanceTurn(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room || room.state !== 'CLUES') return;

    room.currentTurnIndex += 1;

    // Si terminaron todos los jugadores de la ronda
    if (room.currentTurnIndex >= room.turnOrder.length) {
      if (room.currentRound < room.settings.clueRounds) {
        // Siguiente ronda de pistas
        room.currentRound += 1;
        room.currentTurnIndex = 0;
        this.runTurnTimer(room);
        this.broadcastState(room);
      } else {
        // Fin de pistas -> Iniciar Votación VAR
        this.startVotingPhase(room);
      }
    } else {
      this.runTurnTimer(room);
      this.broadcastState(room);
    }
  }

  // FASE DE VOTACIÓN (VAR)
  startVotingPhase(room) {
    clearTimer(room.code);
    room.state = 'VOTING';
    room.votes = {};
    room.votingTimeLeft = null; // Sin límite de tiempo: debate libre
    this.broadcastState(room);
  }

  // Cerrar votación manualmente (solo host)
  forceResolveVoting(socketId) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.state !== 'VOTING') return;
    if (room.hostId !== socketId) return;
    this.resolveVoting(room.code);
  }

  castVote(socketId, targetPlayerId) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.state !== 'VOTING') return null;

    // Registrar voto (puede cambiar su voto antes de que termine)
    room.votes[socketId] = targetPlayerId;

    // Notificar quién ya votó (sin decir a quién) para generar expectativa
    const votedPlayerIds = Object.keys(room.votes);
    this.io.to(room.code).emit('vote_recorded', {
      votedPlayerIds,
      totalExpected: room.players.filter(p => p.connected).length
    });

    // Si todos los conectados votaron, resolver inmediatamente
    const activeCount = room.players.filter(p => p.connected).length;
    if (votedPlayerIds.length >= activeCount) {
      this.resolveVoting(room.code);
    }

    return room;
  }

  resolveVoting(roomCode) {
    const room = this.getRoom(roomCode);
    if (!room || room.state !== 'VOTING') return;

    clearTimer(room.code);

    // Contar votos
    const counts = {};
    room.players.forEach(p => {
      counts[p.id] = 0;
    });

    Object.values(room.votes).forEach(targetId => {
      if (counts[targetId] !== undefined) {
        counts[targetId] += 1;
      }
    });

    // Encontrar el jugador más votado
    let maxVotes = 0;
    let mostVotedPlayers = [];
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVotedPlayers = [id];
      } else if (count === maxVotes && count > 0) {
        mostVotedPlayers.push(id);
      }
    });

    const isTie = mostVotedPlayers.length !== 1 || maxVotes === 0;
    const eliminatedId = !isTie ? mostVotedPlayers[0] : null;
    const isImpostorCaught = eliminatedId === room.impostorId;

    room.votingResult = {
      votesCount: counts,
      eliminatedId,
      isTie,
      isImpostorCaught
    };

    room.state = 'RESULTS';
    this.broadcastState(room);

    // Tras 6 segundos de mostrar los resultados de la votación
    setTimeout(() => {
      const currentRoom = this.getRoom(roomCode);
      if (!currentRoom || currentRoom.state !== 'RESULTS') return;

      if (isImpostorCaught) {
        // El impostor fue descubierto -> Darle la última oportunidad de adivinar el jugador
        this.startImpostorGuessPhase(currentRoom);
      } else {
        // Los inocentes votaron a un inocente o hubo empate: El impostor gana
        currentRoom.state = 'GAME_OVER';
        currentRoom.winner = 'IMPOSTOR';
        currentRoom.winReason = isTie
          ? 'Hubo empate en la votación: El impostor sobrevivió y se llevó la victoria.'
          : '¡Votaron a un inocente! El impostor logró engañar a todos y se lleva la copa.';
        this.broadcastState(currentRoom);
      }
    }, 6000);
  }

  // FASE DE ÚLTIMA OPORTUNIDAD PARA EL IMPOSTOR
  startImpostorGuessPhase(room) {
    clearTimer(room.code);
    room.state = 'IMPOSTOR_GUESS';
    room.guessTimeLeft = 30;

    const interval = setInterval(() => {
      room.guessTimeLeft -= 1;

      if (room.guessTimeLeft <= 0) {
        // Se acabó el tiempo del impostor -> Ganan los inocentes
        clearTimer(room.code);
        room.state = 'GAME_OVER';
        room.winner = 'INNOCENTS';
        room.winReason = '¡El impostor fue descubierto y se le agotó el tiempo para adivinar!';
        this.broadcastState(room);
      } else {
        this.io.to(room.code).emit('guess_timer_tick', { timeLeft: room.guessTimeLeft });
      }
    }, 1000);

    roomTimers.set(room.code, interval);
    this.broadcastState(room);
  }

  // ENVÍO DE LA PREDICCIÓN DEL IMPOSTOR
  submitImpostorGuess(socketId, guessedName) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room || room.state !== 'IMPOSTOR_GUESS') return null;

    if (socketId !== room.impostorId) {
      return { error: 'Solo el impostor puede adivinar en esta fase.' };
    }

    clearTimer(room.code);
    room.impostorGuess = guessedName;

    const isCorrect = checkGuess(guessedName, room.secretPlayer);

    room.state = 'GAME_OVER';
    if (isCorrect) {
      room.winner = 'IMPOSTOR';
      room.winReason = `¡El impostor descubrió que el futbolista era ${room.secretPlayer.name} y se roba la victoria en el último minuto!`;
    } else {
      room.winner = 'INNOCENTS';
      room.winReason = `¡El impostor fue descubierto y falló su predicción (dijo "${guessedName}"). ¡Victoria justa de los inocentes!`;
    }

    this.broadcastState(room);
    return room;
  }

  // REVANCHA (REINICIAR CON LOS MISMOS JUGADORES)
  rematch(socketId) {
    const room = this.getRoomByPlayerId(socketId);
    if (!room) return null;

    clearTimer(room.code);

    // Devolver al estado LOBBY
    room.state = 'LOBBY';
    room.secretPlayer = null;
    room.impostorId = null;
    room.turnOrder = [];
    room.currentTurnIndex = 0;
    room.currentRound = 1;
    room.cluesHistory = [];
    room.votes = {};
    room.votingResult = null;
    room.impostorGuess = null;
    room.winner = null;
    room.winReason = '';

    room.players.forEach(p => {
      p.isImpostor = false;
      p.ready = false;
    });

    this.broadcastState(room);
    return room;
  }

  // OBTENER ESTADO SANITIZADO Y SEGURO PARA CADA JUGADOR INDIVIDUAL
  getSanitizedState(room, socketId) {
    if (!room) return null;

    const me = room.players.find(p => p.id === socketId);
    const isImpostor = me ? me.isImpostor : false;

    // Lista de jugadores sin filtrar el rol a menos que haya terminado el juego
    const sanitizedPlayers = room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isHost: p.isHost,
      connected: p.connected,
      ready: p.ready,
      // Solo revelar si es impostor en GAME_OVER
      isImpostor: room.state === 'GAME_OVER' ? p.isImpostor : undefined
    }));

    // Determinar qué rol y datos del futbolista ve este socket
    let role = null;
    let secretPlayer = null;
    let impostorHint = null;

    if (room.state !== 'LOBBY') {
      const hintsActive = room.settings?.hintsEnabled !== false;
      if (room.state === 'GAME_OVER') {
        // En GAME_OVER todos ven el nombre
        role = isImpostor ? 'IMPOSTOR' : 'INNOCENT';
        secretPlayer = room.secretPlayer ? { name: room.secretPlayer.name } : null;
        // Solo el impostor tiene la pista si están activadas
        impostorHint = isImpostor && hintsActive ? (room.secretPlayer?.hint || null) : null;
      } else {
        // Durante la partida: SEGURIDAD CRIPTO-GRÁFICA
        if (isImpostor) {
          role = 'IMPOSTOR';
          secretPlayer = null; // El impostor NO recibe el nombre
          // SOLO EL IMPOSTOR TIENE LA PISTA (SI ESTÁN ACTIVADAS)
          impostorHint = hintsActive ? (room.secretPlayer?.hint || null) : null;
        } else {
          role = 'INNOCENT';
          // SOLO EL NOMBRE: NINGÚN DATO ADICIONAL A NADIE
          secretPlayer = { name: room.secretPlayer.name };
          impostorHint = null; // Inocentes NO tienen la pista
        }
      }
    }

    return {
      code: room.code,
      state: room.state,
      settings: room.settings,
      players: sanitizedPlayers,
      me: me ? {
        id: me.id,
        name: me.name,
        avatar: me.avatar,
        isHost: me.isHost,
        role: role
      } : null,
      secretPlayer: secretPlayer, // null para el impostor
      impostorHint: impostorHint, // Pista táctica exclusiva del impostor
      impostorId: room.state === 'GAME_OVER' ? room.impostorId : null,
      turnOrder: room.turnOrder,
      currentTurnIndex: room.currentTurnIndex,
      turnTimeLeft: room.turnTimeLeft,
      currentRound: room.currentRound,
      cluesHistory: room.cluesHistory,
      votedPlayerIds: Object.keys(room.votes),
      votingResult: room.votingResult,
      votingTimeLeft: room.votingTimeLeft,
      guessTimeLeft: room.guessTimeLeft,
      impostorGuess: room.impostorGuess,
      winner: room.winner,
      winReason: room.winReason
    };
  }

  // EMITIR ESTADO SANITIZADO A CADA SOCKET CONECTADO DE LA SALA
  broadcastState(room) {
    if (!room) return;
    room.players.forEach(player => {
      if (player.connected) {
        const payload = this.getSanitizedState(room, player.id);
        this.io.to(player.id).emit('game_state', payload);
      }
    });
  }
}
