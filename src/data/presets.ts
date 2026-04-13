import season5 from './season5';
import season6 from './season6';
import season7 from './season7';
import season8 from './season8';
import season9 from './season9';
import season10 from './season10';
import season11 from './season11';
import season12 from './season12';
import type { SeasonData } from '../engine/types';

export interface SeasonPreset {
  id: string;
  name: string;
  season: SeasonData;
}

export const SEASON_PRESETS: SeasonPreset[] = [
  { id: 'season5', name: 'Season 5', season: season5 },
  { id: 'season6', name: 'Season 6', season: season6 },
  { id: 'season7', name: 'Season 7', season: season7 },
  { id: 'season8', name: 'Season 8', season: season8 },
  { id: 'season9', name: 'Season 9', season: season9 },
  { id: 'season10', name: 'Season 10', season: season10 },
  { id: 'season11', name: 'Season 11', season: season11 },
  { id: 'season12', name: 'Season 12', season: season12 },
];
