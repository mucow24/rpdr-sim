import { useCallback, useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import SmearChart, { type ActiveQueen } from './charts/SmearChart';
import DivergencePanel from './DivergencePanel';
import type { FilterCondition } from '../engine/types';

const CHALLENGE_ICONS: Record<string, string> = {
  comedy: '🎤',
  design: '✂️',
  acting: '🎭',
  dance: '💃',
  snatchGame: '🎯',
  improv: '🎪',
  runway: '👗',
  singing: '🎵',
};

const PLACEMENT_KEYS = ['WIN', 'HIGH', 'SAFE', 'LOW', 'BTM2'] as const;

function buildAllQueens(
  episodeIndex: number,
  season: { queens: { id: string; name: string; color: string }[] },
  results: {
    episodePlacements: Record<string, Record<string, number>>[];
    elimProbByEpisode: Record<string, number>[];
  },
): ActiveQueen[] {
  const epPlacements = results.episodePlacements[episodeIndex];
  if (!epPlacements) return [];

  return [...season.queens].reverse().map((q) => {
    const qi = season.queens.indexOf(q);
    // P(already eliminated before this episode)
    let prevElimSum = 0;
    for (let ep = 0; ep < episodeIndex; ep++) {
      prevElimSum += results.elimProbByEpisode[ep]?.[q.id] ?? 0;
    }
    const prevElimProb = Math.min(1, prevElimSum);

    // P(eliminated THIS episode)
    const thisElimProb = Math.min(1 - prevElimProb, results.elimProbByEpisode[episodeIndex]?.[q.id] ?? 0);

    const surviveProb = Math.max(0, 1 - prevElimProb - thisElimProb);

    // Build absolute distribution
    const conditional = epPlacements[q.id] ?? {};
    const distribution: Record<string, number> = {};
    for (const p of PLACEMENT_KEYS) {
      distribution[p] = (conditional[p] ?? 0) * surviveProb;
    }
    distribution['ELIM'] = thisElimProb;
    distribution['PREV ELIM'] = prevElimProb;

    return {
      queenId: q.id,
      queenIndex: qi,
      name: q.name,
      color: q.color,
      distribution,
      aliveProb: 1 - prevElimProb,
    };
  });
}

export default function SpreadPage() {
  const [contrastExponent, setContrastExponent] = useState(1.5);
  const season = useStore((s) => s.currentSeason);
  const baselineResults = useStore((s) => s.baselineResults);
  const filteredResults = useStore((s) => s.filteredResults);
  const conditions = useStore((s) => s.conditions);
  const spreadSelectedEpisode = useStore((s) => s.spreadSelectedEpisode);
  const setSpreadSelectedEpisode = useStore((s) => s.setSpreadSelectedEpisode);
  const addCondition = useStore((s) => s.addCondition);
  const removeCondition = useStore((s) => s.removeCondition);
  const isSimulating = useStore((s) => s.isSimulating);
  const simulationProgress = useStore((s) => s.simulationProgress);
  const matchCount = useStore((s) => s.filterMatchCount);
  const totalRuns = useStore((s) => s.filterTotalRuns);

  const results = filteredResults ?? baselineResults;

  const handleConditionAdd = useCallback(
    (c: FilterCondition) => addCondition(c),
    [addCondition],
  );
  const handleConditionRemove = useCallback(
    (epIdx: number, qIdx: number) => removeCondition(epIdx, qIdx),
    [removeCondition],
  );

  // Build active queens for the editor
  const editorQueens = useMemo(() => {
    if (!results) return [];
    return buildAllQueens(spreadSelectedEpisode, season, results);
  }, [spreadSelectedEpisode, season, results]);

  // Build active queens for each mini chart
  const miniQueensByEpisode = useMemo(() => {
    if (!results) return [];
    return season.episodes.map((_, epIdx) =>
      buildAllQueens(epIdx, season, results),
    );
  }, [season, results]);

  // Conditions for the selected episode
  const editorConditions = useMemo(
    () => conditions.filter((c) => c.episodeIndex === spreadSelectedEpisode),
    [conditions, spreadSelectedEpisode],
  );

  if (!results) {
    return (
      <div className="text-[#666] py-12 text-center">
        {isSimulating && simulationProgress !== null ? (
          <span className="text-amber-400">
            Running simulation... {simulationProgress}%
          </span>
        ) : (
          'Waiting for simulation results...'
        )}
      </div>
    );
  }

  const selectedEpisode = season.episodes[spreadSelectedEpisode];

  return (
    <div>
      {/* Status line */}
      <p className="text-[#666] mb-6">
        {season.name} &middot;{' '}
        {matchCount !== null
          ? `${matchCount.toLocaleString()} of ${totalRuns?.toLocaleString()} matching timelines`
          : 'Baseline probabilities'}
        {isSimulating && simulationProgress !== null && (
          <span className="ml-2 text-amber-400">
            Simulating {simulationProgress}%
          </span>
        )}
        {isSimulating && simulationProgress === null && (
          <span className="ml-2 text-amber-400 animate-pulse">
            Filtering...
          </span>
        )}
        {matchCount !== null && matchCount < 50 && (
          <span className="ml-2 text-red-400">
            Low sample size — results may be unreliable
          </span>
        )}
      </p>

      <DivergencePanel />

      {/* Editor section */}
      <section className="mb-8 bg-[#121218] rounded-lg border border-[#1a1a24] p-4">
        <div className="flex items-center gap-4 mb-3">
          <h2 className="text-xs font-medium text-[#555] uppercase tracking-wider">
            Episode Editor
          </h2>
          <select
            value={spreadSelectedEpisode}
            onChange={(e) => setSpreadSelectedEpisode(Number(e.target.value))}
            className="bg-[#1a1a24] border border-[#2a2a3a] text-[#ccc] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-amber-500/40"
          >
            {season.episodes.map((ep, idx) => (
              <option key={idx} value={idx}>
                Ep {ep.number}: {ep.challengeName}
              </option>
            ))}
          </select>
          {editorConditions.length > 0 && (
            <span className="text-xs text-amber-400">
              {editorConditions.length} condition{editorConditions.length > 1 ? 's' : ''} pinned
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-[#555] font-mono">contrast</span>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={contrastExponent}
              onChange={(e) => setContrastExponent(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span className="text-[10px] text-[#666] font-mono w-6">{contrastExponent.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-[10px] text-[#444] mb-2">
          Click a queen &times; placement to pin. Click ELIM to eliminate. Click again to remove.
        </p>
        <SmearChart
          episodeIndex={spreadSelectedEpisode}
          activeQueens={editorQueens}
          conditions={editorConditions}
          variant="editor"
          contrastExponent={contrastExponent}
          onConditionAdd={handleConditionAdd}
          onConditionRemove={handleConditionRemove}
        />
      </section>

      {/* Season Overview: mini smear cards */}
      <section>
        <h2 className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">
          Season Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {season.episodes.map((ep, epIdx) => {
            const hasCondition = conditions.some(
              (c) => c.episodeIndex === epIdx,
            );
            const isSelected = epIdx === spreadSelectedEpisode;
            const miniQueens = miniQueensByEpisode[epIdx] ?? [];
            const epConditions = conditions.filter(
              (c) => c.episodeIndex === epIdx,
            );

            return (
              <button
                key={epIdx}
                onClick={() => setSpreadSelectedEpisode(epIdx)}
                className={`
                  bg-[#121218] rounded-lg border p-2 text-left transition-colors cursor-pointer
                  ${isSelected
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                    : hasCondition
                      ? 'border-amber-500/30 hover:border-amber-500/40'
                      : 'border-[#1a1a24] hover:border-[#2a2a3a]'
                  }
                `}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">
                    {CHALLENGE_ICONS[ep.challengeType] ?? '❓'}
                  </span>
                  <span className="text-[10px] font-mono text-[#666]">
                    Ep {ep.number}
                  </span>
                  {hasCondition && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-auto" />
                  )}
                </div>
                {miniQueens.length > 0 ? (
                  <SmearChart
                    episodeIndex={epIdx}
                    activeQueens={miniQueens}
                    conditions={epConditions}
                    variant="mini"
                    contrastExponent={contrastExponent}
                  />
                ) : (
                  <div className="h-[80px] flex items-center justify-center text-[#333] text-xs">
                    No data
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
