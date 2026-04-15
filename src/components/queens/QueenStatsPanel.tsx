import { useStore } from '../../store/useStore';
import { BASE_STATS, type BaseStat } from '../../engine/types';
import StatInput from '../common/StatInput';
import RadarChart from '../RadarChart';

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
 *  PlacementGrid; mirrors what the queen popover used to show. Defaults to
 *  the first queen when nothing is selected so the panel never sits empty. */
export default function QueenStatsPanel() {
  const {
    currentSeason: season,
    selectedQueenId,
    baselineResults,
    filteredResults,
    updateQueenSkill,
    updateQueenLipSync,
  } = useStore();

  const results = filteredResults ?? baselineResults;
  const queen = selectedQueenId
    ? season.queens.find((q) => q.id === selectedQueenId) ?? season.queens[0]
    : season.queens[0];

  if (!queen) return null;

  const winProb = results?.winProb[queen.id] ?? null;
  const reachedFinaleProb = results?.reachedFinaleProb[queen.id] ?? null;
  const maxSkill = Math.max(...BASE_STATS.map((s) => queen.skills[s] ?? 0));
  const area =
    BASE_STATS.reduce((sum, s, i) => {
      const r = (queen.skills[s] ?? 0) / 10;
      const rNext = (queen.skills[BASE_STATS[(i + 1) % BASE_STATS.length]] ?? 0) / 10;
      return sum + r * rNext;
    }, 0) / BASE_STATS.length;

  return (
    <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: queen.color }}
        />
        <h3 className="text-sm font-medium text-[#ddd] truncate">{queen.name}</h3>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          <RadarChart queen={queen} size={110} />
        </div>
        <div className="flex-1 min-w-0 text-xs text-[#666] space-y-1">
          {winProb !== null && (
            <div>
              Crown:{' '}
              <span className="text-[#aaa] font-mono">
                {(winProb * 100).toFixed(1)}%
              </span>
            </div>
          )}
          {reachedFinaleProb !== null && (
            <div>
              Finale:{' '}
              <span className="text-[#aaa] font-mono">
                {(reachedFinaleProb * 100).toFixed(1)}%
              </span>
            </div>
          )}
          <div>
            Area:{' '}
            <span className="text-[#aaa] font-mono">{area.toFixed(2)}</span>
          </div>
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
              value={queen.skills[stat] ?? 0}
              min={0}
              max={10}
              colorScale="skill"
              gold={(queen.skills[stat] ?? 0) === maxSkill}
              onCommit={(v) => {
                if (v === (queen.skills[stat] ?? 0)) return;
                updateQueenSkill(queen.id, stat, v);
              }}
            />
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 p-1.5 bg-[#0a0a10] border border-[#2a2a3a] rounded">
          <span className="text-[10px] font-mono text-[#888]">LS</span>
          <StatInput
            value={queen.lipSync}
            min={0}
            max={10}
            colorScale="skill"
            gold={queen.lipSync === 10}
            onCommit={(v) => {
              if (v === queen.lipSync) return;
              updateQueenLipSync(queen.id, v);
            }}
          />
        </div>
      </div>
    </div>
  );
}
