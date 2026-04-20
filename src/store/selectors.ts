import type { SeasonData } from '../engine/types';
import { isPass } from '../engine/types';
import type { AppState } from './useStore';

/** Materialize the active season with what-if episode overrides applied on top
 *  of the canonical (user-edited) season. Queens are always read directly from
 *  `seasonsById` — they have exactly one home. Pass episodes have no
 *  placements/eliminated to override, so any stale override at a pass index
 *  is ignored. */
export const selectCurrentSeason = (s: AppState): SeasonData => {
  const base = s.seasonsById[s.activeSeasonId];
  if (!base) throw new Error(`Unknown active season: ${s.activeSeasonId}`);
  const overrides = s.currentEpisodeOverrides;
  if (Object.keys(overrides).length === 0) return base;
  return {
    ...base,
    episodes: base.episodes.map((ep, i) => {
      const ov = overrides[i];
      if (!ov || isPass(ep)) return ep;
      return { ...ep, placements: ov.placements, eliminated: ov.eliminated };
    }),
  };
};

/** The active season without any what-if overrides applied.
 *  Used for running baselines (what-if filtering happens post-hoc against the buffer). */
export const selectBaselineSeason = (s: AppState): SeasonData => {
  const base = s.seasonsById[s.activeSeasonId];
  if (!base) throw new Error(`Unknown active season: ${s.activeSeasonId}`);
  return base;
};
