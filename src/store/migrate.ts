/** Migration for the zustand persist middleware.
 *
 *  v1 → v2 is deliberately destructive: the v1 payload held a single `realSeason`
 *  (hardcoded to S5) plus per-tab editor scratch state, and had fallen out of
 *  sync with the source .ts files (zero-stat queens). Since the canonical data
 *  lives in the .ts files and the Data tab's "Reload queens / Reload seasons"
 *  flow can re-seed at any time, the cleanest migration is to drop the v1
 *  payload and let the store fall back to its initial state (seeded from
 *  SEASON_PRESETS).
 *
 *  Future (v2 → v3+) migrations should be additive — preserving user edits
 *  stored under the v2 shape rather than wiping. Returning `null` here tells
 *  zustand to use the initial state as-is.
 */
export function migrateToV2(persisted: unknown, version: number): unknown {
  if (!persisted || version < 2) {
    return null;
  }
  return persisted;
}

/** v2 → v3: pre-S6 winner immunity. Backfills `grantsImmunity: true` on the
 *  canonical S1–S5 episodes whose winners historically protected the next
 *  episode's bottom slots. Additive — leaves all other user edits intact.
 *  Episode lookup is by `number` (not array index) since episode arrays may
 *  have gaps (e.g. S3 omits its casting-special ep 1). */
const IMMUNITY_DEFAULTS: Record<string, ReadonlySet<number>> = {
  season1: new Set([1, 2, 3]),
  season2: new Set([1, 2, 3, 4, 5]),
  season3: new Set([2, 4, 5]),
  season4: new Set([1, 3, 4, 5]),
  season5: new Set([1, 2, 3, 4]),
};

export function migrateToV3(persisted: unknown): unknown {
  if (!persisted || typeof persisted !== 'object') return persisted;
  const root = persisted as { seasonsById?: Record<string, unknown> };
  const seasonsById = root.seasonsById;
  if (!seasonsById || typeof seasonsById !== 'object') return persisted;

  const nextSeasonsById: Record<string, unknown> = {};
  for (const [seasonId, seasonRaw] of Object.entries(seasonsById)) {
    const targetEps = IMMUNITY_DEFAULTS[seasonId];
    if (!targetEps || !seasonRaw || typeof seasonRaw !== 'object') {
      nextSeasonsById[seasonId] = seasonRaw;
      continue;
    }
    const season = seasonRaw as { episodes?: unknown[] };
    if (!Array.isArray(season.episodes)) {
      nextSeasonsById[seasonId] = seasonRaw;
      continue;
    }
    const nextEpisodes = season.episodes.map((ep) => {
      if (!ep || typeof ep !== 'object') return ep;
      const e = ep as { number?: number; kind?: string };
      // Only regular episodes get the field. Pass and finale lack `grantsImmunity`
      // semantically; their `kind` discriminator is set, regular's is undefined.
      if (e.kind === 'pass' || e.kind === 'finale') return ep;
      if (typeof e.number !== 'number' || !targetEps.has(e.number)) return ep;
      return { ...ep, grantsImmunity: true };
    });
    nextSeasonsById[seasonId] = { ...seasonRaw, episodes: nextEpisodes };
  }
  return { ...root, seasonsById: nextSeasonsById };
}
