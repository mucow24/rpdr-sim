import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { PLACEMENT_PALETTE } from './common/palette';
import { useContainerWidth } from './common/useContainerSize';
import {
  CHART_PLACEMENTS,
  computeTrajectoryData,
  type TrajectoryEpData,
} from './trajectory/trajectoryData';

// Local override on top of the canonical palette: ELIM is lifted from
// #8b0000 to a brighter red so it stays readable on the dark panel
// background here, where the flow chart's brightness-lifted variant would
// overshoot into pink.
const PLACEMENT_COLORS: Record<string, string> = {
  ...PLACEMENT_PALETTE,
  ELIM: '#b22222',
};

const MARGIN = { top: 24, right: 50, bottom: 48, left: 60 };
const MARGIN_COMPACT = { top: 4, right: 6, bottom: 18, left: 28 };

/** Fractional placement index → pixel y via linear interpolation between
 *  adjacent entries in `yPositions`. The data module returns percentile
 *  indices; here the chart turns them into y pixels. */
function indexToY(idx: number, yPositions: number[]): number {
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, yPositions.length - 1);
  const frac = idx - lo;
  return yPositions[lo] + frac * (yPositions[hi] - yPositions[lo]);
}

type TrajectoryChartProps = {
  height?: number;
  compact?: boolean;
};

export default function TrajectoryChart({ height = 350, compact = false }: TrajectoryChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, width } = useContainerWidth(compact ? 100 : 900, compact ? 40 : 100);
  const [fadeByElim, setFadeByElim] = useState(true);

  const season = useStore(selectCurrentSeason);
  const { selectedQueenId, baselineResults, filteredResults } = useStore();
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

    const margin = compact ? MARGIN_COMPACT : MARGIN;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const numEpisodes = season.episodes.length;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleLinear()
      .domain([1, numEpisodes])
      .range([0, innerWidth]);

    const y = d3
      .scalePoint<string>()
      .domain([...CHART_PLACEMENTS])
      .range([0, innerHeight])
      .padding(0.3);

    const yPositions = CHART_PLACEMENTS.map((p) => y(p)!);

    // Grid lines
    for (const p of CHART_PLACEMENTS) {
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
      .tickFormat((d) => (Number(d) === numEpisodes ? '👑' : `${d}`));
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
        ax
          .selectAll('.tick text')
          .attr('fill', '#666')
          .attr('font-size', compact ? '9px' : '11px'),
      );

    // Y-axis labels
    for (const p of CHART_PLACEMENTS) {
      g.append('text')
        .attr('x', compact ? -4 : -10)
        .attr('y', y(p)!)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('fill', PLACEMENT_COLORS[p])
        .attr('font-size', compact ? '8px' : '11px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(p);
    }

    // Probability derivation (survival + per-ep distribution + percentile
    // fractional indices) lives in computeTrajectoryData. This component
    // converts percentile indices to pixel y via `indexToY`.
    const { epData: rawEpData } = computeTrajectoryData(season, results, queen.id);
    type EpData = TrajectoryEpData & {
      medianY: number;
      p005Y: number; p05Y: number; p25Y: number;
      p75Y: number; p95Y: number; p995Y: number;
    };
    const epData: EpData[] = rawEpData.map((e) => ({
      ...e,
      medianY: indexToY(e.median, yPositions),
      p005Y: indexToY(e.p005, yPositions),
      p05Y: indexToY(e.p05, yPositions),
      p25Y: indexToY(e.p25, yPositions),
      p75Y: indexToY(e.p75, yPositions),
      p95Y: indexToY(e.p95, yPositions),
      p995Y: indexToY(e.p995, yPositions),
    }));

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

    // Bands: widest first, smooth curves. Y-pixel fields are `p…Y` (added by
    // this component); `p…` on the raw epData hold fractional placement
    // indices used by the data module.
    const bands: { y0Key: keyof EpData; y1Key: keyof EpData; baseOpacity: number; id: string }[] = [
      { y0Key: 'p995Y', y1Key: 'p005Y', baseOpacity: 0.08, id: 'band99' },
      { y0Key: 'p95Y', y1Key: 'p05Y', baseOpacity: 0.15, id: 'band90' },
      { y0Key: 'p75Y', y1Key: 'p25Y', baseOpacity: 0.35, id: 'band50' },
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

    // Median line with survival-fade gradient for stroke
    const medianGradUrl = makeSurvivalGradient('medianLine', 0.9);

    const medianLine = d3
      .line<EpData>()
      .x((d) => x(d.ep))
      .y((d) => d.medianY)
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(epData)
      .attr('d', medianLine)
      .attr('fill', 'none')
      .attr('stroke', medianGradUrl)
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    // Right Y-axis: survival probability 0-100%
    const yRight = d3
      .scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    if (!compact) {
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
    }

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
      .attr('stroke-width', compact ? 1 : 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', compact ? 0.5 : 0.6);

    // Hover interaction — dims scale with compact mode. barX/barW sit in the
    // whitespace right of the placement percentage rows.
    const tt = compact
      ? { w: 82, h: 96, pad: 6, headerY: 11, headerFont: '8px', rowStart: 22, rowStep: 10, rowFont: '8px', dividerY: 78, aliveY: 90, offset: 8, topY: 4,
          barX: 62, barW: 12, barTop: 16, barH: 56 }
      : { w: 110, h: 131, pad: 8, headerY: 14, headerFont: '10px', rowStart: 28, rowStep: 13, rowFont: '9px', dividerY: 109, aliveY: 123, offset: 12, topY: 10,
          barX: 82, barW: 18, barTop: 22, barH: 75 };

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
        tooltipG.selectAll('.tt-bar').remove();
        tooltipG.selectAll('line').remove();
        tooltipG.style('display', null);

        const ttX = x(ep) + tt.offset;
        const flipLeft = ttX + tt.w > innerWidth;
        const finalX = flipLeft ? x(ep) - tt.w - tt.offset : ttX;
        const ttY = tt.topY;

        tooltipG
          .append('text')
          .attr('x', finalX + tt.pad)
          .attr('y', ttY + tt.headerY)
          .attr('fill', '#888')
          .attr('font-size', tt.headerFont)
          .attr('font-weight', 'bold')
          .text(`Episode ${ep}`);

        CHART_PLACEMENTS.forEach((p, idx) => {
          const pct = (data.dist[p] ?? 0) * 100;
          tooltipG
            .append('text')
            .attr('x', finalX + tt.pad)
            .attr('y', ttY + tt.rowStart + idx * tt.rowStep)
            .attr('fill', PLACEMENT_COLORS[p])
            .attr('font-size', tt.rowFont)
            .attr('font-family', 'monospace')
            .text(`${p.padEnd(4)} ${pct.toFixed(1).padStart(5)}%`);
        });

        // Stacked bar breakdown of conditional placement percentages. Matches the
        // flow tooltip bar styling (base ELIM color, thin slate outline).
        const barTotal = CHART_PLACEMENTS.reduce((s, p) => s + (data.dist[p] ?? 0), 0);
        if (barTotal > 0) {
          const barG = tooltipG.append('g').attr('class', 'tt-bar');
          let yOff = 0;
          for (const p of CHART_PLACEMENTS) {
            const v = data.dist[p] ?? 0;
            if (v < 0.001) continue;
            const segH = (v / barTotal) * tt.barH;
            const segColor = p === 'ELIM' ? '#8b0000' : PLACEMENT_COLORS[p];
            barG.append('rect')
              .attr('x', finalX + tt.barX)
              .attr('y', ttY + tt.barTop + yOff)
              .attr('width', tt.barW)
              .attr('height', segH)
              .attr('fill', segColor);
            yOff += segH;
          }
          barG.append('rect')
            .attr('x', finalX + tt.barX)
            .attr('y', ttY + tt.barTop)
            .attr('width', tt.barW)
            .attr('height', tt.barH)
            .attr('fill', 'none')
            .attr('stroke', '#3e5d78')
            .attr('stroke-width', 1);
        }

        // Survival line
        tooltipG
          .append('line')
          .attr('x1', finalX + tt.pad)
          .attr('x2', finalX + tt.w - tt.pad)
          .attr('y1', ttY + tt.dividerY)
          .attr('y2', ttY + tt.dividerY)
          .attr('stroke', '#2a2a3a');

        tooltipG
          .append('text')
          .attr('x', finalX + tt.pad)
          .attr('y', ttY + tt.aliveY)
          .attr('fill', '#e74c3c')
          .attr('font-size', tt.rowFont)
          .attr('font-family', 'monospace')
          .text(`Alive ${(data.survival * 100).toFixed(1).padStart(5)}%`);

        tooltipBg
          .attr('x', finalX)
          .attr('y', ttY)
          .attr('width', tt.w)
          .attr('height', tt.h);
      })
      .on('mouseleave', () => {
        hoverLine.style('display', 'none');
        tooltipG.style('display', 'none');
      });

    if (!compact) {
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
    }

  }, [results, queen, width, height, season.episodes.length, fadeByElim, compact]);

  return (
    <div ref={containerRef} className="w-full relative">
      {queen && results && (
        <>
          {!compact && (
            <label className="absolute top-7 right-14 flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={fadeByElim}
                onChange={() => setFadeByElim((v) => !v)}
                className="accent-[#e74c3c] w-3 h-3 cursor-pointer"
              />
              <span className="text-[10px] text-[#666] font-mono">Shade by survival</span>
            </label>
          )}
          <svg ref={svgRef} width={width} height={height} />
        </>
      )}
    </div>
  );
}
