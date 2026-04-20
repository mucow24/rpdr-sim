import { useCallback, useRef } from 'react';
import type { RunBaselineOptions, RunFromStateOptions } from './simulate';
import type { SimulationResults, FilterCondition, TrajectoryPath } from './types';
import type { WorkerRequest, WorkerResponse } from './worker';
import { createWorkerPool, type WorkerPool, type PoolTask } from './workerPool';

type PendingResolve =
  | { type: 'baseline'; resolve: (r: SimulationResults) => void }
  | { type: 'importBuffer'; resolve: (r: SimulationResults) => void }
  | {
      type: 'filter';
      resolve: (r: {
        results: SimulationResults;
        matchCount: number;
        totalRuns: number;
      }) => void;
    }
  | {
      type: 'trajectories';
      resolve: (r: { paths: TrajectoryPath[]; totalRuns: number }) => void;
    }
  | { type: 'fromState'; resolve: (r: SimulationResults) => void };

let nextId = 0;

const NUM_WORKERS = Math.max(1, Math.floor((navigator.hardwareConcurrency ?? 2) / 2));

function createWorker(): Worker {
  return new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
}

export function useSimulation(onProgress?: (pct: number) => void) {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, PendingResolve>>(new Map());
  const poolRef = useRef<WorkerPool | null>(null);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const getPool = useCallback(() => {
    if (!poolRef.current) {
      poolRef.current = createWorkerPool(createWorker);
    }
    return poolRef.current;
  }, []);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = createWorker();
      workerRef.current.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const msg = e.data;

        if (msg.type === 'progress') {
          onProgressRef.current?.(msg.pct);
          return;
        }

        for (const [id, pending] of pendingRef.current) {
          if (pending.type === msg.type) {
            if (msg.type === 'baseline' && pending.type === 'baseline') {
              pending.resolve(msg.results);
            } else if (msg.type === 'importBuffer' && pending.type === 'importBuffer') {
              pending.resolve(msg.results);
            } else if (msg.type === 'filter' && pending.type === 'filter') {
              pending.resolve({
                results: msg.results,
                matchCount: msg.matchCount,
                totalRuns: msg.totalRuns,
              });
            } else if (msg.type === 'trajectories' && pending.type === 'trajectories') {
              pending.resolve({
                paths: msg.paths,
                totalRuns: msg.totalRuns,
              });
            } else if (msg.type === 'fromState' && pending.type === 'fromState') {
              pending.resolve(msg.results);
            }
            pendingRef.current.delete(id);
            break;
          }
        }
      };
    }
    return workerRef.current;
  }, []);

  /** Run simulations in parallel across a worker pool, then import the merged buffer into the primary worker. */
  const runParallel = useCallback(
    (
      type: 'partialBaseline' | 'partialFromState',
      options: RunBaselineOptions | RunFromStateOptions,
    ): Promise<SimulationResults> => {
      const totalSims = options.numSimulations ?? 100_000;
      const workerCount = Math.min(NUM_WORKERS, totalSims);

      const simsPerWorker = Math.floor(totalSims / workerCount);
      const remainder = totalSims % workerCount;

      const tasks: PoolTask[] = [];
      for (let i = 0; i < workerCount; i++) {
        const workerSims = simsPerWorker + (i < remainder ? 1 : 0);
        tasks.push({
          request: { type, options: { ...options, numSimulations: workerSims } } as WorkerRequest,
          weight: workerSims,
        });
      }

      return getPool()
        .run(tasks, type, (pct) => onProgressRef.current?.(pct))
        .then(
          (buffers) =>
            new Promise<SimulationResults>((resolve) => {
              const totalBytes = buffers.reduce((sum, b) => sum + b.byteLength, 0);
              const merged = new Uint8Array(totalBytes);
              let offset = 0;
              for (const b of buffers) {
                merged.set(new Uint8Array(b), offset);
                offset += b.byteLength;
              }

              const primary = getWorker();
              const id = nextId++;
              pendingRef.current.set(id, { type: 'importBuffer', resolve });
              primary.postMessage({
                type: 'importBuffer',
                buffer: merged,
                totalRuns: totalSims,
                season: (options as RunBaselineOptions).season,
              } satisfies WorkerRequest);
            }),
        );
    },
    [getPool, getWorker],
  );

  const runBaseline = useCallback(
    (options: RunBaselineOptions): Promise<SimulationResults> => {
      if (NUM_WORKERS <= 1) {
        // Single-worker fallback
        return new Promise((resolve) => {
          const id = nextId++;
          pendingRef.current.set(id, { type: 'baseline', resolve });
          getWorker().postMessage({
            type: 'baseline',
            options,
          } satisfies WorkerRequest);
        });
      }
      return runParallel('partialBaseline', options);
    },
    [getWorker, runParallel],
  );

  const runFilter = useCallback(
    (
      conditions: FilterCondition[],
    ): Promise<{
      results: SimulationResults;
      matchCount: number;
      totalRuns: number;
    }> => {
      return new Promise((resolve) => {
        const id = nextId++;
        pendingRef.current.set(id, { type: 'filter', resolve });
        getWorker().postMessage({
          type: 'filter',
          conditions,
        } satisfies WorkerRequest);
      });
    },
    [getWorker],
  );

  const runTrajectories = useCallback(
    (
      queenId: string,
      conditions: FilterCondition[],
    ): Promise<{ paths: TrajectoryPath[]; totalRuns: number }> => {
      return new Promise((resolve) => {
        const id = nextId++;
        pendingRef.current.set(id, { type: 'trajectories', resolve });
        getWorker().postMessage({
          type: 'trajectories',
          queenId,
          conditions,
        } satisfies WorkerRequest);
      });
    },
    [getWorker],
  );

  const runFromState = useCallback(
    (options: RunFromStateOptions): Promise<SimulationResults> => {
      if (NUM_WORKERS <= 1) {
        return new Promise((resolve) => {
          const id = nextId++;
          pendingRef.current.set(id, { type: 'fromState', resolve });
          getWorker().postMessage({
            type: 'fromState',
            options,
          } satisfies WorkerRequest);
        });
      }
      return runParallel('partialFromState', options);
    },
    [getWorker, runParallel],
  );

  return { runBaseline, runFilter, runTrajectories, runFromState };
}
