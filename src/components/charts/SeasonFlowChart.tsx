import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { selectCurrentSeason } from '../../store/selectors';
import { PLACEMENTS, PLACEMENT_INDEX, ELIM_PLACEMENT, OUTCOME_EPISODE_INDEX, isFinale, type Placement } from '../../engine/types';
import { PLACEMENT_PALETTE as PLACEMENT_COLORS, PLACEMENT_PALETTE_BRIGHT as PLACEMENT_FLOW_COLORS } from './common/palette';
import { useContainerWidth } from './common/useContainerSize';
import { computeFlowData } from './seasonFlow/flowData';

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

interface Props {
  carrierWidth: number;
}

// Tuned defaults (previously exposed as sliders during iteration).
const DIM_EXP = 2;
const DIM_BASE = 0.04;
const DIM_CUTOFF = 0.3;
const PRE_SPLIT_WIDTH = 20;

export default function SeasonFlowChart({ carrierWidth }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, width } = useContainerWidth(1000);

  const season = useStore(selectCurrentSeason);
  const { baselineResults, filteredResults, conditions, addCondition, removeCondition, clearConditions, selectedQueenId, setSelectedQueenId } =
    useStore();
  const results = filteredResults ?? baselineResults;

  // Hover handlers live inside the structural effect (which doesn't re-run on
  // selection change, so the chart stays cheap to interact with). They read
  // current selection state via this ref instead of closing over selectedQueenId
  // directly — refreshed every render so effects always see the latest value.
  const selectedQueenIdRef = useRef(selectedQueenId);
  selectedQueenIdRef.current = selectedQueenId;

  // Geometry stash: the structural effect builds layout + ribbon geometry and
  // writes it here; the selection/pins effect reads from it to rebuild the
  // small, selection-specific overlays without re-doing the expensive work.
  type GeomStash = {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    overlayGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
    nodes: { y: number; h: number }[][];
    srcBands: Record<string, { y: number; h: number }>;
    queenOrder: { id: string; color: string; name: string }[];
    queenMap: Map<string, { id: string; color: string; name: string }>;
    colX: (col: number) => number;
    numCols: number;
    innerW: number;
    survival: Record<string, number[]>;
    elimByEp: Record<string, number[]>;
    pinDotsGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  };
  const geomRef = useRef<GeomStash | null>(null);

  // Pure derivation of per-queen survival/flow/elim probabilities from
  // (season, results). Independent of width / hover / selection — memoizing
  // here means the d3 effect doesn't redo this on every resize or hover.
  const flowDataMemo = useMemo(
    () => (results ? computeFlowData(season, results) : null),
    [season, results],
  );

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

    if (!flowDataMemo) return;
    const { queenOrder, survival, flow: flowData, elimByEp } = flowDataMemo;
    const numEps = season.episodes.length;
    const innerW = width - MARGIN.left - MARGIN.right;

    const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    const queenMap = new Map(season.queens.map((q) => [q.id, q]));

    // -- Horizontal layout --
    // Carrier (full-SCALE-height ribbon segment) runs from the right edge of
    // the queen color bar to the left edge of the ep 0 placement node. Its
    // width is manually controlled. ep → ep spacing is auto-sized to fill
    // the remaining area across numCols episodes.
    const numCols = numEps;
    const barEdgeX = SOURCE_COL_WIDTH - 28;
    const ep0X = barEdgeX + carrierWidth + NODE_WIDTH / 2;
    const epSpacing = (innerW - SOURCE_COL_WIDTH) / numCols;
    const colX = (col: number) => ep0X + col * epSpacing;

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

    // -- Source column (name rows stacked tightly; flow bands SELECTED_BAR_H
    //    tall, centered on each name; source ribbons pinch into this band on
    //    the left edge and fan out to full SCALE on the ep 0 placement side).
    //    Uniform across queens — the bar/ribbons are only *visible* for the
    //    selected or hovered queen, but the geometry is consistent. --
    const SELECTED_BAR_H = 19;
    const srcBands: Record<string, { y: number; h: number }> = {};
    for (let i = 0; i < queenOrder.length; i++) {
      const q = queenOrder[i];
      const rowCenter = srcColOffsetY + i * SRC_ROW_H + SCALE / 2;
      srcBands[q.id] = { y: rowCenter - SELECTED_BAR_H / 2, h: SELECTED_BAR_H };
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
    const elimIdx = CHART_PLACEMENTS.indexOf('ELIM');

    // Process per queen (consistent stacking order)
    for (const queen of queenOrder) {
      const qid = queen.id;

      // Source → ep 0: carrier is SCALE-tall across its full length so the
      // queen's 100% starting flow reads at the same thickness as the finale
      // column. The step from bar-thin (SELECTED_BAR_H) to carrier-fat (SCALE)
      // is a hard right angle at barEdgeX — no curved flare.
      //
      // The carrier has two sub-segments:
      //   1. Pre-split — strips stay stacked around the name row (sYFat),
      //      solid queen color, no placement divergence yet. Width is
      //      manually controlled (clamped to carrierWidth).
      //   2. Split — strips curve from sYFat to their ep 0 placement-node y,
      //      colors transition queen → placement.
      const centerY = srcBands[qid].y + srcBands[qid].h / 2;
      let scaleY = centerY - SCALE / 2;
      const qColor = queen.color;
      const preSplit = Math.min(PRE_SPLIT_WIDTH, carrierWidth);
      const splitStartX = barEdgeX + preSplit;

      for (let ti = 0; ti < CHART_PLACEMENTS.length; ti++) {
        const weight = flowData[qid][0][CHART_PLACEMENTS[ti]];
        if (weight < MIN_FLOW) continue;
        const hFat = weight * SCALE;

        const sY = scaleY;
        scaleY += hFat;

        const tY = inCursor[0][ti][qid];
        if (tY === undefined) continue;
        inCursor[0][ti][qid] += hFat;

        const pColor = PLACEMENT_FLOW_COLORS[CHART_PLACEMENTS[ti]];

        // Pre-split: solid queen color, horizontal rectangle
        if (preSplit > 0) {
          allRibbons.push({
            queenId: qid,
            srcX: barEdgeX, srcY: sY, srcH: hFat,
            tgtX: splitStartX, tgtY: sY, tgtH: hFat,
            srcT: 1.0, tgtT: 1.0,
            srcColor: qColor, tgtColor: qColor,
          });
        }

        // Split: curve from name-row-centered stack into ep 0 placement nodes
        allRibbons.push({
          queenId: qid,
          srcX: splitStartX, srcY: sY, srcH: hFat,
          tgtX: colX(0) - NODE_WIDTH / 2, tgtY: tY, tgtH: hFat,
          srcT: 1.0, tgtT: weight,
          srcColor: qColor, tgtColor: pColor,
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
    //
    // Structural rendering below does NOT depend on selectedQueenId or
    // conditions — those are consumed by the second effect further down. That
    // split keeps selection changes cheap: ~70 DOM ops instead of the ~5000
    // DOM creations required for ribbons/gradients/bands.
    //
    // Hover handlers DO depend on the current selection (to decide whether
    // a hovered queen overlays on top of the selected queen) — they read
    // selectedQueenIdRef.current at event time so they stay fresh even though
    // the handler closure was captured at structural-effect run time.
    const isSelected = (qid: string) => qid === selectedQueenIdRef.current;

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
      if (DIM_CUTOFF <= 0 || t >= DIM_CUTOFF) return 1;
      return DIM_BASE + (1 - DIM_BASE) * Math.pow(t / DIM_CUTOFF, DIM_EXP);
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
          // Default hidden — selection effect sets opacity for selected queen.
          bandGroup.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', band.y)
            .attr('width', NODE_WIDTH).attr('height', Math.max(band.h, 0.5))
            .attr('fill', PLACEMENT_FLOW_COLORS[placementName])
            .attr('opacity', 0)
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

    // Queen name underlines (shown on select/hover) live BELOW the ribbons.
    const srcBarsGroup = g.append('g').attr('class', 'src-bars');

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
      const qHoverColor = queen.color;
      gradQ.append('stop').attr('offset', '0%')
        .attr('stop-color', qHoverColor).attr('stop-opacity', dimOp(r.srcT));
      gradQ.append('stop').attr('offset', '100%')
        .attr('stop-color', qHoverColor).attr('stop-opacity', dimOp(r.tgtT));

      // Default hidden — selection effect raises the selected queen's ribbons.
      ribbonGroup.append('path')
        .attr('d', ribbonPath(r.srcX, r.srcY, r.srcY + r.srcH, r.tgtX, r.tgtY, r.tgtY + r.tgtH))
        .attr('fill', `url(#${gradIdP})`)
        .attr('stroke', `url(#${gradIdP})`)
        .attr('stroke-width', 0.3)
        .attr('opacity', 0)
        .attr('data-queen', r.queenId)
        .attr('data-grad-p', gradIdP)
        .attr('data-grad-q', gradIdQ);
    }

    const allPaths = ribbonGroup.selectAll<SVGPathElement, unknown>('path[data-queen]');

    // Helper: set ribbon opacities for hover highlight.
    // Selected queen always renders at 100% in the placement palette.
    // A different hovered queen overlays on top in her own color at 50%.
    function setRibbonOpacity(highlightId: string | null) {
      allPaths.each(function () {
        const el = d3.select(this);
        const pq = el.attr('data-queen')!;
        const isSel = isSelected(pq);
        const isHover = highlightId !== null && pq === highlightId;
        if (isSel) {
          el.attr('opacity', 1);
          const gradId = el.attr('data-grad-p')!;
          el.attr('fill', `url(#${gradId})`).attr('stroke', `url(#${gradId})`);
        } else if (isHover) {
          el.attr('opacity', 1);
          const gradId = el.attr('data-grad-q')!;
          el.attr('fill', `url(#${gradId})`).attr('stroke', `url(#${gradId})`);
        } else {
          el.attr('opacity', 0);
        }
      });
      allBands.each(function () {
        const el = d3.select(this);
        const pq = el.attr('data-queen')!;
        const pt = parseFloat(el.attr('data-t') || '1');
        const isSel = isSelected(pq);
        const isHover = highlightId !== null && pq === highlightId;
        if (isSel) {
          el.attr('opacity', dimOp(pt));
          el.attr('fill', el.attr('data-color-placement')!);
        } else if (isHover) {
          el.attr('opacity', dimOp(pt));
          el.attr('fill', el.attr('data-color-queen')!);
        } else {
          el.attr('opacity', 0);
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

    function setHoverQueen(hoverId: string | null) {
      for (const q of queenOrder) {
        const bar = queenBars[q.id];
        if (!bar) continue;
        const sel = isSelected(q.id);
        const isHover = hoverId === q.id;
        bar.attr('opacity', sel || isHover ? 1.0 : 0);
      }
    }

    // Name texts + pin dots live in a group rendered AFTER ribbonGroup so
    // they stay on top of ribbons. Bars were rendered before ribbons (in
    // srcBarsGroup) so the flow appears to emerge from within the bar.
    const srcNamesGroup = g.append('g').attr('class', 'src-names')
      .style('pointer-events', 'none');

    // Container for yellow pin dots on queen names. Populated by the
    // selection/pins effect; cleared + rebuilt on conditions change.
    const pinDotsGroup = srcNamesGroup.append('g').attr('class', 'pin-dots');

    for (const queen of queenOrder) {
      const sb = srcBands[queen.id];
      const nameCenter = sb.y + sb.h / 2;

      const srcGroup = g.append('g')
        .style('cursor', 'pointer');

      // Invisible hit area — tight row (non-overlapping).
      srcGroup.append('rect')
        .attr('x', -MARGIN.left).attr('y', nameCenter - SRC_ROW_H / 2)
        .attr('width', SOURCE_COL_WIDTH - 16 + MARGIN.left).attr('height', SRC_ROW_H)
        .attr('fill', 'transparent');

      const nameColor = queen.color;

      // Queen name — always rendered in the queen's color. Font-weight is
      // toggled bold by the selection effect. Yellow pin dots + underline
      // visibility are also controlled there.
      const nameText = srcNamesGroup.append('text')
        .attr('class', 'src-name')
        .attr('data-queen', queen.id)
        .attr('x', SOURCE_COL_WIDTH - 38).attr('y', nameCenter)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('fill', nameColor)
        .attr('font-size', numQueens > 10 ? '12px' : '15px')
        .attr('font-weight', '600')
        .attr('opacity', 1.0)
        .text(queen.name.split(' ')[0]);
      queenNames[queen.id] = nameText;

      // Underline — hidden by default. Selection effect shows it for the
      // selected queen; hover handler flickers it for the hovered queen.
      const nameBBox = nameText.node()!.getBBox();
      const underline = srcBarsGroup.append('rect')
        .attr('class', 'src-underline')
        .attr('data-queen', queen.id)
        .attr('x', nameBBox.x).attr('y', nameBBox.y + nameBBox.height + 1)
        .attr('width', nameBBox.width).attr('height', 2)
        .attr('fill', nameColor)
        .attr('opacity', 0);
      queenBars[queen.id] = underline;

      // Hover: reveal this queen's color bar + highlight ribbons.
      srcGroup
        .on('mouseenter', function () {
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

    // Empty container for pin overlays — populated by the selection/pins effect.
    const overlayGroup = g.append('g').attr('class', 'pin-overlays');

    // Stash geometry for the selection/pins effect.
    geomRef.current = {
      g,
      overlayGroup,
      nodes,
      srcBands,
      queenOrder,
      queenMap,
      colX,
      numCols,
      innerW,
      survival,
      elimByEp,
      pinDotsGroup,
    };

  }, [flowDataMemo, results, season, width, height, numQueens, placementAreaH, rectStackOffsetY, srcColOffsetY, setSelectedQueenId, clearConditions, carrierWidth]);

  // Selection + pins effect: cheap updates to the already-drawn DOM.
  //   - Toggles ribbon / band opacities
  //   - Toggles name font-weight + underline opacity
  //   - Rebuilds yellow pin dots next to queen names
  //   - Rebuilds per-placement pin overlays (halo + click overlay + X mark)
  // Runs AFTER the structural effect on any render that re-did structure
  // (they share layout deps), and independently when selectedQueenId or
  // conditions change.
  useEffect(() => {
    const geom = geomRef.current;
    if (!geom || !svgRef.current || !results) return;
    const {
      g, overlayGroup, nodes, srcBands, queenOrder, queenMap,
      colX, numCols, innerW, survival, elimByEp, pinDotsGroup,
    } = geom;

    const dimOp = (t: number): number => {
      if (DIM_CUTOFF <= 0 || t >= DIM_CUTOFF) return 1;
      return DIM_BASE + (1 - DIM_BASE) * Math.pow(t / DIM_CUTOFF, DIM_EXP);
    };

    const selId = selectedQueenId;
    const isSelected = (qid: string) => qid === selId;

    // -- Ribbon opacities (selected queen on, others off) -------------------
    const svgSel = d3.select(svgRef.current);
    svgSel.selectAll<SVGPathElement, unknown>('.ribbons path[data-queen]').each(function () {
      const el = d3.select(this);
      const pq = el.attr('data-queen');
      if (isSelected(pq)) {
        el.attr('opacity', 1);
        const gradId = el.attr('data-grad-p');
        el.attr('fill', `url(#${gradId})`).attr('stroke', `url(#${gradId})`);
      } else {
        el.attr('opacity', 0);
      }
    });

    // -- Queen band opacities ------------------------------------------------
    svgSel.selectAll<SVGRectElement, unknown>('.queen-bands rect[data-queen]').each(function () {
      const el = d3.select(this);
      const pq = el.attr('data-queen');
      const pt = parseFloat(el.attr('data-t') || '1');
      if (isSelected(pq)) {
        el.attr('opacity', dimOp(pt));
        el.attr('fill', el.attr('data-color-placement')!);
      } else {
        el.attr('opacity', 0);
      }
    });

    // -- Name weight / underline visibility ---------------------------------
    svgSel.selectAll<SVGTextElement, unknown>('text.src-name').each(function () {
      const el = d3.select(this);
      el.attr('font-weight', isSelected(el.attr('data-queen')) ? '800' : '600');
    });
    svgSel.selectAll<SVGRectElement, unknown>('rect.src-underline').each(function () {
      const el = d3.select(this);
      el.attr('opacity', isSelected(el.attr('data-queen')) ? 1 : 0);
    });

    // -- Yellow pin dots (any queen with at least one pin) ------------------
    pinDotsGroup.selectAll('*').remove();
    const queensWithPins = new Set<string>();
    for (const c of conditions) {
      const q = season.queens[c.queenIndex];
      if (q) queensWithPins.add(q.id);
    }
    for (const queen of queenOrder) {
      if (!queensWithPins.has(queen.id)) continue;
      const nameText = svgSel.select<SVGTextElement>(`text.src-name[data-queen="${queen.id}"]`);
      const nameNode = nameText.node();
      if (!nameNode) continue;
      const bbox = nameNode.getBBox();
      const sb = srcBands[queen.id];
      const nameCenter = sb.y + sb.h / 2;
      pinDotsGroup.append('circle')
        .attr('cx', bbox.x - 20).attr('cy', nameCenter)
        .attr('r', 2.5)
        .attr('fill', '#ffd700')
        .attr('opacity', 0.9);
    }

    // -- Placement pin overlays (only for selected queen) -------------------
    overlayGroup.selectAll('*').remove();
    const selectedQueen = selId ? queenMap.get(selId) ?? null : null;
    if (!selectedQueen) return;
    const selectedQueenIdx = season.queens.findIndex((q) => q.id === selectedQueen.id);

    const pinSet = new Set<string>();
    for (const c of conditions) {
      if (c.queenIndex === selectedQueenIdx) {
        pinSet.add(`${c.episodeIndex}:${c.placement}`);
      }
    }

    for (let col = 0; col < numCols; col++) {
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

        if (isPinned) {
          overlayGroup.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', node.y)
            .attr('width', NODE_WIDTH).attr('height', node.h)
            .attr('fill', '#ffd700').attr('opacity', 1)
            .attr('rx', 1)
            .attr('filter', 'url(#pin-glow)')
            .style('pointer-events', 'none');
        }

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
            const qid = selectedQueen.id;
            const dist = results.episodePlacements[col]?.[qid] ?? {};
            const elimProb = elimByEp[qid]?.[col] ?? 0;
            const surv = survival[qid]?.[col] ?? 0;
            const rawProb = placementName === 'ELIM' ? elimProb : (dist[placementName] ?? 0);
            const noRoutes = !isPinned && rawProb < 0.001;
            const priorElim = Math.max(0, Math.min(1, 1 - surv));

            const ttTextW = 65;
            const ttBarW = 34;
            const ttW = ttTextW + ttBarW;
            const lineH = 12;
            const numRows = CHART_PLACEMENTS.length + 1;
            const ttH = 22 + numRows * lineH;
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
              .attr('x', 6).attr('y', 14)
              .attr('fill', PLACEMENT_COLORS[placementName]).attr('font-size', '9px').attr('font-weight', 'bold')
              .text(`${isFinale(season.episodes[col]) ? 'Finale' : `Ep ${season.episodes[col].number}`} / ${placementName}`);

            CHART_PLACEMENTS.forEach((p, idx) => {
              const prob = p === 'ELIM' ? elimProb : surv * (dist[p] ?? 0);
              const rowRaw = p === 'ELIM' ? elimProb : (dist[p] ?? 0);
              const rowDead = rowRaw < 0.001;
              const valStr = rowDead ? ' --' : `${(prob * 100).toFixed(0).padStart(3)}%`;
              tt.append('text')
                .attr('x', 6).attr('y', 27 + idx * lineH)
                .attr('fill', p === 'ELIM' ? '#b22222' : PLACEMENT_COLORS[p])
                .attr('font-size', '9px').attr('font-family', 'monospace')
                .attr('opacity', isPinned || noRoutes ? 0.2 : 1)
                .text(`${p.padEnd(6)} ${valStr}`);
            });

            tt.append('text')
              .attr('x', 6).attr('y', 27 + CHART_PLACEMENTS.length * lineH)
              .attr('fill', '#666')
              .attr('font-size', '9px').attr('font-family', 'monospace')
              .attr('opacity', isPinned || noRoutes ? 0.2 : 1)
              .text(`${'P.ELIM'.padEnd(6)} ${(priorElim * 100).toFixed(0).padStart(3)}%`);

            type BarSeg = { key: string; value: number; color: string };
            const barInput: BarSeg[] = [
              { key: 'WIN', value: surv * (dist['WIN'] ?? 0), color: PLACEMENT_COLORS['WIN'] },
              { key: 'HIGH', value: surv * (dist['HIGH'] ?? 0), color: PLACEMENT_COLORS['HIGH'] },
              { key: 'SAFE', value: surv * (dist['SAFE'] ?? 0), color: PLACEMENT_COLORS['SAFE'] },
              { key: 'LOW', value: surv * (dist['LOW'] ?? 0), color: PLACEMENT_COLORS['LOW'] },
              { key: 'BTM2', value: surv * (dist['BTM2'] ?? 0), color: PLACEMENT_COLORS['BTM2'] },
              { key: 'ELIM', value: elimProb, color: PLACEMENT_COLORS['ELIM'] },
              { key: 'P.ELIM', value: priorElim, color: '#333' },
            ];

            const statsH = numRows * lineH;
            const barW = 20;
            const barX = ttTextW + (ttBarW - barW) / 2;
            const barY = 19;
            const barH = statsH - 2;
            const barTotal = barInput.reduce((s, d) => s + d.value, 0);

            if (barTotal > 0) {
              const barG = tt.append('g').attr('opacity', isPinned || noRoutes ? 0.2 : 1);
              let yOff = 0;
              for (const d of barInput) {
                if (d.value < 0.001) continue;
                const segH = (d.value / barTotal) * barH;
                barG.append('rect')
                  .attr('x', barX).attr('y', barY + yOff)
                  .attr('width', barW).attr('height', segH)
                  .attr('fill', d.color);
                yOff += segH;
              }
              barG.append('rect')
                .attr('x', barX).attr('y', barY)
                .attr('width', barW).attr('height', barH)
                .attr('fill', 'none')
                .attr('stroke', '#3e5d78').attr('stroke-width', 1);
            }

            if (isPinned || noRoutes) {
              tt.append('text')
                .attr('x', ttW / 2).attr('y', 19 + statsH / 2)
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
            const ttW = 65 + 34;
            const ttH = 22 + (CHART_PLACEMENTS.length + 1) * 12;
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
              const qid = selectedQueen.id;
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
  }, [selectedQueenId, conditions, flowDataMemo, results, season, width, height, numQueens, placementAreaH, rectStackOffsetY, srcColOffsetY, carrierWidth, addCondition, removeCondition]);

  return (
    <div ref={containerRef}>
      {results ? (
        <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
      ) : (
        <div className="flex items-center justify-center text-[#444]" style={{ height }}>
          Running simulations...
        </div>
      )}
    </div>
  );
}
