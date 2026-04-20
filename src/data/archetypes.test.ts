/** Archetype catalog is treated as data, not logic — we do not snapshot
 *  numeric weights (they're still being tuned). We DO lock structural
 *  invariants so a malformed entry can never slip into the sim. */

import { describe, test, expect } from 'vitest';
import { ARCHETYPES } from './archetypes';
import { BASE_STATS } from '../engine/types';

describe('ARCHETYPES catalog', () => {
  const entries = Object.entries(ARCHETYPES);

  test('catalog is non-empty', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  test.each(entries)('%s: every base stat has a non-negative numeric weight', (_id, def) => {
    for (const stat of BASE_STATS) {
      const w = def.weights[stat];
      expect(typeof w).toBe('number');
      expect(Number.isFinite(w)).toBe(true);
      expect(w).toBeGreaterThanOrEqual(0);
    }
  });

  test.each(entries)('%s: at least one weight is strictly positive', (_id, def) => {
    const total = BASE_STATS.reduce((sum, s) => sum + def.weights[s], 0);
    expect(total).toBeGreaterThan(0);
  });

  test.each(entries)('%s: has displayName and icon', (_id, def) => {
    expect(typeof def.displayName).toBe('string');
    expect(def.displayName.length).toBeGreaterThan(0);
    expect(typeof def.icon).toBe('string');
    expect(def.icon.length).toBeGreaterThan(0);
  });

  test('no archetype has weight keys outside BASE_STATS (mix() fills full record)', () => {
    for (const [id, def] of entries) {
      const keys = Object.keys(def.weights).sort();
      const expected = [...BASE_STATS].sort();
      expect(keys, `archetype ${id}`).toEqual(expected);
    }
  });
});
