import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faRotate,
  faShieldHalved,
  faUserSecret,
  faCircleCheck,
  faFutbol,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon from './FootballIcon';
import { soundFx } from '../services/soundFx';
import { recordMatchResult } from '../services/leaderboard';

export default function GameOver({ gameState, onRematch, onOpenTopPlayers }) {
  const winner = gameState?.winner; // 'INNOCENTS' | 'IMPOSTOR'
  const winReason = gameState?.winReason;
  const secretPlayer = gameState?.secretPlayer;
  const impostorId = gameState?.impostorId;
  const players = gameState?.players || [];
  const impostorPlayer = players.find(p => p.id === impostorId);
  const myRole = gameState?.me?.role;
  const iWon = (winner === 'IMPOSTOR' && myRole === 'IMPOSTOR') || (winner === 'INNOCENTS' && myRole === 'INNOCENT');

  useEffect(() => {
    // Registrar automáticamente los resultados por nombre en el Top Jugadores
    recordMatchResult(gameState);
    soundFx.victory();

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00ff88', '#10b981', '#f59e0b', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00ff88', '#10b981', '#f59e0b', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative select-none">
      {/* Luz focal de fin de partido */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none ${
          winner === 'INNOCENTS' ? 'bg-[#00ff88]/20' : 'bg-red-500/20'
        }`}
      />

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* Banner de Victoria Principal (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-6 sm:p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-black shadow-[0_0_35px_rgba(245,158,11,0.4)]">
              <FontAwesomeIcon icon={faTrophy} className="w-8 h-8" />
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] font-mono-sport font-black text-amber-400">
              Pitido Final
            </span>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight mt-1">
              {winner === 'INNOCENTS' ? (
                <span className="text-[#00ff88]">Victoria del Equipo Inocente</span>
              ) : (
                <span className="text-red-400">Victoria del Impostor</span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-md mx-auto leading-relaxed">
              {winReason}
            </p>

            {/* Estado personal del jugador */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] ring-1 ring-white/10 text-xs font-semibold">
              {iWon ? (
                <span className="text-[#00ff88] flex items-center gap-1.5 font-mono-sport text-[11px]">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3" />
                  Victoria registrada para tu equipo
                </span>
              ) : (
                <span className="text-white/50 font-mono-sport text-[11px]">
                  Derrota en esta fecha. La revancha espera.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Revelaciones Oficiales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Futbolista Secreto */}
          <div className="bezel-card">
            <div className="bezel-inner p-4 sm:p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[9px] uppercase font-mono-sport font-black text-[#00ff88] tracking-widest">
                    FUTBOLISTA SECRETO
                  </span>
                  <FontAwesomeIcon icon={faFutbol} className="w-3.5 h-3.5 text-[#00ff88]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                  {secretPlayer?.name || 'Futbolista'}
                </h3>
              </div>

              <div className="mt-4 pt-2.5 border-t border-white/5 text-[10px] font-mono-sport uppercase tracking-wider text-white/40">
                Identidad oficial del partido
              </div>
            </div>
          </div>

          {/* El Impostor */}
          <div className="bezel-card">
            <div className="bezel-inner p-4 sm:p-5 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[9px] uppercase font-mono-sport font-black text-red-400 tracking-widest">
                    EL IMPOSTOR ERA
                  </span>
                  <FontAwesomeIcon icon={faUserSecret} className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black/40 ring-1 ring-white/10 flex items-center justify-center">
                    <FootballIcon avatarId={impostorPlayer?.avatar} className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-heading font-black text-white">
                    {impostorPlayer?.name || 'Desconocido'}
                  </h3>
                </div>
                <p className="text-xs text-white/60 mt-2 font-mono-sport text-[11px]">
                  {gameState?.impostorGuess ? (
                    <span>
                      Disparo final: <strong className="text-amber-400">"{gameState.impostorGuess}"</strong>
                    </span>
                  ) : (
                    <span>No llegó a emitir predicción final.</span>
                  )}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 text-[11px] text-white/50 font-mono-sport">
                {winner === 'IMPOSTOR'
                  ? 'Victoria táctica del impostor.'
                  : 'Descubierto en la votación del VAR.'}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Revancha Inmediata */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => {
              soundFx.whistle();
              onRematch();
            }}
            className="btn-tactile group w-full py-4 rounded-full bg-gradient-to-r from-[#00ff88] to-[#059669] font-heading font-black text-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(0,255,136,0.4)] hover:brightness-110"
          >
            <span>Jugar Revancha con el Mismo Equipo</span>
            <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
              <FontAwesomeIcon icon={faRotate} className="w-3 h-3 text-black" />
            </div>
          </button>

          {onOpenTopPlayers && (
            <button
              onClick={() => {
                soundFx.click();
                onOpenTopPlayers();
              }}
              className="btn-tactile w-full py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 font-heading font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:ring-amber-400/30"
            >
              <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 text-amber-400" />
              <span>Ver Tabla de Top Jugadores</span>
            </button>
          )}

          <p className="text-center text-[10px] font-mono-sport uppercase tracking-widest text-white/40 pt-1">
            Regresarán todos al vestuario para una nueva partida con otro futbolista secreto.
          </p>
        </div>
      </div>
    </div>
  );
}
