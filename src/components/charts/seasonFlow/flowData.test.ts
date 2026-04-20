/** Golden snapshot for the SeasonFlowChart's per-queen flow derivation.
 *  Locks in survival/flow/elim shape so future refactors of the chart's
 *  geometry layer can't quietly drift the underlying probabilities. */

import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import { computeFlowData } from './flowData';

test('S5 flow data matches snapshot under fixed seed', () => {
  const { results } = runBaseline({
    season: season5,
    numSimulations: 1000,
    noise: 1.8,
    seed: 424242,
  });
  const flow = computeFlowData(season5, results);

  // Round all numeric leaves to 6dp for snapshot stability.
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  const roundArr = (arr: number[]) => arr.map(round);
  const roundFlowMap = (rec: Record<string, number>) =>
    Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, round(v)]));

  expect({
    queenOrder: flow.queenOrder.map((q) => q.id),
    survival: Object.fromEntries(
      Object.entries(flow.survival).map(([q, arr]) => [q, roundArr(arr)]),
    ),
    elimByEp: Object.fromEntries(
      Object.entries(flow.elimByEp).map(([q, arr]) => [q, roundArr(arr)]),
    ),
    flow: Object.fromEntries(
      Object.entries(flow.flow).map(([q, eps]) => [q, eps.map(roundFlowMap)]),
    ),
  }).toMatchSnapshot();
});

describe('computeFlowData invariants', () => {
  const { results } = runBaseline({
    season: season5,
    numSimulations: 1000,
    noise: 1.8,
    seed: 424242,
  });
  const flow = computeFlowData(season5, results);

  test('survival is monotonically non-increasing', () => {
    for (const q of season5.queens) {
      const surv = flow.survival[q.id];
      for (let ep = 1; ep < surv.length; ep++) {
        expect(surv[ep]).toBeLessThanOrEqual(surv[ep - 1] + 1e-9);
      }
    }
  });

  test('every queen starts with survival = 1', () => {
    for (const q of season5.queens) {
      expect(flow.survival[q.id][0]).toBeCloseTo(1, 9);
    }
  });

  test('survival + cumulative-ELIM-prior-to-this-ep sums to ~1 at every episode', () => {
    // `survival[ep]` is alive-at-start-of-ep; `flow[ep]['ELIM']` is cumulative
    // INCLUDING this episode's elim. So the invariant is between survival[ep]
    // and cumulative ELIM as of episode (ep-1) — i.e. `flow[ep][ELIM] - elimByEp[ep]`.
    for (const q of season5.queens) {
      for (let ep = 0; ep < season5.episodes.length; ep++) {
        const cumElimBefore = flow.flow[q.id][ep]['ELIM'] - flow.elimByEp[q.id][ep];
        const surv = flow.survival[q.id][ep];
        expect(cumElimBefore + surv).toBeCloseTo(1, 6);
      }
    }
  });
});
