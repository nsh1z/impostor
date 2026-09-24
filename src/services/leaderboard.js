// Servicio de gestión de ranking y estadísticas de jugadores
// REGLA CLAVE: Funciona estrictamente por NOMBRE (case-insensitive para acumular).
// Si un nombre se repite (en el mismo partido o en distintas partidas), se le acumulan las victorias y partidos jugados.

const STORAGE_KEY = 'impostor_top_players_ranking';
let lastRecordedMatchKey = null;

/**
 * Obtiene todos los jugadores guardados en el Top.
 * @returns {Array} Lista ordenada por victorias desc, winrate desc y partidos desc.
 */
export function getTopPlayers() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.sort((a, b) => {
      // 1. Más victorias
      if (b.wins !== a.wins) return b.wins - a.wins;
      // 2. Mayor porcentaje de victorias (win rate)
      const rateA = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
      const rateB = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
      if (rateB !== rateA) return rateB - rateA;
      // 3. Más partidos jugados
      if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
      // 4. Nombre alfabético
      return a.name.localeCompare(b.name);
    });
  } catch (err) {
    console.warn('Error al leer ranking de localStorage:', err);
    return [];
  }
}

/**
 * Registra el resultado del partido terminado.
 * Se ejecuta al finalizar un encuentro (GAME_OVER).
 * @param {Object} gameState Estado actual de la sala
 * @returns {Array} Ranking actualizado
 */
export function recordMatchResult(gameState) {
  if (typeof window === 'undefined' || !gameState) return getTopPlayers();

  const { code, winner, impostorId, players, secretPlayer } = gameState;
  if (!winner || !Array.isArray(players) || players.length === 0) {
    return getTopPlayers();
  }

  // Clave única para evitar duplicar el conteo en re-renders del mismo partido
  const matchKey = `${code || 'LOCAL'}_${secretPlayer?.name || 'SECRET'}_${impostorId}_${winner}`;
  if (lastRecordedMatchKey === matchKey) {
    return getTopPlayers();
  }
  lastRecordedMatchKey = matchKey;

  try {
    const currentList = getTopPlayers();
    // Mapeo por clave normalizada (minúsculas sin espacios de más)
    const map = new Map();
    currentList.forEach(entry => {
      map.set(entry.name.trim().toLowerCase(), { ...entry });
    });

    players.forEach(p => {
      const rawName = (p.name || '').trim();
      if (!rawName) return;

      const normKey = rawName.toLowerCase();
      const isImpostor = p.id === impostorId || p.isImpostor === true;
      const isWinner =
        (winner === 'IMPOSTOR' && isImpostor) ||
        (winner === 'INNOCENTS' && !isImpostor);

      let record = map.get(normKey);
      if (!record) {
        record = {
          name: rawName, // Conserva la capitalización ingresada
          wins: 0,
          gamesPlayed: 0,
          impostorWins: 0,
          innocentWins: 0,
          lastAvatar: p.avatar || 'shirt-10',
          lastPlayed: Date.now()
        };
      }

      // Acumular estadísticas
      record.name = rawName; // Actualizar con la capitalización más reciente
      record.gamesPlayed += 1;
      if (isWinner) {
        record.wins += 1;
        if (isImpostor) {
          record.impostorWins = (record.impostorWins || 0) + 1;
        } else {
          record.innocentWins = (record.innocentWins || 0) + 1;
        }
      }
      record.lastAvatar = p.avatar || record.lastAvatar;
      record.lastPlayed = Date.now();

      map.set(normKey, record);
    });

    const updated = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return getTopPlayers();
  } catch (err) {
    console.error('Error al guardar resultado del partido en el ranking:', err);
    return getTopPlayers();
  }
}

/**
 * Reinicia la tabla de clasificación.
 */
export function clearLeaderboard() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    lastRecordedMatchKey = null;
  } catch (err) {
    console.error('Error al reiniciar ranking:', err);
  }
}
