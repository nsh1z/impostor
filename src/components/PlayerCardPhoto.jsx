import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faUser, faStar } from '@fortawesome/free-solid-svg-icons';
import { fetchPlayerPhoto } from '../services/playerPhotoService';

export default function PlayerCardPhoto({
  playerId,
  playerName,
  size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
  className = '',
  showBadge = true
}) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    if (!playerName && !playerId) {
      setLoading(false);
      return;
    }

    fetchPlayerPhoto(playerId, playerName)
      .then((url) => {
        if (!isMounted) return;
        if (url) {
          setPhotoUrl(url);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [playerId, playerName]);

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    hero: 'w-40 h-40 sm:w-48 sm:h-48'
  };

  return (
    <div className={`relative group shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Marco Doppelrand con resplandor */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00ff88]/30 via-white/10 to-transparent p-[1.5px] shadow-[0_0_25px_rgba(0,255,136,0.15)] group-hover:shadow-[0_0_35px_rgba(0,255,136,0.3)] transition-all duration-500">
        <div className="w-full h-full rounded-2xl bg-[#09120c] overflow-hidden relative flex items-center justify-center">
          {/* Skeleton de carga */}
          {loading && (
            <div className="absolute inset-0 bg-white/[0.04] animate-pulse flex items-center justify-center">
              <FontAwesomeIcon icon={faFutbol} className="w-6 h-6 text-white/20 animate-spin" />
            </div>
          )}

          {/* Imagen real del futbolista */}
          {!loading && photoUrl && !error && (
            <img
              src={photoUrl}
              alt={playerName || 'Futbolista'}
              onError={() => setError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}

          {/* Fallback si no hay foto disponible o hubo error */}
          {(!loading && (!photoUrl || error)) && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.06] to-black/60 p-2 text-center">
              <div className="w-10 h-10 rounded-full bg-[#00ff88]/15 ring-1 ring-[#00ff88]/30 flex items-center justify-center text-[#00ff88] mb-1">
                <FontAwesomeIcon icon={faFutbol} className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono-sport text-white/50 uppercase tracking-widest line-clamp-1">
                {playerName || 'Figura'}
              </span>
            </div>
          )}

          {/* Gradiente inferior para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badge estelar */}
          {showBadge && (
            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 backdrop-blur-md ring-1 ring-white/20 flex items-center justify-center text-amber-400">
              <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
