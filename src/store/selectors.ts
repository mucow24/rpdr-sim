import type { Queen, SeasonData, EpisodeData } from '../engine/types';
import { isPass } from '../engine/types';
import type { AppState } from './useStore';

/** Module-level cache for the materialized "baseline season" — i.e. the
 *  SeasonData object built from `currentCast` + `currentEpisodes` + the queen
 *  registry. Returns the same reference until any of those inputs change.
 *
 *  Why: ~30 read sites (charts, queen panels, sim engine, trajectory view)
 *  consume `season.queens` and `season.episodes`. If we built a fresh object
 *  on every call, every store touch would invalidate every subscriber, even
 *  for unrelated fields (`numSimulations`, sim progress, etc.). Caching
 *  preserves the single-store-app invariant we relied on before the refactor:
 *  components only re-render when the active season's data actually changes.
 *
 *  Single-store assumption: this file owns one cache. If a second store ever
 *  exists, both would share the cache — fine for tests (which reseed the
 *  store) but worth noting.
 */
let baselineCache: {
  activeSeasonId: string;
  currentCast: string[];
  currentEpisodes: EpisodeData[];
  queensById: Record<string, Queen>;
  seasonsMeta: Record<string, { name: string }>;
  result: SeasonData;
} | null = null;

/** The active season as the simulator and chart code consume it: queens
 *  resolved from the registry, episodes taken from session state, no what-if
 *  overrides applied. */
export const selectBaselineSeason = (s: AppState): SeasonData => {
  if (
    baselineCache !== null &&
    baselineCache.activeSeasonId === s.activeSeasonId &&
    baselineCache.currentCast === s.currentCast &&
    baselineCache.currentEpisodes === s.currentEpisodes &&
    baselineCache.queensById === s.queensById &&
    baselineCache.seasonsMeta === s.seasonsMeta
  ) {
    return baselineCache.result;
  }
  const queens = s.currentCast
    .map((k) => s.queensById[k])
    .filter((q): q is Queen => q !== undefined);
  const result: SeasonData = {
    id: s.activeSeasonId,
    name: s.seasonsMeta[s.activeSeasonId]?.name ?? s.activeSeasonId,
    queens,
    episodes: s.currentEpisodes,
  };
  baselineCache = {
    activeSeasonId: s.activeSeasonId,
    currentCast: s.currentCast,
    currentEpisodes: s.currentEpisodes,
    queensById: s.queensById,
    seasonsMeta: s.seasonsMeta,
    result,
  };
  return result;
};

/** Module-level cache for the materialized "current season" with what-if
 *  overrides applied. When overrides are empty we just return the baseline
 *  reference (same shape as today's selector). When non-empty, we cache the
 *  override-overlaid result keyed by (baseline, overrides). */
let currentCache: {
  baseline: SeasonData;
  overrides: Record<number, unknown>;
  result: SeasonData;
} | null = null;

/** The active season with what-if episode overrides overlaid. Pass episodes
 *  ignore overrides (no placements/eliminated to override). */
export const selectCurrentSeason = (s: AppState): SeasonData => {
  const base = selectBaselineSeason(s);
  if (Object.keys(s.currentEpisodeOverrides).length === 0) return base;
  if (
    currentCache !== null &&
    currentCache.baseline === base &&
    currentCache.overrides === s.currentEpisodeOverrides
  ) {
    return currentCache.result;
  }
  const result: SeasonData = {
    ...base,
    episodes: base.episodes.map((ep, i) => {
      const ov = s.currentEpisodeOverrides[i];
      if (!ov || isPass(ep)) return ep;
      return { ...ep, placements: ov.placements, eliminated: ov.eliminated };
    }),
  };
  currentCache = { baseline: base, overrides: s.currentEpisodeOverrides, result };
  return result;
};
