import { getRandomPlayer, checkGuess } from '../data/playersData.js';

let roomTimers = new Map();

function clearTimer(code) {
  if (roomTimers.has(code)) {
    clearInterval(roomTimers.get(code));
    roomTimers.delete(code);
  }
}

export class ServerlessEngine {
  constructor(broadcastCallback, tickCallback) {
    this.broadcast = broadcastCallback;
    this.tick = tickCallback;
    this.room = null;
  }

  createRoom(hostId, name, avatar, customCode) {
    const code = customCode || Math.random().toString(36).substring(2, 6).toUpperCase();
    this.room = {
      code,
      hostId,
      state: 'LOBBY',
      settings: { clueTime: 35, votingTime: 40, clueRounds: 1, hintsEnabled: true },
      players: [
        {
          id: hostId,
          name: name || 'Capitán',
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
      votingResult: null,
      votingTimeLeft: 0,
      guessTimeLeft: 0,
      impostorGuess: null,
      winner: null,
      winReason: ''
    };
    return this.room;
  }

  joinRoom(playerId, name, avatar) {
    if (!this.room) return { error: 'Sala no iniciada.' };
    if (this.room.state !== 'LOBBY') return { error: 'La partida ya comenzó.' };

    const existing = this.room.players.find(p => p.id === playerId);
    if (existing) {
      existing.connected = true;
      existing.name = name || existing.name;
      existing.avatar = avatar || existing.avatar;
    } else {
      this.room.players.push({
        id: playerId,
        name: name || `Jugador ${this.room.players.length + 1}`,
        avatar: avatar || 'shirt-7',
        isHost: false,
        connected: true,
        ready: false,
        isImpostor: false,
        score: 0
      });
    }

    this.broadcastState();
    return { room: this.room };
  }

  updateSettings(newSettings) {
    if (!this.room || this.room.state !== 'LOBBY') return null;
    if (newSettings.clueTime && newSettings.clueTime >= 20 && newSettings.clueTime <= 90) {
      this.room.settings.clueTime = newSettings.clueTime;
    }
    if (newSettings.votingTime && newSettings.votingTime >= 20 && newSettings.votingTime <= 90) {
      this.room.settings.votingTime = newSettings.votingTime;
    }
    if (newSettings.clueRounds && [1, 2].includes(newSettings.clueRounds)) {
      this.room.settings.clueRounds = newSettings.clueRounds;
    }
    if (newSettings.hintsEnabled !== undefined) {
      this.room.settings.hintsEnabled = Boolean(newSettings.hintsEnabled);
    }
    this.broadcastState();
    return this.room;
  }

  removePlayer(playerId) {
    if (!this.room) return;
    this.room.players = this.room.players.filter(p => p.id !== playerId);
    if (this.room.state !== 'LOBBY' && this.room.players.length < 3) {
      clearTimer(this.room.code);
      this.room.state = 'LOBBY';
      this.room.winReason = 'Partida cancelada: menos de 3 jugadores.';
    }
    this.broadcastState();
  }

  startGame(hostId) {
    if (!this.room) return { error: 'Sala no encontrada.' };
    if (this.room.hostId !== hostId) return { error: 'Solo el anfitrión puede iniciar.' };

    const active = this.room.players.filter(p => p.connected);
    if (active.length < 3) {
      return { error: 'Se necesitan al menos 3 jugadores.' };
    }

    clearTimer(this.room.code);
    const secret = getRandomPlayer(this.room.recentPlayerIds);
    this.room.secretPlayer = secret;
    this.room.recentPlayerIds.push(secret.id);
    if (this.room.recentPlayerIds.length > 8) this.room.recentPlayerIds.shift();

    const impostorIndex = Math.floor(Math.random() * active.length);
    this.room.impostorId = active[impostorIndex].id;

    this.room.players.forEach(p => {
      p.isImpostor = (p.id === this.room.impostorId);
      p.ready = false;
    });

    this.room.turnOrder = [...active.map(p => p.id)].sort(() => Math.random() - 0.5);
    this.room.currentTurnIndex = 0;
    this.room.currentRound = 1;
    this.room.cluesHistory = [];
    this.room.votes = {};
    this.room.votingResult = null;
    this.room.impostorGuess = null;
    this.room.winner = null;
    this.room.winReason = '';

    this.room.state = 'ROLE_REVEAL';
    this.broadcastState();
    return { success: true };
  }

  playerReady(playerId) {
    if (!this.room || this.room.state !== 'ROLE_REVEAL') return;
    const player = this.room.players.find(p => p.id === playerId);
    if (player) player.ready = true;

    const allReady = this.room.players.filter(p => p.connected).every(p => p.ready);
    if (allReady) {
      this.startClues();
    } else {
      this.broadcastState();
    }
  }

  forceStartClues() {
    this.startClues();
  }

  startClues() {
    if (!this.room) return;
    clearTimer(this.room.code);
    this.room.state = 'CLUES';
    this.room.currentTurnIndex = 0;
    this.runTurnTimer();
    this.broadcastState();
  }

  runTurnTimer() {
    clearTimer(this.room.code);
    this.room.turnTimeLeft = this.room.settings.clueTime;

    const timer = setInterval(() => {
      this.room.turnTimeLeft -= 1;
      if (this.room.turnTimeLeft <= 0) {
        this.advanceTurn();
      } else {
        if (this.tick) this.tick('turn_timer_tick', { timeLeft: this.room.turnTimeLeft });
      }
    }, 1000);

    roomTimers.set(this.room.code, timer);
  }

  submitClue(playerId, clueText) {
    if (!this.room || this.room.state !== 'CLUES') return;
    const currentId = this.room.turnOrder[this.room.currentTurnIndex];
    if (currentId !== playerId && this.room.hostId !== playerId) return;

    const speaker = this.room.players.find(p => p.id === currentId);
    if (clueText && clueText.trim()) {
      this.room.cluesHistory.push({
        playerId: currentId,
        playerName: speaker ? speaker.name : 'Jugador',
        avatar: speaker ? speaker.avatar : 'shirt-10',
        text: clueText.trim().substring(0, 120),
        timestamp: Date.now()
      });
    }

    this.advanceTurn();
  }

  advanceTurn() {
    if (!this.room || this.room.state !== 'CLUES') return;
    this.room.currentTurnIndex += 1;

    if (this.room.currentTurnIndex >= this.room.turnOrder.length) {
      if (this.room.currentRound < this.room.settings.clueRounds) {
        this.room.currentRound += 1;
        this.room.currentTurnIndex = 0;
        this.runTurnTimer();
        this.broadcastState();
      } else {
        this.startVoting();
      }
    } else {
      this.runTurnTimer();
      this.broadcastState();
    }
  }

  startVoting() {
    clearTimer(this.room.code);
    this.room.state = 'VOTING';
    this.room.votes = {};
    this.room.votingTimeLeft = this.room.settings.votingTime;

    const timer = setInterval(() => {
      this.room.votingTimeLeft -= 1;
      if (this.room.votingTimeLeft <= 0) {
        this.resolveVoting();
      } else {
        if (this.tick) this.tick('voting_timer_tick', { timeLeft: this.room.votingTimeLeft });
      }
    }, 1000);

    roomTimers.set(this.room.code, timer);
    this.broadcastState();
  }

  castVote(playerId, targetId) {
    if (!this.room || this.room.state !== 'VOTING') return;
    this.room.votes[playerId] = targetId;

    const votedIds = Object.keys(this.room.votes);
    const active = this.room.players.filter(p => p.connected).length;
    this.broadcastState();

    if (votedIds.length >= active) {
      this.resolveVoting();
    }
  }

  resolveVoting() {
    clearTimer(this.room.code);
    const counts = {};
    this.room.players.forEach(p => { counts[p.id] = 0; });
    Object.values(this.room.votes).forEach(id => {
      if (counts[id] !== undefined) counts[id] += 1;
    });

    let maxVotes = 0;
    let mostVoted = [];
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        mostVoted = [id];
      } else if (count === maxVotes && count > 0) {
        mostVoted.push(id);
      }
    });

    const isTie = mostVoted.length !== 1 || maxVotes === 0;
    const eliminatedId = !isTie ? mostVoted[0] : null;
    const isImpostorCaught = eliminatedId === this.room.impostorId;

    this.room.votingResult = {
      votesCount: counts,
      eliminatedId,
      isTie,
      isImpostorCaught
    };

    this.room.state = 'RESULTS';
    this.broadcastState();

    setTimeout(() => {
      if (!this.room || this.room.state !== 'RESULTS') return;
      if (isImpostorCaught) {
        this.startImpostorGuess();
      } else {
        this.room.state = 'GAME_OVER';
        this.room.winner = 'IMPOSTOR';
        this.room.winReason = isTie
          ? 'Empate en los votos: el impostor sobrevive y se lleva la victoria.'
          : '¡Acusaron a un inocente! El impostor engañó a la sala y gana la partida.';
        this.broadcastState();
      }
    }, 6000);
  }

  startImpostorGuess() {
    clearTimer(this.room.code);
    this.room.state = 'IMPOSTOR_GUESS';
    this.room.guessTimeLeft = 30;

    const timer = setInterval(() => {
      this.room.guessTimeLeft -= 1;
      if (this.room.guessTimeLeft <= 0) {
        clearTimer(this.room.code);
        this.room.state = 'GAME_OVER';
        this.room.winner = 'INNOCENTS';
        this.room.winReason = 'El impostor fue descubierto y se le agotó el tiempo para adivinar.';
        this.broadcastState();
      } else {
        if (this.tick) this.tick('guess_timer_tick', { timeLeft: this.room.guessTimeLeft });
      }
    }, 1000);

    roomTimers.set(this.room.code, timer);
    this.broadcastState();
  }

  submitImpostorGuess(playerId, guess) {
    if (!this.room || this.room.state !== 'IMPOSTOR_GUESS') return;
    if (playerId !== this.room.impostorId) return;

    clearTimer(this.room.code);
    this.room.impostorGuess = guess;
    const isCorrect = checkGuess(guess, this.room.secretPlayer);

    this.room.state = 'GAME_OVER';
    if (isCorrect) {
      this.room.winner = 'IMPOSTOR';
      this.room.winReason = `¡El impostor descubrió que el futbolista era ${this.room.secretPlayer.name} y se roba la victoria en el último minuto!`;
    } else {
      this.room.winner = 'INNOCENTS';
      this.room.winReason = `¡El impostor fue descubierto y falló su predicción (dijo "${guess}"). Victoria de los inocentes.`;
    }

    this.broadcastState();
  }

  rematch() {
    if (!this.room) return;
    clearTimer(this.room.code);
    this.room.state = 'LOBBY';
    this.room.secretPlayer = null;
    this.room.impostorId = null;
    this.room.turnOrder = [];
    this.room.currentTurnIndex = 0;
    this.room.currentRound = 1;
    this.room.cluesHistory = [];
    this.room.votes = {};
    this.room.votingResult = null;
    this.room.impostorGuess = null;
    this.room.winner = null;
    this.room.winReason = '';
    this.room.players.forEach(p => {
      p.isImpostor = false;
      p.ready = false;
    });

    this.broadcastState();
  }

  getSanitizedState(playerId) {
    if (!this.room) return null;
    const me = this.room.players.find(p => p.id === playerId);
    const isImpostor = me ? me.isImpostor : false;

    const sanitizedPlayers = this.room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isHost: p.isHost,
      connected: p.connected,
      ready: p.ready,
      isImpostor: this.room.state === 'GAME_OVER' ? p.isImpostor : undefined
    }));

    let role = null;
    let secretPlayer = null;
    let impostorHint = null;

    if (this.room.state !== 'LOBBY') {
      const hintsActive = this.room.settings?.hintsEnabled !== false;
      if (this.room.state === 'GAME_OVER') {
        role = isImpostor ? 'IMPOSTOR' : 'INNOCENT';
        secretPlayer = this.room.secretPlayer ? { name: this.room.secretPlayer.name } : null;
        // Solo el impostor tiene la pista si están activadas
        impostorHint = isImpostor && hintsActive ? (this.room.secretPlayer?.hint || null) : null;
      } else {
        if (isImpostor) {
          role = 'IMPOSTOR';
          secretPlayer = null; // Criptoseguro: el impostor NO recibe el nombre
          // SOLO EL IMPOSTOR TIENE LA PISTA (SI ESTÁN ACTIVADAS)
          impostorHint = hintsActive ? (this.room.secretPlayer?.hint || null) : null;
        } else {
          role = 'INNOCENT';
          // SOLO EL NOMBRE: NINGÚN DATO ADICIONAL A NADIE
          secretPlayer = { name: this.room.secretPlayer.name };
          impostorHint = null; // Inocentes NO tienen la pista
        }
      }
    }

    return {
      code: this.room.code,
      state: this.room.state,
      settings: this.room.settings,
      players: sanitizedPlayers,
      me: me ? {
        id: me.id,
        name: me.name,
        avatar: me.avatar,
        isHost: me.isHost,
        role: role
      } : null,
      secretPlayer,
      impostorHint,
      impostorId: this.room.state === 'GAME_OVER' ? this.room.impostorId : null,
      turnOrder: this.room.turnOrder,
      currentTurnIndex: this.room.currentTurnIndex,
      turnTimeLeft: this.room.turnTimeLeft,
      currentRound: this.room.currentRound,
      cluesHistory: this.room.cluesHistory,
      votedPlayerIds: Object.keys(this.room.votes),
      votingResult: this.room.votingResult,
      votingTimeLeft: this.room.votingTimeLeft,
      guessTimeLeft: this.room.guessTimeLeft,
      impostorGuess: this.room.impostorGuess,
      winner: this.room.winner,
      winReason: this.room.winReason
    };
  }

  broadcastState() {
    if (!this.room || !this.broadcast) return;
    this.broadcast(this);
  }
}
