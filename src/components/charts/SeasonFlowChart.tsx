import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { PLACEMENTS, PLACEMENT_INDEX, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX, isFinale, type Placement } from '../../engine/types';

const PLACEMENT_COLORS: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#888888',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
  ELIM: '#8b0000',
};

// Brighter placement colors used for flow fills (nodes + ribbons). Lift
// lightness floor to 0.75 so dark colors like ELIM stay readable on dark bg.
const PLACEMENT_FLOW_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(PLACEMENT_COLORS).map(([k, c]) => {
    const hsl = d3.hsl(c);
    hsl.l = Math.max(hsl.l, 0.75);
    return [k, hsl.formatRgb()];
  }),
);

const CHART_PLACEMENTS = [...PLACEMENTS, 'ELIM'] as const;

const MARGIN = { top: 2, right: 16, bottom: 24, left: 16 };
const NODE_WIDTH = 8;
const PLACEMENT_GAP = 10;
const SOURCE_COL_WIDTH = 72;
const MIN_FLOW = 0.0001;
// Pixels per 1 unit of flow. Fixed — does not scale with queen count.
// Each placement rectangle AND each queen's source flow band is 1 unit = SCALE px.
const SCALE = 50;
// Vertical spacing between queen name rows in the source column. Tighter than
// SCALE, so adjacent queens' flow bands overlap (invisible except on select/hover).
const SRC_ROW_H = SCALE / 2;

function ribbonPath(
  x0: number, y0top: number, y0bot: number,
  x1: number, y1top: number, y1bot: number,
): string {
  const cpx = (x0 + x1) / 2;
  return `M ${x0} ${y0top} C ${cpx} ${y0top}, ${cpx} ${y1top}, ${x1} ${y1top} L ${x1} ${y1bot} C ${cpx} ${y1bot}, ${cpx} ${y0bot}, ${x0} ${y0bot} Z`;
}

export default function SeasonFlowChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [dimExp, setDimExp] = useState(1.2);
  const [dimBase, setDimBase] = useState(0.04);
  const [dimCutoff, setDimCutoff] = useState(0.4);

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, conditions, addCondition, removeCondition, clearConditions, selectedQueenId, setSelectedQueenId } =
    useStore();
  const results = filteredResults ?? baselineResults;

  // Layout heights (fixed scale; chart auto-sizes to fit whichever stack is taller).
  const numQueens = season.queens.length;
  const rectStackH =
    CHART_PLACEMENTS.length * SCALE + (CHART_PLACEMENTS.length - 1) * PLACEMENT_GAP;
  // srcColH spans from the first queen's flow-band top to the last's bottom.
  const srcColH = numQueens === 0 ? 0 : (numQueens - 1) * SRC_ROW_H + SCALE;
  const placementAreaH = Math.max(rectStackH, srcColH);
  const height = placementAreaH + MARGIN.top + MARGIN.bottom;
  const rectStackOffsetY = (placementAreaH - rectStackH) / 2;
  const srcColOffsetY = (placementAreaH - srcColH) / 2;

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

    if (results.numSimulations === 0) {
      svg.append('text')
        .attr('x', width / 2).attr('y', height / 2 - 10)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('fill', '#888').attr('font-size', '14px').attr('font-family', 'monospace')
        .text('No sim results');
      svg.append('text')
        .attr('x', width / 2).attr('y', height / 2 + 14)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('fill', '#ffd700').attr('font-size', '12px').attr('font-family', 'monospace')
        .style('cursor', 'pointer')
        .text('Clear pins')
        .on('click', clearConditions);
      return;
    }

    const numEps = season.episodes.length;
    const innerW = width - MARGIN.left - MARGIN.right;

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    // -- Queen order (consistent stacking, best first) --
    const queenOrder = [...season.queens].sort(
      (a, b) => (results.winProb[b.id] ?? 0) - (results.winProb[a.id] ?? 0),
    );
    const queenMap = new Map(season.queens.map((q) => [q.id, q]));

    // -- Flow data (cumulative ELIM graveyard) --
    const survival: Record<string, number[]> = {};
    const flowData: Record<string, Record<string, number>[]> = {};
    const elimByEp: Record<string, number[]> = {};

    for (const q of season.queens) {
      survival[q.id] = [];
      flowData[q.id] = [];
      elimByEp[q.id] = [];
      let surv = 1.0;
      let cumElim = 0;
      for (let ep = 0; ep < numEps; ep++) {
        survival[q.id][ep] = surv;
        const dist = results.episodePlacements[ep]?.[q.id] ?? {};
        const f: Record<string, number> = {};
        for (const p of PLACEMENTS) f[p] = surv * (dist[p] ?? 0);
        const elim = results.elimProbByEpisode[ep]?.[q.id] ?? 0;
        elimByEp[q.id][ep] = elim;
        f['BTM2'] = Math.max(0, f['BTM2'] - elim);
        f['ELIM'] = cumElim + elim;
        flowData[q.id][ep] = f;
        surv = Math.max(0, surv - elim);
        cumElim += elim;
      }
    }

    // -- Horizontal layout --
    const numCols = numEps;
    const epAreaW = innerW - SOURCE_COL_WIDTH;
    const epSpacing = epAreaW / numCols;
    const colX = (col: number) => SOURCE_COL_WIDTH + col * epSpacing + epSpacing / 2;

    // -- Placement nodes (constant height = 1 queen's flow; stack centered vertically) --
    type NodePos = { y: number; h: number };
    const nodes: NodePos[][] = [];
    for (let col = 0; col < numCols; col++) {
      const nodeCol: NodePos[] = [];
      let cy = rectStackOffsetY;
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const h = SCALE;
        nodeCol.push({ y: cy, h });
        cy += h + PLACEMENT_GAP;
      }
      nodes[col] = nodeCol;
    }

    // -- Queen bands within nodes (each queen centered in the node;
    //    ELIM bottom-aligned so it "fills up" over time). Queens overlap. --
    type BandPos = { y: number; h: number };
    const bands: Record<string, BandPos>[][] = [];
    for (let col = 0; col < numCols; col++) {
      bands[col] = [];
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const p = CHART_PLACEMENTS[pi];
        const node = nodes[col][pi];
        const bmap: Record<string, BandPos> = {};
        for (const q of queenOrder) {
          const f = flowData[q.id][col][p] ?? 0;
          const h = f * SCALE;
          const y = p === 'ELIM'
            ? node.y + node.h - h
            : node.y + (node.h - h) / 2;
          bmap[q.id] = { y, h };
        }
        bands[col][pi] = bmap;
      }
    }

    // -- Source column (name rows stacked tightly; flow bands SCALE-tall,
    //    centered on each name; adjacent flow bands overlap). --
    const srcBands: Record<string, { y: number; h: number }> = {};
    for (let i = 0; i < queenOrder.length; i++) {
      const q = queenOrder[i];
      srcBands[q.id] = { y: srcColOffsetY + i * SRC_ROW_H, h: SCALE };
    }

    // ============================================================
    // SUB-RIBBON COMPUTATION
    // Each queen's flow splits across placement nodes at each episode.
    // Between episodes, sub-ribbons connect (queen, ep, placementA) →
    // (queen, ep+1, placementB) using the independence assumption.
    // ============================================================

    interface SubRib {
      queenId: string;
      srcX: number;
      srcY: number;
      srcH: number;
      tgtX: number;
      tgtY: number;
      tgtH: number;
      // Brightness at each end of the ribbon, = queen's probability of being
      // in the source/target placement node (source column = 1.0).
      srcT: number;
      tgtT: number;
      // Color at each end. Source column side of initial ribbons uses the
      // queen's color; placement-node ends use the placement's flow color.
      srcColor: string;
      tgtColor: string;
    }

    const allRibbons: SubRib[] = [];

    // Cursors track stacking position within each band.
    // outCursor: right (outgoing) side of band at (ep, pi, queenId)
    // inCursor:  left (incoming) side of band at (ep, pi, queenId)
    const outCursor: Record<string, number>[][] = [];
    const inCursor: Record<string, number>[][] = [];
    for (let col = 0; col < numCols; col++) {
      outCursor[col] = [];
      inCursor[col] = [];
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        outCursor[col][pi] = {};
        inCursor[col][pi] = {};
        for (const q of queenOrder) {
          const band = bands[col][pi][q.id];
          if (band) {
            outCursor[col][pi][q.id] = band.y;
            inCursor[col][pi][q.id] = band.y;
          }
        }
      }
    }
    const srcCursor: Record<string, number> = {};
    for (const q of queenOrder) srcCursor[q.id] = srcBands[q.id].y;

    const elimIdx = CHART_PLACEMENTS.indexOf('ELIM');

    // Process per queen (consistent stacking order)
    for (const queen of queenOrder) {
      const qid = queen.id;

      // Source → ep 0: queen's source band splits into placement bands at ep 0.
      for (let ti = 0; ti < CHART_PLACEMENTS.length; ti++) {
        const weight = flowData[qid][0][CHART_PLACEMENTS[ti]];
        if (weight < MIN_FLOW) continue;
        const h = weight * SCALE;

        const sY = srcCursor[qid];
        srcCursor[qid] += h;

        const tY = inCursor[0][ti][qid];
        if (tY === undefined) continue;
        inCursor[0][ti][qid] += h;

        allRibbons.push({
          queenId: qid,
          srcX: SOURCE_COL_WIDTH - 16, srcY: sY, srcH: h,
          tgtX: colX(0) - NODE_WIDTH / 2, tgtY: tY, tgtH: h,
          srcT: 1.0,
          tgtT: weight,
          srcColor: queen.color,
          tgtColor: PLACEMENT_FLOW_COLORS[CHART_PLACEMENTS[ti]],
        });
      }

      // Ep → ep+1: placement splits + ELIM carry-forward (graveyard)
      for (let ep = 0; ep < numCols - 1; ep++) {
        const survNext = survival[qid][ep + 1];

        // Surviving flow ribbons (only if queen still alive)
        if (survNext >= 0.001) {
          for (let pi = 0; pi < PLACEMENTS.length; pi++) {
            const continuing = flowData[qid][ep][PLACEMENTS[pi]];
            if (continuing < MIN_FLOW) continue;

            // Ribbons to non-ELIM placements at ep+1
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
                queenId: qid,
                srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, srcH: h,
                tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, tgtH: h,
                srcT: flowData[qid][ep][PLACEMENTS[pi]],
                tgtT: flowData[qid][ep + 1][PLACEMENTS[ti]],
                srcColor: PLACEMENT_FLOW_COLORS[PLACEMENTS[pi]],
                tgtColor: PLACEMENT_FLOW_COLORS[PLACEMENTS[ti]],
              });
            }

            // Surviving flow → ELIM at ep+1 (newly eliminated at target episode)
            {
              const elimAtTarget = elimByEp[qid][ep + 1];
              if (elimAtTarget >= MIN_FLOW) {
                const weight = continuing * elimAtTarget / survNext;
                if (weight >= MIN_FLOW) {
                  const h = weight * SCALE;

                  const sY = outCursor[ep][pi][qid];
                  if (sY !== undefined) {
                    outCursor[ep][pi][qid] += h;

                    const tY = inCursor[ep + 1][elimIdx][qid];
                    if (tY !== undefined) {
                      inCursor[ep + 1][elimIdx][qid] += h;

                      allRibbons.push({
                        queenId: qid,
                        srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, srcH: h,
                        tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, tgtH: h,
                        srcT: flowData[qid][ep][PLACEMENTS[pi]],
                        tgtT: flowData[qid][ep + 1]['ELIM'],
                        srcColor: PLACEMENT_FLOW_COLORS[PLACEMENTS[pi]],
                        tgtColor: PLACEMENT_FLOW_COLORS['ELIM'],
                      });
                    }
                  }
                }
              }
            }

          }
        }

        // ELIM carry-forward (graveyard — always, regardless of survival)
        const elimCarry = flowData[qid][ep]['ELIM'];
        if (elimCarry >= MIN_FLOW) {
          const h = elimCarry * SCALE;

          const sY = outCursor[ep][elimIdx][qid];
          if (sY !== undefined) {
            outCursor[ep][elimIdx][qid] += h;

            const tY = inCursor[ep + 1][elimIdx][qid];
            if (tY !== undefined) {
              inCursor[ep + 1][elimIdx][qid] += h;

              allRibbons.push({
                queenId: qid,
                srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY, srcH: h,
                tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY, tgtH: h,
                srcT: flowData[qid][ep]['ELIM'],
                tgtT: flowData[qid][ep + 1]['ELIM'],
                srcColor: PLACEMENT_FLOW_COLORS['ELIM'],
                tgtColor: PLACEMENT_FLOW_COLORS['ELIM'],
              });
            }
          }
        }
      }
    }


    // ============ RENDER ============

    // Display fallback: if nothing globally selected, highlight the first
    // queen so the chart isn't completely undifferentiated. Don't write this
    // back to the store — it would auto-select a queen page-wide on first load.
    const selId = selectedQueenId;

    const isSelected = (qid: string) => qid === selId;

    // Episode labels (below ELIM row, centered on each episode's column)
    const elimPi = CHART_PLACEMENTS.length - 1;
    for (let col = 0; col < numCols; col++) {
      const elimNode = nodes[col][elimPi];
      const label = isFinale(season.episodes[col]) ? 'FINALE' : `EP ${col + 1}`;
      g.append('text')
        .attr('x', colX(col))
        .attr('y', elimNode.y + elimNode.h + 10)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('fill', '#888')
        .attr('font-size', '9px').attr('font-weight', 'bold').attr('font-family', 'monospace')
        .attr('opacity', 0.7)
        .text(label);
    }

    // Placement labels (right of finale column, left-justified)
    for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
      const nodeLast = nodes[numCols - 1][pi];
      g.append('text')
        .attr('x', colX(numCols - 1) + NODE_WIDTH / 2 + 6)
        .attr('y', nodeLast.y + nodeLast.h / 2)
        .attr('text-anchor', 'start').attr('dominant-baseline', 'central')
        .attr('fill', PLACEMENT_COLORS[CHART_PLACEMENTS[pi]])
        .attr('font-size', '9px').attr('font-weight', 'bold').attr('font-family', 'monospace')
        .attr('opacity', 0.7)
        .text(CHART_PLACEMENTS[pi]);
    }

    // Vertical gridlines
    for (let col = 0; col < numCols; col++) {
      g.append('line')
        .attr('x1', colX(col)).attr('x2', colX(col))
        .attr('y1', 0).attr('y2', placementAreaH)
        .attr('stroke', '#111').attr('stroke-width', 1);
    }

    // Placement node rects (visual only — clickable overlays added later)
    for (let col = 0; col < numCols; col++) {
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const node = nodes[col][pi];
        if (node.h < 0.5) continue;
        g.append('rect')
          .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', node.y)
          .attr('width', NODE_WIDTH).attr('height', node.h)
          .attr('fill', PLACEMENT_COLORS[CHART_PLACEMENTS[pi]]).attr('opacity', 0.25).attr('rx', 1);
      }
    }

    const dimOp = (t: number): number => {
      if (dimCutoff <= 0 || t >= dimCutoff) return 1;
      return dimBase + (1 - dimBase) * Math.pow(t / dimCutoff, dimExp);
    };

    const glowColor = (c: string): string => {
      const hsl = d3.hsl(c);
      hsl.s *= 0.5;
      hsl.opacity = 0.5;
      return hsl.formatRgb();
    };

    // Queen bands within nodes — opacity = dimOp(queen's probability at this
    // placement node), i.e. the normalized flow through the node.
    const bandGroup = g.append('g').attr('class', 'queen-bands');
    for (let col = 0; col < numCols; col++) {
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const placementName = CHART_PLACEMENTS[pi];
        for (const [qid, band] of Object.entries(bands[col][pi])) {
          if (band.h < 0.3) continue;
          const queen = queenMap.get(qid);
          if (!queen) continue;
          const t = band.h / SCALE;
          const sel = isSelected(qid);
          bandGroup.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', band.y)
            .attr('width', NODE_WIDTH).attr('height', Math.max(band.h, 0.5))
            .attr('fill', PLACEMENT_FLOW_COLORS[placementName])
            .attr('opacity', sel ? dimOp(t) : 0)
            .attr('data-queen', qid)
            .attr('data-t', t)
            .attr('data-color-placement', PLACEMENT_FLOW_COLORS[placementName])
            .attr('data-color-queen', queen.color)
            .style('pointer-events', 'none');
        }
      }
    }
    const allBands = bandGroup.selectAll<SVGRectElement, unknown>('rect[data-queen]');

    // Sub-ribbons (render weakest queens first, strongest on top)
    const winProbs = new Map(season.queens.map((q) => [q.id, results.winProb[q.id] ?? 0]));
    const sortedRibbons = [...allRibbons].sort(
      (a, b) => (winProbs.get(a.queenId) ?? 0) - (winProbs.get(b.queenId) ?? 0),
    );

    // One <linearGradient> per ribbon, stops at source/target brightness.
    // Coordinates are in the `g` user space (gradientUnits=userSpaceOnUse).
    const defs = g.append('defs');

    // Yellow halo filter for pinned placement nodes. Three stacked
    // drop-shadows build up a bright, large glow. Filter region needs
    // huge horizontal padding — the node is only 8px wide so percentage
    // padding adds up slowly, and a wide blur gets clipped otherwise.
    const pinGlow = defs.append('filter')
      .attr('id', 'pin-glow')
      .attr('x', '-3000%').attr('y', '-500%')
      .attr('width', '6100%').attr('height', '1100%');
    pinGlow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0).attr('stdDeviation', 10)
      .attr('flood-color', '#ffd700').attr('flood-opacity', 1);
    pinGlow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0).attr('stdDeviation', 25)
      .attr('flood-color', '#ffd700').attr('flood-opacity', 1);
    pinGlow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0).attr('stdDeviation', 45)
      .attr('flood-color', '#ffd700').attr('flood-opacity', 1);

    const ribbonGroup = g.append('g').attr('class', 'ribbons');

    for (let i = 0; i < sortedRibbons.length; i++) {
      const r = sortedRibbons[i];
      const queen = queenMap.get(r.queenId);
      if (!queen) continue;

      // Placement-colored gradient (default, used when queen is selected).
      const gradIdP = `ribbon-grad-p-${i}`;
      const gradP = defs.append('linearGradient')
        .attr('id', gradIdP)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', r.srcX).attr('y1', 0)
        .attr('x2', r.tgtX).attr('y2', 0);
      gradP.append('stop').attr('offset', '0%')
        .attr('stop-color', r.srcColor).attr('stop-opacity', dimOp(r.srcT));
      gradP.append('stop').attr('offset', '100%')
        .attr('stop-color', r.tgtColor).attr('stop-opacity', dimOp(r.tgtT));

      // Queen-colored gradient (used on hover — distinct from placement palette).
      const gradIdQ = `ribbon-grad-q-${i}`;
      const gradQ = defs.append('linearGradient')
        .attr('id', gradIdQ)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', r.srcX).attr('y1', 0)
        .attr('x2', r.tgtX).attr('y2', 0);
      gradQ.append('stop').attr('offset', '0%')
        .attr('stop-color', queen.color).attr('stop-opacity', dimOp(r.srcT));
      gradQ.append('stop').attr('offset', '100%')
        .attr('stop-color', queen.color).attr('stop-opacity', dimOp(r.tgtT));

      const sel = isSelected(r.queenId);
      ribbonGroup.append('path')
        .attr('d', ribbonPath(r.srcX, r.srcY, r.srcY + r.srcH, r.tgtX, r.tgtY, r.tgtY + r.tgtH))
        .attr('fill', `url(#${gradIdP})`)
        .attr('stroke', `url(#${gradIdP})`)
        .attr('stroke-width', 0.3)
        .attr('opacity', sel ? 1 : 0)
        .attr('data-queen', r.queenId)
        .attr('data-grad-p', gradIdP)
        .attr('data-grad-q', gradIdQ);
    }

    const allPaths = ribbonGroup.selectAll<SVGPathElement, unknown>('path[data-queen]');

    // Helper: set ribbon opacities for hover highlight.
    // Hover boosts the hovered queen without fading the selected queen.
    function setRibbonOpacity(highlightId: string | null) {
      // Dim the selected queen when a *different* queen is being hovered, so
      // the hovered comparison pops. Hovering the selected queen itself does
      // nothing special — she stays in the placement palette at full opacity.
      const hoveringOther = highlightId !== null && !isSelected(highlightId);
      allPaths.each(function () {
        const el = d3.select(this);
        const pq = el.attr('data-queen')!;
        const isSel = isSelected(pq);
        const isHover = highlightId !== null && pq === highlightId;
        const visible = isSel || isHover;
        const dimSelected = isSel && !isHover && hoveringOther;
        el.attr('opacity', visible ? (dimSelected ? 0.3 : 1) : 0);
        if (visible) {
          // Queen-color gradient only when hovered and *not* also selected.
          const useQueenGrad = isHover && !isSel;
          const gradId = useQueenGrad ? el.attr('data-grad-q')! : el.attr('data-grad-p')!;
          el.attr('fill', `url(#${gradId})`).attr('stroke', `url(#${gradId})`);
        }
      });
      allBands.each(function () {
        const el = d3.select(this);
        const pq = el.attr('data-queen')!;
        const pt = parseFloat(el.attr('data-t') || '1');
        const isSel = isSelected(pq);
        const isHover = highlightId !== null && pq === highlightId;
        const visible = isSel || isHover;
        const dimSelected = isSel && !isHover && hoveringOther;
        const baseOp = visible ? dimOp(pt) : 0;
        el.attr('opacity', dimSelected ? baseOp * 0.3 : baseOp);
        if (visible) {
          const useQueenColor = isHover && !isSel;
          const fill = useQueenColor
            ? el.attr('data-color-queen')!
            : el.attr('data-color-placement')!;
          el.attr('fill', fill);
        }
      });
      // Ensure hovered queen's ribbons and placement bars render above selected queen's.
      if (highlightId !== null) {
        allPaths.filter(function () {
          return d3.select(this).attr('data-queen') === highlightId;
        }).raise();
        allBands.filter(function () {
          return d3.select(this).attr('data-queen') === highlightId;
        }).raise();
      }
    }

    // Track which queens have pins (conditions)
    const queensWithPins = new Set<string>();
    for (const c of conditions) {
      const q = season.queens[c.queenIndex];
      if (q) queensWithPins.add(q.id);
    }

    // Source emitters + labels (click to select).
    // Flow bands overlap between adjacent queens (SRC_ROW_H < SCALE), but we
    // only render a visible color bar for the selected or hovered queen, so
    // the overlap isn't a visual problem. Hit areas are tight (SRC_ROW_H)
    // so they don't overlap.
    //
    // Only the invisible hit-area rect receives pointer events — the color bar
    // and name are pointer-events: none, so the 50px-tall overlapping bars
    // don't steal events from adjacent queens' tight hit areas.
    const queenBars: Record<string, d3.Selection<SVGRectElement, unknown, null, undefined>> = {};
    const queenNames: Record<string, d3.Selection<SVGTextElement, unknown, null, undefined>> = {};
    const queenUnderlines: Record<string, d3.Selection<SVGRectElement, unknown, null, undefined>> = {};

    function setHoverQueen(hoverId: string | null) {
      for (const q of queenOrder) {
        const bar = queenBars[q.id];
        const name = queenNames[q.id];
        const underline = queenUnderlines[q.id];
        if (!bar || !name || !underline) continue;
        const sel = isSelected(q.id);
        const isHover = hoverId === q.id;
        const on = sel || isHover;
        bar.attr('opacity', on ? 1.0 : 0);
        underline.attr('opacity', on ? 1.0 : 0);
        name.style('text-shadow', on ? (() => { const gc = glowColor(q.color); return `0 0 4px ${gc}, 0 0 12px ${gc}, 0 0 20px ${gc}`; })() : 'none');
      }
    }

    for (const queen of queenOrder) {
      const sb = srcBands[queen.id];
      const nameCenter = sb.y + sb.h / 2;
      const sel = isSelected(queen.id);
      const hasPins = queensWithPins.has(queen.id);

      const srcGroup = g.append('g')
        .style('cursor', 'pointer');

      // Invisible hit area — tight row (non-overlapping).
      srcGroup.append('rect')
        .attr('x', -MARGIN.left).attr('y', nameCenter - SRC_ROW_H / 2)
        .attr('width', SOURCE_COL_WIDTH - 16 + MARGIN.left).attr('height', SRC_ROW_H)
        .attr('fill', 'transparent');

      // Color bar — rendered at full flow-band height, but only visible for
      // selected or hovered queens. pointer-events: none so overlapping bars
      // don't intercept events meant for adjacent queens.
      const colorBar = srcGroup.append('rect')
        .attr('x', SOURCE_COL_WIDTH - 22).attr('y', sb.y)
        .attr('width', 6).attr('height', sb.h)
        .attr('fill', queen.color).attr('opacity', sel ? 1.0 : 0).attr('rx', 1)
        .style('pointer-events', 'none');
      queenBars[queen.id] = colorBar;

      // Queen name — always 100% opacity; subtle glow + underline on select/hover.
      const nameText = srcGroup.append('text')
        .attr('x', SOURCE_COL_WIDTH - 30).attr('y', nameCenter)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('fill', queen.color)
        .attr('font-size', numQueens > 10 ? '12px' : '15px')
        .attr('font-weight', '600')
        .attr('opacity', 1.0)
        .style('pointer-events', 'none')
        .style('text-shadow', sel ? (() => { const gc = glowColor(queen.color); return `0 0 4px ${gc}, 0 0 12px ${gc}, 0 0 20px ${gc}`; })() : 'none')
        .text(queen.name.split(' ')[0]);
      queenNames[queen.id] = nameText;

      const nameBBox = nameText.node()!.getBBox();
      const underline = srcGroup.append('rect')
        .attr('x', nameBBox.x)
        .attr('y', nameBBox.y + nameBBox.height + 1)
        .attr('width', nameBBox.width)
        .attr('height', 2)
        .attr('fill', queen.color)
        .attr('opacity', sel ? 1.0 : 0)
        .style('pointer-events', 'none');
      queenUnderlines[queen.id] = underline;

      // Yellow dot for queens with pins — ~20px left of the name.
      if (hasPins) {
        srcGroup.append('circle')
          .attr('cx', nameBBox.x - 20).attr('cy', nameCenter)
          .attr('r', 2.5)
          .attr('fill', '#ffd700')
          .attr('opacity', 0.9)
          .style('pointer-events', 'none');
      }

      // Hover: reveal this queen's color bar + highlight ribbons. Raise the
      // group so the hovered bar sits on top of any overlapping selected bar.
      srcGroup
        .on('mouseenter', function () {
          d3.select(this).raise();
          setHoverQueen(queen.id);
          setRibbonOpacity(queen.id);
        })
        .on('mouseleave', function () {
          setHoverQueen(null);
          setRibbonOpacity(null);
        })
        .on('click', () => {
          setSelectedQueenId(queen.id);
        });
    }

    // Placement pin overlays — rendered on top of everything
    const selectedQueen = selId ? queenMap.get(selId) ?? null : null;
    const selectedQueenIdx = selectedQueen
      ? season.queens.findIndex(q => q.id === selectedQueen.id)
      : -1;

    // Build a set of existing pins for selected queen
    const pinSet = new Set<string>();
    if (selectedQueen) {
      for (const c of conditions) {
        if (c.queenIndex === selectedQueenIdx) {
          pinSet.add(`${c.episodeIndex}:${c.placement}`);
        }
      }
    }

    const overlayGroup = g.append('g').attr('class', 'pin-overlays');

    for (let col = 0; col < numCols; col++) {
      // Finale ELIM means "didn't win the season" — route through the
      // OUTCOME_EPISODE_INDEX sentinel so the filter's outcome path handles it.
      // The finale episode itself never writes a single eliminated queen byte
      // (multiple losers don't fit), so a regular ELIM-byte filter would
      // produce zero matches.
      const isFinaleCol = isFinale(season.episodes[col]);

      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const node = nodes[col][pi];
        if (node.h < 0.5) continue;
        const placementName = CHART_PLACEMENTS[pi];
        const placementNum = placementName === 'ELIM'
          ? ELIM_PLACEMENT
          : PLACEMENT_INDEX[placementName as Placement];
        const condEpIdx = isFinaleCol && placementName === 'ELIM' ? OUTCOME_EPISODE_INDEX : col;
        const isPinned = pinSet.has(`${condEpIdx}:${placementNum}`);

        if (selectedQueen) {
          // Yellow glow halo for pinned nodes — rendered first so the
          // clickable overlay and X sit on top. Source rect is fully opaque
          // so the drop-shadow halo is bright.
          if (isPinned) {
            overlayGroup.append('rect')
              .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', node.y)
              .attr('width', NODE_WIDTH).attr('height', node.h)
              .attr('fill', '#ffd700').attr('opacity', 1)
              .attr('rx', 1)
              .attr('filter', 'url(#pin-glow)')
              .style('pointer-events', 'none');
          }

          // Clickable overlay — always transparent; the halo above is what
          // shows pin state visually.
          const overlay = overlayGroup.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', node.y)
            .attr('width', NODE_WIDTH).attr('height', node.h)
            .attr('fill', 'transparent')
            .attr('opacity', 0)
            .attr('rx', 1)
            .style('cursor', 'pointer');

          overlay
            .on('mouseenter', function (event) {
              if (!isPinned) {
                d3.select(this).attr('fill', PLACEMENT_COLORS[placementName]).attr('opacity', 0.35);
              }

              g.select('.flow-tooltip').remove();

              const [mx, my] = d3.pointer(event, g.node());
              const qid = selectedQueen!.id;
              const dist = results.episodePlacements[col]?.[qid] ?? {};
              const elimProb = elimByEp[qid]?.[col] ?? 0;
              const surv = survival[qid]?.[col] ?? 0;
              const rawProb = placementName === 'ELIM' ? elimProb : (dist[placementName] ?? 0);
              const noRoutes = !isPinned && rawProb < 0.001;

              const ttW = 110;
              const lineH = 12;
              const numRows = CHART_PLACEMENTS.length + 1; // +1 for P.ELIM
              const ttH = 16 + numRows * lineH;
              const rawX = mx + 12;
              const flipLeft = rawX + ttW > innerW;
              const initX = flipLeft ? mx - ttW - 12 : rawX;
              const initY = Math.min(my - 8, placementAreaH - ttH - 4);
              const tt = g.append('g').attr('class', 'flow-tooltip')
                .style('pointer-events', 'none')
                .attr('transform', `translate(${initX},${initY})`);

              tt.append('rect').attr('class', 'tt-bg')
                .attr('width', ttW).attr('height', ttH)
                .attr('rx', 4)
                .attr('fill', '#1a1a24').attr('stroke', '#2a2a3a').attr('stroke-width', 1);

              tt.append('text').attr('class', 'tt-title')
                .attr('x', 6).attr('y', 11)
                .attr('fill', PLACEMENT_COLORS[placementName]).attr('font-size', '9px').attr('font-weight', 'bold')
                .text(`${isFinale(season.episodes[col]) ? 'Finale' : `Ep ${season.episodes[col].number}`} / ${placementName}`);

              CHART_PLACEMENTS.forEach((p, idx) => {
                const prob = p === 'ELIM' ? elimProb : surv * (dist[p] ?? 0);
                const rowRaw = p === 'ELIM' ? elimProb : (dist[p] ?? 0);
                const rowDead = rowRaw < 0.001;
                const valStr = rowDead ? ' --' : `${(prob * 100).toFixed(0).padStart(3)}%`;
                tt.append('text')
                  .attr('x', 6).attr('y', 24 + idx * lineH)
                  .attr('fill', PLACEMENT_COLORS[p])
                  .attr('font-size', '9px').attr('font-family', 'monospace')
                  .attr('opacity', isPinned || noRoutes ? 0.2 : 1)
                  .text(`${p.padEnd(6)} ${valStr}`);
              });

              // P.ELIM — probability queen is already eliminated at start of episode
              const priorElim = Math.max(0, Math.min(1, 1 - surv));
              tt.append('text')
                .attr('x', 6).attr('y', 24 + CHART_PLACEMENTS.length * lineH)
                .attr('fill', '#888')
                .attr('font-size', '9px').attr('font-family', 'monospace')
                .attr('opacity', isPinned || noRoutes ? 0.2 : 1)
                .text(`${'P.ELIM'.padEnd(6)} ${(priorElim * 100).toFixed(0).padStart(3)}%`);

              if (isPinned || noRoutes) {
                const statsH = numRows * lineH;
                tt.append('text')
                  .attr('x', ttW / 2).attr('y', 16 + statsH / 2)
                  .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
                  .attr('fill', noRoutes ? '#ffd700' : '#e74c3c')
                  .attr('font-size', '11px').attr('font-weight', 'bold')
                  .attr('font-family', 'monospace')
                  .text(noRoutes ? 'NO SIM RESULTS' : 'PINNED');
              }
            })
            .on('mousemove', function (event) {
              const tt = g.select('.flow-tooltip');
              if (tt.empty()) return;
              const [mx, my] = d3.pointer(event, g.node());
              const ttW = 110;
              const ttH = 16 + (CHART_PLACEMENTS.length + 1) * 12;
              const rawX = mx + 12;
              const flipLeft = rawX + ttW > innerW;
              const ttX = flipLeft ? mx - ttW - 12 : rawX;
              const ttY = Math.min(my - 8, placementAreaH - ttH - 4);
              tt.attr('transform', `translate(${ttX},${ttY})`);
            })
            .on('mouseleave', function () {
              if (!isPinned) {
                d3.select(this).attr('fill', 'transparent').attr('opacity', 0);
              }
              g.select('.flow-tooltip').remove();
            })
            .on('click', () => {
              if (isPinned) {
                removeCondition(condEpIdx, selectedQueenIdx);
              } else {
                // Don't pin if queen has ~0 probability for this placement
                const qid = selectedQueen!.id;
                const dist = results.episodePlacements[col]?.[qid] ?? {};
                const prob = placementName === 'ELIM'
                  ? (elimByEp[qid]?.[col] ?? 0)
                  : (dist[placementName] ?? 0);
                if (prob < 0.001) return;
                addCondition({
                  episodeIndex: condEpIdx,
                  queenIndex: selectedQueenIdx,
                  placement: placementNum,
                });
              }
            });

          // Big bold X on pinned nodes — centered on the node (a pinned node
          // carries 100% of the queen's flow, so the node height = the band
          // height). Black fill + yellow stroke for high contrast on any
          // placement color.
          if (isPinned) {
            overlayGroup.append('text')
              .attr('x', colX(col)).attr('y', node.y + node.h / 2)
              .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
              .attr('fill', '#000')
              .attr('stroke', '#ffd700').attr('stroke-width', 1.5)
              .attr('paint-order', 'stroke')
              .attr('font-size', '22px').attr('font-weight', '900')
              .style('pointer-events', 'none')
              .text('\u2715');
          }
        }
      }
    }

  }, [results, season, width, placementAreaH, rectStackOffsetY, srcColOffsetY, selectedQueenId, setSelectedQueenId, conditions, addCondition, removeCondition, clearConditions, dimExp, dimBase, dimCutoff]);

  return (
    <div ref={containerRef}>
      {results ? (
        <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
      ) : (
        <div className="flex items-center justify-center text-[#444]" style={{ height }}>
          Running simulations...
        </div>
      )}
      <div className="flex items-center gap-4 mt-2 text-xs text-[#888]">
        <div className="flex items-center gap-2">
          <label>Dim exponent</label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.05}
            value={dimExp}
            onChange={(e) => setDimExp(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimExp.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Dim floor</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={dimBase}
            onChange={(e) => setDimBase(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimBase.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Dim cutoff</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={dimCutoff}
            onChange={(e) => setDimCutoff(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="font-mono text-[#ccc] w-10">{dimCutoff.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
