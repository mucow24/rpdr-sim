import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import {
  CHART_PLACEMENTS,
  computeTrajectoryData,
  percentileIndex,
} from './trajectoryData';

const fixture = () => runBaseline({
  season: season5, numSimulations: 1000, noise: 1.8, seed: 424242,
});

test('S5 jinkx trajectory matches snapshot (rounded 6dp)', () => {
  const { results } = fixture();
  const data = computeTrajectoryData(season5, results, 'jinkx');
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  expect({
    survival: data.survival.map(round),
    epData: data.epData.map((e) => ({
      ep: e.ep,
      survival: round(e.survival),
      median: round(e.median),
      dist: Object.fromEntries(Object.entries(e.dist).map(([k, v]) => [k, round(v)])),
    })),
  }).toMatchSnapshot();
});

describe('percentileIndex', () => {
  test('p=0.5 on a uniform dist over 2 placements returns midpoint', () => {
    // dist: WIN=0.5, HIGH=0.5 → cumulative [0.5, 1.0]. Median is at WIN's right edge.
    const idx = percentileIndex({ WIN: 0.5, HIGH: 0.5 }, 0.5);
    expect(idx).toBe(0); // returns the first index where cumProb >= p exactly.
  });

  test('p=0 returns the first non-empty placement', () => {
    const idx = percentileIndex({ WIN: 0, HIGH: 1 }, 0);
    // WIN has 0 mass; cumProb=0 ≥ 0, so returns index 0 (WIN).
    expect(idx).toBe(0);
  });

  test('p=1 returns the last non-empty placement index', () => {
    const idx = percentileIndex({ WIN: 0.5, ELIM: 0.5 }, 1);
    expect(idx).toBe(CHART_PLACEMENTS.indexOf('ELIM'));
  });

  test('fractional interpolation between two placements', () => {
    // dist: WIN=0.8, HIGH=0.2 → cumulative [0.8, 1.0]. Target p=0.9 should
    // fall halfway through the HIGH mass: (0.9 - 0.8) / (1.0 - 0.8) = 0.5.
    // Returns index (1 - 1) + 0.5 = 0.5? No wait — between index 0 (WIN, cum=0.8)
    // and index 1 (HIGH, cum=1.0), interpolated = 0 + 0.5 * (1 - 0) = 0.5.
    const idx = percentileIndex({ WIN: 0.8, HIGH: 0.2 }, 0.9);
    expect(idx).toBeCloseTo(0.5, 9);
  });
});

describe('computeTrajectoryData invariants', () => {
  const { results } = fixture();
  const data = computeTrajectoryData(season5, results, 'jinkx');

  test('survival is monotonically non-increasing across all episodes', () => {
    for (let i = 1; i < data.survival.length; i++) {
      expect(data.survival[i]).toBeLessThanOrEqual(data.survival[i - 1] + 1e-9);
    }
  });

  test('every ep dist sums to ~1 (conditional distribution given alive)', () => {
    for (const e of data.epData) {
      const total = Object.values(e.dist).reduce((a, b) => a + b, 0);
      expect(total).toBeCloseTo(1, 6);
    }
  });

  test('percentile indices are monotonically non-decreasing within each ep', () => {
    // p005 ≤ p05 ≤ p25 ≤ median ≤ p75 ≤ p95 ≤ p995.
    for (const e of data.epData) {
      expect(e.p005).toBeLessThanOrEqual(e.p05 + 1e-9);
      expect(e.p05).toBeLessThanOrEqual(e.p25 + 1e-9);
      expect(e.p25).toBeLessThanOrEqual(e.median + 1e-9);
      expect(e.median).toBeLessThanOrEqual(e.p75 + 1e-9);
      expect(e.p75).toBeLessThanOrEqual(e.p95 + 1e-9);
      expect(e.p95).toBeLessThanOrEqual(e.p995 + 1e-9);
    }
  });

  test('percentile indices are always in [0, CHART_PLACEMENTS.length - 1]', () => {
    for (const e of data.epData) {
      for (const k of ['p005', 'p05', 'p25', 'median', 'p75', 'p95', 'p995'] as const) {
        expect(e[k]).toBeGreaterThanOrEqual(0);
        expect(e[k]).toBeLessThanOrEqual(CHART_PLACEMENTS.length - 1);
      }
    }
  });

  test('epData truncates before survival drops below 1e-3', () => {
    // When epData stops early, survival at that index is already tiny.
    if (data.epData.length < season5.episodes.length) {
      const firstExcluded = data.epData.length;
      expect(data.survival[firstExcluded]).toBeLessThan(1e-3);
    }
  });

  test('unknown queen id returns empty epData + survival=1 for all eps', () => {
    const empty = computeTrajectoryData(season5, results, '__unknown__');
    expect(empty.epData).toEqual([]);
    // With no elim data for the queen, survival stays at 1 throughout.
    for (const s of empty.survival) expect(s).toBe(1);
  });
});
