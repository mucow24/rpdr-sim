import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  SeasonData, EpisodeData, Queen, Placement, SimulationResults,
  FilterCondition, TrajectoryPath, BaseStat,
} from '../engine/types';
import { isFinale, isPass } from '../engine/types';
import { type ArchetypeId } from '../data/archetypes';
import { SEASON_PRESETS } from '../data/presets';
import { migrateToV2 } from './migrate';

export interface EpisodeOverride {
  placements: Record<string, Placement>;
  eliminated: string[];
}

export interface AppState {
  // Multi-season master data (mutable; edited by Calibrate + sim-side actions)
  seasonsById: Record<string, SeasonData>;

  // Active simulation
  activeSeasonId: string;
  currentEpisodeOverrides: Record<number, EpisodeOverride>;

  // Sim run state
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

  numSimulations: number;

  // UI preferences
  appMode: 'simulation' | 'calibrate' | 'data' | 'lip-syncs';
  enabledCalibrateSeasons: string[];

  // Season / queen data actions
  loadSeason: (seasonId: string) => void;
  updateQueenSkill: (seasonId: string, queenId: string, stat: BaseStat, value: number) => void;
  updateQueenLipSync: (seasonId: string, queenId: string, value: number) => void;
  updateEpisodeArchetype: (epIdx: number, archetype: ArchetypeId) => void;
  updateEpisodeWeights: (epIdx: number, weights: Record<BaseStat, number>) => void;
  updateEpisodeOutcome: (epIdx: number, outcome: EpisodeOverride) => void;
  resetEpisode: (epIdx: number) => void;
  resetAllEpisodes: () => void;

  // Data tab actions
  reloadQueensFromSource: () => void;
  resetQueenColors: () => void;
  reloadSeasonsFromSource: () => void;
  importQueensJson: (parsed: unknown) => boolean;
  exportQueensJson: () => string;
  importSeasonsJson: (parsed: unknown) => boolean;
  exportSeasonsJson: () => string;

  // Sim control
  setBaselineResults: (results: SimulationResults | null) => void;
  setSimulationProgress: (pct: number | null) => void;
  setFilteredResults: (results: SimulationResults | null, matchCount: number | null, totalRuns: number | null) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSelectedQueenId: (queenId: string | null) => void;
  setTrajectoryPaths: (paths: TrajectoryPath[] | null, totalRuns: number | null) => void;
  setNumSimulations: (n: number) => void;

  // UI
  setAppMode: (mode: 'simulation' | 'calibrate' | 'data' | 'lip-syncs') => void;
  toggleCalibrateSeason: (seasonId: string) => void;
  setEnabledCalibrateSeasons: (seasonIds: string[]) => void;

  // Filters
  addCondition: (c: FilterCondition) => void;
  removeCondition: (episodeIndex: number, queenIndex: number) => void;
  clearConditions: () => void;
}

function cloneSeason(s: SeasonData): SeasonData {
  return {
    ...s,
    queens: s.queens.map((q) => ({ ...q, skills: { ...q.skills } })),
    episodes: s.episodes.map((ep) =>
      isPass(ep)
        ? { ...ep }
        : {
            ...ep,
            placements: { ...ep.placements },
            eliminated: [...ep.eliminated],
          },
    ),
  };
}

function buildInitialSeasonsById(): Record<string, SeasonData> {
  const out: Record<string, SeasonData> = {};
  for (const preset of SEASON_PRESETS) {
    out[preset.id] = cloneSeason(preset.season);
  }
  return out;
}

const DEFAULT_ACTIVE_SEASON_ID = 'season5';

export const useStore = create<AppState>()(persist((set, get) => ({
  seasonsById: buildInitialSeasonsById(),
  activeSeasonId: DEFAULT_ACTIVE_SEASON_ID,
  currentEpisodeOverrides: {},

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

  numSimulations: 100_000,

  appMode: 'lip-syncs',
  enabledCalibrateSeasons: SEASON_PRESETS.map((p) => p.id),

  loadSeason: (seasonId) =>
    set((s) => {
      if (!s.seasonsById[seasonId]) return {};
      return {
        activeSeasonId: seasonId,
        currentEpisodeOverrides: {},
        selectedQueenId: null,
        conditions: [],
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
        trajectoryPaths: null,
        trajectoryTotalRuns: null,
      };
    }),

  updateQueenSkill: (seasonId, queenId, stat, value) =>
    set((s) => {
      const season = s.seasonsById[seasonId];
      if (!season) return {};
      const queens = season.queens.map((q) =>
        q.id === queenId ? { ...q, skills: { ...q.skills, [stat]: value } } : q,
      );
      return {
        seasonsById: { ...s.seasonsById, [seasonId]: { ...season, queens } },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  updateQueenLipSync: (seasonId, queenId, value) =>
    set((s) => {
      const season = s.seasonsById[seasonId];
      if (!season) return {};
      const queens = season.queens.map((q) =>
        q.id === queenId ? { ...q, lipSync: value } : q,
      );
      return {
        seasonsById: { ...s.seasonsById, [seasonId]: { ...season, queens } },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  updateEpisodeArchetype: (epIdx, archetype) =>
    set((s) => {
      const season = s.seasonsById[s.activeSeasonId];
      if (!season) return {};
      const target = season.episodes[epIdx];
      if (isFinale(target) || isPass(target)) return {};
      const episodes = season.episodes.map((ep, i) => {
        if (i !== epIdx || isFinale(ep) || isPass(ep)) return ep;
        // Changing archetype clears any per-episode weight override.
        const { weights: _drop, ...rest } = ep;
        void _drop;
        return { ...rest, archetype };
      });
      return {
        seasonsById: { ...s.seasonsById, [s.activeSeasonId]: { ...season, episodes } },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  updateEpisodeWeights: (epIdx, weights) =>
    set((s) => {
      const season = s.seasonsById[s.activeSeasonId];
      if (!season) return {};
      const target = season.episodes[epIdx];
      if (isFinale(target) || isPass(target)) return {};
      const episodes = season.episodes.map((ep, i) =>
        i === epIdx && !isFinale(ep) && !isPass(ep)
          ? { ...ep, weights: { ...weights } }
          : ep,
      );
      return {
        seasonsById: { ...s.seasonsById, [s.activeSeasonId]: { ...season, episodes } },
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  updateEpisodeOutcome: (epIdx, outcome) =>
    set((s) => ({
      currentEpisodeOverrides: {
        ...s.currentEpisodeOverrides,
        [epIdx]: {
          placements: { ...outcome.placements },
          eliminated: [...outcome.eliminated],
        },
      },
      filteredResults: null,
      filterMatchCount: null,
      filterTotalRuns: null,
    })),

  resetEpisode: (epIdx) =>
    set((s) => {
      if (!(epIdx in s.currentEpisodeOverrides)) return {};
      const next = { ...s.currentEpisodeOverrides };
      delete next[epIdx];
      return {
        currentEpisodeOverrides: next,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  resetAllEpisodes: () =>
    set(() => ({
      currentEpisodeOverrides: {},
      filteredResults: null,
      filterMatchCount: null,
      filterTotalRuns: null,
    })),

  reloadQueensFromSource: () =>
    set((s) => {
      const next: Record<string, SeasonData> = {};
      for (const preset of SEASON_PRESETS) {
        const existing = s.seasonsById[preset.id];
        next[preset.id] = existing
          ? { ...existing, queens: preset.season.queens.map((q) => ({ ...q, skills: { ...q.skills } })) }
          : cloneSeason(preset.season);
      }
      return {
        seasonsById: next,
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  resetQueenColors: () =>
    set((s) => {
      const next: Record<string, SeasonData> = { ...s.seasonsById };
      for (const preset of SEASON_PRESETS) {
        const existing = next[preset.id];
        if (!existing) continue;
        const sourceColorById = new Map(preset.season.queens.map((q) => [q.id, q.color]));
        const queens = existing.queens.map((q) => {
          const sourceColor = sourceColorById.get(q.id);
          return sourceColor === undefined ? q : { ...q, color: sourceColor };
        });
        next[preset.id] = { ...existing, queens };
      }
      return { seasonsById: next };
    }),

  reloadSeasonsFromSource: () =>
    set((s) => {
      const next: Record<string, SeasonData> = {};
      for (const preset of SEASON_PRESETS) {
        const existing = s.seasonsById[preset.id];
        next[preset.id] = existing
          ? {
              ...existing,
              name: preset.season.name,
              episodes: preset.season.episodes.map((ep) =>
                isPass(ep)
                  ? { ...ep }
                  : {
                      ...ep,
                      placements: { ...ep.placements },
                      eliminated: [...ep.eliminated],
                    },
              ),
            }
          : cloneSeason(preset.season);
      }
      return {
        seasonsById: next,
        currentEpisodeOverrides: {},
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    }),

  importQueensJson: (parsed) => {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
    const entries = parsed as Record<string, { queens?: Queen[] }>;
    // Validate shape before mutating.
    for (const [, season] of Object.entries(entries)) {
      if (!season || typeof season !== 'object' || !Array.isArray(season.queens)) return false;
    }
    set((s) => {
      const next = { ...s.seasonsById };
      for (const [seasonId, season] of Object.entries(entries)) {
        const existing = next[seasonId];
        if (!existing) continue;
        const queens = (season.queens ?? []).map((q) => ({
          ...q,
          skills: { ...q.skills },
        }));
        next[seasonId] = { ...existing, queens };
      }
      return {
        seasonsById: next,
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    });
    return true;
  },

  exportQueensJson: () => {
    const { seasonsById } = get();
    const out: Record<string, { name: string; queens: Queen[] }> = {};
    for (const [seasonId, season] of Object.entries(seasonsById)) {
      out[seasonId] = {
        name: season.name,
        queens: season.queens.map((q) => ({
          id: q.id,
          name: q.name,
          skills: { ...q.skills },
          lipSync: q.lipSync,
          color: q.color,
        })),
      };
    }
    return JSON.stringify(out, null, 2);
  },

  importSeasonsJson: (parsed) => {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
    const entries = parsed as Record<string, SeasonData>;
    for (const [, season] of Object.entries(entries)) {
      if (
        !season ||
        typeof season !== 'object' ||
        !Array.isArray(season.queens) ||
        !Array.isArray(season.episodes)
      ) return false;
    }
    set((s) => {
      const next = { ...s.seasonsById };
      for (const [seasonId, season] of Object.entries(entries)) {
        next[seasonId] = cloneSeason(season);
      }
      return {
        seasonsById: next,
        currentEpisodeOverrides: {},
        baselineResults: null,
        filteredResults: null,
        filterMatchCount: null,
        filterTotalRuns: null,
      };
    });
    return true;
  },

  exportSeasonsJson: () => {
    const { seasonsById } = get();
    return JSON.stringify(seasonsById, null, 2);
  },

  setBaselineResults: (results) => set({ baselineResults: results }),
  setFilteredResults: (results, matchCount, totalRuns) =>
    set({ filteredResults: results, filterMatchCount: matchCount, filterTotalRuns: totalRuns }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationProgress: (pct) => set({ simulationProgress: pct }),
  setSelectedQueenId: (queenId) =>
    set((s) => ({ selectedQueenId: s.selectedQueenId === queenId ? null : queenId })),
  setTrajectoryPaths: (paths, totalRuns) =>
    set({ trajectoryPaths: paths, trajectoryTotalRuns: totalRuns }),

  setNumSimulations: (n) => set({ numSimulations: n }),

  setAppMode: (mode) => set({ appMode: mode }),

  toggleCalibrateSeason: (seasonId) =>
    set((s) => {
      const has = s.enabledCalibrateSeasons.includes(seasonId);
      return {
        enabledCalibrateSeasons: has
          ? s.enabledCalibrateSeasons.filter((id) => id !== seasonId)
          : [...s.enabledCalibrateSeasons, seasonId],
      };
    }),

  setEnabledCalibrateSeasons: (seasonIds) => set({ enabledCalibrateSeasons: seasonIds }),

  addCondition: (c) =>
    set((s) => {
      const filtered = s.conditions.filter(
        (existing) =>
          !(existing.episodeIndex === c.episodeIndex && existing.queenIndex === c.queenIndex),
      );
      return { conditions: [...filtered, c] };
    }),

  removeCondition: (episodeIndex, queenIndex) =>
    set((s) => ({
      conditions: s.conditions.filter(
        (c) => !(c.episodeIndex === episodeIndex && c.queenIndex === queenIndex),
      ),
    })),

  clearConditions: () =>
    set({ conditions: [], filteredResults: null, filterMatchCount: null, filterTotalRuns: null }),
}), {
  name: 'rpdr-sim-store',
  version: 2,
  storage: createJSONStorage(() => localStorage),
  migrate: migrateToV2,
  partialize: (s) => ({
    seasonsById: s.seasonsById,
    activeSeasonId: s.activeSeasonId,
    currentEpisodeOverrides: s.currentEpisodeOverrides,
    enabledCalibrateSeasons: s.enabledCalibrateSeasons,
    numSimulations: s.numSimulations,
  }),
}));

/** Re-export for convenience; `EpisodeData` used widely by consumers. */
export type { EpisodeData };
