import season5 from './season5';
import type { SeasonData } from '../engine/types';

export interface SeasonPreset {
  id: string;
  name: string;
  season: SeasonData;
}

export const SEASON_PRESETS: SeasonPreset[] = [
  { id: 'season5', name: 'Season 5', season: season5 },
];
