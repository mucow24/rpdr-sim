export const CHALLENGE_CATEGORIES = [
  'comedy',
  'design',
  'acting',
  'dance',
  'snatchGame',
  'improv',
  'runway',
  'singing',
] as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export interface Queen {
  id: string;
  name: string;
  skills: Record<ChallengeCategory, number>; // 1-10
  lipSync: number; // 1-10
  color: string; // hex color for charts
}

export const PLACEMENTS = ['WIN', 'HIGH', 'SAFE', 'LOW', 'BTM2'] as const;
export type Placement = (typeof PLACEMENTS)[number];

/** Numeric encoding for compact storage: 0=WIN,1=HIGH,2=SAFE,3=LOW,4=BTM2,5=ELIM,255=not present */
export const PLACEMENT_INDEX: Record<Placement, number> = {
  WIN: 0, HIGH: 1, SAFE: 2, LOW: 3, BTM2: 4,
};
export const ELIM_PLACEMENT = 5;
export const INDEX_PLACEMENT: Record<number, Placement> = {
  0: 'WIN', 1: 'HIGH', 2: 'SAFE', 3: 'LOW', 4: 'BTM2',
};

export interface Episode {
  number: number;
  challengeType: ChallengeCategory;
  challengeName: string;
}

export interface Season {
  id: string;
  name: string;
  queens: Queen[];
  episodes: Episode[];
}

export interface EpisodeResult {
  episodeNumber: number;
  placements: Map<string, Placement>; // queenId -> placement
  lipSyncMatchup: [string, string]; // [queenId, queenId]
  lipSyncWinner: string; // queenId
  eliminated: string; // queenId
}

export interface SimulationRun {
  episodeResults: EpisodeResult[];
  finalPlacements: Map<string, number>; // queenId -> final place (1 = winner)
}

/** A filter condition for what-if analysis */
export interface FilterCondition {
  episodeIndex: number;   // 0-based episode index
  queenIndex: number;     // index into season.queens array
  placement: number;      // 0=WIN, 1=HIGH, 2=SAFE, 3=LOW, 4=BTM2
}

/** Aggregated results across simulation runs */
export interface SimulationResults {
  numSimulations: number;
  /** winProbByEpisode[episodeIdx][queenId] = P(win | alive at this episode) */
  winProbByEpisode: Record<string, number>[];
  /** elimProbByEpisode[episodeIdx][queenId] = P(eliminated this episode) */
  elimProbByEpisode: Record<string, number>[];
  /** placementDist[queenId][place] = P(finishing in that place) */
  placementDist: Record<string, number[]>;
  /** top4Prob[queenId] = P(making top 4) */
  top4Prob: Record<string, number>;
  /** winProb[queenId] = P(winning) */
  winProb: Record<string, number>;
  /** episodePlacements[epIdx][queenId] = { WIN: 0.3, HIGH: 0.4, ... } */
  episodePlacements: Record<string, Record<string, number>>[];
}
