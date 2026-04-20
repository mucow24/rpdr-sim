/** Invariant + snapshot coverage for WinProbChart's data derivation.
 *  The chart is beta — layout may churn, but the underlying probabilities
 *  and sort order should hold. Paired with one S5-seeded snapshot to catch
 *  silent drift. */

import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import { computeWinProbData } from './winProbData';

const fixture = () => runBaseline({
  season: season5, numSimulations: 1000, noise: 1.8, seed: 424242,
});

test('S5 winProb data matches snapshot (rounded 6dp)', () => {
  const { results } = fixture();
  const data = computeWinProbData(season5, results);
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  expect({
    episodeNumbers: data.episodeNumbers,
    queenOrder: data.lines.map((l) => l.queenId),
    lines: data.lines.map((l) => ({
      queenId: l.queenId,
      probs: l.points.map((p) => round(p.prob)),
    })),
    baselineLines: data.baselineLines,
  }).toMatchSnapshot();
});

describe('computeWinProbData invariants', () => {
  const { results } = fixture();
  const data = computeWinProbData(season5, results);

  test('lines sorted descending by winProb', () => {
    for (let i = 1; i < data.lines.length; i++) {
      const prev = results.winProb[data.lines[i - 1].queenId] ?? 0;
      const cur = results.winProb[data.lines[i].queenId] ?? 0;
      expect(prev).toBeGreaterThanOrEqual(cur);
    }
  });

  test('every probability is in [0, 1]', () => {
    for (const l of data.lines) {
      for (const p of l.points) {
        expect(p.prob).toBeGreaterThanOrEqual(0);
        expect(p.prob).toBeLessThanOrEqual(1);
      }
    }
  });

  test('per-episode sum of alive probs over all queens equals expected alive count', () => {
    // ∑ P(alive at ep | any run) = expected number of queens alive at start of ep.
    // At ep 0 this must equal exactly numQueens (everyone alive).
    const totalEp0 = data.lines.reduce((s, l) => s + l.points[0].prob, 0);
    expect(totalEp0).toBeCloseTo(season5.queens.length, 10);
    // At each ep, expected alive count is non-increasing across eps.
    const expectedAlive = data.lines[0].points.map((_, ep) =>
      data.lines.reduce((s, l) => s + l.points[ep].prob, 0),
    );
    for (let i = 1; i < expectedAlive.length; i++) {
      expect(expectedAlive[i]).toBeLessThanOrEqual(expectedAlive[i - 1] + 1e-9);
    }
  });

  test('points count equals episode count, and idx is dense 0..N-1', () => {
    for (const l of data.lines) {
      expect(l.points).toHaveLength(season5.episodes.length);
      for (let i = 0; i < l.points.length; i++) {
        expect(l.points[i].idx).toBe(i);
      }
    }
  });

  test('episodeNumbers are raw season.episodes.number values', () => {
    expect(data.episodeNumbers).toEqual(season5.episodes.map((e) => e.number));
  });
});

describe('baselineLines overlay', () => {
  test('null when caller passes only one results object', () => {
    const { results } = fixture();
    const data = computeWinProbData(season5, results);
    expect(data.baselineLines).toBeNull();
  });

  test('null when filtered and baseline are the same reference', () => {
    const { results } = fixture();
    const data = computeWinProbData(season5, results, results);
    expect(data.baselineLines).toBeNull();
  });

  test('populated when distinct results objects are supplied', () => {
    const { results: r1 } = fixture();
    const { results: r2 } = runBaseline({
      season: season5, numSimulations: 500, noise: 1.8, seed: 1,
    });
    const data = computeWinProbData(season5, r1, r2);
    expect(data.baselineLines).not.toBeNull();
    expect(data.baselineLines).toHaveLength(season5.queens.length);
  });
});
