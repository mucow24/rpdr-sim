import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store/useStore';
import { useSimulation } from './engine/useSimulation';
import Timeline from './components/timeline/Timeline';
import QueensList from './components/queens/QueensList';
import WinProbChart from './components/charts/WinProbChart';
import EliminationHeatmap from './components/charts/EliminationHeatmap';
import PlacementDistChart from './components/charts/PlacementDistChart';
import DivergencePanel from './components/DivergencePanel';
import TrajectoryChart from './components/charts/TrajectoryChart';
import SeasonEditorPage from './components/SeasonEditorPage';
import QueenEditorPage from './components/QueenEditorPage';
import CalibratePage from './components/CalibratePage';
import SeasonFlowChart from './components/charts/SeasonFlowChart';
import PlacementGrid from './components/charts/PlacementGrid';

export default function App() {
  const realSeason = useStore((s) => s.realSeason);
  const season = useStore((s) => s.currentSeason);
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

  const { runBaseline, runFilter } = useSimulation((pct) =>
    setSimulationProgress(pct),
  );

  const triggerSimulation = useCallback((n: number) => {
    setIsSimulating(true);
    setSimulationProgress(0);
    runBaseline({
      season: realSeason,
      numSimulations: n,
    }).then((results) => {
      setBaselineResults(results);
      setIsSimulating(false);
      setSimulationProgress(null);
    });
  }, [realSeason, runBaseline, setBaselineResults, setIsSimulating, setSimulationProgress]);

  // Run baseline on mount and when season changes — but only in simulation mode.
  useEffect(() => {
    if (appMode !== 'simulation') return;
    triggerSimulation(numSimulations);
  }, [realSeason, appMode]);

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
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#eee] tracking-tight">
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
            onClick={() => setAppMode('seasonEditor')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'seasonEditor'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Seasons
          </button>
          <button
            onClick={() => setAppMode('queenEditor')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'queenEditor'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Queens
          </button>
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
        </div>
      </header>

      {appMode === 'seasonEditor' ? (
        <SeasonEditorPage />
      ) : appMode === 'queenEditor' ? (
        <QueenEditorPage />
      ) : appMode === 'calibrate' ? (
        <CalibratePage />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 text-[#666]">
            <span>
              {season.name} &middot;{' '}
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

          <DivergencePanel />

          <section className="mb-8 bg-[#121218] rounded-lg border border-[#1a1a24] py-2">
            <Timeline />
            <QueensList />
          </section>

          <section className="mb-8">
            <PlacementGrid height={230} />
          </section>

          <section className="mb-8">
            <SeasonFlowChart height={650} />
          </section>

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

          <footer className="text-center text-[#333] text-xs pb-8">
            Powered by {numSimulations.toLocaleString()} Monte Carlo simulations. May the best woman win.
          </footer>

          {(() => {
            const shown = matchCount ?? numSimulations;
            const total = totalRuns ?? numSimulations;
            return (
              <div
                className={`fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-md bg-black/40 backdrop-blur-sm text-xs font-mono pointer-events-none ${
                  shown < 50 ? 'text-red-400' : 'text-white'
                }`}
              >
                {shown.toLocaleString()}/{total.toLocaleString()}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
