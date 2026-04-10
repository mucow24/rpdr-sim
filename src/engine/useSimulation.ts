import { useCallback, useRef } from 'react';
import type { RunBaselineOptions } from './simulate';
import type { SimulationResults, FilterCondition } from './types';
import type { WorkerRequest, WorkerResponse } from './worker';

type PendingResolve =
  | { type: 'baseline'; resolve: (r: SimulationResults) => void }
  | {
      type: 'filter';
      resolve: (r: {
        results: SimulationResults;
        matchCount: number;
        totalRuns: number;
      }) => void;
    };

let nextId = 0;

export function useSimulation(onProgress?: (pct: number) => void) {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, PendingResolve>>(new Map());
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('./worker.ts', import.meta.url),
        { type: 'module' },
      );
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
            } else if (msg.type === 'filter' && pending.type === 'filter') {
              pending.resolve({
                results: msg.results,
                matchCount: msg.matchCount,
                totalRuns: msg.totalRuns,
              });
            }
            pendingRef.current.delete(id);
            break;
          }
        }
      };
    }
    return workerRef.current;
  }, []);

  const runBaseline = useCallback(
    (options: RunBaselineOptions): Promise<SimulationResults> => {
      return new Promise((resolve) => {
        const id = nextId++;
        pendingRef.current.set(id, { type: 'baseline', resolve });
        getWorker().postMessage({
          type: 'baseline',
          options,
        } satisfies WorkerRequest);
      });
    },
    [getWorker],
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

  return { runBaseline, runFilter };
}
