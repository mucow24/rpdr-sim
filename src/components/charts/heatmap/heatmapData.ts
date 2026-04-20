import type { Queen, SeasonData, SimulationResults } from '../../../engine/types';
import { isFinale, isPass } from '../../../engine/types';

/** Heatmap cell values are the conditional sashay risk:
 *    P(eliminated this ep | alive at start of this ep) = elim / alive
 *  Non-elim episodes (pass-throughs, non-elim regular eps) are flagged so
 *  the chart can render them differently; the numeric risk is still defined
 *  (typically 0) but the UI may render a neutral-X icon instead of a gradient
 *  cell. Finales are considered elim episodes — they eliminate everyone but
 *  the winner.
 *
 *  Pure in (season, results); chart layout (band scales, palette, etc.) stays
 *  in the component. */
export interface HeatmapCell {
  /** Queen row identifier. */
  queenId: string;
  /** Episode array index (0-based). */
  epIdx: number;
  /** Episode number as authored on season.episodes[epIdx]. */
  epNumber: number;
  /** Conditional sashay risk in [0, 1]. 0 when the queen was never alive. */
  risk: number;
  /** P(alive at start of this ep). The chart uses this to distinguish
   *  "definitely eliminated already" (render dim) from "was at risk, survived
   *  probabilistically" (render the gradient). */
  alive: number;
  /** True if this episode is a pass-through or regular non-elim — the chart
   *  typically marks these as "not at risk" rather than "zero risk". */
  isNonElim: boolean;
}

export interface HeatmapData {
  /** Queens sorted desc by season-level winProb — strongest on top. */
  queenOrder: Queen[];
  /** Episode numbers (as authored), one per epIdx. */
  episodeNumbers: number[];
  /** Episode numbers that are finales. */
  finaleEpNumbers: Set<number>;
  /** Episode numbers with no scheduled elimination (pass eps + non-elim regular). */
  nonElimEpNumbers: Set<number>;
  /** Row-major: cells[queenIdx][epIdx]. */
  cells: HeatmapCell[][];
}

export function computeHeatmapData(
  season: SeasonData,
  results: SimulationResults,
): HeatmapData {
  const queenOrder = [...season.queens].sort(
    (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
  );
  const episodeNumbers = season.episodes.map((e) => e.number);

  const finaleEpNumbers = new Set(
    season.episodes.filter(isFinale).map((e) => e.number),
  );
  const nonElimEpNumbers = new Set(
    season.episodes
      .filter((e) => isPass(e) || (!isFinale(e) && e.eliminated.length === 0))
      .map((e) => e.number),
  );

  const cells: HeatmapCell[][] = queenOrder.map((q) =>
    season.episodes.map((ep, epIdx) => {
      const alive = results.aliveProbByEpisode[epIdx]?.[q.id] ?? 0;
      const elim = results.elimProbByEpisode[epIdx]?.[q.id] ?? 0;
      const risk = alive > 0 ? elim / alive : 0;
      return {
        queenId: q.id,
        epIdx,
        epNumber: ep.number,
        risk,
        alive,
        isNonElim: nonElimEpNumbers.has(ep.number),
      };
    }),
  );

  return { queenOrder, episodeNumbers, finaleEpNumbers, nonElimEpNumbers, cells };
}
