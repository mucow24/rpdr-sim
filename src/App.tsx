import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store/useStore';
import { selectBaselineSeason } from './store/selectors';
import { useSimulation } from './engine/useSimulation';
import Timeline from './components/timeline/Timeline';
import QueenStatsPanel from './components/queens/QueenStatsPanel';
import PlacementDistChart from './components/charts/PlacementDistChart';
import DivergencePanel from './components/DivergencePanel';
import CalibratePage from './components/CalibratePage';
import DataPage from './components/DataPage';
import LipSyncsPage from './components/LipSyncsPage';
import SeasonFlowChart from './components/charts/SeasonFlowChart';
import PlacementGrid from './components/charts/PlacementGrid';
import CastEditorPanel from './components/CastEditorPanel';
import SurprisingEventsTable from './components/SurprisingEventsTable';

export default function App() {
  const baselineSeason = useStore(selectBaselineSeason);
  const seasonsMeta = useStore((s) => s.seasonsMeta);
  const activeSeasonId = useStore((s) => s.activeSeasonId);
  const loadSeason = useStore((s) => s.loadSeason);
  const conditions = useStore((s) => s.conditions);
  const isSimulating = useStore((s) => s.isSimulating);
  const setBaselineResults = useStore((s) => s.setBaselineResults);
  const setBaselineR0Results = useStore((s) => s.setBaselineR0Results);
  const setFilteredResults = useStore((s) => s.setFilteredResults);
  const setIsSimulating = useStore((s) => s.setIsSimulating);
  const setSimulationProgress = useStore((s) => s.setSimulationProgress);
  const numSimulations = useStore((s) => s.numSimulations);
  const setNumSimulations = useStore((s) => s.setNumSimulations);
  const riggory = useStore((s) => s.riggory);
  const setRiggory = useStore((s) => s.setRiggory);
  const riggoryScale = useStore((s) => s.riggoryScale);
  const setRiggoryScale = useStore((s) => s.setRiggoryScale);
  const riggoryFormula = useStore((s) => s.riggoryFormula);
  const [riggoryScaleDraft, setRiggoryScaleDraft] = useState(() => String(riggoryScale));
  useEffect(() => { setRiggoryScaleDraft(String(riggoryScale)); }, [riggoryScale]);
  const commitRiggoryScale = useCallback(() => {
    const next = parseFloat(riggoryScaleDraft);
    if (Number.isFinite(next) && next > 0 && next !== riggoryScale) setRiggoryScale(next);
    else setRiggoryScaleDraft(String(riggoryScale));
  }, [riggoryScaleDraft, riggoryScale, setRiggoryScale]);
  // Visual-only state for the slider mid-drag. We commit to the store on
  // mouseup/touchend/keyup so the sim doesn't re-run every pixel of drag.
  const [riggoryDraft, setRiggoryDraft] = useState(() => Math.round(riggory * 100));
  // Keep the draft in sync if the store value changes from elsewhere.
  useEffect(() => { setRiggoryDraft(Math.round(riggory * 100)); }, [riggory]);
  const commitRiggory = useCallback(() => {
    const next = riggoryDraft / 100;
    if (next !== riggory) setRiggory(next);
  }, [riggoryDraft, riggory, setRiggory]);

  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);

  const [simInput, setSimInput] = useState(numSimulations.toLocaleString());
  const [editingCast, setEditingCast] = useState(false);
  const [showDist, setShowDist] = useState(
    () => localStorage.getItem('rpdr-sim-show-dist') === '1',
  );
  useEffect(() => {
    localStorage.setItem('rpdr-sim-show-dist', showDist ? '1' : '0');
  }, [showDist]);
  const [debug, setDebug] = useState(
    () => localStorage.getItem('rpdr-sim-debug') === '1',
  );
  useEffect(() => {
    localStorage.setItem('rpdr-sim-debug', debug ? '1' : '0');
  }, [debug]);
  // Shared with Timeline so episode boxes stay aligned with flow-chart columns.
  const carrierWidth = 75;

  const { runBaselineDual, runFilter } = useSimulation((pct) =>
    setSimulationProgress(pct),
  );

  const triggerSimulation = useCallback((n: number) => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setBaselineResults(null);
    // One pass — the engine emits both the active (rigged) result and the r=0
    // counterfactual. Per-MC-run dual tracking only diverges when a lipsync
    // resolves to different winners, so cost stays close to a single sim.
    runBaselineDual({ season: baselineSeason, numSimulations: n, riggory, riggoryScale, riggoryFormula })
      .then(({ rigged, r0 }) => {
        setBaselineResults(rigged);
        setBaselineR0Results(riggory > 0 ? r0 : null);
        setIsSimulating(false);
        setSimulationProgress(null);
      });
  }, [baselineSeason, riggory, riggoryScale, riggoryFormula, runBaselineDual, setBaselineResults, setBaselineR0Results, setIsSimulating, setSimulationProgress]);

  // Run baseline on mount and when season changes — but only in simulation mode.
  useEffect(() => {
    if (appMode !== 'simulation') return;
    triggerSimulation(numSimulations);
  }, [baselineSeason, appMode, numSimulations, riggory, riggoryScale, riggoryFormula, triggerSimulation]);

  // Run filter when conditions change
  useEffect(() => {
    if (conditions.length === 0) {
      setFilteredResults(null, null, null);
      return;
    }
    setIsSimulating(true);
    runFilter(conditions).then(({ results, matchCount, totalRuns }) => {
      setFilteredResults(results, matchCount, totalRuns);
      setIsSimulating(false);
    });
  }, [conditions, runFilter, setFilteredResults, setIsSimulating]);

  const matchCount = useStore((s) => s.filterMatchCount);
  const totalRuns = useStore((s) => s.filterTotalRuns);
  const simulationProgress = useStore((s) => s.simulationProgress);

  return (
    <div className="max-w-[948px] mx-auto px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#eee] tracking-tight whitespace-nowrap">
          Charisma Uniqueness Nerve & Talent Simulator
        </h1>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setAppMode('simulation')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'simulation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Simulation
          </button>
          <span className="text-[#333]">|</span>
          <button
            onClick={() => setAppMode('calibrate')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'calibrate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Calibrate
          </button>
          <button
            onClick={() => setAppMode('data')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'data'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Data
          </button>
          <button
            onClick={() => setAppMode('lip-syncs')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'lip-syncs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Lip Syncs
          </button>
        </div>
      </header>

      {appMode === 'calibrate' ? (
        <CalibratePage />
      ) : appMode === 'data' ? (
        <DataPage />
      ) : appMode === 'lip-syncs' ? (
        <LipSyncsPage />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 text-[#666] min-w-[900px]">
            <select
              value={activeSeasonId}
              onChange={(e) => loadSeason(e.target.value)}
              disabled={isSimulating}
              className="bg-[#0a0a10] border border-[#3a3a4a] rounded text-sm text-[#ccc] px-2 py-1 focus:outline-none focus:border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {Object.entries(seasonsMeta).map(([id, meta]) => (
                <option key={id} value={id}>
                  {meta.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setEditingCast((v) => !v)}
              className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                editingCast
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-[#999] border-[#3a3a4a] hover:text-[#ccc] hover:border-[#4a4a5a]'
              }`}
            >
              Edit cast
            </button>
            <span>
              {matchCount !== null
                ? `${matchCount.toLocaleString()} of ${totalRuns?.toLocaleString()} matching timelines`
                : `${numSimulations.toLocaleString()} simulations`}
            </span>
            {isSimulating && simulationProgress !== null && (
              <span className="text-amber-400">
                Simulating {simulationProgress}%
              </span>
            )}
            {isSimulating && simulationProgress === null && (
              <span className="text-amber-400 animate-pulse">
                Filtering...
              </span>
            )}
            {matchCount !== null && matchCount < 50 && (
              <span className="text-red-400">
                Low sample size — results may be unreliable
              </span>
            )}
            <span className="ml-auto" />
            <label className="flex items-center gap-2 text-sm text-[#888] select-none" title="Bias lip syncs toward the season's frontrunner. 0% = pure lipSync stat; 100% = always picks the frontrunner.">
              <a
                href="/riggory-explorer.html"
                target="_blank"
                rel="noopener"
                className="hover:text-amber-400 underline decoration-dotted underline-offset-4"
              >
                Riggory
              </a>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={riggoryDraft}
                onChange={(e) => setRiggoryDraft(parseInt(e.target.value, 10))}
                onMouseUp={commitRiggory}
                onTouchEnd={commitRiggory}
                onKeyUp={commitRiggory}
                disabled={isSimulating}
                className="w-24 accent-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <span className="tabular-nums w-9 text-right text-[#ccc]">{riggoryDraft}%</span>
            </label>
            <label className="flex items-center gap-1.5 text-sm text-[#888] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => setDebug(e.target.checked)}
                className="accent-amber-500"
              />
              Debug
            </label>
            {debug && (
              <label
                className="flex items-center gap-1.5 text-sm text-[#888] select-none"
                title="Logistic scale (rig-score units) for the rig-gap → pRig curve. Larger = flatter."
              >
                Scale
                <input
                  type="text"
                  inputMode="decimal"
                  value={riggoryScaleDraft}
                  onChange={(e) => setRiggoryScaleDraft(e.target.value)}
                  onBlur={commitRiggoryScale}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitRiggoryScale(); }}
                  disabled={isSimulating}
                  className="w-14 px-2 py-1 bg-[#0a0a10] border border-[#3a3a4a] rounded text-sm text-[#ccc] text-right focus:outline-none focus:border-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </label>
            )}
            <input
              type="text"
              value={simInput}
              onChange={(e) => setSimInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const n = parseInt(simInput.replace(/,/g, ''), 10);
                  if (n > 0 && !isSimulating) {
                    setNumSimulations(n);
                    setSimInput(n.toLocaleString());
                    triggerSimulation(n);
                  }
                }
              }}
              className="w-28 px-2 py-1 bg-[#0a0a10] border border-[#3a3a4a] rounded text-sm text-[#ccc] text-right focus:outline-none focus:border-amber-500/50"
            />
            <button
              onClick={() => {
                const n = parseInt(simInput.replace(/,/g, ''), 10);
                if (n > 0 && !isSimulating) {
                  setNumSimulations(n);
                  setSimInput(n.toLocaleString());
                  triggerSimulation(n);
                }
              }}
              disabled={isSimulating}
              className="px-3 py-1 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Re-run Simulation
            </button>
          </div>

          {editingCast && (
            <CastEditorPanel key={activeSeasonId} onClose={() => setEditingCast(false)} />
          )}

          <section className="mb-4 flex gap-4 items-stretch w-[900px]">
            <div className="flex-1 min-w-0">
              {showDist ? (
                <PlacementDistChart onSwitch={() => setShowDist(false)} />
              ) : (
                <PlacementGrid onSwitch={() => setShowDist(true)} />
              )}
            </div>
            <div className="w-[440px] flex-shrink-0">
              <QueenStatsPanel />
            </div>
          </section>

          <section className="mb-4 w-[900px]">
            <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4">
              <h3 className="text-sm font-medium text-[#ddd] mb-3">
                Season Flow — click a queen to select, click placements to pin
              </h3>
              <Timeline carrierWidth={carrierWidth} debug={debug} />
              <SeasonFlowChart carrierWidth={carrierWidth} />
            </div>
          </section>

          <SurprisingEventsTable />

          <DivergencePanel />

          <footer className="text-center text-[#333] text-xs pb-8">
            Powered by {numSimulations.toLocaleString()} Monte Carlo simulations. May the best woman win.
          </footer>

          {(() => {
            const shown = matchCount ?? numSimulations;
            const total = totalRuns ?? numSimulations;
            return (
              <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-1 pointer-events-none">
                {isSimulating && (
                  <div className="px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-sm text-xs font-mono text-amber-400">
                    {simulationProgress !== null
                      ? `Simulating... ${simulationProgress}%`
                      : 'Filtering...'}
                  </div>
                )}
                <div
                  className={`px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-sm text-xs font-mono ${
                    shown < 50 ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {shown.toLocaleString()}/{total.toLocaleString()}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
