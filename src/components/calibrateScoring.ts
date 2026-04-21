import type { Placement } from '../engine/types';

export type PlacementOrElim = Placement | 'ELIM';

export interface HeavyEpisodeRow {
  epNumber: number;
  challengeName: string;
  icon: string;
  placement: PlacementOrElim;
  /** Selected stat's share of total archetype weight for this episode (0-1). */
  statShare: number;
}

// Base value for the 1st occurrence of each outcome, plus per-occurrence step.
// Repeat wins/highs grow more valuable; repeat bottoms hurt more. ELIM is
// computed separately (see skillScore).
const PLACEMENT_BASE: Record<Exclude<PlacementOrElim, 'ELIM'>, number> = {
  WIN: 7,
  HIGH: 3,
  SAFE: 1,
  LOW: -3,
  BTM2: -6,
};
const PLACEMENT_STEP: Record<Exclude<PlacementOrElim, 'ELIM'>, number> = {
  WIN: 1,
  HIGH: 0.5,
  SAFE: 0.25,
  LOW: -0.5,
  BTM2: -1,
};

export function skillScore(rows: HeavyEpisodeRow[]): number {
  const counts: Record<PlacementOrElim, number> = {
    WIN: 0, HIGH: 0, SAFE: 0, LOW: 0, BTM2: 0, ELIM: 0,
  };
  let weightedSum = 0;
  let totalShare = 0;
  for (const row of rows) {
    let value: number;
    if (row.placement === 'ELIM') {
      // ELIM value floors at -10, but if the queen has already accumulated
      // BTM2s, match the escalating BTM2 track minus 4 when that's harsher.
      const nextBtm = PLACEMENT_BASE.BTM2 + counts.BTM2 * PLACEMENT_STEP.BTM2;
      value = Math.min(-10, nextBtm - 4);
    } else {
      value = PLACEMENT_BASE[row.placement] + counts[row.placement] * PLACEMENT_STEP[row.placement];
    }
    counts[row.placement]++;
    weightedSum += row.statShare * value;
    totalShare += row.statShare;
  }
  return totalShare > 0 ? weightedSum / totalShare : 0;
}
