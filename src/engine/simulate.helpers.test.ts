/** Direct unit tests for internal helpers in simulate.ts.
 *
 *  Scope: each helper is tested in isolation with hand-crafted inputs whose
 *  expected outputs are derivable by eye — so a failure pinpoints which helper
 *  is wrong, not which phase of a multi-step pipeline. Contrast with
 *  simulate.correctness.test.ts, which exercises end-to-end runs, and
 *  simulate.golden.test.ts, which regression-locks full aggregate output.
 *
 *  The buffer layout these tests depend on is documented in simulate.ts
 *  ("Compact buffer layout"): per-run [placements][finalPlace], with placement
 *  bytes 0..5 + 255-sentinel and 1-based final ranks. */

import { describe, test, expect } from 'vitest';
import {
  assignPlacements,
  aggregateFromBuffer,
  bytesPerRun,
  buildMidSeason,
  extractTrajectories,
  getMatchingIndices,
  outcomeToEpisodeResult,
  runBaseline,
} from './simulate';
import type {
  EpisodeData,
  FilterCondition,
  PassEpisode,
  Placement,
  Queen,
  RegularEpisode,
  SeasonData,
} from './types';
import {
  ELIM_PLACEMENT,
  OUTCOME_EPISODE_INDEX,
  PLACEMENT_INDEX,
  PLACEMENTS,
} from './types';

// ── Fixtures ────────────────────────────────────────────────

function mkQueen(id: string, overrides: Partial<Queen> = {}): Queen {
  return {
    id,
    name: id,
    color: '#000',
    lipSync: 5,
    skills: {
      comedy: 5, improv: 5, acting: 5, dance: 5,
      music: 5, design: 5, runway: 5, charisma: 5,
    },
    ...overrides,
  };
}

function mkScores(scores: number[]): { queenId: string; score: number }[] {
  return scores.map((score, i) => ({ queenId: `q${i + 1}`, score }));
}

function countPlacements(map: Map<string, string>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of map.values()) counts[v] = (counts[v] ?? 0) + 1;
  return counts;
}

// ── assignPlacements ────────────────────────────────────────
//
// Placement rule ([simulate.ts:73-82] — Placement):
//   i=0:                              WIN
//   i=1 or (n>=8 and i=2):            HIGH
//   i=n-1 or i=n-2:                   BTM2
//   i=n-3 or (n>=8 and i=n-4):        LOW
//   else:                             SAFE
// Branch order matters: HIGH check precedes BTM2 check, so at small n some
// slots shadow each other (tested below).

describe('assignPlacements — field-size contract', () => {
  // Scores are in descending order so the i-th ranked queen is at index i.
  // Easier to reason about expected placements by list position.

  test('n=2: WIN, HIGH — no BTM2 because HIGH check wins for i=1', () => {
    const out = assignPlacements(mkScores([10, 9]));
    expect(out.get('q1')).toBe('WIN');
    expect(out.get('q2')).toBe('HIGH');
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1 });
  });

  test('n=3: WIN, HIGH, BTM2 — only 1 BTM2 (i=1 shadowed to HIGH)', () => {
    const out = assignPlacements(mkScores([10, 9, 8]));
    expect(out.get('q1')).toBe('WIN');
    expect(out.get('q2')).toBe('HIGH');
    expect(out.get('q3')).toBe('BTM2');
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1, BTM2: 1 });
  });

  test('n=4: WIN, HIGH, BTM2, BTM2 — LOW unreachable', () => {
    const out = assignPlacements(mkScores([10, 9, 8, 7]));
    expect(out.get('q1')).toBe('WIN');
    expect(out.get('q2')).toBe('HIGH');
    expect(out.get('q3')).toBe('BTM2');
    expect(out.get('q4')).toBe('BTM2');
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1, BTM2: 2 });
  });

  test('n=5: WIN, HIGH, LOW, BTM2, BTM2', () => {
    const out = assignPlacements(mkScores([10, 9, 8, 7, 6]));
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1, LOW: 1, BTM2: 2 });
    expect(out.get('q3')).toBe('LOW');
  });

  test('n=6: WIN, HIGH, SAFE, LOW, BTM2, BTM2', () => {
    const out = assignPlacements(mkScores([10, 9, 8, 7, 6, 5]));
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1, SAFE: 1, LOW: 1, BTM2: 2 });
  });

  test('n=7: WIN, HIGH, SAFE×2, LOW, BTM2×2 — still 1 HIGH and 1 LOW', () => {
    const out = assignPlacements(mkScores([10, 9, 8, 7, 6, 5, 4]));
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 1, SAFE: 2, LOW: 1, BTM2: 2 });
  });

  test('n=8 phase transition: HIGH jumps 1→2 AND LOW jumps 1→2', () => {
    const out = assignPlacements(mkScores([10, 9, 8, 7, 6, 5, 4, 3]));
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 2, SAFE: 1, LOW: 2, BTM2: 2 });
    // Specifically: i=2 becomes HIGH, i=n-4=4 becomes LOW.
    expect(out.get('q3')).toBe('HIGH');
    expect(out.get('q5')).toBe('LOW');
  });

  test('n=14 (S5 size): WIN×1, HIGH×2, SAFE×7, LOW×2, BTM2×2 → total 14', () => {
    const scores = Array.from({ length: 14 }, (_, i) => 20 - i);
    const out = assignPlacements(mkScores(scores));
    expect(countPlacements(out)).toEqual({ WIN: 1, HIGH: 2, SAFE: 7, LOW: 2, BTM2: 2 });
  });

  test('ties broken by sort stability — equal scores do not crash', () => {
    const out = assignPlacements(mkScores([5, 5, 5, 5]));
    // No assertion on which queen gets which — only that all 4 got a placement.
    expect(out.size).toBe(4);
  });
});

// ── aggregateFromBuffer ────────────────────────────────────
//
// Hand-crafted buffers: 3 queens, 2 episodes, 4 runs. Each byte is picked
// so the resulting probabilities are rational and easy to verify.

describe('aggregateFromBuffer — arithmetic on hand-crafted buffers', () => {
  function threeQueenTwoEpSeason(): SeasonData {
    return {
      id: 'test', name: 'T',
      queens: [mkQueen('a'), mkQueen('b'), mkQueen('c')],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { a: 'WIN', b: 'HIGH', c: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
        },
        {
          kind: 'finale', number: 2, finaleType: 'default',
          challengeName: 'Finale', placements: {}, eliminated: [],
        },
      ],
    };
  }

  test('basic: 4 runs, queen a wins 2/4, b wins 1/4, c wins 1/4', () => {
    const season = threeQueenTwoEpSeason();
    const stride = bytesPerRun(3, 2); // 2*3 + 3 = 9
    const buf = new Uint8Array(stride * 4);

    // Run 0: ep1 a=WIN b=HIGH c=BTM2; finale a=WIN b=ELIM c=ELIM; final 1,2,3
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2, // ep1
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, ELIM_PLACEMENT,             // finale
      1, 2, 3,                                                         // final ranks
    ], 0);
    // Run 1: same shape, a wins
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2,
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, ELIM_PLACEMENT,
      1, 2, 3,
    ], stride);
    // Run 2: b wins
    buf.set([
      PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2,
      ELIM_PLACEMENT, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT,
      2, 1, 3,
    ], stride * 2);
    // Run 3: c wins
    buf.set([
      PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN,
      ELIM_PLACEMENT, ELIM_PLACEMENT, PLACEMENT_INDEX.WIN,
      3, 2, 1,
    ], stride * 3);

    const results = aggregateFromBuffer(buf, 4, season);
    expect(results.numSimulations).toBe(4);
    expect(results.winProb.a).toBe(0.5);
    expect(results.winProb.b).toBe(0.25);
    expect(results.winProb.c).toBe(0.25);
    // Alive at finale = everyone (we didn't pre-eliminate anyone)
    expect(results.aliveProbByEpisode[1].a).toBe(1);
    expect(results.aliveProbByEpisode[1].b).toBe(1);
    expect(results.reachedFinaleProb.a).toBe(1);
    // placementDist: a finished 1st in 2 runs, 2nd in 1, 3rd in 1
    expect(results.placementDist.a).toEqual([0, 0.5, 0.25, 0.25]);
    // placementDist[queen][0] is unused (place 0 isn't valid) and must be 0
    expect(results.placementDist.a[0]).toBe(0);
  });

  test('absent-queen sentinel 255 reduces alive count', () => {
    const season = threeQueenTwoEpSeason();
    const stride = bytesPerRun(3, 2);
    const buf = new Uint8Array(stride * 2);
    // Run 0: queen c absent in ep1 and finale, final rank 255.
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, 255,
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 255,
      1, 2, 255,
    ], 0);
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, 255,
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 255,
      1, 2, 255,
    ], stride);

    const results = aggregateFromBuffer(buf, 2, season);
    // c never appears alive
    expect(results.aliveProbByEpisode[0].c).toBe(0);
    expect(results.aliveProbByEpisode[1].c).toBe(0);
    expect(results.reachedFinaleProb.c).toBe(0);
    // placementDist for c is all zeros (no runs had c finishing)
    expect(results.placementDist.c.every((p) => p === 0)).toBe(true);
  });

  test('matchingIndices filters the aggregation to the masked subset', () => {
    const season = threeQueenTwoEpSeason();
    const stride = bytesPerRun(3, 2);
    const buf = new Uint8Array(stride * 4);
    // Same 4 runs as the basic test above
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2,
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, ELIM_PLACEMENT, 1, 2, 3,
    ], 0);
    buf.set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2,
      PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, ELIM_PLACEMENT, 1, 2, 3,
    ], stride);
    buf.set([
      PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2,
      ELIM_PLACEMENT, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 2, 1, 3,
    ], stride * 2);
    buf.set([
      PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN,
      ELIM_PLACEMENT, ELIM_PLACEMENT, PLACEMENT_INDEX.WIN, 3, 2, 1,
    ], stride * 3);

    // Filter to runs where a won (runs 0 and 1)
    const results = aggregateFromBuffer(buf, 4, season, [0, 1]);
    expect(results.numSimulations).toBe(2);
    expect(results.winProb.a).toBe(1);
    expect(results.winProb.b).toBe(0);
  });
});

// ── getMatchingIndices ──────────────────────────────────────

describe('getMatchingIndices — condition types', () => {
  function mkBuf(): { buf: Uint8Array; season: SeasonData } {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('a'), mkQueen('b')],
      episodes: [
        { number: 1, archetype: 'ball', challengeName: 'e1',
          placements: {}, eliminated: [] },
        { number: 2, archetype: 'ball', challengeName: 'e2',
          placements: {}, eliminated: [] },
      ],
    };
    const stride = bytesPerRun(2, 2); // 2*2 + 2 = 6
    const buf = new Uint8Array(stride * 4);
    // Run 0: ep1 a=WIN b=BTM2; ep2 a=WIN b=ELIM; final a=1 b=2
    buf.set([PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 1, 2], 0);
    // Run 1: ep1 a=BTM2 b=WIN; ep2 a=ELIM b=WIN; final a=2 b=1
    buf.set([PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, PLACEMENT_INDEX.WIN, 2, 1], stride);
    // Run 2: ep1 a=WIN b=BTM2; ep2 a=BTM2 b=WIN; final a=2 b=1
    buf.set([PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, 2, 1], stride * 2);
    // Run 3: ep1 a=WIN b=BTM2; ep2 a=WIN b=ELIM; final a=1 b=2
    buf.set([PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 1, 2], stride * 3);
    return { buf, season };
  }

  test('placement pin (a=WIN in ep1) matches runs 0,2,3', () => {
    const { buf } = mkBuf();
    const cond: FilterCondition = { episodeIndex: 0, queenIndex: 0, placement: PLACEMENT_INDEX.WIN };
    expect(getMatchingIndices(buf, 4, [cond], 2, 2)).toEqual([0, 2, 3]);
  });

  test('OUTCOME WIN pin (a=winner) matches runs 0,3', () => {
    const { buf } = mkBuf();
    const cond: FilterCondition = {
      episodeIndex: OUTCOME_EPISODE_INDEX, queenIndex: 0, placement: PLACEMENT_INDEX.WIN,
    };
    expect(getMatchingIndices(buf, 4, [cond], 2, 2)).toEqual([0, 3]);
  });

  test('OUTCOME non-WIN pin (a=BTM2 means "a did not win") matches runs 1,2', () => {
    // At OUTCOME index, a non-WIN placement means "finalPlace !== 1" —
    // the actual placement value is ignored beyond "is this a WIN pin or not".
    const { buf } = mkBuf();
    const cond: FilterCondition = {
      episodeIndex: OUTCOME_EPISODE_INDEX, queenIndex: 0, placement: PLACEMENT_INDEX.BTM2,
    };
    expect(getMatchingIndices(buf, 4, [cond], 2, 2)).toEqual([1, 2]);
  });

  test('OUTCOME ELIM pin and OUTCOME BTM2 pin do the same thing', () => {
    // Both mean "didn't win the season" — semantics documented.
    const { buf } = mkBuf();
    const elimPin: FilterCondition = {
      episodeIndex: OUTCOME_EPISODE_INDEX, queenIndex: 0, placement: ELIM_PLACEMENT,
    };
    const btm2Pin: FilterCondition = {
      episodeIndex: OUTCOME_EPISODE_INDEX, queenIndex: 0, placement: PLACEMENT_INDEX.BTM2,
    };
    expect(getMatchingIndices(buf, 4, [elimPin], 2, 2)).toEqual(
      getMatchingIndices(buf, 4, [btm2Pin], 2, 2),
    );
  });

  test('ELIM pin on a specific episode (b eliminated in ep2) matches runs 0,3', () => {
    const { buf } = mkBuf();
    const cond: FilterCondition = {
      episodeIndex: 1, queenIndex: 1, placement: ELIM_PLACEMENT,
    };
    expect(getMatchingIndices(buf, 4, [cond], 2, 2)).toEqual([0, 3]);
  });

  test('multi-condition AND: a=WIN in ep1 AND b=WIN in ep2 matches only run 2', () => {
    const { buf } = mkBuf();
    const conds: FilterCondition[] = [
      { episodeIndex: 0, queenIndex: 0, placement: PLACEMENT_INDEX.WIN },
      { episodeIndex: 1, queenIndex: 1, placement: PLACEMENT_INDEX.WIN },
    ];
    expect(getMatchingIndices(buf, 4, conds, 2, 2)).toEqual([2]);
  });

  test('empty conditions: every run matches (vacuous AND)', () => {
    const { buf } = mkBuf();
    expect(getMatchingIndices(buf, 4, [], 2, 2)).toEqual([0, 1, 2, 3]);
  });
});

// ── extractTrajectories ────────────────────────────────────

describe('extractTrajectories — path accounting', () => {
  function mkBuf() {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('a'), mkQueen('b')],
      episodes: [
        { number: 1, archetype: 'ball', challengeName: 'e1', placements: {}, eliminated: [] },
        { number: 2, archetype: 'ball', challengeName: 'e2', placements: {}, eliminated: [] },
      ],
    };
    const stride = bytesPerRun(2, 2);
    const buf = new Uint8Array(stride * 3);
    // Run 0: a WIN→WIN
    buf.set([PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 1, 2], 0);
    // Run 1: a WIN→WIN (same path as run 0)
    buf.set([PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, 1, 2], stride);
    // Run 2: a BTM2→ELIM (eliminated in ep2); path stops at ELIM (byte 5), not 255
    buf.set([PLACEMENT_INDEX.BTM2, PLACEMENT_INDEX.WIN, ELIM_PLACEMENT, PLACEMENT_INDEX.WIN, 2, 1], stride * 2);
    return { buf, season };
  }

  test('unfiltered: merges identical paths, sorts by count desc', () => {
    const { buf, season } = mkBuf();
    const { paths, scannedRuns } = extractTrajectories(buf, 3, season, 'a', []);
    expect(scannedRuns).toBe(3);
    expect(paths[0]).toEqual({
      placements: [PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.WIN],
      count: 2,
    });
    expect(paths[1]).toEqual({
      placements: [PLACEMENT_INDEX.BTM2, ELIM_PLACEMENT],
      count: 1,
    });
  });

  test('filtered branch: conditions narrow the scan (covers uncovered branch)', () => {
    const { buf, season } = mkBuf();
    // Only runs where a finished 1st (runs 0 and 1).
    const conds: FilterCondition[] = [{
      episodeIndex: OUTCOME_EPISODE_INDEX, queenIndex: 0, placement: PLACEMENT_INDEX.WIN,
    }];
    const { paths, scannedRuns } = extractTrajectories(buf, 3, season, 'a', conds);
    expect(scannedRuns).toBe(2);
    expect(paths).toEqual([{ placements: [PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.WIN], count: 2 }]);
  });

  test('unknown queen id returns empty', () => {
    const { buf, season } = mkBuf();
    const { paths, scannedRuns } = extractTrajectories(buf, 3, season, 'not_a_queen', []);
    expect(paths).toEqual([]);
    expect(scannedRuns).toBe(0);
  });

  test('255 sentinel terminates path', () => {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('a')],
      episodes: [
        { number: 1, archetype: 'ball', challengeName: 'e1', placements: {}, eliminated: [] },
        { number: 2, archetype: 'ball', challengeName: 'e2', placements: {}, eliminated: [] },
      ],
    };
    const stride = bytesPerRun(1, 2);
    const buf = new Uint8Array(stride);
    // Run 0: a=WIN ep1, absent ep2 (255 — edge case, not produced by sim today but buffer layout accepts it)
    buf.set([PLACEMENT_INDEX.WIN, 255, 1], 0);
    const { paths } = extractTrajectories(buf, 1, season, 'a', []);
    expect(paths[0].placements).toEqual([PLACEMENT_INDEX.WIN]);
  });
});

// ── buildMidSeason ─────────────────────────────────────────

describe('buildMidSeason — lock-set derivation', () => {
  function season6(episodes: EpisodeData[]): SeasonData {
    return {
      id: 't', name: 'T',
      queens: Array.from({ length: 6 }, (_, i) => mkQueen(`q${i + 1}`)),
      episodes,
    };
  }

  test('fromEpisode=0 leaves all queens alive, no prior results', () => {
    const season = season6([
      { number: 1, archetype: 'ball', challengeName: 'e1', placements: {}, eliminated: ['q6'] },
    ]);
    const state = buildMidSeason(season, 0);
    expect(state.remainingQueenIds).toEqual(new Set(['q1', 'q2', 'q3', 'q4', 'q5', 'q6']));
    expect(state.priorResults).toEqual([]);
    expect(state.startEpisodeIndex).toBe(0);
  });

  test('single-elim locked episode shrinks alive set by 1', () => {
    const season = season6([
      { number: 1, archetype: 'ball', challengeName: 'e1',
        placements: { q5: 'BTM2', q6: 'BTM2' } as Record<string, Placement>,
        eliminated: ['q6'] },
    ]);
    const state = buildMidSeason(season, 1);
    expect(state.remainingQueenIds).toEqual(new Set(['q1', 'q2', 'q3', 'q4', 'q5']));
    expect(state.startEpisodeIndex).toBe(1);
    expect(state.priorResults).toHaveLength(1);
  });

  test('double-elim inside locked range removes both losers', () => {
    const season = season6([
      { number: 1, archetype: 'ball', challengeName: 'e1',
        placements: { q5: 'BTM2', q6: 'BTM2' } as Record<string, Placement>,
        eliminated: ['q5', 'q6'] },
    ]);
    const state = buildMidSeason(season, 1);
    expect(state.remainingQueenIds).toEqual(new Set(['q1', 'q2', 'q3', 'q4']));
  });

  test('pass episode inside locked range contributes no eliminations', () => {
    const season = season6([
      { kind: 'pass', number: 1, challengeName: 'reunion' } as PassEpisode,
      { number: 2, archetype: 'ball', challengeName: 'e2',
        placements: { q5: 'BTM2', q6: 'BTM2' } as Record<string, Placement>,
        eliminated: ['q6'] },
    ]);
    const state = buildMidSeason(season, 2);
    expect(state.remainingQueenIds).toEqual(new Set(['q1', 'q2', 'q3', 'q4', 'q5']));
    expect(state.priorResults).toHaveLength(2);
  });

  test('fromEpisode > episodes.length clamps naturally (all locked)', () => {
    const season = season6([
      { number: 1, archetype: 'ball', challengeName: 'e1',
        placements: {}, eliminated: ['q6'] },
    ]);
    const state = buildMidSeason(season, 99);
    // Only 1 episode exists; the loop guard stops there.
    expect(state.priorResults).toHaveLength(1);
    expect(state.remainingQueenIds.has('q6')).toBe(false);
    // startEpisodeIndex echoes the input verbatim (caller's responsibility).
    expect(state.startEpisodeIndex).toBe(99);
  });
});

// ── outcomeToEpisodeResult ─────────────────────────────────

describe('outcomeToEpisodeResult — branches', () => {
  test('pass episode: empty placements, empty lipsync, empty eliminated', () => {
    const ep: PassEpisode = { kind: 'pass', number: 3, challengeName: 'reunion' };
    const r = outcomeToEpisodeResult(ep);
    expect(r.episodeNumber).toBe(3);
    expect(r.placements.size).toBe(0);
    expect(r.lipSyncMatchup).toEqual(['', '']);
    expect(r.lipSyncWinner).toBe('');
    expect(r.eliminated).toBe('');
  });

  test('regular with 2 BTM2 and 1 eliminated: survivor listed as lipSyncWinner', () => {
    const ep: RegularEpisode = {
      number: 1, archetype: 'ball', challengeName: 'e1',
      placements: { a: 'WIN', b: 'BTM2', c: 'BTM2' } as Record<string, Placement>,
      eliminated: ['c'],
    };
    const r = outcomeToEpisodeResult(ep);
    expect(r.lipSyncMatchup).toContain('b');
    expect(r.lipSyncMatchup).toContain('c');
    expect(r.lipSyncWinner).toBe('b');
    expect(r.eliminated).toBe('c');
  });

  test('non-elim regular episode: eliminated field is empty string', () => {
    const ep: RegularEpisode = {
      number: 1, archetype: 'ball', challengeName: 'e1',
      placements: { a: 'WIN' } as Record<string, Placement>,
      eliminated: [],
    };
    const r = outcomeToEpisodeResult(ep);
    expect(r.eliminated).toBe('');
  });
});

// ── Buffer encoding invariants ─────────────────────────────

describe('buffer encoding invariants', () => {
  function tinySeason(): SeasonData {
    return {
      id: 't', name: 'T',
      queens: [mkQueen('a'), mkQueen('b'), mkQueen('c'), mkQueen('d')],
      episodes: [
        { number: 1, archetype: 'ball', challengeName: 'e1', placements: {}, eliminated: [] },
        { number: 2, archetype: 'ball', challengeName: 'e2',
          placements: {} as Record<string, Placement>, eliminated: [] },
        { kind: 'finale', number: 3, finaleType: 'default',
          challengeName: 'Finale', placements: {}, eliminated: [] },
      ],
    };
  }

  test('every byte in a runBaseline buffer is a valid value', () => {
    const { buffer, numQueens, numEpisodes } = runBaseline({
      season: tinySeason(), numSimulations: 100, seed: 1,
    });
    const stride = bytesPerRun(numQueens, numEpisodes);
    const placementValues = new Set([
      PLACEMENT_INDEX.WIN, PLACEMENT_INDEX.HIGH, PLACEMENT_INDEX.SAFE,
      PLACEMENT_INDEX.LOW, PLACEMENT_INDEX.BTM2, ELIM_PLACEMENT, 255,
    ]);

    for (let r = 0; r < 100; r++) {
      const base = r * stride;
      // Placement section bytes ∈ {0..5, 255}
      for (let i = 0; i < numEpisodes * numQueens; i++) {
        expect(placementValues.has(buffer[base + i])).toBe(true);
      }
      // Final rank section bytes ∈ {1..numQueens, 255}. 0 is reserved.
      for (let qi = 0; qi < numQueens; qi++) {
        const rank = buffer[base + numEpisodes * numQueens + qi];
        if (rank === 255) continue;
        expect(rank).toBeGreaterThanOrEqual(1);
        expect(rank).toBeLessThanOrEqual(numQueens);
      }
    }
  });

  test('PLACEMENTS tuple does not include ELIM (ELIM is an outcome marker, not a placement)', () => {
    // Enforces the domain boundary documented in types.ts — chart code iterates
    // PLACEMENTS and would double-count if ELIM leaked in.
    expect(PLACEMENTS).not.toContain('ELIM');
  });
});
