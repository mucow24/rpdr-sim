import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { BASE_STATS, isFinale, type BaseStat } from '../../engine/types';
import { ARCHETYPES, ARCHETYPE_IDS, type ArchetypeId } from '../../data/archetypes';

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

export default function Timeline() {
  const { currentSeason: season, conditions, updateEpisodeArchetype, updateEpisodeWeights } =
    useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const conditionEpisodes = new Set(conditions.map((c) => c.episodeIndex));

  return (
    <div className="w-full py-4 overflow-visible">
      <div className="flex items-center gap-0 px-6 justify-center flex-wrap">
        {season.episodes.map((episode, idx) => {
          const hasCondition = conditionEpisodes.has(idx);
          const isOpen = openIdx === idx;
          const finale = isFinale(episode);
          const effectiveWeights: Record<BaseStat, number> = finale
            ? ({} as Record<BaseStat, number>)
            : episode.weights ?? ARCHETYPES[episode.archetype].weights;

          return (
            <div key={episode.number} className="flex items-center">
              <EpisodeBox
                idx={idx}
                isOpen={isOpen}
                hasCondition={hasCondition}
                finale={finale}
                episodeNumber={episode.number}
                icon={finale ? '👑' : (ARCHETYPES[episode.archetype]?.icon ?? '❓')}
                challengeName={episode.challengeName}
                archetype={finale ? null : episode.archetype}
                weights={effectiveWeights}
                onToggle={() => setOpenIdx(isOpen ? null : idx)}
                onClose={() => setOpenIdx(null)}
                onArchetypeChange={(a) => updateEpisodeArchetype(idx, a)}
                onWeightsChange={(w) => updateEpisodeWeights(idx, w)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EpisodeBox({
  idx,
  isOpen,
  hasCondition,
  finale,
  episodeNumber,
  icon,
  challengeName,
  archetype,
  weights,
  onToggle,
  onClose,
  onArchetypeChange,
  onWeightsChange,
}: {
  idx: number;
  isOpen: boolean;
  hasCondition: boolean;
  finale: boolean;
  episodeNumber: number;
  icon: string;
  challengeName: string;
  archetype: ArchetypeId | null;
  weights: Record<BaseStat, number>;
  onToggle: () => void;
  onClose: () => void;
  onArchetypeChange: (a: ArchetypeId) => void;
  onWeightsChange: (w: Record<BaseStat, number>) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on click outside the entire wrapper (button + popover). Using a
  // wrapper-level ref means re-clicking the trigger button goes through the
  // button's onClick (toggle), not through the click-outside handler.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={onToggle}
        className={`
          relative flex flex-col items-center justify-center gap-2.5 w-12 h-12 transition-all
          ${idx > 0 ? '-ml-px' : ''}
          ${
            hasCondition
              ? 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50'
              : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a]'
          }
          ${isOpen ? 'z-10 ring-1 ring-white/20' : ''}
        `}
      >
        <span className="text-base leading-none">{icon}</span>
        <span className="text-[10px] leading-none text-[#888] font-mono">
          {finale ? 'Finale' : `Ep ${episodeNumber}`}
        </span>
        {hasCondition && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
        )}
      </button>

      {isOpen && (
        <EpisodePopover
          title={challengeName}
          finale={finale}
          archetype={archetype}
          weights={weights}
          onClose={onClose}
          onArchetypeChange={onArchetypeChange}
          onWeightsChange={onWeightsChange}
        />
      )}
    </div>
  );
}

/** Popover rendered below the episode box. Uses a layout effect to clamp its
 *  horizontal position so it never overflows the viewport for edge episodes. */
function EpisodePopover({
  title,
  finale,
  archetype,
  weights,
  onClose,
  onArchetypeChange,
  onWeightsChange,
}: {
  title: string;
  finale: boolean;
  archetype: ArchetypeId | null;
  weights: Record<BaseStat, number>;
  onClose: () => void;
  onArchetypeChange: (a: ArchetypeId) => void;
  onWeightsChange: (w: Record<BaseStat, number>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shiftX, setShiftX] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const margin = 8;
    const rect = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    let shift = 0;
    if (rect.right > vw - margin) shift = vw - margin - rect.right;
    else if (rect.left < margin) shift = margin - rect.left;
    setShiftX(shift);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-full mt-2 z-50 w-80 bg-[#121218] border border-[#2a2a3a] rounded-lg shadow-xl p-4"
      style={{ transform: `translateX(calc(-50% + ${shiftX}px))` }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded text-[#666] hover:text-[#ddd] hover:bg-[#1a1a24] transition-colors"
        title="Close"
      >
        ×
      </button>

      <h3 className="text-sm font-medium text-[#ddd] pr-6 mb-3">{title}</h3>

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
    </div>
  );
}

/** Number input that only commits on Enter or blur — avoids re-running the
 *  simulation on every keystroke. */
function StatInput({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const [local, setLocal] = useState(String(value));

  // Sync local when the external value changes (e.g. archetype selection
  // repopulates weights, or another stat box commits and re-renders us).
  useEffect(() => setLocal(String(value)), [value]);

  const commit = () => {
    const v = parseInt(local, 10);
    const clean = Number.isFinite(v) && v >= 0 ? v : 0;
    setLocal(String(clean));
    onCommit(clean);
  };

  return (
    <input
      type="number"
      min={0}
      max={100}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className="w-full px-1 py-0.5 bg-[#121218] border border-[#2a2a3a] rounded text-xs text-[#ddd] text-center focus:outline-none focus:border-amber-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
    />
  );
}
