import type { Queen, SeasonData, SimulationResults } from '../../../engine/types';

/** Per-queen row for the placement-grid chart.
 *  Layout concerns (gradient stops, cell widths, band scales) stay in the
 *  component; the pure math here is the sort keys (argmax + expected) and
 *  the row-normalized squared brightness per cell. */
export interface PlacementGridRow {
  queen: Queen;
  /** 1-based place where dist has its highest mass. Primary sort key. */
  argmaxPlace: number;
  /** Σ p · place (1-indexed). Secondary sort key. */
  expectedPlace: number;
  /** brightness[place] = (p / rowMax)² ∈ [0, 1]. rowMax = max dist[1..N].
   *  Squared so visually-dominant cells pull ahead of low-probability cells;
   *  this matches the chart's existing look. Keys are 1..numQueens. */
  brightness: Record<number, number>;
  /** Raw dist slice [1..numQueens] aligned with `brightness` keys. Included
   *  so the chart can render tooltips without re-reading results. */
  probs: Record<number, number>;
}

export interface PlacementGridData {
  /** Queens ordered by (argmaxPlace asc, expectedPlace asc). Top row = most
   *  likely winner. */
  rows: PlacementGridRow[];
}

function argmaxPlace(dist: number[], numPlaces: number): number {
  let best = 1;
  let bestP = -Infinity;
  for (let i = 1; i <= numPlaces; i++) {
    const p = dist[i] ?? 0;
    if (p > bestP) {
      bestP = p;
      best = i;
    }
  }
  return best;
}

function expectedPlace(dist: number[]): number {
  let sum = 0;
  for (let i = 0; i < dist.length; i++) sum += dist[i] * i;
  return sum;
}

export function computePlacementGridData(
  season: SeasonData,
  results: SimulationResults,
): PlacementGridData {
  const numQueens = season.queens.length;

  const rows: PlacementGridRow[] = season.queens.map((queen) => {
    const dist = results.placementDist[queen.id] ?? [];
    const probs: Record<number, number> = {};
    const brightness: Record<number, number> = {};

    let rowMax = 0;
    for (let place = 1; place <= numQueens; place++) {
      const p = dist[place] ?? 0;
      probs[place] = p;
      if (p > rowMax) rowMax = p;
    }
    for (let place = 1; place <= numQueens; place++) {
      const norm = rowMax > 0 ? probs[place] / rowMax : 0;
      brightness[place] = norm * norm;
    }

    return {
      queen,
      argmaxPlace: argmaxPlace(dist, numQueens),
      expectedPlace: expectedPlace(dist),
      brightness,
      probs,
    };
  });

  rows.sort((a, b) =>
    a.argmaxPlace !== b.argmaxPlace
      ? a.argmaxPlace - b.argmaxPlace
      : a.expectedPlace - b.expectedPlace,
  );
  return { rows };
}
