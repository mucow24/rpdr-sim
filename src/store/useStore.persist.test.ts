// @vitest-environment happy-dom
//
// The zustand persist middleware in useStore.ts binds to `localStorage` at
// store-creation time. Under the default node environment, localStorage is
// undefined and persist quietly disables itself. happy-dom provides a
// localStorage stub that lets us exercise the middleware end-to-end and
// assert the persisted payload's shape.

import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

beforeEach(() => {
  localStorage.clear();
  useStore.setState(useStore.getInitialState());
});

describe('persist partialize', () => {
  test('localStorage payload contains only whitelisted state keys', () => {
    // Guards against accidentally persisting baselineResults / filteredResults
    // (large + ephemeral) or leaking hot state. Triggering any whitelisted
    // action pushes through the middleware; `setNumSimulations` is cheap and
    // touches a persisted field.
    useStore.getState().setNumSimulations(123_456);
    const raw = localStorage.getItem('rpdr-sim-store');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(2);

    const allowedKeys = new Set([
      'seasonsById',
      'activeSeasonId',
      'currentEpisodeOverrides',
      'enabledCalibrateSeasons',
      'numSimulations',
    ]);
    for (const key of Object.keys(parsed.state)) {
      expect(allowedKeys.has(key), `unexpected persisted key: ${key}`).toBe(true);
    }
    // Explicit guards against the expensive / ephemeral state leaking through.
    expect('baselineResults' in parsed.state).toBe(false);
    expect('filteredResults' in parsed.state).toBe(false);
    expect('conditions' in parsed.state).toBe(false);
    expect('isSimulating' in parsed.state).toBe(false);
    expect('trajectoryPaths' in parsed.state).toBe(false);
  });

  test('numSimulations changes are persisted', () => {
    useStore.getState().setNumSimulations(500_000);
    const parsed = JSON.parse(localStorage.getItem('rpdr-sim-store')!);
    expect(parsed.state.numSimulations).toBe(500_000);
  });
});
