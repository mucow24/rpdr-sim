import { useState, type DragEvent } from 'react';
import { useStore } from '../../store/useStore';
import { PLACEMENTS, PLACEMENT_INDEX, ELIM_PLACEMENT, type Placement } from '../../engine/types';

const PLACEMENT_LABELS: Record<Placement, { label: string; color: string }> = {
  WIN: { label: 'WIN', color: '#ffd700' },
  HIGH: { label: 'HIGH', color: '#a8d8ea' },
  SAFE: { label: 'SAFE', color: '#555' },
  LOW: { label: 'LOW', color: '#e8a87c' },
  BTM2: { label: 'BTM2', color: '#e74c3c' },
};

interface Props {
  episodeIndex: number;
}

export default function EpisodeDetail({ episodeIndex }: Props) {
  const { currentSeason: season, baselineResults, filteredResults, conditions, addCondition, removeCondition } =
    useStore();
  const results = filteredResults ?? baselineResults;
  const [dragOverRow, setDragOverRow] = useState<Placement | 'OUT' | null>(null);
  const [hoveredBtm2, setHoveredBtm2] = useState<number | null>(null);

  if (!results || !results.episodePlacements[episodeIndex]) return null;

  const episode = season.episodes[episodeIndex];
  const epPlacements = results.episodePlacements[episodeIndex];

  // Build queen lists per placement row
  type QueenEntry = {
    queenIndex: number;
    name: string;
    color: string;
    prob: number; // probability of being in this row
    hasCondition: boolean;
    isElim: boolean; // marked for elimination via click
  };

  // Determine who's been eliminated in prior episodes by finding the
  // most-likely eliminated queen at each episode before this one.
  const eliminatedQueenIds = new Set<string>();
  for (let ep = 0; ep < episodeIndex; ep++) {
    const elimProbs = results.elimProbByEpisode[ep];
    if (!elimProbs) continue;
    // Find the queen with the highest elimination probability at this episode,
    // excluding queens already eliminated in earlier episodes.
    let bestId = '';
    let bestProb = 0;
    for (const [qid, prob] of Object.entries(elimProbs)) {
      if (prob > bestProb && !eliminatedQueenIds.has(qid)) {
        bestProb = prob;
        bestId = qid;
      }
    }
    if (bestId && bestProb > 0) eliminatedQueenIds.add(bestId);
  }

  const rows: Record<string, QueenEntry[]> = {};
  for (const p of PLACEMENTS) rows[p] = [];
  const outQueens: QueenEntry[] = [];

  for (let qi = 0; qi < season.queens.length; qi++) {
    const queen = season.queens[qi];
    const isEliminated = eliminatedQueenIds.has(queen.id);

    // Check if there's an active condition overriding this queen's placement
    const activeCondition = conditions.find(
      (c) => c.episodeIndex === episodeIndex && c.queenIndex === qi,
    );

    // Check if there's an ELIM condition for this queen
    const isElimCondition = activeCondition?.placement === ELIM_PLACEMENT;

    if (isEliminated && !activeCondition) {
      outQueens.push({
        queenIndex: qi,
        name: queen.name,
        color: queen.color,
        prob: 0,
        hasCondition: false,
        isElim: false,
      });
      continue;
    }

    const dist = epPlacements[queen.id];

    // Find mode (most common) placement
    let modePlacement: Placement = 'SAFE';
    let modeProb = 0;
    for (const p of PLACEMENTS) {
      const prob = dist?.[p] ?? 0;
      if (prob > modeProb) {
        modeProb = prob;
        modePlacement = p;
      }
    }

    // ELIM conditions keep the queen in BTM2 row with elimination styling
    const targetPlacement = isElimCondition
      ? 'BTM2'
      : activeCondition
        ? (PLACEMENTS[activeCondition.placement] ?? modePlacement)
        : modePlacement;

    const entry: QueenEntry = {
      queenIndex: qi,
      name: queen.name,
      color: queen.color,
      prob: dist[targetPlacement] ?? 0,
      hasCondition: !!activeCondition,
      isElim: !!isElimCondition,
    };

    rows[targetPlacement].push(entry);
  }

  // Sort each row by probability descending
  for (const p of PLACEMENTS) {
    rows[p].sort((a, b) => b.prob - a.prob);
  }

  const handleDragStart = (e: DragEvent, queenIndex: number) => {
    e.dataTransfer.setData('text/plain', String(queenIndex));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: DragEvent, targetPlacement: Placement) => {
    e.preventDefault();
    setDragOverRow(null);
    const queenIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(queenIndex)) return;
    addCondition({
      episodeIndex,
      queenIndex,
      placement: PLACEMENT_INDEX[targetPlacement],
    });
  };

  const handleDragOver = (e: DragEvent, placement: Placement | 'OUT') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverRow(placement);
  };

  const handleDragLeave = () => {
    setDragOverRow(null);
  };

  const handleElimClick = (queenIndex: number) => {
    addCondition({
      episodeIndex,
      queenIndex,
      placement: ELIM_PLACEMENT,
    });
  };

  const QueenChip = ({ entry, inBtm2Row }: { entry: QueenEntry; inBtm2Row?: boolean }) => {
    // Any BTM2 queen can be clicked to eliminate, unless already ELIM (then click removes)
    const canElim = inBtm2Row && !entry.isElim;
    const isHoveredForElim = canElim && hoveredBtm2 === entry.queenIndex;

    const handleClick = () => {
      if (!inBtm2Row) return;
      if (entry.isElim) {
        // Toggle off: remove the ELIM condition
        removeCondition(episodeIndex, entry.queenIndex);
      } else {
        // Eliminate: replaces any existing condition (e.g. BTM2 placement) with ELIM
        handleElimClick(entry.queenIndex);
      }
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, entry.queenIndex)}
        onClick={inBtm2Row ? handleClick : undefined}
        onMouseEnter={canElim ? () => setHoveredBtm2(entry.queenIndex) : undefined}
        onMouseLeave={inBtm2Row ? () => setHoveredBtm2(null) : undefined}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs select-none
          transition-all
          ${entry.isElim
            ? 'bg-red-500/20 border border-red-500/60 ring-1 ring-red-500/30 cursor-pointer'
            : isHoveredForElim
              ? 'bg-red-500/10 border border-red-500/40 cursor-pointer'
              : entry.hasCondition
                ? 'bg-amber-500/15 border border-amber-500/40 ring-1 ring-amber-500/20 cursor-pointer'
                : inBtm2Row
                  ? 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-red-500/40 cursor-pointer'
                  : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] cursor-grab active:cursor-grabbing'
          }
        `}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.isElim ? '#ef4444' : entry.color }}
        />
        <span className={`whitespace-nowrap ${entry.isElim ? 'text-red-300 line-through' : 'text-[#ccc]'}`}>
          {entry.name.split(' ')[0]}
        </span>
        {entry.isElim ? (
          <span className="text-red-400 font-mono font-bold">ELIM</span>
        ) : isHoveredForElim ? (
          <span className="text-red-400 font-mono text-[10px]">click to eliminate</span>
        ) : (
          <span className="text-[#555] font-mono">
            {(entry.prob * 100).toFixed(0)}%
          </span>
        )}
        {entry.hasCondition && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeCondition(episodeIndex, entry.queenIndex);
            }}
            className={`${entry.isElim ? 'text-red-500/50 hover:text-red-300' : 'text-amber-500/50 hover:text-amber-300'} ml-0.5`}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0d0d12] border border-[#1a1a24] rounded-lg p-4 mt-2">
      <div className="text-sm text-[#888] mb-3">
        Ep {episode.number}: {episode.challengeName}
        <span className="text-[#444] ml-2">
          Drag queens between rows to change history
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {PLACEMENTS.map((p) => (
          <div
            key={p}
            onDrop={(e) => handleDrop(e, p)}
            onDragOver={(e) => handleDragOver(e, p)}
            onDragLeave={handleDragLeave}
            className={`
              flex items-center gap-2 p-2 rounded min-h-[40px] transition-colors
              ${dragOverRow === p ? 'bg-[#1a1a2a] ring-1 ring-amber-500/30' : 'bg-[#111118]'}
            `}
          >
            <span
              className="text-[10px] font-mono font-bold w-10 text-right flex-shrink-0"
              style={{ color: PLACEMENT_LABELS[p].color }}
            >
              {PLACEMENT_LABELS[p].label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {rows[p].map((entry) => (
                <QueenChip key={entry.queenIndex} entry={entry} inBtm2Row={p === 'BTM2'} />
              ))}
              {rows[p].length === 0 && (
                <span className="text-[#333] text-xs italic px-2">
                  drop here
                </span>
              )}
            </div>
          </div>
        ))}

        {outQueens.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded bg-[#0a0a0f] mt-1 opacity-50">
            <span className="text-[10px] font-mono font-bold w-10 text-right flex-shrink-0 text-[#333]">
              OUT
            </span>
            <div className="flex flex-wrap gap-1.5">
              {outQueens.map((entry) => (
                <QueenChip key={entry.queenIndex} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
