import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faPaperPlane,
  faMicrophone,
  faForward,
  faComments,
  faShieldHalved,
  faUserSecret,
  faLightbulb,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon from './FootballIcon';
import { soundFx } from '../services/soundFx';

export default function ClueRound({ gameState, onSubmitClue, onSkipTurn }) {
  const [clueText, setClueText] = useState('');
  const [timeLeft, setTimeLeft] = useState(gameState?.turnTimeLeft || 35);

  const currentTurnId = gameState?.turnOrder?.[gameState?.currentTurnIndex];
  const isMyTurn = currentTurnId === gameState?.me?.id;
  const isHost = gameState?.me?.isHost;
  const role = gameState?.me?.role;
  const isImpostor = role === 'IMPOSTOR';
  const secretPlayer = gameState?.secretPlayer;
  const impostorHint = gameState?.impostorHint;

  const currentSpeaker = gameState?.players?.find(p => p.id === currentTurnId);
  const totalTurns = gameState?.turnOrder?.length || 1;
  const currentStep = (gameState?.currentTurnIndex || 0) + 1;

  useEffect(() => {
    if (gameState?.turnTimeLeft !== undefined) {
      setTimeLeft(gameState.turnTimeLeft);
    }
  }, [gameState?.turnTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      soundFx.tick();
    }
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.click();
    if (isMyTurn && clueText.trim()) {
      onSubmitClue(clueText.trim());
      setClueText('');
    }
  };

  const handlePassVoiceClue = () => {
    soundFx.click();
    onSubmitClue(clueText.trim() || 'Pista dada en voz alta en la cancha');
    setClueText('');
  };

  const maxTime = gameState?.settings?.clueTime || 35;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative">
      <div className="w-full max-w-2xl relative z-10 space-y-4">
        {/* Banner Superior: Turno y Cronómetro (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Información del Turno */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-black/50 ring-1 ring-white/10 flex items-center justify-center text-white">
                  <FootballIcon avatarId={currentSpeaker?.avatar} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-sport font-black uppercase text-[#00ff88] tracking-widest">
                      TURNO {currentStep} DE {totalTurns}
                    </span>
                    {isMyTurn && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-sport font-black uppercase bg-[#00ff88] text-black animate-pulse">
                        ¡ES TU TURNO!
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-heading font-black text-white uppercase tracking-wide mt-0.5">
                    {isMyTurn ? 'Te toca dar tu pista' : `Habla: ${currentSpeaker?.name || 'Jugador'}`}
                  </h2>
                </div>
              </div>

              {/* Cronómetro con Barra Progresiva */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/50 ring-1 ring-white/10">
                <FontAwesomeIcon
                  icon={faClock}
                  className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-[#00ff88]'}`}
                />
                <div className="text-right">
                  <div className="font-mono-sport text-lg font-black tracking-widest text-white">
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </div>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft <= 5 ? 'bg-red-500' : 'bg-[#00ff88]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Fila Inferior: Rol y Datos Confidenciales en Vivo */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {isImpostor ? (
                  <div className="flex items-center gap-2 text-red-400 font-semibold">
                    <FontAwesomeIcon icon={faUserSecret} className="w-3.5 h-3.5" />
                    <span>Eres el Impostor</span>
                    {impostorHint && (
                      <span className="ml-1 px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-mono-sport text-[11px] font-black">
                        Pista: {impostorHint}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#00ff88] font-semibold">
                    <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
                    <span>Futbolista: {secretPlayer?.name}</span>
                  </div>
                )}
              </div>

              {/* Botón para saltar turno si se demora */}
              {(isMyTurn || isHost) && (
                <button
                  onClick={() => {
                    soundFx.click();
                    onSkipTurn();
                  }}
                  className="btn-tactile inline-flex items-center gap-1.5 text-[11px] font-mono-sport uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faForward} className="w-3 h-3" />
                  <span>Pasar turno</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Zona de Acción: Turno Propio vs Turno Rival */}
        {isMyTurn ? (
          <div className="bezel-card animate-fade-in">
            <div className="bezel-inner p-5 sm:p-6 space-y-3.5">
              {/* PISTA TÁCTICA DE APOYO SIEMPRE PRESENTE PARA EL IMPOSTOR */}
              {isImpostor && impostorHint && (
                <div className="p-3 rounded-2xl bg-amber-500/10 ring-1 ring-amber-400/30 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-mono-sport font-black uppercase text-amber-400 text-[10px] tracking-widest">
                      Tu Pista Confidencial:
                    </span>
                  </div>
                  <span className="font-heading font-black text-base sm:text-lg text-amber-300 uppercase tracking-wide">{impostorHint}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-sport font-bold uppercase tracking-[0.15em] text-[#00ff88]">
                  Escribe tu pista o coméntala en voz alta
                </span>
              </div>

              {/* Formulario de Pista */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  maxLength={110}
                  value={clueText}
                  onChange={(e) => setClueText(e.target.value)}
                  placeholder="Ej: Jugó en Europa, zurdo, campeón..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!clueText.trim()}
                  className="btn-tactile group px-5 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#059669] font-heading font-black text-black text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,136,0.25)]"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5 text-black" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>

              {/* Botón rápido si hablan por Discord / Reunión presencial */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handlePassVoiceClue}
                  className="btn-tactile inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] ring-1 ring-white/10 text-xs text-white/70 hover:text-white transition-all"
                >
                  <FontAwesomeIcon icon={faMicrophone} className="w-3 h-3 text-[#00ff88]" />
                  <span>Ya di mi pista por voz / Pasar turno</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bezel-card">
            <div className="bezel-inner p-5 text-center flex items-center justify-center gap-3 text-xs sm:text-sm text-white/70 font-mono-sport">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
              <span>
                Escuchando la pista de <strong className="text-white font-sans">{currentSpeaker?.name}</strong>...
              </span>
            </div>
          </div>
        )}

        {/* Pizarra Táctica / Historial de Pistas */}
        <div className="bezel-card">
          <div className="bezel-inner p-5 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faComments} className="w-3.5 h-3.5 text-[#00ff88]" />
                <h3 className="text-xs font-heading font-black text-white uppercase tracking-wider">
                  Pizarra Táctica ({gameState?.cluesHistory?.length || 0})
                </h3>
              </div>
              <span className="text-[10px] font-mono-sport text-white/40 uppercase">
                Ronda {gameState?.currentRound || 1} de {gameState?.settings?.clueRounds || 1}
              </span>
            </div>

            {gameState?.cluesHistory && gameState.cluesHistory.length > 0 ? (
              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {gameState.cluesHistory.map((clue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-black/40 ring-1 ring-white/10 flex items-center justify-center shrink-0 text-white">
                      <FootballIcon avatarId={clue.avatar} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00ff88]">
                          {clue.playerName}
                        </span>
                        <span className="text-[9px] font-mono-sport text-white/40">
                          {new Date(clue.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mt-1 font-sans leading-relaxed">
                        "{clue.text}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-white/40 font-mono-sport">
                Las pistas formuladas por los jugadores quedarán registradas en esta pizarra.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
