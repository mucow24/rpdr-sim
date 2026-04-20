import { describe, test, expect } from 'vitest';
import { runBaseline } from '../../../engine/simulate';
import season5 from '../../../data/season5';
import { computeHeatmapData } from './heatmapData';

const fixture = () => runBaseline({
  season: season5, numSimulations: 1000, noise: 1.8, seed: 424242,
});

test('S5 heatmap data matches snapshot (rounded 6dp)', () => {
  const { results } = fixture();
  const data = computeHeatmapData(season5, results);
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  expect({
    queenOrder: data.queenOrder.map((q) => q.id),
    episodeNumbers: data.episodeNumbers,
    finaleEpNumbers: [...data.finaleEpNumbers].sort((a, b) => a - b),
    nonElimEpNumbers: [...data.nonElimEpNumbers].sort((a, b) => a - b),
    risks: data.cells.map((row) => row.map((c) => round(c.risk))),
  }).toMatchSnapshot();
});

describe('computeHeatmapData invariants', () => {
  const { results } = fixture();
  const data = computeHeatmapData(season5, results);

  test('queens sorted descending by winProb', () => {
    for (let i = 1; i < data.queenOrder.length; i++) {
      const prev = results.winProb[data.queenOrder[i - 1].id] ?? 0;
      const cur = results.winProb[data.queenOrder[i].id] ?? 0;
      expect(prev).toBeGreaterThanOrEqual(cur);
    }
  });

  test('every risk value is in [0, 1]', () => {
    for (const row of data.cells) {
      for (const cell of row) {
        expect(cell.risk).toBeGreaterThanOrEqual(0);
        expect(cell.risk).toBeLessThanOrEqual(1);
      }
    }
  });

  test('cells grid dimensions match (queens × episodes)', () => {
    expect(data.cells).toHaveLength(season5.queens.length);
    for (const row of data.cells) {
      expect(row).toHaveLength(season5.episodes.length);
    }
  });

  test('epIdx and epNumber align with season.episodes ordering', () => {
    for (const row of data.cells) {
      for (let i = 0; i < row.length; i++) {
        expect(row[i].epIdx).toBe(i);
        expect(row[i].epNumber).toBe(season5.episodes[i].number);
      }
    }
  });

  test('non-elim classification matches season structure (pass eps + non-elim regular)', () => {
    // Independently compute the expected set from season.episodes.
    const expected = new Set<number>();
    for (const ep of season5.episodes) {
      if (ep.kind === 'pass') expected.add(ep.number);
      else if (ep.kind !== 'finale' && ep.eliminated.length === 0) expected.add(ep.number);
    }
    expect(data.nonElimEpNumbers).toEqual(expected);
  });

  test('isNonElim flag on each cell matches nonElimEpNumbers membership', () => {
    for (const row of data.cells) {
      for (const cell of row) {
        expect(cell.isNonElim).toBe(data.nonElimEpNumbers.has(cell.epNumber));
      }
    }
  });
});
