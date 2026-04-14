import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';

export default function PlacementBitmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cellW, setCellW] = useState(5);
  const [cellH, setCellH] = useState(5);
  const { currentSeason: season, baselineResults, filteredResults } = useStore();
  const results = filteredResults ?? baselineResults;

  useEffect(() => {
    if (!svgRef.current || !results) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const numQueens = season.queens.length;
    const width = numQueens * cellW;
    const height = numQueens * cellH;
    svg.attr('width', width).attr('height', height);

    const defs = svg.append('defs');

    // Sort queens by argmax placement ascending, tiebreak by expected placement.
    const argmaxPlace = (id: string) => {
      const dist = results.placementDist[id] ?? [];
      let best = 1;
      let bestP = -Infinity;
      for (let i = 1; i < dist.length; i++) {
        if ((dist[i] ?? 0) > bestP) {
          bestP = dist[i] ?? 0;
          best = i;
        }
      }
      return best;
    };
    const expectedPlace = (id: string) => {
      const dist = results.placementDist[id] ?? [];
      return dist.reduce((sum, p, i) => sum + p * i, 0);
    };
    const sortedQueens = [...season.queens].sort((a, b) => {
      const am = argmaxPlace(a.id);
      const bm = argmaxPlace(b.id);
      if (am !== bm) return am - bm;
      return expectedPlace(a.id) - expectedPlace(b.id);
    });

    // Places 1..N, rendered right-to-left (place 1 rightmost).
    const placesRightToLeft = d3.range(1, numQueens + 1);

    // Black background for the whole grid.
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#000');

    const xOfPlace = (p: number) => (numQueens - p) * cellW;

    for (let row = 0; row < sortedQueens.length; row++) {
      const queen = sortedQueens[row];
      const dist = results.placementDist[queen.id] ?? [];
      const rowMax = d3.max(placesRightToLeft, (p) => dist[p] ?? 0) ?? 0;
      const rowY = row * cellH;

      // Argmax
      let argmax = placesRightToLeft[0];
      let argmaxProb = -Infinity;
      for (const p of placesRightToLeft) {
        const pp = dist[p] ?? 0;
        if (pp > argmaxProb) {
          argmaxProb = pp;
          argmax = p;
        }
      }
      const argmaxX = xOfPlace(argmax);
      const argmaxRight = argmaxX + cellW;

      const brightnessAt = (p: number) => {
        const prob = dist[p] ?? 0;
        const normalized = rowMax > 0 ? prob / rowMax : 0;
        return normalized * normalized;
      };

      const gradId = `bitmap-grad-${queen.id}`;
      const grad = defs
        .append('linearGradient')
        .attr('id', gradId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0);

      const leftToRight = [...placesRightToLeft].reverse();
      let leftPlateauAdded = false;
      let rightPlateauAdded = false;
      const addStop = (offsetPct: number, opacity: number) => {
        grad
          .append('stop')
          .attr('offset', `${offsetPct}%`)
          .attr('stop-color', queen.color)
          .attr('stop-opacity', opacity);
      };
      for (const p of leftToRight) {
        const cx = xOfPlace(p);
        if (cx < argmaxX) {
          const center = cx + cellW / 2;
          addStop((center / width) * 100, brightnessAt(p));
        } else if (cx >= argmaxRight) {
          if (!rightPlateauAdded) {
            addStop((argmaxRight / width) * 100, 1);
            rightPlateauAdded = true;
          }
          const center = cx + cellW / 2;
          addStop((center / width) * 100, brightnessAt(p));
        } else {
          if (!leftPlateauAdded) {
            addStop((argmaxX / width) * 100, 1);
            leftPlateauAdded = true;
          }
        }
      }
      if (!rightPlateauAdded) {
        addStop((argmaxRight / width) * 100, 1);
      }

      svg.append('rect')
        .attr('x', 0)
        .attr('y', rowY)
        .attr('width', width)
        .attr('height', cellH)
        .attr('fill', `url(#${gradId})`);
    }
  }, [results, season, cellW, cellH]);

  if (!results) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Placement Bitmap
      </h3>
      <div className="flex flex-col gap-1 mb-3 px-1 text-xs text-[#666]">
        <label className="flex items-center gap-2">
          <span className="w-4">W</span>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={cellW}
            onChange={(e) => setCellW(parseInt(e.target.value, 10))}
            className="w-40"
          />
          <span className="tabular-nums w-10 text-[#888]">{cellW}px</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="w-4">H</span>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={cellH}
            onChange={(e) => setCellH(parseInt(e.target.value, 10))}
            className="w-40"
          />
          <span className="tabular-nums w-10 text-[#888]">{cellH}px</span>
        </label>
      </div>
      <svg ref={svgRef} />
    </div>
  );
}
