import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';
import { selectBaselineSeason, selectCurrentSeason } from './selectors';
import { migrateToV2, migrateToV3 } from './migrate';
import { SEASON_PRESETS } from '../data/presets';
import { isRegular } from '../engine/types';
import type { FilterCondition } from '../engine/types';

beforeEach(() => {
  // Reset store to initial state before each test
  useStore.setState(useStore.getInitialState());
});

describe('fresh init', () => {
  test('seasonsById contains every SEASON_PRESETS season with queens matching .ts source', () => {
    const { seasonsById } = useStore.getState();
    for (const preset of SEASON_PRESETS) {
      const season = seasonsById[preset.id];
      expect(season).toBeDefined();
      expect(season.id).toBe(preset.season.id);
      expect(season.name).toBe(preset.season.name);
      expect(season.queens).toHaveLength(preset.season.queens.length);
      // Guard against zero-stat-ghost regression — deep-equal skills against source
      for (let i = 0; i < preset.season.queens.length; i++) {
        expect(season.queens[i].skills).toEqual(preset.season.queens[i].skills);
        expect(season.queens[i].lipSync).toBe(preset.season.queens[i].lipSync);
      }
    }
  });

  test('activeSeasonId is season5 and currentEpisodeOverrides is empty', () => {
    const { activeSeasonId, currentEpisodeOverrides } = useStore.getState();
    expect(activeSeasonId).toBe('season5');
    expect(currentEpisodeOverrides).toEqual({});
  });
});

describe('selectCurrentSeason', () => {
  test('returns seasonsById[activeSeasonId] structurally when overrides are empty', () => {
    const s = useStore.getState();
    const current = selectCurrentSeason(s);
    const base = s.seasonsById[s.activeSeasonId];
    expect(current.id).toBe(base.id);
    expect(current.queens).toEqual(base.queens);
    expect(current.episodes).toEqual(base.episodes);
  });

  test('applies override to correct episode index without mutating seasonsById', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const originalEp3 = useStore.getState().seasonsById['season5'].episodes[3];
    updateEpisodeOutcome(3, {
      placements: { jinkx: 'WIN' },
      eliminated: ['roxxxy'],
    });
    const s = useStore.getState();
    const current = selectCurrentSeason(s);
    // Overridden ep has new placements / eliminated
    const overridden = current.episodes[3];
    if (!isRegular(overridden)) throw new Error('expected regular episode at index 3');
    expect(overridden.placements).toEqual({ jinkx: 'WIN' });
    expect(overridden.eliminated).toEqual(['roxxxy']);
    // Other episodes unchanged
    expect(current.episodes[0]).toEqual(s.seasonsById['season5'].episodes[0]);
    // seasonsById itself untouched
    expect(s.seasonsById['season5'].episodes[3]).toEqual(originalEp3);
  });
});

describe('updateQueenSkill', () => {
  test('updates the right season and queen only', () => {
    const { updateQueenSkill } = useStore.getState();
    updateQueenSkill('season5', 'jinkx', 'improv', 1);
    const { seasonsById } = useStore.getState();
    const jinkx = seasonsById['season5'].queens.find((q) => q.id === 'jinkx')!;
    expect(jinkx.skills.improv).toBe(1);
    // Other queens in s5 unchanged
    const alaska = seasonsById['season5'].queens.find((q) => q.id === 'alaska')!;
    const alaskaSrc = SEASON_PRESETS.find((p) => p.id === 'season5')!.season.queens.find(
      (q) => q.id === 'alaska',
    )!;
    expect(alaska.skills).toEqual(alaskaSrc.skills);
    // s10 untouched
    const s10 = seasonsById['season10'];
    const s10Src = SEASON_PRESETS.find((p) => p.id === 'season10')!.season;
    for (let i = 0; i < s10.queens.length; i++) {
      expect(s10.queens[i].skills).toEqual(s10Src.queens[i].skills);
    }
  });

  test('updating vanjie in season10 does not touch vanjie in season11', () => {
    const { updateQueenSkill } = useStore.getState();
    updateQueenSkill('season10', 'vanjie', 'comedy', 1);
    const { seasonsById } = useStore.getState();
    const s10Vanjie = seasonsById['season10'].queens.find((q) => q.id === 'vanjie')!;
    const s11Vanjie = seasonsById['season11'].queens.find((q) => q.id === 'vanjie')!;
    expect(s10Vanjie.skills.comedy).toBe(1);
    const s11VanjieSrc = SEASON_PRESETS.find((p) => p.id === 'season11')!.season.queens.find(
      (q) => q.id === 'vanjie',
    )!;
    expect(s11Vanjie.skills.comedy).toBe(s11VanjieSrc.skills.comedy);
  });

  test('clears baselineResults and filteredResults', () => {
    const fakeResults = {
      numSimulations: 1,
      winProbByEpisode: [],
      aliveProbByEpisode: [],
      elimProbByEpisode: [],
      placementDist: {},
      reachedFinaleProb: {},
      winProb: {},
      episodePlacements: [],
    };
    useStore.setState({
      baselineResults: fakeResults,
      filteredResults: fakeResults,
      filterMatchCount: 10,
      filterTotalRuns: 100,
    });
    useStore.getState().updateQueenSkill('season5', 'jinkx', 'improv', 5);
    const s = useStore.getState();
    expect(s.baselineResults).toBeNull();
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
  });
});

describe('updateQueenLipSync', () => {
  test('updates the right season and queen only', () => {
    const { updateQueenLipSync } = useStore.getState();
    updateQueenLipSync('season10', 'vanjie', 10);
    const { seasonsById } = useStore.getState();
    const s10Vanjie = seasonsById['season10'].queens.find((q) => q.id === 'vanjie')!;
    const s11Vanjie = seasonsById['season11'].queens.find((q) => q.id === 'vanjie')!;
    expect(s10Vanjie.lipSync).toBe(10);
    const s11VanjieSrc = SEASON_PRESETS.find((p) => p.id === 'season11')!.season.queens.find(
      (q) => q.id === 'vanjie',
    )!;
    expect(s11Vanjie.lipSync).toBe(s11VanjieSrc.lipSync);
  });
});

describe('episode overrides', () => {
  test('updateEpisodeOutcome writes to currentEpisodeOverrides without touching seasonsById', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const before = useStore.getState().seasonsById['season5'].episodes[3];
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: ['roxxxy'] });
    const s = useStore.getState();
    expect(s.currentEpisodeOverrides[3]).toEqual({
      placements: { jinkx: 'WIN' },
      eliminated: ['roxxxy'],
    });
    expect(s.seasonsById['season5'].episodes[3]).toEqual(before);
  });

  test('resetEpisode removes only that index', () => {
    const { updateEpisodeOutcome, resetEpisode } = useStore.getState();
    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' }, eliminated: [] });
    updateEpisodeOutcome(3, { placements: { alaska: 'WIN' }, eliminated: [] });
    resetEpisode(0);
    const { currentEpisodeOverrides } = useStore.getState();
    expect(currentEpisodeOverrides[0]).toBeUndefined();
    expect(currentEpisodeOverrides[3]).toEqual({
      placements: { alaska: 'WIN' },
      eliminated: [],
    });
  });

  test('resetAllEpisodes empties overrides', () => {
    const { updateEpisodeOutcome, resetAllEpisodes } = useStore.getState();
    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' }, eliminated: [] });
    updateEpisodeOutcome(3, { placements: { alaska: 'WIN' }, eliminated: [] });
    resetAllEpisodes();
    expect(useStore.getState().currentEpisodeOverrides).toEqual({});
  });

  test('updateEpisodeOutcome preserves challenge metadata via selector', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const origEp = useStore.getState().seasonsById['season5'].episodes[0];
    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' }, eliminated: [] });
    const updatedEp = selectCurrentSeason(useStore.getState()).episodes[0];
    expect(updatedEp.number).toBe(origEp.number);
    expect(isRegular(updatedEp)).toBe(true);
    expect(isRegular(origEp)).toBe(true);
    if (isRegular(updatedEp) && isRegular(origEp)) {
      expect(updatedEp.archetype).toBe(origEp.archetype);
    }
    expect(updatedEp.challengeName).toBe(origEp.challengeName);
  });
});

describe('loadSeason', () => {
  test('sets activeSeasonId, clears overrides + selection + sim results + conditions', () => {
    const {
      updateEpisodeOutcome,
      setSelectedQueenId,
      addCondition,
      setBaselineResults,
      setFilteredResults,
      loadSeason,
    } = useStore.getState();

    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' }, eliminated: [] });
    setSelectedQueenId('jinkx');
    addCondition({ episodeIndex: 0, queenIndex: 0, placement: 0 });
    const fake = {
      numSimulations: 1,
      winProbByEpisode: [],
      aliveProbByEpisode: [],
      elimProbByEpisode: [],
      placementDist: {},
      reachedFinaleProb: {},
      winProb: {},
      episodePlacements: [],
    };
    setBaselineResults(fake);
    setFilteredResults(fake, 1, 1);

    loadSeason('season3');
    const s = useStore.getState();
    expect(s.activeSeasonId).toBe('season3');
    expect(s.currentEpisodeOverrides).toEqual({});
    expect(s.selectedQueenId).toBeNull();
    expect(s.baselineResults).toBeNull();
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
    expect(s.conditions).toEqual([]);
  });

  test('no-ops on unknown season id', () => {
    const { loadSeason } = useStore.getState();
    const before = useStore.getState().activeSeasonId;
    loadSeason('nonexistent');
    expect(useStore.getState().activeSeasonId).toBe(before);
  });
});

describe('reload from source', () => {
  test('reloadQueensFromSource restores queens but preserves episode overrides', () => {
    const { updateQueenSkill, updateEpisodeOutcome, reloadQueensFromSource } = useStore.getState();
    updateQueenSkill('season5', 'jinkx', 'improv', 1);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    reloadQueensFromSource();

    const s = useStore.getState();
    // All queens restored to source across every season
    for (const preset of SEASON_PRESETS) {
      const season = s.seasonsById[preset.id];
      for (let i = 0; i < preset.season.queens.length; i++) {
        expect(season.queens[i].skills).toEqual(preset.season.queens[i].skills);
        expect(season.queens[i].lipSync).toBe(preset.season.queens[i].lipSync);
      }
    }
    // Episode overrides preserved
    expect(s.currentEpisodeOverrides[3]).toEqual({
      placements: { jinkx: 'WIN' },
      eliminated: [],
    });
  });

  test('reloadSeasonsFromSource restores episodes, preserves queens, clears overrides', () => {
    const { updateQueenSkill, updateEpisodeOutcome, reloadSeasonsFromSource } = useStore.getState();
    updateQueenSkill('season5', 'jinkx', 'improv', 1);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    reloadSeasonsFromSource();

    const s = useStore.getState();
    // Queens preserved
    const jinkx = s.seasonsById['season5'].queens.find((q) => q.id === 'jinkx')!;
    expect(jinkx.skills.improv).toBe(1);
    // Episodes restored
    for (const preset of SEASON_PRESETS) {
      const season = s.seasonsById[preset.id];
      for (let i = 0; i < preset.season.episodes.length; i++) {
        const got = season.episodes[i];
        const want = preset.season.episodes[i];
        if (!isRegular(got) || !isRegular(want)) continue;
        expect(got.placements).toEqual(want.placements);
        expect(got.eliminated).toEqual(want.eliminated);
      }
    }
    // Overrides cleared
    expect(s.currentEpisodeOverrides).toEqual({});
  });
});

describe('resetQueenColors', () => {
  test('restores colors from source while preserving skills, lipSync, and episode overrides', () => {
    const { updateQueenSkill, updateQueenLipSync, updateEpisodeOutcome, resetQueenColors } =
      useStore.getState();

    // Edit a skill, lipSync, and an episode override — none of these should be touched.
    updateQueenSkill('season5', 'jinkx', 'improv', 1);
    updateQueenLipSync('season5', 'jinkx', 2);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    // Mutate colors across two seasons.
    useStore.setState((s) => ({
      seasonsById: {
        ...s.seasonsById,
        season5: {
          ...s.seasonsById['season5'],
          queens: s.seasonsById['season5'].queens.map((q) => ({ ...q, color: '#123456' })),
        },
        season10: {
          ...s.seasonsById['season10'],
          queens: s.seasonsById['season10'].queens.map((q) => ({ ...q, color: '#abcdef' })),
        },
      },
    }));

    resetQueenColors();

    const s = useStore.getState();
    // Colors restored across every season
    for (const preset of SEASON_PRESETS) {
      const season = s.seasonsById[preset.id];
      for (const srcQ of preset.season.queens) {
        const got = season.queens.find((q) => q.id === srcQ.id)!;
        expect(got.color).toBe(srcQ.color);
      }
    }
    // Skills & lipSync preserved
    const jinkx = s.seasonsById['season5'].queens.find((q) => q.id === 'jinkx')!;
    expect(jinkx.skills.improv).toBe(1);
    expect(jinkx.lipSync).toBe(2);
    // Episode overrides preserved
    expect(s.currentEpisodeOverrides[3]).toEqual({
      placements: { jinkx: 'WIN' },
      eliminated: [],
    });
  });

  test('does not invalidate sim results (colors do not affect outcomes)', () => {
    const fake = {
      numSimulations: 1, winProbByEpisode: [], aliveProbByEpisode: [],
      elimProbByEpisode: [], placementDist: {}, reachedFinaleProb: {},
      winProb: {}, episodePlacements: [],
    };
    useStore.setState({
      baselineResults: fake,
      filteredResults: fake,
      filterMatchCount: 10,
      filterTotalRuns: 100,
    });
    useStore.getState().resetQueenColors();
    const s = useStore.getState();
    expect(s.baselineResults).toBe(fake);
    expect(s.filteredResults).toBe(fake);
    expect(s.filterMatchCount).toBe(10);
    expect(s.filterTotalRuns).toBe(100);
  });
});

describe('import/export queens JSON', () => {
  test('export → import round-trip is a no-op on unedited state', () => {
    const { exportQueensJson, importQueensJson } = useStore.getState();
    const json = exportQueensJson();
    const parsed = JSON.parse(json);
    const before = useStore.getState().seasonsById;
    const ok = importQueensJson(parsed);
    expect(ok).toBe(true);
    const after = useStore.getState().seasonsById;
    for (const preset of SEASON_PRESETS) {
      for (let i = 0; i < preset.season.queens.length; i++) {
        expect(after[preset.id].queens[i].skills).toEqual(before[preset.id].queens[i].skills);
        expect(after[preset.id].queens[i].lipSync).toBe(before[preset.id].queens[i].lipSync);
      }
    }
  });

  test('importQueensJson applies an edited payload', () => {
    const { exportQueensJson, importQueensJson } = useStore.getState();
    const parsed = JSON.parse(exportQueensJson()) as Record<
      string,
      { name: string; queens: Array<{ id: string; skills: Record<string, number> }> }
    >;
    const jinkx = parsed['season5'].queens.find((q) => q.id === 'jinkx')!;
    jinkx.skills.improv = 3;

    const ok = importQueensJson(parsed);
    expect(ok).toBe(true);
    const imported = useStore.getState().seasonsById['season5'].queens.find(
      (q) => q.id === 'jinkx',
    )!;
    expect(imported.skills.improv).toBe(3);
  });

  test('importQueensJson with malformed input does not throw and does not mutate state', () => {
    const before = JSON.stringify(useStore.getState().seasonsById);
    const { importQueensJson } = useStore.getState();

    expect(importQueensJson(null)).toBe(false);
    expect(importQueensJson('not-an-object')).toBe(false);
    expect(importQueensJson([])).toBe(false);
    expect(importQueensJson({ season5: { queens: 'nope' } })).toBe(false);

    const after = JSON.stringify(useStore.getState().seasonsById);
    expect(after).toBe(before);
  });
});

describe('import/export seasons JSON', () => {
  test('export → import round-trip is a no-op on unedited state', () => {
    const { exportSeasonsJson, importSeasonsJson } = useStore.getState();
    const json = exportSeasonsJson();
    const parsed = JSON.parse(json);
    const before = useStore.getState().seasonsById;
    const ok = importSeasonsJson(parsed);
    expect(ok).toBe(true);
    const after = useStore.getState().seasonsById;
    for (const preset of SEASON_PRESETS) {
      expect(after[preset.id].queens).toHaveLength(before[preset.id].queens.length);
      expect(after[preset.id].episodes).toHaveLength(before[preset.id].episodes.length);
    }
  });

  test('importSeasonsJson with malformed input does not throw and does not mutate state', () => {
    const before = JSON.stringify(useStore.getState().seasonsById);
    const { importSeasonsJson } = useStore.getState();

    expect(importSeasonsJson(null)).toBe(false);
    expect(importSeasonsJson('not-an-object')).toBe(false);
    expect(importSeasonsJson([])).toBe(false);
    expect(importSeasonsJson({ season5: { queens: [] } })).toBe(false); // missing episodes

    const after = JSON.stringify(useStore.getState().seasonsById);
    expect(after).toBe(before);
  });
});

describe('migrateToV2', () => {
  test('returns null for empty persisted payload', () => {
    expect(migrateToV2(null, 0)).toBeNull();
    expect(migrateToV2(undefined, 0)).toBeNull();
  });

  test('returns null for v1 payload (discarded)', () => {
    expect(migrateToV2({ realSeason: { id: 'season5' }, editorQueens: [] }, 1)).toBeNull();
  });

  test('returns the payload unchanged at v2', () => {
    const payload = { seasonsById: { season5: {} } };
    expect(migrateToV2(payload, 2)).toBe(payload);
  });
});

describe('migrateToV3 (pre-S6 immunity backfill)', () => {
  test('passes through non-object payloads', () => {
    expect(migrateToV3(null)).toBeNull();
    expect(migrateToV3(undefined)).toBeUndefined();
  });

  test('backfills grantsImmunity on canonical S2 episodes 1-5', () => {
    const payload = {
      seasonsById: {
        season2: {
          episodes: [
            { number: 1, kind: undefined },
            { number: 2 },
            { number: 3 },
            { number: 4 },
            { number: 5 },
            { number: 6 },
            { kind: 'finale', number: 12 },
          ],
        },
      },
    };
    const out = migrateToV3(payload) as typeof payload;
    const eps = out.seasonsById.season2.episodes as Array<{ number?: number; grantsImmunity?: boolean }>;
    expect(eps[0].grantsImmunity).toBe(true);
    expect(eps[1].grantsImmunity).toBe(true);
    expect(eps[2].grantsImmunity).toBe(true);
    expect(eps[3].grantsImmunity).toBe(true);
    expect(eps[4].grantsImmunity).toBe(true);
    expect(eps[5].grantsImmunity).toBeUndefined();
    expect(eps[6].grantsImmunity).toBeUndefined(); // finale untouched
  });

  test('skips finale and pass episodes even if they fall on a target episode number', () => {
    const payload = {
      seasonsById: {
        season1: {
          episodes: [
            { number: 1, kind: 'pass' },     // would target ep 1, but kind=pass → skip
            { number: 2 },                    // regular → backfill
          ],
        },
      },
    };
    const out = migrateToV3(payload) as typeof payload;
    const eps = out.seasonsById.season1.episodes as Array<{ kind?: string; grantsImmunity?: boolean }>;
    expect(eps[0].grantsImmunity).toBeUndefined();
    expect(eps[1].grantsImmunity).toBe(true);
  });

  test('does not touch S6+ seasons', () => {
    const payload = {
      seasonsById: {
        season6: { episodes: [{ number: 1 }, { number: 2 }] },
        season13: { episodes: [{ number: 1 }] },
      },
    };
    const out = migrateToV3(payload) as typeof payload;
    const s6 = out.seasonsById.season6.episodes as Array<{ grantsImmunity?: boolean }>;
    const s13 = out.seasonsById.season13.episodes as Array<{ grantsImmunity?: boolean }>;
    expect(s6[0].grantsImmunity).toBeUndefined();
    expect(s6[1].grantsImmunity).toBeUndefined();
    expect(s13[0].grantsImmunity).toBeUndefined();
  });

  test('preserves non-immunity episode fields and seasonsById structure', () => {
    const payload = {
      seasonsById: {
        season1: {
          id: 'season1',
          name: 'Season 1',
          episodes: [{ number: 1, archetype: 'designChallenge', challengeName: 'Drag on a Dime' }],
        },
      },
      otherKey: 'preserved',
    };
    const out = migrateToV3(payload) as typeof payload & { otherKey: string };
    expect(out.otherKey).toBe('preserved');
    const ep = out.seasonsById.season1.episodes[0] as { archetype?: string; challengeName?: string; grantsImmunity?: boolean };
    expect(ep.archetype).toBe('designChallenge');
    expect(ep.challengeName).toBe('Drag on a Dime');
    expect(ep.grantsImmunity).toBe(true);
  });
});

// ── Filter condition actions ────────────────────────────────

describe('addCondition', () => {
  test('appends a new condition', () => {
    const { addCondition } = useStore.getState();
    const c: FilterCondition = { episodeIndex: 0, queenIndex: 1, placement: 0 };
    addCondition(c);
    expect(useStore.getState().conditions).toEqual([c]);
  });

  test('replaces an existing condition at the same (episodeIndex, queenIndex)', () => {
    // This dedup is the only reason addCondition needs filter logic rather
    // than a plain push — every (ep, queen) slot holds at most one pin.
    const { addCondition } = useStore.getState();
    addCondition({ episodeIndex: 0, queenIndex: 1, placement: 0 });
    addCondition({ episodeIndex: 0, queenIndex: 1, placement: 4 });
    expect(useStore.getState().conditions).toEqual([
      { episodeIndex: 0, queenIndex: 1, placement: 4 },
    ]);
  });

  test('leaves unrelated conditions alone', () => {
    const { addCondition } = useStore.getState();
    const a: FilterCondition = { episodeIndex: 0, queenIndex: 1, placement: 0 };
    const b: FilterCondition = { episodeIndex: 1, queenIndex: 2, placement: 4 };
    addCondition(a);
    addCondition(b);
    expect(useStore.getState().conditions).toEqual([a, b]);
  });
});

describe('removeCondition', () => {
  test('removes the targeted (episodeIndex, queenIndex) pair', () => {
    const { addCondition, removeCondition } = useStore.getState();
    addCondition({ episodeIndex: 0, queenIndex: 1, placement: 0 });
    addCondition({ episodeIndex: 1, queenIndex: 2, placement: 4 });
    removeCondition(0, 1);
    expect(useStore.getState().conditions).toEqual([
      { episodeIndex: 1, queenIndex: 2, placement: 4 },
    ]);
  });

  test('is a no-op when the pair is not present', () => {
    const { addCondition, removeCondition } = useStore.getState();
    const c: FilterCondition = { episodeIndex: 0, queenIndex: 1, placement: 0 };
    addCondition(c);
    removeCondition(5, 5);
    expect(useStore.getState().conditions).toEqual([c]);
  });
});

describe('clearConditions', () => {
  test('empties conditions AND nulls filteredResults + matchCount + totalRuns', () => {
    // Important: filter-derived state must reset too — a lingering stale
    // filteredResults after "clear all pins" would mislead the UI.
    const fake = {
      numSimulations: 1, winProbByEpisode: [], aliveProbByEpisode: [],
      elimProbByEpisode: [], placementDist: {}, reachedFinaleProb: {},
      winProb: {}, episodePlacements: [],
    };
    useStore.setState({
      conditions: [{ episodeIndex: 0, queenIndex: 1, placement: 0 }],
      filteredResults: fake,
      filterMatchCount: 50,
      filterTotalRuns: 100,
    });
    useStore.getState().clearConditions();
    const s = useStore.getState();
    expect(s.conditions).toEqual([]);
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
  });
});

// ── selectBaselineSeason ────────────────────────────────────

describe('selectBaselineSeason', () => {
  test('returns the base season even when overrides exist', () => {
    // Baseline runs must NOT reflect pending what-if overrides — filtering
    // happens post-hoc against the baseline buffer.
    const { updateEpisodeOutcome } = useStore.getState();
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: ['roxxxy'] });
    const baseline = selectBaselineSeason(useStore.getState());
    const raw = useStore.getState().seasonsById['season5'];
    expect(baseline).toBe(raw); // same reference — no override layer
    if (!isRegular(baseline.episodes[3])) throw new Error('expected regular ep at 3');
    expect(baseline.episodes[3].eliminated).not.toEqual(['roxxxy']);
  });

  test('throws on unknown active season (invariant guard)', () => {
    useStore.setState({ activeSeasonId: 'nope-does-not-exist' });
    expect(() => selectBaselineSeason(useStore.getState())).toThrow();
  });
});

// ── updateEpisodeWeights ────────────────────────────────────

describe('updateEpisodeWeights', () => {
  test('stores a per-episode weight override and clears sim results', () => {
    const fake = {
      numSimulations: 1, winProbByEpisode: [], aliveProbByEpisode: [],
      elimProbByEpisode: [], placementDist: {}, reachedFinaleProb: {},
      winProb: {}, episodePlacements: [],
    };
    useStore.setState({ baselineResults: fake, filteredResults: fake, filterMatchCount: 1, filterTotalRuns: 1 });
    const weights = {
      comedy: 10, improv: 0, acting: 0, dance: 0,
      music: 0, design: 0, runway: 0, charisma: 0,
    };
    useStore.getState().updateEpisodeWeights(0, weights);
    const s = useStore.getState();
    const ep = s.seasonsById['season5'].episodes[0];
    if (!isRegular(ep)) throw new Error('expected regular ep at 0');
    expect(ep.weights).toEqual(weights);
    // Sim results invalidated, because the next run should use the new weights.
    expect(s.baselineResults).toBeNull();
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
  });

  test('is a no-op on finale and pass episodes (archetype/weights do not apply)', () => {
    // Find a finale ep in any preset (season episodes end with a finale).
    const s0 = useStore.getState().seasonsById['season5'];
    const finaleIdx = s0.episodes.findIndex((e) => e.kind === 'finale');
    expect(finaleIdx).toBeGreaterThan(-1);
    const before = s0.episodes[finaleIdx];
    useStore.getState().updateEpisodeWeights(finaleIdx, {
      comedy: 1, improv: 0, acting: 0, dance: 0,
      music: 0, design: 0, runway: 0, charisma: 0,
    });
    const after = useStore.getState().seasonsById['season5'].episodes[finaleIdx];
    expect(after).toEqual(before);
  });
});

// The persist partialize shape is tested in useStore.persist.test.ts
// (separate file so it can use the happy-dom env for localStorage access).
