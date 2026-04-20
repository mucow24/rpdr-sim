import type { WorkerRequest, WorkerResponse } from './worker';

export type PoolTask = {
  request: WorkerRequest;
  /** Relative share of total work — used to weight progress reports. */
  weight: number;
};

export type ResultType = 'partialBaseline' | 'partialFromState';

export type WorkerPool = {
  run(
    tasks: PoolTask[],
    resultType: ResultType,
    onProgress: (pct: number) => void,
  ): Promise<ArrayBuffer[]>;
};

/**
 * Creates a stateful pool that spawns one worker per task for the current run.
 *
 * A fresh call to `run` terminates any workers still alive from the previous
 * run and discards their subsequent messages. Without this, a user re-running
 * a simulation mid-flight would see the old and new batches' progress streams
 * interleave into the same callback — two 0→100 climbs overlapping instead of
 * one monotonic climb.
 */
export function createWorkerPool(factory: () => Worker): WorkerPool {
  let activeGeneration: Worker[] = [];

  function run(
    tasks: PoolTask[],
    resultType: ResultType,
    onProgress: (pct: number) => void,
  ): Promise<ArrayBuffer[]> {
    // Kill the prior generation before spawning a new one.
    for (const w of activeGeneration) w.terminate();
    activeGeneration = [];

    const totalWeight = tasks.reduce((s, t) => s + t.weight, 0);
    const progressPerTask = new Array<number>(tasks.length).fill(0);

    const reportProgress = () => {
      let weighted = 0;
      for (let i = 0; i < tasks.length; i++) {
        weighted += progressPerTask[i] * tasks[i].weight;
      }
      onProgress(Math.round(weighted / totalWeight));
    };

    return new Promise((resolve) => {
      const buffers: ArrayBuffer[] = new Array(tasks.length);
      // Capture the generation array by reference so result/progress handlers
      // can check whether they still belong to the active batch.
      const generation = activeGeneration;
      let completed = 0;

      tasks.forEach((task, idx) => {
        const worker = factory();
        generation.push(worker);

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
          // Stale messages from a superseded generation are ignored.
          if (generation !== activeGeneration) return;

          const msg = e.data;
          if (msg.type === 'progress') {
            progressPerTask[idx] = msg.pct;
            reportProgress();
            return;
          }
          if (msg.type === resultType) {
            buffers[idx] = msg.buffer;
            completed++;
            worker.terminate();
            const i = generation.indexOf(worker);
            if (i >= 0) generation.splice(i, 1);
            if (completed === tasks.length) resolve(buffers);
          }
        };

        worker.postMessage(task.request);
      });
    });
  }

  return { run };
}
