// @vitest-environment happy-dom
//
// UI smoke tier (alpha): each page mounts without throwing, no console.error
// fires during render/effects, and the core tab-switch interaction updates
// store state. Goal is to catch "big stupid" UI regressions — wiring breaks,
// provider misconfigurations, imports that blow up at module load — NOT to
// lock layout or DOM structure.
//
// Not tested here: pixel rendering, chart SVG shape, click-to-pin flows on
// individual cells, drag-drop in Calibrate. Those belong in targeted tests
// when they regress, not in a smoke suite.

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { useStore } from './store/useStore';
import type { WorkerRequest, WorkerResponse } from './engine/worker';
import type { SimulationResults } from './engine/types';

// ── MockWorker: auto-resolves common requests ────────────────

const emptyResults: SimulationResults = {
  numSimulations: 0,
  winProbByEpisode: [], aliveProbByEpisode: [], elimProbByEpisode: [],
  placementDist: {}, reachedFinaleProb: {}, winProb: {}, episodePlacements: [],
};

type Listener = (e: { data: WorkerResponse }) => void;

class MockWorker {
  static instances: MockWorker[] = [];
  static reset() { MockWorker.instances = []; }

  onmessage: Listener | null = null;
  onerror: ((e: Event) => void) | null = null;
  terminated = false;

  constructor(url: unknown, opts?: WorkerOptions) {
    void url; void opts;
    MockWorker.instances.push(this);
  }

  postMessage(msg: WorkerRequest): void {
    // Auto-respond on next microtask so the hook's async plumbing resolves.
    queueMicrotask(() => {
      if (!this.onmessage) return;
      if (msg.type === 'baseline') {
        this.onmessage({ data: { type: 'baseline', results: emptyResults } });
      } else if (msg.type === 'fromState') {
        this.onmessage({ data: { type: 'fromState', results: emptyResults } });
      } else if (msg.type === 'filter') {
        this.onmessage({ data: { type: 'filter', results: emptyResults, matchCount: 0, totalRuns: 0 } });
      } else if (msg.type === 'trajectories') {
        this.onmessage({ data: { type: 'trajectories', paths: [], totalRuns: 0 } });
      } else if (msg.type === 'partialBaseline' || msg.type === 'partialFromState') {
        // Return an empty buffer so the pool merges and completes.
        this.onmessage({ data: { type: msg.type, buffer: new ArrayBuffer(0) } });
      } else if (msg.type === 'importBuffer') {
        this.onmessage({ data: { type: 'importBuffer', results: emptyResults } });
      }
    });
  }

  terminate(): void { this.terminated = true; }
}

vi.stubGlobal('Worker', MockWorker as unknown as typeof Worker);

// Pin hardwareConcurrency so NUM_WORKERS = 1 (the single-worker fallback).
Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
  value: 2, writable: true, configurable: true,
});

// Flush all queued microtasks + pending React work. Tests need this after
// kicking off effects that post to workers and wait for the microtask reply.
async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

// ── Console-error gate ──────────────────────────────────────

let consoleErrors: unknown[][] = [];
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  MockWorker.reset();
  useStore.setState(useStore.getInitialState());
  localStorage.clear();
  consoleErrors = [];
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
    consoleErrors.push(args);
  });
});

afterEach(() => {
  cleanup();
  consoleErrorSpy.mockRestore();
});

function assertNoConsoleErrors() {
  if (consoleErrors.length > 0) {
    const formatted = consoleErrors
      .map((args) => args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
      .join('\n---\n');
    throw new Error(`console.error was called:\n${formatted}`);
  }
}

// ── Smoke tests ─────────────────────────────────────────────

describe('App — simulation mode', () => {
  test('mounts without throwing', async () => {
    useStore.setState({ appMode: 'simulation' });
    const { default: App } = await import('./App');
    const { container } = render(<App />);
    await flush();
    // Header always renders the app title.
    expect(container.textContent).toContain('Charisma Uniqueness Nerve & Talent Simulator');
    assertNoConsoleErrors();
  });

  test('tab switch updates store state', async () => {
    useStore.setState({ appMode: 'simulation' });
    const { default: App } = await import('./App');
    render(<App />);
    await flush();
    expect(useStore.getState().appMode).toBe('simulation');

    act(() => { useStore.getState().setAppMode('calibrate'); });
    await flush();
    expect(useStore.getState().appMode).toBe('calibrate');

    act(() => { useStore.getState().setAppMode('data'); });
    await flush();
    expect(useStore.getState().appMode).toBe('data');
    assertNoConsoleErrors();
  });
});

describe('App — calibrate mode', () => {
  test('mounts without throwing', async () => {
    useStore.setState({ appMode: 'calibrate' });
    const { default: App } = await import('./App');
    const { container } = render(<App />);
    await flush();
    // Calibrate mode replaces the simulation layout; header still renders.
    expect(container.textContent).toContain('Charisma Uniqueness Nerve & Talent Simulator');
    assertNoConsoleErrors();
  });
});

describe('App — data mode', () => {
  test('mounts without throwing', async () => {
    useStore.setState({ appMode: 'data' });
    const { default: App } = await import('./App');
    const { container } = render(<App />);
    await flush();
    expect(container.textContent).toContain('Charisma Uniqueness Nerve & Talent Simulator');
    assertNoConsoleErrors();
  });
});
