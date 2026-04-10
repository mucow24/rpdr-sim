import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useStore } from '../store/useStore';
import { CHALLENGE_CATEGORIES, type Queen } from '../engine/types';

const RADAR_SIZE = 100;
const CATEGORY_LABELS: Record<string, string> = {
  comedy: 'COM',
  design: 'DES',
  acting: 'ACT',
  dance: 'DAN',
  snatchGame: 'SNG',
  improv: 'IMP',
  runway: 'RUN',
  singing: 'VOC',
};

function RadarChart({ queen }: { queen: Queen }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cx = RADAR_SIZE / 2;
    const cy = RADAR_SIZE / 2;
    const r = RADAR_SIZE / 2 - 16;
    const categories = [...CHALLENGE_CATEGORIES];
    const n = categories.length;
    const angleSlice = (2 * Math.PI) / n;

    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Background rings
    for (const level of [0.25, 0.5, 0.75, 1]) {
      const points = categories.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return [Math.cos(angle) * r * level, Math.sin(angle) * r * level];
      });
      g.append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', '#1a1a2a')
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
        .attr('stroke', '#1a1a2a')
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
        .attr('fill', '#555')
        .attr('font-size', '7px')
        .text(CATEGORY_LABELS[cat] ?? cat);
    });
  }, [queen]);

  return <svg ref={svgRef} width={RADAR_SIZE} height={RADAR_SIZE} />;
}

export default function QueenCard({ queen }: { queen: Queen }) {
  const { baselineResults, filteredResults, selectedQueenId, setSelectedQueenId } =
    useStore();

  const results = filteredResults ?? baselineResults;
  const isSelected = selectedQueenId === queen.id;

  const winProb = results?.winProb[queen.id] ?? 0;
  const top4Prob = results?.top4Prob[queen.id] ?? 0;

  return (
    <button
      onClick={() => setSelectedQueenId(queen.id)}
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all text-left w-full
        ${
          isSelected
            ? 'bg-[#1a1a2a] border-[#3a3a5a]'
            : 'bg-[#121218] border-[#1a1a24] hover:border-[#2a2a3a]'
        }
      `}
    >
      <RadarChart queen={queen} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: queen.color }}
          />
          <span className="text-sm font-medium text-[#ddd] truncate">
            {queen.name}
          </span>
        </div>
        {results && (
          <div className="flex gap-4 text-xs text-[#666]">
            <span>
              Crown:{' '}
              <span className="text-[#aaa] font-mono">
                {(winProb * 100).toFixed(1)}%
              </span>
            </span>
            <span>
              Top 4:{' '}
              <span className="text-[#aaa] font-mono">
                {(top4Prob * 100).toFixed(1)}%
              </span>
            </span>
          </div>
        )}
        <div className="flex gap-1 mt-1.5 text-[10px] text-[#555] font-mono">
          <span>LS: {queen.lipSync}</span>
          <span className="text-[#333]">|</span>
          <span>
            Best:{' '}
            {
              Object.entries(queen.skills).sort(
                ([, a], [, b]) => b - a,
              )[0][0]
            }
          </span>
        </div>
      </div>
    </button>
  );
}
