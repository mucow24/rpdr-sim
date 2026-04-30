import { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { selectBaselineSeason } from '../store/selectors';
import { isFinale, isPass } from '../engine/types';
import { ARCHETYPES } from '../data/archetypes';

type EventType = 'win' | 'elimination';
type SortKey = 'prob' | 'type' | 'episode' | 'queen';
type SortDir = 'asc' | 'desc';

interface SurpriseEvent {
  type: EventType;
  episodeNum: number;
  episodeIcon: string;
  queenName: string;
  queenColor: string;
  prob: number;
}

const TOP_N = 10;

function formatProb(p: number): string {
  if (p === 0) return '<0.01%';
  if (p < 0.0001) return '<0.01%';
  if (p < 0.01) return (p * 100).toFixed(2) + '%';
  return (p * 100).toFixed(1) + '%';
}

function compareEvents(a: SurpriseEvent, b: SurpriseEvent, key: SortKey): number {
  switch (key) {
    case 'prob':
      return a.prob - b.prob;
    case 'type':
      return a.type.localeCompare(b.type);
    case 'episode':
      return a.episodeNum - b.episodeNum;
    case 'queen':
      return a.queenName.localeCompare(b.queenName);
  }
}

export default function SurprisingEventsTable() {
  const season = useStore(selectBaselineSeason);
  const baselineResults = useStore((s) => s.baselineResults);
  const [sortKey, setSortKey] = useState<SortKey>('prob');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Build the list of (winner, eliminated) events from regular episodes,
  // tagged with the simulation's unconditional probability of that event.
  // Finale and pass episodes are skipped: pass episodes have no outcomes,
  // and the season-winner identity isn't encoded in the historical data.
  const allEvents = useMemo<SurpriseEvent[]>(() => {
    if (!baselineResults) return [];
    const out: SurpriseEvent[] = [];
    season.episodes.forEach((ep, epIdx) => {
      if (isPass(ep) || isFinale(ep)) return;
      const alive = baselineResults.aliveProbByEpisode[epIdx];
      const epPlace = baselineResults.episodePlacements[epIdx];
      const elim = baselineResults.elimProbByEpisode[epIdx];
      const icon = ARCHETYPES[ep.archetype].icon;
      for (const q of season.queens) {
        if (ep.placements[q.id] === 'WIN') {
          const condWin = epPlace?.[q.id]?.['WIN'] ?? 0;
          const aliveProb = alive?.[q.id] ?? 0;
          out.push({
            type: 'win',
            episodeNum: ep.number,
            episodeIcon: icon,
            queenName: q.name,
            queenColor: q.color,
            prob: condWin * aliveProb,
          });
        }
      }
      for (const elimId of ep.eliminated) {
        const q = season.queens.find((x) => x.id === elimId);
        if (!q) continue;
        out.push({
          type: 'elimination',
          episodeNum: ep.number,
          episodeIcon: icon,
          queenName: q.name,
          queenColor: q.color,
          prob: elim?.[q.id] ?? 0,
        });
      }
    });
    return out;
  }, [season, baselineResults]);

  // Pick the N least-likely events first, then apply the user's sort within
  // that set. So toggling the column doesn't change which events appear —
  // only their order.
  const rows = useMemo(() => {
    const top = [...allEvents].sort((a, b) => a.prob - b.prob).slice(0, TOP_N);
    top.sort((a, b) => {
      const cmp = compareEvents(a, b, sortKey);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return top;
  }, [allEvents, sortKey, sortDir]);

  const onHeaderClick = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'prob' ? 'asc' : 'asc');
    }
  };

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  if (!baselineResults) {
    return null;
  }

  return (
    <section className="mb-4 w-[900px]">
      <div className="bg-[#121218] border border-[#1a1a24] rounded-lg p-4">
        <h3 className="text-sm font-medium text-[#ddd] mb-3">
          Most Surprising Outcomes — actual events the simulation rated least likely
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] border-b border-[#2a2a34]">
              <Th label="Probability" sortKey="prob" active={sortKey} dir={sortDir} onClick={onHeaderClick} arrow={arrow('prob')} className="w-32" />
              <Th label="Event" sortKey="type" active={sortKey} dir={sortDir} onClick={onHeaderClick} arrow={arrow('type')} className="w-32" />
              <Th label="Episode" sortKey="episode" active={sortKey} dir={sortDir} onClick={onHeaderClick} arrow={arrow('episode')} className="w-24" />
              <Th label="Queen" sortKey="queen" active={sortKey} dir={sortDir} onClick={onHeaderClick} arrow={arrow('queen')} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="text-[#666] italic py-3">
                  No events yet — run a simulation.
                </td>
              </tr>
            )}
            {rows.map((e, i) => {
              const isWin = e.type === 'win';
              const badgeClass = isWin
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-red-500/10 text-red-300 border-red-500/30';
              return (
                <tr key={i} className="border-b border-[#1a1a24] last:border-0">
                  <td className="py-1.5 tabular-nums text-[#ddd]">{formatProb(e.prob)}</td>
                  <td className="py-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs border ${badgeClass}`}>
                      {isWin ? 'Win' : 'Elimination'}
                    </span>
                  </td>
                  <td className="py-1.5 tabular-nums text-[#ccc]">{e.episodeIcon} Ep {e.episodeNum}</td>
                  <td className="py-1.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: e.queenColor }}
                      />
                      <span className="text-[#ddd]">{e.queenName}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  label,
  sortKey,
  active,
  onClick,
  arrow,
  className,
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
  arrow: string;
  className?: string;
}) {
  const isActive = active === sortKey;
  return (
    <th
      onClick={() => onClick(sortKey)}
      className={`py-2 font-medium cursor-pointer select-none transition-colors ${
        isActive ? 'text-amber-300' : 'hover:text-[#ccc]'
      } ${className ?? ''}`}
    >
      {label}
      <span className="text-amber-400">{arrow}</span>
    </th>
  );
}
