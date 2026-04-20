import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { placementEpisodeLabels } from '../../engine/placementEpisodes';
import { useContainerSize } from './common/useContainerSize';
import { computePlacementGridData } from './placementGrid/placementGridData';


const MARGIN = { top: 16, right: 0, bottom: 0, left: 55 };
const Y_PADDING = 0.08;

export default function PlacementGrid() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: plotRef, width, height } = useContainerSize({ width: 680, height: 280 });

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

  const results = filteredResults ?? baselineResults;

  // Derive width from height so cells render square while preserving the
  // row height dictated by the flex row (which stretches to the sibling
  // Queen card). `width` from useContainerSize is still observed for the
  // first paint before numQueens is known.
  const numQueens = season?.queens.length ?? 0;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;
  const rowH = numQueens > 0 ? (innerHeight / numQueens) * (1 - Y_PADDING) : 0;
  const innerWidth = numQueens > 0 ? rowH * 1.5 * numQueens : width - MARGIN.left - MARGIN.right;
  const svgWidth = innerWidth + MARGIN.left + MARGIN.right;

  useEffect(() => {
    if (!svgRef.current || !results) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Sort order + per-row brightness math live in placementGridData (unit
    // tested). The gradient-stop sequence below still lives here because it
    // depends on the chart's coordinate transforms.
    const { rows } = computePlacementGridData(season, results);
    const sortedQueens = rows.map((r) => r.queen);
    const brightnessByQueen = new Map(rows.map((r) => [r.queen.id, r.brightness]));
    const argmaxByQueen = new Map(rows.map((r) => [r.queen.id, r.argmaxPlace]));

    const numQueens = sortedQueens.length;
    // Places 1..N, rendered right-to-left so place 1 is rightmost.
    const placesRightToLeft = d3.range(1, numQueens + 1); // [1, 2, ..., N]

    const x = d3
      .scaleBand<number>()
      .domain([...placesRightToLeft].reverse()) // leftmost = N, rightmost = 1
      .range([0, innerWidth])
      .padding(0); // cells touch for smooth horizontal blending

    const y = d3
      .scaleBand<string>()
      .domain(sortedQueens.map((q) => q.id))
      .range([0, innerHeight])
      .padding(Y_PADDING);

    // Single <defs> for per-row gradients
    const defs = svg.append('defs');

    // Map each final placement to a "Episode N" / "Finale" label for the
    // tooltip, and recover `finaleCohortSize` from the same scan. The divider
    // below uses finaleCohortSize to separate "last place in the finale" from
    // "first eliminated before the finale".
    const { labels: placeEpisodeLabel, finaleCohortSize } =
      placementEpisodeLabels(season);

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
          .style('text-decoration', (id) =>
            id === selectedQueenId ? 'underline' : null,
          )
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
      const brightnessMap = brightnessByQueen.get(queen.id) ?? {};

      const rowY = y(queen.id) ?? 0;
      const rowH = y.bandwidth();

      // Row background (black) so zero-brightness regions are visible
      g.append('rect')
        .attr('x', 0)
        .attr('y', rowY)
        .attr('width', innerWidth)
        .attr('height', rowH)
        .attr('rx', 2)
        .attr('fill', cellBg);

      // Argmax place already computed in placementGridData.
      const argmaxPlace = argmaxByQueen.get(queen.id) ?? placesRightToLeft[0];
      const cellW = x.bandwidth();
      const argmaxX = x(argmaxPlace) ?? 0;
      const argmaxRight = argmaxX + cellW;

      const brightnessAt = (p: number) => brightnessMap[p] ?? 0;

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
        .attr('x2', innerWidth)
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
          addStop((center / innerWidth) * 100, brightnessAt(p));
        } else if (cx >= argmaxRight) {
          // cell right of argmax — first insert the plateau-end stop
          if (!rightPlateauAdded) {
            addStop((argmaxRight / innerWidth) * 100, 1);
            rightPlateauAdded = true;
          }
          const center = cx + cellW / 2;
          addStop((center / innerWidth) * 100, brightnessAt(p));
        } else {
          // this is the argmax cell — open the plateau
          if (!leftPlateauAdded) {
            addStop((argmaxX / innerWidth) * 100, 1);
            leftPlateauAdded = true;
          }
        }
      }
      // If argmax is the rightmost cell, right plateau-end still needs to
      // close at the right edge at full brightness.
      if (!rightPlateauAdded) {
        addStop((argmaxRight / innerWidth) * 100, 1);
      }

      g.append('rect')
        .attr('x', 0)
        .attr('y', rowY)
        .attr('width', innerWidth)
        .attr('height', rowH)
        .attr('rx', 2)
        .attr('fill', `url(#${gradId})`)
        .style('pointer-events', 'none');

      // Selected queen: white dot on argmax cell
      if (queen.id === selectedQueenId) {
        g.append('circle')
          .attr('cx', argmaxX + cellW / 2)
          .attr('cy', rowY + rowH / 2)
          .attr('r', Math.min(cellW, rowH) * 0.15)
          .attr('fill', '#fff')
          .style('pointer-events', 'none');
      }

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
                `<strong>${queen.name}</strong><br/>${label}: ${(prob * 100).toFixed(1)}%<br/>${placeEpisodeLabel[place] ?? ''}`,
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

    // Divider between "last place in the finale" and "first eliminated before
    // the finale". The boundary lives at the left edge of place `finaleCohortSize`
    // (since places are rendered right-to-left, that edge separates finale
    // placements from pre-finale eliminations).
    if (finaleCohortSize > 0 && finaleCohortSize < numQueens) {
      const dividerX = x(finaleCohortSize) ?? 0;
      g.append('line')
        .attr('x1', dividerX)
        .attr('x2', dividerX)
        .attr('y1', -8)
        .attr('y2', innerHeight)
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .style('pointer-events', 'none');
    }

    return () => {
      d3.selectAll('.placement-grid-tooltip').remove();
    };
  }, [results, season, width, height, innerWidth, innerHeight, selectedQueenId, setSelectedQueenId]);

  return (
    <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-[#ddd] mb-3">
        Placement Probability Grid
      </h3>
      <div ref={plotRef} className="flex-1 min-h-0">
        {results ? (
          <svg ref={svgRef} width={svgWidth} height={height} className="overflow-visible" />
        ) : (
          <div className="flex items-center justify-center text-[#444] h-full">
            Running simulations...
          </div>
        )}
      </div>
    </div>
  );
}
