import {
  runBaseline,
  filterAndAggregate,
  type RunBaselineOptions,
} from './simulate';
import type { SimulationResults, FilterCondition, Queen, Episode } from './types';

// ── Stored state in worker scope ──
let storedBuffer: Uint8Array | null = null;
let storedTotalRuns = 0;
let storedQueens: Queen[] = [];
let storedEpisodes: Episode[] = [];

// ── Message types ──
export type WorkerRequest =
  | { type: 'baseline'; options: RunBaselineOptions }
  | { type: 'filter'; conditions: FilterCondition[] };

export type WorkerResponse =
  | { type: 'baseline'; results: SimulationResults }
  | { type: 'progress'; pct: number }
  | {
      type: 'filter';
      results: SimulationResults;
      matchCount: number;
      totalRuns: number;
    };

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;

  if (msg.type === 'baseline') {
    const { results, buffer, numQueens, numEpisodes, queenIds } = runBaseline(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    storedBuffer = buffer;
    storedTotalRuns = msg.options.numSimulations ?? 100_000;
    storedQueens = msg.options.queens;
    storedEpisodes = msg.options.episodes;
    self.postMessage({ type: 'baseline', results } satisfies WorkerResponse);
  } else if (msg.type === 'filter') {
    if (!storedBuffer) {
      // No baseline yet — return empty
      const empty: SimulationResults = {
        numSimulations: 0,
        winProbByEpisode: [],
        elimProbByEpisode: [],
        placementDist: {},
        top4Prob: {},
        winProb: {},
        episodePlacements: [],
      };
      self.postMessage({
        type: 'filter',
        results: empty,
        matchCount: 0,
        totalRuns: 0,
      } satisfies WorkerResponse);
      return;
    }

    const { results, matchCount } = filterAndAggregate(
      storedBuffer,
      storedTotalRuns,
      msg.conditions,
      storedQueens,
      storedEpisodes,
    );
    self.postMessage({
      type: 'filter',
      results,
      matchCount,
      totalRuns: storedTotalRuns,
    } satisfies WorkerResponse);
  }
};
