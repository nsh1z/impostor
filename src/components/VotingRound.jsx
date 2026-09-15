import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTv,
  faClock,
  faCheck,
  faUserSecret,
  faShieldHalved,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon from './FootballIcon';
import { soundFx } from '../services/soundFx';

export default function VotingRound({ gameState, onCastVote }) {
  const [selectedTargetId, setSelectedTargetId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(gameState?.votingTimeLeft || 40);

  const myId = gameState?.me?.id;
  const connectedPlayers = gameState?.players?.filter(p => p.connected) || [];
  const candidates = connectedPlayers;
  const votedPlayerIds = gameState?.votedPlayerIds || [];
  const hasVoted = selectedTargetId !== null;

  useEffect(() => {
    if (gameState?.votingTimeLeft !== undefined) {
      setTimeLeft(gameState.votingTimeLeft);
    }
  }, [gameState?.votingTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      soundFx.tick();
    }
  }, [timeLeft]);

  const handleVote = (targetId) => {
    soundFx.alarm();
    setSelectedTargetId(targetId);
    onCastVote(targetId);
  };

  const maxTime = gameState?.settings?.votingTime || 40;
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative select-none">
      {/* Luz focal roja de VAR */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-4">
        {/* Banner de VAR (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-6 sm:p-7 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 ring-1 ring-red-500/30 text-red-400 text-[10px] font-mono-sport font-black uppercase tracking-widest mb-2.5">
              <FontAwesomeIcon icon={faTv} className="w-3 h-3" />
              <span>REVISIÓN OFICIAL EN EL VAR</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
              ¿Quién es el Impostor?
            </h1>

            <p className="text-xs text-white/50 mt-1 max-w-md mx-auto">
              Emite tu voto secreto. Si la sala acusa a un inocente, el impostor gana el partido.
            </p>

            {/* Temporizador */}
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/50 ring-1 ring-white/10">
              <FontAwesomeIcon
                icon={faClock}
                className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-amber-400'}`}
              />
              <span className="font-mono-sport text-base font-black text-white">
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Progreso de votos */}
            <div className="mt-3 text-xs text-white/40 font-mono-sport">
              Votos computados: <span className="text-[#00ff88] font-bold">{votedPlayerIds.length}</span> / {connectedPlayers.length}
            </div>
          </div>
        </div>

        {/* Grid de Candidatos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {candidates.map((player) => {
            const isMe = player.id === myId;
            const isSelected = selectedTargetId === player.id;
            const alreadyVoted = votedPlayerIds.includes(player.id);

            return (
              <div
                key={player.id}
                onClick={() => !isMe && handleVote(player.id)}
                className={`bezel-card transition-all duration-200 transform ${
                  isSelected
                    ? 'ring-2 ring-red-500 scale-[1.01] shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                    : isMe
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:scale-[1.008]'
                }`}
              >
                <div className={`bezel-inner p-4 flex items-center justify-between ${isSelected ? 'bg-red-950/40' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-black/40 ring-1 ring-white/10 flex items-center justify-center">
                      <FootballIcon avatarId={player.avatar} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          {player.name}
                        </span>
                        {isMe && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-mono-sport font-black bg-white/10 text-white/60">
                            Tú
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5 font-mono-sport">
                        {alreadyVoted ? 'Voto emitido' : 'Analizando sospechas...'}
                      </span>
                    </div>
                  </div>

                  {/* Estado / Botón */}
                  <div>
                    {isMe ? (
                      <span className="text-[9px] font-mono-sport text-white/30 uppercase">
                        Propio
                      </span>
                    ) : isSelected ? (
                      <div className="px-3 py-1.5 rounded-full bg-red-500 text-white font-heading font-black text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                        <span>Acusado</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-tactile px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-red-500/20 ring-1 ring-white/10 hover:ring-red-500/40 text-xs font-semibold text-white/80 transition-all flex items-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faUserSecret} className="w-3 h-3 text-red-400" />
                        <span>Sospechar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notificación de Voto Emitido */}
        {hasVoted && (
          <div className="p-3.5 rounded-2xl bg-[#00ff88]/10 ring-1 ring-[#00ff88]/30 flex items-center justify-center gap-2 text-xs text-[#00ff88] text-center font-medium animate-fade-in font-mono-sport">
            <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 shrink-0" />
            <span>Voto registrado. Puedes modificar tu acusación antes de que expire el cronómetro.</span>
          </div>
        )}
      </div>
    </div>
  );
}
