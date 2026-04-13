import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { PLACEMENTS } from '../../engine/types';

const PLACEMENT_COLORS: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#555555',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
  ELIM: '#8b0000',
};

const CHART_PLACEMENTS = [...PLACEMENTS, 'ELIM'] as const;
const NUM_ROWS = CHART_PLACEMENTS.length;

const MARGIN = { top: 14, right: 4, bottom: 2, left: 4 };
const NODE_WIDTH = 12;
const ROW_GAP = 1;
const MIN_FLOW = 0.003;

function ribbonPath(
  x0: number, y0top: number, y0bot: number,
  x1: number, y1top: number, y1bot: number,
): string {
  const cpx = (x0 + x1) / 2;
  return `M ${x0} ${y0top} C ${cpx} ${y0top}, ${cpx} ${y1top}, ${x1} ${y1top} L ${x1} ${y1bot} C ${cpx} ${y1bot}, ${cpx} ${y0bot}, ${x0} ${y0bot} Z`;
}

export default function QueenFlowChart({ queenId, height = 80 }: { queenId: string; height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200);

  const { currentSeason: season, baselineResults, filteredResults } = useStore();
  const results = filteredResults ?? baselineResults;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 50) setWidth(Math.floor(w));
    };
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !results) return;

    const queen = season.queens.find((q) => q.id === queenId);
    if (!queen) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const numEps = season.episodes.length;
    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = height - MARGIN.top - MARGIN.bottom;

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // -- Flow data --
    const survival: number[] = [];
    const flowData: Record<string, number>[] = [];
    const elimByEp: number[] = [];

    let surv = 1.0;
    let cumElim = 0;
    for (let ep = 0; ep < numEps; ep++) {
      survival[ep] = surv;
      const dist = results.episodePlacements[ep]?.[queenId] ?? {};
      const f: Record<string, number> = {};
      for (const p of PLACEMENTS) f[p] = surv * (dist[p] ?? 0);
      const elim = results.elimProbByEpisode[ep]?.[queenId] ?? 0;
      elimByEp[ep] = elim;
      f['ELIM'] = cumElim;
      flowData[ep] = f;
      surv = Math.max(0, surv - elim);
      cumElim += elim;
    }
    const wp = results.winProb[queenId] ?? 0;
    survival[numEps] = surv;
    elimByEp[numEps] = 0;
    const outcomeF: Record<string, number> = {};
    for (const p of PLACEMENTS) outcomeF[p] = p === 'WIN' ? wp : 0;
    outcomeF['ELIM'] = 1 - wp;
    flowData[numEps] = outcomeF;

    // -- Layout --
    const numCols = numEps + 1;
    const epSpacing = innerW / numCols;
    const colX = (col: number) => col * epSpacing + epSpacing / 2;

    // Fixed equal-height rows — positions never change
    const rowH = (innerH - (NUM_ROWS - 1) * ROW_GAP) / NUM_ROWS;
    const rowY = (pi: number) => pi * (rowH + ROW_GAP);

    type BandPos = { y: number; h: number };
    const bands: BandPos[][] = [];
    for (let col = 0; col < numCols; col++) {
      bands[col] = [];
      for (let pi = 0; pi < NUM_ROWS; pi++) {
        const flow = flowData[col][CHART_PLACEMENTS[pi]] ?? 0;
        const h = flow * rowH;
        const y = rowY(pi) + (rowH - h) / 2;
        bands[col][pi] = { y, h };
      }
    }

    // -- Cursors --
    const outCursor: number[][] = [];
    const inCursor: number[][] = [];
    for (let col = 0; col < numCols; col++) {
      outCursor[col] = [];
      inCursor[col] = [];
      for (let pi = 0; pi < NUM_ROWS; pi++) {
        outCursor[col][pi] = bands[col][pi].y;
        inCursor[col][pi] = bands[col][pi].y;
      }
    }

    const btm2Idx = CHART_PLACEMENTS.indexOf('BTM2');
    const elimIdx = CHART_PLACEMENTS.indexOf('ELIM');

    interface Rib { srcX: number; srcY: number; tgtX: number; tgtY: number; h: number }
    const ribbons: Rib[] = [];

    for (let ep = 0; ep < numCols - 1; ep++) {
      const survNext = survival[ep + 1];
      const isToOutcome = ep + 1 === numCols - 1;

      if (survNext >= 0.001) {
        for (let pi = 0; pi < PLACEMENTS.length; pi++) {
          let continuing = flowData[ep][PLACEMENTS[pi]];
          if (PLACEMENTS[pi] === 'BTM2') continuing = Math.max(0, continuing - elimByEp[ep]);
          if (continuing < MIN_FLOW) continue;

          for (let ti = 0; ti < PLACEMENTS.length; ti++) {
            const weight = continuing * flowData[ep + 1][PLACEMENTS[ti]] / survNext;
            if (weight < MIN_FLOW) continue;
            const h = weight * rowH;
            const sY = outCursor[ep][pi]; outCursor[ep][pi] += h;
            const tY = inCursor[ep + 1][ti]; inCursor[ep + 1][ti] += h;
            ribbons.push({ srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, h });
          }

          if (PLACEMENTS[pi] === 'BTM2') {
            const elimAmt = elimByEp[ep];
            if (elimAmt >= MIN_FLOW) {
              const h = elimAmt * rowH;
              const sY = outCursor[ep][btm2Idx]; outCursor[ep][btm2Idx] += h;
              const tY = inCursor[ep + 1][elimIdx]; inCursor[ep + 1][elimIdx] += h;
              ribbons.push({ srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, h });
            }
          }

          if (isToOutcome) {
            const loseFrac = Math.max(0, survNext - wp) / survNext;
            const weight = continuing * loseFrac;
            if (weight >= MIN_FLOW) {
              const h = weight * rowH;
              const sY = outCursor[ep][pi]; outCursor[ep][pi] += h;
              const tY = inCursor[ep + 1][elimIdx]; inCursor[ep + 1][elimIdx] += h;
              ribbons.push({ srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, h });
            }
          }
        }
      }

      const elimCarry = flowData[ep]['ELIM'];
      if (elimCarry >= MIN_FLOW) {
        const h = elimCarry * rowH;
        const sY = outCursor[ep][elimIdx]; outCursor[ep][elimIdx] += h;
        const tY = inCursor[ep + 1][elimIdx]; inCursor[ep + 1][elimIdx] += h;
        ribbons.push({ srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, h });
      }
    }

    // ============ RENDER ============

    // Row backgrounds
    for (let pi = 0; pi < NUM_ROWS; pi++) {
      g.append('rect')
        .attr('x', 0).attr('y', rowY(pi))
        .attr('width', innerW).attr('height', rowH)
        .attr('fill', PLACEMENT_COLORS[CHART_PLACEMENTS[pi]]).attr('opacity', 0.05).attr('rx', 1);
    }

    // Node bars
    for (let col = 0; col < numCols; col++) {
      for (let pi = 0; pi < NUM_ROWS; pi++) {
        const band = bands[col][pi];
        if (band.h < 0.3) continue;
        g.append('rect')
          .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', band.y)
          .attr('width', NODE_WIDTH).attr('height', band.h)
          .attr('fill', PLACEMENT_COLORS[CHART_PLACEMENTS[pi]]).attr('opacity', 0.4).attr('rx', 1);
      }
    }

    // Ribbons
    const maxH = Math.max(...ribbons.map((r) => r.h), 1);
    for (const r of ribbons) {
      const t = r.h / maxH;
      g.append('path')
        .attr('d', ribbonPath(r.srcX, r.srcY, r.srcY + r.h, r.tgtX, r.tgtY, r.tgtY + r.h))
        .attr('fill', queen.color)
        .attr('fill-opacity', 0.1 + 0.4 * t)
        .attr('stroke', queen.color)
        .attr('stroke-width', 0.2)
        .attr('stroke-opacity', 0.1 + 0.35 * t);
    }

    // Name
    g.append('text')
      .attr('x', innerW / 2).attr('y', -3)
      .attr('text-anchor', 'middle')
      .attr('fill', queen.color).attr('font-size', '9px').attr('font-weight', '600')
      .text(queen.name.split(' ')[0]);

  }, [results, season, queenId, width, height]);

  return (
    <div ref={containerRef} className="bg-[#121218] border border-[#1a1a24] rounded" style={{ width: '100%' }}>
      <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
    </div>
  );
}
