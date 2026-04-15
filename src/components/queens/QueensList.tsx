import { useStore } from '../../store/useStore';
import { BASE_STATS, type BaseStat, type Queen } from '../../engine/types';
import PopoverBox from '../common/PopoverBox';
import StatInput from '../common/StatInput';
import RadarChart from '../RadarChart';

/** Short 3-letter uppercase code for each base stat. Matches the Timeline's
 *  weight grid so users see the same labels in both popovers. */
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

export default function QueensList() {
  const {
    currentSeason: season,
    baselineResults,
    filteredResults,
    updateQueenSkill,
    updateQueenLipSync,
  } = useStore();
  const results = filteredResults ?? baselineResults;

  return (
    <div className="w-full pt-[5px] pb-4 overflow-visible">
      <div className="flex items-center gap-0 px-6 justify-center flex-wrap">
        {season.queens.map((queen, idx) => {
          const parts = queen.name.split(' ');
          const firstName = parts[0];
          const lastName = parts.slice(1).join(' ');

          return (
            <div key={queen.id} className="flex items-center">
              <PopoverBox
                renderTrigger={({ isOpen, toggle }) => (
                  <button
                    onClick={toggle}
                    className={`
                      relative flex flex-col items-center justify-center gap-1 w-12 h-12 transition-all
                      bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a]
                      ${idx > 0 ? '-ml-px' : ''}
                      ${isOpen ? 'z-10 ring-1 ring-white/20' : ''}
                    `}
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: queen.color }}
                    />
                    <div className="text-[8px] leading-tight text-[#aaa] text-center w-full px-0.5">
                      <div className="truncate">{firstName}</div>
                      {lastName && <div className="truncate">{lastName}</div>}
                    </div>
                  </button>
                )}
              >
                <QueenPopoverContent
                  queen={queen}
                  winProb={results?.winProb[queen.id] ?? null}
                  reachedFinaleProb={results?.reachedFinaleProb[queen.id] ?? null}
                  onSkillChange={(stat, v) => updateQueenSkill(queen.id, stat, v)}
                  onLipSyncChange={(v) => updateQueenLipSync(queen.id, v)}
                />
              </PopoverBox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QueenPopoverContent({
  queen,
  winProb,
  reachedFinaleProb,
  onSkillChange,
  onLipSyncChange,
}: {
  queen: Queen;
  winProb: number | null;
  reachedFinaleProb: number | null;
  onSkillChange: (stat: BaseStat, v: number) => void;
  onLipSyncChange: (v: number) => void;
}) {
  // Gold goes to the queen's highest non-lipsync stat (all ties win the crown).
  // Lipsync also gets gold only when maxed at 10.
  const maxSkill = Math.max(...BASE_STATS.map((s) => queen.skills[s] ?? 0));

  // Normalized radar polygon area ∈ [0, 1]. Each triangle from center to
  // adjacent vertices contributes 0.5 · sin(angleSlice) · r_i · r_{i+1}.
  // All-10s (r=1 everywhere) sums to N, so dividing by N normalizes to 1.0.
  const area =
    BASE_STATS.reduce((sum, s, i) => {
      const r = (queen.skills[s] ?? 0) / 10;
      const rNext = (queen.skills[BASE_STATS[(i + 1) % BASE_STATS.length]] ?? 0) / 10;
      return sum + r * rNext;
    }, 0) / BASE_STATS.length;

  return (
    <>
      <div className="flex items-center gap-2 mb-3 pr-6">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: queen.color }}
        />
        <h3 className="text-sm font-medium text-[#ddd] truncate">{queen.name}</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
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

      <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1">
        Stats
      </label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {BASE_STATS.map((stat) => (
          <div
            key={stat}
            className="flex flex-col items-center gap-1 p-2 bg-[#0a0a10] border border-[#2a2a3a] rounded"
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
                onSkillChange(stat, v);
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-2 bg-[#0a0a10] border border-[#2a2a3a] rounded">
        <span className="text-[10px] font-mono text-[#888] flex-shrink-0">
          LIP SYNC
        </span>
        <div className="w-16">
          <StatInput
            value={queen.lipSync}
            min={0}
            max={10}
            colorScale="skill"
            gold={queen.lipSync === 10}
            onCommit={(v) => {
              if (v === queen.lipSync) return;
              onLipSyncChange(v);
            }}
          />
        </div>
      </div>
    </>
  );
}
