import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';


const MARGIN = { top: 32, right: 16, bottom: 16, left: 120 };

export default function PlacementGrid({
  height = 460,
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(520);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 100) setWidth(Math.floor(w));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { currentSeason: season, baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

  const results = filteredResults ?? baselineResults;

  useEffect(() => {
    if (!svgRef.current || !results) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Sort queens by argmax(placement probability) ascending (mode at top of
    // grid goes to 1st place), with expected placement as a tiebreaker.
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

    const numQueens = sortedQueens.length;
    // Places 1..N, rendered right-to-left so place 1 is rightmost.
    const placesRightToLeft = d3.range(1, numQueens + 1); // [1, 2, ..., N]

    // Square grid: clamp to whichever inner dimension is smaller so cells stay
    // square regardless of container width.
    const gridSize = Math.max(0, Math.min(innerWidth, innerHeight));

    const x = d3
      .scaleBand<number>()
      .domain([...placesRightToLeft].reverse()) // leftmost = N, rightmost = 1
      .range([0, gridSize])
      .padding(0); // cells touch for smooth horizontal blending

    const y = d3
      .scaleBand<string>()
      .domain(sortedQueens.map((q) => q.id))
      .range([0, gridSize])
      .padding(0.08);

    // Single <defs> for per-row gradients
    const defs = svg.append('defs');

    // Column labels (above grid): "👑" at rightmost (place 1), then 2, 3, ..., N
    g.append('g')
      .selectAll('text')
      .data(placesRightToLeft)
      .join('text')
      .attr('x', (d) => (x(d) ?? 0) + x.bandwidth() / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .attr('font-size', (d) => (d === 1 ? '14px' : '10px'))
      .text((d) => (d === 1 ? '👑' : `${d}`));

    // Y axis (queen names) — styled like the other charts
    g.append('g')
      .call(
        d3.axisLeft(y).tickFormat((id) => {
          const q = season.queens.find((q) => q.id === id);
          return q?.name.split(' ')[0] ?? id;
        }),
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', (id) => {
            const q = season.queens.find((q) => q.id === id);
            return q?.color ?? '#888';
          })
          .attr('font-size', '11px')
          .style('cursor', 'pointer')
          .on('click', (_, id) => setSelectedQueenId(id as string)),
      );

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'placement-grid-tooltip')
      .style('position', 'fixed')
      .style('display', 'none')
      .style('background', '#1a1a24')
      .style('border', '1px solid #2a2a3a')
      .style('border-radius', '4px')
      .style('padding', '6px 10px')
      .style('font-size', '12px')
      .style('color', '#ddd')
      .style('pointer-events', 'none')
      .style('z-index', '100');

    // Rows
    const cellBg = '#000';
    for (const queen of sortedQueens) {
      const dist = results.placementDist[queen.id] ?? [];
      const isFaded =
        selectedQueenId !== null && selectedQueenId !== queen.id;

      // Row-normalize: brightest cell in each row is the queen's most likely
      // placement; every other cell is scaled relative to it.
      const rowMax = d3.max(placesRightToLeft, (p) => dist[p] ?? 0) ?? 0;
      const rowY = y(queen.id) ?? 0;
      const rowH = y.bandwidth();
      const fadeMul = isFaded ? 0.3 : 1;

      // Row background (black) so zero-brightness regions are visible
      g.append('rect')
        .attr('x', 0)
        .attr('y', rowY)
        .attr('width', gridSize)
        .attr('height', rowH)
        .attr('rx', 2)
        .attr('fill', cellBg);

      // Find argmax cell — rendered as a crisp solid block; left/right of it
      // fade smoothly into its edges.
      let argmaxPlace = placesRightToLeft[0];
      let argmaxProb = -Infinity;
      for (const p of placesRightToLeft) {
        const pp = dist[p] ?? 0;
        if (pp > argmaxProb) {
          argmaxProb = pp;
          argmaxPlace = p;
        }
      }
      const cellW = x.bandwidth();
      const argmaxX = x(argmaxPlace) ?? 0;
      const argmaxRight = argmaxX + cellW;

      const brightnessAt = (p: number) => {
        const prob = dist[p] ?? 0;
        const normalized = rowMax > 0 ? prob / rowMax : 0;
        return normalized * normalized;
      };

      // Single row-wide gradient: stops at cell centers on either side of the
      // argmax plus two stops (at 1.0) bracketing the argmax cell edges to
      // create a crisp plateau. One rect, one gradient — no seams.
      const gradId = `placement-grad-${queen.id}`;
      const grad = defs
        .append('linearGradient')
        .attr('id', gradId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', gridSize)
        .attr('y2', 0);

      // Iterate places left-to-right (ascending offset).
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
        const cx = x(p) ?? 0;
        if (cx < argmaxX) {
          // cell left of argmax
          const center = cx + cellW / 2;
          addStop((center / gridSize) * 100, brightnessAt(p) * fadeMul);
        } else if (cx >= argmaxRight) {
          // cell right of argmax — first insert the plateau-end stop
          if (!rightPlateauAdded) {
            addStop((argmaxRight / gridSize) * 100, fadeMul);
            rightPlateauAdded = true;
          }
          const center = cx + cellW / 2;
          addStop((center / gridSize) * 100, brightnessAt(p) * fadeMul);
        } else {
          // this is the argmax cell — open the plateau
          if (!leftPlateauAdded) {
            addStop((argmaxX / gridSize) * 100, fadeMul);
            leftPlateauAdded = true;
          }
        }
      }
      // If argmax is the rightmost cell, right plateau-end still needs to
      // close at the right edge at full brightness.
      if (!rightPlateauAdded) {
        addStop((argmaxRight / gridSize) * 100, fadeMul);
      }

      g.append('rect')
        .attr('x', 0)
        .attr('y', rowY)
        .attr('width', gridSize)
        .attr('height', rowH)
        .attr('rx', 2)
        .attr('fill', `url(#${gradId})`)
        .style('pointer-events', 'none');

      // Per-cell invisible hit rects for tooltip/click
      for (const place of placesRightToLeft) {
        const prob = dist[place] ?? 0;
        const cx = x(place) ?? 0;

        g.append('rect')
          .attr('x', cx)
          .attr('y', rowY)
          .attr('width', x.bandwidth())
          .attr('height', rowH)
          .attr('fill', 'transparent')
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            const suffix =
              place === 1
                ? 'st'
                : place === 2
                  ? 'nd'
                  : place === 3
                    ? 'rd'
                    : 'th';
            const label = place === 1 ? '👑 Winner' : `${place}${suffix} place`;
            tooltip
              .style('display', 'block')
              .style('left', `${event.clientX + 12}px`)
              .style('top', `${event.clientY - 10}px`)
              .html(
                `<strong>${queen.name}</strong><br/>${label}: ${(prob * 100).toFixed(1)}%`,
              );
          })
          .on('mousemove', (event) => {
            tooltip
              .style('left', `${event.clientX + 12}px`)
              .style('top', `${event.clientY - 10}px`);
          })
          .on('mouseleave', () => {
            tooltip.style('display', 'none');
          })
          .on('click', () => setSelectedQueenId(queen.id));
      }
    }

    return () => {
      d3.selectAll('.placement-grid-tooltip').remove();
    };
  }, [results, season, width, height, selectedQueenId, setSelectedQueenId]);

  if (!results) return null;

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Placement Probability Grid
      </h3>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
