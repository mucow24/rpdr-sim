import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';


const MARGIN = { top: 24, right: 50, bottom: 40, left: 120 };

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

export default function PlacementDistChart({
  height = 460,
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(520);
  const { currentSeason: season, baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

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

    // Sort queens by expected placement (best at top)
    const sortedQueens = [...season.queens].sort((a, b) => {
      const distA = results.placementDist[a.id] ?? [];
      const distB = results.placementDist[b.id] ?? [];
      const expectedA = distA.reduce((sum, p, i) => sum + p * i, 0);
      const expectedB = distB.reduce((sum, p, i) => sum + p * i, 0);
      return expectedA - expectedB;
    });

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);

    const y = d3
      .scaleBand<string>()
      .domain(sortedQueens.map((q) => q.id))
      .range([0, innerHeight])
      .padding(0.15);

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

    // Stacked bars
    for (const queen of sortedQueens) {
      const dist = results.placementDist[queen.id] ?? [];
      const isFaded =
        selectedQueenId !== null && selectedQueenId !== queen.id;

      let cumX = 0;
      for (let place = 1; place < dist.length; place++) {
        const prob = dist[place];
        if (prob < 0.001) continue;

        const barWidth = x(prob) - x(0);

        g.append('rect')
          .attr('x', x(cumX))
          .attr('y', y(queen.id) ?? 0)
          .attr('width', barWidth)
          .attr('height', y.bandwidth())
          .attr('fill', PLACEMENT_COLORS[place] ?? '#333')
          .attr('opacity', isFaded ? 0.25 : 1)
          .attr('rx', place === 1 ? 2 : 0)
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
            tooltip
              .style('display', 'block')
              .style('left', `${event.clientX + 12}px`)
              .style('top', `${event.clientY - 10}px`)
              .html(
                `<strong>${queen.name}</strong><br/>${place}${suffix} place: ${(prob * 100).toFixed(1)}%`,
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

        cumX += prob;
      }

      // Win % label at the end of the bar
      const winProb = dist[1] ?? 0;
      if (winProb > 0.01) {
        g.append('text')
          .attr('x', x(cumX) + 6)
          .attr('y', (y(queen.id) ?? 0) + y.bandwidth() / 2 + 4)
          .attr('fill', '#666')
          .attr('font-size', '10px')
          .text(`👑 ${(winProb * 100).toFixed(0)}%`);
      }
    }

    return () => {
      d3.selectAll('.placement-tooltip').remove();
    };
  }, [results, season, width, height, selectedQueenId, setSelectedQueenId]);

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Placement Distribution
      </h3>
      {results && <svg ref={svgRef} width={width} height={height} />}
    </div>
  );
}
