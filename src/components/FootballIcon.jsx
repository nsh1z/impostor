import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faTrophy,
  faShirt,
  faShieldHalved,
  faCrown,
  faUserSecret,
  faBolt,
  faFire,
  faStar,
  faAward,
  faCompass,
  faHand
} from '@fortawesome/free-solid-svg-icons';

export const AVATAR_OPTIONS = [
  { id: 'shirt-10', label: '#10 Creador', icon: faShirt, number: '10', color: 'text-emerald-400' },
  { id: 'shirt-7', label: '#7 Extremo', icon: faShirt, number: '7', color: 'text-emerald-400' },
  { id: 'shirt-9', label: '#9 Goleador', icon: faShirt, number: '9', color: 'text-amber-400' },
  { id: 'shirt-11', label: '#11 Desborde', icon: faShirt, number: '11', color: 'text-emerald-400' },
  { id: 'ball', label: 'Balón', icon: faFutbol, color: 'text-white' },
  { id: 'trophy', label: 'Copa', icon: faTrophy, color: 'text-amber-400' },
  { id: 'gloves', label: 'Guardián', icon: faHand, color: 'text-blue-400' },
  { id: 'crown', label: 'Capitán', icon: faCrown, color: 'text-amber-300' },
  { id: 'star', label: 'Estrella', icon: faStar, color: 'text-yellow-400' },
  { id: 'bolt', label: 'Velocidad', icon: faBolt, color: 'text-amber-400' },
  { id: 'fire', label: 'Goleador', icon: faFire, color: 'text-orange-400' },
  { id: 'shield', label: 'Defensa', icon: faShieldHalved, color: 'text-emerald-400' }
];

export default function FootballIcon({ avatarId, className = 'w-5 h-5', showNumber = true }) {
  const found = AVATAR_OPTIONS.find(a => a.id === avatarId);

  if (avatarId === 'secret') {
    return <FontAwesomeIcon icon={faUserSecret} className={`${className} text-red-400`} />;
  }

  if (found) {
    if (found.number && showNumber) {
      return (
        <div className="relative inline-flex items-center justify-center">
          <FontAwesomeIcon icon={found.icon} className={`${className} ${found.color}`} />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black tracking-tighter text-black">
            {found.number}
          </span>
        </div>
      );
    }
    return <FontAwesomeIcon icon={found.icon} className={`${className} ${found.color}`} />;
  }

  // Fallback por defecto si no coincide
  return <FontAwesomeIcon icon={faFutbol} className={`${className} text-emerald-400`} />;
}
