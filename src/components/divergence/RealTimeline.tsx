import { useStore } from '../../store/useStore';

interface Props {
  divergeIndex: number | null;
  onSelectEpisode: (index: number) => void;
}

export default function RealTimeline({ divergeIndex, onSelectEpisode }: Props) {
  const currentSeason = useStore((s) => s.currentSeason);
  const realSeason = useStore((s) => s.realSeason);

  return (
    <div className="bg-[#121218] rounded-lg border border-[#1a1a24] p-4">
      <h2 className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">
        Season 5 — Real Outcomes
        <span className="text-[#444] normal-case ml-2">Click an episode to create a what-if</span>
      </h2>
      <div className="flex flex-col gap-1">
        {currentSeason.episodes.map((ep, idx) => {
          const realEp = realSeason.episodes[idx];

          const winner = currentSeason.queens.find((q) =>
            ep.placements[q.id] === 'WIN'
          );
          const eliminated = ep.eliminated
            .map((id) => currentSeason.queens.find((q) => q.id === id)?.name.split(' ')[0])
            .filter(Boolean);

          // Diff: compare current vs real placements/eliminated
          const isChanged = JSON.stringify(ep.placements) !== JSON.stringify(realEp.placements)
            || JSON.stringify(ep.eliminated) !== JSON.stringify(realEp.eliminated);
          const isSimulated = divergeIndex !== null && idx > divergeIndex;

          return (
            <button
              key={idx}
              onClick={() => onSelectEpisode(idx)}
              className={`flex items-center gap-3 px-3 py-2 rounded text-left transition-colors text-sm
                ${isChanged
                  ? 'bg-amber-500/15 border border-amber-500/40 ring-1 ring-amber-500/20'
                  : isSimulated
                    ? 'bg-[#0d0d12] border border-[#1a1a24] opacity-40'
                    : 'bg-[#0d0d12] border border-[#1a1a24] hover:border-[#2a2a3a]'
                }
              `}
            >
              <span className="text-[#555] font-mono text-xs w-8 flex-shrink-0">
                Ep {ep.number}
              </span>
              <span className="text-[#888] flex-1 truncate">
                {ep.challengeName}
              </span>
              {winner && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: winner.color }} />
                  <span style={{ color: '#ffd700' }} className="font-medium">
                    {winner.name.split(' ')[0]}
                  </span>
                </span>
              )}
              {eliminated.length > 0 ? (
                <span className="text-red-400/60 text-xs">
                  {eliminated.join(', ')} out
                </span>
              ) : (
                <span className="text-[#333] text-xs italic">
                  non-elim
                </span>
              )}
              {isChanged && (
                <span className="text-amber-400 text-xs font-mono">WHAT-IF</span>
              )}
              {isSimulated && (
                <span className="text-[#555] text-xs font-mono">SIM</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
