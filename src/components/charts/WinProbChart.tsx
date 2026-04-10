import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import type { SimulationResults } from '../../engine/types';

function getMargin(width: number) {
  const showLegend = width >= 700;
  return { top: 24, right: showLegend ? 160 : 20, bottom: 40, left: 50, showLegend };
}

export default function WinProbChart({ height = 400 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);

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
  const { season, baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

  const results = filteredResults ?? baselineResults;

  useEffect(() => {
    if (!svgRef.current || !results) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const MARGIN = getMargin(width);
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const episodes = season.episodes.map((e) => e.number);
    const queenIds = season.queens.map((q) => q.id);

    // Build line data: for each queen, an array of { episode, prob }
    type LinePoint = { episode: number; prob: number };
    const lines: { queenId: string; points: LinePoint[] }[] = queenIds.map(
      (qid) => ({
        queenId: qid,
        points: episodes.map((ep, i) => ({
          episode: ep,
          prob: results.winProbByEpisode[i]?.[qid] ?? 0,
        })),
      }),
    );

    // Sort by final win prob (highest on top in legend)
    lines.sort(
      (a, b) =>
        (b.points[b.points.length - 1]?.prob ?? 0) -
        (a.points[a.points.length - 1]?.prob ?? 0),
    );

    const x = d3.scaleLinear().domain([1, episodes.length]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data([0.25, 0.5, 0.75])
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#1a1a2a')
      .attr('stroke-dasharray', '2,4');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(episodes.length)
          .tickFormat((d) => `Ep ${d}`),
      )
      .call((g) => g.select('.domain').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick text').attr('fill', '#666').attr('font-size', '11px'));

    // Y axis
    g.append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${Math.round(+d * 100)}%`),
      )
      .call((g) => g.select('.domain').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick line').attr('stroke', '#2a2a3a'))
      .call((g) => g.selectAll('.tick text').attr('fill', '#666').attr('font-size', '11px'));

    const line = d3
      .line<LinePoint>()
      .x((d) => x(d.episode))
      .y((d) => y(d.prob))
      .curve(d3.curveMonotoneX);

    const queenMap = new Map(season.queens.map((q) => [q.id, q]));

    // Ghost baseline lines if we have divergent results
    if (filteredResults && baselineResults) {
      const baselineLines: { queenId: string; points: LinePoint[] }[] =
        queenIds.map((qid) => ({
          queenId: qid,
          points: episodes.map((ep, i) => ({
            episode: ep,
            prob: baselineResults.winProbByEpisode[i]?.[qid] ?? 0,
          })),
        }));

      for (const { queenId, points } of baselineLines) {
        const queen = queenMap.get(queenId);
        if (!queen) continue;
        g.append('path')
          .datum(points)
          .attr('fill', 'none')
          .attr('stroke', queen.color)
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.15)
          .attr('stroke-dasharray', '4,4')
          .attr('d', line);
      }
    }

    // Main lines
    for (const { queenId, points } of lines) {
      const queen = queenMap.get(queenId);
      if (!queen) continue;

      const isSelected = selectedQueenId === queenId;
      const isFaded = selectedQueenId !== null && !isSelected;

      const path = g
        .append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', queen.color)
        .attr('stroke-width', isSelected ? 3 : 1.5)
        .attr('stroke-opacity', isFaded ? 0.15 : 0.85)
        .attr('d', line)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedQueenId(queenId));

      // Animate on mount
      const totalLength = (path.node() as SVGPathElement)?.getTotalLength() ?? 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    }

    // Legend (right side) — only shown at wider viewports
    if (MARGIN.showLegend) {
      const topQueens = lines.slice(0, 8);
      const legend = g
        .append('g')
        .attr('transform', `translate(${innerWidth + 16}, 0)`);

      topQueens.forEach(({ queenId, points }, i) => {
        const queen = queenMap.get(queenId);
        if (!queen) return;
        const finalProb = points[points.length - 1]?.prob ?? 0;
        const isSelected = selectedQueenId === queenId;
        const isFaded = selectedQueenId !== null && !isSelected;

        const row = legend
          .append('g')
          .attr('transform', `translate(0, ${i * 20})`)
          .style('cursor', 'pointer')
          .on('click', () => setSelectedQueenId(queenId));

        row
          .append('circle')
          .attr('r', 4)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('fill', queen.color)
          .attr('opacity', isFaded ? 0.3 : 1);

        row
          .append('text')
          .attr('x', 10)
          .attr('y', 4)
          .attr('fill', isFaded ? '#444' : '#aaa')
          .attr('font-size', '11px')
          .attr('font-weight', isSelected ? '600' : '400')
          .text(`${queen.name.split(' ')[0]} ${(finalProb * 100).toFixed(0)}%`);
      });
    }

    // Hover tooltip layer
    const tooltip = g.append('g').style('display', 'none');
    const tooltipLine = tooltip
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#444')
      .attr('stroke-width', 1);

    const tooltipBg = tooltip
      .append('rect')
      .attr('fill', '#1a1a24')
      .attr('stroke', '#2a2a3a')
      .attr('rx', 4);

    const tooltipText = tooltip
      .append('text')
      .attr('fill', '#ddd')
      .attr('font-size', '11px');

    svg
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event, g.node());
        if (mx < 0 || mx > innerWidth) {
          tooltip.style('display', 'none');
          return;
        }
        tooltip.style('display', null);
        const epIdx = Math.round(x.invert(mx)) - 1;
        const ep = Math.max(0, Math.min(epIdx, episodes.length - 1));
        const xPos = x(ep + 1);
        tooltipLine.attr('x1', xPos).attr('x2', xPos);

        // Build tooltip entries
        const entries = lines
          .map(({ queenId, points }) => ({
            queenId,
            prob: points[ep]?.prob ?? 0,
          }))
          .filter((e) => e.prob > 0.005)
          .sort((a, b) => b.prob - a.prob)
          .slice(0, 6);

        tooltipText.selectAll('tspan').remove();
        entries.forEach((entry, i) => {
          const queen = queenMap.get(entry.queenId);
          tooltipText
            .append('tspan')
            .attr('x', xPos + 12)
            .attr('y', 16 + i * 16)
            .attr('fill', queen?.color ?? '#aaa')
            .text(
              `${queen?.name.split(' ')[0]}: ${(entry.prob * 100).toFixed(1)}%`,
            );
        });

        const tooltipH = 8 + entries.length * 16 + 4;
        tooltipBg
          .attr('x', xPos + 6)
          .attr('y', 4)
          .attr('width', 120)
          .attr('height', tooltipH);
      })
      .on('mouseleave', () => tooltip.style('display', 'none'));
  }, [results, baselineResults, filteredResults, season, width, height, selectedQueenId, setSelectedQueenId]);

  if (!results) {
    return (
      <div
        className="flex items-center justify-center text-[#444]"
        style={{ width, height }}
      >
        Running simulations...
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Crown Probability Over Time
      </h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
    </div>
  );
}
