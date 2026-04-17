import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { BASE_STATS, isFinale, type BaseStat, type Placement } from '../../engine/types';
import { ARCHETYPES, ARCHETYPE_IDS, type ArchetypeId } from '../../data/archetypes';
import PopoverBox from '../common/PopoverBox';
import StatInput from '../common/StatInput';

/** Short 3-letter uppercase code for each base stat (COM, IMP, ACT, ...). */
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

/** Format an archetype as "Display Name (50% IMP, 30% COM, ...)", showing all
 *  non-zero weights sorted by weight descending. Percentages are normalized so
 *  they always sum to ~100 even if raw weights don't. */
function formatArchetypeOption(id: ArchetypeId): string {
  const arc = ARCHETYPES[id];
  const total = BASE_STATS.reduce((sum, s) => sum + (arc.weights[s] ?? 0), 0);
  if (total === 0) return arc.displayName;
  const parts = BASE_STATS
    .map((s) => ({ s, w: arc.weights[s] ?? 0 }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w)
    .map((x) => `${Math.round((x.w / total) * 100)}% ${STAT_CODE[x.s]}`);
  return `${arc.displayName} (${parts.join(', ')})`;
}

// Match SeasonFlowChart's geometry so episode boxes line up with the flow
// chart's columns. Sum of the chart's MARGIN.left (16) + SOURCE_COL_WIDTH (72).
const FLOW_LEFT_OFFSET_PX = 88;
// MARGIN.left + MARGIN.right + SOURCE_COL_WIDTH on the chart.
const FLOW_HORIZ_RESERVED_PX = 104;
const BOX_PX = 48;

export default function Timeline() {
  const season = useStore(selectCurrentSeason);
  const { conditions, updateEpisodeArchetype, updateEpisodeWeights } =
    useStore();

  const [dimExp, setDimExp] = useState(2.45);
  const [dimCutoff, setDimCutoff] = useState(0.34);
  const [dimFloor, setDimFloor] = useState(0);

  const conditionEpisodes = new Set(conditions.map((c) => c.episodeIndex));
  const N = season.episodes.length;

  return (
    <div className="w-full pt-4 pb-[5px] overflow-visible">
      <div className="flex items-center gap-4 mb-3 text-xs text-[#888]">
        <div className="flex items-center gap-2">
          <label>Popover dim exp</label>
          <input
            type="range"
            min={0}
            max={5}
            step={0.05}
            value={dimExp}
            onChange={(e) => setDimExp(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimExp.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Popover dim cutoff</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={dimCutoff}
            onChange={(e) => setDimCutoff(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimCutoff.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Popover dim floor</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={dimFloor}
            onChange={(e) => setDimFloor(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimFloor.toFixed(2)}</span>
        </div>
      </div>
      <div className="relative w-full" style={{ height: BOX_PX }}>
        {season.episodes.map((episode, idx) => {
          const hasCondition = conditionEpisodes.has(idx);
          const finale = isFinale(episode);
          const effectiveWeights: Record<BaseStat, number> = finale
            ? ({} as Record<BaseStat, number>)
            : episode.weights ?? ARCHETYPES[episode.archetype].weights;

          // Center on the flow chart's column for episode `idx`:
          //   center_x = 88 + (W - 104) * (i + 0.5) / N
          // Box left = center - BOX_PX/2 = (88 - 24) + (W - 104) * (i + 0.5) / N.
          const t = (idx + 0.5) / N;
          const leftCalc = `calc(${FLOW_LEFT_OFFSET_PX - BOX_PX / 2}px + (100% - ${FLOW_HORIZ_RESERVED_PX}px) * ${t})`;

          return (
            <div
              key={episode.number}
              className="absolute top-0"
              style={{ left: leftCalc, width: BOX_PX, height: BOX_PX }}
            >
              <PopoverBox
                width={360}
                renderTrigger={({ isOpen, toggle }) => (
                  <button
                    onClick={toggle}
                    className={`
                      relative flex flex-col items-center justify-center gap-2.5 w-12 h-12 transition-all
                      ${
                        hasCondition
                          ? 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50'
                          : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a]'
                      }
                      ${isOpen ? 'z-10 ring-1 ring-white/20' : ''}
                    `}
                  >
                    <span className="text-base leading-none">
                      {finale ? '👑' : (ARCHETYPES[episode.archetype]?.icon ?? '❓')}
                    </span>
                    <span className="text-[10px] leading-none text-[#888] font-mono">
                      {finale ? 'Finale' : `Ep ${episode.number}`}
                    </span>
                    {hasCondition && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </button>
                )}
              >
                <EpisodePopoverContent
                  episodeIndex={idx}
                  title={episode.challengeName}
                  finale={finale}
                  archetype={finale ? null : episode.archetype}
                  weights={effectiveWeights}
                  dimExp={dimExp}
                  dimCutoff={dimCutoff}
                  dimFloor={dimFloor}
                  onArchetypeChange={(a) => updateEpisodeArchetype(idx, a)}
                  onWeightsChange={(w) => updateEpisodeWeights(idx, w)}
                />
              </PopoverBox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EpisodePopoverContent({
  episodeIndex,
  title,
  finale,
  archetype,
  weights,
  dimExp,
  dimCutoff,
  dimFloor,
  onArchetypeChange,
  onWeightsChange,
}: {
  episodeIndex: number;
  title: string;
  finale: boolean;
  archetype: ArchetypeId | null;
  weights: Record<BaseStat, number>;
  dimExp: number;
  dimCutoff: number;
  dimFloor: number;
  onArchetypeChange: (a: ArchetypeId) => void;
  onWeightsChange: (w: Record<BaseStat, number>) => void;
}) {
  return (
    <>
      <h3 className="text-sm font-medium text-[#ddd] pr-6 mb-3">
        <span className="mr-1.5">
          {finale ? '👑' : (archetype ? ARCHETYPES[archetype].icon : '❓')}
        </span>
        {title}
      </h3>

      <PlacementProbGrid
        episodeIndex={episodeIndex}
        finale={finale}
        dimExp={dimExp}
        dimCutoff={dimCutoff}
        dimFloor={dimFloor}
      />

      {!finale && archetype && (
        <>
          <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1">
            Episode Type
          </label>
          <select
            value={archetype}
            onChange={(e) => onArchetypeChange(e.target.value as ArchetypeId)}
            className="w-full mb-4 px-2 py-1.5 bg-[#0a0a10] border border-[#2a2a3a] rounded text-xs text-[#ddd] focus:outline-none focus:border-amber-500/50"
          >
            {ARCHETYPE_IDS.map((id) => (
              <option key={id} value={id}>
                {formatArchetypeOption(id)}
              </option>
            ))}
          </select>

          <label className="block text-[10px] uppercase tracking-wider text-[#666] mb-1">
            Stat Weights
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BASE_STATS.map((stat) => (
              <div
                key={stat}
                className="flex flex-col items-center gap-1 p-2 bg-[#0a0a10] border border-[#2a2a3a] rounded"
              >
                <span className="text-[10px] font-mono text-[#888]">
                  {STAT_CODE[stat]}
                </span>
                <StatInput
                  value={weights[stat] ?? 0}
                  min={0}
                  max={100}
                  onCommit={(v) => {
                    if (v === (weights[stat] ?? 0)) return;
                    const next = { ...weights };
                    next[stat] = v;
                    onWeightsChange(next);
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

type GridRow = { key: Placement | 'ELIM' | 'P.ELIM'; label: string };

const FULL_ROWS: GridRow[] = [
  { key: 'WIN', label: 'WIN' },
  { key: 'HIGH', label: 'HIGH' },
  { key: 'SAFE', label: 'SAFE' },
  { key: 'LOW', label: 'LOW' },
  { key: 'BTM2', label: 'BTM2' },
  { key: 'ELIM', label: 'ELIM' },
  { key: 'P.ELIM', label: 'P.ELIM' },
];

const FINALE_ROWS: GridRow[] = [
  { key: 'WIN', label: 'WIN' },
  { key: 'ELIM', label: 'ELIM' },
  { key: 'P.ELIM', label: 'P.ELIM' },
];

function PlacementProbGrid({
  episodeIndex,
  finale,
  dimExp,
  dimCutoff,
  dimFloor,
}: {
  episodeIndex: number;
  finale: boolean;
  dimExp: number;
  dimCutoff: number;
  dimFloor: number;
}) {
  const season = useStore(selectCurrentSeason);
  const baselineResults = useStore((s) => s.baselineResults);
  const filteredResults = useStore((s) => s.filteredResults);
  const results = filteredResults ?? baselineResults;

  if (!results) return null;

  const sortedQueens = [...season.queens].sort(
    (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
  );

  const epPlace = results.episodePlacements[episodeIndex] ?? {};
  const aliveByQ = results.aliveProbByEpisode[episodeIndex] ?? {};
  const elimByQ = results.elimProbByEpisode[episodeIndex] ?? {};

  const rows = finale ? FINALE_ROWS : FULL_ROWS;
  const CELL = 14;
  const GAP = 2;
  const LABEL_W = 34;

  const [hover, setHover] = useState<{
    queenName: string;
    color: string;
    label: string;
    prob: number;
  } | null>(null);

  function prob(queenId: string, key: GridRow['key']): number {
    const alive = aliveByQ[queenId] ?? 0;
    if (key === 'P.ELIM') return Math.max(0, 1 - alive);
    if (key === 'ELIM') return elimByQ[queenId] ?? 0;
    return (epPlace[queenId]?.[key] ?? 0) * alive;
  }

  return (
    <div className="mb-4 flex flex-col items-center" style={{ gap: GAP }}>
      <div
        className="mb-1 h-8 w-full px-1 flex items-center justify-center text-[11px] text-[#ddd] leading-tight text-center"
      >
        {hover ? (
          <span>
            <span style={{ color: hover.color }}>{hover.queenName}</span>
            <span className="text-[#666]"> · </span>
            <span className="font-mono">{hover.label}</span>
            <span className="text-[#666]"> · </span>
            <span className="font-mono">{(hover.prob * 100).toFixed(1)}%</span>
          </span>
        ) : (
          <span className="text-[#555]">Hover a cell</span>
        )}
      </div>
      {rows.map((row) => (
        <div key={row.key} className="flex items-center" style={{ gap: GAP }}>
          <div
            className="text-[9px] font-mono text-[#666] text-right leading-none"
            style={{ width: LABEL_W }}
          >
            {row.label}
          </div>
          {sortedQueens.map((q) => {
            const p = prob(q.id, row.key);
            return (
              <div
                key={q.id}
                className="bg-[#0a0a10] border border-[#2a2a3a]"
                style={{ width: CELL, height: CELL, borderRadius: 2 }}
                onMouseEnter={() =>
                  setHover({ queenName: q.name, color: q.color, label: row.label, prob: p })
                }
                onMouseLeave={() => setHover(null)}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: q.color,
                    opacity:
                      p <= 0
                        ? 0
                        : p >= dimCutoff
                          ? 1
                          : Math.min(1, Math.pow(p / dimCutoff, dimExp) + dimFloor),
                    borderRadius: 1,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
