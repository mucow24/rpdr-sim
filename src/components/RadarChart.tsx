import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BASE_STATS, type Queen } from '../engine/types';

const CATEGORY_LABELS: Record<string, string> = {
  comedy: 'COM',
  improv: 'IMP',
  acting: 'ACT',
  dance: 'DAN',
  music: 'MUS',
  design: 'DES',
  runway: 'RUN',
  charisma: 'CHA',
};

// When no queen is selected the polygon collapses to the origin with opacity 0.
const NEUTRAL_COLOR = '#666';
const ANIM_DURATION_MS = 500;

export default function RadarChart({ queen, size = 100 }: { queen: Queen | null; size?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 16;
    const categories = [...BASE_STATS];
    const n = categories.length;
    const angleSlice = (2 * Math.PI) / n;

    // First-mount structure. Named sub-groups preserve z-order (rings → axes →
    // data polygon → labels) so the data polygon can animate in place across
    // re-renders without getting covered by later-appended static elements.
    let root = svg.select<SVGGElement>('g.radar-root');
    if (root.empty()) {
      root = svg.append<SVGGElement>('g').attr('class', 'radar-root');
      root.append('g').attr('class', 'radar-rings');
      root.append('g').attr('class', 'radar-axes');
      root
        .append('polygon')
        .attr('class', 'radar-data')
        .attr('points', categories.map(() => '0,0').join(' '))
        .attr('fill', NEUTRAL_COLOR)
        .attr('fill-opacity', 0)
        .attr('stroke', NEUTRAL_COLOR)
        .attr('stroke-opacity', 0)
        .attr('stroke-width', 1.5);
      root.append('g').attr('class', 'radar-labels');
    }
    root.attr('transform', `translate(${cx},${cy})`);

    // Rings (static — rebuilt each render so size changes take effect).
    const rings = root.select<SVGGElement>('.radar-rings');
    rings.selectAll('*').remove();
    for (const level of [0.2, 0.4, 0.6, 0.8, 1]) {
      const points = categories.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [Math.cos(angle) * r * level, Math.sin(angle) * r * level];
      });
      rings
        .append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', '#666')
        .attr('stroke-width', 0.5);
    }

    // Axes
    const axes = root.select<SVGGElement>('.radar-axes');
    axes.selectAll('*').remove();
    categories.forEach((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      axes
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(angle) * r)
        .attr('y2', Math.sin(angle) * r)
        .attr('stroke', '#666')
        .attr('stroke-width', 0.5);
    });

    // Labels
    const labels = root.select<SVGGElement>('.radar-labels');
    labels.selectAll('*').remove();
    categories.forEach((cat, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const labelR = r + 10;
      labels
        .append('text')
        .attr('x', Math.cos(angle) * labelR)
        .attr('y', Math.sin(angle) * labelR)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#aaa')
        .attr('font-size', `${Math.max(7, size * 0.07)}px`)
        .text(CATEGORY_LABELS[cat] ?? cat);
    });

    // Animate the data polygon — vertices tween between queens, and fill +
    // stroke cross-fade to the new queen's color. d3's attr interpolator
    // handles hex color blending on fill/stroke and numeric interpolation on
    // the points string (since the vertex count is fixed).
    const targetPoints = queen
      ? categories
          .map((cat, i) => {
            const val = queen.skills[cat] / 10;
            const angle = angleSlice * i - Math.PI / 2;
            return `${Math.cos(angle) * r * val},${Math.sin(angle) * r * val}`;
          })
          .join(' ')
      : categories.map(() => '0,0').join(' ');
    const targetColor = queen?.color ?? NEUTRAL_COLOR;

    root
      .select<SVGPolygonElement>('polygon.radar-data')
      .transition()
      .duration(ANIM_DURATION_MS)
      .ease(d3.easeCubicInOut)
      .attr('points', targetPoints)
      .attr('fill', targetColor)
      .attr('stroke', targetColor)
      .attr('fill-opacity', queen ? 0.2 : 0)
      .attr('stroke-opacity', queen ? 1 : 0);
  }, [queen, size]);

  return <svg ref={svgRef} width={size} height={size} />;
}
