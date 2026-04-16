import { describe, test, expect } from 'vitest';
import { queenUid } from './types';
import { SEASON_PRESETS } from '../data/presets';

describe('queenUid', () => {
  test('formats seasonId and queenId with a colon separator', () => {
    expect(queenUid('season5', 'jinkx')).toBe('season5:jinkx');
    expect(queenUid('season10', 'vanjie')).toBe('season10:vanjie');
  });

  test('distinct (seasonId, queenId) pairs produce distinct uids across all 18 seasons', () => {
    const uids = new Set<string>();
    for (const preset of SEASON_PRESETS) {
      for (const queen of preset.season.queens) {
        uids.add(queenUid(preset.id, queen.id));
      }
    }
    const totalQueens = SEASON_PRESETS.reduce(
      (sum, p) => sum + p.season.queens.length,
      0,
    );
    expect(uids.size).toBe(totalQueens);
  });

  test('disambiguates duplicate queen ids across seasons', () => {
    // vanjie appears in season10 and season11 with id 'vanjie'.
    expect(queenUid('season10', 'vanjie')).not.toBe(queenUid('season11', 'vanjie'));
  });
});
