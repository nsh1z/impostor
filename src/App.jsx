import React, { useState, useEffect } from 'react';
import { socket } from './services/socket';
import { soundFx } from './services/soundFx';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Lobby from './components/Lobby';
import RoleReveal from './components/RoleReveal';
import ClueRound from './components/ClueRound';
import VotingRound from './components/VotingRound';
import ResultsRound from './components/ResultsRound';
import ImpostorGuessModal from './components/ImpostorGuessModal';
import GameOver from './components/GameOver';
import HowToPlayModal from './components/HowToPlayModal';

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      console.log('[App] Conectado al servidor WebSocket');
      setIsConnected(true);
      setErrorMsg('');
    };

    const handleDisconnect = (reason) => {
      console.log('[App] Desconectado del servidor WebSocket:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (err) => {
      console.warn('[App] Error de conexión Socket:', err);
      setIsConnected(false);
    };

    const handleGameState = (state) => {
      console.log('[App] Estado de juego recibido:', state?.state);
      setGameState(state);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('game_state', handleGameState);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('game_state', handleGameState);
    };
  }, []);

  // Acciones de Socket con timeout de seguridad (evita quedar colgado en "Conectando...")
  const handleCreateRoom = (name, avatar, onDone) => {
    setErrorMsg('');

    if (!socket.connected) {
      socket.connect();
    }

    let finished = false;
    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true;
        if (onDone) onDone();
        setErrorMsg('El servidor no respondió a tiempo. Verifica que el servidor esté activo en http://localhost:3000.');
      }
    }, 4500);

    socket.emit('create_room', { name, avatar }, (res) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      if (onDone) onDone();

      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.state) {
        setGameState(res.state);
      }
    });
  };

  const handleJoinRoom = (roomCode, name, avatar, onDone) => {
    setErrorMsg('');

    if (!socket.connected) {
      socket.connect();
    }

    let finished = false;
    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true;
        if (onDone) onDone();
        setErrorMsg('El servidor no respondió a tiempo. Comprueba el código o si el servidor está activo.');
      }
    }, 4500);

    socket.emit('join_room', { roomCode, name, avatar }, (res) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      if (onDone) onDone();

      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.state) {
        setGameState(res.state);
      }
    });
  };

  const handleUpdateProfile = (name, avatar) => {
    socket.emit('update_profile', { name, avatar });
  };

  const handleUpdateSettings = (settings) => {
    socket.emit('update_settings', settings);
  };

  const handleStartGame = () => {
    setErrorMsg('');
    socket.emit('start_game', (res) => {
      if (res?.error) {
        setErrorMsg(res.error);
        alert(res.error);
      }
    });
  };

  const handleRoleReady = () => {
    socket.emit('role_ready');
  };

  const handleForceStartClues = () => {
    socket.emit('force_start_clues');
  };

  const handleSubmitClue = (clueText) => {
    socket.emit('submit_clue', { clueText }, (res) => {
      if (res?.error) alert(res.error);
    });
  };

  const handleSkipTurn = () => {
    socket.emit('skip_clue_turn');
  };

  const handleCastVote = (targetPlayerId) => {
    socket.emit('cast_vote', { targetPlayerId });
  };

  const handleSubmitImpostorGuess = (guessedName) => {
    socket.emit('submit_impostor_guess', { guessedName }, (res) => {
      if (res?.error) alert(res.error);
    });
  };

  const handleRematch = () => {
    socket.emit('rematch');
  };

  const handleLeaveRoom = () => {
    socket.emit('leave_room');
    setGameState(null);
  };

  // Renderizar la pantalla correspondiente
  const renderScreen = () => {
    if (!gameState || !gameState.code) {
      return (
        <Home
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onOpenHelp={() => setShowHelp(true)}
          errorMsg={errorMsg}
          isConnected={isConnected}
        />
      );
    }

    switch (gameState.state) {
      case 'LOBBY':
        return (
          <Lobby
            gameState={gameState}
            onStartGame={handleStartGame}
            onUpdateProfile={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
          />
        );

      case 'ROLE_REVEAL':
        return (
          <RoleReveal
            gameState={gameState}
            onReady={handleRoleReady}
            onForceStart={handleForceStartClues}
          />
        );

      case 'CLUES':
        return (
          <ClueRound
            gameState={gameState}
            onSubmitClue={handleSubmitClue}
            onSkipTurn={handleSkipTurn}
          />
        );

      case 'VOTING':
        return (
          <VotingRound
            gameState={gameState}
            onCastVote={handleCastVote}
          />
        );

      case 'RESULTS':
        return (
          <ResultsRound
            gameState={gameState}
          />
        );

      case 'IMPOSTOR_GUESS':
        return (
          <ImpostorGuessModal
            gameState={gameState}
            onSubmitGuess={handleSubmitImpostorGuess}
          />
        );

      case 'GAME_OVER':
        return (
          <GameOver
            gameState={gameState}
            onRematch={handleRematch}
          />
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center text-white font-mono-sport text-xs">
            Cargando estado del partido...
          </div>
        );
    }
  };

  return (
    <div className="stadium-bg min-h-[100dvh] text-white flex flex-col relative overflow-hidden">
      {/* Barra de Navegación Flotante */}
      <Navbar
        gameState={gameState}
        onLeaveRoom={gameState ? handleLeaveRoom : null}
        isConnected={isConnected}
      />

      {/* Pantalla Activa */}
      <main className="flex-1 flex flex-col justify-center">
        {renderScreen()}
      </main>

      {/* Modal de Reglas */}
      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
