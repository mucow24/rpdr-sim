// @vitest-environment happy-dom
//
// useSimulation is a React hook that owns a worker pool and resolves promises
// when the primary worker responds. The tests here mock `Worker` globally,
// pin `navigator.hardwareConcurrency` so NUM_WORKERS is deterministic, and
// verify the hook posts the right messages and resolves on matching replies.
//
// Hidden landmine: NUM_WORKERS is captured once at module load, so changing
// navigator.hardwareConcurrency mid-test has no effect. Multi-worker-path
// tests must run in a fresh module scope via vi.resetModules() + dynamic
// import. See the "parallel pool" describe block below.

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { WorkerRequest, WorkerResponse } from './worker';
import type { SeasonData, SimulationResults } from './types';

// ── MockWorker ────────────────────────────────────────────

type Listener = (e: { data: WorkerResponse }) => void;

class MockWorker {
  static instances: MockWorker[] = [];
  static reset() { MockWorker.instances = []; }

  onmessage: Listener | null = null;
  onerror: ((e: Event) => void) | null = null;
  posted: WorkerRequest[] = [];
  terminated = false;

  constructor(url: unknown, opts?: WorkerOptions) {
    void url; void opts; // Worker constructor signature; args unused by the mock.
    MockWorker.instances.push(this);
  }

  postMessage(msg: WorkerRequest): void {
    this.posted.push(msg);
  }

  terminate(): void {
    this.terminated = true;
  }

  /** Fire a message from the "worker" side to the hook. */
  emit(data: WorkerResponse): void {
    this.onmessage?.({ data });
  }
}

vi.stubGlobal('Worker', MockWorker as unknown as typeof Worker);

// Pin hardwareConcurrency=2 so NUM_WORKERS = floor(2/2) = 1 → single-worker
// fallback path. The parallel-path describe below overrides via vi.resetModules.
Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
  value: 2, writable: true, configurable: true,
});

const mkSeason = (): SeasonData => ({
  id: 't', name: 'T',
  queens: [
    { id: 'a', name: 'a', color: '#000', lipSync: 5,
      skills: { comedy: 5, improv: 5, acting: 5, dance: 5, music: 5, design: 5, runway: 5, charisma: 5 } },
    { id: 'b', name: 'b', color: '#000', lipSync: 5,
      skills: { comedy: 5, improv: 5, acting: 5, dance: 5, music: 5, design: 5, runway: 5, charisma: 5 } },
  ],
  episodes: [
    { number: 1, archetype: 'ball', challengeName: 'e1', placements: {}, eliminated: [] },
    { kind: 'finale', number: 2, finaleType: 'default', challengeName: 'F', placements: {}, eliminated: [] },
  ],
});

const emptyResults: SimulationResults = {
  numSimulations: 100,
  winProbByEpisode: [], aliveProbByEpisode: [], elimProbByEpisode: [],
  placementDist: {}, reachedFinaleProb: {}, winProb: {}, episodePlacements: [],
};

// ── Single-worker fallback (NUM_WORKERS=1) ────────────────

describe('useSimulation — single-worker fallback', () => {
  beforeEach(() => {
    MockWorker.reset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('runBaseline posts a baseline message and resolves on matching response', async () => {
    const { useSimulation } = await import('./useSimulation');
    const { result } = renderHook(() => useSimulation());

    const promise = act(() =>
      result.current.runBaseline({ season: mkSeason(), numSimulations: 100 }),
    );

    // The hook lazily creates the primary worker on first call.
    expect(MockWorker.instances).toHaveLength(1);
    const worker = MockWorker.instances[0];
    expect(worker.posted).toHaveLength(1);
    expect(worker.posted[0].type).toBe('baseline');

    // Simulate worker response.
    worker.emit({ type: 'baseline', results: emptyResults });
    const results = await promise;
    expect(results.numSimulations).toBe(100);
  });

  test('progress messages invoke the onProgress callback', async () => {
    const { useSimulation } = await import('./useSimulation');
    const progress: number[] = [];
    const { result } = renderHook(() => useSimulation((pct) => progress.push(pct)));
    const promise = act(() =>
      result.current.runBaseline({ season: mkSeason(), numSimulations: 100 }),
    );
    const worker = MockWorker.instances[0];
    worker.emit({ type: 'progress', pct: 25 });
    worker.emit({ type: 'progress', pct: 50 });
    worker.emit({ type: 'baseline', results: emptyResults });
    await promise;
    expect(progress).toEqual([25, 50]);
  });

  test('runFilter posts filter message and resolves with results + matchCount + totalRuns', async () => {
    const { useSimulation } = await import('./useSimulation');
    const { result } = renderHook(() => useSimulation());
    // Prime the worker by making any call first (so it exists).
    const seedPromise = act(() =>
      result.current.runBaseline({ season: mkSeason(), numSimulations: 100 }),
    );
    const worker = MockWorker.instances[0];
    worker.emit({ type: 'baseline', results: emptyResults });
    await seedPromise;

    const filterPromise = act(() => result.current.runFilter([
      { episodeIndex: 0, queenIndex: 0, placement: 0 },
    ]));
    const postedFilter = worker.posted.find((m) => m.type === 'filter');
    expect(postedFilter).toBeDefined();

    worker.emit({
      type: 'filter', results: emptyResults, matchCount: 42, totalRuns: 100,
    });
    const out = await filterPromise;
    expect(out.matchCount).toBe(42);
    expect(out.totalRuns).toBe(100);
  });

  test('runTrajectories posts trajectories message and resolves with paths + totalRuns', async () => {
    const { useSimulation } = await import('./useSimulation');
    const { result } = renderHook(() => useSimulation());

    const seedPromise = act(() =>
      result.current.runBaseline({ season: mkSeason(), numSimulations: 100 }),
    );
    const worker = MockWorker.instances[0];
    worker.emit({ type: 'baseline', results: emptyResults });
    await seedPromise;

    const trajPromise = act(() => result.current.runTrajectories('a', []));
    expect(worker.posted.some((m) => m.type === 'trajectories')).toBe(true);

    worker.emit({ type: 'trajectories', paths: [{ placements: [0, 0], count: 10 }], totalRuns: 10 });
    const out = await trajPromise;
    expect(out.paths).toHaveLength(1);
    expect(out.totalRuns).toBe(10);
  });

  test('runFromState posts fromState message and resolves with results', async () => {
    const { useSimulation } = await import('./useSimulation');
    const { result } = renderHook(() => useSimulation());

    const promise = act(() =>
      result.current.runFromState({ season: mkSeason(), fromEpisode: 0, numSimulations: 100 }),
    );
    const worker = MockWorker.instances[0];
    expect(worker.posted[0].type).toBe('fromState');
    worker.emit({ type: 'fromState', results: emptyResults });
    const out = await promise;
    expect(out.numSimulations).toBe(100);
  });

  test('unrelated response types do not resolve a pending promise', async () => {
    const { useSimulation } = await import('./useSimulation');
    const { result } = renderHook(() => useSimulation());

    let baselineResolved = false;
    act(() => {
      result.current.runBaseline({ season: mkSeason(), numSimulations: 100 })
        .then(() => { baselineResolved = true; });
    });
    const worker = MockWorker.instances[0];
    // Fire an unrelated response — should NOT resolve the baseline promise.
    worker.emit({ type: 'filter', results: emptyResults, matchCount: 0, totalRuns: 0 });
    // Flush microtasks so any erroneous resolve would have fired.
    await Promise.resolve();
    await Promise.resolve();
    expect(baselineResolved).toBe(false);
    // Now fire the matching response and confirm resolution.
    worker.emit({ type: 'baseline', results: emptyResults });
    await Promise.resolve();
    await Promise.resolve();
    expect(baselineResolved).toBe(true);
  });
});

// Deferred: parallel-pool (NUM_WORKERS > 1) path. Forcing NUM_WORKERS > 1
// requires `vi.resetModules()` + a dynamic re-import of useSimulation so it
// captures a different navigator.hardwareConcurrency value — but after
// resetModules the hook re-imports React as a fresh module instance, which
// @testing-library/react's renderHook (still bound to the *original* React
// instance from the top-level import) cannot render. The resulting
// instance-mismatch surfaces as `result.current === null`.
//
// Working around this cleanly would require refactoring useSimulation so the
// pool logic is a pure function testable without React — scope that belongs
// to a separate change. The single-worker fallback above exercises the hook's
// message routing, pending resolver, and progress forwarding, which is the
// load-bearing behavior for I/O-tier coverage.
