import { useStore } from '../../store/useStore';
import { BASE_STATS, isFinale, type BaseStat } from '../../engine/types';
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

export default function Timeline() {
  const { currentSeason: season, conditions, updateEpisodeArchetype, updateEpisodeWeights } =
    useStore();

  const conditionEpisodes = new Set(conditions.map((c) => c.episodeIndex));

  return (
    <div className="w-full pt-4 pb-[5px] overflow-visible">
      <div className="flex items-center gap-0 px-6 justify-center flex-wrap">
        {season.episodes.map((episode, idx) => {
          const hasCondition = conditionEpisodes.has(idx);
          const finale = isFinale(episode);
          const effectiveWeights: Record<BaseStat, number> = finale
            ? ({} as Record<BaseStat, number>)
            : episode.weights ?? ARCHETYPES[episode.archetype].weights;

          return (
            <div key={episode.number} className="flex items-center">
              <PopoverBox
                renderTrigger={({ isOpen, toggle }) => (
                  <button
                    onClick={toggle}
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
                  title={episode.challengeName}
                  finale={finale}
                  archetype={finale ? null : episode.archetype}
                  weights={effectiveWeights}
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
  title,
  finale,
  archetype,
  weights,
  onArchetypeChange,
  onWeightsChange,
}: {
  title: string;
  finale: boolean;
  archetype: ArchetypeId | null;
  weights: Record<BaseStat, number>;
  onArchetypeChange: (a: ArchetypeId) => void;
  onWeightsChange: (w: Record<BaseStat, number>) => void;
}) {
  return (
    <>
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
