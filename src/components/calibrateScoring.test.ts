import { describe, test, expect } from 'vitest';
import { skillScore, type HeavyEpisodeRow } from './calibrateScoring';

function row(placement: HeavyEpisodeRow['placement'], statShare = 1): HeavyEpisodeRow {
  return {
    epNumber: 0,
    challengeName: '',
    icon: '',
    placement,
    statShare,
  };
}

describe('skillScore', () => {
  test('empty list returns 0', () => {
    expect(skillScore([])).toBe(0);
  });

  test('rows with zero total share return 0', () => {
    expect(skillScore([row('WIN', 0), row('LOW', 0)])).toBe(0);
  });

  describe('base values (single occurrence)', () => {
    test('WIN = 7', () => {
      expect(skillScore([row('WIN')])).toBe(7);
    });
    test('HIGH = 3', () => {
      expect(skillScore([row('HIGH')])).toBe(3);
    });
    test('SAFE = 1', () => {
      expect(skillScore([row('SAFE')])).toBe(1);
    });
    test('LOW = -3', () => {
      expect(skillScore([row('LOW')])).toBe(-3);
    });
    test('BTM2 = -6', () => {
      expect(skillScore([row('BTM2')])).toBe(-6);
    });
    test('ELIM with no prior BTM2s = -10 (floor)', () => {
      expect(skillScore([row('ELIM')])).toBe(-10);
    });
  });

  describe('escalation on repeats', () => {
    test('WINs step by +1 each: 7, 8, 9', () => {
      expect(skillScore([row('WIN'), row('WIN'), row('WIN')])).toBeCloseTo((7 + 8 + 9) / 3);
    });
    test('HIGHs step by +0.5 each: 3, 3.5, 4', () => {
      expect(skillScore([row('HIGH'), row('HIGH'), row('HIGH')])).toBeCloseTo((3 + 3.5 + 4) / 3);
    });
    test('SAFEs step by +0.25 each: 1, 1.25, 1.5', () => {
      expect(skillScore([row('SAFE'), row('SAFE'), row('SAFE')])).toBeCloseTo((1 + 1.25 + 1.5) / 3);
    });
    test('LOWs step by -0.5 each: -3, -3.5, -4', () => {
      expect(skillScore([row('LOW'), row('LOW'), row('LOW')])).toBeCloseTo((-3 + -3.5 + -4) / 3);
    });
    test('BTM2s step by -1 each: -6, -7, -8', () => {
      expect(skillScore([row('BTM2'), row('BTM2'), row('BTM2')])).toBeCloseTo((-6 + -7 + -8) / 3);
    });
  });

  describe('ELIM value', () => {
    test('floors at -10 when no prior BTM2s', () => {
      expect(skillScore([row('ELIM')])).toBe(-10);
    });
    test('with 1 prior BTM2: next BTM = -7, so ELIM = min(-10, -11) = -11', () => {
      // Weighted avg: (-6 + -11) / 2 = -8.5
      expect(skillScore([row('BTM2'), row('ELIM')])).toBeCloseTo((-6 + -11) / 2);
    });
    test('with 2 prior BTM2s: next BTM = -8, so ELIM = min(-10, -12) = -12', () => {
      // Weighted avg: (-6 + -7 + -12) / 3
      expect(skillScore([row('BTM2'), row('BTM2'), row('ELIM')])).toBeCloseTo((-6 + -7 + -12) / 3);
    });
    test('does not increment BTM2 counter (consecutive ELIMs both use floor)', () => {
      // Both ELIMs see counts.BTM2 = 0, so both = -10.
      expect(skillScore([row('ELIM'), row('ELIM')])).toBe(-10);
    });
  });

  describe('stat-share weighting', () => {
    test('single row normalizes to its own base value regardless of share', () => {
      expect(skillScore([row('WIN', 0.5)])).toBe(7);
      expect(skillScore([row('WIN', 0.2)])).toBe(7);
    });

    test('weights score by share, normalized by total share', () => {
      // WIN at 0.5 share (7) + LOW at 0.25 share (-3)
      // = (0.5 * 7 + 0.25 * -3) / (0.5 + 0.25)
      // = (3.5 - 0.75) / 0.75
      const expected = (0.5 * 7 + 0.25 * -3) / (0.5 + 0.25);
      expect(skillScore([row('WIN', 0.5), row('LOW', 0.25)])).toBeCloseTo(expected);
    });

    test('equal shares equivalent to simple average', () => {
      // WIN (7) + HIGH (3) at equal share 0.3
      const expected = (0.3 * 7 + 0.3 * 3) / (0.3 + 0.3);
      expect(skillScore([row('WIN', 0.3), row('HIGH', 0.3)])).toBeCloseTo(expected);
      expect(skillScore([row('WIN', 0.3), row('HIGH', 0.3)])).toBeCloseTo((7 + 3) / 2);
    });

    test('larger-share rows dominate the score', () => {
      // WIN at 0.9 share + ELIM at 0.1 share
      const expected = (0.9 * 7 + 0.1 * -10) / (0.9 + 0.1);
      expect(skillScore([row('WIN', 0.9), row('ELIM', 0.1)])).toBeCloseTo(expected);
    });
  });

  describe('counters are per-outcome independent', () => {
    test('WIN count does not affect HIGH escalation', () => {
      // Two WINs then one HIGH: HIGH is still the 1st of its kind → 3
      // Weighted avg: (7 + 8 + 3) / 3
      expect(skillScore([row('WIN'), row('WIN'), row('HIGH')])).toBeCloseTo((7 + 8 + 3) / 3);
    });

    test('mixed sequence with interleaving preserves per-outcome counts', () => {
      // HIGH, WIN, HIGH, WIN → HIGHs: 3, 3.5; WINs: 7, 8
      // Sum = 3 + 7 + 3.5 + 8 = 21.5; avg = 21.5 / 4
      expect(skillScore([row('HIGH'), row('WIN'), row('HIGH'), row('WIN')])).toBeCloseTo(21.5 / 4);
    });
  });
});
