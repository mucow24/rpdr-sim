import { create } from 'zustand';
import type { Season, SimulationResults, FilterCondition } from '../engine/types';
import season5 from '../data/season5';

interface AppState {
  season: Season;
  conditions: FilterCondition[];
  baselineResults: SimulationResults | null;
  filteredResults: SimulationResults | null;
  filterMatchCount: number | null;
  filterTotalRuns: number | null;
  isSimulating: boolean;
  simulationProgress: number | null;
  selectedQueenId: string | null;
  openEpisodeIndex: number | null;

  setSeason: (season: Season) => void;
  setBaselineResults: (results: SimulationResults) => void;
  setSimulationProgress: (pct: number | null) => void;
  setFilteredResults: (
    results: SimulationResults | null,
    matchCount: number | null,
    totalRuns: number | null,
  ) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSelectedQueenId: (queenId: string | null) => void;
  setOpenEpisodeIndex: (idx: number | null) => void;

  addCondition: (c: FilterCondition) => void;
  removeCondition: (episodeIndex: number, queenIndex: number) => void;
  clearConditions: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  season: season5,
  conditions: [],
  baselineResults: null,
  filteredResults: null,
  filterMatchCount: null,
  filterTotalRuns: null,
  isSimulating: false,
  simulationProgress: null,
  selectedQueenId: null,
  openEpisodeIndex: null,

  setSeason: (season) =>
    set({ season, conditions: [], filteredResults: null }),
  setBaselineResults: (results) => set({ baselineResults: results }),
  setFilteredResults: (results, matchCount, totalRuns) =>
    set({
      filteredResults: results,
      filterMatchCount: matchCount,
      filterTotalRuns: totalRuns,
    }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationProgress: (pct) => set({ simulationProgress: pct }),
  setSelectedQueenId: (queenId) =>
    set((s) => ({
      selectedQueenId: s.selectedQueenId === queenId ? null : queenId,
    })),
  setOpenEpisodeIndex: (idx) =>
    set((s) => ({
      openEpisodeIndex: s.openEpisodeIndex === idx ? null : idx,
    })),

  addCondition: (c) =>
    set((s) => {
      // Replace existing condition for same queen+episode, or add new
      const filtered = s.conditions.filter(
        (existing) =>
          !(
            existing.episodeIndex === c.episodeIndex &&
            existing.queenIndex === c.queenIndex
          ),
      );
      return { conditions: [...filtered, c] };
    }),

  removeCondition: (episodeIndex, queenIndex) =>
    set((s) => ({
      conditions: s.conditions.filter(
        (c) =>
          !(c.episodeIndex === episodeIndex && c.queenIndex === queenIndex),
      ),
    })),

  clearConditions: () =>
    set({ conditions: [], filteredResults: null, filterMatchCount: null, filterTotalRuns: null }),
}));
