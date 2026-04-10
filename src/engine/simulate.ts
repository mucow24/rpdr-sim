import type {
  Queen,
  Episode,
  Placement,
  EpisodeResult,
  SimulationRun,
  SimulationResults,
  FilterCondition,
} from './types';
import { PLACEMENT_INDEX, INDEX_PLACEMENT, PLACEMENTS, ELIM_PLACEMENT } from './types';

// Box-Muller transform for gaussian random numbers
function gaussianRandom(mean = 0, stdev = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdev + mean;
}

function scoreQueen(queen: Queen, episode: Episode, noise: number): number {
  const skill = queen.skills[episode.challengeType];
  const runwayBonus = queen.skills.runway * 0.15;
  return skill + runwayBonus + gaussianRandom(0, noise);
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

/** Pure simulation — no constraints, no filtering. */
function simulateOneSeason(
  queens: Queen[],
  episodes: Episode[],
  noise: number,
): SimulationRun {
  const remaining = new Map(queens.map((q) => [q.id, q]));
  const episodeResults: EpisodeResult[] = [];
  const eliminationOrder: string[] = [];

  for (const episode of episodes) {
    if (remaining.size <= 3) break;

    const activeQueens = Array.from(remaining.values());
    const scores = activeQueens.map((q) => ({
      queenId: q.id,
      score: scoreQueen(q, episode, noise),
    }));

    const placements = assignPlacements(scores);

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

  // Final placements
  const totalQueens = queens.length;
  const finalPlacements = new Map<string, number>();

  for (let i = 0; i < eliminationOrder.length; i++) {
    finalPlacements.set(eliminationOrder[i], totalQueens - i);
  }

  const finalists = Array.from(remaining.values());
  const finalistScores = finalists.map((q) => {
    const avgSkill =
      Object.values(q.skills).reduce((a, b) => a + b, 0) /
      Object.values(q.skills).length;
    return { queenId: q.id, score: avgSkill + gaussianRandom(0, 1.5) };
  });
  finalistScores.sort((a, b) => b.score - a.score);
  for (let i = 0; i < finalistScores.length; i++) {
    finalPlacements.set(finalistScores[i].queenId, i + 1);
  }

  return { episodeResults, finalPlacements };
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
    const place = run.finalPlacements.get(queenIds[qi]);
    buf[fpBase + qi] = place ?? 255;
  }
}

export interface RunBaselineOptions {
  queens: Queen[];
  episodes: Episode[];
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
  queens,
  episodes,
  numSimulations = 100_000,
  noise = 1.8,
}: RunBaselineOptions, onProgress?: (pct: number) => void): BaselineResult {
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

/** Filter the compact buffer and re-aggregate. */
export function filterAndAggregate(
  buffer: Uint8Array,
  totalRuns: number,
  conditions: FilterCondition[],
  queens: Queen[],
  episodes: Episode[],
): { results: SimulationResults; matchCount: number } {
  const numQueens = queens.length;
  const numEpisodes = episodes.length;
  const queenIds = queens.map((q) => q.id);
  const stride = bytesPerRun(numQueens, numEpisodes);

  // Collect matching run indices
  const matchingIndices: number[] = [];
  for (let r = 0; r < totalRuns; r++) {
    const base = r * stride;
    const elimBase = base + numEpisodes * numQueens;
    let matches = true;
    for (const cond of conditions) {
      if (cond.placement === ELIM_PLACEMENT) {
        // ELIM condition: check eliminated section for this queen at this episode
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
      }
    }
    if (matches) matchingIndices.push(r);
  }

  if (matchingIndices.length === 0) {
    // Return empty results
    const empty: SimulationResults = {
      numSimulations: 0,
      winProbByEpisode: [],
      elimProbByEpisode: [],
      placementDist: {},
      top4Prob: {},
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
      let btm2: string[] = [];
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

    const finalPlacements = new Map<string, number>();
    for (let qi = 0; qi < numQueens; qi++) {
      const place = buffer[fpBase + qi];
      if (place !== 255) finalPlacements.set(queenIds[qi], place);
    }

    runs.push({ episodeResults, finalPlacements });
  }

  const results = aggregateResults(runs, queens, episodes);
  return { results, matchCount: matchingIndices.length };
}

function aggregateResults(
  runs: SimulationRun[],
  queens: Queen[],
  episodes: Episode[],
): SimulationResults {
  const n = runs.length;
  const queenIds = queens.map((q) => q.id);
  const numEpisodes = episodes.length;

  const winProbByEpisode: Record<string, number>[] = [];
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
          const place = run.finalPlacements.get(id);
          if (place === 1) winCounts[id]++;
        }
      }

      if (ep < run.episodeResults.length) {
        const epResult = run.episodeResults[ep];
        if (epResult.eliminated) elimCounts[epResult.eliminated]++;
        for (const [qid, p] of epResult.placements) {
          if (placeCounts[qid]) placeCounts[qid][p]++;
        }
      }
    }

    const winProb: Record<string, number> = {};
    const elimProb: Record<string, number> = {};
    const epPlace: Record<string, Record<string, number>> = {};

    for (const id of queenIds) {
      winProb[id] = aliveCounts[id] > 0 ? winCounts[id] / aliveCounts[id] : 0;
      elimProb[id] = elimCounts[id] / n;

      const total = Object.values(placeCounts[id]).reduce((a, b) => a + b, 0);
      epPlace[id] = {};
      for (const p of PLACEMENTS) {
        epPlace[id][p] = total > 0 ? placeCounts[id][p] / total : 0;
      }
    }

    winProbByEpisode.push(winProb);
    elimProbByEpisode.push(elimProb);
    episodePlacements.push(epPlace);
  }

  const placementDist: Record<string, number[]> = {};
  const top4Prob: Record<string, number> = {};
  const winProb: Record<string, number> = {};

  for (const id of queenIds) {
    placementDist[id] = new Array(queens.length + 1).fill(0);
    top4Prob[id] = 0;
    winProb[id] = 0;
  }

  for (const run of runs) {
    for (const [queenId, place] of run.finalPlacements) {
      if (place <= queens.length) {
        placementDist[queenId][place] = (placementDist[queenId][place] ?? 0) + 1;
      }
      if (place <= 4) top4Prob[queenId] = (top4Prob[queenId] ?? 0) + 1;
      if (place === 1) winProb[queenId] = (winProb[queenId] ?? 0) + 1;
    }
  }

  for (const id of queenIds) {
    for (let p = 0; p < placementDist[id].length; p++) {
      placementDist[id][p] /= n;
    }
    top4Prob[id] /= n;
    winProb[id] /= n;
  }

  return {
    numSimulations: n,
    winProbByEpisode,
    elimProbByEpisode,
    placementDist,
    top4Prob,
    winProb,
    episodePlacements,
  };
}
