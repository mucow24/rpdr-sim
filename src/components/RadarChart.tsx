import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BASE_STATS, type Queen } from '../engine/types';

export const CATEGORY_LABELS: Record<string, string> = {
  comedy: 'COM',
  improv: 'IMP',
  acting: 'ACT',
  dance: 'DAN',
  music: 'MUS',
  design: 'DES',
  runway: 'RUN',
  charisma: 'CHA',
};

export default function RadarChart({ queen, size = 100 }: { queen: Queen; size?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 16;
    const categories = [...BASE_STATS];
    const n = categories.length;
    const angleSlice = (2 * Math.PI) / n;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Background rings
    for (const level of [0.2, 0.4, 0.6, 0.8, 1]) {
      const points = categories.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [Math.cos(angle) * r * level, Math.sin(angle) * r * level];
      });
      g.append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', '#666')
        .attr('stroke-width', 0.5);
    }

    // Axes
    categories.forEach((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(angle) * r)
        .attr('y2', Math.sin(angle) * r)
        .attr('stroke', '#666')
        .attr('stroke-width', 0.5);
    });

    // Data polygon
    const dataPoints = categories.map((cat, i) => {
      const val = queen.skills[cat] / 10;
      const angle = angleSlice * i - Math.PI / 2;
      return [Math.cos(angle) * r * val, Math.sin(angle) * r * val];
    });

    g.append('polygon')
      .attr('points', dataPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', queen.color)
      .attr('fill-opacity', 0.2)
      .attr('stroke', queen.color)
      .attr('stroke-width', 1.5);

    // Labels
    categories.forEach((cat, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const labelR = r + 10;
      g.append('text')
        .attr('x', Math.cos(angle) * labelR)
        .attr('y', Math.sin(angle) * labelR)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#aaa')
        .attr('font-size', `${Math.max(7, size * 0.07)}px`)
        .text(CATEGORY_LABELS[cat] ?? cat);
    });
  }, [queen, size]);

  return <svg ref={svgRef} width={size} height={size} />;
}
