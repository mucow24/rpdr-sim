import { SEASON_PRESETS } from '../data/presets';
import { queenUid, type Queen, type EpisodeData } from '../engine/types';

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

/** v3 → v4: normalize the data layer.
 *
 *  Before: `seasonsById[s].queens[]` carries each queen's stats inline. A custom
 *  cast (via `setSeasonCast`) deep-copies foreign queens, so a queen could
 *  exist as two independent records — one in her home season, one in the
 *  custom cast — and Calibrate edits the home copy while the sim reads the
 *  cast copy. Bug.
 *
 *  After: stats live in `queensById[homeSeason:queenId]` (single source of
 *  truth). Casts hold queen-key arrays. Episode lists live separately.
 *  Plus session state (currentCast / currentEpisodes) seeded from the active
 *  season at migration time.
 *
 *  Spine: SEASON_PRESETS. Every preset queen is guaranteed to exist in
 *  `queensById` even if a user nuked them from a cast. For each preset queen
 *  we prefer the live (potentially calibrated) copy from the v3 payload's
 *  home-season cast over the immutable preset stats — that's the row Calibrate
 *  has been editing, so it carries any user edits.
 *
 *  Home-season disambiguation: today's queen ids are unique within a season
 *  but four queens (Shangela S2/S3, Cynthia S8/S9, Eureka S9/S10, Vanjie
 *  S10/S11) share an id across two seasons. When mapping a v3 cast queen to
 *  her home, we first check whether she's a preset native of that same season
 *  (handles the four duplicates), and only fall back to scanning all presets
 *  for genuinely-foreign cast inserts. */
export function migrateToV4(persisted: unknown): unknown {
  if (!persisted || typeof persisted !== 'object') return persisted;
  const root = persisted as {
    seasonsById?: Record<string, unknown>;
    activeSeasonId?: string;
    currentEpisodeOverrides?: Record<number, unknown>;
    [k: string]: unknown;
  };
  const oldSeasonsById = root.seasonsById ?? {};

  // Helper: read a v3 season's queens array if it has one.
  const liveQueensFor = (seasonId: string): Queen[] => {
    const s = oldSeasonsById[seasonId];
    if (!s || typeof s !== 'object') return [];
    const qs = (s as { queens?: unknown }).queens;
    return Array.isArray(qs) ? (qs as Queen[]) : [];
  };

  // Build queensById from preset spine, preferring live (edited) stats.
  const queensById: Record<string, Queen> = {};
  for (const preset of SEASON_PRESETS) {
    const live = liveQueensFor(preset.id);
    for (const presetQ of preset.season.queens) {
      const liveQ = live.find((q) => q && q.id === presetQ.id);
      const src = liveQ ?? presetQ;
      queensById[queenUid(preset.id, presetQ.id)] = {
        id: src.id,
        name: src.name,
        skills: { ...src.skills },
        lipSync: src.lipSync,
        color: src.color,
      };
    }
  }

  // Build casts: walk each v3 season's queens in order, resolve home season
  // for each queen, emit composite keys.
  const presetIdsByQueenId = new Map<string, string[]>();
  for (const preset of SEASON_PRESETS) {
    for (const q of preset.season.queens) {
      const arr = presetIdsByQueenId.get(q.id) ?? [];
      arr.push(preset.id);
      presetIdsByQueenId.set(q.id, arr);
    }
  }

  const casts: Record<string, string[]> = {};
  for (const preset of SEASON_PRESETS) {
    const live = liveQueensFor(preset.id);
    if (live.length === 0) {
      // Use preset cast if we have nothing live (e.g. a season missing from v3).
      casts[preset.id] = preset.season.queens.map((q) => queenUid(preset.id, q.id));
      continue;
    }
    casts[preset.id] = live.map((q) => {
      const candidates = presetIdsByQueenId.get(q.id) ?? [];
      // If preset.id is among the candidates (i.e. q is a native of this
      // season's preset roster), it wins — handles same-id cross-season
      // queens correctly.
      const homeId = candidates.includes(preset.id)
        ? preset.id
        : (candidates[0] ?? preset.id);
      return queenUid(homeId, q.id);
    });
  }

  // episodeLists: structural extraction.
  const episodeLists: Record<string, EpisodeData[]> = {};
  const seasonsMeta: Record<string, { name: string }> = {};
  for (const preset of SEASON_PRESETS) {
    const s = oldSeasonsById[preset.id];
    if (s && typeof s === 'object') {
      const eps = (s as { episodes?: unknown }).episodes;
      episodeLists[preset.id] = Array.isArray(eps)
        ? (eps as EpisodeData[]).map((ep) => ({ ...ep }))
        : preset.season.episodes.map((ep) => ({ ...ep }));
      const name = (s as { name?: unknown }).name;
      seasonsMeta[preset.id] = {
        name: typeof name === 'string' ? name : preset.season.name,
      };
    } else {
      episodeLists[preset.id] = preset.season.episodes.map((ep) => ({ ...ep }));
      seasonsMeta[preset.id] = { name: preset.season.name };
    }
  }

  // Initialize session from active season.
  const activeSeasonId =
    typeof root.activeSeasonId === 'string' && casts[root.activeSeasonId]
      ? root.activeSeasonId
      : 'season5';
  const currentCast = [...(casts[activeSeasonId] ?? [])];
  const currentEpisodes = (episodeLists[activeSeasonId] ?? []).map((ep) => ({ ...ep }));
  const currentEpisodeOverrides = root.currentEpisodeOverrides ?? {};

  // Strip the old field; carry forward anything else (numSimulations,
  // enabledCalibrateSeasons).
  const {
    seasonsById: _drop1,
    activeSeasonId: _drop2,
    currentEpisodeOverrides: _drop3,
    ...rest
  } = root;
  void _drop1; void _drop2; void _drop3;

  return {
    ...rest,
    queensById,
    casts,
    episodeLists,
    seasonsMeta,
    activeSeasonId,
    currentCast,
    currentEpisodes,
    currentEpisodeOverrides,
  };
}
