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
import { BASE_STATS, PLACEMENT_INDEX, INDEX_PLACEMENT, PLACEMENTS, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX, isFinale, isPass } from './types';
import { ARCHETYPES } from '../data/archetypes';
import { resolveRng, type Rng } from './rng';
export type { RunFromStateOptions } from './types';

/** Internal mid-season state for simulateOneSeason. */
interface MidSeasonState {
  remainingQueenIds: Set<string>;
  priorResults: EpisodeResult[];
  startEpisodeIndex: number;
}

// Box-Muller transform for gaussian random numbers
function gaussianRandom(rng: Rng, mean = 0, stdev = 1): number {
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

function assignPlacements(
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

function resolveLipSync(queenA: Queen, queenB: Queen, rng: Rng): string {
  const pA = queenA.lipSync / (queenA.lipSync + queenB.lipSync);
  return rng() < pA ? queenA.id : queenB.id;
}

// ── Episode handler dispatch ──────────────────────────────
//
// Each episode kind owns its own handler. Adding a new kind (custom finale
// type, All Stars non-elim, immunity-aware regular) means writing one handler
// and registering it — no new branches in `simulateOneSeason`.

/** Mutable per-run state passed to every episode handler. */
interface SimCtx {
  queens: Queen[];
  remaining: Map<string, Queen>;
  rng: Rng;
  noise: number;
  /** Order in which queens were sashayed away — drives final-rank derivation. */
  eliminationOrder: string[];
  /** queenId -> 1-based rank. Winner = 1. Populated by the finale handler;
   *  also derivable from `eliminationOrder` if no finale runs. */
  finalRanks: Map<string, number>;
  /** Append-only: one entry per episode this run. */
  episodeResults: EpisodeResult[];
}

interface EpisodeHandler<E extends EpisodeData> {
  apply(ep: E, ctx: SimCtx): void;
}

const regularHandler: EpisodeHandler<RegularEpisode> = {
  apply(episode, ctx) {
    const activeQueens = Array.from(ctx.remaining.values());
    const weights = episode.weights ?? ARCHETYPES[episode.archetype].weights;
    const scores = activeQueens.map((q) => ({
      queenId: q.id,
      score: scoreQueen(q, weights, ctx.noise, ctx.rng),
    }));
    const placements = assignPlacements(scores);

    // Non-elim episode: record placements, no lip sync, no removals.
    if (episode.eliminated.length === 0) {
      ctx.episodeResults.push({
        episodeNumber: episode.number,
        placements,
        lipSyncMatchup: ['', ''],
        lipSyncWinner: '',
        eliminated: '',
      });
      return;
    }

    const bottom2 = Array.from(placements.entries())
      .filter(([, p]) => p === 'BTM2')
      .map(([id]) => id);

    // Defensive: if fewer than 2 BTM2 queens (tiny field), no lipsync.
    if (bottom2.length < 2) {
      ctx.episodeResults.push({
        episodeNumber: episode.number,
        placements,
        lipSyncMatchup: [bottom2[0] ?? '', bottom2[1] ?? ''],
        lipSyncWinner: bottom2[0] ?? '',
        eliminated: '',
      });
      return;
    }

    // Honor the season's recorded eliminations count: 1 = lipsync, 2 = double
    // elim (both BTM2 go home — no lipsync). Without honoring this, a double-
    // elim episode leaves an extra queen alive at finale and throws every
    // subsequent placement off by one.
    if (episode.eliminated.length >= 2) {
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
      return;
    }

    const queenA = ctx.remaining.get(bottom2[0])!;
    const queenB = ctx.remaining.get(bottom2[1])!;
    const lipSyncWinner = resolveLipSync(queenA, queenB, ctx.rng);
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

  const ctx: SimCtx = {
    queens,
    remaining,
    rng,
    noise,
    eliminationOrder,
    finalRanks: new Map(),
    episodeResults,
  };

  const startIdx = midSeason?.startEpisodeIndex ?? 0;
  for (let epIdx = startIdx; epIdx < episodes.length; epIdx++) {
    const episode = episodes[epIdx];
    if (isFinale(episode)) finaleHandler.apply(episode, ctx);
    else if (isPass(episode)) passHandler.apply(episode, ctx);
    else regularHandler.apply(episode, ctx);
  }

  // Fallback when no finale ran: derive ranks purely from elimination order,
  // then assign any unranked-remaining queens the lowest non-eliminated
  // ranks (arbitrary order — caller should have included a finale episode).
  if (ctx.finalRanks.size === 0) {
    const totalQueens = queens.length;
    for (let i = 0; i < eliminationOrder.length; i++) {
      ctx.finalRanks.set(eliminationOrder[i], totalQueens - i);
    }
    let nextRank = 1;
    for (const id of remaining.keys()) {
      if (!ctx.finalRanks.has(id)) ctx.finalRanks.set(id, nextRank++);
    }
  }

  return { episodeResults, finalRanks: ctx.finalRanks };
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

export function runBaseline({
  season,
  numSimulations = 100_000,
  noise = 1.8,
  seed,
}: RunBaselineOptions, onProgress?: (pct: number) => void): BaselineResult {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);
  const rng = resolveRng(seed);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  const runs: SimulationRun[] = [];
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, rng);
    runs.push(run);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }

  const results = aggregateResults(runs, queens, episodes);
  return { results, buffer, numQueens, numEpisodes, queenIds };
}

/** Run baseline simulations and return only the compact buffer (no aggregation). */
export function runBaselinePartial(
  { season, numSimulations = 100_000, noise = 1.8, seed }: RunBaselineOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);
  const rng = resolveRng(seed);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, rng);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }
  return { buffer };
}

/** Run from mid-season state and return only the compact buffer (no aggregation). */
export function runFromStatePartial(
  { season, fromEpisode, numSimulations = 100_000, noise = 1.8, seed }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);
  const rng = resolveRng(seed);

  const priorResults: EpisodeResult[] = [];
  const allEliminated = new Set<string>();
  for (let i = 0; i < fromEpisode && i < numEpisodes; i++) {
    const ep = episodes[i];
    priorResults.push(outcomeToEpisodeResult(ep));
    if (!isPass(ep)) {
      for (const id of ep.eliminated) allEliminated.add(id);
    }
  }

  const midSeason: MidSeasonState = {
    remainingQueenIds: new Set(queenIds.filter((id) => !allEliminated.has(id))),
    priorResults,
    startEpisodeIndex: fromEpisode,
  };

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, rng, midSeason);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }
  return { buffer };
}

/** Aggregate SimulationResults directly from a compact buffer. */
export function aggregateFromBuffer(
  buffer: Uint8Array,
  totalRuns: number,
  queens: Queen[],
  episodes: EpisodeData[],
): SimulationResults {
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const n = totalRuns;

  // Pre-allocate per-episode count arrays
  const aliveCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  const winCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  const elimCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens));
  // 5 placement types per queen per episode
  const placeCountsPerEp = Array.from({ length: numEpisodes }, () => new Int32Array(numQueens * 5));

  // Final placement counts
  const placementDistCounts = Array.from({ length: numQueens }, () => new Int32Array(numQueens + 1));
  const winCounts = new Int32Array(numQueens);

  // Single pass over all runs — run-first for cache locality.
  // ELIM is now encoded directly in the placement byte (5), so there's no
  // separate elim section to read, no double-elim reconstruction, and no
  // finale-derivation: a queen is "alive at start of ep N" iff her placement
  // byte at ep N is not 255, and she's "eliminated this ep" iff her byte is ELIM.
  for (let r = 0; r < totalRuns; r++) {
    const base = r * stride;
    const fpBase = base + numEpisodes * numQueens;

    for (let ep = 0; ep < numEpisodes; ep++) {
      const epBase = base + ep * numQueens;
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
      if (cond.episodeIndex === OUTCOME_EPISODE_INDEX) {
        // Outcome condition: WIN (placement 0) means finalPlace === 1.
        // ELIM in outcome = didn't win.
        const finalPlace = buffer[fpBase + cond.queenIndex];
        if (cond.placement === 0) {
          if (finalPlace !== 1) { matches = false; break; }
        } else {
          if (finalPlace === 1) { matches = false; break; }
        }
      } else {
        const val = buffer[base + cond.episodeIndex * numQueens + cond.queenIndex];
        if (val !== cond.placement) {
          matches = false;
          break;
        }
      }
    }
    if (matches) matchingIndices.push(r);
  }
  return matchingIndices;
}

/** Filter the compact buffer and re-aggregate. */
export function filterAndAggregate(
  buffer: Uint8Array,
  totalRuns: number,
  conditions: FilterCondition[],
  queens: Queen[],
  episodes: EpisodeData[],
): { results: SimulationResults; matchCount: number } {
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);

  const matchingIndices = getMatchingIndices(buffer, totalRuns, conditions, numQueens, numEpisodes);

  if (matchingIndices.length === 0) {
    // Return empty results
    const empty: SimulationResults = {
      numSimulations: 0,
      winProbByEpisode: [],
      aliveProbByEpisode: [],
      elimProbByEpisode: [],
      placementDist: {},
      reachedFinaleProb: {},
      winProb: {},
      episodePlacements: [],
    };
    return { results: empty, matchCount: 0 };
  }

  // Reconstruct SimulationRuns from matching buffer rows. ELIM is now in the
  // placement byte directly, so the `eliminated` narrative field is recovered
  // by finding the (first) queen with ELIM in this episode — for double-elim
  // both queens have ELIM, both surface as BTM2 in the lip-sync matchup, and
  // `eliminated` is the first one encountered.
  const runs: SimulationRun[] = [];
  for (const r of matchingIndices) {
    const base = r * stride;
    const fpBase = base + numEpisodes * numQueens;

    const episodeResults: EpisodeResult[] = [];
    for (let ep = 0; ep < numEpisodes; ep++) {
      const placements = new Map<string, EpisodeOutcome>();
      const btm2: string[] = [];
      let eliminated = '';
      for (let qi = 0; qi < numQueens; qi++) {
        const pIdx = buffer[base + ep * numQueens + qi];
        if (pIdx === 255) continue;
        const p = INDEX_PLACEMENT[pIdx];
        placements.set(queenIds[qi], p);
        if (p === 'BTM2') btm2.push(queenIds[qi]);
        else if (p === 'ELIM') {
          btm2.push(queenIds[qi]); // a queen who became ELIM was BTM2 first
          if (!eliminated) eliminated = queenIds[qi];
        }
      }
      episodeResults.push({
        episodeNumber: ep + 1,
        placements,
        lipSyncMatchup: [btm2[0] ?? '', btm2[1] ?? ''],
        lipSyncWinner: eliminated
          ? (btm2.find((id) => id !== eliminated) ?? '')
          : (btm2[0] ?? ''),
        eliminated,
      });
    }

    const finalRanks = new Map<string, number>();
    for (let qi = 0; qi < numQueens; qi++) {
      const place = buffer[fpBase + qi];
      if (place !== 255) finalRanks.set(queenIds[qi], place);
    }

    runs.push({ episodeResults, finalRanks });
  }

  const results = aggregateResults(runs, queens, episodes);
  return { results, matchCount: matchingIndices.length };
}

function aggregateResults(
  runs: SimulationRun[],
  queens: Queen[],
  episodes: EpisodeData[],
): SimulationResults {
  const n = runs.length;
  const queenIds = queens.map((q) => q.id);
  const numEpisodes = episodes.length;

  const winProbByEpisode: Record<string, number>[] = [];
  const aliveProbByEpisode: Record<string, number>[] = [];
  const elimProbByEpisode: Record<string, number>[] = [];
  const episodePlacements: Record<string, Record<string, number>>[] = [];

  for (let ep = 0; ep < numEpisodes; ep++) {
    const aliveCounts: Record<string, number> = {};
    const winCounts: Record<string, number> = {};
    const elimCounts: Record<string, number> = {};
    const placeCounts: Record<string, Record<string, number>> = {};

    for (const id of queenIds) {
      aliveCounts[id] = 0;
      winCounts[id] = 0;
      elimCounts[id] = 0;
      placeCounts[id] = { WIN: 0, HIGH: 0, SAFE: 0, LOW: 0, BTM2: 0 };
    }

    for (const run of runs) {
      // Eliminations are encoded uniformly as ELIM in the placements map
      // (single, double, finale all collapse to the same shape) — no special
      // cases needed.
      const eliminatedBefore = new Set<string>();
      for (let e = 0; e < ep && e < run.episodeResults.length; e++) {
        for (const [qid, p] of run.episodeResults[e].placements) {
          if (p === 'ELIM') eliminatedBefore.add(qid);
        }
      }

      for (const id of queenIds) {
        if (!eliminatedBefore.has(id)) {
          aliveCounts[id]++;
          const place = run.finalRanks.get(id);
          if (place === 1) winCounts[id]++;
        }
      }

      if (ep < run.episodeResults.length) {
        for (const [qid, p] of run.episodeResults[ep].placements) {
          if (p === 'ELIM') {
            elimCounts[qid] = (elimCounts[qid] ?? 0) + 1;
          } else if (placeCounts[qid]) {
            placeCounts[qid][p]++;
          }
        }
      }
    }

    const winProb: Record<string, number> = {};
    const aliveProb: Record<string, number> = {};
    const elimProb: Record<string, number> = {};
    const epPlace: Record<string, Record<string, number>> = {};

    for (const id of queenIds) {
      winProb[id] = aliveCounts[id] > 0 ? winCounts[id] / aliveCounts[id] : 0;
      aliveProb[id] = aliveCounts[id] / n;
      elimProb[id] = elimCounts[id] / n;

      // Normalize by alive count (P(placement | alive at ep)) — for finale
      // episodes only the winner is recorded, so /alive is the correct denominator.
      epPlace[id] = {};
      for (const p of PLACEMENTS) {
        epPlace[id][p] = aliveCounts[id] > 0 ? placeCounts[id][p] / aliveCounts[id] : 0;
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

  for (const id of queenIds) {
    placementDist[id] = new Array(queens.length + 1).fill(0);
    winProb[id] = 0;
  }

  for (const run of runs) {
    for (const [queenId, place] of run.finalRanks) {
      if (place <= queens.length) {
        placementDist[queenId][place] = (placementDist[queenId][place] ?? 0) + 1;
      }
      if (place === 1) winProb[queenId] = (winProb[queenId] ?? 0) + 1;
    }
  }

  // reachedFinaleProb = alive at start of finale episode (last episode by convention)
  const finaleEpIdx = numEpisodes - 1;
  for (const id of queenIds) {
    for (let p = 0; p < placementDist[id].length; p++) {
      placementDist[id][p] /= n;
    }
    const winCount = winProb[id];
    winProb[id] = n > 0 ? winCount / n : 0;
    reachedFinaleProb[id] =
      finaleEpIdx >= 0 && aliveProbByEpisode[finaleEpIdx] ? aliveProbByEpisode[finaleEpIdx][id] ?? 0 : 0;
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

/** Extract unique placement trajectories for a specific queen. */
export function extractTrajectories(
  buffer: Uint8Array,
  totalRuns: number,
  queenIndex: number,
  numQueens: number,
  numEpisodes: number,
  conditions: FilterCondition[],
): { paths: TrajectoryPath[]; scannedRuns: number } {
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
  {
    season,
    fromEpisode,
    numSimulations = 100_000,
    noise = 1.8,
    seed,
  }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): BaselineResult {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);
  const rng = resolveRng(seed);

  // Build locked EpisodeResults and compute remaining queens from outcomes
  const priorResults: EpisodeResult[] = [];
  const allEliminated = new Set<string>();

  for (let i = 0; i < fromEpisode && i < numEpisodes; i++) {
    const ep = episodes[i];
    priorResults.push(outcomeToEpisodeResult(ep));
    if (!isPass(ep)) {
      for (const id of ep.eliminated) allEliminated.add(id);
    }
  }

  const remainingQueenIds = new Set(
    queenIds.filter((id) => !allEliminated.has(id)),
  );

  const midSeason: MidSeasonState = {
    remainingQueenIds,
    priorResults,
    startEpisodeIndex: fromEpisode,
  };

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  const runs: SimulationRun[] = [];
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, rng, midSeason);
    runs.push(run);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }

  const results = aggregateResults(runs, queens, episodes);
  return { results, buffer, numQueens, numEpisodes, queenIds };
}
