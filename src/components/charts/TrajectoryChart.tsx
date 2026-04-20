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
const ANIM_DURATION_MS = 300;

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
  // Track the last queen shown so we only wipe the survival line on actual
  // queen→queen changes. `undefined` = first render, `null` = no queen.
  const prevQueenIdRef = useRef<string | null | undefined>(undefined);

  const season = useStore(selectCurrentSeason);
  const { selectedQueenId, baselineResults, filteredResults } = useStore();
  const results = filteredResults ?? baselineResults;

  const queen = selectedQueenId && results
    ? season.queens.find((q) => q.id === selectedQueenId) ?? null
    : null;
  const selectedQueen = selectedQueenId
    ? season.queens.find((q) => q.id === selectedQueenId) ?? null
    : null;
  const showRunningOverlay = !!selectedQueen && !results;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const margin = compact ? MARGIN_COMPACT : MARGIN;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const numEpisodes = season.episodes.length;

    // Scales
    const x = d3.scaleLinear().domain([1, numEpisodes]).range([0, innerWidth]);
    const y = d3
      .scalePoint<string>()
      .domain([...CHART_PLACEMENTS])
      .range([0, innerHeight])
      .padding(0.3);
    const yPositions = CHART_PLACEMENTS.map((p) => y(p)!);
    const yRight = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

    // First-mount structure: named sub-groups preserve z-order and let the
    // band/median paths stay mounted across re-renders so they can TWEEN
    // between queens rather than being torn down and rebuilt. Static layers
    // (grid, axes, labels, tooltip, title) are still rebuilt each render.
    let root = svg.select<SVGGElement>('g.traj-root');
    if (root.empty()) {
      root = svg.append<SVGGElement>('g').attr('class', 'traj-root');
      root.append('defs');
      root.append('g').attr('class', 'traj-grid');
      root.append('g').attr('class', 'traj-xaxis');
      root.append('g').attr('class', 'traj-ylabels');
      const bands = root.append('g').attr('class', 'traj-bands');
      // Pre-create the 3 band paths. Widest-first so inner bands overlay the
      // outer ones and compound-opacity reads as distinct ribbons.
      bands.append('path').attr('class', 'traj-band').attr('data-band', 'band99');
      bands.append('path').attr('class', 'traj-band').attr('data-band', 'band90');
      bands.append('path').attr('class', 'traj-band').attr('data-band', 'band50');
      root
        .append('path')
        .attr('class', 'traj-median')
        .attr('fill', 'none')
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round');
      root.append('g').attr('class', 'traj-yright');
      root
        .append('path')
        .attr('class', 'traj-survival')
        .attr('fill', 'none')
        .attr('stroke', '#e74c3c')
        .attr('stroke-dasharray', '4,3');
      root.append('g').attr('class', 'traj-hover');
      root.append('text').attr('class', 'traj-title');
      root.append('text').attr('class', 'traj-simcount');
    }
    root.attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = root.select<SVGDefsElement>('defs');

    // -- Static layers: grid, axes, labels (rebuild each render) ----------

    const grid = root.select<SVGGElement>('g.traj-grid');
    grid.selectAll('*').remove();
    for (const p of CHART_PLACEMENTS) {
      grid
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y(p)!)
        .attr('y2', y(p)!)
        .attr('stroke', '#1a1a2a')
        .attr('stroke-dasharray', '2,4');
    }

    const xAxis = d3
      .axisBottom(x)
      .ticks(numEpisodes)
      .tickFormat((d) => (Number(d) === numEpisodes ? '👑' : `${d}`));
    const xAxisG = root.select<SVGGElement>('g.traj-xaxis');
    xAxisG.selectAll('*').remove();
    xAxisG
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

    const ylabels = root.select<SVGGElement>('g.traj-ylabels');
    ylabels.selectAll('*').remove();
    for (const p of CHART_PLACEMENTS) {
      ylabels
        .append('text')
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

    // -- Trajectory data --------------------------------------------------
    //
    // When no queen is selected we synthesize a "collapsed" epData where all
    // y-values sit on the x-axis (innerHeight) and survival=0. This lets the
    // bands/median/survival paths animate DOWN to the baseline on deselect and
    // back UP on reselect, using the same tweening pipeline.

    type EpData = TrajectoryEpData & {
      medianY: number;
      p005Y: number; p05Y: number; p25Y: number;
      p75Y: number; p95Y: number; p995Y: number;
    };
    let epData: EpData[];
    if (queen && results) {
      const { epData: rawEpData } = computeTrajectoryData(season, results, queen.id);
      epData = rawEpData.map((e) => ({
        ...e,
        medianY: indexToY(e.median, yPositions),
        p005Y: indexToY(e.p005, yPositions),
        p05Y: indexToY(e.p05, yPositions),
        p25Y: indexToY(e.p25, yPositions),
        p75Y: indexToY(e.p75, yPositions),
        p95Y: indexToY(e.p95, yPositions),
        p995Y: indexToY(e.p995, yPositions),
      }));
    } else {
      // CRT-style collapse: all bands/median/survival pinched to the vertical
      // midpoint of the plot so deselect squishes inward and reselect expands
      // outward. survival=0.5 puts the survival line at innerHeight/2 via the
      // right y-axis scale, matching the data paths visually.
      const midY = innerHeight / 2;
      epData = Array.from({ length: numEpisodes }, (_, i) => ({
        ep: i + 1,
        median: 0,
        p005: 0, p05: 0, p25: 0, p75: 0, p95: 0, p995: 0,
        survival: 0.5,
        dist: {},
        medianY: midY,
        p005Y: midY, p05Y: midY, p25Y: midY,
        p75Y: midY, p95Y: midY, p995Y: midY,
      }));
    }

    if (epData.length === 0) return;

    const queenColor = queen?.color ?? '#666';

    // -- Gradients (mounted; stops tween on queen change) ----------------
    //
    // Each gradient has one <stop> per episode. Stops animate their color
    // (new queen's color) and stop-opacity (new queen's survival * base).
    // Stops are keyed by episode index so the DOM set is stable as long as
    // the number of episodes doesn't change mid-session.
    function updateGradient(id: string, baseOpacity: number): string {
      let grad = defs.select<SVGLinearGradientElement>(`#${id}`);
      if (grad.empty()) {
        grad = defs
          .append<SVGLinearGradientElement>('linearGradient')
          .attr('id', id)
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 1)
          .attr('y2', 0);
      }

      const stops = grad
        .selectAll<SVGStopElement, EpData>('stop')
        .data(epData, (d) => d.ep);

      const stopOpacityFor = (d: EpData) =>
        queen ? (fadeByElim ? baseOpacity * d.survival : baseOpacity) : 0;

      // New stops (first render or episode count grew) start at the target
      // color/opacity — no animation from nothing.
      const stopsEnter = stops
        .enter()
        .append('stop')
        .attr('offset', (d) => `${(x(d.ep) / innerWidth) * 100}%`)
        .attr('stop-color', queenColor)
        .attr('stop-opacity', stopOpacityFor);

      stops.exit().remove();

      // Existing stops: offset re-anchors to current width (no transition —
      // resize feels wrong if sliding); color & opacity tween to new queen.
      stops
        .attr('offset', (d) => `${(x(d.ep) / innerWidth) * 100}%`)
        .transition()
        .duration(ANIM_DURATION_MS)
        .ease(d3.easeCubicInOut)
        .attr('stop-color', queenColor)
        .attr('stop-opacity', stopOpacityFor);

      // The enter selection's attr calls above are instantaneous; no need to
      // animate them separately.
      void stopsEnter;

      return `url(#${id})`;
    }

    // -- Bands + median: d, fill/stroke gradient all tween ----------------

    type BandSpec = { y0Key: keyof EpData; y1Key: keyof EpData; baseOpacity: number; id: string };
    const bandSpecs: BandSpec[] = [
      { y0Key: 'p995Y', y1Key: 'p005Y', baseOpacity: 0.08, id: 'band99' },
      { y0Key: 'p95Y', y1Key: 'p05Y', baseOpacity: 0.15, id: 'band90' },
      { y0Key: 'p75Y', y1Key: 'p25Y', baseOpacity: 0.35, id: 'band50' },
    ];

    for (const spec of bandSpecs) {
      const gradUrl = updateGradient(spec.id, spec.baseOpacity);
      const area = d3
        .area<EpData>()
        .x((d) => x(d.ep))
        .y0((d) => d[spec.y0Key] as number)
        .y1((d) => d[spec.y1Key] as number)
        .curve(d3.curveMonotoneX);

      const bandPath = root.select<SVGPathElement>(`path.traj-band[data-band="${spec.id}"]`);
      // Fill ref (url(#...)) doesn't need transitioning — the gradient stops
      // themselves tween. Only `d` needs a transition.
      bandPath.attr('fill', gradUrl);
      const currentD = bandPath.attr('d');
      const targetD = area(epData) ?? '';
      if (!currentD) {
        bandPath.attr('d', targetD);
      } else {
        bandPath.transition().duration(ANIM_DURATION_MS).ease(d3.easeCubicInOut).attr('d', targetD);
      }
    }

    const medianGradUrl = updateGradient('medianLine', 0.9);
    const medianLine = d3
      .line<EpData>()
      .x((d) => x(d.ep))
      .y((d) => d.medianY)
      .curve(d3.curveMonotoneX);
    const medianPath = root.select<SVGPathElement>('path.traj-median');
    medianPath.attr('stroke', medianGradUrl);
    {
      const currentD = medianPath.attr('d');
      const targetD = medianLine(epData) ?? '';
      if (!currentD) {
        medianPath.attr('d', targetD);
      } else {
        medianPath.transition().duration(ANIM_DURATION_MS).ease(d3.easeCubicInOut).attr('d', targetD);
      }
    }

    // -- Right y-axis (static, rebuild) -----------------------------------

    const yrightG = root.select<SVGGElement>('g.traj-yright');
    yrightG.selectAll('*').remove();
    if (!compact) {
      const rightAxis = d3
        .axisRight(yRight)
        .ticks(5)
        .tickFormat((d) => `${(d as number) * 100}%`);
      yrightG
        .attr('transform', `translate(${innerWidth},0)`)
        .call(rightAxis)
        .call((ax) => ax.select('.domain').attr('stroke', '#2a2a3a'))
        .call((ax) => ax.selectAll('.tick line').attr('stroke', '#2a2a3a'))
        .call((ax) =>
          ax
            .selectAll('.tick text')
            .attr('fill', '#e74c3c')
            .attr('font-size', '9px')
            .attr('opacity', 0.6),
        );
    }

    // -- Survival line ----------------------------------------------------
    //
    // The `d` tweens between queens via d3's string interpolator (vertex count
    // is stable since `numEpisodes` is fixed per season). Opacity fades with
    // queen presence. A clip-path rect wipes left-to-right AFTER the bands/
    // median settle for any queen "turn on" (null→queen or queen→queen).
    // Deselect (queen→null) uses the opacity fade alone — no wipe.

    const survivalLine = d3
      .line<EpData>()
      .x((d) => x(d.ep))
      .y((d) => yRight(d.survival))
      .curve(d3.curveMonotoneX);

    let clipRect = defs.select<SVGRectElement>('#survivalClip rect');
    if (clipRect.empty()) {
      clipRect = defs
        .append('clipPath')
        .attr('id', 'survivalClip')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0);
    }
    clipRect.attr('height', innerHeight);

    const prevQueenId = prevQueenIdRef.current;
    const queenTurningOn = queen !== null && prevQueenId !== queen.id;
    prevQueenIdRef.current = queen?.id ?? null;

    const survivalTargetOpacity = queen ? (compact ? 0.5 : 0.6) : 0;
    const survivalPath = root
      .select<SVGPathElement>('path.traj-survival')
      .attr('stroke-width', 2)
      .attr('clip-path', 'url(#survivalClip)');

    const currentSurvivalD = survivalPath.attr('d');
    const targetSurvivalD = survivalLine(epData) ?? '';
    if (!currentSurvivalD) {
      survivalPath.attr('d', targetSurvivalD).attr('opacity', survivalTargetOpacity);
    } else {
      survivalPath
        .transition()
        .duration(ANIM_DURATION_MS)
        .ease(d3.easeCubicInOut)
        .attr('d', targetSurvivalD)
        .attr('opacity', survivalTargetOpacity);
    }

    if (queenTurningOn) {
      clipRect
        .interrupt()
        .attr('width', 0)
        .transition()
        .delay(ANIM_DURATION_MS)
        .duration(900)
        .ease(d3.easeCubicOut)
        .attr('width', innerWidth);
    } else {
      // Deselect or no-op: no wipe, opacity fade carries it.
      clipRect.interrupt().attr('width', innerWidth);
    }

    // -- Hover overlay (rebuild each render; closures capture fresh data) -

    const tt = compact
      ? {
          w: 82, h: 96, pad: 6, headerY: 11, headerFont: '8px',
          rowStart: 22, rowStep: 10, rowFont: '8px', dividerY: 78, aliveY: 90,
          offset: 8, topY: 4, barX: 62, barW: 12, barTop: 16, barH: 56,
        }
      : {
          w: 110, h: 131, pad: 8, headerY: 14, headerFont: '10px',
          rowStart: 28, rowStep: 13, rowFont: '9px', dividerY: 109, aliveY: 123,
          offset: 12, topY: 10, barX: 82, barW: 18, barTop: 22, barH: 75,
        };

    const hoverG = root.select<SVGGElement>('g.traj-hover');
    hoverG.selectAll('*').remove();

    const hoverLine = hoverG
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#555')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('display', 'none');

    const tooltipG = hoverG.append('g').attr('class', 'traj-tooltip').style('display', 'none');
    const tooltipBg = tooltipG
      .append('rect')
      .attr('rx', 4)
      .attr('fill', '#1a1a24')
      .attr('stroke', '#2a2a3a')
      .attr('stroke-width', 1);

    hoverG
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        if (!queen) return;
        const [mx] = d3.pointer(event);
        const epFloat = x.invert(mx);
        const ep = Math.round(epFloat);
        if (ep < 1 || ep > numEpisodes) return;
        const epIdx = ep - 1;
        const data = epData[epIdx];
        if (!data) return;

        hoverLine.attr('x1', x(ep)).attr('x2', x(ep)).style('display', null);

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

        const barTotal = CHART_PLACEMENTS.reduce((s, p) => s + (data.dist[p] ?? 0), 0);
        if (barTotal > 0) {
          const barG = tooltipG.append('g').attr('class', 'tt-bar');
          let yOff = 0;
          for (const p of CHART_PLACEMENTS) {
            const v = data.dist[p] ?? 0;
            if (v < 0.001) continue;
            const segH = (v / barTotal) * tt.barH;
            const segColor = p === 'ELIM' ? '#8b0000' : PLACEMENT_COLORS[p];
            barG
              .append('rect')
              .attr('x', finalX + tt.barX)
              .attr('y', ttY + tt.barTop + yOff)
              .attr('width', tt.barW)
              .attr('height', segH)
              .attr('fill', segColor);
            yOff += segH;
          }
          barG
            .append('rect')
            .attr('x', finalX + tt.barX)
            .attr('y', ttY + tt.barTop)
            .attr('width', tt.barW)
            .attr('height', tt.barH)
            .attr('fill', 'none')
            .attr('stroke', '#3e5d78')
            .attr('stroke-width', 1);
        }

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

        tooltipBg.attr('x', finalX).attr('y', ttY).attr('width', tt.w).attr('height', tt.h);
      })
      .on('mouseleave', () => {
        hoverLine.style('display', 'none');
        tooltipG.style('display', 'none');
      });

    // -- Title + sim count ------------------------------------------------

    const title = root.select<SVGTextElement>('text.traj-title');
    const simcount = root.select<SVGTextElement>('text.traj-simcount');
    if (!compact) {
      title
        .attr('x', 0)
        .attr('y', -8)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', queenColor)
        .text(queen ? `Trajectory — ${queen.name}` : '');
      simcount
        .attr('x', innerWidth)
        .attr('y', -8)
        .attr('text-anchor', 'end')
        .attr('fill', '#555')
        .attr('font-size', '10px')
        .text(queen && results ? `${results.numSimulations.toLocaleString()} simulations` : '');
    } else {
      title.text('');
      simcount.text('');
    }
  }, [results, queen, width, height, season, fadeByElim, compact]);

  return (
    <div ref={containerRef} className="w-full relative">
      {!compact && queen && (
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
      {showRunningOverlay && selectedQueen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-mono font-bold uppercase"
            style={{ color: selectedQueen.color, fontSize: '11px' }}
          >
            Running simulations...
          </span>
        </div>
      )}
    </div>
  );
}
