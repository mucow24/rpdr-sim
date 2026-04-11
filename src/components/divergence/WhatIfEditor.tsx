import { useState, useEffect, type DragEvent } from 'react';
import { useStore } from '../../store/useStore';
import type { Placement } from '../../engine/types';
import { PLACEMENTS } from '../../engine/types';

const PLACEMENT_COLORS: Record<Placement, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#555',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
};

interface Props {
  episodeIndex: number;
  onApply: (outcome: { placements: Record<string, Placement>; eliminated: string[] }) => void;
  onReset: () => void;
}

export default function WhatIfEditor({ episodeIndex, onApply, onReset }: Props) {
  const currentSeason = useStore((s) => s.currentSeason);
  const realSeason = useStore((s) => s.realSeason);
  const episode = currentSeason.episodes[episodeIndex];
  const realEpisode = realSeason.episodes[episodeIndex];

  const activeQueenIds = Object.keys(episode.placements);
  const activeQueens = currentSeason.queens.filter((q) => activeQueenIds.includes(q.id));

  const [placements, setPlacements] = useState<Record<string, Placement>>({ ...episode.placements });
  const [eliminatedIds, setEliminatedIds] = useState<string[]>([...episode.eliminated]);
  const [dragOverRow, setDragOverRow] = useState<Placement | null>(null);
  const [hoveredBtm2, setHoveredBtm2] = useState<string | null>(null);

  useEffect(() => {
    setPlacements({ ...episode.placements });
    setEliminatedIds([...episode.eliminated]);
  }, [episodeIndex, episode]);

  const moveQueen = (queenId: string, targetPlacement: Placement) => {
    setPlacements((prev) => {
      const next = { ...prev };
      // If setting to WIN, demote current winner
      if (targetPlacement === 'WIN') {
        for (const [id, p] of Object.entries(next)) {
          if (p === 'WIN' && id !== queenId) next[id] = 'SAFE';
        }
      }
      next[queenId] = targetPlacement;
      return next;
    });
    // Moving out of BTM2 un-eliminates
    if (targetPlacement !== 'BTM2') {
      setEliminatedIds((prev) => prev.filter((id) => id !== queenId));
    }
  };

  const handleDragStart = (e: DragEvent, queenId: string) => {
    e.dataTransfer.setData('text/plain', queenId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: DragEvent, targetPlacement: Placement) => {
    e.preventDefault();
    setDragOverRow(null);
    const queenId = e.dataTransfer.getData('text/plain');
    if (!queenId) return;
    moveQueen(queenId, targetPlacement);
  };

  const handleDragOver = (e: DragEvent, placement: Placement) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverRow(placement);
  };

  const toggleEliminated = (queenId: string) => {
    setEliminatedIds((prev) =>
      prev.includes(queenId) ? prev.filter((id) => id !== queenId) : [...prev, queenId]
    );
  };

  const handleApply = () => {
    onApply({ placements, eliminated: eliminatedIds });
  };

  const isModified = JSON.stringify(placements) !== JSON.stringify(realEpisode.placements)
    || JSON.stringify(eliminatedIds.sort()) !== JSON.stringify([...realEpisode.eliminated].sort());

  return (
    <div className="bg-[#0d0d12] border border-amber-500/30 rounded-lg p-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-amber-300">
          What If — Ep {episode.number}: {episode.challengeName}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="text-xs text-[#666] hover:text-[#aaa] px-2 py-1 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-3 py-1 rounded transition-colors font-medium"
          >
            {isModified ? 'Simulate from here' : 'Simulate (no changes)'}
          </button>
        </div>
      </div>

      <div className="text-[10px] text-[#444] mb-2">
        Drag queens between rows to change placements. Click a BTM2 queen to eliminate.
      </div>

      <div className="flex flex-col gap-1">
        {PLACEMENTS.map((placement) => {
          const queensInRow = activeQueens.filter((q) => placements[q.id] === placement);
          return (
            <div
              key={placement}
              onDrop={(e) => handleDrop(e, placement)}
              onDragOver={(e) => handleDragOver(e, placement)}
              onDragLeave={() => setDragOverRow(null)}
              className={`flex items-center gap-2 p-2 rounded min-h-[40px] transition-colors
                ${dragOverRow === placement ? 'bg-[#1a1a2a] ring-1 ring-amber-500/30' : 'bg-[#111118]'}
              `}
            >
              <span
                className="text-[10px] font-mono font-bold w-10 text-right flex-shrink-0"
                style={{ color: PLACEMENT_COLORS[placement] }}
              >
                {placement}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {queensInRow.map((queen) => {
                  const isElim = eliminatedIds.includes(queen.id);
                  const isBtm2 = placement === 'BTM2';
                  const isHovered = isBtm2 && !isElim && hoveredBtm2 === queen.id;
                  const wasOriginallyHere = realEpisode.placements[queen.id] === placement;
                  const wasOriginallyElim = realEpisode.eliminated.includes(queen.id);
                  const changed = !wasOriginallyHere || (isElim !== wasOriginallyElim);

                  return (
                    <div
                      key={queen.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, queen.id)}
                      onClick={isBtm2 ? () => toggleEliminated(queen.id) : undefined}
                      onMouseEnter={isBtm2 && !isElim ? () => setHoveredBtm2(queen.id) : undefined}
                      onMouseLeave={isBtm2 ? () => setHoveredBtm2(null) : undefined}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs select-none transition-all
                        ${isElim
                          ? 'bg-red-500/20 border border-red-500/50 cursor-pointer'
                          : isHovered
                            ? 'bg-red-500/10 border border-red-500/40 cursor-pointer'
                            : changed
                              ? 'bg-amber-500/15 border border-amber-500/40 cursor-grab active:cursor-grabbing'
                              : isBtm2
                                ? 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-red-500/40 cursor-pointer'
                                : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] cursor-grab active:cursor-grabbing'
                        }
                      `}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isElim ? '#ef4444' : queen.color }}
                      />
                      <span className={`whitespace-nowrap ${isElim ? 'text-red-300 line-through' : 'text-[#ccc]'}`}>
                        {queen.name.split(' ')[0]}
                      </span>
                      {isElim ? (
                        <span className="text-red-400 font-mono font-bold">ELIM</span>
                      ) : isHovered ? (
                        <span className="text-red-400 font-mono text-[10px]">click to eliminate</span>
                      ) : changed ? (
                        <span className="text-amber-400 font-mono text-[10px]">changed</span>
                      ) : null}
                    </div>
                  );
                })}
                {queensInRow.length === 0 && (
                  <span className="text-[#333] text-xs italic px-2">drop here</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
