import { useEffect, useState, useCallback } from 'react';
import { useStore } from './store/useStore';
import { useSimulation } from './engine/useSimulation';
import Timeline from './components/timeline/Timeline';
import WinProbChart from './components/charts/WinProbChart';
import EliminationHeatmap from './components/charts/EliminationHeatmap';
import PlacementDistChart from './components/charts/PlacementDistChart';
import QueenCard from './components/QueenCard';
import DivergencePanel from './components/DivergencePanel';
import TrajectoryChart from './components/charts/TrajectoryChart';
import DivergencePage from './components/DivergencePage';
import SpreadPage from './components/SpreadPage';
import SeasonEditorPage from './components/SeasonEditorPage';
import QueenEditorPage from './components/QueenEditorPage';
import CalibratePage from './components/CalibratePage';
import SeasonFlowChart from './components/charts/SeasonFlowChart';
import QueenMiniChart from './components/charts/QueenMiniChart';
import QueenFlowChart from './components/charts/QueenFlowChart';
import PlacementGrid from './components/charts/PlacementGrid';
import PlacementBitmap from './components/charts/PlacementBitmap';

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

  const selectedQueenId = useStore((s) => s.selectedQueenId);
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
  // In divergence mode, DivergencePage owns simulation via runFromState.
  useEffect(() => {
    if (appMode !== 'simulation' && appMode !== 'spread') return;
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

  const results = useStore(
    (s) => s.filteredResults ?? s.baselineResults,
  );
  const sortedQueens = [...season.queens].sort(
    (a, b) => (results?.winProb[b.id] ?? 0) - (results?.winProb[a.id] ?? 0),
  );

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
          <button
            onClick={() => setAppMode('spread')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'spread'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            Spread
          </button>
          <button
            onClick={() => setAppMode('divergence')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              appMode === 'divergence'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#666] hover:text-[#999] border border-transparent'
            }`}
          >
            What If?
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
      ) : appMode === 'spread' ? (
        <SpreadPage />
      ) : appMode === 'simulation' ? (
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

          <section className="mb-8 bg-[#121218] rounded-lg border border-[#1a1a24]">
            <div className="px-4 pt-3 pb-1">
              <h2 className="text-xs font-medium text-[#555] uppercase tracking-wider">
                Season Timeline — click an episode to explore & change placements
              </h2>
            </div>
            <Timeline />
          </section>

          <section className="mb-4 grid grid-cols-4 gap-2">
            {season.queens.map((q) => (
              <QueenMiniChart key={q.id} queenId={q.id} />
            ))}
          </section>

          <section className="mb-4 grid grid-cols-2 gap-2">
            {season.queens.map((q) => (
              <QueenFlowChart key={q.id} queenId={q.id} height={80} />
            ))}
          </section>

          <section className="mb-8">
            <SeasonFlowChart height={650} />
          </section>

          <section className="mb-8 flex gap-6 items-start">
            <div className="flex-1 min-w-0">
              <PlacementGrid height={460} />
            </div>
            <PlacementBitmap />
          </section>

          <section className="mb-8">
            <WinProbChart height={400} />
          </section>

          {selectedQueenId && (
            <section className="mb-8">
              <TrajectoryChart height={350} />
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <EliminationHeatmap height={460} />
            <PlacementDistChart height={460} />
          </section>

          <section className="mb-12">
            <h3 className="text-sm font-medium text-[#888] mb-3">
              Queen Profiles — ranked by Crown Probability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedQueens.map((queen) => (
                <QueenCard key={queen.id} queen={queen} />
              ))}
            </div>
          </section>

          <footer className="text-center text-[#333] text-xs pb-8">
            Powered by {numSimulations.toLocaleString()} Monte Carlo simulations. May the best woman win.
          </footer>
        </>
      ) : (
        <DivergencePage />
      )}
    </div>
  );
}
