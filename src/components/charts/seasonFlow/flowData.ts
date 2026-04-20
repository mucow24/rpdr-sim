import type { Queen, SeasonData, SimulationResults } from '../../../engine/types';
import { PLACEMENTS } from '../../../engine/types';

/** Per-queen, per-episode flow data — pure derivation from a season + results
 *  pair, independent of chart width / hover state / selection.
 *
 *  - `queenOrder`: queens sorted best-first by win probability (the canonical
 *     stacking order for the source column and ribbon priority).
 *  - `survival[qid][ep]`: P(queen alive at start of episode `ep`).
 *  - `flow[qid][ep][placement]`: probability mass for this queen in this
 *    placement at this episode, scaled to the queen's surviving share.
 *    `flow[qid][ep]['ELIM']` is cumulative — the running graveyard share.
 *  - `elimByEp[qid][ep]`: per-episode elimination probability (un-cumulative). */
export interface FlowData {
  queenOrder: Queen[];
  survival: Record<string, number[]>;
  flow: Record<string, Record<string, number>[]>;
  elimByEp: Record<string, number[]>;
}

export function computeFlowData(season: SeasonData, results: SimulationResults): FlowData {
  const numEps = season.episodes.length;
  const queenOrder = [...season.queens].sort(
    (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
  );

  const survival: Record<string, number[]> = {};
  const flow: Record<string, Record<string, number>[]> = {};
  const elimByEp: Record<string, number[]> = {};

  for (const q of season.queens) {
    survival[q.id] = [];
    flow[q.id] = [];
    elimByEp[q.id] = [];
    let surv = 1.0;
    let cumElim = 0;
    for (let ep = 0; ep < numEps; ep++) {
      survival[q.id][ep] = surv;
      const dist = results.episodePlacements[ep]?.[q.id] ?? {};
      const f: Record<string, number> = {};
      for (const p of PLACEMENTS) f[p] = surv * (dist[p] ?? 0);
      const elim = results.elimProbByEpisode[ep]?.[q.id] ?? 0;
      elimByEp[q.id][ep] = elim;
      f['ELIM'] = cumElim + elim;
      flow[q.id][ep] = f;
      surv = Math.max(0, surv - elim);
      cumElim += elim;
    }
  }

  return { queenOrder, survival, flow, elimByEp };
}
