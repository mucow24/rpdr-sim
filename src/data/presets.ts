import season5 from './season5';
import type { SeasonData } from '../engine/types';

export interface SeasonPreset {
  id: string;
  name: string;
  season: SeasonData;
}

// V2 prototype: only Season 5 is registered. Other seasons' hand-calibrated data lives
// in src/data/_v1_archive/ and is excluded from the build until they're migrated to v2.
export const SEASON_PRESETS: SeasonPreset[] = [
  { id: 'season5', name: 'Season 5', season: season5 },
];
