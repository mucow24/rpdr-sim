import { useEffect } from 'react';
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
import SeasonFlowChart from './components/charts/SeasonFlowChart';

const NUM_SIMULATIONS = 100_000;

export default function App() {
  const realSeason = useStore((s) => s.realSeason);
  const season = useStore((s) => s.currentSeason);
  const conditions = useStore((s) => s.conditions);
  const isSimulating = useStore((s) => s.isSimulating);
  const setBaselineResults = useStore((s) => s.setBaselineResults);
  const setFilteredResults = useStore((s) => s.setFilteredResults);
  const setIsSimulating = useStore((s) => s.setIsSimulating);
  const setSimulationProgress = useStore((s) => s.setSimulationProgress);

  const selectedQueenId = useStore((s) => s.selectedQueenId);
  const appMode = useStore((s) => s.appMode);
  const setAppMode = useStore((s) => s.setAppMode);

  const { runBaseline, runFilter } = useSimulation((pct) =>
    setSimulationProgress(pct),
  );

  // Run baseline on mount and when season changes — but only in simulation mode.
  // In divergence mode, DivergencePage owns simulation via runFromState.
  useEffect(() => {
    if (appMode !== 'simulation' && appMode !== 'spread') return;
    setIsSimulating(true);
    setSimulationProgress(0);
    runBaseline({
      season: realSeason,
      numSimulations: NUM_SIMULATIONS,
    }).then((results) => {
      setBaselineResults(results);
      setIsSimulating(false);
      setSimulationProgress(null);
    });
  }, [realSeason, appMode, runBaseline, setBaselineResults, setIsSimulating]);

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
        </div>
      </header>

      {appMode === 'seasonEditor' ? (
        <SeasonEditorPage />
      ) : appMode === 'queenEditor' ? (
        <QueenEditorPage />
      ) : appMode === 'spread' ? (
        <SpreadPage />
      ) : appMode === 'simulation' ? (
        <>
          <p className="text-[#666] mb-6">
            {season.name} &middot;{' '}
            {matchCount !== null
              ? `${matchCount.toLocaleString()} of ${totalRuns?.toLocaleString()} matching timelines`
              : `${NUM_SIMULATIONS.toLocaleString()} simulations`}
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

          <section className="mb-8 bg-[#121218] rounded-lg border border-[#1a1a24]">
            <div className="px-4 pt-3 pb-1">
              <h2 className="text-xs font-medium text-[#555] uppercase tracking-wider">
                Season Timeline — click an episode to explore & change placements
              </h2>
            </div>
            <Timeline />
          </section>

          <section className="mb-8">
            <SeasonFlowChart height={650} />
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
            Powered by {NUM_SIMULATIONS.toLocaleString()} Monte Carlo simulations. May the best woman win.
          </footer>
        </>
      ) : (
        <DivergencePage />
      )}
    </div>
  );
}
