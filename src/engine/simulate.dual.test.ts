/** Dual-timeline driver: single MC pass that emits both rigged and r=0
 *  counterfactual results. Replaces the App.tsx two-pass hack.
 *
 *  Layered tests:
 *    [shortcut]      — riggory=0 returns aliased BaselineResult; no dual work.
 *    [oracle]        — zero-noise season + custom RNG forces a known divergence
 *                      and asserts each fork's elimination matches expectation.
 *    [coupled]       — when rigged and r=0 lipsyncs agree, both forks share
 *                      the trajectory (no fork ever fires).
 *    [statistical]   — at riggory>0, dual r0 aggregates match a separate
 *                      runBaseline({riggory:0}) within MC tolerance.
 *    [post-fork]     — after divergence, immunity / double-elim / pass
 *                      handling still works on each fork independently. */

import { describe, test, expect } from 'vitest';
import {
  runBaseline,
  runBaselineDual,
  simulateOneSeasonDual,
} from './simulate';
import type { EpisodeData, PassEpisode, Placement, Queen, SeasonData } from './types';
import type { Rng } from './rng';

// ── Fixtures ────────────────────────────────────────────────

function mkQueen(id: string, skill: number, lipSync = 5): Queen {
  return {
    id, name: id, color: '#000', lipSync,
    skills: {
      comedy: skill, improv: skill, acting: skill, dance: skill,
      music: skill, design: skill, runway: skill, charisma: skill,
    },
  };
}

function ballEp(number: number, eliminated: string[] = []): EpisodeData {
  return {
    number, archetype: 'ball', challengeName: `ep${number}`,
    placements: {} as Record<string, Placement>, eliminated,
  };
}

function finaleEp(number: number): EpisodeData {
  return {
    kind: 'finale', number, finaleType: 'default',
    challengeName: 'Finale', placements: {}, eliminated: [],
  };
}

function passEp(number: number): PassEpisode {
  return { kind: 'pass', number, challengeName: 'reunion' };
}

// Custom RNG that emits a fixed sequence and then loops. Test code controls
// the exact `u` drawn at each lipsync; finale draws (Box-Muller × 2 per
// finalist) cycle through the same sequence — fine because tests only assert
// on lipsync outcomes, not finale rankings.
function fixedRng(values: number[]): Rng {
  let i = 0;
  return () => values[i++ % values.length];
}

// ── [shortcut] riggory=0 path ───────────────────────────────

describe('[shortcut] runBaselineDual at riggory=0', () => {
  test('returns aliased BaselineResult — no dual machinery executed', () => {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('q1', 10), mkQueen('q2', 5), mkQueen('q3', 1)],
      episodes: [ballEp(1, ['q3']), finaleEp(2)],
    };
    const dual = runBaselineDual({ season, numSimulations: 50, seed: 7 });
    expect(dual.rigged).toBe(dual.r0); // object identity — same reference
    expect(dual.rigged.results.numSimulations).toBe(50);
  });

  test('shortcut output matches a plain runBaseline at riggory=0', () => {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('q1', 10), mkQueen('q2', 8), mkQueen('q3', 3), mkQueen('q4', 1)],
      episodes: [ballEp(1, ['q4']), ballEp(2, ['q3']), finaleEp(3)],
    };
    const dual = runBaselineDual({ season, numSimulations: 100, seed: 7 });
    const single = runBaseline({ season, numSimulations: 100, seed: 7 });
    // Byte-identical buffer: shortcut delegates to the same runBaseline call.
    expect(dual.rigged.buffer).toEqual(single.buffer);
  });
});

// ── [oracle] divergence with controlled RNG ─────────────────
//
// Setup engineered so the second lipsync (ep2) is guaranteed to diverge:
//   6 queens, lipSync=5 each (pStat = 0.5 always), skills [10,9,8,7,2,1].
//   Ep1 noise=0 → BTM2 = {q5, q6}, both with rigScore = -4 entering lipsync,
//     so pRig defaults to pStat (tie → fallback) and no divergence is possible.
//   Ep2 noise=0, q6 is gone → BTM2 = {q4, q5}. After ep2 bands fire, q4 = -6,
//     q5 = -12, so pRig = 1 (q4 is the frontrunner). At riggory=1: pBlend = 1.
//   With u=0.7 at ep2's lipsync: pBlend says q4 wins; pStat says q5 wins.
//   That's the divergence.

describe('[oracle] divergence at a single lipsync', () => {
  function divergenceFixture() {
    const queens: Queen[] = [
      mkQueen('q1', 10), mkQueen('q2', 9), mkQueen('q3', 8),
      mkQueen('q4', 7),  mkQueen('q5', 2), mkQueen('q6', 1),
    ];
    const episodes: EpisodeData[] = [
      ballEp(1, ['q6']), // single elim — lipsync between q5 (BTM2[0]) and q6 (BTM2[1])
      ballEp(2, ['q5']), // single elim — lipsync between q4 (BTM2[0]) and q5 (BTM2[1])
      finaleEp(3),
    ];
    return { queens, episodes };
  }

  test('riggory=1 with divergent u: rigged eliminates q5; r=0 eliminates q4', () => {
    const { queens, episodes } = divergenceFixture();
    // ep1 lipsync u=0.3 → q5 (A) wins, q6 eliminated. No divergence (pBlend=pStat=0.5
    // due to tied rig scores). Then ep2 lipsync u=0.7 → divergence.
    const rng = fixedRng([0.3, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, 0, 1, rng);

    // ep1: identical (no divergence possible)
    expect(rigged.episodeResults[0].eliminated).toBe('q6');
    expect(r0.episodeResults[0].eliminated).toBe('q6');

    // ep2: divergent — rigged saves q4 (frontrunner), r0 lets pStat decide and
    // u=0.7 means B (q5) wins.
    expect(rigged.episodeResults[1].eliminated).toBe('q5');
    expect(r0.episodeResults[1].eliminated).toBe('q4');
  });

  test('riggory=1 with non-divergent u (u=0.3 < pStat=0.5): no fork; both eliminate q5', () => {
    const { queens, episodes } = divergenceFixture();
    const rng = fixedRng([0.3, 0.3, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, 0, 1, rng);

    expect(rigged.episodeResults[1].eliminated).toBe('q5');
    expect(r0.episodeResults[1].eliminated).toBe('q5');
    // No fork ever fired → both runs share the SAME episodeResults reference
    // (verifies the no-fork shortcut inside simulateOneSeasonDual).
    expect(rigged.episodeResults).toBe(r0.episodeResults);
  });

  test('riggory=0 input: pBlend=pStat for all lipsyncs → no fork ever; identity', () => {
    const { queens, episodes } = divergenceFixture();
    const rng = fixedRng([0.3, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, 0, 0, rng);
    expect(rigged.episodeResults).toBe(r0.episodeResults);
  });
});

// ── [statistical] aggregate equivalence to two separate runs ─

describe('[statistical] dual r0 aggregates match a separate runBaseline at r=0', () => {
  test('runBaselineDual.r0 ≈ runBaseline({riggory:0}) at large N', () => {
    // 5-queen season with one elim per ep so multiple lipsyncs occur.
    // skills span enough to make rig scores meaningful by mid-season.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('q1', 8, 7), mkQueen('q2', 7, 6), mkQueen('q3', 6, 5),
        mkQueen('q4', 5, 4), mkQueen('q5', 4, 3),
      ],
      episodes: [
        ballEp(1, ['q5']), ballEp(2, ['q4']), ballEp(3, ['q3']),
        finaleEp(4),
      ],
    };
    const N = 20_000;

    const dual = runBaselineDual({ season, numSimulations: N, riggory: 0.6, seed: 11 });
    const r0Single = runBaseline({ season, numSimulations: N, riggory: 0, seed: 13 });

    // Tolerance: ~3σ for a binomial proportion at p≈0.3, N=20k → σ ≈ 0.0032,
    // so 3σ ≈ 0.01. Independent seeds keep this an honest equivalence check
    // (not a shared-randomness coincidence).
    const tol = 0.015;

    // winProb across all queens
    for (const q of season.queens) {
      const dualP = dual.r0.results.winProb[q.id] ?? 0;
      const singleP = r0Single.results.winProb[q.id] ?? 0;
      expect(Math.abs(dualP - singleP)).toBeLessThan(tol);
    }

    // elimProbByEpisode at every (queen, episode)
    for (let ep = 0; ep < season.episodes.length; ep++) {
      for (const q of season.queens) {
        const dualE = dual.r0.results.elimProbByEpisode[ep]?.[q.id] ?? 0;
        const singleE = r0Single.results.elimProbByEpisode[ep]?.[q.id] ?? 0;
        expect(Math.abs(dualE - singleE)).toBeLessThan(tol);
      }
    }
  });

  test('rigged branch differs measurably from r0 branch when riggory>0', () => {
    // Sanity check: if rigged and r0 came back identical, we'd be missing the
    // divergence. With riggory=1 and a strong rig-asymmetric setup, late-season
    // BTM2 queens with bad rig scores should be eliminated more often in the
    // rigged branch than in r0.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('q1', 10, 5), mkQueen('q2', 8, 5), mkQueen('q3', 6, 5),
        mkQueen('q4', 4, 9), // weak skills but strong lipSync — r=0 would save her in lipsyncs
        mkQueen('q5', 3, 1),
      ],
      episodes: [
        ballEp(1, ['q5']), ballEp(2, ['q4']), ballEp(3, ['q3']),
        finaleEp(4),
      ],
    };
    const dual = runBaselineDual({ season, numSimulations: 5_000, riggory: 1, seed: 17 });
    // q4 has high lipSync — at r=0 she wins lipsyncs more often. At r=1 her
    // negative rig score (BTM2 incidents) pushes her out. So elim share for
    // q4 by end of season should be HIGHER in rigged than r0.
    const rigQ4 = 1 - (dual.rigged.results.reachedFinaleProb['q4'] ?? 0);
    const r0Q4 = 1 - (dual.r0.results.reachedFinaleProb['q4'] ?? 0);
    expect(rigQ4).toBeGreaterThan(r0Q4);
  });
});

// ── [post-fork] each fork independently respects sim invariants

describe('[post-fork] handlers behave correctly on each forked ctx', () => {
  test('pass episode after divergence is processed in both forks', () => {
    const queens: Queen[] = [
      mkQueen('q1', 10), mkQueen('q2', 9), mkQueen('q3', 8),
      mkQueen('q4', 7),  mkQueen('q5', 2), mkQueen('q6', 1),
    ];
    const episodes: EpisodeData[] = [
      ballEp(1, ['q6']),
      ballEp(2, ['q5']), // divergence point
      passEp(3),         // pass episode AFTER the fork
      finaleEp(4),
    ];
    const rng = fixedRng([0.3, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, 0, 1, rng);

    // Pass episode is recorded as an empty placements map in both forks.
    expect(rigged.episodeResults[2].placements.size).toBe(0);
    expect(r0.episodeResults[2].placements.size).toBe(0);
    // And the fork is real — different forks have different ep2 outcomes.
    expect(rigged.episodeResults[1].eliminated).not.toBe(r0.episodeResults[1].eliminated);
  });

  test('finale runs on both forks and assigns ranks to each fork independently', () => {
    const queens: Queen[] = [
      mkQueen('q1', 10), mkQueen('q2', 9), mkQueen('q3', 8),
      mkQueen('q4', 7),  mkQueen('q5', 2), mkQueen('q6', 1),
    ];
    const episodes: EpisodeData[] = [
      ballEp(1, ['q6']),
      ballEp(2, ['q5']),
      finaleEp(3),
    ];
    const rng = fixedRng([0.3, 0.7, 0.4, 0.6, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, 0, 1, rng);

    // Both forks must produce 4 finalists with ranks 1..4 plus the eliminated
    // queens at ranks 5..6, totaling all 6 queens with distinct 1-based ranks.
    for (const run of [rigged, r0]) {
      expect(run.finalRanks.size).toBe(6);
      const ranks = new Set(run.finalRanks.values());
      expect(ranks).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    }
    // Different forks → different eliminated queens at ep2 → different
    // surviving sets at finale → at least one rank assignment differs.
    let differs = false;
    for (const [qid, rRig] of rigged.finalRanks) {
      if (r0.finalRanks.get(qid) !== rRig) { differs = true; break; }
    }
    expect(differs).toBe(true);
  });
});
