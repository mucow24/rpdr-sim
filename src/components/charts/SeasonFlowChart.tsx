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
};

const MARGIN = { top: 44, right: 16, bottom: 24, left: 16 };
const NODE_WIDTH = 8;
const PLACEMENT_GAP = 10;
const ELIM_GUTTER = 50;
const SOURCE_COL_WIDTH = 72;
const MIN_FLOW = 0.003;

function ribbonPath(
  x0: number, y0top: number, y0bot: number,
  x1: number, y1top: number, y1bot: number,
): string {
  const cpx = (x0 + x1) / 2;
  return `M ${x0} ${y0top} C ${cpx} ${y0top}, ${cpx} ${y1top}, ${x1} ${y1top} L ${x1} ${y1bot} C ${cpx} ${y1bot}, ${cpx} ${y0bot}, ${x0} ${y0bot} Z`;
}

export default function SeasonFlowChart({ height = 650 }: { height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);

  const { currentSeason: season, baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();
  const results = filteredResults ?? baselineResults;

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


  useEffect(() => {
    if (!svgRef.current || !results) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const numQueens = season.queens.length;
    const numEps = season.episodes.length;
    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = height - MARGIN.top - MARGIN.bottom;
    const placementAreaH = innerH - ELIM_GUTTER;

    // d3.zoom for left-click drag pan + scroll-wheel zoom
    const zoomG = svg.append('g');
    const g = zoomG.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .filter((event) => {
        if (event.type === 'wheel') return true;
        if (event.type === 'mousedown' || event.type === 'mousemove' || event.type === 'mouseup') {
          return event.button === 0;
        }
        return false;
      })
      .on('zoom', (event) => {
        zoomG.attr('transform', event.transform);
      });

    svg.call(zoom);

    // -- Queen order (consistent stacking, best first) --
    const queenOrder = [...season.queens].sort(
      (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
    );
    const queenMap = new Map(season.queens.map((q) => [q.id, q]));

    // -- Flow data --
    const survival: Record<string, number[]> = {};
    const flowData: Record<string, Record<string, number>[]> = {};
    const elimFlowData: Record<string, number[]> = {};

    for (const q of season.queens) {
      survival[q.id] = [];
      flowData[q.id] = [];
      elimFlowData[q.id] = [];
      let surv = 1.0;
      for (let ep = 0; ep < numEps; ep++) {
        survival[q.id][ep] = surv;
        const dist = results.episodePlacements[ep]?.[q.id] ?? {};
        const f: Record<string, number> = {};
        for (const p of PLACEMENTS) f[p] = surv * (dist[p] ?? 0);
        flowData[q.id][ep] = f;
        const elim = results.elimProbByEpisode[ep]?.[q.id] ?? 0;
        elimFlowData[q.id][ep] = elim;
        surv = Math.max(0, surv - elim);
      }
    }

    // -- Horizontal layout --
    const epAreaW = innerW - SOURCE_COL_WIDTH;
    const epSpacing = epAreaW / numEps;
    const colX = (ep: number) => SOURCE_COL_WIDTH + ep * epSpacing + epSpacing / 2;

    // -- Vertical scale: total initial flow = numQueens fills placement area --
    const SCALE = (placementAreaH - (PLACEMENTS.length - 1) * PLACEMENT_GAP) / numQueens;

    // -- Placement nodes --
    type NodePos = { y: number; h: number };
    const nodes: NodePos[][] = [];
    for (let ep = 0; ep < numEps; ep++) {
      const col: NodePos[] = [];
      let cy = 0;
      for (let pi = 0; pi < PLACEMENTS.length; pi++) {
        const p = PLACEMENTS[pi];
        let totalF = 0;
        for (const q of queenOrder) totalF += flowData[q.id][ep][p] ?? 0;
        const h = totalF * SCALE;
        col.push({ y: cy, h });
        cy += h + PLACEMENT_GAP;
      }
      nodes[ep] = col;
    }

    // -- Queen bands within nodes --
    type BandPos = { y: number; h: number };
    const bands: Record<string, BandPos>[][] = [];
    for (let ep = 0; ep < numEps; ep++) {
      bands[ep] = [];
      for (let pi = 0; pi < PLACEMENTS.length; pi++) {
        const p = PLACEMENTS[pi];
        const bmap: Record<string, BandPos> = {};
        let cy = nodes[ep][pi].y;
        for (const q of queenOrder) {
          const f = flowData[q.id][ep][p] ?? 0;
          const h = f * SCALE;
          if (h >= 0.3) bmap[q.id] = { y: cy, h };
          cy += h;
        }
        bands[ep][pi] = bmap;
      }
    }

    // -- Source column --
    const srcBands: Record<string, { y: number; h: number }> = {};
    {
      let cy = 0;
      for (const q of queenOrder) {
        srcBands[q.id] = { y: cy, h: SCALE };
        cy += SCALE;
      }
    }

    // ============================================================
    // SUB-RIBBON COMPUTATION
    // Each queen's flow splits across placement nodes at each episode.
    // Between episodes, sub-ribbons connect (queen, ep, placementA) →
    // (queen, ep+1, placementB) using the independence assumption.
    // ============================================================

    interface SubRib {
      queenId: string;
      color: string;
      srcX: number;
      srcY: number;
      tgtX: number;
      tgtY: number;
      h: number;
    }

    const allRibbons: SubRib[] = [];

    // Cursors track stacking position within each band.
    // outCursor: right (outgoing) side of band at (ep, pi, queenId)
    // inCursor:  left (incoming) side of band at (ep, pi, queenId)
    const outCursor: Record<string, number>[][] = [];
    const inCursor: Record<string, number>[][] = [];
    for (let ep = 0; ep < numEps; ep++) {
      outCursor[ep] = [];
      inCursor[ep] = [];
      for (let pi = 0; pi < PLACEMENTS.length; pi++) {
        outCursor[ep][pi] = {};
        inCursor[ep][pi] = {};
        for (const q of queenOrder) {
          const band = bands[ep][pi][q.id];
          if (band) {
            outCursor[ep][pi][q.id] = band.y;
            inCursor[ep][pi][q.id] = band.y;
          }
        }
      }
    }
    const srcCursor: Record<string, number> = {};
    for (const q of queenOrder) srcCursor[q.id] = srcBands[q.id].y;

    // Process per queen (consistent stacking order)
    for (const queen of queenOrder) {
      const qid = queen.id;

      // Source → ep 0: queen's source band splits into placement bands at ep 0
      for (let ti = 0; ti < PLACEMENTS.length; ti++) {
        const weight = flowData[qid][0][PLACEMENTS[ti]];
        if (weight < MIN_FLOW) continue;
        const h = weight * SCALE;

        const sY = srcCursor[qid];
        srcCursor[qid] += h;

        const tY = inCursor[0][ti][qid];
        if (tY === undefined) continue;
        inCursor[0][ti][qid] += h;

        allRibbons.push({
          queenId: qid, color: queen.color,
          srcX: SOURCE_COL_WIDTH - 16, srcY: sY,
          tgtX: colX(0) - NODE_WIDTH / 2, tgtY: tY,
          h,
        });
      }

      // Ep → ep+1: each source placement band splits into target placement bands
      for (let ep = 0; ep < numEps - 1; ep++) {
        const survNext = survival[qid][ep + 1];
        if (survNext < 0.001) continue;

        for (let pi = 0; pi < PLACEMENTS.length; pi++) {
          let continuing = flowData[qid][ep][PLACEMENTS[pi]];
          if (PLACEMENTS[pi] === 'BTM2') continuing = Math.max(0, continuing - elimFlowData[qid][ep]);
          if (continuing < MIN_FLOW) continue;

          for (let ti = 0; ti < PLACEMENTS.length; ti++) {
            const weight = continuing * flowData[qid][ep + 1][PLACEMENTS[ti]] / survNext;
            if (weight < MIN_FLOW) continue;
            const h = weight * SCALE;

            const sY = outCursor[ep][pi][qid];
            if (sY === undefined) continue;
            outCursor[ep][pi][qid] += h;

            const tY = inCursor[ep + 1][ti][qid];
            if (tY === undefined) continue;
            inCursor[ep + 1][ti][qid] += h;

            allRibbons.push({
              queenId: qid, color: queen.color,
              srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY,
              tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY,
              h,
            });
          }
        }
      }
    }

    // ELIM drops: from bottom of queen's BTM2 band, straight down to gutter
    interface ElimDrop {
      queenId: string;
      color: string;
      x: number;
      yTop: number;
      h: number;
    }
    const elimDrops: ElimDrop[] = [];
    const elimGutterY = placementAreaH + 10;

    for (const queen of queenOrder) {
      for (let ep = 0; ep < numEps; ep++) {
        const elimAmt = elimFlowData[queen.id][ep];
        if (elimAmt < 0.003) continue;
        const h = elimAmt * SCALE;
        if (h < 0.5) continue;

        const btm2Band = bands[ep][4][queen.id];
        if (!btm2Band) continue;

        // ELIM portion sits at bottom of BTM2 band (after continuing sub-ribbons)
        const yTop = btm2Band.y + btm2Band.h - h;

        elimDrops.push({ queenId: queen.id, color: queen.color, x: colX(ep), yTop, h });
      }
    }

    // ============ RENDER ============

    const activeQueenId = selectedQueenId;

    // Episode labels
    for (let ep = 0; ep < numEps; ep++) {
      g.append('text')
        .attr('x', colX(ep)).attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555').attr('font-size', '10px').attr('font-family', 'monospace')
        .text(`Ep ${season.episodes[ep].number}`);
    }

    // Placement labels (left of first episode column)
    for (let pi = 0; pi < PLACEMENTS.length; pi++) {
      const node0 = nodes[0][pi];
      g.append('text')
        .attr('x', colX(0) - NODE_WIDTH / 2 - 6)
        .attr('y', node0.y + node0.h / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('fill', PLACEMENT_COLORS[PLACEMENTS[pi]])
        .attr('font-size', '9px').attr('font-weight', 'bold').attr('font-family', 'monospace')
        .attr('opacity', 0.7)
        .text(PLACEMENTS[pi]);
    }

    // Vertical gridlines
    for (let ep = 0; ep < numEps; ep++) {
      g.append('line')
        .attr('x1', colX(ep)).attr('x2', colX(ep))
        .attr('y1', 0).attr('y2', placementAreaH)
        .attr('stroke', '#111').attr('stroke-width', 1);
    }

    // Placement node rects
    for (let ep = 0; ep < numEps; ep++) {
      for (let pi = 0; pi < PLACEMENTS.length; pi++) {
        const node = nodes[ep][pi];
        if (node.h < 0.5) continue;
        g.append('rect')
          .attr('x', colX(ep) - NODE_WIDTH / 2).attr('y', node.y)
          .attr('width', NODE_WIDTH).attr('height', node.h)
          .attr('fill', PLACEMENT_COLORS[PLACEMENTS[pi]]).attr('opacity', 0.25).attr('rx', 1);
      }
    }

    // Queen bands within nodes
    for (let ep = 0; ep < numEps; ep++) {
      for (let pi = 0; pi < PLACEMENTS.length; pi++) {
        for (const [qid, band] of Object.entries(bands[ep][pi])) {
          if (band.h < 0.3) continue;
          const queen = queenMap.get(qid);
          if (!queen) continue;
          const isFaded = activeQueenId !== null && activeQueenId !== qid;
          g.append('rect')
            .attr('x', colX(ep) - NODE_WIDTH / 2).attr('y', band.y)
            .attr('width', NODE_WIDTH).attr('height', Math.max(band.h, 0.5))
            .attr('fill', queen.color).attr('opacity', isFaded ? 0.08 : 0.7);
        }
      }
    }

    // Source emitters + labels
    for (const queen of queenOrder) {
      const sb = srcBands[queen.id];
      const isFaded = activeQueenId !== null && activeQueenId !== queen.id;
      g.append('rect')
        .attr('x', SOURCE_COL_WIDTH - 22).attr('y', sb.y)
        .attr('width', 6).attr('height', sb.h)
        .attr('fill', queen.color).attr('opacity', isFaded ? 0.15 : 0.8).attr('rx', 1);
      g.append('text')
        .attr('x', SOURCE_COL_WIDTH - 26).attr('y', sb.y + sb.h / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('fill', isFaded ? '#333' : queen.color)
        .attr('font-size', numQueens > 10 ? '8px' : '10px')
        .attr('font-weight', isFaded ? '400' : '600')
        .attr('opacity', isFaded ? 0.4 : 0.9)
        .text(queen.name.split(' ')[0]);
    }

    // Sub-ribbons (render weakest queens first, strongest on top)
    const winProbs = new Map(season.queens.map((q) => [q.id, results.winProb[q.id] ?? 0]));
    const sortedRibbons = [...allRibbons].sort(
      (a, b) => (winProbs.get(a.queenId) ?? 0) - (winProbs.get(b.queenId) ?? 0),
    );

    const ribbonGroup = g.append('g').attr('class', 'ribbons');

    for (const r of sortedRibbons) {
      const isFaded = activeQueenId !== null && activeQueenId !== r.queenId;
      const isActive = activeQueenId === r.queenId;
      ribbonGroup.append('path')
        .attr('d', ribbonPath(r.srcX, r.srcY, r.srcY + r.h, r.tgtX, r.tgtY, r.tgtY + r.h))
        .attr('fill', r.color)
        .attr('fill-opacity', isActive ? 0.6 : isFaded ? 0.02 : 0.22)
        .attr('stroke', r.color)
        .attr('stroke-width', 0.3)
        .attr('stroke-opacity', isActive ? 0.7 : isFaded ? 0.01 : 0.35)
        .attr('data-queen', r.queenId)
        .style('cursor', 'pointer');
    }

    // ELIM drops
    for (const drop of elimDrops) {
      const isFaded = activeQueenId !== null && activeQueenId !== drop.queenId;
      const isActive = activeQueenId === drop.queenId;
      const halfW = Math.max(drop.h / 2, 1);
      ribbonGroup.append('path')
        .attr('d', `M ${drop.x - halfW} ${drop.yTop} L ${drop.x + halfW} ${drop.yTop} L ${drop.x + halfW} ${elimGutterY} L ${drop.x - halfW} ${elimGutterY} Z`)
        .attr('fill', drop.color)
        .attr('fill-opacity', isActive ? 0.7 : isFaded ? 0.03 : 0.4)
        .attr('stroke', 'none')
        .attr('data-queen', drop.queenId)
        .style('cursor', 'pointer');
    }

    // ELIM label + gutter line
    g.append('text')
      .attr('x', colX(0) - NODE_WIDTH / 2 - 6)
      .attr('y', elimGutterY + 10)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
      .attr('fill', '#e74c3c').attr('font-size', '9px').attr('font-weight', 'bold')
      .attr('font-family', 'monospace').attr('opacity', 0.5)
      .text('ELIM');

    g.append('line')
      .attr('x1', SOURCE_COL_WIDTH - 20)
      .attr('x2', colX(numEps - 1) + NODE_WIDTH / 2 + 10)
      .attr('y1', placementAreaH + 4).attr('y2', placementAreaH + 4)
      .attr('stroke', '#1a1a24').attr('stroke-dasharray', '4,4');

    // Interaction: hover highlights queen, click selects
    const allPaths = g.selectAll<SVGPathElement, unknown>('path[data-queen]');

    allPaths.on('mouseenter', function () {
      const qid = d3.select(this).attr('data-queen');
      if (!qid) return;
      allPaths.each(function () {
        const pq = d3.select(this).attr('data-queen');
        const isThis = pq === qid;
        d3.select(this)
          .attr('fill-opacity', isThis ? 0.6 : 0.015)
          .attr('stroke-opacity', isThis ? 0.7 : 0.005);
      });
    });

    allPaths.on('mouseleave', function () {
      allPaths.each(function () {
        const pq = d3.select(this).attr('data-queen');
        const isSel = activeQueenId === pq;
        const isFad = activeQueenId !== null && !isSel;
        d3.select(this)
          .attr('fill-opacity', isSel ? 0.6 : isFad ? 0.02 : 0.22)
          .attr('stroke-opacity', isSel ? 0.7 : isFad ? 0.01 : 0.35);
      });
    });

    allPaths.on('click', function () {
      const qid = d3.select(this).attr('data-queen');
      if (qid) setSelectedQueenId(qid);
    });

  }, [results, season, width, height, selectedQueenId, setSelectedQueenId]);

  if (!results) {
    return (
      <div className="flex items-center justify-center text-[#444]" style={{ height }}>
        Running simulations...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
    >
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Season Flow — hover to trace a queen&apos;s path
      </h3>
      <svg ref={svgRef} width={Math.max(width, 900)} height={height} className="overflow-visible" />
    </div>
  );
}
