import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PLACEMENTS, PLACEMENT_INDEX, ELIM_PLACEMENT, type FilterCondition } from '../../engine/types';

/** The 7 rows displayed on the chart */
const CHART_ROWS = [...PLACEMENTS, 'ELIM', 'PREV ELIM'] as const;
type ChartRow = (typeof CHART_ROWS)[number];

const ROW_COLORS: Record<string, string> = {
  WIN: '#3498db',
  HIGH: '#2ecc71',
  SAFE: '#7f8c8d',
  LOW: '#f1c40f',
  BTM2: '#e74c3c',
  ELIM: '#e91e90',
  'PREV ELIM': '#d4a574',
};

export interface ActiveQueen {
  queenId: string;
  queenIndex: number;
  name: string;
  color: string;
  /** Absolute probabilities including ELIM and PREV ELIM — should sum to ~1 */
  distribution: Record<string, number>;
  /** P(queen made it to this episode) = 1 - prevElimProb */
  aliveProb: number;
}

interface Props {
  episodeIndex: number;
  activeQueens: ActiveQueen[];
  conditions: FilterCondition[];
  variant: 'editor' | 'mini';
  height?: number;
  contrastExponent?: number; // 1 = linear, higher = steeper falloff (default 1)
  onConditionAdd?: (c: FilterCondition) => void;
  onConditionRemove?: (episodeIndex: number, queenIndex: number) => void;
}

const EDITOR_MARGIN = { top: 8, right: 12, bottom: 48, left: 8 };
const MINI_MARGIN = { top: 2, right: 2, bottom: 14, left: 2 };

function rowToConditionPlacement(row: ChartRow): number {
  if (row === 'ELIM' || row === 'PREV ELIM') return ELIM_PLACEMENT;
  return PLACEMENT_INDEX[row];
}

export default function SmearChart({
  episodeIndex,
  activeQueens,
  conditions,
  variant,
  height: heightProp,
  contrastExponent = 1,
  onConditionAdd,
  onConditionRemove,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  const isEditor = variant === 'editor';
  const margin = isEditor ? EDITOR_MARGIN : MINI_MARGIN;
  const numRows = CHART_ROWS.length; // 7

  // For mini: derive height from width to make square cells
  const computedHeight = (() => {
    if (heightProp) return heightProp;
    if (isEditor) return 360;
    // mini: compute cell size from available width, then derive height
    const innerW = width - margin.left - margin.right;
    const colW = activeQueens.length > 0
      ? (innerW * (1 - 0.12)) / activeQueens.length
      : 10;
    // yStep such that yStep * 0.9 = colW → yStep = colW / 0.9
    const yStep = colW / 0.9;
    // innerHeight = yStep * (numRows + 2*0.5) = yStep * (numRows + 1)
    const innerH = yStep * (numRows + 1);
    return Math.round(innerH + margin.top + margin.bottom);
  })();
  const height = computedHeight;

  const maxOpacity = isEditor ? 0.9 : 0.85;

  // ResizeObserver for responsive width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 50) setWidth(Math.floor(w));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || activeQueens.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerHeight = height - margin.top - margin.bottom;
    if (innerHeight < 10) return;

    // Y scale
    const yScale = d3
      .scalePoint<string>()
      .domain([...CHART_ROWS])
      .range([0, innerHeight])
      .padding(0.5);

    const yStep = yScale.step();

    // X scale: constrain column width to match row height for square cells
    const cellSize = yStep * 0.9;
    const xPadding = 0.12;

    let gLeft: number;
    let xRange: number;

    if (isEditor) {
      // Editor: center (labels + chart) as a unit
      const labelWidth = 55;
      const labelGap = 8;
      const idealXRange = activeQueens.length * cellSize / (1 - xPadding);
      xRange = Math.min(width - labelWidth - labelGap - margin.right, idealXRange);
      const totalContentWidth = labelWidth + labelGap + xRange;
      gLeft = Math.max(labelWidth + labelGap, (width - totalContentWidth) / 2 + labelWidth + labelGap);
    } else {
      // Mini: use full width
      const innerWidth = width - margin.left - margin.right;
      const idealXRange = activeQueens.length * cellSize / (1 - xPadding);
      xRange = Math.min(innerWidth, idealXRange);
      gLeft = margin.left + (innerWidth - xRange) / 2;
    }

    const g = svg
      .append('g')
      .attr('transform', `translate(${gLeft},${margin.top})`);

    const xScale = d3
      .scaleBand<string>()
      .domain(activeQueens.map((q) => q.queenId))
      .range([0, xRange])
      .padding(xPadding);

    // Y-axis labels (editor only)
    if (isEditor) {
      for (const p of CHART_ROWS) {
        if (p === 'PREV ELIM') {
          const label = g.append('text')
            .attr('x', -8)
            .attr('y', yScale(p)!)
            .attr('text-anchor', 'end')
            .attr('fill', ROW_COLORS[p])
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .attr('font-family', 'monospace');
          label.append('tspan').attr('x', -8).attr('dy', '-0.6em').text('PREV');
          label.append('tspan').attr('x', -8).attr('dy', '1.2em').text('ELIM');
        } else {
          g.append('text')
            .attr('x', -8)
            .attr('y', yScale(p)!)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'central')
            .attr('fill', ROW_COLORS[p])
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .attr('font-family', 'monospace')
            .text(p);
        }
      }
    }

    const blockH = cellSize;

    // Render each queen's column: one flat block per placement row
    for (const queen of activeQueens) {
      const colX = xScale(queen.queenId)!;
      const colW = xScale.bandwidth();
      const dist = queen.distribution;

      const rowProbs = CHART_ROWS.map((p) => dist[p] ?? 0);
      const maxProb = Math.max(...rowProbs, 0.01);

      const queenGroup = g.append('g');

      for (let ri = 0; ri < CHART_ROWS.length; ri++) {
        const prob = rowProbs[ri];
        if (prob < 0.005) continue;

        const row = CHART_ROWS[ri];
        const yCenter = yScale(row)!;
        const aliveFade = row === 'PREV ELIM' ? 1 : queen.aliveProb;
        const opacity = Math.pow(prob / maxProb, contrastExponent) * maxOpacity * aliveFade;

        const rect = queenGroup
          .append('rect')
          .attr('x', colX)
          .attr('y', yCenter - blockH / 2)
          .attr('width', colW)
          .attr('height', blockH)
          .attr('rx', isEditor ? 1 : 0)
          .attr('fill', queen.color);

        rect.attr('opacity', Math.min(opacity, maxOpacity));
      }

      // X-axis label: queen name
      if (isEditor) {
        g.append('text')
          .attr('x', colX + colW / 2)
          .attr('y', innerHeight + 16)
          .attr('text-anchor', 'middle')
          .attr('fill', queen.color)
          .attr('font-size', activeQueens.length > 10 ? '8px' : '10px')
          .attr('opacity', 0.8)
          .text(queen.name.split(' ')[0]);
      }
    }

    // --- Editor-only: click zones, tooltips, condition markers ---
    if (isEditor && onConditionAdd && onConditionRemove) {
      for (const queen of activeQueens) {
        const colX = xScale(queen.queenId)!;
        const colW = xScale.bandwidth();

        for (let ri = 0; ri < CHART_ROWS.length; ri++) {
          const row = CHART_ROWS[ri];
          const yCenter = yScale(row)!;
          const yTop =
            ri === 0 ? 0 : (yCenter + yScale(CHART_ROWS[ri - 1])!) / 2;
          const yBot =
            ri === CHART_ROWS.length - 1
              ? innerHeight
              : (yCenter + yScale(CHART_ROWS[ri + 1])!) / 2;

          const condition = conditions.find(
            (c) =>
              c.queenIndex === queen.queenIndex &&
              c.episodeIndex === episodeIndex,
          );

          const clickPlacement = rowToConditionPlacement(row);

          g.append('rect')
            .attr('x', colX)
            .attr('y', yTop)
            .attr('width', colW)
            .attr('height', yBot - yTop)
            .attr('fill', 'transparent')
            .attr('cursor', 'pointer')
            .on('click', () => {
              if (condition) {
                if (condition.placement === clickPlacement) {
                  // Toggle off
                  onConditionRemove(episodeIndex, queen.queenIndex);
                } else {
                  // Change to this placement
                  onConditionAdd({
                    episodeIndex,
                    queenIndex: queen.queenIndex,
                    placement: clickPlacement,
                  });
                }
              } else {
                onConditionAdd({
                  episodeIndex,
                  queenIndex: queen.queenIndex,
                  placement: clickPlacement,
                });
              }
            })
            .on('mouseenter', function () {
              d3.select(this).attr('fill', 'rgba(255,255,255,0.05)');

              g.select('.spread-tooltip').remove();

              const tt = g.append('g').attr('class', 'spread-tooltip');
              const ttX = colX + colW + 8;
              const ttY = Math.min(yCenter, innerHeight - 100);
              const flipLeft = ttX + 120 > innerWidth;
              const finalX = flipLeft ? colX - 128 : ttX;

              tt.append('rect')
                .attr('x', finalX)
                .attr('y', ttY - 8)
                .attr('width', 120)
                .attr('height', 108)
                .attr('rx', 4)
                .attr('fill', '#1a1a24')
                .attr('stroke', '#2a2a3a')
                .attr('stroke-width', 1);

              tt.append('text')
                .attr('x', finalX + 8)
                .attr('y', ttY + 4)
                .attr('fill', queen.color)
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .text(`${queen.name.split(' ')[0]} [${row}]`);

              CHART_ROWS.forEach((p, idx) => {
                const prob = queen.distribution[p] ?? 0;
                tt.append('text')
                  .attr('x', finalX + 8)
                  .attr('y', ttY + 18 + idx * 12)
                  .attr('fill', ROW_COLORS[p])
                  .attr('font-size', '9px')
                  .attr('font-family', 'monospace')
                  .text(`${p.padEnd(4)} ${(prob * 100).toFixed(0).padStart(3)}%`);
              });
            })
            .on('mouseleave', function () {
              d3.select(this).attr('fill', 'transparent');
              g.select('.spread-tooltip').remove();
            });
        }
      }

      // Condition markers
      for (const cond of conditions) {
        const queen = activeQueens.find(
          (q) => q.queenIndex === cond.queenIndex,
        );
        if (!queen) continue;

        const colX = xScale(queen.queenId);
        if (colX === undefined) continue;
        const colW = xScale.bandwidth();

        const isElim = cond.placement === ELIM_PLACEMENT;
        const rowKey = isElim ? 'ELIM' : (PLACEMENTS[cond.placement] ?? 'SAFE');
        const yPos = yScale(rowKey);
        if (yPos === undefined) continue;

        const cx = colX + colW / 2;
        const markerColor = isElim ? '#ef4444' : '#f59e0b';

        if (isElim) {
          const s = 6;
          g.append('line')
            .attr('x1', cx - s)
            .attr('y1', yPos - s)
            .attr('x2', cx + s)
            .attr('y2', yPos + s)
            .attr('stroke', markerColor)
            .attr('stroke-width', 2.5);
          g.append('line')
            .attr('x1', cx + s)
            .attr('y1', yPos - s)
            .attr('x2', cx - s)
            .attr('y2', yPos + s)
            .attr('stroke', markerColor)
            .attr('stroke-width', 2.5);
        } else {
          const s = 5;
          g.append('polygon')
            .attr(
              'points',
              `${cx},${yPos - s} ${cx + s},${yPos} ${cx},${yPos + s} ${cx - s},${yPos}`,
            )
            .attr('fill', 'none')
            .attr('stroke', markerColor)
            .attr('stroke-width', 2);
        }
      }
    }
  }, [
    activeQueens,
    conditions,
    width,
    height,
    episodeIndex,
    isEditor,
    margin,
    maxOpacity,
    onConditionAdd,
    onConditionRemove,
    contrastExponent,
  ]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
