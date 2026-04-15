import type {
  Queen,
  BaseStat,
  EpisodeData,
  FinaleEpisode,
  Placement,
  EpisodeResult,
  SimulationRun,
  SimulationResults,
  FilterCondition,
  TrajectoryPath,
  SeasonData,
  RunFromStateOptions,
} from './types';
import { BASE_STATS, PLACEMENT_INDEX, INDEX_PLACEMENT, PLACEMENTS, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX, isFinale } from './types';
import { ARCHETYPES } from '../data/archetypes';
export type { RunFromStateOptions } from './types';

/** Internal mid-season state for simulateOneSeason. */
interface MidSeasonState {
  remainingQueenIds: Set<string>;
  priorResults: EpisodeResult[];
  startEpisodeIndex: number;
}

// Box-Muller transform for gaussian random numbers
function gaussianRandom(mean = 0, stdev = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdev + mean;
}

/** Score a queen against a challenge's weighted mixture of base stats.
 *  Weights are normalized (divided by total) so they don't need to sum to 1.
 *  If all weights are 0 the skill contribution is 0 and the queen scores only
 *  noise — a well-defined fallback, not an error. */
export function scoreQueen(queen: Queen, weights: Record<BaseStat, number>, noise: number): number {
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
  return skill + gaussianRandom(0, noise);
}

/** Default finale handler: average-skill + gaussian noise, top score wins. */
function runFinaleDefault(
  episode: FinaleEpisode,
  remaining: Map<string, Queen>,
  finalRanks: Map<string, number>,
  episodeResults: EpisodeResult[],
): void {
  const finalists = Array.from(remaining.values());
  const finalistScores = finalists.map((q) => {
    const avgSkill =
      Object.values(q.skills).reduce((a, b) => a + b, 0) /
      Object.values(q.skills).length;
    return { queenId: q.id, score: avgSkill + gaussianRandom(0, 1.5) };
  });
  finalistScores.sort((a, b) => b.score - a.score);
  for (let i = 0; i < finalistScores.length; i++) {
    finalRanks.set(finalistScores[i].queenId, i + 1);
  }

  const winnerId = finalistScores[0]?.queenId ?? '';
  const losers = finalistScores.slice(1).map((s) => s.queenId);

  const placements = new Map<string, Placement>();
  if (winnerId) placements.set(winnerId, 'WIN');

  episodeResults.push({
    episodeNumber: episode.number,
    placements,
    lipSyncMatchup: ['', ''],
    lipSyncWinner: '',
    eliminated: '',
  });
  // Drain remaining — finale is the last episode by convention; safe defensive cleanup.
  for (const id of losers) remaining.delete(id);
  if (winnerId) remaining.delete(winnerId);
}

function assignPlacements(
  scores: { queenId: string; score: number }[],
): Map<string, Placement> {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const n = sorted.length;
  const placements = new Map<string, Placement>();

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

function resolveLipSync(queenA: Queen, queenB: Queen): string {
  const pA = queenA.lipSync / (queenA.lipSync + queenB.lipSync);
  return Math.random() < pA ? queenA.id : queenB.id;
}

/** Pure simulation — optionally seeded from a mid-season state. */
function simulateOneSeason(
  queens: Queen[],
  episodes: EpisodeData[],
  noise: number,
  midSeason?: MidSeasonState,
): SimulationRun {
  const queenMap = new Map(queens.map((q) => [q.id, q]));
  const remaining = midSeason
    ? new Map([...queenMap].filter(([id]) => midSeason.remainingQueenIds.has(id)))
    : new Map(queenMap);
  const episodeResults: EpisodeResult[] = midSeason ? [...midSeason.priorResults] : [];
  const eliminationOrder: string[] = [];

  // Derive elimination order from prior results
  if (midSeason) {
    for (const pr of midSeason.priorResults) {
      if (pr.eliminated) eliminationOrder.push(pr.eliminated);
    }
  }

  const startIdx = midSeason?.startEpisodeIndex ?? 0;

  // Final ranks (1 = winner). Built up: ranks N..2 from elimination order, rank 1+ from finale.
  const finalRanks = new Map<string, number>();

  for (let epIdx = startIdx; epIdx < episodes.length; epIdx++) {
    const episode = episodes[epIdx];

    if (isFinale(episode)) {
      // Assign losing ranks from elimination order before finale dispatch.
      const totalQueens = queens.length;
      for (let i = 0; i < eliminationOrder.length; i++) {
        finalRanks.set(eliminationOrder[i], totalQueens - i);
      }
      runFinaleDefault(episode, remaining, finalRanks, episodeResults);
      continue;
    }

    const activeQueens = Array.from(remaining.values());
    const weights = ARCHETYPES[episode.archetype].weights;
    const scores = activeQueens.map((q) => ({
      queenId: q.id,
      score: scoreQueen(q, weights, noise),
    }));

    const placements = assignPlacements(scores);

    // Non-elimination episode: assign placements but skip lip sync
    if (episode.eliminated.length === 0) {
      episodeResults.push({
        episodeNumber: episode.number,
        placements,
        lipSyncMatchup: ['', ''],
        lipSyncWinner: '',
        eliminated: '',
      });
      continue;
    }

    const bottom2 = Array.from(placements.entries())
      .filter(([, p]) => p === 'BTM2')
      .map(([id]) => id);

    if (bottom2.length < 2) {
      episodeResults.push({
        episodeNumber: episode.number,
        placements,
        lipSyncMatchup: [bottom2[0] ?? '', bottom2[1] ?? ''],
        lipSyncWinner: bottom2[0] ?? '',
        eliminated: '',
      });
      continue;
    }

    const queenA = remaining.get(bottom2[0])!;
    const queenB = remaining.get(bottom2[1])!;
    const lipSyncWinner = resolveLipSync(queenA, queenB);
    const eliminated = lipSyncWinner === bottom2[0] ? bottom2[1] : bottom2[0];
    remaining.delete(eliminated);
    eliminationOrder.push(eliminated);

    episodeResults.push({
      episodeNumber: episode.number,
      placements,
      lipSyncMatchup: [bottom2[0], bottom2[1]],
      lipSyncWinner,
      eliminated,
    });
  }

  // If no finale episode was present, fall back to elimination-order-only ranks.
  // (Any queens not yet ranked get the lowest non-eliminated ranks in arbitrary order.)
  if (finalRanks.size === 0) {
    const totalQueens = queens.length;
    for (let i = 0; i < eliminationOrder.length; i++) {
      finalRanks.set(eliminationOrder[i], totalQueens - i);
    }
    let nextRank = 1;
    for (const id of remaining.keys()) {
      if (!finalRanks.has(id)) finalRanks.set(id, nextRank++);
    }
  }

  return { episodeResults, finalRanks };
}

// ── Compact buffer layout ──────────────────────────────────
// Per run: [placements][eliminated][finalPlace]
//   placements: numEpisodes × numQueens bytes (PLACEMENT_INDEX or 255)
//   eliminated: numEpisodes bytes (queen index or 255)
//   finalPlace: numQueens bytes (1-based place)

export function bytesPerRun(numQueens: number, numEpisodes: number): number {
  return numEpisodes * numQueens + numEpisodes + numQueens;
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
  const queenIndex = new Map(queenIds.map((id, i) => [id, i]));

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

  // Eliminated section: numEpisodes
  const elimBase = base + numEpisodes * numQueens;
  for (let ep = 0; ep < numEpisodes; ep++) {
    const epResult = run.episodeResults[ep];
    if (epResult && epResult.eliminated) {
      buf[elimBase + ep] = queenIndex.get(epResult.eliminated) ?? 255;
    } else {
      buf[elimBase + ep] = 255;
    }
  }

  // Final placements section: numQueens
  const fpBase = elimBase + numEpisodes;
  for (let qi = 0; qi < numQueens; qi++) {
    const place = run.finalRanks.get(queenIds[qi]);
    buf[fpBase + qi] = place ?? 255;
  }
}

export interface RunBaselineOptions {
  season: SeasonData;
  numSimulations?: number;
  noise?: number;
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
}: RunBaselineOptions, onProgress?: (pct: number) => void): BaselineResult {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  const runs: SimulationRun[] = [];
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise);
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
  { season, numSimulations = 100_000, noise = 1.8 }: RunBaselineOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }
  return { buffer };
}

/** Run from mid-season state and return only the compact buffer (no aggregation). */
export function runFromStatePartial(
  { season, fromEpisode, numSimulations = 100_000, noise = 1.8 }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): { buffer: Uint8Array } {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);

  const priorResults: EpisodeResult[] = [];
  const allEliminated = new Set<string>();
  for (let i = 0; i < fromEpisode && i < numEpisodes; i++) {
    priorResults.push(outcomeToEpisodeResult(episodes[i]));
    for (const id of episodes[i].eliminated) allEliminated.add(id);
  }

  const midSeason: MidSeasonState = {
    remainingQueenIds: new Set(queenIds.filter((id) => !allEliminated.has(id))),
    priorResults,
    startEpisodeIndex: fromEpisode,
  };

  const progressInterval = Math.max(1, Math.floor(numSimulations / 100));
  for (let i = 0; i < numSimulations; i++) {
    const run = simulateOneSeason(queens, episodes, noise, midSeason);
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

  // Single pass over all runs — run-first for cache locality
  for (let r = 0; r < totalRuns; r++) {
    const base = r * stride;
    const elimBase = base + numEpisodes * numQueens;
    const fpBase = elimBase + numEpisodes;

    // Track eliminations as we go through episodes
    const eliminated = new Set<number>();

    for (let ep = 0; ep < numEpisodes; ep++) {
      // Alive queens accumulate win probability
      for (let qi = 0; qi < numQueens; qi++) {
        if (!eliminated.has(qi)) {
          aliveCountsPerEp[ep][qi]++;
          if (buffer[fpBase + qi] === 1) winCountsPerEp[ep][qi]++;
        }
      }

      // Episode placements
      for (let qi = 0; qi < numQueens; qi++) {
        const pIdx = buffer[base + ep * numQueens + qi];
        if (pIdx !== 255 && pIdx <= 4) {
          placeCountsPerEp[ep][qi * 5 + pIdx]++;
        }
      }

      // Elimination in this episode
      const elimInEp = buffer[elimBase + ep];
      if (elimInEp !== 255) {
        elimCountsPerEp[ep][elimInEp]++;
        eliminated.add(elimInEp);
      } else if (isFinale(episodes[ep])) {
        // Finale: every alive non-winner is "eliminated" at the finale.
        // The buffer's single eliminated byte can't encode N losers, so derive here.
        for (let qi = 0; qi < numQueens; qi++) {
          if (!eliminated.has(qi) && buffer[fpBase + qi] !== 1) {
            elimCountsPerEp[ep][qi]++;
          }
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

/** Get indices of runs matching all conditions. */
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
    const elimBase = base + numEpisodes * numQueens;
    const fpBase = elimBase + numEpisodes;
    let matches = true;
    for (const cond of conditions) {
      if (cond.episodeIndex === OUTCOME_EPISODE_INDEX) {
        // Outcome condition: WIN (placement 0) means finalPlace === 1
        const finalPlace = buffer[fpBase + cond.queenIndex];
        if (cond.placement === 0) {
          if (finalPlace !== 1) { matches = false; break; }
        } else {
          // ELIM in outcome = didn't win
          if (finalPlace === 1) { matches = false; break; }
        }
      } else if (cond.placement === ELIM_PLACEMENT) {
        if (buffer[elimBase + cond.episodeIndex] !== cond.queenIndex) {
          matches = false;
          break;
        }
      } else {
        const val = buffer[base + cond.episodeIndex * numQueens + cond.queenIndex];
        if (val !== cond.placement) {
          matches = false;
          break;
        }
        // BTM2 pin means "survived the lip sync" — exclude if this queen was eliminated
        if (cond.placement === 4 && buffer[elimBase + cond.episodeIndex] === cond.queenIndex) {
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

  // Reconstruct SimulationRuns from matching buffer rows
  const runs: SimulationRun[] = [];
  for (const r of matchingIndices) {
    const base = r * stride;
    const elimBase = base + numEpisodes * numQueens;
    const fpBase = elimBase + numEpisodes;

    const episodeResults: EpisodeResult[] = [];
    for (let ep = 0; ep < numEpisodes; ep++) {
      const placements = new Map<string, Placement>();
      const btm2: string[] = [];
      for (let qi = 0; qi < numQueens; qi++) {
        const pIdx = buffer[base + ep * numQueens + qi];
        if (pIdx !== 255 && pIdx <= 4) {
          const p = INDEX_PLACEMENT[pIdx];
          placements.set(queenIds[qi], p);
          if (p === 'BTM2') btm2.push(queenIds[qi]);
        }
      }
      const elimIdx = buffer[elimBase + ep];
      const eliminated = elimIdx !== 255 ? queenIds[elimIdx] : '';
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
      const eliminatedBefore = new Set<string>();
      for (let e = 0; e < ep && e < run.episodeResults.length; e++) {
        if (run.episodeResults[e].eliminated) {
          eliminatedBefore.add(run.episodeResults[e].eliminated);
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
        const epResult = run.episodeResults[ep];
        if (epResult.eliminated) elimCounts[epResult.eliminated]++;
        for (const [qid, p] of epResult.placements) {
          if (placeCounts[qid]) placeCounts[qid][p]++;
        }
        // Finale: every alive non-winner is "eliminated" at the finale.
        if (isFinale(episodes[ep])) {
          for (const id of queenIds) {
            if (!eliminatedBefore.has(id) && run.finalRanks.get(id) !== 1) {
              elimCounts[id]++;
            }
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
  const placementMap = new Map<string, Placement>();
  for (const [id, p] of Object.entries(ep.placements)) {
    placementMap.set(id, p);
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
  {
    season,
    fromEpisode,
    numSimulations = 100_000,
    noise = 1.8,
  }: RunFromStateOptions,
  onProgress?: (pct: number) => void,
): BaselineResult {
  const { queens, episodes } = season;
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);
  const buffer = new Uint8Array(numSimulations * stride);

  // Build locked EpisodeResults and compute remaining queens from outcomes
  const priorResults: EpisodeResult[] = [];
  const allEliminated = new Set<string>();

  for (let i = 0; i < fromEpisode && i < numEpisodes; i++) {
    const epResult = outcomeToEpisodeResult(episodes[i]);
    priorResults.push(epResult);
    for (const id of episodes[i].eliminated) {
      allEliminated.add(id);
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
    const run = simulateOneSeason(queens, episodes, noise, midSeason);
    runs.push(run);
    writeRunToBuffer(buffer, i, run, queenIds, numQueens, numEpisodes);
    if (onProgress && i % progressInterval === 0) {
      onProgress(Math.round((i / numSimulations) * 100));
    }
  }

  const results = aggregateResults(runs, queens, episodes);
  return { results, buffer, numQueens, numEpisodes, queenIds };
}
