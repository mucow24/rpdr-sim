import season1 from './season1';
import season2 from './season2';
import season3 from './season3';
import season4 from './season4';
import season5 from './season5';
import season6 from './season6';
import season7 from './season7';
import season8 from './season8';
import season9 from './season9';
import season10 from './season10';
import season11 from './season11';
import season12 from './season12';
import season13 from './season13';
import season14 from './season14';
import season15 from './season15';
import season16 from './season16';
import season17 from './season17';
import type { SeasonData } from '../engine/types';

export interface SeasonPreset {
  id: string;
  name: string;
  season: SeasonData;
}

export const SEASON_PRESETS: SeasonPreset[] = [
  { id: 'season1', name: 'Season 1', season: season1 },
  { id: 'season2', name: 'Season 2', season: season2 },
  { id: 'season3', name: 'Season 3', season: season3 },
  { id: 'season4', name: 'Season 4', season: season4 },
  { id: 'season5', name: 'Season 5', season: season5 },
  { id: 'season6', name: 'Season 6', season: season6 },
  { id: 'season7', name: 'Season 7', season: season7 },
  { id: 'season8', name: 'Season 8', season: season8 },
  { id: 'season9', name: 'Season 9', season: season9 },
  { id: 'season10', name: 'Season 10', season: season10 },
  { id: 'season11', name: 'Season 11', season: season11 },
  { id: 'season12', name: 'Season 12', season: season12 },
  { id: 'season13', name: 'Season 13', season: season13 },
  { id: 'season14', name: 'Season 14', season: season14 },
  { id: 'season15', name: 'Season 15', season: season15 },
  { id: 'season16', name: 'Season 16', season: season16 },
  { id: 'season17', name: 'Season 17', season: season17 },
];
