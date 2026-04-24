// Builds the directed lip-sync graph (loser → winner edges) and computes
// longest-path layering for vertical placement.
//
// Cycles (from All Stars rematches) are handled by the Eades et al. (1993)
// greedy feedback-arc-set heuristic: we produce a linear order of queens
// that maximizes edges pointing "forward" (loser earlier, winner later), and
// treat the minority "backward" edges as feedback arcs. Layering is computed
// on the forward DAG only; backward edges are still returned so the UI can
// render them as the "upsets" that broke the hierarchy.
//
// Level 0 is the top. level(v) = 1 + max(level(u)) over forward edges v→u.

import type { LipSyncNode, LipSyncEdge } from './lipSyncsGraph';

export type DirectedEdge = {
  from: string; // loser
  to: string; // winner
  original: LipSyncEdge;
  isBackward: boolean; // true if in the feedback arc set
  // Flow-diagram weight: each queen sums F = incoming flow from her wins,
  // then sends F+1 through each of her losses. Backward (upset) edges are
  // excluded from the flow calculation and carry flow 0.
  flow: number;
};

export type LipSyncLayout = {
  levels: Map<string, number>;
  maxLevel: number;
  directed: DirectedEdge[];
  feedbackCount: number;
  // Per-node starting x (in SVG user-space). Computed by a barycenter
  // crossing-minimization sweep on the layered DAG, so the force sim gets a
  // good head start instead of having to discover a sane ordering from noise.
  initialX: Map<string, number>;
};

const LAYOUT_WIDTH = 1600;
const LAYOUT_MARGIN = 60;
const BARY_SWEEPS = 24;

export function computeLipSyncLayout(
  nodes: LipSyncNode[],
  edges: LipSyncEdge[],
): LipSyncLayout {
  const rawDirected: { from: string; to: string; original: LipSyncEdge }[] = [];
  for (const e of edges) {
    if (e.aWins > e.bWins) {
      rawDirected.push({ from: e.b, to: e.a, original: e });
    } else if (e.bWins > e.aWins) {
      rawDirected.push({ from: e.a, to: e.b, original: e });
    }
  }

  const outAdj = new Map<string, Set<string>>();
  const inAdj = new Map<string, Set<string>>();
  for (const n of nodes) {
    outAdj.set(n.id, new Set());
    inAdj.set(n.id, new Set());
  }
  for (const d of rawDirected) {
    outAdj.get(d.from)!.add(d.to);
    inAdj.get(d.to)!.add(d.from);
  }

  const order = eadesGreedyOrder(nodes.map((n) => n.id), outAdj, inAdj);
  const orderIndex = new Map<string, number>();
  order.forEach((id, i) => orderIndex.set(id, i));

  let feedbackCount = 0;
  const directed: DirectedEdge[] = rawDirected.map((d) => {
    // Forward = loser earlier in σ than winner. Self-loops can't exist here
    // (buildLipSyncGraph skips idA === idB), so strict < is the right test.
    const isBackward = orderIndex.get(d.from)! >= orderIndex.get(d.to)!;
    if (isBackward) feedbackCount += 1;
    return { ...d, isBackward, flow: 0 };
  });

  const forwardAdj = new Map<string, string[]>();
  for (const n of nodes) forwardAdj.set(n.id, []);
  for (const d of directed) {
    if (!d.isBackward) forwardAdj.get(d.from)!.push(d.to);
  }

  const levels = new Map<string, number>();
  const visiting = new Set<string>();
  const computeLevel = (v: string): number => {
    const c = levels.get(v);
    if (c !== undefined) return c;
    if (visiting.has(v)) return 0; // forward graph is a DAG by construction
    visiting.add(v);
    let maxOut = -1;
    for (const w of forwardAdj.get(v)!) {
      const lw = computeLevel(w);
      if (lw > maxOut) maxOut = lw;
    }
    visiting.delete(v);
    const lvl = maxOut + 1;
    levels.set(v, lvl);
    return lvl;
  };

  // level(v) = longestPathToSink(v). Sinks (queens who never lost in the
  // forward DAG) at L0; each forward edge loser→winner means loser sits one
  // level deeper than her winner.
  let maxLevel = 0;
  for (const n of nodes) {
    const lvl = computeLevel(n.id);
    if (lvl > maxLevel) maxLevel = lvl;
  }

  // Flow computation: at each queen, F = sum of incoming flow from her wins;
  // she then pushes F+1 through each of her losses. Iterate by descending
  // level = descending d — d(loser) > d(winner) in the forward DAG, so we
  // always process predecessors (losers; senders of flow) before successors
  // (winners; receivers). Backward edges stay at flow 0.
  const outForward = new Map<string, DirectedEdge[]>();
  for (const n of nodes) outForward.set(n.id, []);
  for (const d of directed) {
    if (!d.isBackward) outForward.get(d.from)!.push(d);
  }
  const incomingFlow = new Map<string, number>();
  for (const n of nodes) incomingFlow.set(n.id, 0);
  const byDescendingLevel = [...nodes].sort(
    (a, b) => (levels.get(b.id) ?? 0) - (levels.get(a.id) ?? 0),
  );
  for (const n of byDescendingLevel) {
    const F = incomingFlow.get(n.id) ?? 0;
    for (const d of outForward.get(n.id) ?? []) {
      const out = F + 1;
      d.flow = out;
      incomingFlow.set(d.to, (incomingFlow.get(d.to) ?? 0) + out);
    }
  }

  // Undirected neighbor adjacency (forward edges only — backward edges are
  // the upsets we flagged and shouldn't influence ordering).
  const neighbors = new Map<string, string[]>();
  for (const n of nodes) neighbors.set(n.id, []);
  for (const d of directed) {
    if (d.isBackward) continue;
    neighbors.get(d.from)!.push(d.to);
    neighbors.get(d.to)!.push(d.from);
  }

  const initialX = barycenterSweep(nodes, levels, maxLevel, neighbors);

  return { levels, maxLevel, directed, feedbackCount, initialX };
}

// Sugiyama-style crossing minimization: iteratively reorder nodes within each
// level by the average x of their neighbors in adjacent levels, sweeping up
// then down. Converges quickly (in practice ~10 sweeps suffice; we do 24 to
// be safe). Positions are then spread evenly across LAYOUT_WIDTH.
function barycenterSweep(
  nodes: LipSyncNode[],
  levels: Map<string, number>,
  maxLevel: number,
  neighbors: Map<string, string[]>,
): Map<string, number> {
  const byLevel = new Map<number, string[]>();
  for (let l = 0; l <= maxLevel; l += 1) byLevel.set(l, []);
  for (const n of nodes) byLevel.get(levels.get(n.id)!)!.push(n.id);
  // Deterministic initial order: alphabetical by id.
  for (const ids of byLevel.values()) ids.sort();

  const spread = (): Map<string, number> => {
    const x = new Map<string, number>();
    const usable = LAYOUT_WIDTH - 2 * LAYOUT_MARGIN;
    for (const [, ids] of byLevel) {
      if (ids.length === 0) continue;
      if (ids.length === 1) {
        x.set(ids[0], LAYOUT_WIDTH / 2);
        continue;
      }
      const step = usable / (ids.length - 1);
      ids.forEach((id, i) => x.set(id, LAYOUT_MARGIN + step * i));
    }
    return x;
  };

  let x = spread();
  for (let pass = 0; pass < BARY_SWEEPS; pass += 1) {
    const goingDown = pass % 2 === 0;
    const levelSeq: number[] = [];
    if (goingDown) {
      for (let l = 0; l <= maxLevel; l += 1) levelSeq.push(l);
    } else {
      for (let l = maxLevel; l >= 0; l -= 1) levelSeq.push(l);
    }
    for (const level of levelSeq) {
      const ids = byLevel.get(level)!;
      if (ids.length < 2) continue;
      const bary = new Map<string, number>();
      for (const id of ids) {
        const ns = neighbors.get(id)!;
        if (ns.length === 0) {
          bary.set(id, x.get(id)!);
          continue;
        }
        let sum = 0;
        for (const w of ns) sum += x.get(w)!;
        bary.set(id, sum / ns.length);
      }
      ids.sort((a, b) => {
        const da = bary.get(a)!;
        const db = bary.get(b)!;
        if (da !== db) return da - db;
        return a < b ? -1 : 1;
      });
    }
    x = spread();
  }
  return x;
}

// Eades / Lin / Smyth (1993) greedy heuristic for minimum feedback arc set.
// Linear-time approximation — not optimal, but near-optimal in practice and
// far faster than exact FAS (which is NP-hard).
function eadesGreedyOrder(
  nodeIds: string[],
  origOut: Map<string, Set<string>>,
  origIn: Map<string, Set<string>>,
): string[] {
  const out = new Map<string, Set<string>>();
  const inn = new Map<string, Set<string>>();
  const remaining = new Set<string>(nodeIds);
  for (const id of nodeIds) {
    out.set(id, new Set(origOut.get(id) ?? []));
    inn.set(id, new Set(origIn.get(id) ?? []));
  }
  const s1: string[] = [];
  const s2: string[] = [];

  const removeVertex = (v: string) => {
    for (const w of out.get(v)!) inn.get(w)?.delete(v);
    for (const u of inn.get(v)!) out.get(u)?.delete(v);
    out.delete(v);
    inn.delete(v);
    remaining.delete(v);
  };

  while (remaining.size > 0) {
    let changed = true;
    while (changed) {
      changed = false;
      // Peel off sinks (no outgoing) → prepend to s2 (end of final order).
      for (const v of [...remaining]) {
        if (out.get(v)!.size === 0) {
          s2.unshift(v);
          removeVertex(v);
          changed = true;
        }
      }
      // Peel off sources (no incoming) → append to s1 (start of final order).
      for (const v of [...remaining]) {
        if (inn.get(v)!.size === 0) {
          s1.push(v);
          removeVertex(v);
          changed = true;
        }
      }
    }
    if (remaining.size > 0) {
      // Pick the remaining vertex with the largest outdeg − indeg.
      let best: string | null = null;
      let bestDelta = -Infinity;
      for (const v of remaining) {
        const d = out.get(v)!.size - inn.get(v)!.size;
        if (d > bestDelta) {
          bestDelta = d;
          best = v;
        }
      }
      s1.push(best!);
      removeVertex(best!);
    }
  }

  return [...s1, ...s2];
}
