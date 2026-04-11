import { describe, test, expect } from 'vitest';
import { outcomeToEpisodeResult, runFromState, runBaseline } from './simulate';
import type { SeasonData, Queen, EpisodeData, Placement } from './types';
import season5 from '../data/season5';

// ── Minimal test fixture ─────────────────────────────────────
// 6 queens, 4 episodes. Deterministic locked outcomes for clear assertions.
function makeQueen(id: string, skill: number, lipSync: number): Queen {
  return {
    id,
    name: id,
    skills: { comedy: skill, design: skill, acting: skill, dance: skill, snatchGame: skill, improv: skill, runway: skill, singing: skill },
    lipSync,
    color: '#000',
  };
}

function makeTestSeason(): SeasonData {
  const queens = [
    makeQueen('alice', 9, 8),
    makeQueen('beth', 7, 6),
    makeQueen('carol', 6, 5),
    makeQueen('dana', 5, 4),
    makeQueen('eve', 4, 3),
    makeQueen('faye', 3, 2),
  ];

  const episodes: EpisodeData[] = [
    {
      number: 1, challengeType: 'comedy', challengeName: 'Ep1',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'SAFE', dana: 'SAFE', eve: 'LOW', faye: 'BTM2' } as Record<string, Placement>,
      eliminated: [], // non-elim
    },
    {
      number: 2, challengeType: 'acting', challengeName: 'Ep2',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'SAFE', dana: 'LOW', eve: 'BTM2', faye: 'BTM2' },
      eliminated: ['faye'],
    },
    {
      number: 3, challengeType: 'design', challengeName: 'Ep3',
      placements: { alice: 'HIGH', beth: 'WIN', carol: 'SAFE', dana: 'BTM2', eve: 'BTM2' },
      eliminated: ['eve'],
    },
    {
      number: 4, challengeType: 'dance', challengeName: 'Ep4',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'BTM2', dana: 'BTM2' },
      eliminated: ['dana'],
    },
  ];

  return { id: 'test', name: 'Test Season', queens, episodes };
}

describe('outcomeToEpisodeResult', () => {
  test('converts placements Record to Map', () => {
    const ep = season5.episodes[0]; // Ep 1: roxxxy WIN, penny+serena BTM2, penny eliminated
    const result = outcomeToEpisodeResult(ep);

    expect(result.placements).toBeInstanceOf(Map);
    expect(result.placements.get('roxxxy')).toBe('WIN');
    expect(result.placements.get('penny')).toBe('BTM2');
    expect(result.placements.get('serena')).toBe('BTM2');
    expect(result.placements.get('alaska')).toBe('HIGH');
    expect(result.episodeNumber).toBe(1);
  });

  test('derives lip sync fields from BTM2 queens', () => {
    const ep = season5.episodes[0]; // penny+serena BTM2, penny eliminated
    const result = outcomeToEpisodeResult(ep);

    expect(result.lipSyncMatchup).toContain('penny');
    expect(result.lipSyncMatchup).toContain('serena');
    expect(result.eliminated).toBe('penny');
    expect(result.lipSyncWinner).toBe('serena'); // survived = won the lip sync
  });

  test('handles non-elimination episode', () => {
    const ep = season5.episodes[6]; // Ep 7: non-elim
    const result = outcomeToEpisodeResult(ep);

    expect(result.eliminated).toBe('');
    expect(result.lipSyncMatchup).toContain('alyssa');
    expect(result.lipSyncMatchup).toContain('roxxxy');
  });
});

describe('runFromState', () => {
  test('with fromEpisode=0 produces valid full-season results', () => {
    const { results } = runFromState({
      season: season5,
      fromEpisode: 0,
      numSimulations: 100,
    });

    expect(results.numSimulations).toBe(100);
    // All 14 queens should have win probabilities
    expect(Object.keys(results.winProb)).toHaveLength(14);
    // Win probs should sum to ~1.0
    const totalWinProb = Object.values(results.winProb).reduce((a, b) => a + b, 0);
    expect(totalWinProb).toBeCloseTo(1.0, 1);
  });

  test('respects locked episodes', () => {
    const { results } = runFromState({
      season: season5,
      fromEpisode: 3, // lock eps 0-2
      numSimulations: 200,
    });

    // Ep 1 winner (roxxxy) should be deterministic
    expect(results.episodePlacements[0]['roxxxy']['WIN']).toBe(1.0);
    // Ep 1 BTM2 (penny) should be deterministic
    expect(results.episodePlacements[0]['penny']['BTM2']).toBe(1.0);
    // Ep 2 winner (lineysha) should be deterministic
    expect(results.episodePlacements[1]['lineysha']['WIN']).toBe(1.0);

    // Ep 4 (index 3, first simulated) should have probabilistic values
    const ep3Placements = results.episodePlacements[3];
    const anyQueenProbs = Object.values(ep3Placements);
    // At least some queen should NOT have exactly 1.0 for any placement
    const hasProbabilistic = anyQueenProbs.some((probs) =>
      Object.values(probs).some((p) => p > 0 && p < 1),
    );
    expect(hasProbabilistic).toBe(true);
  });

  test('computes remaining queens correctly after locked eliminations', () => {
    const { results } = runFromState({
      season: season5,
      fromEpisode: 3, // penny elim ep1, serena elim ep2, monica elim ep3
      numSimulations: 100,
    });

    // Eliminated queens should have 0 elim probability at episode 3+
    // (they're already gone)
    expect(results.elimProbByEpisode[3]['penny']).toBe(0);
    expect(results.elimProbByEpisode[3]['serena']).toBe(0);
    expect(results.elimProbByEpisode[3]['monica']).toBe(0);

    // 11 queens should be active at episode 3 (14 - 3 eliminated)
    const activeAtEp3 = Object.entries(results.episodePlacements[3])
      .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
    expect(activeAtEp3).toHaveLength(11);
  });

  test('returns valid buffer and metadata', () => {
    const result = runFromState({
      season: season5,
      fromEpisode: 0,
      numSimulations: 50,
    });

    expect(result.buffer).toBeInstanceOf(Uint8Array);
    expect(result.numQueens).toBe(14);
    expect(result.numEpisodes).toBe(11);
    expect(result.queenIds).toHaveLength(14);
    expect(result.queenIds[0]).toBe('jinkx');
  });
});

// ── Integration: elimination correctness ─────────────────────

describe('elimination integration', () => {
  test('BUG REPRO: queen eliminated in edited episode has 0% win probability', () => {
    // Reproduce the user's bug: edit episode 2 so Jinkx is eliminated,
    // simulate from episode 3 — Jinkx should have 0% win probability.
    const season = structuredClone(season5);
    // Put Jinkx in BTM2 and eliminate her in episode 2 (index 1)
    season.episodes[1].placements['jinkx'] = 'BTM2';
    season.episodes[1].eliminated = ['jinkx'];

    const { results } = runFromState({
      season,
      fromEpisode: 2, // lock eps 0-1, simulate from ep 3
      numSimulations: 500,
    });

    // Jinkx is dead. She must not win.
    expect(results.winProb['jinkx']).toBe(0);
    // She must not appear in any episode after elimination
    for (let ep = 2; ep < results.episodePlacements.length; ep++) {
      const jinkxProbs = results.episodePlacements[ep]['jinkx'];
      const totalActivity = Object.values(jinkxProbs).reduce((a, b) => a + b, 0);
      expect(totalActivity).toBe(0);
    }
  });

  test('eliminated queen does not appear in any subsequent episode', () => {
    const season = makeTestSeason();

    // Lock all 4 episodes — faye elim ep2, eve elim ep3, dana elim ep4
    const { results } = runFromState({
      season,
      fromEpisode: 4,
      numSimulations: 100,
    });

    // faye eliminated in ep2 (index 1) — should have zero placement activity from ep3 onward
    for (let ep = 2; ep < results.episodePlacements.length; ep++) {
      const fayeProbs = results.episodePlacements[ep]['faye'];
      const total = Object.values(fayeProbs).reduce((a, b) => a + b, 0);
      expect(total).toBe(0);
    }

    // eve eliminated in ep3 (index 2) — should have zero from ep4 onward
    for (let ep = 3; ep < results.episodePlacements.length; ep++) {
      const eveProbs = results.episodePlacements[ep]['eve'];
      const total = Object.values(eveProbs).reduce((a, b) => a + b, 0);
      expect(total).toBe(0);
    }
  });

  test('eliminated queen has 0% win probability', () => {
    const season = makeTestSeason();

    // Lock through ep3: faye and eve eliminated
    const { results } = runFromState({
      season,
      fromEpisode: 3,
      numSimulations: 200,
    });

    expect(results.winProb['faye']).toBe(0);
    expect(results.winProb['eve']).toBe(0);
    // Surviving queens should share all the win probability
    const survivorWinProb = results.winProb['alice'] + results.winProb['beth']
      + results.winProb['carol'] + results.winProb['dana'];
    expect(survivorWinProb).toBeCloseTo(1.0, 1);
  });

  test('eliminated queen cannot be eliminated again', () => {
    const season = makeTestSeason();

    const { results } = runFromState({
      season,
      fromEpisode: 2, // faye eliminated in ep2 (locked)
      numSimulations: 200,
    });

    // faye should have 0 elim probability at every simulated episode
    for (let ep = 2; ep < results.elimProbByEpisode.length; ep++) {
      expect(results.elimProbByEpisode[ep]['faye']).toBe(0);
    }
  });

  test('non-elimination episode does not remove anyone', () => {
    const season = makeTestSeason();
    // Ep1 (index 0) is a non-elim episode — all 6 queens survive

    const { results } = runFromState({
      season,
      fromEpisode: 1, // lock ep1 only
      numSimulations: 200,
    });

    // All 6 queens should be active in ep2 (index 1)
    const activeEp2 = Object.entries(results.episodePlacements[1])
      .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
    expect(activeEp2).toHaveLength(6);
  });

  test('win probability shifts to survivors after what-if elimination', () => {
    // Simulate: what if the strongest queen (alaska) is eliminated in ep1?
    const season = structuredClone(season5);
    season.episodes[0].placements['alaska'] = 'BTM2';
    season.episodes[0].eliminated = ['alaska'];

    const { results } = runFromState({
      season,
      fromEpisode: 1,
      numSimulations: 500,
    });

    expect(results.winProb['alaska']).toBe(0);
    // Remaining queens absorb all win probability
    const totalWinProb = Object.values(results.winProb).reduce((a, b) => a + b, 0);
    expect(totalWinProb).toBeCloseTo(1.0, 1);
  });

  test('ROOT CAUSE: runBaseline ignores episode outcomes — eliminated queen can still win', () => {
    // This is the root cause of the bug: if App.tsx runs runBaseline() on an edited
    // season (where Jinkx is ELIM in ep2), runBaseline ignores the outcomes entirely —
    // it simulates from scratch, so Jinkx is alive and dominant.
    // The fix: App.tsx must NOT run runBaseline on edited seasons.
    const season = structuredClone(season5);
    season.episodes[1].placements['jinkx'] = 'BTM2';
    season.episodes[1].eliminated = ['jinkx'];

    // runBaseline does a full sim from scratch — it does NOT read episode outcomes
    const { results: baselineResults } = runBaseline({
      season,
      numSimulations: 500,
    });

    // runFromState correctly locks episodes and respects eliminations
    const { results: fromStateResults } = runFromState({
      season,
      fromEpisode: 2,
      numSimulations: 500,
    });

    // Baseline IGNORES the elimination — Jinkx can still win (this is expected behavior for baseline)
    expect(baselineResults.winProb['jinkx']).toBeGreaterThan(0);
    // fromState RESPECTS it — Jinkx cannot win
    expect(fromStateResults.winProb['jinkx']).toBe(0);
  });
});
