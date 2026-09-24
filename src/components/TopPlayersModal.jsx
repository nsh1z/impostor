import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faXmark,
  faMedal,
  faMagnifyingGlass,
  faTrashCan,
  faFutbol,
  faUserSecret,
  faShieldHalved,
  faPercent
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon from './FootballIcon';
import { getTopPlayers, clearLeaderboard } from '../services/leaderboard';
import { soundFx } from '../services/soundFx';

export default function TopPlayersModal({ isOpen, onClose }) {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPlayers(getTopPlayers());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleReset = () => {
    soundFx.click();
    if (window.confirm('¿Deseas reiniciar la tabla del Top de Jugadores? Esta acción borrará el historial acumulado.')) {
      clearLeaderboard();
      setPlayers([]);
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 text-black flex items-center justify-center font-heading font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          1°
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-400 to-gray-200 text-black flex items-center justify-center font-heading font-black text-xs shadow-[0_0_15px_rgba(203,213,225,0.4)]">
          2°
        </div>
      );
    }
    if (index === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-700 to-orange-400 text-white flex items-center justify-center font-heading font-black text-xs shadow-[0_0_15px_rgba(217,119,6,0.4)]">
          3°
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-white/[0.05] ring-1 ring-white/10 text-white/50 flex items-center justify-center font-mono-sport text-xs font-bold">
        {index + 1}°
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bezel-card w-full max-w-lg max-h-[85vh] flex flex-col relative overflow-hidden">
        <div className="bezel-inner p-5 sm:p-6 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-black text-white uppercase tracking-tight flex items-center gap-2">
                  Top Jugadores
                  <span className="text-[10px] font-mono-sport px-2 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] ring-1 ring-[#00ff88]/30 font-semibold uppercase tracking-widest">
                    Por Nombre
                  </span>
                </h2>
                <p className="text-[11px] text-white/50 font-mono-sport">
                  Acumula victorias y partidos jugados según tu apodo.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="btn-tactile w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar & count */}
          <div className="py-3 flex items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por apodo o nombre..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-xs text-white placeholder-white/30 font-mono-sport focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
              />
            </div>
            {players.length > 0 && (
              <button
                onClick={handleReset}
                title="Reiniciar estadísticas del ranking"
                className="btn-tactile p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 ring-1 ring-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              >
                <FontAwesomeIcon icon={faTrashCan} className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Player list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar min-h-[220px]">
            {filtered.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-white/40">
                <FontAwesomeIcon icon={faFutbol} className="w-8 h-8 mb-2 opacity-30 text-[#00ff88]" />
                <p className="text-xs font-mono-sport">
                  {searchTerm.trim()
                    ? 'No se encontraron jugadores con ese nombre.'
                    : 'Aún no hay partidos registrados. ¡Juega una partida para inaugurar el ranking!'}
                </p>
                <span className="text-[10px] text-white/30 mt-1">
                  Cualquier nombre que use un jugador sumará victorias automáticamente al terminar el partido.
                </span>
              </div>
            ) : (
              filtered.map((player, index) => {
                const winRate =
                  player.gamesPlayed > 0
                    ? Math.round((player.wins / player.gamesPlayed) * 100)
                    : 0;

                return (
                  <div
                    key={player.name.toLowerCase()}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                      index === 0
                        ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent ring-1 ring-amber-500/30'
                        : index === 1
                        ? 'bg-gradient-to-r from-slate-400/10 to-transparent ring-1 ring-slate-400/20'
                        : index === 2
                        ? 'bg-gradient-to-r from-orange-500/10 to-transparent ring-1 ring-orange-500/20'
                        : 'bg-white/[0.02] ring-1 ring-white/5 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {getRankBadge(index)}

                      <div className="w-9 h-9 rounded-xl bg-black/40 ring-1 ring-white/10 flex items-center justify-center shrink-0">
                        <FootballIcon avatarId={player.lastAvatar || 'shirt-10'} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-heading font-black text-white truncate flex items-center gap-1.5">
                          {player.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono-sport text-white/50 mt-0.5">
                          <span>
                            {player.gamesPlayed} {player.gamesPlayed === 1 ? 'partido' : 'partidos'}
                          </span>
                          <span>•</span>
                          <span className="text-[#00ff88]/80 font-semibold">
                            {winRate}% efec.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats pill */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Desglose roles */}
                      <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono-sport text-white/40">
                        <span title="Victorias como Inocente" className="flex items-center gap-1 text-[#00ff88]/80">
                          <FontAwesomeIcon icon={faShieldHalved} className="w-2.5 h-2.5" />
                          {player.innocentWins || 0}
                        </span>
                        <span title="Victorias como Impostor" className="flex items-center gap-1 text-red-400/80">
                          <FontAwesomeIcon icon={faUserSecret} className="w-2.5 h-2.5" />
                          {player.impostorWins || 0}
                        </span>
                      </div>

                      {/* Total Victorias */}
                      <div className="px-3 py-1.5 rounded-xl bg-[#00ff88]/10 ring-1 ring-[#00ff88]/30 text-right">
                        <div className="text-xs font-mono-sport font-black text-[#00ff88] flex items-center justify-end gap-1">
                          <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 text-amber-400" />
                          <span>{player.wins}</span>
                        </div>
                        <div className="text-[8px] font-mono-sport uppercase tracking-wider text-white/40">
                          {player.wins === 1 ? 'victoria' : 'victorias'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-sport text-white/40">
            <span>
              Total: {players.length} {players.length === 1 ? 'jugador registrado' : 'jugadores registrados'}
            </span>
            <span className="text-amber-400/70 font-semibold">
              Acumula por repetición de nombre
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
