import type { Queen, SeasonData, SimulationResults } from '../../../engine/types';

/** Stacked bar segment for a queen's final-placement distribution.
 *  Segments for a queen sum to exactly her `placementDist` total. Places
 *  below a probability threshold are dropped by the CHART, not here — the
 *  raw data keeps every place so tests can verify the sum. */
export interface PlacementBarSegment {
  /** 1-based final placement (1 = winner). */
  place: number;
  /** P(queen finishes in this place). */
  prob: number;
  /** Cumulative probability of placements BEFORE this one (sum of all better
   *  places, used as the left edge of the stacked segment). */
  cumBefore: number;
}

export interface PlacementDistQueen {
  queen: Queen;
  /** Σ p · place (1-indexed). Lower = better. */
  expectedPlace: number;
  /** P(queen wins) = placementDist[queen.id][1]. Convenience for the label. */
  winProb: number;
  segments: PlacementBarSegment[];
}

export interface PlacementDistData {
  /** Queens sorted by P(win) descending — biggest gold bar on top, matching
   *  the flow chart's sort order. */
  queens: PlacementDistQueen[];
}

export function computePlacementDistData(
  season: SeasonData,
  results: SimulationResults,
): PlacementDistData {
  const rows: PlacementDistQueen[] = season.queens.map((queen) => {
    const dist = results.placementDist[queen.id] ?? [];
    let expectedPlace = 0;
    for (let i = 0; i < dist.length; i++) expectedPlace += dist[i] * i;

    const segments: PlacementBarSegment[] = [];
    let cumBefore = 0;
    for (let place = 1; place < dist.length; place++) {
      const prob = dist[place];
      segments.push({ place, prob, cumBefore });
      cumBefore += prob;
    }

    return {
      queen,
      expectedPlace,
      winProb: dist[1] ?? 0,
      segments,
    };
  });

  rows.sort((a, b) => b.winProb - a.winProb);
  return { queens: rows };
}
