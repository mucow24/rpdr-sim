import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { BASE_STATS, type BaseStat } from '../../engine/types';
import StatInput from '../common/StatInput';
import RadarChart from '../RadarChart';
import TrajectoryChart from '../charts/TrajectoryChart';

const STAT_CODE: Record<BaseStat, string> = {
  comedy: 'COM',
  improv: 'IMP',
  acting: 'ACT',
  dance: 'DAN',
  music: 'MUS',
  design: 'DES',
  runway: 'RUN',
  charisma: 'CHA',
};

/** Persistent stats editor for the currently-selected queen. Sits beside the
 *  PlacementGrid; mirrors what the queen popover used to show. When no queen
 *  is selected, renders the same layout in a disabled state. */
export default function QueenStatsPanel() {
  const season = useStore(selectCurrentSeason);
  const activeSeasonId = useStore((s) => s.activeSeasonId);
  const {
    selectedQueenId,
    baselineResults,
    filteredResults,
    updateQueenSkill,
    updateQueenLipSync,
    conditions,
  } = useStore();

  const results = filteredResults ?? baselineResults;
  const queen = selectedQueenId
    ? season.queens.find((q) => q.id === selectedQueenId) ?? null
    : null;
  const queenHasPins =
    !!queen &&
    conditions.some((c) => season.queens[c.queenIndex]?.id === queen.id);

  const winProb = queen ? results?.winProb[queen.id] ?? null : null;
  const reachedFinaleProb = queen
    ? results?.reachedFinaleProb[queen.id] ?? null
    : null;
  const maxSkill = queen
    ? Math.max(...BASE_STATS.map((s) => queen.skills[s] ?? 0))
    : 0;
  const avgStat = queen
    ? ([...BASE_STATS.map((s) => queen.skills[s] ?? 0), queen.lipSync ?? 0].reduce(
        (a, b) => a + b,
        0,
      )) /
      (BASE_STATS.length + 1)
    : 0;

  return (
    <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        {queen && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: queen.color }}
          />
        )}
        <h3
          className={`text-sm font-medium truncate ${
            queen ? 'text-[#ddd]' : 'text-[#666] italic'
          }`}
        >
          {queen ? queen.name : 'No queen selected'}
        </h3>
        {queenHasPins && (
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0 opacity-90"
            style={{ backgroundColor: '#ffd700' }}
            title="This queen has active what-if pins"
          />
        )}
        <div className="ml-auto flex items-center gap-3 text-xs font-mono text-[#aaa] flex-shrink-0">
          <span title="Queen power - average stat value">
            💪{' '}
            <span className="inline-block w-6 text-left tabular-nums align-middle -ml-[3px]">
              {queen ? avgStat.toFixed(1) : '--'}
            </span>
          </span>
          <span title="Probability of being in finale">
            🏆{' '}
            <span className="inline-block w-6 text-left tabular-nums align-middle -ml-[3px]">
              {queen && reachedFinaleProb !== null
                ? `${(reachedFinaleProb * 100).toFixed(0)}%`
                : '--'}
            </span>
          </span>
          <span title="Probability of winning the crown">
            👑{' '}
            <span className="inline-block w-6 text-left tabular-nums align-middle -ml-[3px]">
              {queen && winProb !== null ? `${(winProb * 100).toFixed(0)}%` : '--'}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          <RadarChart queen={queen} size={110} />
        </div>
        <div className="flex-1 min-w-0 self-stretch">
          <TrajectoryChart compact height={110} />
        </div>
      </div>

      <div className="grid grid-cols-9 gap-1.5">
        {BASE_STATS.map((stat) => (
          <div
            key={stat}
            className="flex flex-col items-center gap-1 p-1.5 bg-[#0a0a10] border border-[#2a2a3a] rounded"
          >
            <span className="text-[10px] font-mono text-[#888]">
              {STAT_CODE[stat]}
            </span>
            <StatInput
              value={queen?.skills[stat] ?? 0}
              min={0}
              max={10}
              colorScale="skill"
              gold={!!queen && (queen.skills[stat] ?? 0) === maxSkill}
              disabled={!queen}
              onCommit={(v) => {
                if (!queen) return;
                if (v === (queen.skills[stat] ?? 0)) return;
                updateQueenSkill(activeSeasonId, queen.id, stat, v);
              }}
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 p-1.5 bg-[#0a0a10] border border-[#2a2a3a] rounded">
          <span className="text-[10px] font-mono text-[#888]">LS</span>
          <StatInput
            value={queen?.lipSync ?? 0}
            min={0}
            max={10}
            colorScale="skill"
            gold={!!queen && queen.lipSync === 10}
            disabled={!queen}
            onCommit={(v) => {
              if (!queen) return;
              if (v === queen.lipSync) return;
              updateQueenLipSync(activeSeasonId, queen.id, v);
            }}
          />
        </div>
      </div>
    </div>
  );
}
