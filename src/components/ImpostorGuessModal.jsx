import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faClock,
  faUserSecret,
  faPaperPlane,
  faLightbulb,
  faCheck,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';
import { getAllPlayerNames } from '../data/playersData.js';
import { soundFx } from '../services/soundFx';

export default function ImpostorGuessModal({ gameState, onSubmitGuess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [playersList, setPlayersList] = useState(() => getAllPlayerNames());
  const [timeLeft, setTimeLeft] = useState(gameState?.guessTimeLeft || 30);

  const isImpostor = gameState?.me?.role === 'IMPOSTOR';
  const impostorHint = gameState?.impostorHint;

  useEffect(() => {
    // Si hay backend disponible, refrescar lista
    fetch('/api/players')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setPlayersList(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (gameState?.guessTimeLeft !== undefined) {
      setTimeLeft(gameState.guessTimeLeft);
    }
  }, [gameState?.guessTimeLeft]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      soundFx.tick();
    }
  }, [timeLeft]);

  const handleSelectPlayer = (name) => {
    soundFx.click();
    setSelectedName(name);
    setSearchTerm(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.whistle();
    const finalGuess = selectedName || searchTerm;
    if (finalGuess.trim()) {
      onSubmitGuess(finalGuess.trim());
    }
  };

  const filteredPlayers = playersList.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.country.toLowerCase().includes(term) ||
      p.iconicClub.toLowerCase().includes(term)
    );
  }).slice(0, 12);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 relative select-none">
      {/* Luz focal dorada de última oportunidad */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* Banner de Última Oportunidad (Doppelrand) */}
        <div className="bezel-card">
          <div className="bezel-inner p-6 sm:p-7 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 ring-1 ring-amber-500/30 text-amber-400 text-[10px] font-mono-sport font-black uppercase tracking-widest mb-2.5">
              <FontAwesomeIcon icon={faBullseye} className="w-3 h-3" />
              <span>DISPARO FINAL DE SALVACIÓN</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white uppercase tracking-tight">
              ¿Quién era el futbolista secreto?
            </h1>

            {/* Temporizador */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 ring-1 ring-white/10 text-amber-400 font-mono-sport text-xs font-bold tracking-widest">
              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
              <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
            </div>

            <p className="text-xs text-white/60 mt-3 max-w-md mx-auto leading-relaxed">
              {isImpostor ? (
                <span>
                  Fuiste descubierto por el VAR, pero si adivinas el futbolista exacto, <strong>te robas el partido en el último minuto</strong>.
                </span>
              ) : (
                <span>
                  El impostor fue atrapado y tiene 30 segundos para adivinar el futbolista secreto. Si falla, el equipo inocente gana.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Zona Interactiva: Impostor vs Espectador */}
        {isImpostor ? (
          <div className="bezel-card animate-fade-in">
            <div className="bezel-inner p-5 sm:p-6 space-y-4">
              {/* PISTA TÁCTICA RECORDATORIO PARA EL IMPOSTOR */}
              {impostorHint && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 ring-1 ring-amber-400/30 flex items-start gap-2.5 text-xs text-amber-200">
                  <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono-sport font-black uppercase text-amber-400 text-[10px] tracking-widest block">
                      Recuerda tu Pista Táctica:
                    </span>
                    <span className="font-semibold text-white">{impostorHint}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono-sport font-black text-[#00ff88] tracking-widest mb-2">
                    Buscar y Seleccionar Jugador
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedName(e.target.value);
                      }}
                      placeholder="Escribe el nombre (ej: Messi, Haaland, Zidane)..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/10 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Lista de coincidencias */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredPlayers.map((p) => {
                    const isSelected = selectedName === p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPlayer(p.name)}
                        className={`btn-tactile p-2.5 rounded-xl text-left ring-1 flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 ring-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-white/[0.02] ring-white/5 hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{p.name}</div>
                          <div className="text-[10px] text-white/40 font-mono-sport">{p.country} • {p.iconicClub}</div>
                        </div>
                        {isSelected && (
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Botón de Confirmación */}
                <button
                  type="submit"
                  disabled={!selectedName.trim() && !searchTerm.trim()}
                  className="btn-tactile group w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 font-heading font-black text-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3 text-black" />
                  <span>Confirmar Mi Disparo Final</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bezel-card">
            <div className="bezel-inner p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/30 flex items-center justify-center text-amber-400">
                <FontAwesomeIcon icon={faUserSecret} className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-heading font-black text-white uppercase tracking-wide">
                El Impostor está intentando adivinar...
              </h3>
              <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                Tiene acceso al catálogo de futbolistas. Si no acierta en tiempo, el triunfo es de los inocentes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
