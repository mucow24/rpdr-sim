import type { Queen, SeasonData, SimulationResults } from '../../../engine/types';
import { PLACEMENTS } from '../../../engine/types';

/** Per-queen, per-episode flow data — pure derivation from a season + results
 *  pair, independent of chart width / hover state / selection.
 *
 *  - `queenOrder`: queens sorted best-first by win probability (the canonical
 *     stacking order for the source column and ribbon priority).
 *  - `survival[qid][ep]`: P(queen alive at start of episode `ep`).
 *  - `survivalR0[qid][ep]`: same, but in the r=0 counterfactual lineage.
 *    Mirrors `survival` (so deltas are zero) when no r=0 baseline was supplied.
 *  - `flow[qid][ep][placement]`: probability mass for this queen in this
 *    placement at this episode, scaled to the queen's surviving share.
 *    `flow[qid][ep]['ELIM']` is cumulative — the running graveyard share.
 *  - `elimByEp[qid][ep]`: per-episode elimination probability (un-cumulative).
 *  - `riggedBTM2[qid][ep]`: additional BTM2 mass attributable to riggory > 0,
 *    computed as max(0, flow_r[BTM2] − flow_r0[BTM2]). Always present; zero
 *    everywhere when no r=0 baseline was supplied. Same scale as `flow`
 *    (queen-relative survival share). */
export interface FlowData {
  queenOrder: Queen[];
  survival: Record<string, number[]>;
  survivalR0: Record<string, number[]>;
  flow: Record<string, Record<string, number>[]>;
  elimByEp: Record<string, number[]>;
  riggedBTM2: Record<string, number[]>;
}

export function computeFlowData(
  season: SeasonData,
  results: SimulationResults,
  r0Results?: SimulationResults | null,
): FlowData {
  const numEps = season.episodes.length;
  const queenOrder = [...season.queens].sort(
    (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
  );

  const survival: Record<string, number[]> = {};
  const survivalR0: Record<string, number[]> = {};
  const flow: Record<string, Record<string, number>[]> = {};
  const elimByEp: Record<string, number[]> = {};
  const riggedBTM2: Record<string, number[]> = {};

  for (const q of season.queens) {
    survival[q.id] = [];
    survivalR0[q.id] = [];
    flow[q.id] = [];
    elimByEp[q.id] = [];
    riggedBTM2[q.id] = [];
    let surv = 1.0;
    let survR0 = 1.0;
    let cumElim = 0;
    for (let ep = 0; ep < numEps; ep++) {
      survival[q.id][ep] = surv;
      survivalR0[q.id][ep] = r0Results ? survR0 : surv;
      const dist = results.episodePlacements[ep]?.[q.id] ?? {};
      const f: Record<string, number> = {};
      for (const p of PLACEMENTS) f[p] = surv * (dist[p] ?? 0);
      const elim = results.elimProbByEpisode[ep]?.[q.id] ?? 0;
      elimByEp[q.id][ep] = elim;
      f['ELIM'] = cumElim + elim;
      flow[q.id][ep] = f;
      surv = Math.max(0, surv - elim);
      cumElim += elim;

      // Rigged-BTM2 share: positive iff this queen lands in BTM2 more often
      // under the active riggory than at r=0. Because riggory only redistributes
      // within the per-episode (BTM2 + ELIM) pair (the maxi-challenge picks
      // bottom-2 independently of riggory), this is also the magnitude of the
      // ELIM mass shifted into BTM2 for this queen at this episode. Computed
      // in scaled-flow space (multiplied by surv and survR0 respectively) so
      // it composes cleanly with the BTM2 band height.
      if (r0Results) {
        const distR0 = r0Results.episodePlacements[ep]?.[q.id] ?? {};
        const btm2R = surv * (dist['BTM2'] ?? 0);
        // Recompute BTM2 in r0's own survival lineage — using `surv` (from the
        // active sim) here would double-count: a queen rigged-saved earlier
        // accumulates more `surv`, and her r0 BTM2 share scales by survR0,
        // not surv.
        const btm2R0 = survR0 * (distR0['BTM2'] ?? 0);
        riggedBTM2[q.id][ep] = Math.max(0, btm2R - btm2R0);
        // Advance r0 survival lineage independently.
        const elimR0 = r0Results.elimProbByEpisode[ep]?.[q.id] ?? 0;
        survR0 = Math.max(0, survR0 - elimR0);
      } else {
        riggedBTM2[q.id][ep] = 0;
      }
    }
  }

  return { queenOrder, survival, survivalR0, flow, elimByEp, riggedBTM2 };
}
