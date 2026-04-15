import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { PLACEMENTS, PLACEMENT_INDEX, ELIM_PLACEMENT, isFinale, type Placement } from '../../engine/types';

const PLACEMENT_COLORS: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#888888',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
  ELIM: '#8b0000',
};

const CHART_PLACEMENTS = [...PLACEMENTS, 'ELIM'] as const;

const MARGIN = { top: 44, right: 16, bottom: 24, left: 16 };
const NODE_WIDTH = 8;
const PLACEMENT_GAP = 10;
const SOURCE_COL_WIDTH = 72;
const MIN_FLOW = 0.0001;

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

  const { currentSeason: season, baselineResults, filteredResults, conditions, addCondition, removeCondition, clearConditions, selectedQueenId, setSelectedQueenId } =
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

    const numQueens = season.queens.length;
    const numEps = season.episodes.length;
    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = height - MARGIN.top - MARGIN.bottom;
    const placementAreaH = innerH;

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

    // -- Vertical scale: total initial flow = numQueens fills placement area --
    const SCALE = (placementAreaH - (CHART_PLACEMENTS.length - 1) * PLACEMENT_GAP) / numQueens;

    // -- Placement nodes (sized per column based on actual flow) --
    type NodePos = { y: number; h: number };
    const nodes: NodePos[][] = [];
    for (let col = 0; col < numCols; col++) {
      const nodeCol: NodePos[] = [];
      let cy = 0;
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        let totalF = 0;
        for (const q of queenOrder) totalF += flowData[q.id][col][CHART_PLACEMENTS[pi]] ?? 0;
        const h = totalF * SCALE;
        nodeCol.push({ y: cy, h });
        // No gap between BTM2 and ELIM — they form one contiguous "bottom zone"
        const gapAfter = CHART_PLACEMENTS[pi] === 'BTM2' ? 0 : PLACEMENT_GAP;
        cy += h + gapAfter;
      }
      nodes[col] = nodeCol;
    }

    // -- Queen bands within nodes (centered in constant-height nodes) --
    type BandPos = { y: number; h: number };
    const bands: Record<string, BandPos>[][] = [];
    for (let col = 0; col < numCols; col++) {
      bands[col] = [];
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const p = CHART_PLACEMENTS[pi];
        const bmap: Record<string, BandPos> = {};
        let actualH = 0;
        for (const q of queenOrder) actualH += (flowData[q.id][col][p] ?? 0) * SCALE;
        const offset = (nodes[col][pi].h - actualH) / 2;
        let cy = nodes[col][pi].y + offset;
        for (const q of queenOrder) {
          const f = flowData[q.id][col][p] ?? 0;
          const h = f * SCALE;
          bmap[q.id] = { y: cy, h };
          cy += h;
        }
        bands[col][pi] = bmap;
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

      // Source → ep 0: queen's source band splits into placement bands at ep 0
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
          queenId: qid, color: queen.color,
          srcX: SOURCE_COL_WIDTH - 16, srcY: sY,
          tgtX: colX(0) - NODE_WIDTH / 2, tgtY: tY,
          h,
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
                queenId: qid, color: queen.color,
                srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY,
                tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY,
                h,
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
                        queenId: qid, color: queen.color,
                        srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY,
                        tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY,
                        h,
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
                queenId: qid, color: queen.color,
                srcX: colX(ep) + NODE_WIDTH / 2, srcY: sY,
                tgtX: colX(ep + 1) - NODE_WIDTH / 2, tgtY: tY,
                h,
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
    const selId = selectedQueenId ?? queenOrder[0]?.id ?? null;

    const isSelected = (qid: string) => qid === selId;

    // Column labels
    for (let col = 0; col < numCols; col++) {
      const ep = season.episodes[col];
      const label = isFinale(ep) ? 'Finale' : `Ep ${ep.number}`;
      g.append('text')
        .attr('x', colX(col)).attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555').attr('font-size', '10px').attr('font-family', 'monospace')
        .text(label);
    }

    // Placement labels (left of first episode column)
    for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
      const node0 = nodes[0][pi];
      g.append('text')
        .attr('x', colX(0) - NODE_WIDTH / 2 - 6)
        .attr('y', node0.y + node0.h / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
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

    // Queen bands within nodes (opacity scales with flow)
    const maxBandH = Math.max(
      ...Array.from({ length: numCols }, (_, col) =>
        Math.max(...CHART_PLACEMENTS.map((_, pi) =>
          Math.max(...Object.values(bands[col][pi]).map((b) => b.h), 0)
        ))
      ), 1
    );
    for (let col = 0; col < numCols; col++) {
      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        for (const [qid, band] of Object.entries(bands[col][pi])) {
          if (band.h < 0.3) continue;
          const queen = queenMap.get(qid);
          if (!queen) continue;
          const t = band.h / maxBandH;
          const sel = isSelected(qid);
          g.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', band.y)
            .attr('width', NODE_WIDTH).attr('height', Math.max(band.h, 0.5))
            .attr('fill', queen.color)
            .attr('opacity', sel ? 0.15 + 0.45 * t : 0.02 * t)
            .style('pointer-events', 'none');
        }
      }
    }

    // Sub-ribbons (render weakest queens first, strongest on top)
    const winProbs = new Map(season.queens.map((q) => [q.id, results.winProb[q.id] ?? 0]));
    const sortedRibbons = [...allRibbons].sort(
      (a, b) => (winProbs.get(a.queenId) ?? 0) - (winProbs.get(b.queenId) ?? 0),
    );

    const ribbonGroup = g.append('g').attr('class', 'ribbons');

    const maxRibbonH = Math.max(...sortedRibbons.map((r) => r.h), 1);

    for (const r of sortedRibbons) {
      const t = r.h / maxRibbonH;
      const sel = isSelected(r.queenId);
      const fillOp = sel ? 0.15 + 0.45 * t : 0.02 * t;
      const strokeOp = sel ? 0.2 + 0.5 * t : 0.01 * t;
      ribbonGroup.append('path')
        .attr('d', ribbonPath(r.srcX, r.srcY, r.srcY + r.h, r.tgtX, r.tgtY, r.tgtY + r.h))
        .attr('fill', r.color)
        .attr('fill-opacity', fillOp)
        .attr('stroke', r.color)
        .attr('stroke-width', 0.3)
        .attr('stroke-opacity', strokeOp)
        .attr('data-queen', r.queenId)
        .attr('data-t', t);
    }

    const allPaths = ribbonGroup.selectAll<SVGPathElement, unknown>('path[data-queen]');

    // Helper: set ribbon opacities for hover highlight.
    // Hover boosts the hovered queen without fading the selected queen.
    function setRibbonOpacity(highlightId: string | null) {
      allPaths.each(function () {
        const el = d3.select(this);
        const pq = el.attr('data-queen')!;
        const pt = parseFloat(el.attr('data-t') || '1');
        const isSel = isSelected(pq);
        const isHover = highlightId !== null && pq === highlightId;
        let fOp: number, sOp: number;
        if (isSel || isHover) {
          fOp = 0.15 + 0.45 * pt; sOp = 0.2 + 0.5 * pt;
        } else {
          fOp = 0.02 * pt; sOp = 0.01 * pt;
        }
        el.attr('fill-opacity', fOp).attr('stroke-opacity', sOp);
      });
    }

    // Track which queens have pins (conditions)
    const queensWithPins = new Set<string>();
    for (const c of conditions) {
      const q = season.queens[c.queenIndex];
      if (q) queensWithPins.add(q.id);
    }

    // Source emitters + labels (click to select)
    for (const queen of queenOrder) {
      const sb = srcBands[queen.id];
      const sel = isSelected(queen.id);
      const hasPins = queensWithPins.has(queen.id);

      const srcGroup = g.append('g')
        .style('cursor', 'pointer');

      // Invisible hit area covering the full row
      srcGroup.append('rect')
        .attr('x', -MARGIN.left).attr('y', sb.y)
        .attr('width', SOURCE_COL_WIDTH - 16 + MARGIN.left).attr('height', sb.h)
        .attr('fill', 'transparent');

      // Color bar — bright when selected
      const colorBar = srcGroup.append('rect')
        .attr('x', SOURCE_COL_WIDTH - 22).attr('y', sb.y)
        .attr('width', 6).attr('height', sb.h)
        .attr('fill', queen.color).attr('opacity', sel ? 0.8 : 0.15).attr('rx', 1);

      // Queen name — always visible
      const nameText = srcGroup.append('text')
        .attr('x', SOURCE_COL_WIDTH - 26).attr('y', sb.y + sb.h / 2)
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('fill', queen.color)
        .attr('font-size', numQueens > 10 ? '8px' : '10px')
        .attr('font-weight', '600')
        .attr('opacity', 0.9)
        .text(queen.name.split(' ')[0]);

      // Yellow dot for queens with pins
      if (hasPins) {
        srcGroup.append('circle')
          .attr('cx', 2).attr('cy', sb.y + sb.h / 2)
          .attr('r', 2.5)
          .attr('fill', '#ffd700')
          .attr('opacity', 0.9)
          .style('pointer-events', 'none');
      }

      // Hover: highlight this queen's ribbons + brighten bar
      srcGroup
        .on('mouseenter', function () {
          colorBar.attr('opacity', 1.0);
          nameText.attr('opacity', 1.0);
          setRibbonOpacity(queen.id);
        })
        .on('mouseleave', function () {
          colorBar.attr('opacity', sel ? 0.8 : 0.15);
          nameText.attr('opacity', 0.9);
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
      const condEpIdx = col;

      for (let pi = 0; pi < CHART_PLACEMENTS.length; pi++) {
        const node = nodes[col][pi];
        if (node.h < 0.5) continue;
        const placementName = CHART_PLACEMENTS[pi];
        const placementNum = placementName === 'ELIM'
          ? ELIM_PLACEMENT
          : PLACEMENT_INDEX[placementName as Placement];
        const isPinned = pinSet.has(`${condEpIdx}:${placementNum}`);

        if (selectedQueen) {
          // Clickable overlay
          const overlay = overlayGroup.append('rect')
            .attr('x', colX(col) - NODE_WIDTH / 2).attr('y', node.y)
            .attr('width', NODE_WIDTH).attr('height', node.h)
            .attr('fill', isPinned ? selectedQueen!.color : 'transparent')
            .attr('opacity', isPinned ? 0.5 : 0)
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

          // Red X indicator for existing pins — centered on the queen's band
          if (isPinned) {
            const qBand = bands[col][pi][selectedQueen.id];
            const yCenter = qBand
              ? qBand.y + qBand.h / 2
              : node.y + node.h / 2;
            overlayGroup.append('text')
              .attr('x', colX(col)).attr('y', yCenter)
              .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
              .attr('fill', '#e74c3c').attr('font-size', '7px').attr('font-weight', 'bold')
              .style('pointer-events', 'none')
              .text('\u2715');
          }
        }
      }
    }

  }, [results, season, width, height, selectedQueenId, setSelectedQueenId, conditions, addCondition, removeCondition, clearConditions]);

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-medium text-[#888] mb-2 px-1">
        Season Flow — click a queen to select, click placements to pin
      </h3>
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
