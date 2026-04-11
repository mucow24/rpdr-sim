import {
  runBaseline,
  filterAndAggregate,
  extractTrajectories,
  runFromState,
  type RunBaselineOptions,
  type RunFromStateOptions,
} from './simulate';
import type { SimulationResults, FilterCondition, TrajectoryPath, SeasonData } from './types';

// ── Stored state in worker scope ──
let storedBuffer: Uint8Array | null = null;
let storedTotalRuns = 0;
let storedSeason: SeasonData | null = null;

// ── Message types ──
export type WorkerRequest =
  | { type: 'baseline'; options: RunBaselineOptions }
  | { type: 'filter'; conditions: FilterCondition[] }
  | { type: 'trajectories'; queenIndex: number; conditions: FilterCondition[] }
  | { type: 'fromState'; options: RunFromStateOptions };

export type WorkerResponse =
  | { type: 'baseline'; results: SimulationResults }
  | { type: 'progress'; pct: number }
  | {
      type: 'filter';
      results: SimulationResults;
      matchCount: number;
      totalRuns: number;
    }
  | {
      type: 'trajectories';
      paths: TrajectoryPath[];
      totalRuns: number;
    }
  | { type: 'fromState'; results: SimulationResults };

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;

  if (msg.type === 'baseline') {
    const { results, buffer } = runBaseline(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    storedBuffer = buffer;
    storedTotalRuns = msg.options.numSimulations ?? 100_000;
    storedSeason = msg.options.season;
    self.postMessage({ type: 'baseline', results } satisfies WorkerResponse);
  } else if (msg.type === 'filter') {
    if (!storedBuffer || !storedSeason) {
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
      storedSeason.queens,
      storedSeason.episodes,
    );
    self.postMessage({
      type: 'filter',
      results,
      matchCount,
      totalRuns: storedTotalRuns,
    } satisfies WorkerResponse);
  } else if (msg.type === 'trajectories') {
    if (!storedBuffer || !storedSeason) {
      self.postMessage({
        type: 'trajectories',
        paths: [],
        totalRuns: 0,
      } satisfies WorkerResponse);
      return;
    }

    const { paths, scannedRuns } = extractTrajectories(
      storedBuffer,
      storedTotalRuns,
      msg.queenIndex,
      storedSeason.queens.length,
      storedSeason.episodes.length,
      msg.conditions,
    );
    self.postMessage({
      type: 'trajectories',
      paths,
      totalRuns: scannedRuns,
    } satisfies WorkerResponse);
  } else if (msg.type === 'fromState') {
    const { results, buffer } = runFromState(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    storedBuffer = buffer;
    storedTotalRuns = msg.options.numSimulations ?? 100_000;
    storedSeason = msg.options.season;
    self.postMessage({ type: 'fromState', results } satisfies WorkerResponse);
  }
};
