import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as d3 from 'd3';
import { buildLipSyncGraph, seasonLabel, type LipSyncNode } from './lipSyncsGraph';
import { computeLipSyncLayout, computeFlow, type DirectedEdge } from './lipSyncLayout';

type SimNode = LipSyncNode & { level: number } & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode> & {
  original: DirectedEdge;
  source: SimNode | string;
  target: SimNode | string;
};

const SEASON_ORDER = [
  's01','s02','s03','s04','s05','s06','s07','s08','s09',
  's10','s11','s12','s13','s14','s15','s16','s17','s18',
  'as01','as02','as03','as04','as05','as06','as07','as08','as09','as10',
];

function seasonColor(seasonId: string): string {
  const idx = SEASON_ORDER.indexOf(seasonId);
  const hue = ((idx >= 0 ? idx : 0) * 360) / SEASON_ORDER.length;
  return `hsl(${hue}, 55%, 60%)`;
}

// In 3D: tiers stack along the world Y axis; in-plane freedom is X and Z.
// ROW_HEIGHT becomes the vertical gap between tier planes (world-space).
const ROW_HEIGHT = 120;
// Half-extent of each tier plane in X and Z. Also defines the (x, z) box
// the force sim lives in.
const PLANE_HALF = 800;
const RED = '#e5484d';

const VW = 1600;
const VH = 450;
const FOCAL = 1400;

type Camera = {
  yaw: number;
  pitch: number;
  distance: number;
  // Pan offset added to the auto-centroid camera target. Shift-drag adjusts
  // this; orbit and zoom always pivot around (centroid + panOffset).
  panOffset: { x: number; y: number; z: number };
};

type Projected = { sx: number; sy: number; depth: number; scale: number };

function project(
  p: { x: number; y: number; z: number },
  cam: Camera,
  target: { x: number; y: number; z: number },
): Projected | null {
  const dx = p.x - target.x;
  const dy = p.y - target.y;
  const dz = p.z - target.z;
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  // Yaw around world-up (Y).
  const rx = dx * cy - dz * sy;
  const rz = dx * sy + dz * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  // Pitch around camera-right (X).
  const ry = dy * cp - rz * sp;
  const rz2 = dy * sp + rz * cp;
  // Camera looks down -Z after rotation; viewer-space depth is distance - rz2.
  const viewZ = cam.distance - rz2;
  if (viewZ < 1) return null;
  const scale = FOCAL / viewZ;
  return {
    sx: rx * scale + VW / 2,
    sy: -ry * scale + VH / 2,
    depth: viewZ,
    scale,
  };
}

export default function LipSyncsPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [, setTick] = useState(0);
  const [hovered, setHovered] = useState<SimNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [disabledSeasons, setDisabledSeasons] = useState<Set<string>>(() => new Set());

  const [showCycleEdges, setShowCycleEdges] = useState(false);
  const [contiguousOnly, setContiguousOnly] = useState(true);
  const [colorByTerminal, setColorByTerminal] = useState(false);
  const [invertLevels, setInvertLevels] = useState(true);
  const [nameFilter, setNameFilter] = useState('');

  const [thickMin, setThickMin] = useState(1);
  const [thickMax, setThickMax] = useState(8);
  const [lowCutoff, setLowCutoff] = useState(0);
  const [highCutoff, setHighCutoff] = useState(1);
  const [thickExp, setThickExp] = useState(0.5);

  // Force-sim physics — exposed so the user can tune layout interactively.
  // Wide ranges; defaults match what the sim previously had hardcoded.
  const [linkStrength, setLinkStrength] = useState(1);
  const [linkDistance, setLinkDistance] = useState(500);
  const [repulsion, setRepulsion] = useState(1000);
  const [repulsionMax, setRepulsionMax] = useState(11000);
  const [collideRadius, setCollideRadius] = useState(25);
  const [velocityDecay, setVelocityDecay] = useState(0.04);
  const [alphaDecay, setAlphaDecay] = useState(0.015);
  const [alphaTarget, setAlphaTarget] = useState(0);
  const [showPhysics, setShowPhysics] = useState(false);
  const [showEdgeOpts, setShowEdgeOpts] = useState(false);

  const { simNodes, simLinks, maxLevel, feedbackCount } = useMemo(() => {
    const { nodes: allNodes, edges: allEdges } = buildLipSyncGraph(true);
    const nodeVisible = (n: LipSyncNode) => n.seasons.some((s) => !disabledSeasons.has(s));
    const nodes = allNodes.filter(nodeVisible);
    const kept = new Set(nodes.map((n) => n.id));
    const edges = allEdges
      .filter((e) => kept.has(e.a) && kept.has(e.b))
      .map((e) => {
        const matches = e.matches.filter((m) => !disabledSeasons.has(m.seasonId));
        if (matches.length === 0) return null;
        let aWins = 0, bWins = 0, ties = 0;
        for (const m of matches) {
          if (m.outcome === 'tie') { aWins += 1; bWins += 1; ties += 1; }
          else if (m.outcome === 'a') aWins += 1;
          else bWins += 1;
        }
        return { ...e, aWins, bWins, ties, matches };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    const { levels, maxLevel, directed, feedbackCount, initialX } = computeLipSyncLayout(nodes, edges, { invertLevels });

    // Compute the active forward-edge predicate. Three modes:
    //   - !contiguousOnly:        all forward edges active
    //   - contiguousOnly && !invertLevels:
    //                             only edges spanning exactly one level
    //   - contiguousOnly && invertLevels:
    //                             contiguous edges + non-contiguous edges
    //                             that bridge otherwise-separate components.
    //                             Built via union-find — non-contiguous edges
    //                             are added in order of smallest level-gap
    //                             first; an edge is kept only when its
    //                             endpoints are still in different components.
    const isForwardActive: (d: DirectedEdge) => boolean = (() => {
      if (!contiguousOnly) return (d) => !d.isBackward;
      if (!invertLevels) {
        return (d) => {
          if (d.isBackward) return false;
          const la = levels.get(d.from) ?? 0;
          const lb = levels.get(d.to) ?? 0;
          return Math.abs(la - lb) === 1;
        };
      }
      // Bridge mode.
      const parent = new Map<string, string>();
      for (const n of nodes) parent.set(n.id, n.id);
      const find = (x: string): string => {
        let r = x;
        while (parent.get(r) !== r) r = parent.get(r)!;
        let cur = x;
        while (parent.get(cur) !== r) {
          const next = parent.get(cur)!;
          parent.set(cur, r);
          cur = next;
        }
        return r;
      };
      const union = (a: string, b: string) => {
        const ra = find(a);
        const rb = find(b);
        if (ra !== rb) parent.set(ra, rb);
      };
      // Pass 1: union all contiguous forward edges.
      for (const d of directed) {
        if (d.isBackward) continue;
        const la = levels.get(d.from) ?? 0;
        const lb = levels.get(d.to) ?? 0;
        if (Math.abs(la - lb) === 1) union(d.from, d.to);
      }
      // Pass 2: consider non-contiguous forward edges, smallest gap first.
      // Add those whose endpoints are still in different components.
      const nonCont: DirectedEdge[] = [];
      for (const d of directed) {
        if (d.isBackward) continue;
        const la = levels.get(d.from) ?? 0;
        const lb = levels.get(d.to) ?? 0;
        if (Math.abs(la - lb) !== 1) nonCont.push(d);
      }
      nonCont.sort((a, b) => {
        const ga = Math.abs((levels.get(a.from) ?? 0) - (levels.get(a.to) ?? 0));
        const gb = Math.abs((levels.get(b.from) ?? 0) - (levels.get(b.to) ?? 0));
        return ga - gb;
      });
      const bridges = new Set<DirectedEdge>();
      for (const d of nonCont) {
        if (find(d.from) !== find(d.to)) {
          bridges.add(d);
          union(d.from, d.to);
        }
      }
      return (d) => {
        if (d.isBackward) return false;
        const la = levels.get(d.from) ?? 0;
        const lb = levels.get(d.to) ?? 0;
        if (Math.abs(la - lb) === 1) return true;
        return bridges.has(d);
      };
    })();

    // Recompute flow over the currently-visible edge set so thickness
    // reflects what's rendered. Non-active edges stay at flow 0 and flow
    // through the remaining edges re-adds up accordingly.
    computeFlow(nodes, levels, directed, isForwardActive);

    // Map barycenter initialX (in [LAYOUT_MARGIN, LAYOUT_WIDTH-MARGIN],
    // LAYOUT_WIDTH=1600) into our centered [-PLANE_HALF, PLANE_HALF] X range.
    // Seed Z with a small random jitter so the sim has gradient to spread on.
    const byId = new Map<string, SimNode>();
    const simNodes: SimNode[] = nodes.map((n) => {
      const level = levels.get(n.id) ?? 0;
      const ix = initialX.get(n.id) ?? 800;
      const x3 = ((ix - 800) / 800) * PLANE_HALF;
      const sn: SimNode = {
        ...n,
        level,
        x: x3,
        y: (Math.random() - 0.5) * PLANE_HALF * 1.6,
      };
      byId.set(n.id, sn);
      return sn;
    });
    const simLinks: SimLink[] = directed
      .filter((d) => {
        if (d.isBackward) return showCycleEdges;
        return isForwardActive(d);
      })
      .map((d) => {
        const s = byId.get(d.from);
        const t = byId.get(d.to);
        if (!s || !t) return null;
        return { source: s, target: t, original: d } as SimLink;
      })
      .filter((l): l is SimLink => l !== null);
    return { simNodes, simLinks, maxLevel, feedbackCount };
  }, [disabledSeasons, showCycleEdges, contiguousOnly, invertLevels]);

  // Dev-only live introspection hook. `window.__lipSync` exposes the current
  // layout (nodes with level, directed edges with flow/isBackward, maxLevel)
  // plus convenience queries so the preview server can be interrogated like
  // a live database — e.g. `__lipSync.find('Jan')`, `__lipSync.chain('widow')`.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const nodeList = simNodes.map((n) => ({
      id: n.id,
      name: n.name,
      level: n.level,
      seasons: n.seasons,
    }));
    const byId = new Map(nodeList.map((n) => [n.id, n]));
    const edgeList = simLinks.map((l) => {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      return {
        from: s, // loser
        to: t, // winner
        isBackward: l.original.isBackward,
        flow: l.original.flow,
      };
    });
    const nameIndex = new Map<string, typeof nodeList>();
    for (const n of nodeList) {
      const k = n.name.toLowerCase();
      if (!nameIndex.has(k)) nameIndex.set(k, []);
      nameIndex.get(k)!.push(n);
    }
    const find = (q: string) => {
      const k = q.toLowerCase();
      const exact = nameIndex.get(k);
      if (exact) return exact;
      return nodeList.filter((n) => n.name.toLowerCase().includes(k) || n.id.toLowerCase().includes(k));
    };
    const losses = (id: string) => edgeList.filter((e) => e.from === id); // queens id lost to (outgoing)
    const wins = (id: string) => edgeList.filter((e) => e.to === id); // queens id beat (incoming)
    const chainDown = (id: string): Array<{ id: string; level: number; name: string }> => {
      // Walk from id along forward edges to a sink, taking the deepest winner at each step.
      const path: string[] = [id];
      const seen = new Set([id]);
      let cur = id;
      while (true) {
        const out = losses(cur).filter((e) => !e.isBackward && !seen.has(e.to));
        if (out.length === 0) break;
        out.sort((a, b) => (byId.get(a.to)?.level ?? 0) - (byId.get(b.to)?.level ?? 0));
        cur = out[0].to;
        seen.add(cur);
        path.push(cur);
      }
      return path.map((p) => {
        const n = byId.get(p)!;
        return { id: n.id, level: n.level, name: n.name };
      });
    };
    // @ts-expect-error — dev debug hatch
    window.__lipSync = {
      nodes: nodeList,
      edges: edgeList,
      maxLevel,
      feedbackCount,
      find,
      losses,
      wins,
      chain: chainDown,
      byLevel: (lvl: number) => nodeList.filter((n) => n.level === lvl),
    };
  }, [simNodes, simLinks, maxLevel, feedbackCount]);

  // World Y of each tier plane. Tier 0 is at the TOP, so larger level → smaller Y.
  const tierWorldY = (level: number) => (maxLevel - level) * ROW_HEIGHT;

  const [cam, setCam] = useState<Camera>(() => ({
    yaw: 0.4,
    pitch: 0.25,
    distance: 3200,
    panOffset: { x: 0, y: 0, z: 0 },
  }));

  // Camera target is the graph's centroid (mean node position) plus the
  // user's pan offset. Recomputed every render (cheap, O(N)) so it tracks
  // the force sim as it settles. Orbit + zoom pivot around this point;
  // shift-drag pans by adjusting panOffset.
  let cameraTarget: { x: number; y: number; z: number };
  {
    if (simNodes.length === 0) {
      cameraTarget = { x: cam.panOffset.x, y: cam.panOffset.y, z: cam.panOffset.z };
    } else {
      let sx = 0, sy = 0, sz = 0;
      for (const n of simNodes) {
        sx += n.x ?? 0;
        sy += tierWorldY(n.level);
        sz += n.y ?? 0;
      }
      const k = 1 / simNodes.length;
      cameraTarget = {
        x: sx * k + cam.panOffset.x,
        y: sy * k + cam.panOffset.y,
        z: sz * k + cam.panOffset.z,
      };
    }
  }

  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  // Refs mirror slider state so the sim-init effect captures fresh values
  // without re-creating the simulation when sliders move; the live-update
  // effect below pushes new values into the running sim.
  const linkStrengthRef = useRef(linkStrength);
  const linkDistanceRef = useRef(linkDistance);
  const repulsionRef = useRef(repulsion);
  const repulsionMaxRef = useRef(repulsionMax);
  const collideRadiusRef = useRef(collideRadius);
  const velocityDecayRef = useRef(velocityDecay);
  const alphaDecayRef = useRef(alphaDecay);
  const alphaTargetRef = useRef(alphaTarget);
  useEffect(() => {
    linkStrengthRef.current = linkStrength;
    linkDistanceRef.current = linkDistance;
    repulsionRef.current = repulsion;
    repulsionMaxRef.current = repulsionMax;
    collideRadiusRef.current = collideRadius;
    velocityDecayRef.current = velocityDecay;
    alphaDecayRef.current = alphaDecay;
    alphaTargetRef.current = alphaTarget;
  }, [linkStrength, linkDistance, repulsion, repulsionMax, collideRadius, velocityDecay, alphaDecay, alphaTarget]);

  useEffect(() => {
    // d3 sim operates on (sim.x, sim.y) — we interpret those as (x, z) in
    // our 3D scene. The tier axis (world Y) is computed from node.level; the
    // sim has no force on it.
    const sim = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .strength((l) => ((l as SimLink).original.isBackward ? 0 : linkStrengthRef.current))
          .distance(linkDistanceRef.current),
      )
      .force(
        'charge',
        d3.forceManyBody<SimNode>().strength(-repulsionRef.current).distanceMax(repulsionMaxRef.current),
      )
      .force('collide', d3.forceCollide<SimNode>(collideRadiusRef.current))
      .velocityDecay(velocityDecayRef.current)
      // Start cold (alpha 0.02) and ramp linearly to 1.0 over WARMUP_TICKS.
      // Avoids the explosion that alpha=1 at frame 0 produces under
      // aggressive force parameters.
      .alpha(0.02)
      .alphaDecay(alphaDecayRef.current)
      .alphaTarget(alphaTargetRef.current)
      .alphaMin(0.001);
    const WARMUP_TICKS = 400;
    let tickCount = 0;
    sim.on('tick', () => {
      tickCount += 1;
      if (tickCount <= WARMUP_TICKS) {
        const t = tickCount / WARMUP_TICKS;
        sim.alpha(0.02 + (1 - 0.02) * t);
      }
      setTick((tt) => (tt + 1) % 1_000_000);
    });
    simRef.current = sim;
    return () => { sim.stop(); };
  }, [simNodes, simLinks]);

  // Live-tune the running sim when sliders move. Re-warms alpha so the
  // sim resettles into the new equilibrium.
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    const link = sim.force('link') as d3.ForceLink<SimNode, SimLink> | null;
    const charge = sim.force('charge') as d3.ForceManyBody<SimNode> | null;
    const collide = sim.force('collide') as d3.ForceCollide<SimNode> | null;
    link
      ?.strength((l) => ((l as SimLink).original.isBackward ? 0 : linkStrength))
      .distance(linkDistance);
    charge?.strength(-repulsion).distanceMax(repulsionMax);
    collide?.radius(collideRadius);
    sim.velocityDecay(velocityDecay);
    sim.alphaDecay(alphaDecay);
    sim.alphaTarget(alphaTarget);
    sim.alpha(Math.max(sim.alpha(), 0.3)).restart();
  }, [linkStrength, linkDistance, repulsion, repulsionMax, collideRadius, velocityDecay, alphaDecay, alphaTarget]);

  // Pointer handling. Left-drag orbits, shift-left-drag pans (grabs the
  // field and pulls it around), left-click on empty space deselects, left-
  // click on a queen selects (handled in the circle's onClick, which stops
  // propagation to keep SVG-level handlers out of it). Wheel = zoom.
  const DRAG_THRESHOLD_PX = 4;
  const dragRef = useRef<{
    pointerId: number | null;
    mode: 'orbit' | 'pan';
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  }>({ pointerId: null, mode: 'orbit', startX: 0, startY: 0, lastX: 0, lastY: 0, moved: false });

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    // Only the left button starts a drag. Middle/right are ignored.
    if (e.button !== 0) return;
    // Suppress browser default (text-selection / drag-scroll) so vertical
    // drags don't nudge the page as the user orbits.
    e.preventDefault();
    dragRef.current = {
      pointerId: e.pointerId,
      mode: e.shiftKey ? 'pan' : 'orbit',
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    };
    svgRef.current?.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    if (!d.moved) {
      const tdx = e.clientX - d.startX;
      const tdy = e.clientY - d.startY;
      if (tdx * tdx + tdy * tdy >= DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
        d.moved = true;
      }
    }
    if (!d.moved) return;
    if (d.mode === 'pan') {
      // Ground-plane "grab" pan. Horizontal drag slides the target along
      // the camera's right-on-ground axis; vertical drag slides it along
      // the camera's forward-on-ground axis (drag down → target comes
      // toward the viewer, like grabbing a point in the distance and
      // pulling it forward). World Y of the target is never touched, so
      // the camera stays level with the floor.
      setCam((c) => {
        const wpx = c.distance / FOCAL;
        const cy = Math.cos(c.yaw);
        const sy = Math.sin(c.yaw);
        // Right-on-ground (Y=0): rotated +X axis around world Y by yaw.
        const rightX = cy;
        const rightZ = -sy;
        // Forward-on-ground (Y=0): the look direction's XZ component.
        // Camera looks toward +Z (negated by view), so forward-on-ground
        // = (-sin(yaw), 0, -cos(yaw)). Drag down (dy>0) → move target
        // toward the viewer = subtract forward.
        const fwdX = -sy;
        const fwdZ = -cy;
        const wx = -dx * wpx; // drag right → target moves left → scene moves right
        const wf = dy * wpx; // drag down → camera moves forward (target moves into the distance)
        return {
          ...c,
          panOffset: {
            x: c.panOffset.x + rightX * wx + fwdX * wf,
            y: c.panOffset.y, // ground-plane pan: never lifts the target
            z: c.panOffset.z + rightZ * wx + fwdZ * wf,
          },
        };
      });
    } else {
      setCam((c) => {
        const yaw = c.yaw - dx * 0.005;
        const pitch = Math.max(-1.4, Math.min(1.4, c.pitch + dy * 0.005));
        return { ...c, yaw, pitch };
      });
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    const wasClick = !d.moved;
    dragRef.current = { pointerId: null, mode: 'orbit', startX: 0, startY: 0, lastX: 0, lastY: 0, moved: false };
    svgRef.current?.releasePointerCapture?.(e.pointerId);
    if (wasClick) {
      // Empty-space click — deselect. (Clicks on queen dots stop
      // propagation, so they never reach this handler.)
      setSelectedId(null);
    }
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setCam((c) => {
        const factor = Math.exp(e.deltaY * 0.001);
        return { ...c, distance: Math.max(200, Math.min(1000000, c.distance * factor)) };
      });
    };
    svg.addEventListener('wheel', handler, { passive: false });
    return () => svg.removeEventListener('wheel', handler);
  }, []);

  // Precompute projections once per render. Computed inline (not memoized)
  // because node x/y mutate in place on every force-sim tick — useMemo
  // would cache stale values; cameraTarget also changes per render.
  const nodeProj = (() => {
    const m = new Map<string, Projected | null>();
    for (const n of simNodes) {
      const nx = n.x;
      const ny = n.y;
      if (nx === undefined || ny === undefined || !Number.isFinite(nx) || !Number.isFinite(ny)) {
        m.set(n.id, null);
        continue;
      }
      m.set(n.id, project({ x: nx, y: tierWorldY(n.level), z: ny }, cam, cameraTarget));
    }
    return m;
  })();

  const maxFlow = useMemo(() => {
    let m = 0;
    for (const l of simLinks) if (l.original.flow > m) m = l.original.flow;
    return m;
  }, [simLinks]);
  const flowWidth = (flow: number): number => {
    if (maxFlow <= 0) return thickMin;
    const norm = flow / maxFlow;
    if (norm <= lowCutoff) return thickMin;
    if (norm >= highCutoff) return thickMax;
    const span = highCutoff - lowCutoff;
    if (span <= 0) return thickMin;
    const t = (norm - lowCutoff) / span;
    const shaped = Math.pow(t, thickExp);
    return thickMin + shaped * (thickMax - thickMin);
  };

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of simNodes) m.set(n.id, n.name);
    return m;
  }, [simNodes]);
  const levelById = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of simNodes) m.set(n.id, n.level);
    return m;
  }, [simNodes]);

  // For each queen, find her "terminal" by walking up contiguous losses
  // (forward edges loser→winner where winner.level === loser.level − 1).
  // When multiple contiguous losses exist, follow the candidate queen with
  // the highest queen-level flow — i.e. her total incoming flow, the
  // accumulated weight she receives. Tiebreak by id for determinism. A
  // terminal is a queen with no contiguous loss available (true sink, or
  // stuck-at-Lk where all losses skip levels). Each terminal gets a
  // distinct color; every queen tracing up to her inherits it.
  const terminalIdByQueen = useMemo(() => {
    // Per-queen total incoming flow (the weight she receives across her wins).
    const queenFlow = new Map<string, number>();
    for (const n of simNodes) queenFlow.set(n.id, 0);
    for (const l of simLinks) {
      if (l.original.isBackward) continue;
      const toId = typeof l.target === 'string' ? l.target : l.target.id;
      queenFlow.set(toId, (queenFlow.get(toId) ?? 0) + l.original.flow);
    }
    // Forward losses adjacency: for each loser, list winner ids.
    const losses = new Map<string, string[]>();
    for (const n of simNodes) losses.set(n.id, []);
    for (const l of simLinks) {
      if (l.original.isBackward) continue;
      const fromId = typeof l.source === 'string' ? l.source : l.source.id;
      const toId = typeof l.target === 'string' ? l.target : l.target.id;
      losses.get(fromId)?.push(toId);
    }
    const cache = new Map<string, string>();
    const trace = (id: string, stack: Set<string>): string => {
      const cached = cache.get(id);
      if (cached !== undefined) return cached;
      if (stack.has(id)) return id;
      const myLvl = levelById.get(id);
      if (myLvl === undefined) {
        cache.set(id, id);
        return id;
      }
      // Look ahead: pick the contiguous-loss candidate whose eventual
      // terminal has the highest queen-flow. A candidate that dead-ends
      // immediately at a low-flow terminal loses to one that traces all
      // the way up to a high-flow terminal.
      stack.add(id);
      let bestTerminal: string | null = null;
      let bestTerminalFlow = -Infinity;
      for (const winner of losses.get(id) ?? []) {
        if (levelById.get(winner) !== myLvl - 1) continue;
        const t = trace(winner, stack);
        const tf = queenFlow.get(t) ?? 0;
        if (tf > bestTerminalFlow || (tf === bestTerminalFlow && (bestTerminal === null || t < bestTerminal))) {
          bestTerminal = t;
          bestTerminalFlow = tf;
        }
      }
      stack.delete(id);
      const result = bestTerminal ?? id;
      cache.set(id, result);
      return result;
    };
    const m = new Map<string, string>();
    for (const n of simNodes) m.set(n.id, trace(n.id, new Set()));
    return m;
  }, [simNodes, simLinks, levelById]);

  // Distinct hue per terminal. We assign deterministically by sorting
  // terminal ids — keeps the color stable across renders. Stored as a hue
  // number so the renderer can vary lightness (terminals bright, non-
  // terminals darker).
  const terminalHue = useMemo(() => {
    const terminals = new Set<string>();
    for (const t of terminalIdByQueen.values()) terminals.add(t);
    const sorted = [...terminals].sort();
    const m = new Map<string, number>();
    sorted.forEach((id, i) => {
      m.set(id, Math.round((i * 360) / Math.max(1, sorted.length)));
    });
    return m;
  }, [terminalIdByQueen]);

  // How many queens trace to each terminal. A terminal "owns" color on the
  // graph only when she has ≥2 queens (herself + at least one descendant).
  // Singletons — queens who are technically terminals but no one else
  // traces to them — get the dim non-terminal treatment so they don't
  // visually compete with the actual anchor terminals.
  const terminalOwnerCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of terminalIdByQueen.values()) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  }, [terminalIdByQueen]);

  // Tier planes, sorted by depth at their centers so the furthest renders
  // first. Computed inline because cameraTarget shifts per render.
  const planeRenders = (() => {
    const planes: { level: number; poly: string; depth: number; fill: string }[] = [];
    for (let l = 0; l <= maxLevel; l += 1) {
      const y = tierWorldY(l);
      const corners = [
        { x: -PLANE_HALF, y, z: -PLANE_HALF },
        { x: PLANE_HALF, y, z: -PLANE_HALF },
        { x: PLANE_HALF, y, z: PLANE_HALF },
        { x: -PLANE_HALF, y, z: PLANE_HALF },
      ];
      const projs = corners.map((c) => project(c, cam, cameraTarget));
      if (projs.some((p) => p === null)) continue;
      const poly = (projs as Projected[]).map((p) => `${p.sx},${p.sy}`).join(' ');
      const center = project({ x: 0, y, z: 0 }, cam, cameraTarget);
      if (!center) continue;
      planes.push({
        level: l,
        poly,
        depth: center.depth,
        fill: `hsl(${(l * 40) % 360}, 40%, 40%)`,
      });
    }
    planes.sort((a, b) => b.depth - a.depth);
    return planes;
  })();

  // Edges, painted back-to-front with their own gradient defs.
  const edgeRenders = useMemo(() => {
    const items: {
      key: string;
      isBackward: boolean;
      s: Projected;
      t: Projected;
      width: number;
      depth: number;
      gradientId?: string;
      sId: string;
      tId: string;
    }[] = [];
    for (let i = 0; i < simLinks.length; i += 1) {
      const l = simLinks[i];
      const sNode = typeof l.source === 'object' ? (l.source as SimNode) : null;
      const tNode = typeof l.target === 'object' ? (l.target as SimNode) : null;
      if (!sNode || !tNode) continue;
      const sp = nodeProj.get(sNode.id);
      const tp = nodeProj.get(tNode.id);
      if (!sp || !tp) continue;
      items.push({
        key: `e${i}`,
        isBackward: l.original.isBackward,
        s: sp,
        t: tp,
        width: flowWidth(l.original.flow),
        depth: (sp.depth + tp.depth) * 0.5,
        gradientId: l.original.isBackward ? undefined : `ls3-edge-${i}`,
        sId: sNode.id,
        tId: tNode.id,
      });
    }
    items.sort((a, b) => b.depth - a.depth);
    return items;
  }, [simLinks, nodeProj, flowWidth]);

  // Nodes painted back-to-front.
  const nodeRenders = useMemo(() => {
    const items: { n: SimNode; p: Projected }[] = [];
    for (const n of simNodes) {
      const p = nodeProj.get(n.id);
      if (!p) continue;
      items.push({ n, p });
    }
    items.sort((a, b) => b.p.depth - a.p.depth);
    return items;
  }, [simNodes, nodeProj]);

  // Queen filter. The search target is the same "[Ln] Name · S1, AS3"
  // string shown at the top of the tooltip — so a user can type "[L4]"
  // to get all L4 queens, "AS3" for all AS3 queens, a name fragment, etc.
  const matchedIds = useMemo(() => {
    const q = nameFilter.trim().toLowerCase();
    if (!q) return null; // null = filter inactive, everyone full-opacity
    const set = new Set<string>();
    for (const n of simNodes) {
      const haystack = `[L${n.level}] ${n.name} · ${n.seasons.map(seasonLabel).join(', ')}`;
      if (haystack.toLowerCase().includes(q)) set.add(n.id);
    }
    return set;
  }, [nameFilter, simNodes]);

  // Selected queen's "loser subtree": all queens she beat, transitively.
  // Forward edges are loser→winner, so walking backward from selected via
  // forward-predecessors gives us everyone who lost to her or to someone
  // in her subtree. Includes the selected queen herself.
  const selectedSubtree = useMemo(() => {
    if (!selectedId) return null;
    const fwdPred = new Map<string, string[]>();
    for (const n of simNodes) fwdPred.set(n.id, []);
    for (const l of simLinks) {
      if (l.original.isBackward) continue;
      const fromId = typeof l.source === 'string' ? l.source : l.source.id;
      const toId = typeof l.target === 'string' ? l.target : l.target.id;
      fwdPred.get(toId)?.push(fromId);
    }
    const visited = new Set<string>([selectedId]);
    const stack = [selectedId];
    while (stack.length) {
      const v = stack.pop()!;
      for (const w of fwdPred.get(v) ?? []) {
        if (!visited.has(w)) { visited.add(w); stack.push(w); }
      }
    }
    return visited;
  }, [selectedId, simNodes, simLinks]);

  // Whether a node/edge gets dimmed. When selection or filter is active,
  // non-participants dim. Selection lights {selected} ∪ subtree; filter
  // lights matched names; the two compose as a union.
  const isNodeLit = (id: string): boolean => {
    if (!selectedSubtree && !matchedIds) return true;
    if (selectedSubtree?.has(id)) return true;
    if (matchedIds?.has(id)) return true;
    return false;
  };
  const isEdgeLit = (sId: string, tId: string): boolean => {
    if (!selectedSubtree && !matchedIds) return true;
    // Selection: edge lit only if both endpoints are in the subtree —
    // otherwise the line would stretch into dimmed territory.
    if (selectedSubtree?.has(sId) && selectedSubtree.has(tId)) return true;
    // Filter: edge lit if either endpoint matches (matches the existing
    // filter-only behavior).
    if (matchedIds && (matchedIds.has(sId) || matchedIds.has(tId))) return true;
    return false;
  };
  const isHighlighted = (id: string): boolean =>
    id === selectedId || (matchedIds?.has(id) ?? false);

  const hoveredProj = hovered ? nodeProj.get(hovered.id) ?? null : null;

  return (
    <div>
      <div className="mb-3 text-sm text-[#888]">
        {simNodes.length} queens · {simLinks.length} matchups · {maxLevel + 1} tiers · {feedbackCount} feedback edges · drag orbit · shift-drag pan · scroll zoom
      </div>
      <div className="mb-3 flex items-center gap-x-6 gap-y-2 text-sm text-[#888] flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={showCycleEdges} onChange={(e) => setShowCycleEdges(e.target.checked)} className="accent-amber-500" />
          <span className="text-[#aaa]">Show cycle edges</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={contiguousOnly} onChange={(e) => setContiguousOnly(e.target.checked)} className="accent-amber-500" />
          <span className="text-[#aaa]">Contiguous only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={colorByTerminal} onChange={(e) => setColorByTerminal(e.target.checked)} className="accent-amber-500" />
          <span className="text-[#aaa]">Color by terminal</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={invertLevels} onChange={(e) => setInvertLevels(e.target.checked)} className="accent-amber-500" />
          <span className="text-[#aaa]">Invert levels (raw)</span>
        </label>
      </div>
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowPhysics((v) => !v)}
          className="text-xs text-[#888] hover:text-[#ccc] flex items-center gap-1"
        >
          <span className="font-mono w-3 inline-block">{showPhysics ? '▾' : '▸'}</span>
          Physics options
        </button>
      </div>
      {showPhysics && (
      <div className="mb-3 ml-4 pl-4 border-l border-[#2a2a3a] flex items-center gap-x-6 gap-y-2 text-sm text-[#888] flex-wrap">
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Link str</span>
          <input type="range" min={0} max={5} step={0.01} value={linkStrength} onChange={(e) => setLinkStrength(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{linkStrength.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Link dist</span>
          <input type="range" min={0} max={1000} step={1} value={linkDistance} onChange={(e) => setLinkDistance(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{linkDistance.toFixed(0)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Repulsion</span>
          <input type="range" min={0} max={10000} step={1} value={repulsion} onChange={(e) => setRepulsion(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{repulsion.toFixed(0)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Repel max</span>
          <input type="range" min={0} max={20000} step={1} value={repulsionMax} onChange={(e) => setRepulsionMax(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{repulsionMax.toFixed(0)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Collide r</span>
          <input type="range" min={0} max={200} step={0.5} value={collideRadius} onChange={(e) => setCollideRadius(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{collideRadius.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Vel decay</span>
          <input type="range" min={0} max={1} step={0.01} value={velocityDecay} onChange={(e) => setVelocityDecay(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{velocityDecay.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">α decay</span>
          <input type="range" min={0} max={0.3} step={0.001} value={alphaDecay} onChange={(e) => setAlphaDecay(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{alphaDecay.toFixed(3)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">α target</span>
          <input type="range" min={0} max={1} step={0.01} value={alphaTarget} onChange={(e) => setAlphaTarget(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-14">{alphaTarget.toFixed(2)}</span>
        </label>
      </div>
      )}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowEdgeOpts((v) => !v)}
          className="text-xs text-[#888] hover:text-[#ccc] flex items-center gap-1"
        >
          <span className="font-mono w-3 inline-block">{showEdgeOpts ? '▾' : '▸'}</span>
          Edge options
        </button>
      </div>
      {showEdgeOpts && (
      <div className="mb-3 ml-4 pl-4 border-l border-[#2a2a3a] flex items-center gap-x-6 gap-y-2 text-sm text-[#888] flex-wrap">
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Thick min</span>
          <input type="range" min={0} max={20} step={0.1} value={thickMin} onChange={(e) => setThickMin(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-12">{thickMin.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Thick max</span>
          <input type="range" min={0} max={20} step={0.1} value={thickMax} onChange={(e) => setThickMax(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-12">{thickMax.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Low cut</span>
          <input type="range" min={0} max={1} step={0.001} value={lowCutoff} onChange={(e) => setLowCutoff(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-12">{lowCutoff.toFixed(3)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">High cut</span>
          <input type="range" min={0} max={1} step={0.001} value={highCutoff} onChange={(e) => setHighCutoff(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-12">{highCutoff.toFixed(3)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Exp</span>
          <input type="range" min={0} max={5} step={0.01} value={thickExp} onChange={(e) => setThickExp(parseFloat(e.target.value))} className="w-40 accent-amber-500" />
          <span className="text-[#666] font-mono text-xs w-12">{thickExp.toFixed(2)}</span>
        </label>
      </div>
      )}
      <div className="mb-3 flex items-center gap-2 text-xs text-[#888] flex-wrap">
        <span className="text-[#aaa] mr-1">Seasons:</span>
        {SEASON_ORDER.map((s) => {
          const on = !disabledSeasons.has(s);
          const color = seasonColor(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() =>
                setDisabledSeasons((prev) => {
                  const next = new Set(prev);
                  if (next.has(s)) next.delete(s);
                  else next.add(s);
                  return next;
                })
              }
              className="px-2 py-0.5 rounded border font-mono transition-colors"
              style={{
                borderColor: on ? color : '#2a2a3a',
                color: on ? color : '#555',
                background: on ? `${color}18` : 'transparent',
              }}
            >
              {seasonLabel(s)}
            </button>
          );
        })}
        <button type="button" onClick={() => setDisabledSeasons(new Set())} className="ml-2 px-2 py-0.5 rounded border border-[#2a2a3a] text-[#888] hover:text-[#ccc] hover:border-[#555]">All</button>
        <button type="button" onClick={() => setDisabledSeasons(new Set(SEASON_ORDER))} className="px-2 py-0.5 rounded border border-[#2a2a3a] text-[#888] hover:text-[#ccc] hover:border-[#555]">None</button>
      </div>
      <div className="mb-3 flex items-center gap-2 text-sm text-[#888]">
        <span className="text-[#aaa] mr-1">Filter:</span>
        <div className="relative">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="queen name…"
            className="bg-[#0a0a10] border border-[#2a2a3a] rounded px-2 py-0.5 pr-6 text-[#ccc] placeholder:text-[#555] focus:outline-none focus:border-amber-500 w-64"
          />
          {nameFilter && (
            <button
              type="button"
              onClick={() => setNameFilter('')}
              aria-label="Clear filter"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded text-[#888] hover:text-[#ccc] hover:bg-[#2a2a3a] text-xs leading-none"
            >
              ×
            </button>
          )}
        </div>
        {matchedIds && (
          <span className="text-xs text-[#666] font-mono">{matchedIds.size} match{matchedIds.size === 1 ? '' : 'es'}</span>
        )}
      </div>
      <div className="bg-[#0a0a10] border border-[#1a1a24] rounded-lg overflow-hidden relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          height={VH}
          style={{ display: 'block', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onContextMenu={(e) => e.preventDefault()}
          onAuxClick={(e) => e.preventDefault()}
        >
          <defs>
            {edgeRenders.map((e) =>
              e.gradientId ? (
                <linearGradient
                  key={e.gradientId}
                  id={e.gradientId}
                  gradientUnits="userSpaceOnUse"
                  x1={e.s.sx}
                  y1={e.s.sy}
                  x2={e.t.sx}
                  y2={e.t.sy}
                >
                  <stop offset="0" stopColor="#c0c0c0" />
                  <stop offset="1" stopColor="#d4af37" />
                </linearGradient>
              ) : null,
            )}
          </defs>
          <rect
            x={0}
            y={0}
            width={VW}
            height={VH}
            fill="transparent"
            pointerEvents="all"
          />
          {planeRenders.map((p) => (
            <polygon
              key={`plane-${p.level}`}
              points={p.poly}
              fill={p.fill}
              fillOpacity={0.05}
              stroke="#2a2a3a"
              strokeOpacity={0.4}
              strokeWidth={1}
            />
          ))}
          {/* Tier labels — project (left edge, plane-y, 0) and label near it. */}
          {Array.from({ length: maxLevel + 1 }, (_, l) => {
            const p = project({ x: -PLANE_HALF, y: tierWorldY(l), z: 0 }, cam, cameraTarget);
            if (!p) return null;
            return (
              <text key={`lbl-${l}`} x={p.sx - 6} y={p.sy + 4} fontSize={11} fill="#3a3a48" textAnchor="end">
                L{l}
              </text>
            );
          })}
          {edgeRenders.map((e) => {
            const lit = isEdgeLit(e.sId, e.tId);
            const baseOp = e.isBackward ? 0.85 : 0.7;
            // Stronger dim when a queen is selected — the user is focused on
            // her subtree, so push the rest further back.
            const dimFactor = selectedSubtree ? 0.18 : 0.3;
            const op = lit ? baseOp : baseOp * dimFactor;
            return (
              <line
                key={e.key}
                x1={e.s.sx}
                y1={e.s.sy}
                x2={e.t.sx}
                y2={e.t.sy}
                stroke={e.isBackward ? RED : `url(#${e.gradientId})`}
                strokeOpacity={op}
                strokeWidth={e.isBackward ? Math.max(1.6, e.width) : e.width}
              />
            );
          })}
          {nodeRenders.map(({ n, p }) => {
            const isHover = hovered?.id === n.id;
            const highlighted = isHighlighted(n.id);
            const isTerminal =
              colorByTerminal &&
              terminalIdByQueen.get(n.id) === n.id &&
              (terminalOwnerCount.get(n.id) ?? 0) > 1;
            let color: string;
            if (colorByTerminal) {
              const hue = terminalHue.get(terminalIdByQueen.get(n.id) ?? n.id);
              if (hue !== undefined) {
                // Terminals are bright + saturated; non-terminals are
                // desaturated so the terminals read as the anchor of
                // each tree.
                const sat = isTerminal ? 70 : 35;
                const light = isTerminal ? 60 : 45;
                color = `hsl(${hue}, ${sat}%, ${light}%)`;
              } else {
                color = seasonColor(n.seasonId);
              }
            } else {
              color = seasonColor(n.seasonId);
            }
            // Radii bumped 50% from prior (6/8/9 → 9/12/13.5).
            const baseR = isHover ? 13.5 : highlighted ? 12 : 9;
            const r = baseR * Math.min(1.5, Math.max(0.5, p.scale * 1.2));
            const op = isNodeLit(n.id) ? 1 : selectedSubtree ? 0.27 : 0.4;
            const strokeColor = isHover || highlighted || isTerminal ? '#fff' : '#0a0a10';
            const strokeW = isHover || highlighted ? 1.5 : isTerminal ? 1 : 1;
            return (
              <g key={n.id} transform={`translate(${p.sx},${p.sy}) scale(2)`} opacity={op}>
                <circle
                  r={r}
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  style={{ cursor: 'pointer' }}
                  onPointerEnter={() => setHovered(n)}
                  onPointerLeave={() => setHovered((h) => (h?.id === n.id ? null : h))}
                  onPointerDown={(ev) => ev.stopPropagation()}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelectedId((cur) => (cur === n.id ? null : n.id));
                  }}
                />
              </g>
            );
          })}
          {/* Highlight labels (selected + filter matches) — drawn as a
              separate top layer so later (closer) node circles don't
              overdraw earlier labels. */}
          {nodeRenders.map(({ n, p }) => {
            if (!isHighlighted(n.id)) return null;
            const isHover = hovered?.id === n.id;
            const baseR = isHover ? 13.5 : 12;
            const r = baseR * Math.min(1.5, Math.max(0.5, p.scale * 1.2));
            return (
              <g key={`lbl-${n.id}`} transform={`translate(${p.sx},${p.sy}) scale(2)`} pointerEvents="none">
                <text
                  x={r + 3}
                  y={3}
                  fontSize={10}
                  fill="#fff"
                  stroke="#0a0a10"
                  strokeWidth={2}
                  paintOrder="stroke"
                >
                  [L{n.level}] {n.name}
                </text>
              </g>
            );
          })}
          {hovered && hoveredProj && (() => {
            const losses: { seasonId: string; episode: string; song: string; opponent: string; flow: number }[] = [];
            const wins: { seasonId: string; episode: string; song: string; opponent: string; flow: number }[] = [];
            for (const l of simLinks) {
              const d = l.original;
              const aId = d.original.a;
              const bId = d.original.b;
              if (aId !== hovered.id && bId !== hovered.id) continue;
              const oppId = aId === hovered.id ? bId : aId;
              const oppName = nameById.get(oppId) ?? oppId;
              const oppLevel = levelById.get(oppId);
              const oppLabel = oppLevel !== undefined ? `[L${oppLevel}] ${oppName}` : oppName;
              for (const m of d.original.matches) {
                if (m.outcome === 'tie') continue;
                const winnerId = m.outcome === 'a' ? aId : bId;
                const hoveredWon = winnerId === hovered.id;
                const row = { seasonId: m.seasonId, episode: m.episode, song: m.song, opponent: oppLabel, flow: d.flow };
                if (hoveredWon) wins.push(row); else losses.push(row);
              }
            }
            losses.sort((a, b) => a.episode.localeCompare(b.episode));
            wins.sort((a, b) => a.episode.localeCompare(b.episode));
            const lineH = 13;
            const headerH = 20;
            const sectionGap = 6;
            const rowsCount = losses.length + wins.length;
            const headings = (losses.length ? 1 : 0) + (wins.length ? 1 : 0);
            const h = headerH + (headings ? sectionGap : 0) + headings * lineH + rowsCount * lineH + 8;
            const rowText = (r: { seasonId: string; episode: string; opponent: string; flow: number }) =>
              `${seasonLabel(r.seasonId)} · ${r.episode} · ${r.opponent} · flow ${r.flow}`;
            const headerText = `[L${hovered.level}] ${hovered.name} · ${hovered.seasons.map(seasonLabel).join(', ')}`;
            const longest = Math.max(
              headerText.length,
              ...losses.map((r) => rowText(r).length),
              ...wins.map((r) => rowText(r).length),
              'Losses'.length,
              'Wins'.length,
            );
            const w = Math.max(120, longest * 6.4 + 20);
            let y = 8;
            return (
              <g transform={`translate(${hoveredProj.sx},${hoveredProj.sy}) scale(2)`} pointerEvents="none">
                <rect x={10} y={-10} width={w} height={h} rx={3} fill="#121218" stroke="#2a2a3a" />
                <text x={14} y={4} fontSize={12} fill="#eee" fontWeight={600}>
                  {headerText}
                </text>
                {losses.length > 0 && (() => {
                  const out: ReactNode[] = [];
                  y += headerH - 6;
                  out.push(
                    <text key="lh" x={14} y={y} fontSize={11} fill="#c0c0c0" fontWeight={600}>Losses</text>,
                  );
                  y += lineH;
                  for (let i = 0; i < losses.length; i += 1) {
                    out.push(
                      <text key={`l-${i}`} x={18} y={y} fontSize={10} fill="#bbb">{rowText(losses[i])}</text>,
                    );
                    y += lineH;
                  }
                  return out;
                })()}
                {wins.length > 0 && (() => {
                  const out: ReactNode[] = [];
                  if (losses.length === 0) y += headerH - 6;
                  else y += sectionGap;
                  out.push(
                    <text key="wh" x={14} y={y} fontSize={11} fill="#d4af37" fontWeight={600}>Wins</text>,
                  );
                  y += lineH;
                  for (let i = 0; i < wins.length; i += 1) {
                    out.push(
                      <text key={`w-${i}`} x={18} y={y} fontSize={10} fill="#bbb">{rowText(wins[i])}</text>,
                    );
                    y += lineH;
                  }
                  return out;
                })()}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
