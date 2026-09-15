import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faBullseye,
  faTriangleExclamation,
  faChartSimple,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon from './FootballIcon';
import { soundFx } from '../services/soundFx';

export default function ResultsRound({ gameState }) {
  const result = gameState?.votingResult;
  const players = gameState?.players || [];

  const eliminatedPlayer = players.find(p => p.id === result?.eliminatedId);
  const isImpostorCaught = result?.isImpostorCaught;
  const isTie = result?.isTie;

  useEffect(() => {
    if (isImpostorCaught) {
      soundFx.alarm();
    } else {
      soundFx.whistle();
    }
  }, [isImpostorCaught]);

  const sortedPlayers = [...players].sort((a, b) => {
    const votesA = result?.votesCount?.[a.id] || 0;
    const votesB = result?.votesCount?.[b.id] || 0;
    return votesB - votesA;
  });

  const totalVotes = Object.values(result?.votesCount || {}).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative select-none">
      {/* Luz focal según veredicto */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none ${
          isImpostorCaught ? 'bg-[#00ff88]/15' : 'bg-red-500/15'
        }`}
      />

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* Banner de Veredicto (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-6 sm:p-7 text-center">
            <span className="text-[10px] uppercase font-mono-sport tracking-[0.2em] text-white/40 font-semibold">
              Resolución Oficial del VAR
            </span>

            {isTie ? (
              <div className="mt-3 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 ring-1 ring-amber-500/40 flex items-center justify-center text-amber-400">
                  <FontAwesomeIcon icon={faScaleBalanced} className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-amber-400 uppercase tracking-tight">
                  Empate en la Votación
                </h1>
                <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                  No hubo mayoría contra ningún sospechoso. El impostor evade la expulsión.
                </p>
              </div>
            ) : isImpostorCaught ? (
              <div className="mt-3 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00ff88]/20 ring-1 ring-[#00ff88]/40 flex items-center justify-center text-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.3)]">
                  <FontAwesomeIcon icon={faBullseye} className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#00ff88] uppercase tracking-tight">
                  ¡Impostor Descubierto!
                </h1>
                <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  La sala identificó a <strong>{eliminatedPlayer?.name}</strong> con {result?.votesCount?.[eliminatedPlayer?.id]} votos en su contra.
                </p>
                <div className="p-3 mt-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-400/30 text-xs text-amber-300 font-semibold flex items-center justify-center gap-2 animate-pulse font-mono-sport">
                  <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                  <span>Iniciando Última Oportunidad: el impostor intentará adivinar el jugador secreto</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 ring-1 ring-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-red-400 uppercase tracking-tight">
                  El Impostor los Engañó
                </h1>
                <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  Acusaron a <strong>{eliminatedPlayer?.name}</strong>, quien era un inocente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desglose de Votos */}
        <div className="bezel-card">
          <div className="bezel-inner p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <FontAwesomeIcon icon={faChartSimple} className="w-3.5 h-3.5 text-[#00ff88]" />
              <h3 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                Cómputo de Votos
              </h3>
            </div>

            {sortedPlayers.map((player) => {
              const votes = result?.votesCount?.[player.id] || 0;
              const percent = Math.round((votes / totalVotes) * 100);
              const isEliminated = player.id === result?.eliminatedId;

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-xl ring-1 transition-all ${
                    isEliminated
                      ? isImpostorCaught
                        ? 'bg-[#00ff88]/10 ring-[#00ff88]/30'
                        : 'bg-red-500/10 ring-red-500/30'
                      : 'bg-white/[0.02] ring-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-black/40 ring-1 ring-white/10 flex items-center justify-center">
                        <FootballIcon avatarId={player.avatar} className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white">{player.name}</span>
                      {isEliminated && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono-sport font-black bg-white/10 text-white/80">
                          Mayoría
                        </span>
                      )}
                    </div>
                    <span className="font-mono-sport font-bold text-white text-[11px]">
                      {votes} {votes === 1 ? 'voto' : 'votos'} ({percent}%)
                    </span>
                  </div>

                  {/* Barra de votos */}
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isEliminated
                          ? isImpostorCaught
                            ? 'bg-[#00ff88]'
                            : 'bg-red-500'
                          : 'bg-white/30'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
