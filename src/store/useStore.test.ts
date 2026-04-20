import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';
import { selectCurrentSeason } from './selectors';
import { migrateToV2 } from './migrate';
import { SEASON_PRESETS } from '../data/presets';
import { isRegular } from '../engine/types';

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
