import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  LIP_SYNC_NODES,
  LIP_SYNC_EDGES,
  LIP_SYNC_NODES_MERGED,
  LIP_SYNC_EDGES_MERGED,
  seasonLabel,
  type LipSyncNode,
  type LipSyncEdge,
} from '../data/lipSyncs';

type SimNode = LipSyncNode & { seasons?: string[] } & d3.SimulationNodeDatum;
type SimLink = LipSyncEdge & d3.SimulationLinkDatum<SimNode> & {
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

const GOLD = '#d4af37';
const LIGHT_GRAY = '#3a414c';

export default function LipSyncsPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [, setTick] = useState(0);
  const [hovered, setHovered] = useState<SimNode | null>(null);

  // Direct force controls.
  const [linkStrength, setLinkStrength] = useState(0.5);
  const [repulsion, setRepulsion] = useState(90);
  const [velocityDecay, setVelocityDecay] = useState(0.4);
  const [merge, setMerge] = useState(false);
  const [disabledSeasons, setDisabledSeasons] = useState<Set<string>>(() => new Set());

  // Pan / zoom (user-controllable viewport).
  const [view, setView] = useState({ x: 225, y: 190, k: 0.5 });
  const viewRef = useRef(view);
  viewRef.current = view;

  const width = 900;
  const height = 760;

  // Persistent SimNode pool for the current dataset — rebuilt only on the
  // merge toggle. Toggling seasons filters this pool rather than rebuilding
  // SimNode objects, so positions survive show/hide cycles.
  const allNodes = useMemo<SimNode[]>(() => {
    const raw: (LipSyncNode & { seasons?: string[] })[] = merge
      ? LIP_SYNC_NODES_MERGED.map((n) => ({ id: n.id, name: n.name, seasonId: n.seasonId, seasons: n.seasons }))
      : LIP_SYNC_NODES.map((n) => ({ ...n }));
    return raw.map((n) => ({ ...n }));
  }, [merge]);

  // In merged view, matches carry seasonId so we can filter per-season; in
  // unmerged view an edge is entirely within one season and the endpoint
  // visibility alone handles it.
  type AnyMatch = { episode: string; song: string; outcome: 'a' | 'b' | 'tie'; seasonId?: string };
  type AnyEdge = Omit<LipSyncEdge, 'matches'> & { matches: AnyMatch[] };

  const allEdges = useMemo<AnyEdge[]>(() => {
    return merge
      ? (LIP_SYNC_EDGES_MERGED as AnyEdge[])
      : (LIP_SYNC_EDGES as AnyEdge[]);
  }, [merge]);

  const { nodes, links } = useMemo(() => {
    const isNodeVisible = (n: SimNode) => {
      const seasons = n.seasons && n.seasons.length > 0 ? n.seasons : [n.seasonId];
      return seasons.some((s) => !disabledSeasons.has(s));
    };
    const visibleNodes = allNodes.filter(isNodeVisible);
    const idSet = new Set(visibleNodes.map((n) => n.id));
    const links: SimLink[] = allEdges
      .filter((e) => idSet.has(e.a) && idSet.has(e.b))
      .map((e) => {
        // Merged edges bundle matches from multiple seasons — drop matches
        // whose season is disabled and recompute the win/tie counts so an
        // edge only reflects its currently-enabled lip syncs.
        if (merge) {
          const matches = e.matches.filter((m) => !m.seasonId || !disabledSeasons.has(m.seasonId));
          if (matches.length === 0) return null;
          let aWins = 0, bWins = 0, ties = 0;
          for (const m of matches) {
            if (m.outcome === 'tie') { aWins += 1; bWins += 1; ties += 1; }
            else if (m.outcome === 'a') aWins += 1;
            else bWins += 1;
          }
          return { ...e, aWins, bWins, ties, matches, source: e.a, target: e.b } as SimLink;
        }
        return { ...e, source: e.a, target: e.b } as SimLink;
      })
      .filter((l): l is SimLink => l !== null);
    return { nodes: visibleNodes, links };
  }, [allNodes, allEdges, disabledSeasons, merge]);

  const simRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  // Refs for slider values so the sim init effect can read the current
  // values without adding them as deps (which would cause the sim to re-init
  // on every slider tweak).
  const linkStrengthRef = useRef(linkStrength);
  const repulsionRef = useRef(repulsion);
  const velocityDecayRef = useRef(velocityDecay);
  linkStrengthRef.current = linkStrength;
  repulsionRef.current = repulsion;
  velocityDecayRef.current = velocityDecay;

  // One-time sim bootstrap per dataset swap (merge toggle). We don't re-init
  // when visibility changes — see the separate effect below that swaps the
  // sim's nodes/links in place.
  useEffect(() => {
    const sim = d3
      .forceSimulation<SimNode>([])
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>([])
          .id((d) => d.id)
          .distance(60)
          .strength(linkStrengthRef.current),
      )
      .force('charge', d3.forceManyBody<SimNode>().distanceMax(400).strength(-repulsionRef.current))
      .force('collide', d3.forceCollide<SimNode>(11))
      .velocityDecay(velocityDecayRef.current)
      .alpha(1)
      .alphaDecay(0.02)
      .alphaTarget(0.01)
      .alphaMin(0)
      .on('tick', () => {
        for (const n of sim.nodes()) {
          if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) {
            n.x = width / 2 + (Math.random() - 0.5) * 100;
            n.y = height / 2 + (Math.random() - 0.5) * 100;
            n.vx = 0;
            n.vy = 0;
          }
        }
        setTick((t) => (t + 1) % 1_000_000);
      });

    simRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [allNodes]);

  // Swap visible nodes/links into the existing sim without re-initializing.
  // Slider state, positions of surviving nodes, and alpha all persist.
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    sim.nodes(nodes);
    const link = sim.force('link') as d3.ForceLink<SimNode, SimLink> | null;
    link?.links(links);
  }, [nodes, links]);

  // Apply slider changes to live simulation forces without bumping alpha —
  // the perpetual alphaTarget keeps the sim ticking, so tweaks take effect
  // smoothly instead of jolting the graph every time a slider moves.
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    const link = sim.force('link') as d3.ForceLink<SimNode, SimLink> | null;
    const charge = sim.force('charge') as d3.ForceManyBody<SimNode> | null;
    link?.strength(linkStrength);
    charge?.strength(-repulsion);
    sim.velocityDecay(velocityDecay);
  }, [linkStrength, repulsion, velocityDecay]);

  // Drag state
  const dragRef = useRef<{ node: SimNode | null; dx: number; dy: number; pointerId: number | null }>({
    node: null, dx: 0, dy: 0, pointerId: null,
  });
  // Pan state
  const panRef = useRef<{ active: boolean; pointerId: number | null; startX: number; startY: number; viewX: number; viewY: number }>({
    active: false, pointerId: null, startX: 0, startY: 0, viewX: 0, viewY: 0,
  });

  function toSvgCoords(clientX: number, clientY: number): { x: number; y: number } {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const { x: vx, y: vy, k } = viewRef.current;
    const px = (clientX - rect.left) * (width / rect.width);
    const py = (clientY - rect.top) * (height / rect.height);
    return { x: (px - vx) / k, y: (py - vy) / k };
  }

  function onNodePointerDown(e: React.PointerEvent<SVGElement>, node: SimNode) {
    if (e.button !== 0) return; // only left-click drags nodes
    e.stopPropagation();
    // Capture on the SVG root so pointermove keeps firing there.
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const { x, y } = toSvgCoords(e.clientX, e.clientY);
    dragRef.current = {
      node,
      dx: (node.x ?? 0) - x,
      dy: (node.y ?? 0) - y,
      pointerId: e.pointerId,
    };
    node.fx = node.x;
    node.fy = node.y;
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (dragRef.current.node && dragRef.current.pointerId === e.pointerId) {
      const { x, y } = toSvgCoords(e.clientX, e.clientY);
      const n = dragRef.current.node;
      n.fx = x + dragRef.current.dx;
      n.fy = y + dragRef.current.dy;
      // Also update node position immediately so forces don't yank it back this tick.
      n.x = n.fx;
      n.y = n.fy;
      n.vx = 0;
      n.vy = 0;
      setTick((t) => (t + 1) % 1_000_000);
    } else if (panRef.current.active && panRef.current.pointerId === e.pointerId) {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (width / rect.width);
      const py = (e.clientY - rect.top) * (height / rect.height);
      setView((v) => ({
        ...v,
        x: panRef.current.viewX + (px - panRef.current.startX),
        y: panRef.current.viewY + (py - panRef.current.startY),
      }));
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (dragRef.current.node && dragRef.current.pointerId === e.pointerId) {
      const n = dragRef.current.node;
      n.fx = null;
      n.fy = null;
      dragRef.current = { node: null, dx: 0, dy: 0, pointerId: null };
      simRef.current?.alphaTarget(0.01);
      svgRef.current?.releasePointerCapture?.(e.pointerId);
    }
    if (panRef.current.active && panRef.current.pointerId === e.pointerId) {
      panRef.current.active = false;
      panRef.current.pointerId = null;
      svgRef.current?.releasePointerCapture?.(e.pointerId);
    }
  }

  function onBackgroundPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button === 1) {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      panRef.current = {
        active: true,
        pointerId: e.pointerId,
        startX: (e.clientX - rect.left) * (width / rect.width),
        startY: (e.clientY - rect.top) * (height / rect.height),
        viewX: viewRef.current.x,
        viewY: viewRef.current.y,
      };
      svgRef.current?.setPointerCapture?.(e.pointerId);
    }
  }

  // Native wheel listener so we can preventDefault (React's synthetic wheel is passive).
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (width / rect.width);
      const py = (e.clientY - rect.top) * (height / rect.height);
      setView((v) => {
        const factor = Math.exp(-e.deltaY * 0.001);
        const nk = Math.max(0.0015, Math.min(4, v.k * factor));
        const nx = px - (px - v.x) * (nk / v.k);
        const ny = py - (py - v.y) * (nk / v.k);
        return { x: nx, y: ny, k: nk };
      });
    };
    svg.addEventListener('wheel', handler, { passive: false });
    return () => svg.removeEventListener('wheel', handler);
  }, [width, height]);

  const stats = useMemo(() => ({
    nodes: nodes.length,
    edges: links.length,
  }), [nodes, links]);

  return (
    <div>
      <div className="mb-3 text-sm text-[#888]">
        {stats.nodes} queens · {stats.edges} matchups · left-click drag · middle-click pan · scroll to zoom
      </div>
      <div className="mb-3 flex items-center gap-6 text-sm text-[#888] flex-wrap">
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Link str</span>
          <input
            type="range"
            min={0}
            max={8}
            step={0.01}
            value={linkStrength}
            onChange={(e) => setLinkStrength(parseFloat(e.target.value))}
            className="w-40 accent-amber-500"
          />
          <span className="text-[#666] font-mono text-xs w-12">{linkStrength.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Repulsion</span>
          <input
            type="range"
            min={0}
            max={8000}
            step={1}
            value={repulsion}
            onChange={(e) => setRepulsion(parseFloat(e.target.value))}
            className="w-40 accent-amber-500"
          />
          <span className="text-[#666] font-mono text-xs w-12">{repulsion.toFixed(0)}</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[#aaa] w-20">Vel decay</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={velocityDecay}
            onChange={(e) => setVelocityDecay(parseFloat(e.target.value))}
            className="w-40 accent-amber-500"
          />
          <span className="text-[#666] font-mono text-xs w-12">{velocityDecay.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={merge}
            onChange={(e) => setMerge(e.target.checked)}
            className="accent-amber-500"
          />
          <span className="text-[#aaa]">Merge recurring queens</span>
        </label>
      </div>
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
        <button
          type="button"
          onClick={() => setDisabledSeasons(new Set())}
          className="ml-2 px-2 py-0.5 rounded border border-[#2a2a3a] text-[#888] hover:text-[#ccc] hover:border-[#555]"
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setDisabledSeasons(new Set(SEASON_ORDER))}
          className="px-2 py-0.5 rounded border border-[#2a2a3a] text-[#888] hover:text-[#ccc] hover:border-[#555]"
        >
          None
        </button>
      </div>
      <div className="bg-[#0a0a10] border border-[#1a1a24] rounded-lg overflow-hidden relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          style={{ display: 'block', touchAction: 'none' }}
          onPointerDown={onBackgroundPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onContextMenu={(e) => e.preventDefault()}
          onAuxClick={(e) => e.preventDefault()}
        >
          <defs>
            {links.map((l, i) => {
              const s = (typeof l.source === 'object' ? l.source : null) as SimNode | null;
              const t = (typeof l.target === 'object' ? l.target : null) as SimNode | null;
              if (!s || !t || !Number.isFinite(s.x) || !Number.isFinite(t.x) || !Number.isFinite(s.y) || !Number.isFinite(t.y)) return null;
              const aColor = l.aWins > 0 && l.aWins >= l.bWins ? GOLD : LIGHT_GRAY;
              const bColor = l.bWins > 0 && l.bWins >= l.aWins ? GOLD : LIGHT_GRAY;
              return (
                <linearGradient
                  key={i}
                  id={`ls-edge-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                >
                  <stop offset="0" stopColor={aColor} />
                  <stop offset="1" stopColor={bColor} />
                </linearGradient>
              );
            })}
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="transparent" />
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* Edges */}
            {links.map((l, i) => {
              const s = (typeof l.source === 'object' ? l.source : null) as SimNode | null;
              const t = (typeof l.target === 'object' ? l.target : null) as SimNode | null;
              if (!s || !t || !Number.isFinite(s.x) || !Number.isFinite(t.x) || !Number.isFinite(s.y) || !Number.isFinite(t.y)) return null;
              return (
                <line
                  key={i}
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={`url(#ls-edge-${i})`}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}
            {/* Nodes — floor-clamped to 12px rendered diameter (16px on hover)
                regardless of zoom so nodes stay tappable zoomed out; the hover
                ring thickness is also zoom-independent. */}
            {nodes.map((n) => {
              if (!Number.isFinite(n.x) || !Number.isFinite(n.y)) return null;
              const color = seasonColor(n.seasonId);
              const isHover = hovered?.id === n.id;
              const baseR = isHover ? 7 : 5;
              const floorR = isHover ? 8 : 6;
              const r = Math.max(baseR, floorR / view.k);
              const sw = (isHover ? 1.5 : 1) / view.k;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x},${n.y})`}
                  style={{ cursor: 'grab' }}
                  onPointerDown={(e) => onNodePointerDown(e, n)}
                  onPointerEnter={() => setHovered(n)}
                  onPointerLeave={() => setHovered((h) => (h?.id === n.id ? null : h))}
                >
                  <circle
                    r={r}
                    fill={color}
                    stroke={isHover ? '#fff' : '#0a0a10'}
                    strokeWidth={sw}
                  />
                </g>
              );
            })}
            {/* Hover label drawn above all — counter-scaled so tooltip stays
                the same on-screen size regardless of zoom. */}
            {hovered && hovered.x != null && hovered.y != null && (
              <g transform={`translate(${hovered.x},${hovered.y}) scale(${1 / view.k})`} pointerEvents="none">
                {(() => {
                  const label = hovered.seasons && hovered.seasons.length > 0
                    ? hovered.seasons.map(seasonLabel).join(', ')
                    : seasonLabel(hovered.seasonId);
                  const text = `${hovered.name} · ${label}`;
                  return (
                    <>
                      <rect
                        x={10} y={-10}
                        width={Math.max(80, text.length * 7 + 20)}
                        height={20}
                        rx={3}
                        fill="#121218"
                        stroke="#2a2a3a"
                      />
                      <text x={14} y={4} fontSize={12} fill="#eee">
                        {text}
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
