import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faEye,
  faComments,
  faShieldHalved,
  faTrophy,
  faUserSecret,
  faLightbulb,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { soundFx } from '../services/soundFx';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bezel-card w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="bezel-inner p-6 sm:p-7 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00ff88]/10 ring-1 ring-[#00ff88]/30 flex items-center justify-center text-[#00ff88]">
                <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-white uppercase tracking-tight">
                  Reglamento Táctico
                </h2>
                <span className="text-[10px] uppercase font-mono-sport tracking-widest text-white/40">
                  Manual de Partido
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="btn-tactile w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-white/70 hover:text-white"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </div>

          {/* Steps */}
          <div className="py-4 space-y-3.5 overflow-y-auto pr-1">
            {/* Paso 1 */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5">
              <div className="w-9 h-9 rounded-xl bg-[#00ff88]/10 ring-1 ring-[#00ff88]/30 flex items-center justify-center shrink-0 text-[#00ff88]">
                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-sport font-black uppercase text-[#00ff88] tracking-widest">Fase 1</span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Asignación Confidencial</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Todos los inocentes reciben al <strong>mismo futbolista secreto</strong> (con club, país y posición). 
                  El <strong>Impostor</strong> no conoce el nombre, pero <strong>siempre recibe una pista táctica confidencial</strong> (posición, época o logro) para poder camuflarse.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                <FontAwesomeIcon icon={faComments} className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-sport font-black uppercase text-blue-400 tracking-widest">Fase 2</span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Ronda de Pistas</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Por turnos cronometrados, cada jugador da una pista verbal o la anota en la pizarra. 
                  Una pista demasiado obvia regala el jugador al impostor; una pista extraña levantará sospechas en tu contra.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 flex items-center justify-center shrink-0 text-red-400">
                <FontAwesomeIcon icon={faUserSecret} className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-sport font-black uppercase text-red-400 tracking-widest">Fase 3</span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Votación en el VAR</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Todos votan en secreto por el sospechoso de ser el impostor. 
                  Si la mayoría culpa a un inocente o hay empate, <strong>el impostor gana de inmediato</strong>.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] ring-1 ring-white/5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <FontAwesomeIcon icon={faTrophy} className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-sport font-black uppercase text-amber-400 tracking-widest">Fase 4</span>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wide">Última Oportunidad</h3>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Si el impostor es descubierto, tiene 30 segundos para intentar deducir el futbolista secreto. 
                  Si acierta con su disparo final, <strong>el impostor se roba la victoria</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-white/10 mt-auto">
            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="btn-tactile group w-full py-3 rounded-full bg-gradient-to-r from-[#00ff88] to-[#059669] font-heading font-black text-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,255,136,0.3)] hover:brightness-110"
            >
              <span>Entendido, listo para jugar</span>
              <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <FontAwesomeIcon icon={faArrowRight} className="w-2.5 h-2.5 text-black" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
