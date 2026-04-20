// @vitest-environment happy-dom
//
// createWorkerPool is the pure (non-React) pool-management helper used by
// useSimulation's runParallel path. Testing it here side-steps the
// renderHook/module-instance landmine documented at the bottom of
// useSimulation.test.ts.

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createWorkerPool, type PoolTask } from './workerPool';
import type { WorkerRequest, WorkerResponse } from './worker';

// ── MockWorker ────────────────────────────────────────────

type Listener = (e: { data: WorkerResponse }) => void;

class MockWorker {
  static instances: MockWorker[] = [];
  static reset() { MockWorker.instances = []; }

  onmessage: Listener | null = null;
  posted: WorkerRequest[] = [];
  terminated = false;

  constructor() {
    MockWorker.instances.push(this);
  }

  postMessage(msg: WorkerRequest): void {
    this.posted.push(msg);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: WorkerResponse): void {
    this.onmessage?.({ data });
  }
}

const factory = () => new MockWorker() as unknown as Worker;

const mkBuffer = (n: number): ArrayBuffer => new Uint8Array(n).buffer;

const mkTasks = (workerSims: number[]): PoolTask[] =>
  workerSims.map((n) => ({
    request: {
      type: 'partialBaseline',
      options: { season: { queens: [], episodes: [] } as never, numSimulations: n },
    },
    weight: n,
  }));

describe('createWorkerPool', () => {
  beforeEach(() => {
    MockWorker.reset();
  });

  test('run spawns one worker per task and posts the task request', () => {
    const pool = createWorkerPool(factory);
    pool.run(mkTasks([50, 50]), 'partialBaseline', () => {});

    expect(MockWorker.instances).toHaveLength(2);
    expect(MockWorker.instances[0].posted[0].type).toBe('partialBaseline');
    expect(MockWorker.instances[1].posted[0].type).toBe('partialBaseline');
  });

  test('resolves with ordered result buffers after all workers finish', async () => {
    const pool = createWorkerPool(factory);
    const promise = pool.run(mkTasks([30, 70]), 'partialBaseline', () => {});

    MockWorker.instances[1].emit({ type: 'partialBaseline', buffer: mkBuffer(7) });
    MockWorker.instances[0].emit({ type: 'partialBaseline', buffer: mkBuffer(3) });

    const buffers = await promise;
    expect(buffers).toHaveLength(2);
    expect(buffers[0].byteLength).toBe(3);
    expect(buffers[1].byteLength).toBe(7);
  });

  test('reports weighted progress across workers', async () => {
    const pool = createWorkerPool(factory);
    const progress: number[] = [];
    const promise = pool.run(mkTasks([25, 75]), 'partialBaseline', (pct) => progress.push(pct));

    // Worker 0 (weight 25) at 100%, worker 1 (weight 75) at 0% → 25%
    MockWorker.instances[0].emit({ type: 'progress', pct: 100 });
    expect(progress.at(-1)).toBe(25);

    // Worker 1 at 100% → (25*100 + 75*100) / 100 = 100
    MockWorker.instances[1].emit({ type: 'progress', pct: 100 });
    expect(progress.at(-1)).toBe(100);

    MockWorker.instances[0].emit({ type: 'partialBaseline', buffer: mkBuffer(1) });
    MockWorker.instances[1].emit({ type: 'partialBaseline', buffer: mkBuffer(1) });
    await promise;
  });

  // ── The regression this file exists to prevent ────────────

  test('starting a new run terminates workers from the previous batch', () => {
    const pool = createWorkerPool(factory);
    pool.run(mkTasks([50, 50]), 'partialBaseline', () => {});
    const firstBatch = MockWorker.instances.slice();

    // Simulate user re-running mid-flight (no results delivered from first batch)
    pool.run(mkTasks([50, 50]), 'partialBaseline', () => {});

    expect(firstBatch.every((w) => w.terminated)).toBe(true);
    // New batch exists and is not terminated
    const secondBatch = MockWorker.instances.slice(2);
    expect(secondBatch).toHaveLength(2);
    expect(secondBatch.every((w) => w.terminated)).toBe(false);
  });

  test('stale progress from a prior batch does not reach the current onProgress', () => {
    const pool = createWorkerPool(factory);

    const firstProgress: number[] = [];
    pool.run(mkTasks([50, 50]), 'partialBaseline', (pct) => firstProgress.push(pct));
    const firstBatch = MockWorker.instances.slice();

    const secondProgress: number[] = [];
    pool.run(mkTasks([50, 50]), 'partialBaseline', (pct) => secondProgress.push(pct));

    // Prior batch keeps trying to post progress (the real bug's signature:
    // two interleaved percentage streams hitting the same callback).
    firstBatch[0].emit({ type: 'progress', pct: 42 });
    firstBatch[1].emit({ type: 'progress', pct: 88 });

    expect(secondProgress).toEqual([]);
  });

  test('stale result buffers from a prior batch do not resolve the current promise', async () => {
    const pool = createWorkerPool(factory);
    pool.run(mkTasks([50, 50]), 'partialBaseline', () => {});
    const firstBatch = MockWorker.instances.slice();

    let secondResolved = false;
    const secondPromise = pool
      .run(mkTasks([50, 50]), 'partialBaseline', () => {})
      .then(() => { secondResolved = true; });
    const secondBatch = MockWorker.instances.slice(2);

    // Prior batch delivers both results — must be ignored.
    firstBatch[0].emit({ type: 'partialBaseline', buffer: mkBuffer(1) });
    firstBatch[1].emit({ type: 'partialBaseline', buffer: mkBuffer(1) });

    await Promise.resolve();
    await Promise.resolve();
    expect(secondResolved).toBe(false);

    // New batch delivers → resolves
    secondBatch[0].emit({ type: 'partialBaseline', buffer: mkBuffer(2) });
    secondBatch[1].emit({ type: 'partialBaseline', buffer: mkBuffer(2) });
    await secondPromise;
    expect(secondResolved).toBe(true);
  });

  test('vi.fn spy: onProgress for the prior run is never called after a re-run', () => {
    const pool = createWorkerPool(factory);
    const firstOnProgress = vi.fn();
    pool.run(mkTasks([50, 50]), 'partialBaseline', firstOnProgress);
    const firstBatch = MockWorker.instances.slice();

    firstOnProgress.mockClear();

    pool.run(mkTasks([50, 50]), 'partialBaseline', () => {});

    firstBatch[0].emit({ type: 'progress', pct: 99 });
    expect(firstOnProgress).not.toHaveBeenCalled();
  });
});
