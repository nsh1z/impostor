import React, { useState, useEffect } from 'react';
import { network } from './services/network';
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
import TopPlayersModal from './components/TopPlayersModal';

export default function App() {
  const [gameState, setGameState] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showTopPlayers, setShowTopPlayers] = useState(false);
  const [isConnected, setIsConnected] = useState(network.isConnected());

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setErrorMsg('');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleGameState = (state) => {
      setGameState(state);
    };

    network.on('connect', handleConnect);
    network.on('disconnect', handleDisconnect);
    network.on('game_state', handleGameState);

    return () => {
      network.off('connect', handleConnect);
      network.off('disconnect', handleDisconnect);
      network.off('game_state', handleGameState);
    };
  }, []);

  // Acciones de juego usando la capa unificada de red (Socket.IO o Serverless P2P)
  const handleCreateRoom = (name, avatar, onDone) => {
    setErrorMsg('');
    network.createRoom(name, avatar, (res) => {
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
    network.joinRoom(roomCode, name, avatar, (res) => {
      if (onDone) onDone();
      if (res?.error) {
        setErrorMsg(res.error);
      } else if (res?.state) {
        setGameState(res.state);
      }
    });
  };

  const handleUpdateProfile = (name, avatar) => {
    network.emit('update_profile', { name, avatar });
  };

  const handleUpdateSettings = (settings) => {
    network.emit('update_settings', settings);
  };

  const handleStartGame = () => {
    setErrorMsg('');
    network.emit('start_game', {}, (res) => {
      if (res?.error) {
        setErrorMsg(res.error);
        alert(res.error);
      }
    });
  };

  const handleRoleReady = () => {
    network.emit('role_ready');
  };

  const handleForceStartClues = () => {
    network.emit('force_start_clues');
  };

  const handleSubmitClue = (clueText) => {
    network.emit('submit_clue', { clueText }, (res) => {
      if (res?.error) alert(res.error);
    });
  };

  const handleSkipTurn = () => {
    network.emit('skip_clue_turn');
  };

  const handleCastVote = (targetPlayerId) => {
    network.emit('cast_vote', { targetPlayerId });
  };

  const handleSubmitImpostorGuess = (guessedName) => {
    network.emit('submit_impostor_guess', { guessedName }, (res) => {
      if (res?.error) alert(res.error);
    });
  };

  const handleRematch = () => {
    network.emit('rematch');
  };

  const handleLeaveRoom = () => {
    network.leaveRoom();
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
          onOpenTopPlayers={() => setShowTopPlayers(true)}
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
            onOpenTopPlayers={() => setShowTopPlayers(true)}
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
        onOpenTopPlayers={() => setShowTopPlayers(true)}
      />

      {/* Pantalla Activa */}
      <main className="flex-1 flex flex-col justify-center">
        {renderScreen()}
      </main>

      {/* Modal de Reglas */}
      <HowToPlayModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Modal de Top Jugadores */}
      <TopPlayersModal isOpen={showTopPlayers} onClose={() => setShowTopPlayers(false)} />
    </div>
  );
}
