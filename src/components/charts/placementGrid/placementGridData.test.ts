import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import { computePlacementGridData } from './placementGridData';

const fixture = () => runBaseline({
  season: season5, numSimulations: 1000, noise: 1.8, seed: 424242,
});

test('S5 placementGrid data matches snapshot (rounded 6dp)', () => {
  const { results } = fixture();
  const data = computePlacementGridData(season5, results);
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  expect({
    queenOrder: data.rows.map((r) => r.queen.id),
    rows: data.rows.map((r) => ({
      queenId: r.queen.id,
      argmaxPlace: r.argmaxPlace,
      expectedPlace: round(r.expectedPlace),
      probs: Object.fromEntries(Object.entries(r.probs).map(([k, v]) => [k, round(v)])),
      brightness: Object.fromEntries(Object.entries(r.brightness).map(([k, v]) => [k, round(v)])),
    })),
  }).toMatchSnapshot();
});

describe('computePlacementGridData invariants', () => {
  const { results } = fixture();
  const data = computePlacementGridData(season5, results);
  const numQueens = season5.queens.length;

  test('row count matches queen count', () => {
    expect(data.rows).toHaveLength(numQueens);
  });

  test('sorted primarily by argmaxPlace ascending', () => {
    for (let i = 1; i < data.rows.length; i++) {
      expect(data.rows[i - 1].argmaxPlace).toBeLessThanOrEqual(data.rows[i].argmaxPlace);
    }
  });

  test('ties on argmaxPlace broken by expectedPlace ascending', () => {
    for (let i = 1; i < data.rows.length; i++) {
      if (data.rows[i - 1].argmaxPlace === data.rows[i].argmaxPlace) {
        expect(data.rows[i - 1].expectedPlace).toBeLessThanOrEqual(data.rows[i].expectedPlace + 1e-9);
      }
    }
  });

  test('argmaxPlace is in [1, numQueens]', () => {
    for (const row of data.rows) {
      expect(row.argmaxPlace).toBeGreaterThanOrEqual(1);
      expect(row.argmaxPlace).toBeLessThanOrEqual(numQueens);
    }
  });

  test('expectedPlace = Σ p · place', () => {
    for (const row of data.rows) {
      const raw = results.placementDist[row.queen.id] ?? [];
      const expected = raw.reduce((sum, p, i) => sum + p * i, 0);
      expect(row.expectedPlace).toBeCloseTo(expected, 10);
    }
  });

  test('brightness = (p / rowMax)² ∈ [0, 1]; argmax cell has brightness 1', () => {
    for (const row of data.rows) {
      const rowMax = Math.max(...Object.values(row.probs));
      for (const [placeStr, b] of Object.entries(row.brightness)) {
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(1);
        const place = +placeStr;
        const p = row.probs[place];
        const norm = rowMax > 0 ? p / rowMax : 0;
        expect(b).toBeCloseTo(norm * norm, 10);
      }
      // At argmax, brightness should hit 1 (row_max normalized = 1, squared = 1).
      expect(row.brightness[row.argmaxPlace]).toBeCloseTo(1, 9);
    }
  });

  test('probs keys are 1..numQueens (place 0 excluded; places > numQueens excluded)', () => {
    for (const row of data.rows) {
      const keys = Object.keys(row.probs).map(Number).sort((a, b) => a - b);
      const expectedKeys = Array.from({ length: numQueens }, (_, i) => i + 1);
      expect(keys).toEqual(expectedKeys);
    }
  });
});
