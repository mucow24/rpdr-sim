/** Golden-snapshot anchor for the simulation engine.
 *
 *  Purpose: lock down byte-for-byte behavior of `runBaseline` + `filterAndAggregate`
 *  + `extractTrajectories` under a fixed seed so every later refactor in the
 *   architectural pass (1a, 1b, 1c, 1d, 2, 3c, 4) can be checked against a
 *   deterministic oracle. If these snapshots change unintentionally, the
 *   refactor has drifted.
 *
 *  If the change is intentional (adding immunity, new finale mechanics, etc.),
 *  update the snapshots deliberately and note it in the PR.
 *
 *  Covers:
 *   - S5 (has a double-elim and a non-elim episode — stressful path)
 *   - S13 (standard modern format — regression sanity)
 *   - Multiple filter shapes: winner pin, early placement pin, ELIM pin
 *   - Trajectories for a representative queen
 */

import { describe, test, expect } from 'vitest';
import {
  runBaseline,
  filterAndAggregate,
  extractTrajectories,
} from './simulate';
import { PLACEMENT_INDEX, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX } from './types';
import type { FilterCondition, SimulationResults, SeasonData } from './types';
import season5 from '../data/season5';
import season13 from '../data/season13';

const SEED = 424242;
const N = 1000;
const NOISE = 1.8;

/** Round every numeric leaf in a SimulationResults tree to 6 decimal places so
 *  snapshots are stable against rounding jitter without obscuring real drift. */
function roundResults(r: SimulationResults): unknown {
  const round = (n: number) => Math.round(n * 1e6) / 1e6;
  const roundRecord = (rec: Record<string, number>) =>
    Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, round(v)]));
  const roundNestedRecord = (rec: Record<string, Record<string, number>>) =>
    Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, roundRecord(v)]));
  return {
    numSimulations: r.numSimulations,
    winProbByEpisode: r.winProbByEpisode.map(roundRecord),
    aliveProbByEpisode: r.aliveProbByEpisode.map(roundRecord),
    elimProbByEpisode: r.elimProbByEpisode.map(roundRecord),
    placementDist: Object.fromEntries(
      Object.entries(r.placementDist).map(([k, v]) => [k, v.map(round)]),
    ),
    reachedFinaleProb: roundRecord(r.reachedFinaleProb),
    winProb: roundRecord(r.winProb),
    episodePlacements: r.episodePlacements.map(roundNestedRecord),
  };
}

function queenIndex(season: SeasonData, id: string): number {
  const i = season.queens.findIndex((q) => q.id === id);
  if (i < 0) throw new Error(`Queen not found: ${id}`);
  return i;
}

describe('golden: season 5 baseline', () => {
  const { results, buffer } = runBaseline({
    season: season5,
    numSimulations: N,
    noise: NOISE,
    seed: SEED,
  });

  test('aggregate matches snapshot', () => {
    expect(roundResults(results)).toMatchSnapshot();
  });

  test('filter: jinkx wins (OUTCOME pin) matches snapshot', () => {
    const conditions: FilterCondition[] = [
      {
        episodeIndex: OUTCOME_EPISODE_INDEX,
        queenIndex: queenIndex(season5, 'jinkx'),
        placement: PLACEMENT_INDEX.WIN,
      },
    ];
    const out = filterAndAggregate(buffer, N, conditions, season5.queens, season5.episodes);
    expect({
      matchCount: out.matchCount,
      results: roundResults(out.results),
    }).toMatchSnapshot();
  });

  test('filter: roxxxy BTM2 in ep3 matches snapshot', () => {
    const conditions: FilterCondition[] = [
      {
        episodeIndex: 2,
        queenIndex: queenIndex(season5, 'roxxxy'),
        placement: PLACEMENT_INDEX.BTM2,
      },
    ];
    const out = filterAndAggregate(buffer, N, conditions, season5.queens, season5.episodes);
    expect({
      matchCount: out.matchCount,
      results: roundResults(out.results),
    }).toMatchSnapshot();
  });

  test('filter: penny ELIM early matches snapshot', () => {
    const conditions: FilterCondition[] = [
      {
        episodeIndex: 1,
        queenIndex: queenIndex(season5, 'penny'),
        placement: ELIM_PLACEMENT,
      },
    ];
    const out = filterAndAggregate(buffer, N, conditions, season5.queens, season5.episodes);
    expect({
      matchCount: out.matchCount,
      results: roundResults(out.results),
    }).toMatchSnapshot();
  });

  test('trajectories: jinkx unfiltered matches snapshot', () => {
    const { paths, scannedRuns } = extractTrajectories(
      buffer,
      N,
      queenIndex(season5, 'jinkx'),
      season5.queens.length,
      season5.episodes.length,
      [],
      season5.episodes,
    );
    expect({ scannedRuns, paths: paths.slice(0, 20) }).toMatchSnapshot();
  });
});

describe('golden: season 13 baseline', () => {
  const { results, buffer } = runBaseline({
    season: season13,
    numSimulations: N,
    noise: NOISE,
    seed: SEED,
  });

  test('aggregate matches snapshot', () => {
    expect(roundResults(results)).toMatchSnapshot();
  });

  test('filter: symone wins (OUTCOME pin) matches snapshot', () => {
    const conditions: FilterCondition[] = [
      {
        episodeIndex: OUTCOME_EPISODE_INDEX,
        queenIndex: queenIndex(season13, 'symone'),
        placement: PLACEMENT_INDEX.WIN,
      },
    ];
    const out = filterAndAggregate(buffer, N, conditions, season13.queens, season13.episodes);
    expect({
      matchCount: out.matchCount,
      results: roundResults(out.results),
    }).toMatchSnapshot();
  });

  test('trajectories: gottmik unfiltered matches snapshot', () => {
    const { paths, scannedRuns } = extractTrajectories(
      buffer,
      N,
      queenIndex(season13, 'gottmik'),
      season13.queens.length,
      season13.episodes.length,
      [],
      season13.episodes,
    );
    expect({ scannedRuns, paths: paths.slice(0, 20) }).toMatchSnapshot();
  });
});

describe('golden: seed reproducibility', () => {
  test('same seed yields byte-identical buffers across independent runs', () => {
    const a = runBaseline({ season: season5, numSimulations: 100, noise: NOISE, seed: 99 });
    const b = runBaseline({ season: season5, numSimulations: 100, noise: NOISE, seed: 99 });
    expect(a.buffer.length).toBe(b.buffer.length);
    for (let i = 0; i < a.buffer.length; i++) {
      expect(a.buffer[i]).toBe(b.buffer[i]);
    }
  });

  test('different seeds yield different buffers', () => {
    const a = runBaseline({ season: season5, numSimulations: 100, noise: NOISE, seed: 1 });
    const b = runBaseline({ season: season5, numSimulations: 100, noise: NOISE, seed: 2 });
    let differs = false;
    for (let i = 0; i < a.buffer.length; i++) {
      if (a.buffer[i] !== b.buffer[i]) { differs = true; break; }
    }
    expect(differs).toBe(true);
  });

  test('no seed still runs (Math.random fallback) and produces full-length buffer', () => {
    const { buffer } = runBaseline({ season: season5, numSimulations: 50, noise: NOISE });
    expect(buffer.length).toBeGreaterThan(0);
  });
});
