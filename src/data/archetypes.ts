import { BASE_STATS, type BaseStat } from '../engine/types';

export interface ArchetypeDef {
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

/** Catalog of episode archetypes. Each archetype defines a composite weighting
 *  over the 8 base stats. Weights are normalized at scoring time, so they do
 *  not need to sum to any particular value. */
export const ARCHETYPES = {
  snatchGame: {
    displayName: 'Snatch Game',
    icon: '🎯',
    weights: mix({ comedy: 30, improv: 50, acting: 5, charisma: 15 }),
  },
  improv: {
    displayName: 'Improv Challenge',
    icon: '🎪',
    weights: mix({ comedy: 10, improv: 60, charisma: 30 }),
  },
  acting: {
    displayName: 'Acting Challenge',
    icon: '🎭',
    weights: mix({ comedy: 20, improv: 5, acting: 55, charisma: 20 }),
  },
  standUpRoast: {
    displayName: 'Stand-Up / Roast',
    icon: '🎙️',
    weights: mix({ comedy: 60, improv: 10, charisma: 30 }),
  },
  branding: {
    displayName: 'Branding / Selling',
    icon: '📣',
    weights: mix({ comedy: 30, improv: 15, acting: 15, charisma: 40 }),
  },
  ball: {
    displayName: 'Ball',
    icon: '👗',
    weights: mix({ design: 35, runway: 65 }),
  },
  designChallenge: {
    displayName: 'Design Challenge',
    icon: '✂️',
    weights: mix({ design: 75, runway: 25 }),
  },
  makeover: {
    displayName: 'Makeover',
    icon: '💄',
    weights: mix({ acting: 10, design: 25, runway: 25, charisma: 40 }),
  },
  girlGroup: {
    displayName: 'Girl Group / Music Performance',
    icon: '🎤',
    weights: mix({ comedy: 10, dance: 15, music: 40, charisma: 35 }),
  },
  rusical: {
    displayName: 'Rusical',
    icon: '🎼',
    weights: mix({ acting: 25, dance: 25, music: 25, charisma: 25 }),
  },
  dance: {
    displayName: 'Dance',
    icon: '💃',
    weights: mix({ acting: 10, dance: 60, music: 10, charisma: 20 }),
  },
  lipSyncSmackdown: {
    displayName: 'Lip Sync Smackdown',
    icon: '🎤',
    weights: mix({ dance: 100 }),
  },
  talentShow: {
    displayName: 'Talent Show',
    icon: '🌟',
    weights: mix({
      comedy: 11, improv: 11, acting: 11, dance: 11,
      music: 11, design: 11, runway: 11, charisma: 20,
    }),
  },
} as const satisfies Record<string, ArchetypeDef>;

export type ArchetypeId = keyof typeof ARCHETYPES;

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as ArchetypeId[];
