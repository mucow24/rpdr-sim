import { useStore } from '../store/useStore';
import { selectCurrentSeason } from '../store/selectors';
import { INDEX_PLACEMENT, ELIM_PLACEMENT } from '../engine/types';

export default function DivergencePanel() {
  const season = useStore(selectCurrentSeason);
  const { conditions, clearConditions, removeCondition } = useStore();

  if (conditions.length === 0) return null;

  return (
    <div className="bg-[#1a1a24] border border-amber-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-amber-400">
          Active What-Ifs ({conditions.length})
        </h3>
        <button
          onClick={clearConditions}
          className="text-xs text-[#666] hover:text-[#aaa] transition-colors"
        >
          Reset All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {conditions.map((c) => {
          const queen = season.queens[c.queenIndex];
          const isElim = c.placement === ELIM_PLACEMENT;
          const placement = isElim ? 'ELIM' : (INDEX_PLACEMENT[c.placement] ?? '?');
          return (
            <div
              key={`${c.episodeIndex}-${c.queenIndex}`}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
                isElim ? 'bg-red-500/10' : 'bg-amber-500/10'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: isElim ? '#ef4444' : queen?.color }}
              />
              <span className={isElim ? 'text-red-300' : 'text-amber-300'}>
                {queen?.name} {placement} Ep {c.episodeIndex + 1}
              </span>
              <button
                onClick={() =>
                  removeCondition(c.episodeIndex, c.queenIndex)
                }
                className="text-amber-500/50 hover:text-amber-300 transition-colors"
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
