import type { SeasonData, SimulationResults } from '../../../engine/types';

/** Per-queen survival-probability trajectory across a season, ready to hand to
 *  d3.line() without further transformation. Invariants relied on by the chart:
 *  values ∈ [0,1], `idx` dense from 0..numEps-1, and the outer array is sorted
 *  descending by season-level win probability (strongest on top in the legend).
 *
 *  Derivation is pure in `(season, results)` — chart sizing and DOM concerns
 *  stay in the component. Keeping it out of `.tsx` is what makes it testable. */
export interface LinePoint {
  idx: number;
  prob: number;
}

export interface QueenLine {
  queenId: string;
  points: LinePoint[];
}

export interface WinProbData {
  /** Episode numbers as authored on the season, one per index. */
  episodeNumbers: number[];
  /** Survival curves, sorted desc by overall winProb. */
  lines: QueenLine[];
  /** Baseline (un-filtered) overlay when the caller passes both filtered and
   *  baseline results — lets the chart ghost in the unfiltered distribution.
   *  Null when there is no divergence to show. */
  baselineLines: QueenLine[] | null;
}

function buildLines(
  season: SeasonData,
  aliveProbByEpisode: Record<string, number>[],
): QueenLine[] {
  return season.queens.map((q) => ({
    queenId: q.id,
    points: season.episodes.map((_, i) => ({
      idx: i,
      prob: aliveProbByEpisode[i]?.[q.id] ?? 0,
    })),
  }));
}

/** `baselineResults` is optional — when supplied AND distinct from `results`,
 *  the baseline overlay is computed. Passing the same object twice yields a
 *  null overlay (no divergence). */
export function computeWinProbData(
  season: SeasonData,
  results: SimulationResults,
  baselineResults?: SimulationResults | null,
): WinProbData {
  const lines = buildLines(season, results.aliveProbByEpisode);
  lines.sort(
    (a, b) => (results.winProb[b.queenId] ?? 0) - (results.winProb[a.queenId] ?? 0),
  );
  const baselineLines =
    baselineResults && baselineResults !== results
      ? buildLines(season, baselineResults.aliveProbByEpisode)
      : null;
  return {
    episodeNumbers: season.episodes.map((e) => e.number),
    lines,
    baselineLines,
  };
}
