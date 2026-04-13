import { create } from 'zustand';
import type { SeasonData, EpisodeData, Queen, Placement, SimulationResults, FilterCondition, TrajectoryPath } from '../engine/types';
import season5 from '../data/season5';

function cloneSeason(s: SeasonData): SeasonData {
  return {
    ...s,
    queens: s.queens, // queens are immutable, no need to deep clone
    episodes: s.episodes.map((ep) => ({
      ...ep,
      placements: { ...ep.placements },
      eliminated: [...ep.eliminated],
    })),
  };
}

interface AppState {
  realSeason: SeasonData;
  currentSeason: SeasonData;
  conditions: FilterCondition[];
  baselineResults: SimulationResults | null;
  filteredResults: SimulationResults | null;
  filterMatchCount: number | null;
  filterTotalRuns: number | null;
  isSimulating: boolean;
  simulationProgress: number | null;
  selectedQueenId: string | null;
  openEpisodeIndex: number | null;
  trajectoryPaths: TrajectoryPath[] | null;
  trajectoryTotalRuns: number | null;

  editorEpisodes: EpisodeData[];
  editorQueens: Queen[];

  appMode: 'simulation' | 'divergence' | 'spread' | 'seasonEditor' | 'queenEditor' | 'calibrate';
  spreadSelectedEpisode: number;

  updateEpisodeOutcome: (epIdx: number, outcome: { placements: Record<string, Placement>; eliminated: string[] }) => void;
  resetEpisode: (epIdx: number) => void;
  resetAllEpisodes: () => void;

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
  setTrajectoryPaths: (paths: TrajectoryPath[] | null, totalRuns: number | null) => void;

  setEditorEpisodes: (episodes: EpisodeData[]) => void;
  setEditorQueens: (queens: Queen[]) => void;

  setAppMode: (mode: 'simulation' | 'divergence' | 'spread' | 'seasonEditor' | 'queenEditor' | 'calibrate') => void;
  setSpreadSelectedEpisode: (idx: number) => void;

  addCondition: (c: FilterCondition) => void;
  removeCondition: (episodeIndex: number, queenIndex: number) => void;
  clearConditions: () => void;
}

export const useStore = create<AppState>()((set) => ({
  realSeason: season5,
  currentSeason: cloneSeason(season5),
  conditions: [],
  baselineResults: null,
  filteredResults: null,
  filterMatchCount: null,
  filterTotalRuns: null,
  isSimulating: false,
  simulationProgress: null,
  selectedQueenId: null,
  openEpisodeIndex: null,
  trajectoryPaths: null,
  trajectoryTotalRuns: null,

  editorEpisodes: [],
  editorQueens: [],

  appMode: 'spread',
  spreadSelectedEpisode: 0,

  updateEpisodeOutcome: (epIdx, outcome) =>
    set((s) => {
      const episodes = s.currentSeason.episodes.map((ep, i) =>
        i === epIdx
          ? { ...ep, placements: { ...outcome.placements }, eliminated: [...outcome.eliminated] }
          : ep,
      );
      return { currentSeason: { ...s.currentSeason, episodes } };
    }),

  resetEpisode: (epIdx) =>
    set((s) => {
      const realEp = s.realSeason.episodes[epIdx];
      const episodes = s.currentSeason.episodes.map((ep, i) =>
        i === epIdx
          ? { ...ep, placements: { ...realEp.placements }, eliminated: [...realEp.eliminated] }
          : ep,
      );
      return { currentSeason: { ...s.currentSeason, episodes } };
    }),

  resetAllEpisodes: () =>
    set((s) => ({ currentSeason: cloneSeason(s.realSeason), baselineResults: null })),

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
  setTrajectoryPaths: (paths, totalRuns) =>
    set({ trajectoryPaths: paths, trajectoryTotalRuns: totalRuns }),

  setEditorEpisodes: (episodes) => set({ editorEpisodes: episodes }),
  setEditorQueens: (queens) => set({ editorQueens: queens }),

  setAppMode: (mode) => set({ appMode: mode }),
  setSpreadSelectedEpisode: (idx) => set({ spreadSelectedEpisode: idx }),

  addCondition: (c) =>
    set((s) => {
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
