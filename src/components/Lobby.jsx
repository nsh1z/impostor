import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrown,
  faUsers,
  faPlay,
  faPenToSquare,
  faSliders,
  faCopy,
  faCheck,
  faShareNodes,
  faCircleExclamation,
  faArrowRight,
  faLightbulb,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import FootballIcon, { AVATAR_OPTIONS } from './FootballIcon';
import { soundFx } from '../services/soundFx';

export default function Lobby({ gameState, onStartGame, onUpdateProfile, onUpdateSettings }) {
  const [copied, setCopied] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(gameState?.me?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(gameState?.me?.avatar || 'shirt-10');
  const [showSettings, setShowSettings] = useState(false);

  const isHost = gameState?.me?.isHost;
  const connectedPlayers = gameState?.players?.filter(p => p.connected) || [];
  const minPlayers = 3;
  const canStart = connectedPlayers.length >= minPlayers;

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

  const handleShareLink = async () => {
    soundFx.click();
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Impostor Fútbol',
          text: `Únete a la partida en Impostor Fútbol con el código ${gameState?.code}`,
          url: url
        });
      } catch (e) {
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    soundFx.click();
    if (nameInput.trim()) {
      onUpdateProfile(nameInput.trim(), selectedAvatar);
      setEditingProfile(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Luz focal de estadio */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#00ff88]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-4">
        {/* Banner de Código de Sala (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-6 sm:p-7 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono-sport font-semibold">
              Código de Sala Oficial
            </span>

            <div className="my-2.5 flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-mono-sport font-black tracking-widest text-[#00ff88] drop-shadow-[0_0_25px_rgba(0,255,136,0.35)]">
                {gameState?.code}
              </span>
            </div>

            <p className="text-xs text-white/50 mb-5 max-w-md mx-auto">
              Invita a tus amigos para que ingresen el código desde sus celulares o computadoras.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={handleCopyCode}
                className="btn-tactile px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 text-xs font-semibold text-white inline-flex items-center gap-2 transition-all shadow-sm"
              >
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className={`w-3 h-3 ${copied ? 'text-[#00ff88]' : 'text-white/60'}`}
                />
                <span>{copied ? 'Código Copiado' : 'Copiar Código'}</span>
              </button>

              <button
                onClick={handleShareLink}
                className="btn-tactile px-4 py-2 rounded-full bg-[#00ff88]/10 hover:bg-[#00ff88]/20 ring-1 ring-[#00ff88]/30 text-xs font-semibold text-[#00ff88] inline-flex items-center gap-2 transition-all"
              >
                <FontAwesomeIcon icon={faShareNodes} className="w-3 h-3" />
                <span>Compartir Sala</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vestuario y Lista de Jugadores */}
        <div className="bezel-card">
          <div className="bezel-inner p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00ff88]/10 ring-1 ring-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                  <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-heading font-black text-white uppercase tracking-wide">
                    Vestuario ({connectedPlayers.length}/10)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundFx.click();
                    setEditingProfile(!editingProfile);
                  }}
                  className="btn-tactile px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 text-xs text-white/70 inline-flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="w-3 h-3 text-[#00ff88]" />
                  <span>Editar Perfil</span>
                </button>

                {isHost && (
                  <button
                    onClick={() => {
                      soundFx.click();
                      setShowSettings(!showSettings);
                    }}
                    className="btn-tactile px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/10 text-xs text-white/70 inline-flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faSliders} className="w-3 h-3 text-amber-400" />
                    <span>Ajustes</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resumen de Ajustes de la Sala para todos los jugadores */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 px-1 text-[10px] font-mono-sport text-white/50">
              <span className="uppercase tracking-wider text-white/30">Reglas:</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] ring-1 ring-white/10">
                Pistas: {gameState?.settings?.clueTime || 35}s
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.04] ring-1 ring-white/10">
                Voto: {gameState?.settings?.votingTime || 40}s
              </span>
              <span className={`px-2 py-0.5 rounded-full ring-1 ${
                gameState?.settings?.hintsEnabled !== false
                  ? 'bg-amber-400/10 text-amber-300 ring-amber-400/30'
                  : 'bg-red-400/10 text-red-400 ring-red-400/30'
              }`}>
                Pistas Impostor: {gameState?.settings?.hintsEnabled !== false ? 'Activadas' : 'Desactivadas'}
              </span>
            </div>

            {/* Editor de Perfil Rápido */}
            {editingProfile && (
              <form onSubmit={handleSaveProfile} className="p-4 mb-4 rounded-2xl bg-black/50 ring-1 ring-[#00ff88]/30 space-y-3 animate-fade-in">
                <span className="text-[10px] font-mono-sport font-black text-[#00ff88] uppercase tracking-widest block">
                  Editar Dorsal y Apodo
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={16}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] ring-1 ring-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#00ff88]"
                    placeholder="Nuevo apodo"
                  />
                  <button
                    type="submit"
                    className="btn-tactile px-4 py-2 rounded-xl bg-[#00ff88] text-black font-heading font-black text-xs uppercase tracking-wider"
                  >
                    Guardar
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSelectedAvatar(opt.id);
                      }}
                      className={`btn-tactile aspect-square rounded-xl flex items-center justify-center ${
                        selectedAvatar === opt.id
                          ? 'bg-[#00ff88]/20 ring-1 ring-[#00ff88]'
                          : 'bg-white/[0.02] ring-1 ring-white/5'
                      }`}
                    >
                      <FootballIcon avatarId={opt.id} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </form>
            )}

            {/* Configuración del Host */}
            {showSettings && isHost && (
              <div className="p-4 mb-4 rounded-2xl bg-black/50 ring-1 ring-amber-400/30 space-y-3.5 text-xs animate-fade-in">
                <span className="text-[10px] font-mono-sport font-black text-amber-400 uppercase tracking-widest block">
                  Parámetros de Juego
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 mb-1 font-mono-sport text-[10px] uppercase">
                      Tiempo por Pista
                    </label>
                    <select
                      value={gameState?.settings?.clueTime || 35}
                      onChange={(e) => {
                        soundFx.click();
                        onUpdateSettings({ clueTime: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#0b1410] ring-1 ring-white/10 text-white focus:outline-none"
                    >
                      <option value={25}>25 Segundos</option>
                      <option value={35}>35 Segundos</option>
                      <option value={50}>50 Segundos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-mono-sport text-[10px] uppercase">
                      Tiempo de Votación
                    </label>
                    <select
                      value={gameState?.settings?.votingTime || 40}
                      onChange={(e) => {
                        soundFx.click();
                        onUpdateSettings({ votingTime: Number(e.target.value) });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#0b1410] ring-1 ring-white/10 text-white focus:outline-none"
                    >
                      <option value={30}>30 Segundos</option>
                      <option value={45}>45 Segundos</option>
                      <option value={60}>60 Segundos</option>
                    </select>
                  </div>
                </div>

                {/* Opción de Pistas del Impostor */}
                <div className="pt-2.5 border-t border-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <label className="block text-white font-heading font-black text-xs uppercase tracking-wide">
                        Pistas para el Impostor
                      </label>
                      <p className="text-[10px] text-white/40 font-mono-sport mt-0.5">
                        {gameState?.settings?.hintsEnabled !== false
                          ? 'El impostor recibe una pista táctica para camuflarse.'
                          : 'El impostor no recibe pistas (Modo Puro / Difícil).'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        const currentVal = gameState?.settings?.hintsEnabled !== false;
                        onUpdateSettings({ hintsEnabled: !currentVal });
                      }}
                      className={`btn-tactile px-3 py-1.5 rounded-xl text-xs font-mono-sport font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        gameState?.settings?.hintsEnabled !== false
                          ? 'bg-[#00ff88]/20 text-[#00ff88] ring-1 ring-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                          : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={gameState?.settings?.hintsEnabled !== false ? faLightbulb : faEyeSlash}
                        className="w-3 h-3"
                      />
                      <span>{gameState?.settings?.hintsEnabled !== false ? 'Activadas' : 'Desactivadas'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de Jugadores Conectados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {connectedPlayers.map((player) => {
                const isMe = player.id === gameState?.me?.id;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-2xl ring-1 transition-all ${
                      isMe
                        ? 'bg-[#00ff88]/[0.06] ring-[#00ff88]/30 shadow-[0_0_20px_rgba(0,255,136,0.08)]'
                        : 'bg-white/[0.02] ring-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/40 ring-1 ring-white/10 flex items-center justify-center">
                        <FootballIcon avatarId={player.avatar} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                            {player.name}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono-sport font-black bg-[#00ff88]/20 text-[#00ff88]">
                              TÚ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-0.5 font-mono-sport">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
                          <span>CONECTADO</span>
                        </div>
                      </div>
                    </div>

                    {player.isHost && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 ring-1 ring-amber-400/30 text-[9px] font-mono-sport font-black text-amber-400 uppercase tracking-wider">
                        <FontAwesomeIcon icon={faCrown} className="w-2.5 h-2.5" />
                        <span>HOST</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Aviso si faltan jugadores */}
            {!canStart && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
                <FontAwesomeIcon icon={faCircleExclamation} className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Esperando jugadores: se requiere un mínimo de <strong>{minPlayers} participantes</strong> para disputar el partido (faltan {minPlayers - connectedPlayers.length}).
                </span>
              </div>
            )}

            {/* Botón de Inicio */}
            <div className="mt-6 pt-4 border-t border-white/10">
              {isHost ? (
                <button
                  onClick={() => {
                    soundFx.whistle();
                    onStartGame();
                  }}
                  disabled={!canStart}
                  className="btn-tactile group w-full py-4 rounded-full bg-gradient-to-r from-[#00ff88] to-[#059669] font-heading font-black text-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.35)] hover:brightness-110 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <span>Comenzar Partido</span>
                  <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <FontAwesomeIcon icon={faPlay} className="w-2.5 h-2.5 text-black" />
                  </div>
                </button>
              ) : (
                <div className="text-center py-2 text-xs text-white/40 flex items-center justify-center gap-2 font-mono-sport">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                  <span>Esperando que el anfitrión pite el inicio...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
