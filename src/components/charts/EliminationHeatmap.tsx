import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { isFinale, isPass } from '../../engine/types';


const MARGIN = { top: 24, right: 16, bottom: 40, left: 120 };
const WIDTH = 520;

export default function EliminationHeatmap({
  height = 460,
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = WIDTH;

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
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

    const episodes = season.episodes.map((e) => e.number);
    const finaleEpNums = new Set(
      season.episodes.filter((e) => isFinale(e)).map((e) => e.number),
    );
    const epLabel = (n: number) => (finaleEpNums.has(n) ? 'Finale' : `Ep ${n}`);

    // Sort queens by win probability (best at top)
    const sortedQueens = [...season.queens].sort(
      (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
    );

    const x = d3
      .scaleBand<number>()
      .domain(episodes)
      .range([0, innerWidth])
      .padding(0.08);

    const y = d3
      .scaleBand<string>()
      .domain(sortedQueens.map((q) => q.id))
      .range([0, innerHeight])
      .padding(0.08);

    // Color scale: 0 (safe/green) -> 0.7+ (danger/red)
    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([0.7, 0]); // reversed: high = red

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d) => (finaleEpNums.has(+d) ? 'Finale' : `${d}`)),
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').remove())
      .call((g) =>
        g
          .selectAll('.tick text')
          .attr('fill', '#666')
          .attr('font-size', '10px'),
      );

    // Y axis (queen names)
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
      .attr('class', 'heatmap-tooltip')
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

    // Which episodes are non-elimination? Finales count as elim episodes
    // (they eliminate everyone but the winner). Pass-throughs count as
    // non-elim (no maxi challenge, no one goes home).
    const nonElimEpisodes = new Set(
      season.episodes
        .filter((e) => isPass(e) || (!isFinale(e) && e.eliminated.length === 0))
        .map((e) => e.number),
    );

    // Non-elim cell colors
    const nonElimBg = '#141828';
    const nonElimX = '#2a3050';

    // Cells
    for (const queen of sortedQueens) {
      const isFaded =
        selectedQueenId !== null && selectedQueenId !== queen.id;

      for (let epIdx = 0; epIdx < episodes.length; epIdx++) {
        const ep = episodes[epIdx];
        const elim = results.elimProbByEpisode[epIdx]?.[queen.id] ?? 0;
        const alive = results.aliveProbByEpisode[epIdx]?.[queen.id] ?? 0;
        // Conditional sashay risk: P(eliminated this ep | alive entering it)
        const prob = alive > 0 ? elim / alive : 0;
        const isNonElim = nonElimEpisodes.has(ep);

        const cx = (x(ep) ?? 0) + x.bandwidth() / 2;
        const cy = (y(queen.id) ?? 0) + y.bandwidth() / 2;

        g.append('rect')
          .attr('x', x(ep) ?? 0)
          .attr('y', y(queen.id) ?? 0)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .attr('rx', 2)
          .attr('fill', isNonElim ? nonElimBg : alive > 0.001 ? colorScale(prob) : '#1a1a24')
          .attr('opacity', isFaded ? 0.3 : 1)
          .attr('stroke', '#0f0f13')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            tooltip
              .style('display', 'block')
              .style('left', `${event.clientX + 12}px`)
              .style('top', `${event.clientY - 10}px`)
              .html(
                isNonElim
                  ? `<strong>${queen.name}</strong><br/>${epLabel(ep)}: Non-elimination`
                  : `<strong>${queen.name}</strong><br/>${epLabel(ep)} Sashay Risk: ${(prob * 100).toFixed(1)}%`,
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

        // Draw × for non-elimination episodes
        if (isNonElim) {
          const size = Math.min(x.bandwidth(), y.bandwidth()) * 0.25;
          g.append('line')
            .attr('x1', cx - size).attr('y1', cy - size)
            .attr('x2', cx + size).attr('y2', cy + size)
            .attr('stroke', nonElimX)
            .attr('stroke-width', 1.5)
            .attr('opacity', isFaded ? 0.3 : 1)
            .style('pointer-events', 'none');
          g.append('line')
            .attr('x1', cx + size).attr('y1', cy - size)
            .attr('x2', cx - size).attr('y2', cy + size)
            .attr('stroke', nonElimX)
            .attr('stroke-width', 1.5)
            .attr('opacity', isFaded ? 0.3 : 1)
            .style('pointer-events', 'none');
        }
      }
    }

    return () => {
      d3.selectAll('.heatmap-tooltip').remove();
    };
  }, [results, season, width, height, selectedQueenId, setSelectedQueenId]);

  return (
    <div>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Sashay Risk by Episode
      </h3>
      {results && <svg ref={svgRef} width={width} height={height} />}
    </div>
  );
}
