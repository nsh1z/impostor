// Servicio para obtener la fotografía oficial de cada futbolista
// Utiliza un mapeo local precargado con URLs de Wikimedia Commons y respaldo dinámico con caché.

import playerPhotos from '../data/playerPhotos.json';
import { FOOTBALL_PLAYERS } from '../data/playersData.js';

const CACHE_PREFIX = 'impostor_photo_';
const MEMORY_CACHE = new Map();

// Indexación rápida por nombre en minúsculas
const PHOTO_BY_NAME = new Map();
try {
  FOOTBALL_PLAYERS.forEach(p => {
    if (playerPhotos[p.id]) {
      PHOTO_BY_NAME.set(p.name.trim().toLowerCase(), playerPhotos[p.id]);
    }
  });
} catch (e) {}

/**
 * Normaliza el nombre del jugador para búsqueda en Wikipedia.
 */
function normalizePlayerTitle(name) {
  if (!name) return '';
  return name.trim().replace(/\s+/g, '_');
}

/**
 * Obtiene la URL de la foto de un jugador por ID o nombre.
 * @param {string} id ID del futbolista (ej: 'messi', 'maradona')
 * @param {string} name Nombre completo del futbolista (ej: 'Lionel Messi')
 * @returns {Promise<string|null>} URL de la imagen en alta calidad o null si no se encuentra
 */
export async function fetchPlayerPhoto(id, name) {
  const cacheKey = id || name;
  if (!cacheKey) return null;

  // 1. Memoria rápida
  if (MEMORY_CACHE.has(cacheKey)) {
    return MEMORY_CACHE.get(cacheKey);
  }

  // 2. Mapeo local precargado por ID
  if (id && playerPhotos[id]) {
    MEMORY_CACHE.set(cacheKey, playerPhotos[id]);
    return playerPhotos[id];
  }

  // 3. Mapeo local precargado por Nombre
  if (name) {
    const clean = name.trim().toLowerCase();
    if (PHOTO_BY_NAME.has(clean)) {
      const url = PHOTO_BY_NAME.get(clean);
      MEMORY_CACHE.set(cacheKey, url);
      return url;
    }
  }

  // 4. Caché de localStorage del navegador
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CACHE_PREFIX + cacheKey.toLowerCase());
      if (stored) {
        MEMORY_CACHE.set(cacheKey, stored);
        return stored;
      }
    } catch (e) {}
  }

  // 5. Búsqueda dinámica en Wikipedia (fallback para nuevos futbolistas o variantes)
  if (name && typeof window !== 'undefined') {
    const titles = [
      normalizePlayerTitle(name),
      normalizePlayerTitle(name) + '_(futbolista)',
      normalizePlayerTitle(name) + '_(footballer)'
    ];

    for (const title of titles) {
      try {
        const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.thumbnail?.source) {
            const url = data.thumbnail.source;
            MEMORY_CACHE.set(cacheKey, url);
            try { localStorage.setItem(CACHE_PREFIX + cacheKey.toLowerCase(), url); } catch (e) {}
            return url;
          }
        }
      } catch (e) {}

      // Intentar en Wikipedia en inglés si falla en español
      try {
        const enRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (enRes.ok) {
          const data = await enRes.json();
          if (data.thumbnail?.source) {
            const url = data.thumbnail.source;
            MEMORY_CACHE.set(cacheKey, url);
            try { localStorage.setItem(CACHE_PREFIX + cacheKey.toLowerCase(), url); } catch (e) {}
            return url;
          }
        }
      } catch (e) {}
    }
  }

  return null;
}
