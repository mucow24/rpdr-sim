import { describe, test, expect } from 'vitest';
import { outcomeToEpisodeResult, runFromState, runBaseline, scoreQueen } from './simulate';
import type { SeasonData, Queen, EpisodeData, Placement, BaseStat } from './types';
import { ARCHETYPES, type ArchetypeId } from '../data/archetypes';
import season5 from '../data/season5';

// Build a RegularEpisode-compatible episode stub tagged with the given archetype.
function ep(archetype: ArchetypeId) {
  return { archetype };
}

// ── Minimal test fixture ─────────────────────────────────────
// 6 queens, 4 episodes. Deterministic locked outcomes for clear assertions.
function makeQueen(id: string, skill: number, lipSync: number): Queen {
  return {
    id,
    name: id,
    skills: {
      comedy: skill, improv: skill, acting: skill, dance: skill,
      music: skill, design: skill, runway: skill, charisma: skill,
    },
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
      number: 1, ...ep('standUpRoast'), challengeName: 'Ep1',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'SAFE', dana: 'SAFE', eve: 'LOW', faye: 'BTM2' } as Record<string, Placement>,
      eliminated: [], // non-elim
    },
    {
      number: 2, ...ep('acting'), challengeName: 'Ep2',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'SAFE', dana: 'LOW', eve: 'BTM2', faye: 'BTM2' },
      eliminated: ['faye'],
    },
    {
      number: 3, ...ep('designChallenge'), challengeName: 'Ep3',
      placements: { alice: 'HIGH', beth: 'WIN', carol: 'SAFE', dana: 'BTM2', eve: 'BTM2' },
      eliminated: ['eve'],
    },
    {
      number: 4, ...ep('rusical'), challengeName: 'Ep4',
      placements: { alice: 'WIN', beth: 'HIGH', carol: 'BTM2', dana: 'BTM2' },
      eliminated: ['dana'],
    },
  ];

  return { id: 'test', name: 'Test Season', queens, episodes };
}

describe('weighted scoreQueen', () => {
  // Scores are deterministic when noise = 0.
  // Queen has distinct skill per stat so we can see which stats influenced the score.
  const queen: Queen = {
    id: 'q',
    name: 'Q',
    color: '#000',
    lipSync: 5,
    skills: {
      comedy: 10, improv: 1, acting: 6, dance: 4,
      music: 7, design: 8, runway: 3, charisma: 9,
    },
  };

  function weights(overrides: Partial<Record<BaseStat, number>>): Record<BaseStat, number> {
    const base: Record<BaseStat, number> = {
      comedy: 0, improv: 0, acting: 0, dance: 0,
      music: 0, design: 0, runway: 0, charisma: 0,
    };
    return { ...base, ...overrides };
  }

  test('single-stat weight equals that stat (property test)', () => {
    const stats: BaseStat[] = ['comedy', 'improv', 'acting', 'dance', 'music', 'design', 'runway', 'charisma'];
    for (const stat of stats) {
      const score = scoreQueen(queen, weights({ [stat]: 1 }), 0);
      expect(score).toBeCloseTo(queen.skills[stat], 10);
    }
  });

  test('50/50 weights yield the average of the two stats', () => {
    // comedy=10, acting=6 → average 8
    const score = scoreQueen(queen, weights({ comedy: 1, acting: 1 }), 0);
    expect(score).toBeCloseTo(8, 10);
  });

  test('70/30 weights bias toward the heavier stat', () => {
    // 0.7 * 10 (comedy) + 0.3 * 6 (acting) = 7 + 1.8 = 8.8
    const score = scoreQueen(queen, weights({ comedy: 0.7, acting: 0.3 }), 0);
    expect(score).toBeCloseTo(8.8, 10);
  });

  test('normalization: {a:2,b:2} scores identically to {a:1,b:1} and {a:0.5,b:0.5}', () => {
    const s1 = scoreQueen(queen, weights({ comedy: 2, acting: 2 }), 0);
    const s2 = scoreQueen(queen, weights({ comedy: 1, acting: 1 }), 0);
    const s3 = scoreQueen(queen, weights({ comedy: 0.5, acting: 0.5 }), 0);
    expect(s1).toBeCloseTo(s2, 10);
    expect(s2).toBeCloseTo(s3, 10);
  });

  test('stats with weight 0 contribute nothing', () => {
    const pure = scoreQueen(queen, weights({ comedy: 1 }), 0);
    const padded = scoreQueen(queen, weights({ comedy: 1, design: 0, acting: 0, dance: 0 }), 0);
    expect(pure).toBeCloseTo(padded, 10);
  });

  test('empty weights → skill contribution is 0 (noise-only score, which is 0 at noise=0)', () => {
    const score = scoreQueen(queen, weights({}), 0);
    expect(score).toBeCloseTo(0, 10);
  });

  test('archetype weights resolve correctly through scoring', () => {
    // snatchGame archetype: comedy:30, improv:50, acting:5, charisma:15 → total 100
    // score = (10*30 + 1*50 + 6*5 + 9*15) / 100 = (300 + 50 + 30 + 135) / 100 = 5.15
    const score = scoreQueen(queen, ARCHETYPES.snatchGame.weights, 0);
    expect(score).toBeCloseTo(5.15, 10);
  });
});

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
    const hasProbabilistic = anyQueenProbs.some((probs) =>
      Object.values(probs).some((p) => p > 0 && p < 1),
    );
    expect(hasProbabilistic).toBe(true);
  });

  test('computes remaining queens correctly after locked eliminations', () => {
    const { results } = runFromState({
      season: season5,
      fromEpisode: 3,
      numSimulations: 100,
    });

    expect(results.elimProbByEpisode[3]['penny']).toBe(0);
    expect(results.elimProbByEpisode[3]['serena']).toBe(0);
    expect(results.elimProbByEpisode[3]['monica']).toBe(0);

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
    expect(result.numEpisodes).toBe(14);
    expect(result.queenIds).toHaveLength(14);
    expect(result.queenIds[0]).toBe('jinkx');
  });
});

// ── Integration: elimination correctness ─────────────────────

describe('elimination integration', () => {
  test('BUG REPRO: queen eliminated in edited episode has 0% win probability', () => {
    const season = structuredClone(season5);
    season.episodes[1].placements['jinkx'] = 'BTM2';
    season.episodes[1].eliminated = ['jinkx'];

    const { results } = runFromState({
      season,
      fromEpisode: 2,
      numSimulations: 500,
    });

    expect(results.winProb['jinkx']).toBe(0);
    for (let ep = 2; ep < results.episodePlacements.length; ep++) {
      const jinkxProbs = results.episodePlacements[ep]['jinkx'];
      const totalActivity = Object.values(jinkxProbs).reduce((a, b) => a + b, 0);
      expect(totalActivity).toBe(0);
    }
  });

  test('eliminated queen does not appear in any subsequent episode', () => {
    const season = makeTestSeason();

    const { results } = runFromState({
      season,
      fromEpisode: 4,
      numSimulations: 100,
    });

    for (let ep = 2; ep < results.episodePlacements.length; ep++) {
      const fayeProbs = results.episodePlacements[ep]['faye'];
      const total = Object.values(fayeProbs).reduce((a, b) => a + b, 0);
      expect(total).toBe(0);
    }

    for (let ep = 3; ep < results.episodePlacements.length; ep++) {
      const eveProbs = results.episodePlacements[ep]['eve'];
      const total = Object.values(eveProbs).reduce((a, b) => a + b, 0);
      expect(total).toBe(0);
    }
  });

  test('eliminated queen has 0% win probability', () => {
    const season = makeTestSeason();

    const { results } = runFromState({
      season,
      fromEpisode: 3,
      numSimulations: 200,
    });

    expect(results.winProb['faye']).toBe(0);
    expect(results.winProb['eve']).toBe(0);
    const survivorWinProb = results.winProb['alice'] + results.winProb['beth']
      + results.winProb['carol'] + results.winProb['dana'];
    expect(survivorWinProb).toBeCloseTo(1.0, 1);
  });

  test('eliminated queen cannot be eliminated again', () => {
    const season = makeTestSeason();

    const { results } = runFromState({
      season,
      fromEpisode: 2,
      numSimulations: 200,
    });

    for (let ep = 2; ep < results.elimProbByEpisode.length; ep++) {
      expect(results.elimProbByEpisode[ep]['faye']).toBe(0);
    }
  });

  test('non-elimination episode does not remove anyone', () => {
    const season = makeTestSeason();

    const { results } = runFromState({
      season,
      fromEpisode: 1,
      numSimulations: 200,
    });

    const activeEp2 = Object.entries(results.episodePlacements[1])
      .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
    expect(activeEp2).toHaveLength(6);
  });

  test('win probability shifts to survivors after what-if elimination', () => {
    const season = structuredClone(season5);
    season.episodes[0].placements['alaska'] = 'BTM2';
    season.episodes[0].eliminated = ['alaska'];

    const { results } = runFromState({
      season,
      fromEpisode: 1,
      numSimulations: 500,
    });

    expect(results.winProb['alaska']).toBe(0);
    const totalWinProb = Object.values(results.winProb).reduce((a, b) => a + b, 0);
    expect(totalWinProb).toBeCloseTo(1.0, 1);
  });

  test('ROOT CAUSE: runBaseline ignores episode outcomes — eliminated queen can still win', () => {
    const season = structuredClone(season5);
    season.episodes[1].placements['jinkx'] = 'BTM2';
    season.episodes[1].eliminated = ['jinkx'];

    const { results: baselineResults } = runBaseline({
      season,
      numSimulations: 500,
    });

    const { results: fromStateResults } = runFromState({
      season,
      fromEpisode: 2,
      numSimulations: 500,
    });

    expect(baselineResults.winProb['jinkx']).toBeGreaterThan(0);
    expect(fromStateResults.winProb['jinkx']).toBe(0);
  });
});

// ── Non-elimination episodes + early termination ───────────

describe('non-elimination episodes', () => {
  test('runBaseline respects non-elim episodes: no queen eliminated at ep with eliminated:[]', () => {
    const season = makeTestSeason();

    const { results } = runBaseline({
      season,
      numSimulations: 500,
    });

    for (const q of season.queens) {
      expect(results.elimProbByEpisode[0][q.id]).toBe(0);
    }

    const activeEp0 = Object.entries(results.episodePlacements[0])
      .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
    expect(activeEp0).toHaveLength(6);
  });

  test('all defined episodes produce placement data', () => {
    const season = makeTestSeason();

    const { results } = runBaseline({
      season,
      numSimulations: 500,
    });

    expect(results.episodePlacements).toHaveLength(4);

    for (let ep = 0; ep < 4; ep++) {
      const activeQueens = Object.entries(results.episodePlacements[ep])
        .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
      expect(activeQueens.length).toBeGreaterThan(0);
    }
  });

  test('correct finalist count with non-elim episodes', () => {
    const season = makeTestSeason();

    const { results } = runBaseline({
      season,
      numSimulations: 1000,
    });

    const activeLastEp = Object.entries(results.episodePlacements[3])
      .filter(([, probs]) => Object.values(probs).some((p) => p > 0));
    expect(activeLastEp.length).toBeGreaterThanOrEqual(3);

    const maxElimEp0 = Math.max(...Object.values(results.elimProbByEpisode[0]));
    expect(maxElimEp0).toBe(0);
  });
});

// ── Finale episode ───────────────────────────────────────────

describe('finale episode', () => {
  test('Season 5: reachedFinaleProb equals aliveProbByEpisode at finale index', () => {
    const { results } = runBaseline({
      season: season5,
      numSimulations: 1000,
    });

    const finaleIdx = season5.episodes.length - 1;
    for (const q of season5.queens) {
      const reached = results.reachedFinaleProb[q.id] ?? 0;
      const alive = results.aliveProbByEpisode[finaleIdx][q.id] ?? 0;
      expect(reached).toBeCloseTo(alive, 10);
    }
  });

  test('Season 5: finale winner totals sum to ~1 over finalists', () => {
    const { results } = runBaseline({
      season: season5,
      numSimulations: 2000,
    });

    const totalWin = Object.values(results.winProb).reduce((a, b) => a + b, 0);
    expect(totalWin).toBeCloseTo(1.0, 1);
  });
});
