import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { isFinale } from '../../engine/types';
import { useContainerWidth } from './common/useContainerSize';
import { computeWinProbData, type LinePoint } from './winProb/winProbData';


function getMargin(width: number) {
  const showLegend = width >= 700;
  return { top: 24, right: showLegend ? 160 : 20, bottom: 40, left: 50, showLegend };
}

export default function WinProbChart({ height = 400 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, width } = useContainerWidth(900);

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
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

    // Probability derivation + queen sort happen in winProbData — pure fn,
    // unit-tested separately. This component owns only layout and interactivity.
    const { episodeNumbers: episodes, lines, baselineLines } = computeWinProbData(
      season,
      results,
      filteredResults && baselineResults ? baselineResults : null,
    );
    const lastIdx = episodes.length - 1;

    const x = d3.scaleLinear().domain([0, lastIdx]).range([0, innerWidth]);
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

    // X axis — one tick per episode (by array index), with last tick labeled
    // 'Finale' when the last episode is a finale
    const finaleIdx = isFinale(season.episodes[lastIdx]) ? lastIdx : -1;
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(d3.range(episodes.length))
          .tickFormat((d) => {
            const i = +d;
            return i === finaleIdx ? 'Finale' : `Ep ${episodes[i]}`;
          }),
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
      .x((d) => x(d.idx))
      .y((d) => y(d.prob))
      .curve(d3.curveMonotoneX);

    const queenMap = new Map(season.queens.map((q) => [q.id, q]));

    // Ghost baseline lines if we have divergent results
    if (baselineLines) {
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
      const legend = g
        .append('g')
        .attr('transform', `translate(${innerWidth + 16}, 0)`);

      lines.forEach(({ queenId }, i) => {
        const queen = queenMap.get(queenId);
        if (!queen) return;
        const reachedFinale = results.aliveProbByEpisode[lastIdx]?.[queenId] ?? 0;
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
          .text(`${queen.name.split(' ')[0]} ${(reachedFinale * 100).toFixed(0)}%`);
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

    const tooltipContent = tooltip.append('g');

    svg
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event, g.node());
        if (mx < 0 || mx > innerWidth) {
          tooltip.style('display', 'none');
          return;
        }
        tooltip.style('display', null);
        // Snap to nearest episode tick (by array index)
        const ep = Math.max(0, Math.min(Math.round(x.invert(mx)), lastIdx));
        const xPos = x(ep);
        tooltipLine.attr('x1', xPos).attr('x2', xPos);

        // Build tooltip entries (all queens, sorted by P(alive) desc)
        const entries = lines
          .map(({ queenId }) => ({
            queenId,
            aliveProb: results.aliveProbByEpisode[ep]?.[queenId] ?? 0,
            crownProb: results.winProbByEpisode[ep]?.[queenId] ?? 0,
          }))
          .sort((a, b) => b.aliveProb - a.aliveProb || b.crownProb - a.crownProb);

        tooltipContent.selectAll('*').remove();

        const PADDING = 3;
        const ROW_H = 13;
        const NAME_COL_W = 46;
        const COL_GAP = 8;
        const ALIVE_COL_W = 46;
        const CROWN_COL_W = 46;
        const TOOLTIP_W =
          PADDING + NAME_COL_W + COL_GAP + ALIVE_COL_W + COL_GAP + CROWN_COL_W + PADDING;

        const bgX = xPos + 6;
        const bgY = 4;
        const nameColRight = bgX + PADDING + NAME_COL_W;
        const aliveColLeft = nameColRight + COL_GAP;
        const crownColLeft = aliveColLeft + ALIVE_COL_W + COL_GAP;
        const headerLine1Y = bgY + PADDING + 9;
        const firstRowY = headerLine1Y + 16;
        const TOOLTIP_H =
          firstRowY + Math.max(0, entries.length - 1) * ROW_H + 3 + PADDING;

        // Headers (left-aligned over each prob column)
        tooltipContent
          .append('text')
          .attr('x', aliveColLeft)
          .attr('y', headerLine1Y)
          .attr('fill', '#888')
          .attr('font-size', '10px')
          .text('P(alive)');

        tooltipContent
          .append('text')
          .attr('x', crownColLeft)
          .attr('y', headerLine1Y)
          .attr('fill', '#888')
          .attr('font-size', '10px')
          .text('P(crown)');

        // Rows: queen name (right-justified) + P(alive) + P(crown) (left-justified)
        entries.forEach((entry, i) => {
          const queen = queenMap.get(entry.queenId);
          const rowY = firstRowY + i * ROW_H;
          const color = queen?.color ?? '#aaa';

          tooltipContent
            .append('text')
            .attr('x', nameColRight)
            .attr('y', rowY)
            .attr('text-anchor', 'end')
            .attr('fill', color)
            .attr('font-size', '11px')
            .text(queen?.name.split(' ')[0] ?? '');

          tooltipContent
            .append('text')
            .attr('x', aliveColLeft)
            .attr('y', rowY)
            .attr('fill', color)
            .attr('font-size', '11px')
            .text(`${(entry.aliveProb * 100).toFixed(1)}%`);

          tooltipContent
            .append('text')
            .attr('x', crownColLeft)
            .attr('y', rowY)
            .attr('fill', color)
            .attr('font-size', '11px')
            .text(`${(entry.crownProb * 100).toFixed(1)}%`);
        });

        tooltipBg
          .attr('x', bgX)
          .attr('y', bgY)
          .attr('width', TOOLTIP_W)
          .attr('height', TOOLTIP_H);
      })
      .on('mouseleave', () => tooltip.style('display', 'none'));
  }, [results, baselineResults, filteredResults, season, width, height, selectedQueenId, setSelectedQueenId]);

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Cumulative survival probability by episode
      </h3>
      {results ? (
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        />
      ) : (
        <div
          className="flex items-center justify-center text-[#444]"
          style={{ height }}
        >
          Running simulations...
        </div>
      )}
    </div>
  );
}
