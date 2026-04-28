import { useStore } from '../store/useStore';
import { selectCurrentSeason } from '../store/selectors';
import { INDEX_PLACEMENT, ELIM_PLACEMENT } from '../engine/types';

export default function DivergencePanel() {
  const season = useStore(selectCurrentSeason);
  const { conditions, clearConditions, removeCondition } = useStore();

  const hasConditions = conditions.length > 0;

  // Render always (with reserved min-height) so adding the first pin doesn't
  // pop the panel into existence and reflow the page below the flow chart.
  return (
    <div
      className={`rounded-lg p-4 mb-4 transition-colors ${
        hasConditions
          ? 'bg-[#1a1a24] border border-amber-500/20'
          : 'bg-[#0f0f15] border border-[#1a1a24]'
      }`}
      style={{ minHeight: 76 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${hasConditions ? 'text-amber-400' : 'text-[#444]'}`}>
          {hasConditions ? `Active What-Ifs (${conditions.length})` : 'No active what-ifs'}
        </h3>
        {hasConditions && (
          <button
            onClick={clearConditions}
            className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
          >
            Reset All
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {conditions.map((c) => {
          const queen = season.queens[c.queenIndex];
          const isElim = c.placement === ELIM_PLACEMENT;
          const placement = isElim ? 'ELIM' : (INDEX_PLACEMENT[c.placement] ?? '?');
          const mode = c.mode ?? 'include';
          const isExclude = mode === 'exclude';
          const bgClass = isExclude
            ? 'bg-blue-500/10'
            : isElim
              ? 'bg-red-500/10'
              : 'bg-amber-500/10';
          const textClass = isExclude
            ? 'text-blue-300'
            : isElim
              ? 'text-red-300'
              : 'text-amber-300';
          const dotColor = isExclude ? '#4fa3ff' : isElim ? '#ef4444' : queen?.color;
          const xClass = isExclude
            ? 'text-blue-400/60 hover:text-blue-200'
            : 'text-amber-500/50 hover:text-amber-300';
          return (
            <div
              key={`${c.episodeIndex}-${c.queenIndex}-${c.placement}-${mode}`}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm ${bgClass}`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              <span className={textClass}>
                {queen?.name} {isExclude ? 'NOT ' : ''}{placement} Ep {c.episodeIndex + 1}
              </span>
              <button
                onClick={() =>
                  removeCondition(c.episodeIndex, c.queenIndex, c.placement)
                }
                className={`${xClass} transition-colors`}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
