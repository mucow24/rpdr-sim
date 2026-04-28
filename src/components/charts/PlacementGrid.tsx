import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { placementEpisodeLabels } from '../../engine/placementEpisodes';
import { useContainerSize } from './common/useContainerSize';
import { computePlacementGridData } from './placementGrid/placementGridData';


const MARGIN = { top: 4, right: 42, bottom: 18, left: 72 };
const Y_PADDING = 0;

interface Props {
  onSwitch?: () => void;
}

export default function PlacementGrid({ onSwitch }: Props = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: plotRef, width, height } = useContainerSize({ width: 680, height: 280 });

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId, conditions } =
    useStore();

  const results = filteredResults ?? baselineResults;

  // Plot fills its parent (which stretches to fill the 900px top row beside
  // the Queen card).
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

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

    // Column labels (below grid): "👑" at rightmost (place 1), then 2, 3, ..., N
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(x).tickSizeOuter(0).tickFormat((d) => (d === 1 ? '👑' : `${d}`)),
      )
      .call((g) => g.select('.domain').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#2a2a3a'))
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#666')
          .attr('font-size', '10px'),
      );

    // Y axis (queen names) — styled like the other charts
    // Track include/exclude separately so the pin-dot palette can reflect both.
    const pinFlagsByQueen = new Map<string, { include: boolean; exclude: boolean }>();
    for (const c of conditions) {
      const q = season.queens[c.queenIndex];
      if (!q) continue;
      const flags = pinFlagsByQueen.get(q.id) ?? { include: false, exclude: false };
      if (c.mode === 'exclude') flags.exclude = true;
      else flags.include = true;
      pinFlagsByQueen.set(q.id, flags);
    }
    const yAxisG = g.append('g')
      .call(
        d3.axisLeft(y).tickFormat((id) => {
          const q = season.queens.find((q) => q.id === id);
          return (q?.name.split(' ')[0] ?? id).toUpperCase();
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
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .style('cursor', 'pointer')
          .style('text-decoration', (id) =>
            id === selectedQueenId ? 'underline' : null,
          )
          .on('click', (_, id) => setSelectedQueenId(id as string)),
      );

    // Pin dots next to queens with active what-if conditions: gold for
    // include pins, blue for exclude pins, both stacked when a queen has both.
    yAxisG.selectAll<SVGGElement, string>('.tick').each(function (id) {
      const flags = pinFlagsByQueen.get(id);
      if (!flags) return;
      const textNode = d3.select(this).select<SVGTextElement>('text').node();
      if (!textNode) return;
      const bbox = textNode.getBBox();
      const drawDot = (cx: number, fill: string) => {
        d3.select(this)
          .append('circle')
          .attr('cx', cx)
          .attr('cy', 0)
          .attr('r', 2.5)
          .attr('fill', fill)
          .attr('opacity', 0.9);
      };
      if (flags.include && flags.exclude) {
        drawDot(bbox.x - 10, '#ffd700');
        drawDot(bbox.x - 4, '#4fa3ff');
      } else if (flags.include) {
        drawDot(bbox.x - 6, '#ffd700');
      } else {
        drawDot(bbox.x - 6, '#4fa3ff');
      }
    });

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

        // 1.5px border in the queen's color around the selected row. Inset by
        // half the stroke so it sits inside the row.
        const strokeW = 1.5;
        g.append('rect')
          .attr('x', strokeW / 2)
          .attr('y', rowY + strokeW / 2)
          .attr('width', innerWidth - strokeW)
          .attr('height', rowH - strokeW)
          .attr('rx', 2)
          .attr('fill', 'none')
          .attr('stroke', queen.color)
          .attr('stroke-width', strokeW)
          .attr('stroke-opacity', 0.9)
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
        .attr('y1', 0)
        .attr('y2', innerHeight + 8)
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .style('pointer-events', 'none');
    }

    return () => {
      d3.selectAll('.placement-grid-tooltip').remove();
    };
  }, [results, season, width, height, innerWidth, innerHeight, selectedQueenId, setSelectedQueenId, conditions]);

  return (
    <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center mb-1">
        <h3 className="text-sm font-medium text-[#ddd]">
          Placement Probability Grid
        </h3>
        {onSwitch && (
          <button
            onClick={onSwitch}
            title="Switch to Placement Distribution"
            className="ml-auto text-[#666] hover:text-[#ddd] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
        )}
      </div>
      <div ref={plotRef} className="flex-1 min-h-0 relative">
        {results ? (
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="absolute inset-0 overflow-visible"
          />
        ) : (
          <div className="flex items-center justify-center text-[#444] h-full">
            Running simulations...
          </div>
        )}
      </div>
    </div>
  );
}
