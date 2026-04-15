import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useSimulation } from '../engine/useSimulation';
import type { Placement } from '../engine/types';
import RealTimeline from './divergence/RealTimeline';
import WhatIfEditor from './divergence/WhatIfEditor';
import WinProbChart from './charts/WinProbChart';
import EliminationHeatmap from './charts/EliminationHeatmap';
import PlacementDistChart from './charts/PlacementDistChart';
import TrajectoryChart from './charts/TrajectoryChart';

/** Compare two episode outcomes for equality. */
function isEpisodeModified(
  current: { placements: Record<string, Placement>; eliminated: string[] },
  real: { placements: Record<string, Placement>; eliminated: string[] },
): boolean {
  if (JSON.stringify(current.eliminated) !== JSON.stringify(real.eliminated)) return true;
  const cKeys = Object.keys(current.placements).sort();
  const rKeys = Object.keys(real.placements).sort();
  if (cKeys.length !== rKeys.length) return true;
  for (let i = 0; i < cKeys.length; i++) {
    if (cKeys[i] !== rKeys[i]) return true;
    if (current.placements[cKeys[i]] !== real.placements[rKeys[i]]) return true;
  }
  return false;
}

/** Build a human-readable description of what changed in an episode. */
function describeChange(
  epNumber: number,
  current: { placements: Record<string, Placement>; eliminated: string[] },
  real: { placements: Record<string, Placement>; eliminated: string[] },
  queens: { id: string; name: string }[],
): string {
  const parts: string[] = [];
  for (const [id, newPlacement] of Object.entries(current.placements)) {
    const oldPlacement = real.placements[id];
    if (oldPlacement && newPlacement !== oldPlacement) {
      const queen = queens.find((q) => q.id === id);
      if (queen) parts.push(`${queen.name.split(' ')[0]} ${newPlacement}`);
    }
  }
  const origElim = new Set(real.eliminated);
  const newElim = new Set(current.eliminated);
  for (const id of newElim) {
    if (!origElim.has(id)) {
      const queen = queens.find((q) => q.id === id);
      if (queen) parts.push(`${queen.name.split(' ')[0]} ELIM`);
    }
  }
  for (const id of origElim) {
    if (!newElim.has(id)) {
      const queen = queens.find((q) => q.id === id);
      if (queen) parts.push(`${queen.name.split(' ')[0]} survives`);
    }
  }
  if (parts.length === 0) return `Ep ${epNumber} unchanged`;
  return `Ep ${epNumber}: ${parts.join(', ')}`;
}

export default function DivergencePage() {
  const currentSeason = useStore((s) => s.currentSeason);
  const realSeason = useStore((s) => s.realSeason);
  const updateEpisodeOutcome = useStore((s) => s.updateEpisodeOutcome);
  const resetEpisode = useStore((s) => s.resetEpisode);
  const resetAllEpisodes = useStore((s) => s.resetAllEpisodes);
  const setBaselineResults = useStore((s) => s.setBaselineResults);
  const setIsSimulating = useStore((s) => s.setIsSimulating);
  const setSimulationProgress = useStore((s) => s.setSimulationProgress);
  const isSimulating = useStore((s) => s.isSimulating);
  const simulationProgress = useStore((s) => s.simulationProgress);
  const baselineResults = useStore((s) => s.baselineResults);
  const numSimulations = useStore((s) => s.numSimulations);

  const { runFromState } = useSimulation((pct) => setSimulationProgress(pct));

  const [editingEpisode, setEditingEpisode] = useState<number | null>(null);

  // Derive which episodes are modified
  const modifiedEpisodes = currentSeason.episodes.reduce<number[]>((acc, ep, idx) => {
    if (isEpisodeModified(ep, realSeason.episodes[idx])) acc.push(idx);
    return acc;
  }, []);

  const hasChanges = modifiedEpisodes.length > 0;
  const divergeIndex = hasChanges ? Math.min(...modifiedEpisodes) : null;

  /** Re-run simulation from the latest modified episode (or clear results if none). */
  const resimulate = () => {
    setTimeout(() => {
      const state = useStore.getState();
      const modified = state.currentSeason.episodes.reduce<number[]>((acc, ep, idx) => {
        if (isEpisodeModified(ep, state.realSeason.episodes[idx])) acc.push(idx);
        return acc;
      }, []);

      if (modified.length === 0) {
        setBaselineResults(null as unknown as import('../engine/types').SimulationResults);
        return;
      }

      const lastMod = Math.max(...modified);
      setIsSimulating(true);
      setSimulationProgress(0);

      runFromState({
        season: state.currentSeason,
        fromEpisode: lastMod + 1,
        numSimulations,
      }).then((results) => {
        setBaselineResults(results);
        setIsSimulating(false);
        setSimulationProgress(null);
      });
    }, 0);
  };

  const handleApply = (outcome: { placements: Record<string, Placement>; eliminated: string[] }) => {
    if (editingEpisode === null) return;
    updateEpisodeOutcome(editingEpisode, outcome);
    resimulate();
    setEditingEpisode(null);
  };

  const handleRemoveChange = (epIdx: number) => {
    resetEpisode(epIdx);
    resimulate();
  };

  const handleClearAll = () => {
    resetAllEpisodes();
    setEditingEpisode(null);
  };

  // Has divergence results if we have modified episodes and baseline has been set from a divergence sim
  const hasDivergenceResults = hasChanges && baselineResults !== null;

  return (
    <div>
      <p className="text-[#666] mb-4">
        {currentSeason.name} &middot; Real Season
        {isSimulating && simulationProgress !== null && (
          <span className="ml-2 text-amber-400">
            Simulating {simulationProgress}%
          </span>
        )}
        {hasDivergenceResults && !isSimulating && (
          <span className="ml-2 text-[#555]">
            {numSimulations.toLocaleString()} simulations from divergence
          </span>
        )}
      </p>

      {/* Active what-ifs panel */}
      {hasChanges && (
        <div className="bg-[#1a1a24] border border-amber-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-amber-400">
              Active What-Ifs ({modifiedEpisodes.length})
            </h3>
            <button
              onClick={handleClearAll}
              className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
            >
              Reset All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {modifiedEpisodes.map((epIdx) => (
              <div
                key={epIdx}
                className="flex items-center gap-2 bg-amber-500/10 rounded px-3 py-1.5 text-sm"
              >
                <span className="text-amber-300">
                  {describeChange(
                    currentSeason.episodes[epIdx].number,
                    currentSeason.episodes[epIdx],
                    realSeason.episodes[epIdx],
                    currentSeason.queens,
                  )}
                </span>
                <button
                  onClick={() => handleRemoveChange(epIdx)}
                  className="text-amber-500/50 hover:text-amber-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mb-6">
        <RealTimeline
          divergeIndex={divergeIndex}
          onSelectEpisode={setEditingEpisode}
        />
      </section>

      {editingEpisode !== null && currentSeason.episodes[editingEpisode] && (
        <section className="mb-6">
          <WhatIfEditor
            episodeIndex={editingEpisode}
            onApply={handleApply}
            onReset={() => setEditingEpisode(null)}
          />
        </section>
      )}

      {hasDivergenceResults && (
        <>
          <section className="mb-8">
            <WinProbChart height={400} />
          </section>

          <section className="mb-8">
            <TrajectoryChart height={350} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <EliminationHeatmap height={460} />
            <PlacementDistChart height={460} />
          </section>
        </>
      )}

      {!hasDivergenceResults && !isSimulating && !hasChanges && (
        <div className="text-center text-[#444] py-12">
          Click an episode above to create a what-if scenario, then simulate forward.
        </div>
      )}
    </div>
  );
}
