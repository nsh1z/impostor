import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faEye,
  faEyeSlash,
  faUserSecret,
  faShieldHalved,
  faLightbulb,
  faCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { soundFx } from '../services/soundFx';

export default function RoleReveal({ gameState, onReady, onForceStart }) {
  const [revealed, setRevealed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const role = gameState?.me?.role; // 'IMPOSTOR' | 'INNOCENT'
  const isImpostor = role === 'IMPOSTOR';
  const player = gameState?.secretPlayer;
  const impostorHint = gameState?.impostorHint;
  const isHost = gameState?.me?.isHost;

  const connectedPlayers = gameState?.players?.filter(p => p.connected) || [];
  const readyCount = connectedPlayers.filter(p => p.ready).length;

  const handleToggleReveal = () => {
    soundFx.reveal();
    setRevealed(!revealed);
  };

  const handleConfirmReady = () => {
    soundFx.whistle();
    setIsReady(true);
    onReady();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative select-none">
      {/* Luz focal ambiental según rol */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[150px] pointer-events-none transition-all duration-700 ${
          revealed
            ? isImpostor
              ? 'bg-red-500/15'
              : 'bg-[#00ff88]/15'
            : 'bg-white/5'
        }`}
      />

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Encabezado */}
        <div className="text-center">
          <span className="text-[10px] font-mono-sport uppercase tracking-[0.2em] text-[#00ff88] font-semibold">
            Fase Confidencial
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight mt-1">
            Tu Rol en el Partido
          </h1>
          <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
            Toca la tarjeta para consultar tu informe táctico en privado.
          </p>
        </div>

        {/* Tarjeta de Revelación Táctil (Doppelrand) */}
        <div
          onClick={handleToggleReveal}
          className={`cursor-pointer transition-all duration-300 transform ${
            revealed
              ? isImpostor
                ? 'bezel-impostor scale-[1.01]'
                : 'bezel-innocent scale-[1.01]'
              : 'bezel-card hover:scale-[1.008]'
          }`}
        >
          <div
            className={`p-6 sm:p-7 min-h-[340px] flex flex-col items-center justify-center text-center transition-all ${
              revealed
                ? isImpostor
                  ? 'bezel-inner-impostor'
                  : 'bezel-inner-innocent'
                : 'bezel-inner'
            }`}
          >
            {!revealed ? (
              // Estado Oculto
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center text-white/60 shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white uppercase tracking-wide">
                    Informe Secreto
                  </h3>
                  <p className="text-xs text-white/40 max-w-xs mt-1 leading-relaxed">
                    Toca aquí para descubrir si conoces al futbolista secreto o si debes jugar encubierto.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] ring-1 ring-white/10 text-xs font-semibold text-white/80">
                  <FontAwesomeIcon icon={faEye} className="w-3 h-3 text-[#00ff88]" />
                  <span>Tocar para Revelar</span>
                </div>
              </div>
            ) : isImpostor ? (
              // Estado Revelado: IMPOSTOR (CON PISTA TÁCTICA OBLIGATORIA)
              <div className="space-y-4 flex flex-col items-center animate-fade-in w-full">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 ring-1 ring-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                  <FontAwesomeIcon icon={faUserSecret} className="w-7 h-7" />
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 ring-1 ring-red-500/40 text-[10px] font-mono-sport font-black uppercase text-red-400 tracking-wider">
                    OPERACIÓN ENCUBIERTA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-red-400 uppercase tracking-wide mt-1.5">
                    ¡ERES EL IMPOSTOR!
                  </h2>
                </div>

                {/* PISTA CONFIDENCIAL EXCLUSIVA PARA EL IMPOSTOR */}
                <div className="w-full p-4 rounded-2xl bg-black/60 ring-1 ring-amber-400/40 text-left space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-mono-sport text-[10px] uppercase tracking-widest font-black">
                    <FontAwesomeIcon icon={faLightbulb} className="w-3 h-3" />
                    <span>Tu Pista Táctica de Respaldo</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-relaxed">
                    {impostorHint || 'Futbolista internacional de primer nivel'}
                  </p>
                  <p className="text-[11px] text-white/50 leading-relaxed pt-1 border-t border-white/5">
                    Usa esta pista para hablar con naturalidad sin delatarte. Escucha las pistas de los demás para adivinar el nombre exacto.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-sport uppercase tracking-widest text-white/30">
                  <FontAwesomeIcon icon={faEyeSlash} className="w-2.5 h-2.5" />
                  <span>Toca para ocultar nuevamente</span>
                </div>
              </div>
            ) : (
              // Estado Revelado: INOCENTE
              <div className="space-y-4 flex flex-col items-center animate-fade-in w-full">
                <div className="w-14 h-14 rounded-2xl bg-[#00ff88]/20 ring-1 ring-[#00ff88]/50 flex items-center justify-center text-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.3)]">
                  <FontAwesomeIcon icon={faShieldHalved} className="w-7 h-7" />
                </div>

                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00ff88]/20 ring-1 ring-[#00ff88]/40 text-[10px] font-mono-sport font-black uppercase text-[#00ff88] tracking-wider">
                    JUGADOR ASIGNADO
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-wide mt-1.5">
                    {player?.name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-white/90">
                      {player?.country}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-white/90">
                      {player?.position}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-semibold text-[#00ff88]">
                      {player?.iconicClub}
                    </span>
                  </div>
                </div>

                {/* Datos de apoyo para formular pistas */}
                {player?.hints && player.hints.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/50 ring-1 ring-[#00ff88]/30 text-xs text-white/80 text-left space-y-1.5 w-full">
                    <span className="text-[10px] font-mono-sport uppercase font-black text-[#00ff88] tracking-widest block">
                      Datos Clave para tu Pista:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-white/70 text-[11px]">
                      {player.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-sport uppercase tracking-widest text-white/30">
                  <FontAwesomeIcon icon={faEyeSlash} className="w-2.5 h-2.5" />
                  <span>Toca para ocultar nuevamente</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón de Confirmación Listo */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleConfirmReady}
            disabled={isReady}
            className={`btn-tactile group w-full py-3.5 rounded-full font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isReady
                ? 'bg-white/10 text-[#00ff88] ring-1 ring-[#00ff88]/40 shadow-inner'
                : 'bg-gradient-to-r from-[#00ff88] to-[#059669] text-black shadow-[0_0_30px_rgba(0,255,136,0.35)] hover:brightness-110'
            }`}
          >
            <span>{isReady ? 'Confirmado: Esperando al equipo...' : 'Confirmar y Salir a la Cancha'}</span>
            <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5 text-black" />
            </div>
          </button>

          {/* Contador de listos */}
          <div className="flex items-center justify-between px-2 text-xs text-white/50 font-mono-sport">
            <span>Jugadores listos:</span>
            <span className="text-[#00ff88] font-bold">
              {readyCount} / {connectedPlayers.length}
            </span>
          </div>

          {/* Opciones de Anfitrión */}
          {isHost && readyCount >= 2 && (
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  soundFx.whistle();
                  onForceStart();
                }}
                className="btn-tactile text-xs text-white/40 hover:text-amber-400 underline underline-offset-4"
              >
                Comenzar ronda de pistas de inmediato
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
