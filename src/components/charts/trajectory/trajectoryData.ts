import type { SeasonData, SimulationResults } from '../../../engine/types';
import { PLACEMENTS } from '../../../engine/types';

/** Placements shown on the trajectory chart, ordered top→bottom with ELIM
 *  at the bottom. Chart code consumes this ordering for y-axis labels and
 *  percentile interpolation. */
export const CHART_PLACEMENTS = [...PLACEMENTS, 'ELIM'] as const;

/** Per-episode distribution across CHART_PLACEMENTS plus common percentile
 *  positions, expressed as FRACTIONAL INDICES into CHART_PLACEMENTS. The
 *  chart converts to pixel y via its own scale, keeping this module
 *  layout-agnostic. */
export interface TrajectoryEpData {
  ep: number;
  /** Per-placement probability conditional on alive at start of ep.
   *  Sums to 1. `ELIM` here is this episode's conditional elim prob
   *  (elim / survival), not the cumulative graveyard. */
  dist: Record<string, number>;
  /** P(alive at start of this ep). */
  survival: number;
  /** Fractional indices into CHART_PLACEMENTS for the given cumulative
   *  percentile of `dist`. 0 = top of chart (WIN), length-1 = bottom (ELIM). */
  p005: number;
  p05: number;
  p25: number;
  median: number;
  p75: number;
  p95: number;
  p995: number;
}

export interface TrajectoryData {
  /** Ordered per-episode stats up to and including the last ep where survival
   *  is meaningful (≥ 1e-3). Shorter than season.episodes when the queen is
   *  very likely eliminated mid-season. */
  epData: TrajectoryEpData[];
  /** Full-length per-ep survival (even after epData stops). */
  survival: number[];
}

/** Given a distribution and a target cumulative percentile `p ∈ [0, 1]`,
 *  return the fractional placement index where `p` falls along the cumulative
 *  curve. Exported for chart use so the y-pixel interpolation can be unit-
 *  tested separately from the data derivation. */
export function percentileIndex(
  dist: Record<string, number>,
  p: number,
): number {
  let cumProb = 0;
  for (let i = 0; i < CHART_PLACEMENTS.length; i++) {
    const prevCum = cumProb;
    cumProb += dist[CHART_PLACEMENTS[i]] ?? 0;
    if (cumProb >= p - 1e-9) {
      if (i === 0 || prevCum >= p - 1e-9) return i;
      const frac = (p - prevCum) / (cumProb - prevCum);
      return i - 1 + frac;
    }
  }
  return CHART_PLACEMENTS.length - 1;
}

export function computeTrajectoryData(
  season: SeasonData,
  results: SimulationResults,
  queenId: string,
): TrajectoryData {
  const numEps = season.episodes.length;

  // Survival = 1 minus cumulative elimination prob up to (but not including) ep.
  const survival: number[] = [];
  for (let ep = 0; ep < numEps; ep++) {
    let cumElim = 0;
    for (let e = 0; e < ep; e++) {
      cumElim += results.elimProbByEpisode[e]?.[queenId] ?? 0;
    }
    survival.push(Math.max(0, 1 - cumElim));
  }

  const epData: TrajectoryEpData[] = [];
  for (let ep = 0; ep < numEps; ep++) {
    const rawDist = results.episodePlacements[ep]?.[queenId];
    if (!rawDist) break;
    const elim = results.elimProbByEpisode[ep]?.[queenId] ?? 0;
    const surv = survival[ep];
    if (surv < 1e-3) break;

    const dist: Record<string, number> = {};
    for (const p of PLACEMENTS) dist[p] = rawDist[p] ?? 0;
    // Conditional on being alive at start of this ep. ELIM entry is this ep's
    // elimination share of the survival mass.
    dist.ELIM = elim / surv;

    epData.push({
      ep: ep + 1,
      dist,
      survival: surv,
      p005: percentileIndex(dist, 0.005),
      p05: percentileIndex(dist, 0.05),
      p25: percentileIndex(dist, 0.25),
      median: percentileIndex(dist, 0.5),
      p75: percentileIndex(dist, 0.75),
      p95: percentileIndex(dist, 0.95),
      p995: percentileIndex(dist, 0.995),
    });
  }

  return { epData, survival };
}
