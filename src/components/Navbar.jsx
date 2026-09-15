import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faVolumeHigh,
  faVolumeXmark,
  faCopy,
  faCheck,
  faRightFromBracket,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { soundFx } from '../services/soundFx';

export default function Navbar({ gameState, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(soundFx.isMuted());

  const handleToggleMute = () => {
    const isNowMuted = soundFx.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundFx.click();
  };

  const handleCopyCode = async () => {
    if (!gameState?.code) return;
    soundFx.click();
    try {
      await navigator.clipboard.writeText(gameState.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-4xl flex items-center justify-between px-4 py-2.5 rounded-full bg-[#080f0b]/90 backdrop-blur-2xl ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#059669] flex items-center justify-center text-black shadow-[0_0_15px_rgba(0,255,136,0.35)]">
            <FontAwesomeIcon icon={faFutbol} className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black tracking-wider text-xs sm:text-sm bg-gradient-to-r from-white via-white/90 to-[#00ff88] bg-clip-text text-transparent uppercase">
              Impostor Fútbol
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-mono-sport hidden sm:block">
              Multiplayer táctico
            </span>
          </div>
        </div>

        {/* Room Info Pill */}
        {gameState?.code && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              title="Copiar código de sala"
              className="btn-tactile group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 text-xs font-mono-sport tracking-widest text-[#00ff88] transition-all"
            >
              <span className="text-white/50 text-[10px] uppercase font-sans tracking-normal font-semibold">
                SALA:
              </span>
              <span className="font-bold text-white tracking-wider">{gameState.code}</span>
              <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={`w-2.5 h-2.5 ${copied ? 'text-[#00ff88]' : 'text-white/60'}`}
                />
              </div>
            </button>

            {/* Contador de jugadores en sala */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] ring-1 ring-white/5 text-xs text-white/70">
              <FontAwesomeIcon icon={faUsers} className="w-3 h-3 text-[#00ff88]" />
              <span className="font-mono-sport font-semibold">
                {gameState.players?.filter(p => p.connected).length || 0}/10
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            title={muted ? 'Activar efectos de audio' : 'Silenciar audio'}
            className="btn-tactile w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <FontAwesomeIcon
              icon={muted ? faVolumeXmark : faVolumeHigh}
              className={`w-3.5 h-3.5 ${muted ? 'text-red-400' : 'text-[#00ff88]'}`}
            />
          </button>

          {gameState && onLeaveRoom && (
            <button
              onClick={() => {
                soundFx.click();
                if (window.confirm('¿Deseas salir del partido actual?')) {
                  onLeaveRoom();
                }
              }}
              title="Salir de la sala"
              className="btn-tactile w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 ring-1 ring-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
