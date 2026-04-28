/** Simulator + aggregator correctness.
 *
 *  Three categories of test, each guarding a different failure mode:
 *
 *    [simulator]   — exercises `runBaseline` / `runFromState` at noise=0 with
 *                    constructed fixtures whose outcomes are derivable by
 *                    hand. Catches simulator logic drift (wrong BTM2 pair,
 *                    missed eliminations, wrong finalRanks ordering).
 *
 *    [invariant]   — properties every run must satisfy regardless of seed.
 *                    These protect the aggregator's arithmetic: a broken
 *                    simulator can still satisfy them, but a broken aggregator
 *                    cannot.
 *
 *    [statistical] — fixed seed, N chosen so a real regression exceeds ~4σ.
 *                    Tolerance math documented inline per test.
 *
 *  Paired with `simulate.helpers.test.ts` (direct unit tests for the pieces)
 *  and `simulate.golden.test.ts` (regression snapshots for S5+S13).
 *  Snapshots regression-lock behavior; this file actively verifies it.
 */

import { describe, test, expect } from 'vitest';
import {
  gaussianRandom,
  runBaseline,
  runFromState,
} from './simulate';
import type {
  EpisodeData, PassEpisode, Placement, Queen, SeasonData,
} from './types';
import { PLACEMENTS } from './types';
import { createSeededRng } from './rng';

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

function ballEp(number: number, placements: Record<string, Placement>, eliminated: string[]): EpisodeData {
  return {
    number, archetype: 'ball', challengeName: `ep${number}`,
    placements, eliminated,
  };
}

function finaleEp(number: number): EpisodeData {
  return {
    kind: 'finale', number, finaleType: 'default',
    challengeName: 'Grand Finale', placements: {}, eliminated: [],
  };
}

function passEp(number: number): PassEpisode {
  return { kind: 'pass', number, challengeName: 'reunion' };
}

// ── [simulator] — zero-noise determinism ────────────────────
//
// When noise=0 and all challenges use the same archetype, scoreQueen returns
// each queen's weighted skill exactly — so sort order is determined by skill.
// assignPlacements is then fully deterministic for a sorted score array.
// The only non-deterministic pieces at noise=0 are:
//   - lipsync (RNG-driven via `resolveLipSync`)
//   - finale (hardcoded noise=1.5 in runFinaleDefault, unaffected by sim noise)
// These tests assert only the deterministic pieces; finale + lipsync outcomes
// are asserted statistically below.

describe('[simulator] zero-noise placements are fully deterministic', () => {
  test('n=6 single episode: placement per queen matches assignPlacements contract', () => {
    // Skills 10,8,7,5,3,1 — all distinct so ties can't re-order.
    const queens = [
      mkQueen('q1', 10), mkQueen('q2', 8), mkQueen('q3', 7),
      mkQueen('q4', 5), mkQueen('q5', 3), mkQueen('q6', 1),
    ];
    const season: SeasonData = {
      id: 't', name: 'T', queens,
      // Non-elim first ep so the lipsync RNG doesn't interfere with placement assertions.
      episodes: [
        ballEp(1, {}, []),
        finaleEp(2),
      ],
    };
    const { results } = runBaseline({ season, numSimulations: 50, noise: 0, seed: 42 });
    // Every run must produce identical ep1 placements.
    // WIN=q1, HIGH=q2, SAFE=q3, LOW=q4, BTM2=q5 and q6  (field size 6 contract)
    expect(results.episodePlacements[0].q1.WIN).toBe(1);
    expect(results.episodePlacements[0].q2.HIGH).toBe(1);
    expect(results.episodePlacements[0].q3.SAFE).toBe(1);
    expect(results.episodePlacements[0].q4.LOW).toBe(1);
    expect(results.episodePlacements[0].q5.BTM2).toBe(1);
    expect(results.episodePlacements[0].q6.BTM2).toBe(1);
  });

  test('n=2 single episode with large skill gap: top queen WINs in every run', () => {
    // At n=2 there's no BTM2 (HIGH check wins at i=1), so lipsync never fires.
    // This is the cleanest deterministic assertion the sim allows.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('dom', 10), mkQueen('weak', 1)],
      episodes: [ballEp(1, {}, []), finaleEp(2)],
    };
    const { results } = runBaseline({ season, numSimulations: 100, noise: 0, seed: 1 });
    expect(results.episodePlacements[0].dom.WIN).toBe(1);
    expect(results.episodePlacements[0].weak.HIGH).toBe(1);
  });
});

describe('[simulator] double-elim finalRanks contract', () => {
  test('both losers of a double-elim get adjacent ranks per push-order', () => {
    // 6 queens, skills 10>8>7>5>3>1. Ep1 is a pre-authored double-elim
    // pinning q5, q6 to BTM2 and both as eliminated. Ep2 finale.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('q1', 10), mkQueen('q2', 8), mkQueen('q3', 7),
        mkQueen('q4', 5), mkQueen('q5', 3), mkQueen('q6', 1),
      ],
      episodes: [
        ballEp(1, { q5: 'BTM2', q6: 'BTM2' } as Record<string, Placement>, []),
        // Ep1 authored eliminated: [] so the sim treats it as non-elim on first glance —
        // but we want to test the simulator's own double-elim handling, which fires when
        // the episode-as-authored passed to the sim has eliminated.length >= 2.
        // runFromState with fromEpisode=0 uses the sim's handler, NOT the locked
        // outcome; so let's make ep1 a direct-simulate double-elim by populating
        // `eliminated` in the episode data and then running baseline (which honors
        // the eliminated-count contract at simulate.ts:163-179).
        finaleEp(2),
      ],
    };
    // Rebuild with proper double-elim signal for the sim's handler:
    (season.episodes[0] as { eliminated: string[] }).eliminated = ['q5', 'q6'];

    const { results } = runBaseline({ season, numSimulations: 100, noise: 0, seed: 42 });

    // placementDist[q][place] is frequency across runs of q finishing in `place`.
    // With push-order (q5 pushed first per assignPlacements sort at noise=0:
    // q5 score 3 > q6 score 1, so q5 is bottom2[0]), finalRanks sets:
    //   finalRanks[q5] = 6 - 0 = 6,
    //   finalRanks[q6] = 6 - 1 = 5.
    // Both should be fully concentrated on their rank.
    expect(results.placementDist.q5[6]).toBe(1);
    expect(results.placementDist.q6[5]).toBe(1);
    // Neither eliminated queen has any chance of reaching the finale.
    expect(results.reachedFinaleProb.q5).toBe(0);
    expect(results.reachedFinaleProb.q6).toBe(0);
  });
});

describe('[simulator] finale edge cases', () => {
  test('fromEpisode > episodes.length triggers the no-finale fallback', () => {
    // Setup: 3 queens, 1 pre-finale ep eliminating q3, no finale authored.
    // Calling runFromState with fromEpisode=99 runs zero sim iterations, so
    // the finale handler never fires; the fallback at simulate.ts derives
    // final ranks from eliminationOrder alone.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('q1', 10), mkQueen('q2', 5), mkQueen('q3', 1)],
      episodes: [
        ballEp(1, { q2: 'BTM2', q3: 'BTM2' } as Record<string, Placement>, ['q3']),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 99, numSimulations: 10, noise: 0, seed: 1 });
    // q3 eliminated → gets rank N=3. Remaining q1, q2 get ranks 1, 2 in Map insertion order.
    expect(results.placementDist.q3[3]).toBe(1);
    expect(results.placementDist.q1[1]).toBe(1);
    expect(results.placementDist.q2[2]).toBe(1);
  });
});

// ── [simulator] pre-S6 winner immunity ─────────────────────
//
// The pre-S6 rule: an episode that grants immunity protects its winner from
// LOW/BTM2 in the following episode. The immune queen can still WIN/HIGH/SAFE
// based on her score; the lowest-ranked SAFE queen takes her vacated slot so
// placement-band counts are preserved.

describe('[simulator] pre-S6 immunity blocks LOW/BTM2 only', () => {
  test('BTM2 → SAFE: immune queen who would have landed in BTM2 is protected', () => {
    // n=6 at ep 2: positions 0..5 = WIN, HIGH, SAFE, LOW, BTM2, BTM2.
    // Sorted desc by skill: f, e, d, c, b, a → so absent immunity: a → BTM2.
    // With immunity (a won ep 1): a → SAFE, lowest-ranked SAFE (d at pos 2) → BTM2.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('a', 1), mkQueen('b', 3), mkQueen('c', 5),
        mkQueen('d', 7), mkQueen('e', 9), mkQueen('f', 10),
      ],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { a: 'WIN', e: 'BTM2', b: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
          grantsImmunity: true,
        },
        ballEp(2, {}, []),
        finaleEp(3),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 50, noise: 0, seed: 42 });
    expect(results.episodePlacements[1].a.SAFE, 'a (immune) is SAFE').toBe(1);
    expect(results.episodePlacements[1].a.BTM2, 'a is not BTM2').toBe(0);
    expect(results.episodePlacements[1].a.LOW, 'a is not LOW').toBe(0);
    expect(results.episodePlacements[1].d.BTM2, 'd backfilled to BTM2').toBe(1);
    expect(results.episodePlacements[1].d.SAFE, 'd is not SAFE').toBe(0);
    // Other queens unchanged.
    expect(results.episodePlacements[1].f.WIN).toBe(1);
    expect(results.episodePlacements[1].e.HIGH).toBe(1);
    expect(results.episodePlacements[1].c.LOW).toBe(1);
    expect(results.episodePlacements[1].b.BTM2).toBe(1);
  });

  test('counterfactual: without grantsImmunity, prior winner lands in BTM2', () => {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('a', 1), mkQueen('b', 3), mkQueen('c', 5),
        mkQueen('d', 7), mkQueen('e', 9), mkQueen('f', 10),
      ],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { a: 'WIN', e: 'BTM2', b: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
          // grantsImmunity intentionally omitted
        },
        ballEp(2, {}, []),
        finaleEp(3),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 50, noise: 0, seed: 42 });
    expect(results.episodePlacements[1].a.BTM2, 'a is BTM2 absent immunity').toBe(1);
    expect(results.episodePlacements[1].a.SAFE).toBe(0);
    expect(results.episodePlacements[1].d.SAFE, 'd remains SAFE absent immunity').toBe(1);
  });

  test('LOW → SAFE with backfill: 12-queen field with immune queen at LOW position', () => {
    // n=12: positions WIN, HIGH, HIGH, SAFE×5, LOW, LOW, BTM2, BTM2.
    // Skills monotonically decreasing 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.
    // Order desc: q12, q11, q10, q9, q8, q7, q6, q5, q4, q3, q2, q1.
    // q3 sits at position 9 (LOW). Make q3 the prior winner — assert immunity.
    const queens: Queen[] = [];
    for (let i = 1; i <= 12; i++) queens.push(mkQueen(`q${i}`, i));
    const season: SeasonData = {
      id: 't', name: 'T', queens,
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { q3: 'WIN', q11: 'BTM2', q10: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
          grantsImmunity: true,
        },
        ballEp(2, {}, []),
        finaleEp(3),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 50, noise: 0, seed: 1 });
    // q3 is at sorted position 9 → originally LOW. With immunity, q3→SAFE,
    // and the lowest-ranked SAFE queen (position 7 in sorted order, which is
    // q5) is demoted to LOW.
    expect(results.episodePlacements[1].q3.SAFE, 'q3 (immune at LOW) is SAFE').toBe(1);
    expect(results.episodePlacements[1].q3.LOW, 'q3 is not LOW').toBe(0);
    expect(results.episodePlacements[1].q5.LOW, 'q5 backfilled to LOW').toBe(1);
    expect(results.episodePlacements[1].q5.SAFE, 'q5 is not SAFE').toBe(0);
    // Bands preserved: BTM2 is still {q1, q2}, other LOW slot is still q4.
    expect(results.episodePlacements[1].q1.BTM2).toBe(1);
    expect(results.episodePlacements[1].q2.BTM2).toBe(1);
    expect(results.episodePlacements[1].q4.LOW).toBe(1);
  });

  test('no-op when immune queen scores into WIN/HIGH/SAFE', () => {
    // Queen A is the highest-skill — she scores WIN regardless of immunity.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('a', 10), mkQueen('b', 8), mkQueen('c', 6),
        mkQueen('d', 4), mkQueen('e', 3), mkQueen('f', 1),
      ],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { a: 'WIN', f: 'BTM2', e: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
          grantsImmunity: true,
        },
        ballEp(2, {}, []),
        finaleEp(3),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 50, noise: 0, seed: 1 });
    expect(results.episodePlacements[1].a.WIN, 'a scored top, gets WIN').toBe(1);
    expect(results.episodePlacements[1].b.HIGH).toBe(1);
    expect(results.episodePlacements[1].c.SAFE).toBe(1);
    expect(results.episodePlacements[1].d.LOW).toBe(1);
    expect(results.episodePlacements[1].e.BTM2).toBe(1);
    expect(results.episodePlacements[1].f.BTM2).toBe(1);
  });

  test('pass episode breaks the immunity chain', () => {
    // ep 1 grants immunity; ep 2 is a pass episode (no winner). ep 3 should
    // see ep 2 as prior result (empty placements) — no carry-forward.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('a', 1), mkQueen('b', 3), mkQueen('c', 5),
        mkQueen('d', 7), mkQueen('e', 9), mkQueen('f', 10),
      ],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: { a: 'WIN', e: 'BTM2', b: 'BTM2' } as Record<string, Placement>,
          eliminated: [],
          grantsImmunity: true,
        },
        passEp(2),
        ballEp(3, {}, []),
        finaleEp(4),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 50, noise: 0, seed: 1 });
    // At ep 3 (index 2), the prior result is the pass ep with no WIN.
    // a should land in BTM2 (her natural position) — no immunity carry-forward.
    expect(results.episodePlacements[2].a.BTM2, 'a not protected (pass broke chain)').toBe(1);
    expect(results.episodePlacements[2].d.SAFE, 'd remains SAFE (no backfill triggered)').toBe(1);
  });

  test('first episode of season: no prior result, no override, no crash', () => {
    // grantsImmunity on ep 1 with no ep 0 should be a clean no-op for ep 1.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('a', 1), mkQueen('b', 3), mkQueen('c', 5),
        mkQueen('d', 7), mkQueen('e', 9), mkQueen('f', 10),
      ],
      episodes: [
        {
          number: 1, archetype: 'ball', challengeName: 'ep1',
          placements: {}, eliminated: [],
          grantsImmunity: true,
        },
        finaleEp(2),
      ],
    };
    const { results } = runBaseline({ season, numSimulations: 10, noise: 0, seed: 1 });
    // ep 1 should be a normal n=6 placement: WIN=f, HIGH=e, SAFE=d, LOW=c, BTM2=b,a.
    expect(results.episodePlacements[0].f.WIN).toBe(1);
    expect(results.episodePlacements[0].a.BTM2).toBe(1);
  });

  test('mid-season lock: real-data integration — S2 ep 1 winner cannot land in BTM2/LOW in ep 2', async () => {
    // Use the canonical S2 data through the SEASON_PRESETS path.
    const { SEASON_PRESETS } = await import('../data/presets');
    const preset = SEASON_PRESETS.find((s) => s.id === 'season2');
    expect(preset, 'season2 preset present').toBeDefined();
    if (!preset) return;
    const s2 = preset.season;
    // Confirm ep 1 has grantsImmunity in the canonical data.
    const ep1 = s2.episodes[0];
    expect(ep1.kind === undefined || ep1.kind === 'regular', 'ep1 is regular').toBe(true);
    if (ep1.kind === 'pass' || ep1.kind === 'finale') return;
    expect(ep1.grantsImmunity, 'S2 ep1 grants immunity by default').toBe(true);
    const ep1WinnerId = Object.entries(ep1.placements).find(([, p]) => p === 'WIN')?.[0];
    expect(ep1WinnerId, 'S2 ep1 has an authored winner').toBeDefined();
    if (!ep1WinnerId) return;

    const { results } = runFromState({ season: s2, fromEpisode: 1, numSimulations: 1000, noise: 1.8, seed: 99 });
    // Across all 1000 sims with noise, the ep1 winner must never land in
    // BTM2 or LOW in ep 2. Statistical assertion — exact zero given immunity.
    expect(results.episodePlacements[1][ep1WinnerId].BTM2).toBe(0);
    expect(results.episodePlacements[1][ep1WinnerId].LOW).toBe(0);
  });
});

describe('[simulator] pass episode alive-set stability', () => {
  test('pass ep does not shrink the alive set for any queen', () => {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('a', 10), mkQueen('b', 5), mkQueen('c', 1)],
      episodes: [
        ballEp(1, {}, []),
        passEp(2),
        ballEp(3, {}, []),
        finaleEp(4),
      ],
    };
    const { results } = runBaseline({ season, numSimulations: 500, noise: 1.8, seed: 7 });
    // Pass ep is index 1. Alive prob at ep 2 must equal alive prob at ep 1 exactly.
    for (const q of season.queens) {
      const before = results.aliveProbByEpisode[1][q.id];
      const after = results.aliveProbByEpisode[2][q.id];
      expect(after).toBeCloseTo(before, 12);
    }
    // elimProb during pass ep should be zero for everyone.
    for (const q of season.queens) {
      expect(results.elimProbByEpisode[1][q.id]).toBe(0);
    }
  });
});

// ── [invariant] properties — every run must satisfy ─────────
//
// These protect aggregator correctness. They must hold for any seed, any
// season, any numSimulations > 0. A broken simulator can coincidentally
// satisfy these; a broken aggregator usually cannot.

describe('[invariant] aggregate structure', () => {
  function standardRun() {
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('q1', 10), mkQueen('q2', 8), mkQueen('q3', 6),
        mkQueen('q4', 4), mkQueen('q5', 2),
      ],
      episodes: [
        ballEp(1, {}, []),      // non-elim
        ballEp(2, {}, ['q5']),  // elim-placeholder; sim will decide per run
        passEp(3),
        ballEp(4, {}, ['q4']),
        finaleEp(5),
      ],
    };
    // The `eliminated` lists authored above are only signals to the sim's
    // handler that "this is an elimination episode" (length >= 1). The sim
    // picks the actual eliminee based on scores + lipsync per run.
    // For a realistic aggregate, run at the production noise.
    return runBaseline({ season, numSimulations: 1000, noise: 1.8, seed: 123 });
  }

  test('∑ winProb across all queens = 1', () => {
    const { results } = standardRun();
    const total = Object.values(results.winProb).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1, 10);
  });

  test('∑ placementDist[q] over all final places = 1 per queen; [q][0] = 0', () => {
    const { results } = standardRun();
    for (const [qid, dist] of Object.entries(results.placementDist)) {
      const total = dist.reduce((a, b) => a + b, 0);
      expect(total, `${qid} sum`).toBeCloseTo(1, 10);
      // Place index 0 is reserved (places are 1-based).
      expect(dist[0], `${qid} place 0`).toBe(0);
    }
  });

  test('aliveProbByEpisode is non-increasing per queen across episodes', () => {
    const { results } = standardRun();
    for (const q of Object.keys(results.winProb)) {
      for (let ep = 1; ep < results.aliveProbByEpisode.length; ep++) {
        const prev = results.aliveProbByEpisode[ep - 1][q];
        const cur = results.aliveProbByEpisode[ep][q];
        expect(cur, `${q} ep${ep}`).toBeLessThanOrEqual(prev + 1e-12);
      }
    }
  });

  test('reachedFinaleProb[q] === aliveProbByEpisode[finaleIdx][q]', () => {
    const { results } = standardRun();
    const finaleIdx = results.aliveProbByEpisode.length - 1;
    for (const q of Object.keys(results.winProb)) {
      expect(results.reachedFinaleProb[q]).toBeCloseTo(
        results.aliveProbByEpisode[finaleIdx][q], 12,
      );
    }
  });

  test('winProbByEpisode[ep][q] === winProb[q] / aliveProbByEpisode[ep][q] when alive > 0', () => {
    // This is the key aggregator invariant — catches any drift in how win
    // counts are bucketed per episode.
    const { results } = standardRun();
    for (let ep = 0; ep < results.winProbByEpisode.length; ep++) {
      for (const q of Object.keys(results.winProb)) {
        const alive = results.aliveProbByEpisode[ep][q];
        const winGiven = results.winProbByEpisode[ep][q];
        if (alive > 0) {
          expect(winGiven, `${q} ep${ep}`).toBeCloseTo(
            results.winProb[q] / alive, 10,
          );
        } else {
          expect(winGiven, `${q} ep${ep}`).toBe(0);
        }
      }
    }
  });

  test('locked eliminee has elimProb = 1 at the locked ep and 0 after', () => {
    // Build a season with a locked pre-elim, then run from the episode after.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('q1', 10), mkQueen('q2', 5), mkQueen('q3', 1)],
      episodes: [
        ballEp(1, { q2: 'BTM2', q3: 'BTM2' } as Record<string, Placement>, ['q3']),
        ballEp(2, {}, []),
        finaleEp(3),
      ],
    };
    const { results } = runFromState({ season, fromEpisode: 1, numSimulations: 100, seed: 1 });
    expect(results.elimProbByEpisode[0].q3).toBe(1);
    expect(results.elimProbByEpisode[1].q3).toBe(0);
    expect(results.elimProbByEpisode[2].q3).toBe(0);
    expect(results.winProb.q3).toBe(0);
  });

  test('PLACEMENTS domain does not include ELIM', () => {
    // Guardrail — chart code iterates PLACEMENTS to build distributions, and
    // if ELIM ever leaked in it would double-count eliminations.
    expect(PLACEMENTS).not.toContain('ELIM');
  });
});

// ── [statistical] — fixed seed, documented tolerances ───────

describe('[statistical] sim output matches algebraic expectations', () => {
  test('symmetric queens: ep-1 WIN probability is 1/n (4σ at N=50k)', () => {
    // 3 queens, identical stats, identical lipsync. By symmetry each has
    // P(WIN in any non-elim ep) = 1/3 exactly.
    // stderr(p=1/3) at N=50k = √(p(1-p)/N) ≈ 0.00211 → 4σ ≈ 0.0084.
    const queens = [mkQueen('a', 5), mkQueen('b', 5), mkQueen('c', 5)];
    const season: SeasonData = {
      id: 't', name: 'T', queens,
      episodes: [ballEp(1, {}, []), finaleEp(2)],
    };
    const { results } = runBaseline({
      season, numSimulations: 50_000, noise: 1.8, seed: 424242,
    });
    for (const q of queens) {
      const p = results.episodePlacements[0][q.id].WIN;
      expect(p, `${q.id} WIN prob`).toBeGreaterThan(1 / 3 - 0.0084);
      expect(p, `${q.id} WIN prob`).toBeLessThan(1 / 3 + 0.0084);
    }
  });

  test('large skill gap + small noise: dominant queen WINs near-always', () => {
    // Skills 10 vs 1, noise=3. Diff ~ N(9, 2·3²). P(diff > 0) = Φ(9/√18) ≈ 0.9828.
    // stderr(p=0.983) at N=50k ≈ √(0.017·0.983/50k) ≈ 0.000578 → 4σ ≈ 0.0023.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [mkQueen('dom', 10), mkQueen('weak', 1)],
      // n=2 non-elim so lipsync doesn't fire; measure ep-1 WIN prob only.
      episodes: [ballEp(1, {}, []), finaleEp(2)],
    };
    const { results } = runBaseline({
      season, numSimulations: 50_000, noise: 3, seed: 7,
    });
    const p = results.episodePlacements[0].dom.WIN;
    const expected = 0.9828;
    const tol = 0.0023;
    expect(p).toBeGreaterThan(expected - tol);
    expect(p).toBeLessThan(expected + tol);
  });

  test('lipsync probability is proportional to lipSync skill (4σ at N=50k)', () => {
    // 4-queen fixture: top two skill 10, bottom two skill 1 → bottom two are
    // structurally BTM2 at noise=0. Lipsync 7 vs 3 → P(q3 wins lipsync) = 0.7
    // → P(q4 eliminated ep1) = 0.7.
    // stderr(0.7) at N=50k ≈ 0.00205 → 4σ ≈ 0.0082.
    const season: SeasonData = {
      id: 't', name: 'T',
      queens: [
        mkQueen('top1', 10, 5), mkQueen('top2', 10, 5),
        mkQueen('q3', 1, 7), mkQueen('q4', 1, 3),
      ],
      episodes: [
        ballEp(1, {}, ['q4' /* placeholder; sim picks real eliminee per run */]),
        finaleEp(2),
      ],
    };
    const { results } = runBaseline({
      season, numSimulations: 50_000, noise: 0, seed: 31415,
    });
    const p = results.elimProbByEpisode[0].q4;
    const expected = 0.7;
    const tol = 0.0082;
    expect(p).toBeGreaterThan(expected - tol);
    expect(p).toBeLessThan(expected + tol);
  });

  test('gaussianRandom empirical variance matches σ² within ±5% at N=50k', () => {
    const N = 50_000;
    const sigma = 2;
    const rng = createSeededRng(987654);
    let sum = 0, sumSq = 0;
    for (let i = 0; i < N; i++) {
      const z = gaussianRandom(rng, 0, sigma);
      sum += z;
      sumSq += z * z;
    }
    const mean = sum / N;
    const variance = sumSq / N - mean * mean;
    // 5% tolerance is wide enough that variance-of-variance convergence
    // (~O(1/√N)) doesn't flake at N=50k, and tight enough to catch a real
    // σ-scaling bug (e.g. accidentally dividing by σ instead of multiplying).
    expect(variance).toBeGreaterThan(sigma * sigma * 0.95);
    expect(variance).toBeLessThan(sigma * sigma * 1.05);
    // Mean should be near zero.
    expect(Math.abs(mean)).toBeLessThan(sigma * 0.05);
  });

  test('gaussianRandom returns mean exactly when stdev=0 (σ=0 short-circuit)', () => {
    // Regression guard against the NaN trap: Box-Muller does log(u1) which is
    // -Infinity when u1=0 (mulberry32 can return exactly 0 from some seeds).
    // Multiplying by stdev=0 would produce NaN without the short-circuit.
    const rng = createSeededRng(1);
    for (let i = 0; i < 100; i++) {
      expect(gaussianRandom(rng, 5, 0)).toBe(5);
      expect(gaussianRandom(rng, 0, 0)).toBe(0);
    }
  });
});
