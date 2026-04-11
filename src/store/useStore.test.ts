import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

beforeEach(() => {
  // Reset store to initial state before each test
  useStore.setState(useStore.getInitialState());
});

describe('season state', () => {
  test('currentSeason initializes as deep clone of realSeason', () => {
    const { realSeason, currentSeason } = useStore.getState();

    // Different object references
    expect(currentSeason).not.toBe(realSeason);
    expect(currentSeason.episodes).not.toBe(realSeason.episodes);
    expect(currentSeason.episodes[0]).not.toBe(realSeason.episodes[0]);

    // Same content
    expect(currentSeason.id).toBe(realSeason.id);
    expect(currentSeason.queens).toHaveLength(realSeason.queens.length);
    expect(currentSeason.episodes).toHaveLength(realSeason.episodes.length);
    expect(currentSeason.episodes[0].placements).toEqual(realSeason.episodes[0].placements);
    expect(currentSeason.episodes[0].eliminated).toEqual(realSeason.episodes[0].eliminated);
  });

  test('updateEpisodeOutcome modifies currentSeason without touching realSeason', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const modifiedOutcome = {
      placements: { jinkx: 'WIN' as const, serena: 'BTM2' as const, penny: 'BTM2' as const },
      eliminated: ['serena'],
    };

    updateEpisodeOutcome(0, modifiedOutcome);

    const { currentSeason, realSeason } = useStore.getState();
    // currentSeason updated
    expect(currentSeason.episodes[0].eliminated).toEqual(['serena']);
    expect(currentSeason.episodes[0].placements['jinkx']).toBe('WIN');
    // realSeason untouched
    expect(realSeason.episodes[0].eliminated).toEqual(['penny']);
    expect(realSeason.episodes[0].placements['roxxxy']).toBe('WIN');
  });

  test('resetEpisode reverts one episode', () => {
    const { updateEpisodeOutcome, resetEpisode } = useStore.getState();
    const modifiedOutcome = {
      placements: { jinkx: 'WIN' as const },
      eliminated: ['serena'],
    };

    updateEpisodeOutcome(0, modifiedOutcome);
    // Verify it changed
    expect(useStore.getState().currentSeason.episodes[0].eliminated).toEqual(['serena']);

    resetEpisode(0);
    const { currentSeason, realSeason } = useStore.getState();
    expect(currentSeason.episodes[0].placements).toEqual(realSeason.episodes[0].placements);
    expect(currentSeason.episodes[0].eliminated).toEqual(realSeason.episodes[0].eliminated);
  });

  test('resetAllEpisodes reverts everything', () => {
    const { updateEpisodeOutcome, resetAllEpisodes } = useStore.getState();

    // Modify two episodes
    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' as const }, eliminated: ['serena'] });
    updateEpisodeOutcome(3, { placements: { alaska: 'WIN' as const }, eliminated: [] });

    resetAllEpisodes();
    const { currentSeason, realSeason } = useStore.getState();
    for (let i = 0; i < currentSeason.episodes.length; i++) {
      expect(currentSeason.episodes[i].placements).toEqual(realSeason.episodes[i].placements);
      expect(currentSeason.episodes[i].eliminated).toEqual(realSeason.episodes[i].eliminated);
    }
  });

  test('updateEpisodeOutcome preserves challenge metadata', () => {
    const { updateEpisodeOutcome } = useStore.getState();
    const origEp = useStore.getState().currentSeason.episodes[0];

    updateEpisodeOutcome(0, { placements: { jinkx: 'WIN' as const }, eliminated: [] });

    const updatedEp = useStore.getState().currentSeason.episodes[0];
    expect(updatedEp.number).toBe(origEp.number);
    expect(updatedEp.challengeType).toBe(origEp.challengeType);
    expect(updatedEp.challengeName).toBe(origEp.challengeName);
  });
});
