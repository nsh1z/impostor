import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faRightToBracket,
  faCircleQuestion,
  faTriangleExclamation,
  faFutbol,
  faRotate
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon, { AVATAR_OPTIONS } from './FootballIcon';
import { soundFx } from '../services/soundFx';
import { socket } from '../services/socket';

export default function Home({ onCreateRoom, onJoinRoom, onOpenHelp, errorMsg, isConnected }) {
  const [tab, setTab] = useState('create'); // 'create' | 'join'
  const [name, setName] = useState(() => localStorage.getItem('impostor_name') || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('impostor_avatar') || 'shirt-10');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSelectAvatar = (aId) => {
    soundFx.click();
    setAvatar(aId);
    localStorage.setItem('impostor_avatar', aId);
  };

  const handleNameChange = (val) => {
    setName(val);
    localStorage.setItem('impostor_name', val);
    if (localError) setLocalError('');
  };

  const handleManualReconnect = () => {
    soundFx.click();
    socket.connect();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.click();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError('Ingresa tu apodo para saltar a la cancha.');
      return;
    }

    setLoading(true);

    if (tab === 'join') {
      const cleanCode = roomCode.trim().toUpperCase();
      if (!cleanCode || cleanCode.length < 3) {
        setLoading(false);
        setLocalError('Ingresa un código de sala válido.');
        return;
      }
      onJoinRoom(cleanCode, trimmedName, avatar, () => setLoading(false));
    } else {
      onCreateRoom(trimmedName, avatar, () => setLoading(false));
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Luz focal de estadio */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#00ff88]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center mb-8 relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] ring-1 ring-[#00ff88]/30 mb-5 shadow-[0_0_20px_rgba(0,255,136,0.15)]">
          <FontAwesomeIcon icon={faFutbol} className="w-3 h-3 text-[#00ff88]" />
          <span className="text-[10px] font-mono-sport uppercase tracking-[0.2em] font-semibold text-[#00ff88]">
            Multiplayer En Tiempo Real
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-none uppercase">
          <span className="block text-white">IMPOSTOR</span>
          <span className="block bg-gradient-to-r from-[#00ff88] via-[#10b981] to-[#34d399] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.35)]">
            FÚTBOL
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-white/60 mt-3 font-normal max-w-sm mx-auto leading-relaxed">
          Descubre quién no pertenece al vestuario antes de que deduzca al futbolista secreto.
        </p>
      </div>

      {/* Contenedor Principal (Doppelrand de Alta Gama) */}
      <div className="bezel-card w-full max-w-md relative z-10">
        <div className="bezel-inner p-6 sm:p-7">
          {/* Selector de Modo: Crear vs Unirse */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 ring-1 ring-white/5 mb-6">
            <button
              type="button"
              onClick={() => {
                soundFx.click();
                setTab('create');
                setLocalError('');
              }}
              className={`btn-tactile py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all ${
                tab === 'create'
                  ? 'bg-gradient-to-r from-[#00ff88] to-[#059669] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Crear Partida
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.click();
                setTab('join');
                setLocalError('');
              }}
              className={`btn-tactile py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all ${
                tab === 'join'
                  ? 'bg-gradient-to-r from-[#00ff88] to-[#059669] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Unirse a Sala
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensajes de error */}
            {(localError || errorMsg) && (
              <div className="p-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 flex items-center gap-2.5 text-xs text-red-300 animate-fade-in">
                <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 shrink-0 text-red-400" />
                <span>{localError || errorMsg}</span>
              </div>
            )}

            {/* Input de Nombre */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold mb-1.5 font-mono-sport">
                Tu Apodo / Dorsal
              </label>
              <input
                type="text"
                maxLength={16}
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Capitán, El Diez, Dibu..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#00ff88] focus:bg-white/[0.05] transition-all"
                autoFocus
              />
            </div>

            {/* Selector de Avatar Táctico */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold mb-2 font-mono-sport">
                Insignia de Jugador
              </label>
              <div className="grid grid-cols-6 gap-2 p-2.5 rounded-2xl bg-black/40 ring-1 ring-white/5">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    title={opt.label}
                    onClick={() => handleSelectAvatar(opt.id)}
                    className={`btn-tactile aspect-square flex items-center justify-center rounded-xl transition-all ${
                      avatar === opt.id
                        ? 'bg-[#00ff88]/20 ring-1 ring-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] scale-105'
                        : 'bg-white/[0.02] ring-1 ring-white/5 hover:bg-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <FootballIcon avatarId={opt.id} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input de Código si es "Unirse" */}
            {tab === 'join' && (
              <div className="pt-1">
                <label className="block text-[11px] uppercase tracking-[0.15em] text-white/70 font-semibold mb-1.5 font-mono-sport">
                  Código de Sala (4 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase());
                    if (localError) setLocalError('');
                  }}
                  placeholder="Ej: GOL7"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-center font-mono-sport tracking-widest text-lg font-bold text-[#00ff88] uppercase placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#00ff88] transition-all"
                />
              </div>
            )}

            {/* Botón Principal Estilo Island */}
            <button
              type="submit"
              disabled={loading}
              className="btn-tactile group w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#059669] font-heading font-black text-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.35)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Conectando...' : tab === 'create' ? 'Crear Nueva Sala' : 'Entrar a la Sala'}</span>
              <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <FontAwesomeIcon
                  icon={tab === 'create' ? faPlus : faRightToBracket}
                  className="w-2.5 h-2.5 text-black"
                />
              </div>
            </button>
          </form>

          {/* Botón de Cómo Jugar */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                soundFx.click();
                onOpenHelp();
              }}
              className="btn-tactile inline-flex items-center gap-2 text-xs text-white/50 hover:text-[#00ff88] transition-colors"
            >
              <FontAwesomeIcon icon={faCircleQuestion} className="w-3.5 h-3.5 text-[#00ff88]" />
              <span>Ver reglamento y cómo se juega</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
