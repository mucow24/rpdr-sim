import { describe, test, expect } from 'vitest';
import type { EpisodeData, Queen, SeasonData } from './types';
import { placementEpisodeLabels } from './placementEpisodes';
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

    expect(labels[4]).toBe('Episode 1');
    expect(labels[3]).toBe('Episode 2');
    expect(labels[2]).toBe('Episode 3');
    expect(labels[1]).toBe('Finale');
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

    expect(labels[6]).toBe('Episode 1');
    expect(labels[5]).toBe('Episode 2');
    expect(labels[4]).toBe('Finale');
    expect(labels[3]).toBe('Finale');
    expect(labels[2]).toBe('Finale');
    expect(labels[1]).toBe('Finale');
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

    expect(labels[6]).toBe('Episode 1');
    expect(labels[5]).toBe('Episode 2');
    expect(labels[4]).toBe('Episode 2');
    expect(labels[3]).toBe('Episode 3');
    expect(labels[2]).toBe('Finale');
    expect(labels[1]).toBe('Finale');
    expect(finaleCohortSize).toBe(2);
  });

  test('pass episode between regular eps does not land in the map', () => {
    // 4 queens, ep 1 elim, ep 2 pass (no elim), ep 3 elim, ep 4 elim, ep 5 finale
    const season = mkSeason(
      [
        { number: 1, archetype: 'ball', challengeName: 'c1', placements: {}, eliminated: ['q4'] },
        { number: 2, archetype: 'pass', challengeName: 'reunion', placements: {}, eliminated: [] },
        { number: 3, archetype: 'ball', challengeName: 'c3', placements: {}, eliminated: ['q3'] },
        { number: 4, archetype: 'ball', challengeName: 'c4', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 5, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      4,
    );

    const { labels, finaleCohortSize } = placementEpisodeLabels(season);

    expect(labels[4]).toBe('Episode 1');
    expect(labels[3]).toBe('Episode 3');
    expect(labels[2]).toBe('Episode 4');
    expect(labels[1]).toBe('Finale');
    // No place should map to the pass episode
    expect(Object.values(labels)).not.toContain('Episode 2');
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

    expect(labels[4]).toBe('Episode 1');
    expect(labels[3]).toBe('Episode 2');
    expect(labels[2]).toBe('Episode 4');
    expect(labels[1]).toBe('Finale');
    // Confirm we did NOT mislabel anything with 'Episode 3' (which never existed in the data).
    expect(Object.values(labels)).not.toContain('Episode 3');
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

    expect(labels[4]).toBe('Episode 1');
    expect(labels[3]).toBe('Episode 2');
    expect(labels[2]).toBe('Episode 2');
    expect(labels[1]).toBe('Finale');
    expect(finaleCohortSize).toBe(1);
  });

  test('empty episodes array: every queen is in the finale cohort', () => {
    const season = mkSeason([], 5);
    const { labels, finaleCohortSize } = placementEpisodeLabels(season);
    expect(finaleCohortSize).toBe(5);
    for (let p = 1; p <= 5; p++) {
      expect(labels[p]).toBe('Finale');
    }
  });

  test('label format is exact: "Episode N" and "Finale"', () => {
    const season = mkSeason(
      [
        { number: 6, archetype: 'ball', challengeName: 'c6', placements: {}, eliminated: ['q2'] },
        { kind: 'finale', number: 7, finaleType: 'default', challengeName: 'Grand Finale', placements: {}, eliminated: [] },
      ],
      2,
    );
    const { labels } = placementEpisodeLabels(season);
    expect(labels[2]).toBe('Episode 6');
    expect(labels[1]).toBe('Finale');
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
      expect(Object.values(labels)).toContain('Finale');
      // (c) finaleCohortSize matches independent count.
      const preFinaleElims = season.episodes
        .filter((ep) => ep.kind !== 'finale')
        .reduce((sum, ep) => sum + ep.eliminated.length, 0);
      expect(finaleCohortSize).toBe(n - preFinaleElims);
    }
  });
});
