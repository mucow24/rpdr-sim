import type {
  Queen,
  BaseStat,
  EpisodeData,
  RegularEpisode,
  PassEpisode,
  FinaleEpisode,
  FinaleType,
  Placement,
  EpisodeOutcome,
  EpisodeResult,
  SimulationRun,
  SimulationResults,
  FilterCondition,
  TrajectoryPath,
  SeasonData,
  RunFromStateOptions,
} from './types';
import { BASE_STATS, PLACEMENT_INDEX, INDEX_PLACEMENT, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX, isFinale, isPass, isRegular } from './types';
import { ARCHETYPES } from '../data/archetypes';
import { resolveRng, type Rng } from './rng';
export type { RunFromStateOptions } from './types';

/** Internal mid-season state for simulateOneSeason. */
interface MidSeasonState {
  remainingQueenIds: Set<string>;
  priorResults: EpisodeResult[];
  startEpisodeIndex: number;
}

// Box-Muller transform for gaussian random numbers.
// Short-circuit at stdev=0: callers use noise=0 for zero-noise oracle tests,
// and Box-Muller does `log(u1)` which is -Infinity when u1=0. Seeded RNGs
// (mulberry32) can produce exactly 0, so `0 * (-Infinity)` = NaN would silently
// corrupt deterministic runs. Returning `mean` directly is the mathematical
// limit anyway.
/** @internal — exported for direct testing */
export function gaussianRandom(rng: Rng, mean = 0, stdev = 1): number {
  if (stdev === 0) return mean;
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdev + mean;
}

/** Score a queen against a challenge's weighted mixture of base stats.
 *  Weights are normalized (divided by total) so they don't need to sum to 1.
 *  If all weights are 0 the skill contribution is 0 and the queen scores only
 *  noise — a well-defined fallback, not an error. */
export function scoreQueen(
  queen: Queen,
  weights: Record<BaseStat, number>,
  noise: number,
  rng: Rng = Math.random,
): number {
  let totalWeight = 0;
  let weightedSkill = 0;
  for (const stat of BASE_STATS) {
    const w = weights[stat];
    if (w > 0) {
      weightedSkill += queen.skills[stat] * w;
      totalWeight += w;
    }
  }
  const skill = totalWeight > 0 ? weightedSkill / totalWeight : 0;
  return skill + gaussianRandom(rng, 0, noise);
}

/** @internal — exported for direct testing */
export function assignPlacements(
  scores: { queenId: string; score: number }[],
): Map<string, EpisodeOutcome> {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const n = sorted.length;
  const placements = new Map<string, EpisodeOutcome>();

  for (let i = 0; i < n; i++) {
    let placement: Placement;
    if (i === 0) {
      placement = 'WIN';
    } else if (i === 1 || (n >= 8 && i === 2)) {
      placement = 'HIGH';
    } else if (i === n - 1 || i === n - 2) {
      placement = 'BTM2';
    } else if (i === n - 3 || (n >= 8 && i === n - 4)) {
      placement = 'LOW';
    } else {
      placement = 'SAFE';
    }
    placements.set(sorted[i].queenId, placement);
  }

  return placements;
}

/** Both lipsync win probabilities for queenA from one call:
 *   - `pStat`: pure stat ratio = the r=0 (no-riggory) probability
 *   - `pBlend`: stat ⨯ rig-frontrunner blend at the active riggory
 *  The dual-timeline driver compares both per lipsync; `lipSyncWinProbA`
 *  is a thin wrapper for the single-timeline path and tests.
 *
 *  r=0 → pBlend === pStat. r=1 → pBlend picks the frontrunner outright;
 *  score ties fall back to pStat so lipSync still matters at the extreme.
 *  @internal — exported for direct testing */
export function lipSyncWinProbs(
  lipSyncA: number,
  lipSyncB: number,
  scoreA: number,
  scoreB: number,
  riggory: number,
): { pStat: number; pBlend: number } {
  const pStat = lipSyncA / (lipSyncA + lipSyncB);
  if (riggory <= 0) return { pStat, pBlend: pStat };
  const pRig = scoreA > scoreB ? 1 : scoreA < scoreB ? 0 : pStat;
  return { pStat, pBlend: (1 - riggory) * pStat + riggory * pRig };
}

/** @internal — exported for direct testing */
export function lipSyncWinProbA(
  lipSyncA: number,
  lipSyncB: number,
  scoreA: number,
  scoreB: number,
  riggory: number,
): number {
  return lipSyncWinProbs(lipSyncA, lipSyncB, scoreA, scoreB, riggory).pBlend;
}

function resolveLipSync(
  queenA: Queen,
  queenB: Queen,
  scoreA: number,
  scoreB: number,
  riggory: number,
  rng: Rng,
): string {
  const pA = lipSyncWinProbA(queenA.lipSync, queenB.lipSync, scoreA, scoreB, riggory);
  return rng() < pA ? queenA.id : queenB.id;
}

/** Per-incident WIN bonus: f(n) = n² − n + 4 for the n-th WIN (1-indexed).
 *  Sequence: 4, 6, 10, 16, 24, 34, … — quadratic so repeat winners pull away
 *  from the rest of the field. @internal */
export function winPoints(nthIncident: number): number {
  return nthIncident * nthIncident - nthIncident + 4;
}

/** Per-incident BTM2 penalty: f(n) = 2^(n+1) for the n-th BTM2 (1-indexed).
 *  Sequence: 4, 8, 16, 32, 64, … — exponential so a queen who keeps showing
 *  up in the bottom rapidly tanks her rig score. @internal */
export function btm2Penalty(nthIncident: number): number {
  return 1 << (nthIncident + 1);
}

const BAND_RIG_DELTA: Record<EpisodeOutcome, number> = {
  WIN: 0, // Handled separately via escalating winPoints.
  HIGH: 2,
  SAFE: 1,
  LOW: -2,
  BTM2: 0, // Handled separately via escalating btm2Penalty.
  ELIM: 0, // Encoded after the fact in the lip-sync handler; no rig delta here.
};

/** Update each queen's rig-score in place after a regular episode's bands
 *  have been finalized. WIN and BTM2 each escalate per-queen via their own
 *  incident counter; HIGH/SAFE/LOW apply a fixed delta. ELIM placements are
 *  post-lip-sync and don't contribute (the BTM2 penalty already fired when
 *  the band was assigned). @internal — exported for direct testing */
export function applyRigDeltas(
  placements: Map<string, EpisodeOutcome>,
  rigScores: Map<string, number>,
  winCounts: Map<string, number>,
  btm2Counts: Map<string, number>,
): void {
  for (const [qid, band] of placements) {
    if (band === 'WIN') {
      const next = (winCounts.get(qid) ?? 0) + 1;
      winCounts.set(qid, next);
      rigScores.set(qid, (rigScores.get(qid) ?? 0) + winPoints(next));
    } else if (band === 'BTM2') {
      const next = (btm2Counts.get(qid) ?? 0) + 1;
      btm2Counts.set(qid, next);
      rigScores.set(qid, (rigScores.get(qid) ?? 0) - btm2Penalty(next));
    } else if (band !== 'ELIM') {
      const delta = BAND_RIG_DELTA[band];
      if (delta !== 0) rigScores.set(qid, (rigScores.get(qid) ?? 0) + delta);
    }
  }
}

/** Pre-S6 winner immunity: if the previous regular episode granted immunity,
 *  its winner is protected from LOW/BTM2 this episode. The lowest-ranked SAFE
 *  queen takes her vacated slot, preserving placement-band counts. No-op when
 *  prev ep didn't grant, prev winner isn't in this ep's field, or current
 *  placement is SAFE/HIGH/WIN. Mutates `placements` in place.
 *  @internal — exported for direct testing */
export function applyPriorWinnerImmunity(
  placements: Map<string, EpisodeOutcome>,
  rankedScores: { queenId: string; score: number }[],
  episodes: readonly EpisodeData[],
  priorResults: EpisodeResult[],
  remaining: Map<string, Queen>,
): void {
  // Handler is called with episodeResults.length === current epIdx (push happens
  // after handler returns), so the previous episode is at length - 1.
  const epIdx = priorResults.length;
  const prevEp = episodes[epIdx - 1];
  if (!prevEp || !isRegular(prevEp) || !prevEp.grantsImmunity) return;
  const prevResult = priorResults[priorResults.length - 1];
  if (!prevResult) return;
  let prevWinnerId: string | undefined;
  for (const [qid, p] of prevResult.placements) {
    if (p === 'WIN') { prevWinnerId = qid; break; }
  }
  if (!prevWinnerId || !remaining.has(prevWinnerId)) return;
  const current = placements.get(prevWinnerId);
  if (current !== 'LOW' && current !== 'BTM2') return;

  // Find the lowest-ranked SAFE queen (largest rank index whose placement is
  // SAFE) — she gets demoted into the immune queen's vacated slot. Tiny field
  // edge case: if no SAFE queen exists, leave as-is (graceful degradation).
  // Walk the ranking sorted desc by score so the largest index is the worst.
  const sortedDesc = [...rankedScores].sort((a, b) => b.score - a.score);
  let demoteId: string | undefined;
  for (let i = sortedDesc.length - 1; i >= 0; i--) {
    const qid = sortedDesc[i].queenId;
    if (qid === prevWinnerId) continue;
    if (placements.get(qid) === 'SAFE') { demoteId = qid; break; }
  }
  if (!demoteId) return;

  placements.set(demoteId, current);
  placements.set(prevWinnerId, 'SAFE');
}

// ── Episode handler dispatch ──────────────────────────────
//
// Each episode kind owns its own handler. Adding a new kind (custom finale
// type, All Stars non-elim, immunity-aware regular) means writing one handler
// and registering it — no new branches in `simulateOneSeason`.
//
// Archetypes today are pure data (weight mixtures). Custom sim logic may
// eventually key on archetype id (e.g. a lip-sync lalaparuza). Any future
// `archetype === '...'` branch inside a handler MUST ship with a dedicated
// zero-noise oracle test in `simulate.correctness.test.ts` that exercises
// the branch end-to-end — plausible-but-wrong mechanics will not be caught
// by the existing goldens alone.

/** Mutable per-run state passed to every episode handler. */
interface SimCtx {
  queens: Queen[];
  remaining: Map<string, Queen>;
  rng: Rng;
  noise: number;
  /** 0..1 — see RunBaselineOptions.riggory. */
  riggory: number;
  /** queenId -> cumulative rig-score (running tally of band deltas). Used by
   *  the lip-sync handler to bias the coin flip toward the season's
   *  frontrunner when riggory > 0. */
  rigScores: Map<string, number>;
  /** queenId -> count of WIN incidents so far this run. Drives the escalating
   *  WIN bonus in `applyRigDeltas`. */
  winCounts: Map<string, number>;
  /** queenId -> count of BTM2 incidents so far this run. Drives the
   *  escalating BTM2 penalty in `applyRigDeltas`. */
  btm2Counts: Map<string, number>;
  /** Order in which queens were sashayed away — drives final-rank derivation. */
  eliminationOrder: string[];
  /** queenId -> 1-based rank. Winner = 1. Populated by the finale handler;
   *  also derivable from `eliminationOrder` if no finale runs. */
  finalRanks: Map<string, number>;
  /** Append-only: one entry per episode this run. */
  episodeResults: EpisodeResult[];
  /** Read-only reference to the season's episode array. Handlers use this to
   *  inspect prior-episode metadata (e.g. pre-S6 immunity) without re-deriving
   *  it from EpisodeResult. */
  episodes: readonly EpisodeData[];
}

interface EpisodeHandler<E extends EpisodeData> {
  apply(ep: E, ctx: SimCtx): void;
}

/** Shallow-clone a SimCtx for forking the dual-timeline driver at the moment
 *  a lipsync diverges between rigged and r=0 outcomes. Maps and arrays are
 *  copied; `queens`, `episodes`, and `rng` are shared (queens/episodes are
 *  immutable inputs; the rng is intentionally shared so post-fork draws come
 *  from one stream in a deterministic interleaving — driver advances r0
 *  before rig). EpisodeResult objects already in `episodeResults` are
 *  immutable after push, so sharing them across forks is safe.
 *  @internal */
function cloneSimCtx(ctx: SimCtx): SimCtx {
  return {
    queens: ctx.queens,
    remaining: new Map(ctx.remaining),
    rng: ctx.rng,
    noise: ctx.noise,
    riggory: ctx.riggory,
    rigScores: new Map(ctx.rigScores),
    winCounts: new Map(ctx.winCounts),
    btm2Counts: new Map(ctx.btm2Counts),
    eliminationOrder: [...ctx.eliminationOrder],
    finalRanks: new Map(ctx.finalRanks),
    episodeResults: [...ctx.episodeResults],
    episodes: ctx.episodes,
  };
}

/** Score every remaining queen, assign placement bands, run prior-winner
 *  immunity backfill, and accumulate rig-deltas. Returns the placements map.
 *  This is the deterministic-given-RNG portion of a regular episode — riggory
 *  has no influence here. The dual driver runs this once for the coupled
 *  pre-fork phase, then both forks run their own copies post-fork.
 *  @internal — exported for direct testing */
export function runChallengeAndBands(
  episode: RegularEpisode,
  ctx: SimCtx,
): Map<string, EpisodeOutcome> {
  const activeQueens = Array.from(ctx.remaining.values());
  const weights = episode.weights ?? ARCHETYPES[episode.archetype].weights;
  const scores = activeQueens.map((q) => ({
    queenId: q.id,
    score: scoreQueen(q, weights, ctx.noise, ctx.rng),
  }));
  const placements = assignPlacements(scores);
  applyPriorWinnerImmunity(placements, scores, ctx.episodes, ctx.episodeResults, ctx.remaining);
  applyRigDeltas(placements, ctx.rigScores, ctx.winCounts, ctx.btm2Counts);
  return placements;
}

/** Extract the bottom-2 queen ids from a placements map. Order matches map
 *  insertion order (the order assigned by `assignPlacements`).
 *  @internal — exported for direct testing */
export function extractBottom2(placements: Map<string, EpisodeOutcome>): string[] {
  const bottom2: string[] = [];
  for (const [id, p] of placements) {
    if (p === 'BTM2') bottom2.push(id);
  }
  return bottom2;
}

function recordNonElimEpisode(
  ctx: SimCtx,
  episode: RegularEpisode,
  placements: Map<string, EpisodeOutcome>,
): void {
  ctx.episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: ['', ''],
    lipSyncWinner: '',
    eliminated: '',
  });
}

function recordDefensiveEpisode(
  ctx: SimCtx,
  episode: RegularEpisode,
  placements: Map<string, EpisodeOutcome>,
  bottom2: string[],
): void {
  ctx.episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: [bottom2[0] ?? '', bottom2[1] ?? ''],
    lipSyncWinner: bottom2[0] ?? '',
    eliminated: '',
  });
}

function applyDoubleElim(
  ctx: SimCtx,
  episode: RegularEpisode,
  placements: Map<string, EpisodeOutcome>,
  bottom2: string[],
): void {
  const [a, b] = bottom2;
  placements.set(a, 'ELIM');
  placements.set(b, 'ELIM');
  ctx.remaining.delete(a);
  ctx.remaining.delete(b);
  ctx.eliminationOrder.push(a, b);
  ctx.episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: [a, b],
    lipSyncWinner: '',
    eliminated: a, // narrative convenience; both encoded as ELIM in placements
  });
}

/** Apply a lipsync result: mark loser ELIM, mutate `remaining` /
 *  `eliminationOrder`, push the EpisodeResult. The decision of *who* wins
 *  the lipsync lives upstream — this just records the outcome.
 *  @internal — exported for direct testing */
export function applyLipSyncOutcome(
  ctx: SimCtx,
  episode: RegularEpisode,
  placements: Map<string, EpisodeOutcome>,
  bottom2: string[],
  lipSyncWinner: string,
): void {
  const eliminated = lipSyncWinner === bottom2[0] ? bottom2[1] : bottom2[0];
  placements.set(eliminated, 'ELIM');
  ctx.remaining.delete(eliminated);
  ctx.eliminationOrder.push(eliminated);
  ctx.episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: [bottom2[0], bottom2[1]],
    lipSyncWinner,
    eliminated,
  });
}

const regularHandler: EpisodeHandler<RegularEpisode> = {
  apply(episode, ctx) {
    const placements = runChallengeAndBands(episode, ctx);

    if (episode.eliminated.length === 0) {
      recordNonElimEpisode(ctx, episode, placements);
      return;
    }

    const bottom2 = extractBottom2(placements);

    if (bottom2.length < 2) {
      recordDefensiveEpisode(ctx, episode, placements, bottom2);
      return;
    }

    // Honor the season's recorded eliminations count: 1 = lipsync, 2 = double
    // elim (both BTM2 go home — no lipsync). Without honoring this, a double-
    // elim episode leaves an extra queen alive at finale and throws every
    // subsequent placement off by one.
    if (episode.eliminated.length >= 2) {
      applyDoubleElim(ctx, episode, placements, bottom2);
      return;
    }

    const queenA = ctx.remaining.get(bottom2[0])!;
    const queenB = ctx.remaining.get(bottom2[1])!;
    const scoreA = ctx.rigScores.get(queenA.id) ?? 0;
    const scoreB = ctx.rigScores.get(queenB.id) ?? 0;
    const lipSyncWinner = resolveLipSync(queenA, queenB, scoreA, scoreB, ctx.riggory, ctx.rng);
    applyLipSyncOutcome(ctx, episode, placements, bottom2, lipSyncWinner);
  },
};

const passHandler: EpisodeHandler<PassEpisode> = {
  apply(episode, ctx) {
    ctx.episodeResults.push({
      episodeNumber: episode.number,
      placements: new Map(),
      lipSyncMatchup: ['', ''],
      lipSyncWinner: '',
      eliminated: '',
    });
  },
};

/** Default finale: average-skill + gaussian noise, top score wins. */
function runFinaleDefault(episode: FinaleEpisode, ctx: SimCtx): void {
  const finalists = Array.from(ctx.remaining.values());
  const finalistScores = finalists.map((q) => {
    const avgSkill =
      Object.values(q.skills).reduce((a, b) => a + b, 0) /
      Object.values(q.skills).length;
    return { queenId: q.id, score: avgSkill + gaussianRandom(ctx.rng, 0, 1.5) };
  });
  finalistScores.sort((a, b) => b.score - a.score);
  for (let i = 0; i < finalistScores.length; i++) {
    ctx.finalRanks.set(finalistScores[i].queenId, i + 1);
  }

  const winnerId = finalistScores[0]?.queenId ?? '';
  const losers = finalistScores.slice(1).map((s) => s.queenId);

  // Winner = WIN, every other finalist = ELIM. Encoding ELIM here means
  // aggregation reads finale eliminations the same way as pre-finale ones.
  const placements = new Map<string, EpisodeOutcome>();
  if (winnerId) placements.set(winnerId, 'WIN');
  for (const id of losers) placements.set(id, 'ELIM');

  ctx.episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: ['', ''],
    lipSyncWinner: '',
    eliminated: '',
  });
  // Defensive drain — finale is the last episode by convention.
  for (const id of losers) ctx.remaining.delete(id);
  if (winnerId) ctx.remaining.delete(winnerId);
}

const finaleSubHandlers: Record<FinaleType, (ep: FinaleEpisode, ctx: SimCtx) => void> = {
  default: runFinaleDefault,
};

const finaleHandler: EpisodeHandler<FinaleEpisode> = {
  apply(episode, ctx) {
    // Assign losing ranks from elimination order BEFORE finale dispatch, so
    // even custom finale handlers don't have to re-derive them.
    const totalQueens = ctx.queens.length;
    for (let i = 0; i < ctx.eliminationOrder.length; i++) {
      ctx.finalRanks.set(ctx.eliminationOrder[i], totalQueens - i);
    }
    finaleSubHandlers[episode.finaleType](episode, ctx);
  },
};

/** Pure simulation — optionally seeded from a mid-season state. */
function simulateOneSeason(
  queens: Queen[],
  episodes: EpisodeData[],
  noise: number,
  riggory: number,
  rng: Rng,
  midSeason?: MidSeasonState,
): SimulationRun {
  const queenMap = new Map(queens.map((q) => [q.id, q]));
  const remaining = midSeason
    ? new Map([...queenMap].filter(([id]) => midSeason.remainingQueenIds.has(id)))
    : new Map(queenMap);
  const episodeResults: EpisodeResult[] = midSeason ? [...midSeason.priorResults] : [];
  const eliminationOrder: string[] = [];
  if (midSeason) {
    for (const pr of midSeason.priorResults) {
      if (pr.eliminated) eliminationOrder.push(pr.eliminated);
    }
  }

  // Replay rig deltas from prior results so a mid-season-seeded run starts
  // with the same scores it would have if simulated from ep 0. Eliminated
  // queens are carried in priorResults with placement=ELIM (per
  // outcomeToEpisodeResult), so applyRigDeltas naturally skips their final
  // BTM2 — but their earlier-episode bands still feed the running tally.
  const rigScores = new Map<string, number>();
  const winCounts = new Map<string, number>();
  const btm2Counts = new Map<string, number>();
  if (midSeason) {
    for (const pr of midSeason.priorResults) {
      applyRigDeltas(pr.placements, rigScores, winCounts, btm2Counts);
    }
  }

  const ctx: SimCtx = {
    queens,
    remaining,
    rng,
    noise,
    riggory,
    rigScores,
    winCounts,
    btm2Counts,
    eliminationOrder,
    finalRanks: new Map(),
    episodeResults,
    episodes,
  };

  const startIdx = midSeason?.startEpisodeIndex ?? 0;
  for (let epIdx = startIdx; epIdx < episodes.length; epIdx++) {
    applyEpisode(episodes[epIdx], ctx);
  }

  ensureFinalRanks(ctx);
  return { episodeResults, finalRanks: ctx.finalRanks };
}

/** Dispatch one episode to its handler. Used by both single and dual drivers
 *  post-fork. @internal */
function applyEpisode(episode: EpisodeData, ctx: SimCtx): void {
  if (isFinale(episode)) finaleHandler.apply(episode, ctx);
  else if (isPass(episode)) passHandler.apply(episode, ctx);
  else regularHandler.apply(episode, ctx);
}

/** Fallback when no finale ran: derive ranks from elimination order, then
 *  assign any unranked-remaining queens the lowest non-eliminated ranks
 *  (arbitrary order — caller should have included a finale episode).
 *  No-op when finale already populated `finalRanks`. @internal */
function ensureFinalRanks(ctx: SimCtx): void {
  if (ctx.finalRanks.size > 0) return;
  const totalQueens = ctx.queens.length;
  for (let i = 0; i < ctx.eliminationOrder.length; i++) {
    ctx.finalRanks.set(ctx.eliminationOrder[i], totalQueens - i);
  }
  let nextRank = 1;
  for (const id of ctx.remaining.keys()) {
    if (!ctx.finalRanks.has(id)) ctx.finalRanks.set(id, nextRank++);
  }
}

/** Dual-timeline season simulation: produces both the rigged (riggory=N) and
 *  the r=0 counterfactual SimulationRuns from a single walk through the
 *  season. Coupled phase: only the rigged ctx exists, both runs share its
 *  trajectory because no lipsync has yet resolved differently. On the first
 *  divergent lipsync, fork: clone the ctx into ctxR0 (riggory=0), apply each
 *  outcome to its own fork, then advance both ctxs through the rest of the
 *  season independently via `applyEpisode`.
 *
 *  Invariant: at most two trajectories per call. The r0 fork runs at
 *  riggory=0, where `lipSyncWinProbs` returns `pStat === pBlend` — so the
 *  r0 fork can never itself diverge. */
/** @internal — exported for direct testing of the dual driver with custom RNG */
export function simulateOneSeasonDual(
  queens: Queen[],
  episodes: EpisodeData[],
  noise: number,
  riggory: number,
  rng: Rng,
): { rigged: SimulationRun; r0: SimulationRun } {
  const queenMap = new Map(queens.map((q) => [q.id, q]));
  const ctxRig: SimCtx = {
    queens,
    remaining: new Map(queenMap),
    rng,
    noise,
    riggory,
    rigScores: new Map(),
    winCounts: new Map(),
    btm2Counts: new Map(),
    eliminationOrder: [],
    finalRanks: new Map(),
    episodeResults: [],
    episodes,
  };
  let ctxR0: SimCtx | null = null;

  for (let epIdx = 0; epIdx < episodes.length; epIdx++) {
    const episode = episodes[epIdx];

    // Post-fork: independent advancement on both ctxs. Apply r0 first, then
    // rig, so the rng-consumption order is deterministic.
    if (ctxR0) {
      applyEpisode(episode, ctxR0);
      applyEpisode(episode, ctxRig);
      continue;
    }

    // Coupled phase. Pass / finale episodes can't fork — riggory plays no
    // role in them — so just advance ctxRig.
    if (isFinale(episode) || isPass(episode)) {
      applyEpisode(episode, ctxRig);
      continue;
    }

    // Regular episode: split into phases so we can intercept the lipsync.
    const placements = runChallengeAndBands(episode, ctxRig);

    if (episode.eliminated.length === 0) {
      recordNonElimEpisode(ctxRig, episode, placements);
      continue;
    }
    const bottom2 = extractBottom2(placements);
    if (bottom2.length < 2) {
      recordDefensiveEpisode(ctxRig, episode, placements, bottom2);
      continue;
    }
    if (episode.eliminated.length >= 2) {
      applyDoubleElim(ctxRig, episode, placements, bottom2);
      continue;
    }

    // Single-elim with lipsync — this is the only place a fork can fire.
    const queenA = ctxRig.remaining.get(bottom2[0])!;
    const queenB = ctxRig.remaining.get(bottom2[1])!;
    const scoreA = ctxRig.rigScores.get(queenA.id) ?? 0;
    const scoreB = ctxRig.rigScores.get(queenB.id) ?? 0;
    const { pStat, pBlend } = lipSyncWinProbs(
      queenA.lipSync, queenB.lipSync, scoreA, scoreB, ctxRig.riggory,
    );
    const u = rng();
    const winnerRig = u < pBlend ? queenA.id : queenB.id;
    const winnerR0 = u < pStat ? queenA.id : queenB.id;

    if (winnerRig === winnerR0) {
      // No divergence — coupled continues.
      applyLipSyncOutcome(ctxRig, episode, placements, bottom2, winnerRig);
      continue;
    }

    // Divergence: fork. Clone ctxRig BEFORE applying the rigged outcome (the
    // clone must reflect pre-lipsync state). The placements map gets cloned
    // too so each fork's ELIM marker lands on its own copy.
    ctxR0 = cloneSimCtx(ctxRig);
    ctxR0.riggory = 0;
    const placementsR0 = new Map(placements);
    applyLipSyncOutcome(ctxRig, episode, placements, bottom2, winnerRig);
    applyLipSyncOutcome(ctxR0, episode, placementsR0, bottom2, winnerR0);
  }

  ensureFinalRanks(ctxRig);
  if (!ctxR0) {
    // Never forked — both runs share the rigged trajectory. The shared
    // `episodeResults` and `finalRanks` are safe because nothing mutates
    // them after this function returns; consumers (writeRunToBuffer,
    // aggregator) only read.
    return {
      rigged: { episodeResults: ctxRig.episodeResults, finalRanks: ctxRig.finalRanks },
      r0: { episodeResults: ctxRig.episodeResults, finalRanks: ctxRig.finalRanks },
    };
  }
  ensureFinalRanks(ctxR0);
  return {
    rigged: { episodeResults: ctxRig.episodeResults, finalRanks: ctxRig.finalRanks },
    r0: { episodeResults: ctxR0.episodeResults, finalRanks: ctxR0.finalRanks },
  };
}

// ── Compact buffer layout ──────────────────────────────────
// Per run: [placements][finalPlace]
//   placements: numEpisodes × numQueens bytes (PLACEMENT_INDEX 0..5 or 255)
//   finalPlace: numQueens bytes (1-based place)
//
// Phase 1a dropped a separate `eliminated: numEpisodes` section — eliminations
// are now encoded as ELIM (5) directly in the placements bytes, removing both
// the double-elim reconstruction need (both losers get ELIM) and the
// finale-derivation need (finale losers get ELIM in their finale slot).

export function bytesPerRun(numQueens: number, numEpisodes: number): number {
  return numEpisodes * numQueens + numQueens;
}

/** Canonical "no data" SimulationResults shape — used when a filter matches
 *  zero runs, or when the worker is asked for results before any sim has run.
 *  Single source of truth so consumers can rely on the empty-state shape. */
export const EMPTY_RESULTS: SimulationResults = {
  numSimulations: 0,
  winProbByEpisode: [],
  aliveProbByEpisode: [],
  elimProbByEpisode: [],
  placementDist: {},
  reachedFinaleProb: {},
  winProb: {},
  episodePlacements: [],
};

function writeRunToBuffer(
  buf: Uint8Array,
  offset: number,
  run: SimulationRun,
  queenIds: string[],
  numQueens: number,
  numEpisodes: number,
) {
  const stride = bytesPerRun(numQueens, numEpisodes);
  const base = offset * stride;

  // Placements section: numEpisodes × numQueens
  for (let ep = 0; ep < numEpisodes; ep++) {
    const epResult = run.episodeResults[ep];
    for (let qi = 0; qi < numQueens; qi++) {
      const qid = queenIds[qi];
      if (epResult) {
        const p = epResult.placements.get(qid);
        buf[base + ep * numQueens + qi] = p !== undefined ? PLACEMENT_INDEX[p] : 255;
      } else {
        buf[base + ep * numQueens + qi] = 255;
      }
    }
  }

  // Final placements section: numQueens
  const fpBase = base + numEpisodes * numQueens;
  for (let qi = 0; qi < numQueens; qi++) {
    const place = run.finalRanks.get(queenIds[qi]);
    buf[fpBase + qi] = place ?? 255;
  }
}

export interface RunBaselineOptions {
  season: SeasonData;
  numSimulations?: number;
  noise?: number;
  /** 0..1. Bias the lip-sync coin flip toward the queen with the higher
   *  cumulative rig-score. 0 = pure lipSync stat (default). 1 = always
   *  picks the frontrunner; ties fall back to the lipSync stat. */
  riggory?: number;
  /** Optional deterministic seed. When provided, the run is reproducible byte-for-byte. */
  seed?: number;
}

export interface BaselineResult {
  results: SimulationResults;
  buffer: Uint8Array;
  numQueens: number;
  numEpisodes: number;
  queenIds: string[];
}

/** Lock the first `fromEpisode` episodes to their authored outcomes and
 *  derive the alive-set from those locked eliminations. Pass episodes
 *  contribute no eliminations.
 *  @internal — exported for direct testing */
export function buildMidSeason(season: SeasonData, fromEpisode: number): MidSeasonState {
  const { queens, episodes } = season;
  const queenIds = queens.map((q) => q.id);
  const priorResults: EpisodeResult[] = [];
  const allEliminated = new Set<string>();
  for (let i = 0; i < fromEpisode && i < episodes.length; i++) {
    const ep = episodes[i];
    priorResults.push(outcomeToEpisodeResult(ep));
    if (!isPass(ep)) {
      for (const id of ep.eliminated) allEliminated.add(id);
    }
  }
  return {
    remainingQueenIds: new Set(queenIds.filter((id) => !allEliminated.has(id))),
    priorResults,
    startEpisodeIndex: fromEpisode,
  };
}

/** Allocate the compact buffer and run `numSimulations` of the engine into it.
 *  Shared by every public entry point — they vary only in (a) whether a
 *  mid-season lock is supplied and (b) whether the buffer is returned raw or
 *  aggregated. */
function runToBuffer(
  season: SeasonData,
  numSimulations: number,
  noise: number,
  riggory: number,
  rng: Rng,
  midSeason: MidSeasonState | undefined,
  onProgress: ((pct: number) => void) | undefined,
): Uint8Array {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, riggory, rng, midSeason);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }
  return buffer;
}

function wrapAsBaselineResult(buffer: Uint8Array, season: SeasonData, numSimulations: number): BaselineResult {
  const results = aggregateFromBuffer(buffer, numSimulations, season);
  return {
    results,
    buffer,
    numQueens: season.queens.length,
    numEpisodes: season.episodes.length,
    queenIds: season.queens.map((q) => q.id),
  };
}

export function runBaseline(
  { season, numSimulations = 100_000, noise = 1.8, riggory = 0, seed }: RunBaselineOptions,
  onProgress?: (pct: number) => void,
): BaselineResult {
  const buffer = runToBuffer(season, numSimulations, noise, riggory, resolveRng(seed), undefined, onProgress);
  return wrapAsBaselineResult(buffer, season, numSimulations);
}

export interface BaselineDualResult {
  rigged: BaselineResult;
  r0: BaselineResult;
}

/** Run baseline simulations and emit both the rigged result and the
 *  riggory=0 counterfactual from a single MC pass. Per-run dual-tracking
 *  costs work only when a lipsync resolves to different winners under r=N
 *  vs r=0; in practice that's rare and late in the season, so total cost
 *  stays close to a single `runBaseline` call.
 *
 *  When `riggory === 0`, no fork can ever fire, so this delegates to
 *  `runBaseline` and aliases the result as both branches. Aggregate
 *  statistics agree with two separate `runBaseline` calls in expectation —
 *  not byte-identical, since the dual driver consumes RNG differently. */
export function runBaselineDual(
  { season, numSimulations = 100_000, noise = 1.8, riggory = 0, seed }: RunBaselineOptions,
  onProgress?: (pct: number) => void,
): BaselineDualResult {
  if (riggory <= 0) {
    const result = runBaseline({ season, numSimulations, noise, riggory: 0, seed }, onProgress);
    return { rigged: result, r0: result };
  }

  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);

  const bufRig = new Uint8Array(numSimulations * stride);
  const bufR0 = new Uint8Array(numSimulations * stride);
  const rng = resolveRng(seed);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const { rigged, r0 } = simulateOneSeasonDual(queens, episodes, noise, riggory, rng);
    writeRunToBuffer(bufRig, i, rigged, queenIds, numQueens, numEpisodes);
    writeRunToBuffer(bufR0, i, r0, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }

  return {
    rigged: wrapAsBaselineResult(bufRig, season, numSimulations),
    r0: wrapAsBaselineResult(bufR0, season, numSimulations),
  };
}

/** Run baseline simulations and return only the compact buffer (no aggregation). */
export function runBaselinePartial(
  { season, numSimulations = 100_000, noise = 1.8, riggory = 0, seed }: RunBaselineOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const buffer = runToBuffer(season, numSimulations, noise, riggory, resolveRng(seed), undefined, onProgress);
  return { buffer };
}

/** Run from mid-season state and return only the compact buffer (no aggregation). */
export function runFromStatePartial(
  { season, fromEpisode, numSimulations = 100_000, noise = 1.8, riggory = 0, seed }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const midSeason = buildMidSeason(season, fromEpisode);
  const buffer = runToBuffer(season, numSimulations, noise, riggory, resolveRng(seed), midSeason, onProgress);
  return { buffer };
}

/** Aggregate SimulationResults directly from a compact buffer.
 *
 *  When `matchingIndices` is supplied, only those run rows are aggregated and
 *  `numSimulations` reflects the matched count — the same code path serves
 *  both unfiltered baselines and what-if filters. */
export function aggregateFromBuffer(
  buffer: Uint8Array,
  totalRuns: number,
  season: SeasonData,
  matchingIndices?: number[],
): SimulationResults {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const n = matchingIndices ? matchingIndices.length : totalRuns;

  // Pre-allocate per-episode count arrays
  const aliveCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  const winCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  const elimCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  // 5 placement types per queen per episode
  const placeCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens * 5));

  // Final placement counts
  const placementDistCounts = Array.from({ length: numQueens }, () => new Int32Array(numQueens + 1));
  const winCounts = new Int32Array(numQueens);

  // Precompute per-episode metadata once per aggregation (not per run).
  //   - passEpFlags: pass episodes contribute no placement bytes, so the
  //     per-run buffer has 255 for every queen. Reading those 255s as
  //     "not alive" would make aliveProbByEpisode dip to 0 at every pass
  //     ep — wrong. Instead we walk back to the nearest non-pass ep and
  //     carry forward the queen's alive state (alive ⇔ prior byte ∈ [0..4]).
  //   - prevNonPassEp[ep]: index of the most recent non-pass episode
  //     before `ep`, or -1 if none exists (the run started mid-pass).
  const passEpFlags = new Uint8Array(numEpisodes);
  const prevNonPassEp = new Int32Array(numEpisodes);
  {
    let lastNonPass = -1;
    for (let ep = 0; ep < numEpisodes; ep++) {
      const isPassEp = episodes[ep].kind === 'pass';
      passEpFlags[ep] = isPassEp ? 1 : 0;
      prevNonPassEp[ep] = lastNonPass;
      if (!isPassEp) lastNonPass = ep;
    }
  }

  // Single pass over selected runs (or all runs if no mask) — run-first for
  // cache locality. ELIM is encoded directly in the placement byte (5), so
  // there's no separate elim section to read, no double-elim reconstruction,
  // and no finale-derivation: a queen is "alive at start of ep N" iff her
  // placement byte is not 255, and she's "eliminated this ep" iff it's ELIM.
  const runCount = matchingIndices ? matchingIndices.length : totalRuns;
  for (let r = 0; r < runCount; r++) {
    const runIdx = matchingIndices ? matchingIndices[r] : r;
    const base = runIdx * stride;
    const fpBase = base + numEpisodes * numQueens;

    for (let ep = 0; ep < numEpisodes; ep++) {
      const epBase = base + ep * numQueens;

      if (passEpFlags[ep]) {
        // Carry alive state from the previous non-pass ep. A queen is alive
        // at the start of this pass ep iff at the prior non-pass ep her byte
        // was a non-ELIM placement (0..4). ELIM means she was eliminated
        // there, so she's not alive going into this pass ep.
        const priorEp = prevNonPassEp[ep];
        if (priorEp < 0) {
          // Pass episode with no prior non-pass ep — everyone starts alive.
          for (let qi = 0; qi < numQueens; qi++) {
            aliveCountsPerEp[ep][qi]++;
            if (buffer[fpBase + qi] === 1) winCountsPerEp[ep][qi]++;
          }
        } else {
          const priorBase = base + priorEp * numQueens;
          for (let qi = 0; qi < numQueens; qi++) {
            const priorPIdx = buffer[priorBase + qi];
            if (priorPIdx === 255 || priorPIdx === ELIM_PLACEMENT) continue;
            aliveCountsPerEp[ep][qi]++;
            if (buffer[fpBase + qi] === 1) winCountsPerEp[ep][qi]++;
          }
        }
        continue;
      }

      for (let qi = 0; qi < numQueens; qi++) {
        const pIdx = buffer[epBase + qi];
        if (pIdx === 255) continue;
        aliveCountsPerEp[ep][qi]++;
        if (buffer[fpBase + qi] === 1) winCountsPerEp[ep][qi]++;
        if (pIdx === ELIM_PLACEMENT) {
          elimCountsPerEp[ep][qi]++;
        } else if (pIdx <= 4) {
          placeCountsPerEp[ep][qi * 5 + pIdx]++;
        }
      }
    }

    // Final placements
    for (let qi = 0; qi < numQueens; qi++) {
      const place = buffer[fpBase + qi];
      if (place !== 255 && place <= numQueens) placementDistCounts[qi][place]++;
      if (place === 1) winCounts[qi]++;
    }
  }

  // reachedFinaleProb is alive-at-finale-episode probability.
  // Finale is the last episode by season-data convention.
  const finaleEpIdx = numEpisodes - 1;

  // Convert counts to probabilities
  const winProbByEpisode: Record<string, number>[] = [];
  const aliveProbByEpisode: Record<string, number>[] = [];
  const elimProbByEpisode: Record<string, number>[] = [];
  const episodePlacements: Record<string, Record<string, number>>[] = [];

  for (let ep = 0; ep < numEpisodes; ep++) {
    const winProb: Record<string, number> = {};
    const aliveProb: Record<string, number> = {};
    const elimProb: Record<string, number> = {};
    const epPlace: Record<string, Record<string, number>> = {};

    for (let qi = 0; qi < numQueens; qi++) {
      const id = queenIds[qi];
      winProb[id] = aliveCountsPerEp[ep][qi] > 0 ? winCountsPerEp[ep][qi] / aliveCountsPerEp[ep][qi] : 0;
      aliveProb[id] = aliveCountsPerEp[ep][qi] / n;
      elimProb[id] = elimCountsPerEp[ep][qi] / n;

      // Normalize per-episode placement distribution by alive count — this is
      // P(placement=p | alive at ep). For non-finale episodes every alive queen
      // has a placement, so this equals count/total. For finale episodes only
      // the winner's placement is recorded, so count/alive is the correct denominator.
      const aliveCount = aliveCountsPerEp[ep][qi];
      epPlace[id] = {};
      for (let pi = 0; pi < 5; pi++) {
        epPlace[id][INDEX_PLACEMENT[pi]] = aliveCount > 0 ? placeCountsPerEp[ep][qi * 5 + pi] / aliveCount : 0;
      }
    }

    winProbByEpisode.push(winProb);
    aliveProbByEpisode.push(aliveProb);
    elimProbByEpisode.push(elimProb);
    episodePlacements.push(epPlace);
  }

  const placementDist: Record<string, number[]> = {};
  const reachedFinaleProb: Record<string, number> = {};
  const winProb: Record<string, number> = {};

  for (let qi = 0; qi < numQueens; qi++) {
    const id = queenIds[qi];
    placementDist[id] = Array.from(placementDistCounts[qi]).map((c) => c / n);
    reachedFinaleProb[id] = numEpisodes > 0 ? aliveCountsPerEp[finaleEpIdx][qi] / n : 0;
    winProb[id] = winCounts[qi] / n;
  }

  return {
    numSimulations: n,
    winProbByEpisode,
    aliveProbByEpisode,
    elimProbByEpisode,
    placementDist,
    reachedFinaleProb,
    winProb,
    episodePlacements,
  };
}

/** Get indices of runs matching all conditions.
 *  After Phase 1a every condition (placement 0..4 or ELIM=5) is just an exact
 *  equality check on the placement byte at (episode, queen). BTM2 pins
 *  naturally exclude eliminated queens (their byte is ELIM, not BTM2), and
 *  ELIM pins naturally cover both losers in a double-elim. */
export function getMatchingIndices(
  buffer: Uint8Array,
  totalRuns: number,
  conditions: FilterCondition[],
  numQueens: number,
  numEpisodes: number,
): number[] {
  const stride = bytesPerRun(numQueens, numEpisodes);
  const matchingIndices: number[] = [];
  for (let r = 0; r < totalRuns; r++) {
    const base = r * stride;
    const fpBase = base + numEpisodes * numQueens;
    let matches = true;
    for (const cond of conditions) {
      const isExclude = cond.mode === 'exclude';
      if (cond.episodeIndex === OUTCOME_EPISODE_INDEX) {
        // Outcome condition: WIN (placement 0) means finalPlace === 1.
        // ELIM in outcome = didn't win.
        const finalPlace = buffer[fpBase + cond.queenIndex];
        const condMatches = cond.placement === 0 ? finalPlace === 1 : finalPlace !== 1;
        if (condMatches === isExclude) { matches = false; break; }
      } else {
        const val = buffer[base + cond.episodeIndex * numQueens + cond.queenIndex];
        const condMatches = val === cond.placement;
        if (condMatches === isExclude) { matches = false; break; }
      }
    }
    if (matches) matchingIndices.push(r);
  }
  return matchingIndices;
}

/** Filter the compact buffer and re-aggregate via the masked aggregate path —
 *  no SimulationRun reconstruction, no parallel slow aggregator. */
export function filterAndAggregate(
  buffer: Uint8Array,
  totalRuns: number,
  conditions: FilterCondition[],
  season: SeasonData,
): { results: SimulationResults; matchCount: number } {
  const matchingIndices = getMatchingIndices(
    buffer,
    totalRuns,
    conditions,
    season.queens.length,
    season.episodes.length,
  );
  const results = aggregateFromBuffer(buffer, totalRuns, season, matchingIndices);
  return { results, matchCount: matchingIndices.length };
}

/** Extract unique placement trajectories for a specific queen. */
export function extractTrajectories(
  buffer: Uint8Array,
  totalRuns: number,
  season: SeasonData,
  queenId: string,
  conditions: FilterCondition[],
): { paths: TrajectoryPath[]; scannedRuns: number } {
  const numQueens = season.queens.length;
  const numEpisodes = season.episodes.length;
  const queenIndex = season.queens.findIndex((q) => q.id === queenId);
  if (queenIndex < 0) return { paths: [], scannedRuns: 0 };
  const stride = bytesPerRun(numQueens, numEpisodes);
  const runIndices = conditions.length > 0
    ? getMatchingIndices(buffer, totalRuns, conditions, numQueens, numEpisodes)
    : null; // null = scan all runs

  const pathCounts = new Map<string, number>();
  const scannedRuns = runIndices ? runIndices.length : totalRuns;

  const scanRun = (r: number) => {
    const base = r * stride;
    const parts: number[] = [];
    for (let ep = 0; ep < numEpisodes; ep++) {
      const val = buffer[base + ep * numQueens + queenIndex];
      if (val === 255) break;
      parts.push(val);
    }
    if (parts.length === 0) return;
    const key = parts.join(',');
    pathCounts.set(key, (pathCounts.get(key) ?? 0) + 1);
  };

  if (runIndices) {
    for (const r of runIndices) scanRun(r);
  } else {
    for (let r = 0; r < totalRuns; r++) scanRun(r);
  }

  const paths = Array.from(pathCounts.entries())
    .map(([key, count]) => ({
      placements: key.split(',').map(Number),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { paths, scannedRuns };
}

// ── Domain model → simulation internal conversion ──────────

/** Convert an EpisodeData (domain model) to an EpisodeResult (simulation internal). */
export function outcomeToEpisodeResult(ep: EpisodeData): EpisodeResult {
  if (isPass(ep)) {
    return {
      episodeNumber: ep.number,
      placements: new Map(),
      lipSyncMatchup: ['', ''],
      lipSyncWinner: '',
      eliminated: '',
    };
  }
  const placementMap = new Map<string, EpisodeOutcome>(
    Object.entries(ep.placements) as [string, Placement][],
  );
  // Mirror the regular handler's encoding: a queen who was eliminated this
  // episode is recorded as ELIM, overriding her authored BTM2 placement.
  // Without this override, a mid-season lock re-hydrates the eliminee as
  // BTM2 forever — aggregation sees elimProbByEpisode[lockedEp][q] = 0,
  // and episodePlacements[lockedEp][q][BTM2] = 1, both of which diverge
  // from freshly-simulated behavior.
  for (const eid of ep.eliminated) {
    placementMap.set(eid, 'ELIM');
  }

  const btm2 = Object.entries(ep.placements)
    .filter(([, p]) => p === 'BTM2')
    .map(([id]) => id);

  return {
    episodeNumber: ep.number,
    placements: placementMap,
    lipSyncMatchup: [btm2[0] ?? '', btm2[1] ?? ''],
    lipSyncWinner: btm2.find((id) => !ep.eliminated.includes(id)) ?? '',
    eliminated: ep.eliminated[0] ?? '',
  };
}

// ── Forward simulation from season state ──────────────────

export function runFromState(
  { season, fromEpisode, numSimulations = 100_000, noise = 1.8, riggory = 0, seed }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): BaselineResult {
  const midSeason = buildMidSeason(season, fromEpisode);
  const buffer = runToBuffer(season, numSimulations, noise, riggory, resolveRng(seed), midSeason, onProgress);
  return wrapAsBaselineResult(buffer, season, numSimulations);
}
