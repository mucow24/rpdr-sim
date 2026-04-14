import type { ChallengeTypeId } from '../data/challengeTypes';

/** Base stats a queen has. Challenges test a weighted mixture of these. */
export const BASE_STATS = [
  'comedy',
  'design',
  'acting',
  'dance',
  'snatchGame',
  'improv',
  'runway',
  'singing',
] as const;

export type BaseStat = (typeof BASE_STATS)[number];

export interface Queen {
  id: string;
  name: string;
  skills: Record<BaseStat, number>; // 1-10
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
/** Sentinel episodeIndex for outcome (season winner) conditions */
export const OUTCOME_EPISODE_INDEX = -1;
export const INDEX_PLACEMENT: Record<number, Placement> = {
  0: 'WIN', 1: 'HIGH', 2: 'SAFE', 3: 'LOW', 4: 'BTM2',
};

export const FINALE_TYPES = ['default'] as const;
export type FinaleType = (typeof FINALE_TYPES)[number];

/** A regular competition episode with a challenge and outcomes */
export interface RegularEpisode {
  kind?: 'regular';                        // optional — defaults to regular
  id?: string;
  number: number;
  /** Preset id for display/labeling. Two semantically distinct presets may
   *  legitimately share weights, so the id is not derivable from weights. */
  challengeType: ChallengeTypeId;
  /** Weighted mixture of base stats the challenge tests. Normalized at scoring
   *  time, so weights do not need to sum to 1. */
  challengeWeights: Record<BaseStat, number>;
  challengeName: string;
  placements: Record<string, Placement>;   // queenId -> WIN/HIGH/SAFE/LOW/BTM2
  eliminated: string[];                    // queenIds (empty = non-elim)
  splitPremiere?: boolean;                 // true if part of a split premiere format
}

/** A finale episode. Its simulation mechanics are determined by finaleType. */
export interface FinaleEpisode {
  kind: 'finale';                          // required discriminant
  id?: string;
  number: number;
  finaleType: FinaleType;
  challengeName: string;                   // e.g. 'Grand Finale'
  placements: Record<string, Placement>;   // sim-populated: {winnerId: 'WIN'}
  eliminated: string[];                    // sim-populated: non-winners
}

export type EpisodeData = RegularEpisode | FinaleEpisode;

export function isFinale(ep: EpisodeData): ep is FinaleEpisode {
  return ep.kind === 'finale';
}

/** A complete season: queens, episodes (with outcomes), loadable for any season */
export interface SeasonData {
  id: string;
  name: string;
  queens: Queen[];
  episodes: EpisodeData[];
}

/** Simulation-internal episode result (Map-based, with lip sync details) */
export interface EpisodeResult {
  episodeNumber: number;
  placements: Map<string, Placement>; // queenId -> placement
  lipSyncMatchup: [string, string]; // [queenId, queenId]
  lipSyncWinner: string; // queenId
  eliminated: string; // queenId
}

export interface SimulationRun {
  episodeResults: EpisodeResult[];
  finalRanks: Map<string, number>; // queenId -> final rank (1 = winner)
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
  /** winProbByEpisode[episodeIdx][queenId] = P(win | alive at start of this episode).
   *  At the finale index, equals P(wins | reached finale). */
  winProbByEpisode: Record<string, number>[];
  /** aliveProbByEpisode[episodeIdx][queenId] = P(alive at start of this episode).
   *  At the finale index, equals P(reached finale). */
  aliveProbByEpisode: Record<string, number>[];
  /** elimProbByEpisode[episodeIdx][queenId] = P(eliminated this episode) */
  elimProbByEpisode: Record<string, number>[];
  /** placementDist[queenId][place] = P(finishing in that place) */
  placementDist: Record<string, number[]>;
  /** reachedFinaleProb[queenId] = P(alive at the start of the finale episode).
   *  Correct for any finale cohort size (top 3, top 4, top 5, …). */
  reachedFinaleProb: Record<string, number>;
  /** winProb[queenId] = P(winning) */
  winProb: Record<string, number>;
  /** episodePlacements[epIdx][queenId] = { WIN: 0.3, HIGH: 0.4, ... } */
  episodePlacements: Record<string, Record<string, number>>[];
}

/** A unique placement path across episodes with its frequency */
export interface TrajectoryPath {
  placements: number[];  // placement indices per episode (0=WIN..4=BTM2), length = episodes survived
  count: number;
}

export interface RunFromStateOptions {
  season: SeasonData;
  fromEpisode: number;     // 0-based, first ep to simulate
  numSimulations?: number;
  noise?: number;
}
