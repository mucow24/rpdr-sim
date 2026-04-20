/** Perf baseline for the architectural pass.
 *
 *  Run with: npx vitest bench src/engine/simulate.perf.bench.ts
 *
 *  Records wall time for the three hot paths the refactor will touch. Capture
 *  numbers in the Phase 0 PR description; compare after Phase 1d (cleanup) and
 *  Phase 2 (typed-array accessors) to measure actual wins.
 */

import { bench, describe } from 'vitest';
import {
  runBaseline,
  filterAndAggregate,
  aggregateFromBuffer,
} from './simulate';
import { PLACEMENT_INDEX, OUTCOME_EPISODE_INDEX } from './types';
import type { FilterCondition } from './types';
import season5 from '../data/season5';

const SEED = 12345;
const BASELINE_N = 100_000;
const MERGED_N = 200_000;

describe('engine perf baseline', () => {
  bench(
    `baseline ${BASELINE_N} on S5 (seeded)`,
    () => {
      runBaseline({ season: season5, numSimulations: BASELINE_N, noise: 1.8, seed: SEED });
    },
    { iterations: 3, warmupIterations: 1 },
  );

  // Precompute a buffer once for filter / aggregate benchmarks.
  const { buffer: baseBuffer } = runBaseline({
    season: season5,
    numSimulations: BASELINE_N,
    noise: 1.8,
    seed: SEED,
  });

  const conditions: FilterCondition[] = [
    {
      episodeIndex: OUTCOME_EPISODE_INDEX,
      queenIndex: season5.queens.findIndex((q) => q.id === 'jinkx'),
      placement: PLACEMENT_INDEX.WIN,
    },
    {
      episodeIndex: 2,
      queenIndex: season5.queens.findIndex((q) => q.id === 'roxxxy'),
      placement: PLACEMENT_INDEX.BTM2,
    },
    {
      episodeIndex: 5,
      queenIndex: season5.queens.findIndex((q) => q.id === 'alaska'),
      placement: PLACEMENT_INDEX.HIGH,
    },
  ];

  bench(
    'filterAndAggregate with 3 conditions (100k)',
    () => {
      filterAndAggregate(baseBuffer, BASELINE_N, conditions, season5);
    },
    { iterations: 10, warmupIterations: 1 },
  );

  // Simulate the "merged 200k" path: concat two seeded 100k runs and aggregate.
  const { buffer: bufferA } = runBaseline({
    season: season5,
    numSimulations: BASELINE_N,
    noise: 1.8,
    seed: SEED,
  });
  const { buffer: bufferB } = runBaseline({
    season: season5,
    numSimulations: BASELINE_N,
    noise: 1.8,
    seed: SEED + 1,
  });
  const merged = new Uint8Array(bufferA.length + bufferB.length);
  merged.set(bufferA, 0);
  merged.set(bufferB, bufferA.length);

  bench(
    `aggregateFromBuffer on merged ${MERGED_N} buffer`,
    () => {
      aggregateFromBuffer(merged, MERGED_N, season5);
    },
    { iterations: 5, warmupIterations: 1 },
  );
});
