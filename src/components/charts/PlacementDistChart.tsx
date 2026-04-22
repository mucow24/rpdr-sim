import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { useContainerSize } from './common/useContainerSize';
import { computePlacementDistData } from './placementDist/placementDistData';


const MARGIN = { top: 4, right: 42, bottom: 18, left: 72 };

// Final-rank palette (1st = gold, 2nd = silver, 3rd = bronze, then darker
// shades for descending finishes). Keyed by 1-based final place; index 0 is a
// hole. Distinct from `PLACEMENT_PALETTE` (which keys per-episode placements
// like WIN/HIGH/SAFE/...).
const PLACEMENT_COLORS = [
  '', // 0th place doesn't exist
  '#ffd700', // 1st - gold
  '#c0c0c0', // 2nd - silver
  '#cd7f32', // 3rd - bronze
  '#8b7355', // 4th
  '#6b5b4f', // 5th
  '#555', // 6th
  '#4a4a4a', // 7th
  '#444', // 8th
  '#3a3a3a', // 9th
  '#333', // 10th
  '#2c2c2c', // 11th
  '#262626', // 12th
  '#222', // 13th
  '#1e1e1e', // 14th
];

interface Props {
  onSwitch?: () => void;
}

export default function PlacementDistChart({ onSwitch }: Props = {}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: plotRef, width, height } = useContainerSize({ width: 400, height: 280 });
  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId, conditions } =
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

    // Pure data derivation: sort by expected placement and precompute
    // stacked-bar segments. See placementDistData.test.ts for invariants.
    const { queens: rows } = computePlacementDistData(season, results);
    const sortedQueens = rows.map((r) => r.queen);

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

    const y = d3
      .scaleBand<string>()
      .domain(sortedQueens.map((q) => q.id))
      .range([0, innerHeight])
      .padding(0);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => `${Math.round(+d * 100)}%`),
      )
      .call((g) => g.select('.domain').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#2a2a3a'))
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#666')
          .attr('font-size', '10px'),
      );

    // Y axis
    const queensWithPins = new Set<string>();
    for (const c of conditions) {
      const q = season.queens[c.queenIndex];
      if (q) queensWithPins.add(q.id);
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

    // Yellow pin dots next to queens with active what-if conditions
    yAxisG.selectAll<SVGGElement, string>('.tick').each(function (id) {
      if (!queensWithPins.has(id)) return;
      const textNode = d3.select(this).select<SVGTextElement>('text').node();
      if (!textNode) return;
      const bbox = textNode.getBBox();
      d3.select(this)
        .append('circle')
        .attr('cx', bbox.x - 6)
        .attr('cy', 0)
        .attr('r', 2.5)
        .attr('fill', '#ffd700')
        .attr('opacity', 0.9);
    });

    // Tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'placement-tooltip')
      .style('position', 'fixed')
      .style('display', 'none')
      .style('background', '#1a1a24')
      .style('border', '1px solid #2a2a3a')
      .style('border-radius', '4px')
      .style('padding', '8px 12px')
      .style('font-size', '12px')
      .style('color', '#ddd')
      .style('pointer-events', 'none')
      .style('z-index', '100');

    // Muted palette for deselected rows (40% saturation, 70% lightness) so
    // the selected queen's gold/silver/bronze stays vivid while season-level
    // shape stays readable.
    const desaturate = (hex: string) => {
      const c = d3.hsl(hex);
      c.s *= 0.4;
      c.l *= 0.7;
      return c.formatHex();
    };

    // Stacked bars — segments + cumBefore precomputed in placementDistData.
    for (const row of rows) {
      const { queen, segments, winProb } = row;
      const isDeselected =
        selectedQueenId !== null && selectedQueenId !== queen.id;

      for (const seg of segments) {
        if (seg.prob < 0.001) continue;
        const barWidth = x(seg.prob) - x(0);
        const baseFill = PLACEMENT_COLORS[seg.place] ?? '#333';

        g.append('rect')
          .attr('x', x(seg.cumBefore))
          .attr('y', y(queen.id) ?? 0)
          .attr('width', barWidth)
          .attr('height', y.bandwidth())
          .attr('fill', isDeselected ? desaturate(baseFill) : baseFill)
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            const suffix =
              seg.place === 1
                ? 'st'
                : seg.place === 2
                  ? 'nd'
                  : seg.place === 3
                    ? 'rd'
                    : 'th';
            tooltip
              .style('display', 'block')
              .style('left', `${event.clientX + 12}px`)
              .style('top', `${event.clientY - 10}px`)
              .html(
                `<strong>${queen.name}</strong><br/>${seg.place}${suffix} place: ${(seg.prob * 100).toFixed(1)}%`,
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

      // Win % label at the end of the bar
      if (winProb > 0.01) {
        const totalCum = segments.reduce((s, seg) => s + seg.prob, 0);
        const label = g.append('text')
          .attr('x', x(totalCum) + 3)
          .attr('y', (y(queen.id) ?? 0) + y.bandwidth() / 2)
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#666')
          .attr('font-size', '11px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace');
        label.append('tspan').attr('dy', '-0.1em').text('👑');
        label.append('tspan').attr('dx', '1').attr('dy', '0.1em').text(`${(winProb * 100).toFixed(0)}%`);
      }
    }

    return () => {
      d3.selectAll('.placement-tooltip').remove();
    };
  }, [results, season, width, height, selectedQueenId, setSelectedQueenId, conditions]);

  return (
    <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center mb-1">
        <h3 className="text-sm font-medium text-[#ddd]">
          Placement Distribution
        </h3>
        {onSwitch && (
          <button
            onClick={onSwitch}
            title="Switch to Placement Probability Grid"
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
            className="absolute inset-0"
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
