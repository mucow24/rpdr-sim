import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { PLACEMENTS } from '../../engine/types';

const PLACEMENT_COLORS: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#555',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
};

const MARGIN = { top: 24, right: 50, bottom: 48, left: 60 };

/**
 * Given a discrete placement distribution, find the y-position for a given percentile.
 * Interpolates between placement levels for smooth band edges.
 */
function percentileY(
  dist: Record<string, number>,
  p: number,
  yPositions: number[],
): number {
  let cumProb = 0;
  for (let i = 0; i < PLACEMENTS.length; i++) {
    const prevCum = cumProb;
    cumProb += dist[PLACEMENTS[i]] ?? 0;
    if (cumProb >= p - 1e-9) {
      if (i === 0 || prevCum >= p - 1e-9) return yPositions[i];
      const frac = (p - prevCum) / (cumProb - prevCum);
      return yPositions[i - 1] + frac * (yPositions[i] - yPositions[i - 1]);
    }
  }
  return yPositions[yPositions.length - 1];
}

/** Find the mode (most likely) placement index. */
function modePlacement(dist: Record<string, number>): number {
  let bestIdx = 2; // default SAFE
  let bestProb = 0;
  for (let i = 0; i < PLACEMENTS.length; i++) {
    const prob = dist[PLACEMENTS[i]] ?? 0;
    if (prob > bestProb) {
      bestProb = prob;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export default function TrajectoryChart({ height = 350 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(900);
  const [fadeByElim, setFadeByElim] = useState(true);

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

  const { currentSeason: season, selectedQueenId, baselineResults, filteredResults } = useStore();
  const results = filteredResults ?? baselineResults;

  // Fall back to top-ranked queen (by crown probability) when no selection exists,
  // so the chart always renders something useful.
  const fallbackQueenId = results
    ? season.queens
        .map((q) => ({ id: q.id, p: results.winProb[q.id] ?? 0 }))
        .sort((a, b) => b.p - a.p)[0]?.id ?? null
    : null;
  const effectiveQueenId = selectedQueenId ?? fallbackQueenId;
  const queen = effectiveQueenId
    ? season.queens.find((q) => q.id === effectiveQueenId)
    : null;

  useEffect(() => {
    if (!svgRef.current || !results || !queen) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - MARGIN.left - MARGIN.right;
    const innerHeight = height - MARGIN.top - MARGIN.bottom;
    const numEpisodes = season.episodes.length;

    const g = svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // Scales
    const x = d3
      .scaleLinear()
      .domain([1, numEpisodes])
      .range([0, innerWidth]);

    const y = d3
      .scalePoint<string>()
      .domain([...PLACEMENTS])
      .range([0, innerHeight])
      .padding(0.3);

    const yPositions = PLACEMENTS.map((p) => y(p)!);

    // Grid lines
    for (const p of PLACEMENTS) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y(p)!)
        .attr('y2', y(p)!)
        .attr('stroke', '#1a1a2a')
        .attr('stroke-dasharray', '2,4');
    }

    // X-axis
    const xAxis = d3
      .axisBottom(x)
      .ticks(numEpisodes)
      .tickFormat((d) => `${d}`);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((ax) => ax.select('.domain').attr('stroke', '#2a2a3a'))
      .call((ax) =>
        ax
          .selectAll('.tick line')
          .attr('stroke', '#2a2a3a')
          .clone()
          .attr('y1', -innerHeight)
          .attr('y2', 0)
          .attr('stroke', '#111118')
          .attr('stroke-dasharray', '2,4'),
      )
      .call((ax) =>
        ax.selectAll('.tick text').attr('fill', '#666').attr('font-size', '11px'),
      );

    // Y-axis labels
    for (const p of PLACEMENTS) {
      g.append('text')
        .attr('x', -10)
        .attr('y', y(p)!)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('fill', PLACEMENT_COLORS[p])
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(p);
    }

    // Compute survival probability at each episode
    // survival[ep] = fraction of runs where queen is still alive at episode ep
    const survival: number[] = [];
    for (let epIdx = 0; epIdx < numEpisodes; epIdx++) {
      let cumElim = 0;
      for (let e = 0; e < epIdx; e++) {
        cumElim += results.elimProbByEpisode[e]?.[queen.id] ?? 0;
      }
      survival.push(Math.max(0, 1 - cumElim));
    }

    // Compute per-episode data: percentiles, mode, and survival
    type EpData = {
      ep: number;
      dist: Record<string, number>;
      modeY: number;
      survival: number;
      p005: number; p05: number; p25: number; p75: number; p95: number; p995: number;
    };

    const epData: EpData[] = [];
    for (let epIdx = 0; epIdx < numEpisodes; epIdx++) {
      const epPlacements = results.episodePlacements[epIdx];
      if (!epPlacements) break;
      const dist = epPlacements[queen.id];
      if (!dist) break;
      const total = PLACEMENTS.reduce((sum, p) => sum + (dist[p] ?? 0), 0);
      if (total < 0.001) break;

      epData.push({
        ep: epIdx + 1,
        dist,
        survival: survival[epIdx],
        modeY: yPositions[modePlacement(dist)],
        p005: percentileY(dist, 0.005, yPositions),
        p05: percentileY(dist, 0.05, yPositions),
        p25: percentileY(dist, 0.25, yPositions),
        p75: percentileY(dist, 0.75, yPositions),
        p95: percentileY(dist, 0.95, yPositions),
        p995: percentileY(dist, 0.995, yPositions),
      });
    }

    if (epData.length === 0) return;

    // SVG defs for survival-fade gradients
    const defs = svg.append('defs');

    // Build a horizontal gradient that fades opacity by survival at each episode
    function makeSurvivalGradient(id: string, baseOpacity: number): string {
      const grad = defs.append('linearGradient')
        .attr('id', id)
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', 1).attr('y2', 0);

      for (const d of epData) {
        const pct = ((x(d.ep)) / innerWidth) * 100;
        const opacity = fadeByElim ? baseOpacity * d.survival : baseOpacity;
        grad.append('stop')
          .attr('offset', `${pct}%`)
          .attr('stop-color', queen!.color)
          .attr('stop-opacity', opacity);
      }
      return `url(#${id})`;
    }

    // Bands: widest first, smooth curves
    const bands: { y0Key: keyof EpData; y1Key: keyof EpData; baseOpacity: number; id: string }[] = [
      { y0Key: 'p995', y1Key: 'p005', baseOpacity: 0.08, id: 'band99' },
      { y0Key: 'p95', y1Key: 'p05', baseOpacity: 0.15, id: 'band90' },
      { y0Key: 'p75', y1Key: 'p25', baseOpacity: 0.35, id: 'band50' },
    ];

    for (const band of bands) {
      const gradUrl = makeSurvivalGradient(band.id, band.baseOpacity);

      const area = d3
        .area<EpData>()
        .x((d) => x(d.ep))
        .y0((d) => d[band.y0Key] as number)
        .y1((d) => d[band.y1Key] as number)
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(epData)
        .attr('d', area)
        .attr('fill', gradUrl);
    }

    // Mode line with survival-fade gradient for stroke
    const modeGradUrl = makeSurvivalGradient('modeLine', 0.9);

    const modeLine = d3
      .line<EpData>()
      .x((d) => x(d.ep))
      .y((d) => d.modeY)
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(epData)
      .attr('d', modeLine)
      .attr('fill', 'none')
      .attr('stroke', modeGradUrl)
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    // Right Y-axis: survival probability 0-100%
    const yRight = d3
      .scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    const rightAxis = d3
      .axisRight(yRight)
      .ticks(5)
      .tickFormat((d) => `${(d as number) * 100}%`);

    g.append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(rightAxis)
      .call((ax) => ax.select('.domain').attr('stroke', '#2a2a3a'))
      .call((ax) =>
        ax.selectAll('.tick line').attr('stroke', '#2a2a3a'),
      )
      .call((ax) =>
        ax.selectAll('.tick text').attr('fill', '#e74c3c').attr('font-size', '9px').attr('opacity', 0.6),
      );

    // Survival rate line (red dotted)
    const survivalLine = d3
      .line<EpData>()
      .x((d) => x(d.ep))
      .y((d) => yRight(d.survival))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(epData)
      .attr('d', survivalLine)
      .attr('fill', 'none')
      .attr('stroke', '#e74c3c')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.6);

    // Hover interaction
    const hoverLine = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    const tooltipG = g.append('g').attr('class', 'traj-tooltip').style('display', 'none');

    const tooltipBg = tooltipG
      .append('rect')
      .attr('rx', 4)
      .attr('fill', '#1a1a24')
      .attr('stroke', '#2a2a3a')
      .attr('stroke-width', 1);

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const epFloat = x.invert(mx);
        const ep = Math.round(epFloat);
        if (ep < 1 || ep > numEpisodes) return;
        const epIdx = ep - 1;
        const data = epData[epIdx];
        if (!data) return;

        hoverLine
          .attr('x1', x(ep))
          .attr('x2', x(ep))
          .style('display', null);

        tooltipG.selectAll('text').remove();
        tooltipG.style('display', null);

        const ttX = x(ep) + 12;
        const flipLeft = ttX + 110 > innerWidth;
        const finalX = flipLeft ? x(ep) - 122 : ttX;
        const ttY = 10;

        tooltipG
          .append('text')
          .attr('x', finalX + 8)
          .attr('y', ttY + 14)
          .attr('fill', '#888')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text(`Episode ${ep}`);

        PLACEMENTS.forEach((p, idx) => {
          const pct = (data.dist[p] ?? 0) * 100;
          tooltipG
            .append('text')
            .attr('x', finalX + 8)
            .attr('y', ttY + 28 + idx * 13)
            .attr('fill', PLACEMENT_COLORS[p])
            .attr('font-size', '9px')
            .attr('font-family', 'monospace')
            .text(`${p.padEnd(4)} ${pct.toFixed(1).padStart(5)}%`);
        });

        // Survival line
        tooltipG
          .append('line')
          .attr('x1', finalX + 8)
          .attr('x2', finalX + 102)
          .attr('y1', ttY + 96)
          .attr('y2', ttY + 96)
          .attr('stroke', '#2a2a3a');

        tooltipG
          .append('text')
          .attr('x', finalX + 8)
          .attr('y', ttY + 110)
          .attr('fill', '#e74c3c')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .text(`Alive ${(data.survival * 100).toFixed(1).padStart(5)}%`);

        tooltipBg
          .attr('x', finalX)
          .attr('y', ttY)
          .attr('width', 110)
          .attr('height', 118);
      })
      .on('mouseleave', () => {
        hoverLine.style('display', 'none');
        tooltipG.style('display', 'none');
      });

    // Title
    g.append('text')
      .attr('x', 0)
      .attr('y', -8)
      .attr('fill', queen.color)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text(`Trajectory — ${queen.name}`);

    g.append('text')
      .attr('x', innerWidth)
      .attr('y', -8)
      .attr('text-anchor', 'end')
      .attr('fill', '#555')
      .attr('font-size', '10px')
      .text(`${results.numSimulations.toLocaleString()} simulations`);

  }, [results, queen, width, height, season.episodes.length, fadeByElim]);

  return (
    <div ref={containerRef} className="w-full relative">
      {queen && results && (
        <>
          <label className="absolute top-7 right-14 flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={fadeByElim}
              onChange={() => setFadeByElim((v) => !v)}
              className="accent-[#e74c3c] w-3 h-3 cursor-pointer"
            />
            <span className="text-[10px] text-[#666] font-mono">Shade by survival</span>
          </label>
          <svg ref={svgRef} width={width} height={height} />
        </>
      )}
    </div>
  );
}
