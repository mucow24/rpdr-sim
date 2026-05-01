import {
  runBaseline,
  runBaselineDual,
  runBaselinePartial,
  runFromStatePartial,
  aggregateFromBuffer,
  filterAndAggregate,
  extractTrajectories,
  runFromState,
  EMPTY_RESULTS,
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
  | { type: 'baselineDual'; options: RunBaselineOptions }
  | { type: 'partialBaseline'; options: RunBaselineOptions }
  | { type: 'partialBaselineDual'; options: RunBaselineOptions }
  | { type: 'partialFromState'; options: RunFromStateOptions }
  | { type: 'importBuffer'; buffer: Uint8Array; totalRuns: number; season: SeasonData }
  | { type: 'importBufferDual'; riggedBuffer: Uint8Array; r0Buffer: Uint8Array; totalRuns: number; season: SeasonData }
  | { type: 'filter'; conditions: FilterCondition[] }
  | { type: 'trajectories'; queenId: string; conditions: FilterCondition[] }
  | { type: 'fromState'; options: RunFromStateOptions };

export type WorkerResponse =
  | { type: 'baseline'; results: SimulationResults }
  | { type: 'baselineDual'; rigged: SimulationResults; r0: SimulationResults }
  | { type: 'partialBaseline'; buffer: ArrayBuffer }
  | { type: 'partialBaselineDual'; riggedBuffer: ArrayBuffer; r0Buffer: ArrayBuffer }
  | { type: 'partialFromState'; buffer: ArrayBuffer }
  | { type: 'importBuffer'; results: SimulationResults }
  | { type: 'importBufferDual'; rigged: SimulationResults; r0: SimulationResults }
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
  } else if (msg.type === 'baselineDual') {
    const { rigged, r0 } = runBaselineDual(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    storedBuffer = rigged.buffer;
    storedTotalRuns = msg.options.numSimulations ?? 100_000;
    storedSeason = msg.options.season;
    self.postMessage({
      type: 'baselineDual',
      rigged: rigged.results,
      r0: r0.results,
    } satisfies WorkerResponse);
  } else if (msg.type === 'partialBaseline') {
    const { buffer } = runBaselinePartial(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    const ab = buffer.buffer as ArrayBuffer;
    self.postMessage({ type: 'partialBaseline', buffer: ab } satisfies WorkerResponse, { transfer: [ab] });
  } else if (msg.type === 'partialBaselineDual') {
    // Reuse runBaselineDual; discard the aggregated SimulationResults and ship
    // both buffers up for parallel-merge in useSimulation.
    const { rigged, r0 } = runBaselineDual(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    // The riggory=0 shortcut aliases r0 to rigged (same Uint8Array). Listing
    // the same ArrayBuffer twice in `transfer` throws DataCloneError on the
    // second detach, killing the worker silently. Clone before transfer when
    // aliased — cheap, scoped to the no-rig case.
    const r0Buf = rigged.buffer === r0.buffer ? new Uint8Array(rigged.buffer) : r0.buffer;
    const riggedAb = rigged.buffer.buffer as ArrayBuffer;
    const r0Ab = r0Buf.buffer as ArrayBuffer;
    self.postMessage(
      { type: 'partialBaselineDual', riggedBuffer: riggedAb, r0Buffer: r0Ab } satisfies WorkerResponse,
      { transfer: [riggedAb, r0Ab] },
    );
  } else if (msg.type === 'partialFromState') {
    const { buffer } = runFromStatePartial(
      msg.options,
      (pct) => self.postMessage({ type: 'progress', pct } satisfies WorkerResponse),
    );
    const ab = buffer.buffer as ArrayBuffer;
    self.postMessage({ type: 'partialFromState', buffer: ab } satisfies WorkerResponse, { transfer: [ab] });
  } else if (msg.type === 'importBuffer') {
    storedBuffer = msg.buffer;
    storedTotalRuns = msg.totalRuns;
    storedSeason = msg.season;
    const results = aggregateFromBuffer(msg.buffer, msg.totalRuns, msg.season);
    self.postMessage({ type: 'importBuffer', results } satisfies WorkerResponse);
  } else if (msg.type === 'importBufferDual') {
    // Filter / trajectory queries operate on the rigged (active) sim; r0 is
    // a counterfactual aggregate only.
    storedBuffer = msg.riggedBuffer;
    storedTotalRuns = msg.totalRuns;
    storedSeason = msg.season;
    const rigged = aggregateFromBuffer(msg.riggedBuffer, msg.totalRuns, msg.season);
    const r0 = aggregateFromBuffer(msg.r0Buffer, msg.totalRuns, msg.season);
    self.postMessage({ type: 'importBufferDual', rigged, r0 } satisfies WorkerResponse);
  } else if (msg.type === 'filter') {
    if (!storedBuffer || !storedSeason) {
      self.postMessage({
        type: 'filter',
        results: EMPTY_RESULTS,
        matchCount: 0,
        totalRuns: 0,
      } satisfies WorkerResponse);
      return;
    }

    const { results, matchCount } = filterAndAggregate(
      storedBuffer,
      storedTotalRuns,
      msg.conditions,
      storedSeason,
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
      storedSeason,
      msg.queenId,
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
