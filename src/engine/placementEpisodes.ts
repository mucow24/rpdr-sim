import type { SeasonData } from './types';
import { isFinale } from './types';
import { ARCHETYPES } from '../data/archetypes';

/** Emoji shown for a finale placement. Finales have no archetype, so we use
 *  the crown — the Drag Race finale emblem. */
const FINALE_ICON = '👑';

/**
 * Map each final placement (1 = winner, N = first eliminated) to a human-
 * readable label describing the episode where that placement was decided.
 * Pre-finale eliminations produce `Episode ${ep.number}`; the top queens who
 * reach the finale all get `Finale` regardless of the finale's internal
 * structure.
 *
 * Also returns `finaleCohortSize` (how many queens reached the finale), since
 * both outputs fall out of the same single pass over episodes.
 *
 * Robust to:
 *   - pass episodes (no eliminations) — they contribute nothing to the map
 *   - non-contiguous `ep.number` values — the raw number is echoed into the label
 *   - double elims — two consecutive places share the same episode label
 *   - multi-part / missing finale episodes — anything not eliminated pre-finale
 *     lands in the finale cohort
 */
export function placementEpisodeLabels(season: SeasonData): {
  labels: Record<number, string>;
  finaleCohortSize: number;
} {
  const numQueens = season.queens.length;
  const labels: Record<number, string> = {};

  let cumElims = 0;
  for (const ep of season.episodes) {
    if (isFinale(ep)) continue;
    const n = ep.eliminated.length;
    const icon = ARCHETYPES[ep.archetype].icon;
    // Queens eliminated in this episode fill places
    // [N - cumElims - n + 1 .. N - cumElims], descending by order in the array.
    for (let i = 0; i < n; i++) {
      const place = numQueens - cumElims - i;
      labels[place] = `Episode ${ep.number} ${icon}`;
    }
    cumElims += n;
  }

  const finaleCohortSize = numQueens - cumElims;
  for (let p = 1; p <= finaleCohortSize; p++) {
    labels[p] = `Finale ${FINALE_ICON}`;
  }

  return { labels, finaleCohortSize };
}
