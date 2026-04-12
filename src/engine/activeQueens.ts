import type { Queen, SimulationResults } from './types';

/**
 * Build a set of queen IDs that have been eliminated before the given episode.
 * Uses the most-likely-eliminated queen per episode from simulation results.
 */
export function getEliminatedQueenIds(
  beforeEpisode: number,
  results: SimulationResults,
): Set<string> {
  const eliminated = new Set<string>();
  for (let ep = 0; ep < beforeEpisode; ep++) {
    const elimProbs = results.elimProbByEpisode[ep];
    if (!elimProbs) continue;
    let bestId = '';
    let bestProb = 0;
    for (const [qid, prob] of Object.entries(elimProbs)) {
      if (prob > bestProb && !eliminated.has(qid)) {
        bestProb = prob;
        bestId = qid;
      }
    }
    if (bestId && bestProb > 0) eliminated.add(bestId);
  }
  return eliminated;
}

/**
 * Return queens still active (not eliminated) at the given episode index.
 */
export function getActiveQueensForEpisode(
  episodeIndex: number,
  queens: Queen[],
  results: SimulationResults,
): Queen[] {
  const eliminated = getEliminatedQueenIds(episodeIndex, results);
  return queens.filter((q) => !eliminated.has(q.id));
}
