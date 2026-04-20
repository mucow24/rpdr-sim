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
import SeasonFlowChart from './components/charts/SeasonFlowChart';
import PlacementGrid from './components/charts/PlacementGrid';

export default function App() {
  const baselineSeason = useStore(selectBaselineSeason);
  const seasonsById = useStore((s) => s.seasonsById);
  const activeSeasonId = useStore((s) => s.activeSeasonId);
  const loadSeason = useStore((s) => s.loadSeason);
  const conditions = useStore((s) => s.conditions);
  const isSimulating = useStore((s) => s.isSimulating);
  const setBaselineResults = useStore((s) => s.setBaselineResults);
  const setFilteredResults = useStore((s) => s.setFilteredResults);
  const setIsSimulating = useStore((s) => s.setIsSimulating);
  const setSimulationProgress = useStore((s) => s.setSimulationProgress);
  const numSimulations = useStore((s) => s.numSimulations);
  const setNumSimulations = useStore((s) => s.setNumSimulations);

  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);

  const [simInput, setSimInput] = useState(numSimulations.toLocaleString());
  const [pendingSeasonId, setPendingSeasonId] = useState(activeSeasonId);
  // Shared with Timeline so episode boxes stay aligned with flow-chart columns.
  const carrierWidth = 75;

  // Keep the dropdown selection in sync when the active season changes externally.
  useEffect(() => {
    setPendingSeasonId(activeSeasonId);
  }, [activeSeasonId]);

  const { runBaseline, runFilter } = useSimulation((pct) =>
    setSimulationProgress(pct),
  );

  const triggerSimulation = useCallback((n: number) => {
    setIsSimulating(true);
    setSimulationProgress(0);
    runBaseline({
      season: baselineSeason,
      numSimulations: n,
    }).then((results) => {
      setBaselineResults(results);
      setIsSimulating(false);
      setSimulationProgress(null);
    });
  }, [baselineSeason, runBaseline, setBaselineResults, setIsSimulating, setSimulationProgress]);

  // Run baseline on mount and when season changes — but only in simulation mode.
  useEffect(() => {
    if (appMode !== 'simulation') return;
    triggerSimulation(numSimulations);
  }, [baselineSeason, appMode, numSimulations, triggerSimulation]);

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
        </div>
      </header>

      {appMode === 'calibrate' ? (
        <CalibratePage />
      ) : appMode === 'data' ? (
        <DataPage />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 text-[#666] min-w-[900px]">
            <select
              value={pendingSeasonId}
              onChange={(e) => setPendingSeasonId(e.target.value)}
              className="bg-[#0a0a10] border border-[#2a2a3a] rounded text-sm text-[#ccc] px-2 py-1 focus:outline-none focus:border-amber-500/50"
            >
              {Object.values(seasonsById).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadSeason(pendingSeasonId)}
              disabled={pendingSeasonId === activeSeasonId || isSimulating}
              className="px-3 py-1 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Load season
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
              className="w-28 px-2 py-1 bg-[#0a0a10] border border-[#2a2a3a] rounded text-sm text-[#ccc] text-right focus:outline-none focus:border-amber-500/50"
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

          <section className="mb-4 flex gap-4 items-stretch w-[900px]">
            <div className="flex-1 min-w-0">
              <PlacementGrid />
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
              <Timeline carrierWidth={carrierWidth} />
              <SeasonFlowChart carrierWidth={carrierWidth} />
            </div>
          </section>

          <DivergencePanel />

          <section className="mb-4">
            <PlacementDistChart height={460} />
          </section>

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
