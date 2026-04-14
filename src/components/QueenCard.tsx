import { useStore } from '../store/useStore';
import type { Queen } from '../engine/types';
import RadarChart from './RadarChart';

export default function QueenCard({ queen }: { queen: Queen }) {
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

  const results = filteredResults ?? baselineResults;
  const isSelected = selectedQueenId === queen.id;

  const winProb = results?.winProb[queen.id] ?? 0;
  const reachedFinaleProb = results?.reachedFinaleProb[queen.id] ?? 0;

  return (
    <button
      onClick={() => setSelectedQueenId(queen.id)}
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full
        ${
          isSelected
            ? 'bg-[#1a1a2a] border-[#3a3a5a]'
            : 'bg-[#121218] border-[#1a1a24] hover:border-[#2a2a3a]'
        }
      `}
    >
      <RadarChart queen={queen} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: queen.color }}
          />
          <span className="text-sm font-medium text-[#ddd] truncate">
            {queen.name}
          </span>
        </div>
        {results && (
          <div className="flex gap-4 text-xs text-[#666]">
            <span>
              Crown:{' '}
              <span className="text-[#aaa] font-mono">
                {(winProb * 100).toFixed(1)}%
              </span>
            </span>
            <span>
              Finale:{' '}
              <span className="text-[#aaa] font-mono">
                {(reachedFinaleProb * 100).toFixed(1)}%
              </span>
            </span>
          </div>
        )}
        <div className="flex gap-1 mt-1.5 text-[10px] text-[#555] font-mono">
          <span>LS: {queen.lipSync}</span>
          <span className="text-[#333]">|</span>
          <span>
            Best:{' '}
            {
              Object.entries(queen.skills).sort(
                ([, a], [, b]) => b - a,
              )[0][0]
            }
          </span>
        </div>
      </div>
    </button>
  );
}
