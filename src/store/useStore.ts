import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  EpisodeData, Queen, Placement, SimulationResults,
  FilterCondition, TrajectoryPath, BaseStat,
} from '../engine/types';
import { isFinale, isPass, queenUid } from '../engine/types';
import { type ArchetypeId } from '../data/archetypes';
import { SEASON_PRESETS } from '../data/presets';
import { migrateToV2, migrateToV3, migrateToV4 } from './migrate';

export interface EpisodeOverride {
  placements: Record<string, Placement>;
  eliminated: string[];
}

/** Conceptual layout:
 *
 *  Datastore (canonical, persisted): single source of truth for queen stats
 *  and per-season cast composition + episode list. Calibrate writes here.
 *    - queensById       — every queen by composite key (homeSeason:queenId)
 *    - casts            — per-season queen-key arrays; the canonical cast
 *    - episodeLists     — per-season episode arrays
 *    - seasonsMeta      — display metadata (name) per season
 *
 *  Session (also persisted): the cast/episodes currently loaded into the sim.
 *  Cast Editor and Timeline write here, NOT to the datastore. Switching
 *  seasons reseeds session state from the datastore, discarding in-flight
 *  cast/episode edits.
 *    - currentCast              — C: queen keys driving the active sim
 *    - currentEpisodes          — E: episode metadata driving the active sim
 *    - currentEpisodeOverrides  — what-if placement/elim overlays on top of E
 */
export interface AppState {
  // Datastore (canonical)
  queensById: Record<string, Queen>;
  casts: Record<string, string[]>;
  episodeLists: Record<string, EpisodeData[]>;
  seasonsMeta: Record<string, { name: string }>;

  // Session
  activeSeasonId: string;
  currentCast: string[];
  currentEpisodes: EpisodeData[];
  currentEpisodeOverrides: Record<number, EpisodeOverride>;

  // Sim run state (ephemeral)
  conditions: FilterCondition[];
  baselineResults: SimulationResults | null;
  /** Counterfactual baseline ran at riggory=0, same seed as `baselineResults`,
   *  used by the flow chart to size the rigged-flow overlay. Null when
   *  riggory === 0 (the delta is trivially zero). */
  baselineR0Results: SimulationResults | null;
  filteredResults: SimulationResults | null;
  filterMatchCount: number | null;
  filterTotalRuns: number | null;
  isSimulating: boolean;
  simulationProgress: number | null;
  selectedQueenId: string | null;
  trajectoryPaths: TrajectoryPath[] | null;
  trajectoryTotalRuns: number | null;

  numSimulations: number;
  /** 0..1 — biases lip syncs toward the season's frontrunner. See
   *  RunBaselineOptions.riggory. */
  riggory: number;

  // UI preferences
  appMode: 'simulation' | 'calibrate' | 'data' | 'lip-syncs';
  enabledCalibrateSeasons: string[];

  // Datastore (queen stats) — calibrate writes here
  updateQueenSkill: (queenKey: string, stat: BaseStat, value: number) => void;
  updateQueenLipSync: (queenKey: string, value: number) => void;

  // Session — cast and episodes
  loadSeason: (seasonId: string) => void;
  setCurrentCast: (queenKeys: string[]) => void;
  updateEpisodeArchetype: (epIdx: number, archetype: ArchetypeId) => void;
  updateEpisodeWeights: (epIdx: number, weights: Record<BaseStat, number>) => void;
  updateEpisodeImmunity: (epIdx: number, value: boolean) => void;
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
  setBaselineR0Results: (results: SimulationResults | null) => void;
  setSimulationProgress: (pct: number | null) => void;
  setFilteredResults: (results: SimulationResults | null, matchCount: number | null, totalRuns: number | null) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSelectedQueenId: (queenId: string | null) => void;
  setTrajectoryPaths: (paths: TrajectoryPath[] | null, totalRuns: number | null) => void;
  setNumSimulations: (n: number) => void;
  setRiggory: (r: number) => void;

  // UI
  setAppMode: (mode: 'simulation' | 'calibrate' | 'data' | 'lip-syncs') => void;
  toggleCalibrateSeason: (seasonId: string) => void;
  setEnabledCalibrateSeasons: (seasonIds: string[]) => void;

  // Filters
  addCondition: (c: FilterCondition) => void;
  removeCondition: (episodeIndex: number, queenIndex: number, placement?: number) => void;
  clearConditions: () => void;
}

const RESULT_INVALIDATIONS = {
  baselineResults: null,
  baselineR0Results: null,
  filteredResults: null,
  filterMatchCount: null,
  filterTotalRuns: null,
  trajectoryPaths: null,
  trajectoryTotalRuns: null,
} as const;

function cloneEpisode(ep: EpisodeData): EpisodeData {
  if (isPass(ep)) return { ...ep };
  return {
    ...ep,
    placements: { ...ep.placements },
    eliminated: [...ep.eliminated],
  };
}

function buildInitialDatastore(): {
  queensById: Record<string, Queen>;
  casts: Record<string, string[]>;
  episodeLists: Record<string, EpisodeData[]>;
  seasonsMeta: Record<string, { name: string }>;
} {
  const queensById: Record<string, Queen> = {};
  const casts: Record<string, string[]> = {};
  const episodeLists: Record<string, EpisodeData[]> = {};
  const seasonsMeta: Record<string, { name: string }> = {};
  for (const preset of SEASON_PRESETS) {
    casts[preset.id] = [];
    for (const q of preset.season.queens) {
      const key = queenUid(preset.id, q.id);
      queensById[key] = { ...q, skills: { ...q.skills } };
      casts[preset.id].push(key);
    }
    episodeLists[preset.id] = preset.season.episodes.map(cloneEpisode);
    seasonsMeta[preset.id] = { name: preset.season.name };
  }
  return { queensById, casts, episodeLists, seasonsMeta };
}

const DEFAULT_ACTIVE_SEASON_ID = 'season5';

function initialSession(
  activeSeasonId: string,
  casts: Record<string, string[]>,
  episodeLists: Record<string, EpisodeData[]>,
): { currentCast: string[]; currentEpisodes: EpisodeData[] } {
  return {
    currentCast: [...(casts[activeSeasonId] ?? [])],
    currentEpisodes: (episodeLists[activeSeasonId] ?? []).map(cloneEpisode),
  };
}

export const useStore = create<AppState>()(persist((set, get) => {
  const initial = buildInitialDatastore();
  const session = initialSession(DEFAULT_ACTIVE_SEASON_ID, initial.casts, initial.episodeLists);

  // Helper: rebuild session for a (possibly new) active season. Used by
  // loadSeason and by the canonical reload paths so the sim's loaded state
  // always agrees with the datastore right after a reseed.
  const reseedSession = (s: AppState, seasonId: string) => initialSession(seasonId, s.casts, s.episodeLists);

  return {
    ...initial,
    activeSeasonId: DEFAULT_ACTIVE_SEASON_ID,
    currentCast: session.currentCast,
    currentEpisodes: session.currentEpisodes,
    currentEpisodeOverrides: {},

    conditions: [],
    baselineResults: null,
    baselineR0Results: null,
    filteredResults: null,
    filterMatchCount: null,
    filterTotalRuns: null,
    isSimulating: false,
    simulationProgress: null,
    selectedQueenId: null,
    trajectoryPaths: null,
    trajectoryTotalRuns: null,

    numSimulations: 100_000,
    riggory: 0,

    appMode: 'simulation',
    enabledCalibrateSeasons: SEASON_PRESETS.map((p) => p.id),

    // ── Datastore: queen stats (calibrate writes through here) ──

    updateQueenSkill: (queenKey, stat, value) =>
      set((s) => {
        const q = s.queensById[queenKey];
        if (!q) return {};
        return {
          queensById: { ...s.queensById, [queenKey]: { ...q, skills: { ...q.skills, [stat]: value } } },
          ...RESULT_INVALIDATIONS,
        };
      }),

    updateQueenLipSync: (queenKey, value) =>
      set((s) => {
        const q = s.queensById[queenKey];
        if (!q) return {};
        return {
          queensById: { ...s.queensById, [queenKey]: { ...q, lipSync: value } },
          ...RESULT_INVALIDATIONS,
        };
      }),

    // ── Session: cast + episodes (cast editor / timeline write here) ──

    loadSeason: (seasonId) =>
      set((s) => {
        if (!s.casts[seasonId]) return {};
        return {
          activeSeasonId: seasonId,
          ...reseedSession(s, seasonId),
          currentEpisodeOverrides: {},
          selectedQueenId: null,
          conditions: [],
          ...RESULT_INVALIDATIONS,
        };
      }),

    setCurrentCast: (queenKeys) =>
      set(() => ({
        currentCast: [...queenKeys],
        currentEpisodeOverrides: {},
        selectedQueenId: null,
        conditions: [],
        ...RESULT_INVALIDATIONS,
      })),

    updateEpisodeArchetype: (epIdx, archetype) =>
      set((s) => {
        const target = s.currentEpisodes[epIdx];
        if (!target || isFinale(target) || isPass(target)) return {};
        const episodes = s.currentEpisodes.map((ep, i) => {
          if (i !== epIdx || isFinale(ep) || isPass(ep)) return ep;
          // Changing archetype clears any per-episode weights override.
          const { weights: _drop, ...rest } = ep;
          void _drop;
          return { ...rest, archetype };
        });
        return { currentEpisodes: episodes, ...RESULT_INVALIDATIONS };
      }),

    updateEpisodeWeights: (epIdx, weights) =>
      set((s) => {
        const target = s.currentEpisodes[epIdx];
        if (!target || isFinale(target) || isPass(target)) return {};
        const episodes = s.currentEpisodes.map((ep, i) =>
          i === epIdx && !isFinale(ep) && !isPass(ep)
            ? { ...ep, weights: { ...weights } }
            : ep,
        );
        return { currentEpisodes: episodes, ...RESULT_INVALIDATIONS };
      }),

    updateEpisodeImmunity: (epIdx, value) =>
      set((s) => {
        const target = s.currentEpisodes[epIdx];
        if (!target || isFinale(target) || isPass(target)) return {};
        const episodes = s.currentEpisodes.map((ep, i) =>
          i === epIdx && !isFinale(ep) && !isPass(ep)
            ? { ...ep, grantsImmunity: value }
            : ep,
        );
        return { currentEpisodes: episodes, ...RESULT_INVALIDATIONS };
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

    // ── Data tab: bulk reset / import / export ──

    reloadQueensFromSource: () =>
      set(() => {
        const next: Record<string, Queen> = {};
        for (const preset of SEASON_PRESETS) {
          for (const q of preset.season.queens) {
            next[queenUid(preset.id, q.id)] = { ...q, skills: { ...q.skills } };
          }
        }
        return { queensById: next, ...RESULT_INVALIDATIONS };
      }),

    resetQueenColors: () =>
      set((s) => {
        const next = { ...s.queensById };
        for (const preset of SEASON_PRESETS) {
          for (const presetQ of preset.season.queens) {
            const key = queenUid(preset.id, presetQ.id);
            const live = next[key];
            if (live) next[key] = { ...live, color: presetQ.color };
          }
        }
        return { queensById: next };
      }),

    reloadSeasonsFromSource: () =>
      set((s) => {
        const nextEpisodeLists: Record<string, EpisodeData[]> = {};
        const nextCasts: Record<string, string[]> = {};
        const nextMeta: Record<string, { name: string }> = {};
        for (const preset of SEASON_PRESETS) {
          nextEpisodeLists[preset.id] = preset.season.episodes.map(cloneEpisode);
          nextCasts[preset.id] = preset.season.queens.map((q) => queenUid(preset.id, q.id));
          nextMeta[preset.id] = { name: preset.season.name };
        }
        // Reseed session from the canonical version of the active season.
        const activeSeasonId = nextCasts[s.activeSeasonId] ? s.activeSeasonId : DEFAULT_ACTIVE_SEASON_ID;
        return {
          casts: nextCasts,
          episodeLists: nextEpisodeLists,
          seasonsMeta: nextMeta,
          activeSeasonId,
          currentCast: [...nextCasts[activeSeasonId]],
          currentEpisodes: nextEpisodeLists[activeSeasonId].map(cloneEpisode),
          currentEpisodeOverrides: {},
          ...RESULT_INVALIDATIONS,
        };
      }),

    importQueensJson: (parsed) => {
      // The on-the-wire shape stays grouped by seasonId for backward
      // compatibility — we destructure into queen keys at the import boundary.
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
      const entries = parsed as Record<string, { queens?: Queen[] }>;
      for (const [, season] of Object.entries(entries)) {
        if (!season || typeof season !== 'object' || !Array.isArray(season.queens)) return false;
      }
      set((s) => {
        const next = { ...s.queensById };
        for (const [seasonId, season] of Object.entries(entries)) {
          for (const q of season.queens ?? []) {
            const key = queenUid(seasonId, q.id);
            // Only update queens we know about (the registry was seeded from
            // SEASON_PRESETS — unknown ids are silently dropped, same as
            // before when they had no corresponding seasonsById entry).
            if (next[key] !== undefined) {
              next[key] = { ...next[key], ...q, skills: { ...q.skills } };
            }
          }
        }
        return { queensById: next, ...RESULT_INVALIDATIONS };
      });
      return true;
    },

    exportQueensJson: () => {
      const { queensById, casts, seasonsMeta } = get();
      const out: Record<string, { name: string; queens: Queen[] }> = {};
      for (const seasonId of Object.keys(casts)) {
        // Build the export list from the season's PRESET roster — queen IDs
        // are stable on disk regardless of any custom-cast composition.
        const preset = SEASON_PRESETS.find((p) => p.id === seasonId);
        if (!preset) continue;
        out[seasonId] = {
          name: seasonsMeta[seasonId]?.name ?? preset.season.name,
          queens: preset.season.queens
            .map((presetQ) => queensById[queenUid(seasonId, presetQ.id)])
            .filter((q): q is Queen => q !== undefined)
            .map((q) => ({
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
      // On-the-wire shape: SeasonData per season (mirrors the legacy export
      // for compatibility). Internally we shred into casts / episodeLists /
      // queensById.
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
      const entries = parsed as Record<string, { id?: string; name?: string; queens?: Queen[]; episodes?: EpisodeData[] }>;
      for (const [, season] of Object.entries(entries)) {
        if (
          !season ||
          typeof season !== 'object' ||
          !Array.isArray(season.queens) ||
          !Array.isArray(season.episodes)
        ) return false;
      }
      set((s) => {
        const nextQueens = { ...s.queensById };
        const nextCasts = { ...s.casts };
        const nextEpisodes = { ...s.episodeLists };
        const nextMeta = { ...s.seasonsMeta };
        for (const [seasonId, season] of Object.entries(entries)) {
          const queens = (season.queens ?? []).map((q) => ({ ...q, skills: { ...q.skills } }));
          for (const q of queens) {
            nextQueens[queenUid(seasonId, q.id)] = q;
          }
          nextCasts[seasonId] = queens.map((q) => queenUid(seasonId, q.id));
          nextEpisodes[seasonId] = (season.episodes ?? []).map(cloneEpisode);
          nextMeta[seasonId] = { name: season.name ?? seasonId };
        }
        const activeSeasonId = nextCasts[s.activeSeasonId] ? s.activeSeasonId : DEFAULT_ACTIVE_SEASON_ID;
        return {
          queensById: nextQueens,
          casts: nextCasts,
          episodeLists: nextEpisodes,
          seasonsMeta: nextMeta,
          activeSeasonId,
          currentCast: [...(nextCasts[activeSeasonId] ?? [])],
          currentEpisodes: (nextEpisodes[activeSeasonId] ?? []).map(cloneEpisode),
          currentEpisodeOverrides: {},
          ...RESULT_INVALIDATIONS,
        };
      });
      return true;
    },

    exportSeasonsJson: () => {
      const { queensById, casts, episodeLists, seasonsMeta } = get();
      const out: Record<string, { id: string; name: string; queens: Queen[]; episodes: EpisodeData[] }> = {};
      for (const seasonId of Object.keys(casts)) {
        const queens = casts[seasonId]
          .map((k) => queensById[k])
          .filter((q): q is Queen => q !== undefined);
        out[seasonId] = {
          id: seasonId,
          name: seasonsMeta[seasonId]?.name ?? seasonId,
          queens,
          episodes: episodeLists[seasonId] ?? [],
        };
      }
      return JSON.stringify(out, null, 2);
    },

    setBaselineResults: (results) => set({ baselineResults: results }),
    setBaselineR0Results: (results) => set({ baselineR0Results: results }),
    setFilteredResults: (results, matchCount, totalRuns) =>
      set({ filteredResults: results, filterMatchCount: matchCount, filterTotalRuns: totalRuns }),
    setIsSimulating: (isSimulating) => set({ isSimulating }),
    setSimulationProgress: (pct) => set({ simulationProgress: pct }),
    setSelectedQueenId: (queenId) =>
      set((s) => ({ selectedQueenId: s.selectedQueenId === queenId ? null : queenId })),
    setTrajectoryPaths: (paths, totalRuns) =>
      set({ trajectoryPaths: paths, trajectoryTotalRuns: totalRuns }),

    setNumSimulations: (n) => set({ numSimulations: n }),
    setRiggory: (r) => set({ riggory: Math.max(0, Math.min(1, r)) }),

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
        const newMode = c.mode ?? 'include';
        const filtered = s.conditions.filter((e) => {
          if (e.episodeIndex !== c.episodeIndex || e.queenIndex !== c.queenIndex) return true;
          // Includes and excludes never mix at the same (queen, episode).
          // Adding an include clears every existing condition there; adding an
          // exclude evicts any include and dedups against another exclude on
          // the same exact placement.
          if (newMode === 'include') return false;
          const eMode = e.mode ?? 'include';
          if (eMode === 'include') return false;
          return e.placement !== c.placement;
        });
        return { conditions: [...filtered, c] };
      }),

    removeCondition: (episodeIndex, queenIndex, placement) =>
      set((s) => ({
        conditions: s.conditions.filter(
          (c) =>
            !(
              c.episodeIndex === episodeIndex &&
              c.queenIndex === queenIndex &&
              (placement === undefined || c.placement === placement)
            ),
        ),
      })),

    clearConditions: () =>
      set({ conditions: [], filteredResults: null, filterMatchCount: null, filterTotalRuns: null }),
  };
}, {
  name: 'rpdr-sim-store',
  version: 4,
  storage: createJSONStorage(() => localStorage),
  migrate: (persisted, version) => {
    let p: unknown = persisted;
    if (version < 2) p = migrateToV2(p, version);
    if (p && version < 3) p = migrateToV3(p);
    if (p && version < 4) p = migrateToV4(p);
    return p;
  },
  partialize: (s) => ({
    queensById: s.queensById,
    casts: s.casts,
    episodeLists: s.episodeLists,
    seasonsMeta: s.seasonsMeta,
    activeSeasonId: s.activeSeasonId,
    currentCast: s.currentCast,
    currentEpisodes: s.currentEpisodes,
    currentEpisodeOverrides: s.currentEpisodeOverrides,
    enabledCalibrateSeasons: s.enabledCalibrateSeasons,
    numSimulations: s.numSimulations,
    riggory: s.riggory,
  }),
}));

/** Re-export for convenience; `EpisodeData` used widely by consumers. */
export type { EpisodeData };
