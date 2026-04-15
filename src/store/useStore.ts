import { create } from 'zustand';
import type { SeasonData, EpisodeData, Queen, Placement, SimulationResults, FilterCondition, TrajectoryPath, BaseStat } from '../engine/types';
import { isFinale } from '../engine/types';
import { type ArchetypeId } from '../data/archetypes';
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
  trajectoryPaths: TrajectoryPath[] | null;
  trajectoryTotalRuns: number | null;

  editorEpisodes: EpisodeData[];
  editorQueens: Queen[];

  numSimulations: number;

  appMode: 'simulation' | 'seasonEditor' | 'queenEditor' | 'calibrate';

  updateEpisodeArchetype: (epIdx: number, archetype: ArchetypeId) => void;
  updateEpisodeWeights: (epIdx: number, weights: Record<BaseStat, number>) => void;
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
  setTrajectoryPaths: (paths: TrajectoryPath[] | null, totalRuns: number | null) => void;

  setEditorEpisodes: (episodes: EpisodeData[]) => void;
  setEditorQueens: (queens: Queen[]) => void;

  setNumSimulations: (n: number) => void;

  setAppMode: (mode: 'simulation' | 'seasonEditor' | 'queenEditor' | 'calibrate') => void;

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
  trajectoryPaths: null,
  trajectoryTotalRuns: null,

  editorEpisodes: cloneSeason(season5).episodes,
  editorQueens: [...season5.queens],

  numSimulations: 100_000,

  appMode: 'simulation',

  updateEpisodeArchetype: (epIdx, archetype) =>
    set((s) => {
      // Finale episodes don't have an archetype — no-op.
      if (isFinale(s.realSeason.episodes[epIdx])) return {};
      // Changing archetype clears any per-episode weight override so the
      // dropdown acts as a clean preset swap.
      const applyArchetype = (ep: EpisodeData, i: number) => {
        if (i !== epIdx || isFinale(ep)) return ep;
        const { weights: _drop, ...rest } = ep;
        void _drop;
        return { ...rest, archetype };
      };
      const realEpisodes = s.realSeason.episodes.map(applyArchetype);
      const currentEpisodes = s.currentSeason.episodes.map(applyArchetype);
      return {
        realSeason: { ...s.realSeason, episodes: realEpisodes },
        currentSeason: { ...s.currentSeason, episodes: currentEpisodes },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  updateEpisodeWeights: (epIdx, weights) =>
    set((s) => {
      // Finale episodes don't have weights — no-op.
      if (isFinale(s.realSeason.episodes[epIdx])) return {};
      const applyWeights = (ep: EpisodeData, i: number) =>
        i === epIdx && !isFinale(ep) ? { ...ep, weights: { ...weights } } : ep;
      const realEpisodes = s.realSeason.episodes.map(applyWeights);
      const currentEpisodes = s.currentSeason.episodes.map(applyWeights);
      return {
        realSeason: { ...s.realSeason, episodes: realEpisodes },
        currentSeason: { ...s.currentSeason, episodes: currentEpisodes },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

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
  setTrajectoryPaths: (paths, totalRuns) =>
    set({ trajectoryPaths: paths, trajectoryTotalRuns: totalRuns }),

  setEditorEpisodes: (episodes) => set({ editorEpisodes: episodes }),
  setEditorQueens: (queens) => set({ editorQueens: queens }),

  setNumSimulations: (n) => set({ numSimulations: n }),

  setAppMode: (mode) => set({ appMode: mode }),

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
