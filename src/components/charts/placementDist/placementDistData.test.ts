import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import { computePlacementDistData } from './placementDistData';

const fixture = () => runBaseline({
  season: season5, numSimulations: 1000, noise: 1.8, seed: 424242,
});

test('S5 placementDist data matches snapshot (rounded 6dp)', () => {
  const { results } = fixture();
  const data = computePlacementDistData(season5, results);
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  expect({
    queenOrder: data.queens.map((q) => q.queen.id),
    expectedPlaces: data.queens.map((q) => round(q.expectedPlace)),
    winProbs: data.queens.map((q) => round(q.winProb)),
    segments: data.queens.map((q) =>
      q.segments.map((s) => ({ place: s.place, prob: round(s.prob), cumBefore: round(s.cumBefore) })),
    ),
  }).toMatchSnapshot();
});

describe('computePlacementDistData invariants', () => {
  const { results } = fixture();
  const data = computePlacementDistData(season5, results);

  test('queens sorted descending by winProb (biggest gold bar on top)', () => {
    for (let i = 1; i < data.queens.length; i++) {
      expect(data.queens[i - 1].winProb).toBeGreaterThanOrEqual(data.queens[i].winProb);
    }
  });

  test('segment probabilities sum to 1 per queen', () => {
    for (const q of data.queens) {
      const total = q.segments.reduce((s, seg) => s + seg.prob, 0);
      expect(total, q.queen.id).toBeCloseTo(1, 6);
    }
  });

  test('cumBefore for each segment equals sum of probs of earlier segments', () => {
    for (const q of data.queens) {
      let running = 0;
      for (const seg of q.segments) {
        expect(seg.cumBefore, `${q.queen.id} place=${seg.place}`).toBeCloseTo(running, 10);
        running += seg.prob;
      }
    }
  });

  test('winProb equals placementDist[queen][1]', () => {
    for (const q of data.queens) {
      const raw = results.placementDist[q.queen.id]?.[1] ?? 0;
      expect(q.winProb).toBe(raw);
    }
  });

  test('expectedPlace = Σ p · place (place is 1-indexed within dist array; index 0 unused)', () => {
    // Independent recomputation from results.placementDist.
    for (const q of data.queens) {
      const dist = results.placementDist[q.queen.id] ?? [];
      let expected = 0;
      for (let i = 0; i < dist.length; i++) expected += dist[i] * i;
      expect(q.expectedPlace).toBeCloseTo(expected, 10);
    }
  });

  test('segments are ordered by place ascending (1, 2, 3, …)', () => {
    for (const q of data.queens) {
      for (let i = 0; i < q.segments.length; i++) {
        expect(q.segments[i].place).toBe(i + 1);
      }
    }
  });
});
