import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';
import { selectBaselineSeason, selectCurrentSeason } from './selectors';
import { migrateToV2, migrateToV3, migrateToV4 } from './migrate';
import { SEASON_PRESETS } from '../data/presets';
import { isRegular, queenUid } from '../engine/types';
import type { FilterCondition } from '../engine/types';

beforeEach(() => {
  // Reset store to initial state before each test
  useStore.setState(useStore.getInitialState());
});

describe('fresh init', () => {
  test('datastore covers every SEASON_PRESETS season with queens matching .ts source', () => {
    const { queensById, casts, episodeLists, seasonsMeta } = useStore.getState();
    for (const preset of SEASON_PRESETS) {
      expect(seasonsMeta[preset.id]?.name).toBe(preset.season.name);
      expect(casts[preset.id]).toHaveLength(preset.season.queens.length);
      expect(episodeLists[preset.id]).toHaveLength(preset.season.episodes.length);
      // Guard against zero-stat-ghost regression — deep-equal skills against source
      for (let i = 0; i < preset.season.queens.length; i++) {
        const presetQ = preset.season.queens[i];
        const key = queenUid(preset.id, presetQ.id);
        expect(casts[preset.id][i]).toBe(key);
        expect(queensById[key].skills).toEqual(presetQ.skills);
        expect(queensById[key].lipSync).toBe(presetQ.lipSync);
      }
    }
  });

  test('session state seeded from active season', () => {
    const { activeSeasonId, currentCast, currentEpisodes, currentEpisodeOverrides, casts, episodeLists } =
      useStore.getState();
    expect(activeSeasonId).toBe('season5');
    expect(currentCast).toEqual(casts['season5']);
    expect(currentEpisodes).toHaveLength(episodeLists['season5'].length);
    expect(currentEpisodeOverrides).toEqual({});
  });
});

describe('selectCurrentSeason', () => {
  test('returns the materialized active season when overrides are empty', () => {
    const s = useStore.getState();
    const current = selectCurrentSeason(s);
    expect(current.id).toBe(s.activeSeasonId);
    expect(current.name).toBe(s.seasonsMeta[s.activeSeasonId].name);
    expect(current.queens).toHaveLength(s.currentCast.length);
    expect(current.episodes).toBe(s.currentEpisodes);
  });

  test('applies override to correct episode index without mutating canonical episodeLists', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const originalEp3 = useStore.getState().episodeLists['season5'][3];
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
    // Canonical datastore episodeLists untouched
    expect(s.episodeLists['season5'][3]).toEqual(originalEp3);
  });
});

describe('updateQueenSkill', () => {
  test('updates the right queen only', () => {
    const { updateQueenSkill } = useStore.getState();
    updateQueenSkill(queenUid('season5', 'jinkx'), 'improv', 1);
    const { queensById } = useStore.getState();
    expect(queensById[queenUid('season5', 'jinkx')].skills.improv).toBe(1);
    // Other queens unchanged
    const alaskaSrc = SEASON_PRESETS.find((p) => p.id === 'season5')!.season.queens.find(
      (q) => q.id === 'alaska',
    )!;
    expect(queensById[queenUid('season5', 'alaska')].skills).toEqual(alaskaSrc.skills);
    // S10 untouched
    const s10Src = SEASON_PRESETS.find((p) => p.id === 'season10')!.season;
    for (const q of s10Src.queens) {
      expect(queensById[queenUid('season10', q.id)].skills).toEqual(q.skills);
    }
  });

  test('updating vanjie in season10 does not touch vanjie in season11', () => {
    const { updateQueenSkill } = useStore.getState();
    updateQueenSkill(queenUid('season10', 'vanjie'), 'comedy', 1);
    const { queensById } = useStore.getState();
    expect(queensById[queenUid('season10', 'vanjie')].skills.comedy).toBe(1);
    const s11VanjieSrc = SEASON_PRESETS.find((p) => p.id === 'season11')!.season.queens.find(
      (q) => q.id === 'vanjie',
    )!;
    expect(queensById[queenUid('season11', 'vanjie')].skills.comedy).toBe(s11VanjieSrc.skills.comedy);
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
    useStore.getState().updateQueenSkill(queenUid('season5', 'jinkx'), 'improv', 5);
    const s = useStore.getState();
    expect(s.baselineResults).toBeNull();
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
  });
});

describe('updateQueenLipSync', () => {
  test('updates the right queen only', () => {
    const { updateQueenLipSync } = useStore.getState();
    updateQueenLipSync(queenUid('season10', 'vanjie'), 10);
    const { queensById } = useStore.getState();
    expect(queensById[queenUid('season10', 'vanjie')].lipSync).toBe(10);
    const s11VanjieSrc = SEASON_PRESETS.find((p) => p.id === 'season11')!.season.queens.find(
      (q) => q.id === 'vanjie',
    )!;
    expect(queensById[queenUid('season11', 'vanjie')].lipSync).toBe(s11VanjieSrc.lipSync);
  });
});

describe('episode overrides', () => {
  test('updateEpisodeOutcome writes to currentEpisodeOverrides without touching canonical episodeLists', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const before = useStore.getState().episodeLists['season5'][3];
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: ['roxxxy'] });
    const s = useStore.getState();
    expect(s.currentEpisodeOverrides[3]).toEqual({
      placements: { jinkx: 'WIN' },
      eliminated: ['roxxxy'],
    });
    expect(s.episodeLists['season5'][3]).toEqual(before);
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
    const origEp = useStore.getState().episodeLists['season5'][0];
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
    updateQueenSkill(queenUid('season5', 'jinkx'), 'improv', 1);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    reloadQueensFromSource();

    const s = useStore.getState();
    // All queens restored to source across every season
    for (const preset of SEASON_PRESETS) {
      for (const presetQ of preset.season.queens) {
        const got = s.queensById[queenUid(preset.id, presetQ.id)];
        expect(got.skills).toEqual(presetQ.skills);
        expect(got.lipSync).toBe(presetQ.lipSync);
      }
    }
    // Episode overrides preserved
    expect(s.currentEpisodeOverrides[3]).toEqual({
      placements: { jinkx: 'WIN' },
      eliminated: [],
    });
  });

  test('reloadSeasonsFromSource restores episodes and casts, clears overrides, but preserves queen stats', () => {
    const { updateQueenSkill, updateEpisodeOutcome, reloadSeasonsFromSource } = useStore.getState();
    updateQueenSkill(queenUid('season5', 'jinkx'), 'improv', 1);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    reloadSeasonsFromSource();

    const s = useStore.getState();
    // Queen stats preserved (queens registry not touched by season reload).
    expect(s.queensById[queenUid('season5', 'jinkx')].skills.improv).toBe(1);
    // Episodes and casts restored to canonical for every season.
    for (const preset of SEASON_PRESETS) {
      expect(s.casts[preset.id]).toEqual(preset.season.queens.map((q) => queenUid(preset.id, q.id)));
      for (let i = 0; i < preset.season.episodes.length; i++) {
        const got = s.episodeLists[preset.id][i];
        const want = preset.season.episodes[i];
        if (!isRegular(got) || !isRegular(want)) continue;
        expect(got.placements).toEqual(want.placements);
        expect(got.eliminated).toEqual(want.eliminated);
      }
    }
    // Overrides cleared (session reseeded).
    expect(s.currentEpisodeOverrides).toEqual({});
  });
});

describe('resetQueenColors', () => {
  test('restores colors from source while preserving skills, lipSync, and episode overrides', () => {
    const { updateQueenSkill, updateQueenLipSync, updateEpisodeOutcome, resetQueenColors } =
      useStore.getState();

    // Edit a skill, lipSync, and an episode override — none of these should be touched.
    updateQueenSkill(queenUid('season5', 'jinkx'), 'improv', 1);
    updateQueenLipSync(queenUid('season5', 'jinkx'), 2);
    updateEpisodeOutcome(3, { placements: { jinkx: 'WIN' }, eliminated: [] });

    // Mutate colors across two seasons.
    useStore.setState((s) => {
      const next = { ...s.queensById };
      for (const preset of SEASON_PRESETS) {
        if (preset.id !== 'season5' && preset.id !== 'season10') continue;
        for (const presetQ of preset.season.queens) {
          const key = queenUid(preset.id, presetQ.id);
          next[key] = { ...next[key], color: preset.id === 'season5' ? '#123456' : '#abcdef' };
        }
      }
      return { queensById: next };
    });

    resetQueenColors();

    const s = useStore.getState();
    // Colors restored across every season
    for (const preset of SEASON_PRESETS) {
      for (const srcQ of preset.season.queens) {
        const got = s.queensById[queenUid(preset.id, srcQ.id)];
        expect(got.color).toBe(srcQ.color);
      }
    }
    // Skills & lipSync preserved
    const jinkx = s.queensById[queenUid('season5', 'jinkx')];
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
    const before = useStore.getState().queensById;
    const ok = importQueensJson(parsed);
    expect(ok).toBe(true);
    const after = useStore.getState().queensById;
    for (const preset of SEASON_PRESETS) {
      for (const q of preset.season.queens) {
        const key = queenUid(preset.id, q.id);
        expect(after[key].skills).toEqual(before[key].skills);
        expect(after[key].lipSync).toBe(before[key].lipSync);
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
    expect(useStore.getState().queensById[queenUid('season5', 'jinkx')].skills.improv).toBe(3);
  });

  test('importQueensJson with malformed input does not throw and does not mutate state', () => {
    const before = JSON.stringify(useStore.getState().queensById);
    const { importQueensJson } = useStore.getState();

    expect(importQueensJson(null)).toBe(false);
    expect(importQueensJson('not-an-object')).toBe(false);
    expect(importQueensJson([])).toBe(false);
    expect(importQueensJson({ season5: { queens: 'nope' } })).toBe(false);

    const after = JSON.stringify(useStore.getState().queensById);
    expect(after).toBe(before);
  });
});

describe('import/export seasons JSON', () => {
  test('export → import round-trip is a no-op on unedited state', () => {
    const { exportSeasonsJson, importSeasonsJson } = useStore.getState();
    const json = exportSeasonsJson();
    const parsed = JSON.parse(json);
    const before = useStore.getState();
    const ok = importSeasonsJson(parsed);
    expect(ok).toBe(true);
    const after = useStore.getState();
    for (const preset of SEASON_PRESETS) {
      expect(after.casts[preset.id]).toHaveLength(before.casts[preset.id].length);
      expect(after.episodeLists[preset.id]).toHaveLength(before.episodeLists[preset.id].length);
    }
  });

  test('importSeasonsJson with malformed input does not throw and does not mutate state', () => {
    const beforeSnapshot = JSON.stringify({
      queensById: useStore.getState().queensById,
      casts: useStore.getState().casts,
      episodeLists: useStore.getState().episodeLists,
    });
    const { importSeasonsJson } = useStore.getState();

    expect(importSeasonsJson(null)).toBe(false);
    expect(importSeasonsJson('not-an-object')).toBe(false);
    expect(importSeasonsJson([])).toBe(false);
    expect(importSeasonsJson({ season5: { queens: [] } })).toBe(false); // missing episodes

    const afterSnapshot = JSON.stringify({
      queensById: useStore.getState().queensById,
      casts: useStore.getState().casts,
      episodeLists: useStore.getState().episodeLists,
    });
    expect(afterSnapshot).toBe(beforeSnapshot);
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
    expect(baseline.id).toBe('season5');
    if (!isRegular(baseline.episodes[3])) throw new Error('expected regular ep at 3');
    expect(baseline.episodes[3].eliminated).not.toEqual(['roxxxy']);
  });

  test('returns referentially-stable result when inputs are unchanged', () => {
    // Selector-level memoization preserves === between calls when none of the
    // baseline inputs (active season, currentCast, currentEpisodes,
    // queensById, seasonsMeta) have changed. This is what keeps the ~30
    // chart/sim-engine read sites from re-rendering on unrelated state changes.
    const a = selectBaselineSeason(useStore.getState());
    // Touch an unrelated piece of state — should not invalidate the cache.
    useStore.getState().setNumSimulations(123);
    const b = selectBaselineSeason(useStore.getState());
    expect(a).toBe(b);
  });
});

// ── updateEpisodeWeights ────────────────────────────────────

describe('updateEpisodeWeights', () => {
  test('stores a per-episode weight override on currentEpisodes and clears sim results', () => {
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
    const ep = s.currentEpisodes[0];
    if (!isRegular(ep)) throw new Error('expected regular ep at 0');
    expect(ep.weights).toEqual(weights);
    // Canonical episodeLists not mutated — the edit is session-only.
    const canonical = s.episodeLists['season5'][0];
    if (!isRegular(canonical)) throw new Error('expected regular canonical ep at 0');
    expect(canonical.weights).toBeUndefined();
    // Sim results invalidated, because the next run should use the new weights.
    expect(s.baselineResults).toBeNull();
    expect(s.filteredResults).toBeNull();
    expect(s.filterMatchCount).toBeNull();
    expect(s.filterTotalRuns).toBeNull();
  });

  test('is a no-op on finale and pass episodes (archetype/weights do not apply)', () => {
    const finaleIdx = useStore.getState().currentEpisodes.findIndex((e) => e.kind === 'finale');
    expect(finaleIdx).toBeGreaterThan(-1);
    const before = useStore.getState().currentEpisodes[finaleIdx];
    useStore.getState().updateEpisodeWeights(finaleIdx, {
      comedy: 1, improv: 0, acting: 0, dance: 0,
      music: 0, design: 0, runway: 0, charisma: 0,
    });
    expect(useStore.getState().currentEpisodes[finaleIdx]).toEqual(before);
  });
});

describe('setCurrentCast (session-only cast composition)', () => {
  test('replaces currentCast without writing to canonical casts datastore', () => {
    const { setCurrentCast } = useStore.getState();
    const beforeCanonical = useStore.getState().casts['season5'];
    // Reorder the cast — drop the first queen and append her at the end.
    const reordered = [...beforeCanonical.slice(1), beforeCanonical[0]];
    setCurrentCast(reordered);
    const s = useStore.getState();
    expect(s.currentCast).toEqual(reordered);
    // Canonical casts UNTOUCHED — this is a session-only edit.
    expect(s.casts['season5']).toEqual(beforeCanonical);
  });

  test('clears overrides, conditions, sim results, and selected queen', () => {
    const fake = {
      numSimulations: 1, winProbByEpisode: [], aliveProbByEpisode: [],
      elimProbByEpisode: [], placementDist: {}, reachedFinaleProb: {},
      winProb: {}, episodePlacements: [],
    };
    useStore.setState({
      baselineResults: fake, filteredResults: fake, filterMatchCount: 1, filterTotalRuns: 1,
      conditions: [{ episodeIndex: 0, queenIndex: 0, placement: 0 }],
      currentEpisodeOverrides: { 3: { placements: { jinkx: 'WIN' }, eliminated: [] } },
      selectedQueenId: 'jinkx',
    });
    useStore.getState().setCurrentCast(useStore.getState().casts['season5']);
    const s = useStore.getState();
    expect(s.currentEpisodeOverrides).toEqual({});
    expect(s.conditions).toEqual([]);
    expect(s.baselineResults).toBeNull();
    expect(s.selectedQueenId).toBeNull();
  });
});

// ── migrateToV4 (datastore + session refactor) ──
//
// Restructures from `seasonsById[s].queens[]` (where each queen carries its
// own stats) to a normalized model:
//   - `queensById[homeSeason:queenId]`       — single canonical queen record
//   - `casts[seasonId]`                       — array of queen keys (cast composition)
//   - `episodeLists[seasonId]`                — canonical episode list
//   - `seasonsMeta[seasonId]`                 — `{ name }`
// Plus session state (initialized from the active season at migration time):
//   - `currentCast`, `currentEpisodes`, `currentEpisodeOverrides` (carried over)
//
// Spine is `SEASON_PRESETS`: every preset queen ends up in `queensById` even
// if a user nuked them from a cast, so the registry is exhaustive.
describe('migrateToV4 (datastore + session refactor)', () => {
  test('passes through non-object payloads', () => {
    expect(migrateToV4(null)).toBeNull();
    expect(migrateToV4(undefined)).toBeUndefined();
  });

  test('default v3 state migrates with full coverage of presets', () => {
    // Build a minimal v3-shaped payload from SEASON_PRESETS — this is what a
    // user with no edits would have in localStorage.
    const v3 = {
      seasonsById: Object.fromEntries(
        SEASON_PRESETS.map((p) => [
          p.id,
          {
            id: p.season.id,
            name: p.season.name,
            queens: p.season.queens.map((q) => ({ ...q, skills: { ...q.skills } })),
            episodes: p.season.episodes.map((ep) => ({ ...ep })),
          },
        ]),
      ),
      activeSeasonId: 'season5',
      currentEpisodeOverrides: {},
    };

    const v4 = migrateToV4(v3) as {
      queensById: Record<string, { id: string; skills: Record<string, number> }>;
      casts: Record<string, string[]>;
      episodeLists: Record<string, unknown[]>;
      seasonsMeta: Record<string, { name: string }>;
      activeSeasonId: string;
      currentCast: string[];
      currentEpisodes: unknown[];
      currentEpisodeOverrides: Record<number, unknown>;
    };

    // queensById covers every (season, queen) preset combo
    for (const preset of SEASON_PRESETS) {
      for (const q of preset.season.queens) {
        const key = `${preset.id}:${q.id}`;
        expect(v4.queensById[key]).toBeDefined();
        expect(v4.queensById[key].skills).toEqual(q.skills);
      }
    }

    // casts[s] has the right length and points at home-season keys
    for (const preset of SEASON_PRESETS) {
      expect(v4.casts[preset.id]).toHaveLength(preset.season.queens.length);
      for (let i = 0; i < preset.season.queens.length; i++) {
        expect(v4.casts[preset.id][i]).toBe(`${preset.id}:${preset.season.queens[i].id}`);
      }
    }

    // episodeLists preserved structurally
    for (const preset of SEASON_PRESETS) {
      expect(v4.episodeLists[preset.id]).toHaveLength(preset.season.episodes.length);
    }

    // seasonsMeta has the names
    for (const preset of SEASON_PRESETS) {
      expect(v4.seasonsMeta[preset.id].name).toBe(preset.season.name);
    }

    // Session state seeded from active season
    expect(v4.activeSeasonId).toBe('season5');
    expect(v4.currentCast).toEqual(v4.casts['season5']);
    expect(v4.currentEpisodes).toHaveLength(v4.episodeLists['season5'].length);
    expect(v4.currentEpisodeOverrides).toEqual({});
  });

  test('custom cast with a foreign queen migrates to home-season composite key', () => {
    // S5 cast was edited to include Raja (home: season3). Under v3 this means
    // `seasonsById['season5'].queens` contains a deep-copy of Raja with id='raja'.
    const s5Preset = SEASON_PRESETS.find((p) => p.id === 'season5')!.season;
    const raja = SEASON_PRESETS.find((p) => p.id === 'season3')!.season.queens.find(
      (q) => q.id === 'raja',
    )!;
    const customS5Queens = [...s5Preset.queens.slice(1), { ...raja, skills: { ...raja.skills } }];

    const v3 = {
      seasonsById: {
        ...Object.fromEntries(
          SEASON_PRESETS.map((p) => [
            p.id,
            {
              id: p.season.id,
              name: p.season.name,
              queens: p.season.queens.map((q) => ({ ...q, skills: { ...q.skills } })),
              episodes: p.season.episodes.map((ep) => ({ ...ep })),
            },
          ]),
        ),
        season5: {
          id: 'season5',
          name: 'Season 5',
          queens: customS5Queens,
          episodes: s5Preset.episodes.map((ep) => ({ ...ep })),
        },
      },
      activeSeasonId: 'season5',
      currentEpisodeOverrides: {},
    };

    const v4 = migrateToV4(v3) as {
      queensById: Record<string, unknown>;
      casts: Record<string, string[]>;
    };

    // Raja's home-season key exists in queensById
    expect(v4.queensById['season3:raja']).toBeDefined();
    // S5's cast includes Raja under her home key, not 'season5:raja'
    expect(v4.casts['season5']).toContain('season3:raja');
    expect(v4.casts['season5']).not.toContain('season5:raja');
    // S5's cast doesn't include the queen we sliced off
    const droppedQueenId = s5Preset.queens[0].id;
    expect(v4.casts['season5']).not.toContain(`season5:${droppedQueenId}`);
  });

  test('preserves per-home-season distinction for same-id cross-season queens', () => {
    // Vanjie appears in both S10 and S11 with id='vanjie' but distinct stats.
    // The v4 registry must keep them as separate keys.
    const v3 = {
      seasonsById: Object.fromEntries(
        SEASON_PRESETS.map((p) => [
          p.id,
          {
            id: p.season.id,
            name: p.season.name,
            queens: p.season.queens.map((q) =>
              p.id === 'season10' && q.id === 'vanjie'
                ? { ...q, skills: { ...q.skills, comedy: 1 } }
                : { ...q, skills: { ...q.skills } },
            ),
            episodes: p.season.episodes.map((ep) => ({ ...ep })),
          },
        ]),
      ),
      activeSeasonId: 'season5',
      currentEpisodeOverrides: {},
    };

    const v4 = migrateToV4(v3) as {
      queensById: Record<string, { skills: Record<string, number> }>;
    };

    expect(v4.queensById['season10:vanjie']).toBeDefined();
    expect(v4.queensById['season11:vanjie']).toBeDefined();
    expect(v4.queensById['season10:vanjie'].skills.comedy).toBe(1);
    const s11VanjieSrc = SEASON_PRESETS.find((p) => p.id === 'season11')!.season.queens.find(
      (q) => q.id === 'vanjie',
    )!;
    expect(v4.queensById['season11:vanjie'].skills.comedy).toBe(s11VanjieSrc.skills.comedy);
  });

  test('preserves currentEpisodeOverrides through migration', () => {
    const overrides = {
      3: { placements: { jinkx: 'WIN' as const }, eliminated: ['roxxxy'] },
    };
    const v3 = {
      seasonsById: Object.fromEntries(
        SEASON_PRESETS.map((p) => [
          p.id,
          {
            id: p.season.id,
            name: p.season.name,
            queens: p.season.queens.map((q) => ({ ...q, skills: { ...q.skills } })),
            episodes: p.season.episodes.map((ep) => ({ ...ep })),
          },
        ]),
      ),
      activeSeasonId: 'season5',
      currentEpisodeOverrides: overrides,
    };

    const v4 = migrateToV4(v3) as { currentEpisodeOverrides: typeof overrides };
    expect(v4.currentEpisodeOverrides).toEqual(overrides);
  });
});

// ── Bug repro: calibrate edits propagate to the sim through a custom cast ──
//
// Before the (datastore + session) refactor, `setSeasonCast` deep-copied queen
// stats into `seasonsById[active].queens`, creating an independent record from
// the queen's home-season copy. Calibrate's drag-drop targets the home copy by
// design, so the sim — which reads the active season's snapshot — never saw
// the edit. This test locks in the fixed behavior: a calibrate edit on any
// queen currently in the active cast is reflected in `selectCurrentSeason`,
// regardless of how the queen got there.
describe('bug repro: calibrate edits propagate to sim through a custom cast', () => {
  test('updating a foreign queen\'s stat is visible via selectCurrentSeason', () => {
    // Active = season5 by default. Build a custom S5 cast that includes Raja
    // (home: season3) — Raja is not in S5's preset roster, so this is a true
    // cross-season import.
    const s5Preset = SEASON_PRESETS.find((p) => p.id === 'season5')!.season.queens;
    expect(s5Preset.some((q) => q.id === 'raja')).toBe(false); // sanity: foreign

    const customCast = [
      ...s5Preset.slice(1).map((q) => queenUid('season5', q.id)),
      queenUid('season3', 'raja'),
    ];
    expect(customCast).toHaveLength(s5Preset.length);

    useStore.getState().setCurrentCast(customCast);

    // Calibrate Raja's comedy to 9. Raja's home is season3.
    useStore.getState().updateQueenSkill(queenUid('season3', 'raja'), 'comedy', 9);

    // The simulator reads from selectCurrentSeason — it must reflect the edit.
    const current = selectCurrentSeason(useStore.getState());
    const rajaInSim = current.queens.find((q) => q.id === 'raja')!;
    expect(rajaInSim).toBeDefined();
    expect(rajaInSim.skills.comedy).toBe(9);
  });
});

// The persist partialize shape is tested in useStore.persist.test.ts
// (separate file so it can use the happy-dom env for localStorage access).
