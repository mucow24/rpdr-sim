import { BASE_STATS, type BaseStat } from '../engine/types';

export interface ChallengeTypeDef {
  displayName: string;
  icon: string;
  weights: Record<BaseStat, number>;
}

/** Build a full weights record with every base stat at 0, then override with `partial`. */
function mix(partial: Partial<Record<BaseStat, number>>): Record<BaseStat, number> {
  const w = {} as Record<BaseStat, number>;
  for (const stat of BASE_STATS) w[stat] = 0;
  for (const [stat, val] of Object.entries(partial) as [BaseStat, number][]) {
    w[stat] = val;
  }
  return w;
}

/** Catalog of challenge-type presets. Ids are used on RegularEpisode.challengeType
 *  for display/labeling; the sim reads challengeWeights, not this catalog. */
export const CHALLENGE_TYPES = {
  comedy:     { displayName: 'Comedy',      icon: '🎤', weights: mix({ comedy: 1 }) },
  design:     { displayName: 'Design',      icon: '✂️', weights: mix({ design: 1 }) },
  acting:     { displayName: 'Acting',      icon: '🎭', weights: mix({ acting: 1 }) },
  dance:      { displayName: 'Dance',       icon: '💃', weights: mix({ dance: 1 }) },
  snatchGame: { displayName: 'Snatch Game', icon: '🎯', weights: mix({ snatchGame: 1 }) },
  improv:     { displayName: 'Improv',      icon: '🎪', weights: mix({ improv: 1 }) },
  runway:     { displayName: 'Runway',      icon: '👗', weights: mix({ runway: 1 }) },
  singing:    { displayName: 'Singing',     icon: '🎵', weights: mix({ singing: 1 }) },
} as const satisfies Record<string, ChallengeTypeDef>;

export type ChallengeTypeId = keyof typeof CHALLENGE_TYPES;

export const CHALLENGE_TYPE_IDS = Object.keys(CHALLENGE_TYPES) as ChallengeTypeId[];

/** Display metadata keyed by base stat — used by the queen editor, radar chart, etc. */
export const BASE_STAT_DISPLAY: Record<BaseStat, string> = {
  comedy: 'Comedy',
  design: 'Design',
  acting: 'Acting',
  dance: 'Dance',
  snatchGame: 'Snatch Game',
  improv: 'Improv',
  runway: 'Runway',
  singing: 'Singing',
};
