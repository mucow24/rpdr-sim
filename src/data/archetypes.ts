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
    weights: mix({ comedy: 30, improv: 50, acting: 10, charisma: 10 }),
  },
  rusical: {
    displayName: 'Rusical',
    icon: '🎼',
    weights: mix({ acting: 25, dance: 40, music: 15, charisma: 20 }),
  },
  girlGroup: {
    displayName: 'Girl Group / Music Video',
    icon: '🎤',
    weights: mix({ comedy: 5, dance: 45, music: 30, charisma: 20 }),
  },
  actingSketch: {
    displayName: 'Acting Challenge',
    icon: '🎭',
    weights: mix({ comedy: 35, improv: 10, acting: 40, charisma: 15 }),
  },
  improv: {
    displayName: 'Improv Challenge',
    icon: '🎪',
    weights: mix({ comedy: 25, improv: 60, charisma: 15 }),
  },
  standUpRoast: {
    displayName: 'Stand-Up / Roast',
    icon: '🎙️',
    weights: mix({ comedy: 55, improv: 15, charisma: 30 }),
  },
  unconventional: {
    displayName: 'Unconventional Materials',
    icon: '🧵',
    weights: mix({ design: 70, runway: 30 }),
  },
  sewing: {
    displayName: 'Design-From-Scratch',
    icon: '✂️',
    weights: mix({ design: 80, runway: 20 }),
  },
  ball: {
    displayName: 'Ball',
    icon: '👗',
    weights: mix({ design: 40, runway: 60 }),
  },
  makeover: {
    displayName: 'Makeover',
    icon: '💄',
    weights: mix({ acting: 10, design: 25, runway: 25, charisma: 40 }),
  },
  branding: {
    displayName: 'Branding / Infomercial',
    icon: '📣',
    weights: mix({ comedy: 35, improv: 15, acting: 20, charisma: 30 }),
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
