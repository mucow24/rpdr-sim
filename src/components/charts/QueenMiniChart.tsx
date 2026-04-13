import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { PLACEMENTS } from '../../engine/types';

const ROWS = [...PLACEMENTS, 'ELIM'] as const;
const CELL_W = 6;
const CELL_H = 6;
const GAP = 1;

export default function QueenMiniChart({ queenId }: { queenId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentSeason: season, baselineResults, filteredResults } = useStore();
  const results = filteredResults ?? baselineResults;

  const queen = season.queens.find((q) => q.id === queenId);
  const numEps = season.episodes.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !results || !queen) return;

    const w = numEps * (CELL_W + GAP) - GAP;
    const h = ROWS.length * (CELL_H + GAP) - GAP;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);

    // Parse queen color to RGB
    const hex = queen.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Compute cumulative elimination
    const cumElim: number[] = [];
    let cum = 0;
    for (let ep = 0; ep < numEps; ep++) {
      cum += results.elimProbByEpisode[ep]?.[queenId] ?? 0;
      cumElim[ep] = cum;
    }

    for (let ep = 0; ep < numEps; ep++) {
      const dist = results.episodePlacements[ep]?.[queenId] ?? {};
      for (let ri = 0; ri < ROWS.length; ri++) {
        const row = ROWS[ri];
        const prob = row === 'ELIM' ? cumElim[ep] : (dist[row] ?? 0);
        const x = ep * (CELL_W + GAP);
        const y = ri * (CELL_H + GAP);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${prob})`;
        ctx.fillRect(x, y, CELL_W, CELL_H);
      }
    }
  }, [results, queen, queenId, numEps]);

  if (!results || !queen) return null;

  return (
    <div className="flex items-center gap-2 bg-[#121218] border border-[#1a1a24] rounded px-2 py-1">
      <span className="text-[10px] font-medium" style={{ color: queen.color }}>
        {queen.name.split(' ')[0]}
      </span>
      <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}
