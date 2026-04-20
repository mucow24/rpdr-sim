import { describe, test, expect } from 'vitest';
import type { EpisodeData, Queen, SeasonData } from './types';
import { isRegular } from './types';
import { placementEpisodeLabels } from './placementEpisodes';
import { ARCHETYPES } from '../data/archetypes';
import { SEASON_PRESETS } from '../data/presets';

// Hand-rolled minimal fixtures. Queens don't influence the helper beyond
// `.length`, so we stub stats/colors to zero values and rely on unique ids.
function mkQueens(n: number): Queen[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `q${i + 1}`,
    name: `Q${i + 1}`,
    skills: {
      comedy: 0,
      improv: 0,
      acting: 0,
      dance: 0,
      music: 0,
      design: 0,
      runway: 0,
      charisma: 0,
    },
    lipSync: 0,
    color: '#000000',
  }));
}

function mkSeason(episodes: EpisodeData[], numQueens: number): SeasonData {
  return {
    id: 'test',
    name: 'Test',
    queens: mkQueens(numQueens),
    episodes,
  };
}

// Shorthand for the expected icons attached to the labels.
const BALL = ARCHETYPES.ball.icon;       // 👗
const SNATCH = ARCHETYPES.snatchGame.icon; // 🎯
const FINALE = '👑';

describe('placementEpisodeLabels', () => {
  test('simple single-elim season with top-1 finale', () => {
    // 4 queens, eps 1-3 single-elim, ep 4 finale → 1 in finale cohort
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q4'] },
        { number: 2, archetype: 'ball', challengeName: 'c2', placements: {}, eliminated: ['q3'] },
        { number: 3, archetype: 'ball', challengeName: 'c3', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 4, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      4,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[4]).toBe(`Episode 1 ${BALL}`);
    expect(labels[3]).toBe(`Episode 2 ${BALL}`);
    expect(labels[2]).toBe(`Episode 3 ${BALL}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    expect(finaleCohortSize).toBe(1);
  });

  test('top-4 finale cohort: places 1..4 are Finale', () => {
    // 6 queens, eps 1-2 single-elim, ep 3 finale (top-4)
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q6'] },
        { number: 2, archetype: 'ball', challengeName: 'c2', placements: {}, eliminated: ['q5'] },
        { kind: 'finale', number: 3, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      6,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[6]).toBe(`Episode 1 ${BALL}`);
    expect(labels[5]).toBe(`Episode 2 ${BALL}`);
    expect(labels[4]).toBe(`Finale ${FINALE}`);
    expect(labels[3]).toBe(`Finale ${FINALE}`);
    expect(labels[2]).toBe(`Finale ${FINALE}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    expect(finaleCohortSize).toBe(4);
  });

  test('double elim mid-season: two places share the episode', () => {
    // 6 queens, ep 1 single, ep 2 double, ep 3 single, ep 4 finale (top-2)
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q6'] },
        { number: 2, archetype: 'ball', challengeName: 'c2', placements: {}, eliminated: ['q5', 'q4'] },
        { number: 3, archetype: 'ball', challengeName: 'c3', placements: {}, eliminated: ['q3'] },
        { kind: 'finale', number: 4, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      6,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[6]).toBe(`Episode 1 ${BALL}`);
    expect(labels[5]).toBe(`Episode 2 ${BALL}`);
    expect(labels[4]).toBe(`Episode 2 ${BALL}`);
    expect(labels[3]).toBe(`Episode 3 ${BALL}`);
    expect(labels[2]).toBe(`Finale ${FINALE}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    expect(finaleCohortSize).toBe(2);
  });

  test('pass episode between regular eps does not land in the map', () => {
    // 4 queens, ep 1 elim, ep 2 pass (no elim), ep 3 elim, ep 4 elim, ep 5 finale
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q4'] },
        { kind: 'pass', number: 2, challengeName: 'reunion' },
        { number: 3, archetype: 'ball', challengeName: 'c3', placements: {}, eliminated: ['q3'] },
        { number: 4, archetype: 'ball', challengeName: 'c4', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 5, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      4,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[4]).toBe(`Episode 1 ${BALL}`);
    expect(labels[3]).toBe(`Episode 3 ${BALL}`);
    expect(labels[2]).toBe(`Episode 4 ${BALL}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    // No place should map to the pass episode (including with its icon).
    expect(Object.values(labels).some((v) => v.startsWith('Episode 2'))).toBe(false);
    expect(finaleCohortSize).toBe(1);
  });

  test('non-contiguous ep.number values: helper emits ep.number verbatim, not array index', () => {
    // Episode numbers jump: 1, 2, 4, 5 (no 3 in the data). Proves we read ep.number, not index.
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q4'] },
        { number: 2, archetype: 'ball', challengeName: 'c2', placements: {}, eliminated: ['q3'] },
        { number: 4, archetype: 'ball', challengeName: 'c4', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 5, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      4,
    );

    const { labels } = placementEpisodeLabels(season);

    expect(labels[4]).toBe(`Episode 1 ${BALL}`);
    expect(labels[3]).toBe(`Episode 2 ${BALL}`);
    expect(labels[2]).toBe(`Episode 4 ${BALL}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    // Confirm we did NOT mislabel anything with 'Episode 3' (which never existed in the data).
    expect(Object.values(labels).some((v) => v.startsWith('Episode 3'))).toBe(false);
  });

  test('double elim at last pre-finale episode', () => {
    // 4 queens, ep 1 single, ep 2 double (elim 2 at once), ep 3 finale → top-1 cohort
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q4'] },
        { number: 2, archetype: 'ball', challengeName: 'c2', placements: {}, eliminated: ['q3', 'q2'] },
        { kind: 'finale', number: 3, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      4,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[4]).toBe(`Episode 1 ${BALL}`);
    expect(labels[3]).toBe(`Episode 2 ${BALL}`);
    expect(labels[2]).toBe(`Episode 2 ${BALL}`);
    expect(labels[1]).toBe(`Finale ${FINALE}`);
    expect(finaleCohortSize).toBe(1);
  });

  test('empty episodes array: every queen is in the finale cohort', () => {
    const season = mkSeason([], 5);
    const { labels, finaleCohortSize } = placementEpisodeLabels(season);
    expect(finaleCohortSize).toBe(5);
    for (let p = 1; p <= 5; p++) {
      expect(labels[p]).toBe(`Finale ${FINALE}`);
    }
  });

  test('label format is exact: "Episode N <icon>" and "Finale 👑"', () => {
    const season = mkSeason(
      [
        { number: 6, archetype: 'ball', challengeName: 'c6', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 7, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      2,
    );
    const { labels } = placementEpisodeLabels(season);
    expect(labels[2]).toBe('Episode 6 👗');
    expect(labels[1]).toBe('Finale 👑');
  });

  test('icon comes from the episode archetype (different archetypes produce different icons)', () => {
    const season = mkSeason(
      [
        { number: 1, archetype: 'snatchGame', challengeName: 'Snatch Game', placements: {}, eliminated: ['q3'] },
        { number: 2, archetype: 'ball', challengeName: 'The Ball', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 3, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      3,
    );
    const { labels } = placementEpisodeLabels(season);
    expect(labels[3]).toBe(`Episode 1 ${SNATCH}`);
    expect(labels[2]).toBe(`Episode 2 ${BALL}`);
  });

  test('smoke test across all real season presets', () => {
    for (const preset of SEASON_PRESETS) {
      const season = preset.season;
      const n = season.queens.length;
      const { labels, finaleCohortSize } = placementEpisodeLabels(season);

      // (a) Exactly N entries, keyed 1..N, no undefined values.
      expect(Object.keys(labels).length).toBe(n);
      for (let p = 1; p <= n; p++) {
        expect(labels[p]).toBeDefined();
      }
      // (b) At least one Finale entry (every season has a finale cohort >= 1).
      expect(Object.values(labels)).toContain(`Finale ${FINALE}`);
      // (c) finaleCohortSize matches independent count.
      const preFinaleElims = season.episodes
        .filter(isRegular)
        .reduce((sum, ep) => sum + ep.eliminated.length, 0);
      expect(finaleCohortSize).toBe(n - preFinaleElims);
    }
  });
});
