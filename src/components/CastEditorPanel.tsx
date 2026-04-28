import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { SEASON_PRESETS } from '../data/presets';
import type { BaseStat, Queen } from '../engine/types';

interface Props {
  onClose: () => void;
}

interface GlobalEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
}

const STAT_COLUMNS: { key: BaseStat | 'lipSync'; label: string }[] = [
  { key: 'comedy', label: 'CO' },
  { key: 'improv', label: 'IM' },
  { key: 'acting', label: 'AC' },
  { key: 'dance', label: 'DA' },
  { key: 'music', label: 'MU' },
  { key: 'design', label: 'DE' },
  { key: 'runway', label: 'RN' },
  { key: 'charisma', label: 'CH' },
  { key: 'lipSync', label: 'LS' },
];

function statValue(q: Queen, key: BaseStat | 'lipSync'): number {
  return key === 'lipSync' ? q.lipSync : q.skills[key];
}

// Mirrors StatInput's `colorScale="skill"` palette — pure value → color.
function statColorClass(value: number): string {
  if (value >= 9) return 'text-sky-300';
  if (value >= 7) return 'text-green-400';
  if (value >= 5) return 'text-[#ddd]';
  if (value >= 3) return 'text-orange-400';
  return 'text-red-400';
}

// Shared stats column block. The grid + fixed width guarantees the header
// labels land in the same x-positions as the values below them.
const STATS_GRID_CLS = 'grid grid-cols-9 w-36 font-mono text-[10px] flex-shrink-0';

// Sticky inside the scrollable list so it shares the same content width as the
// rows (otherwise the scrollbar inside the ul shifts row columns left vs the
// header). Height is fixed so callers can offset other sticky headers by it.
function ColumnHeader() {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 px-3 h-7 bg-[#0a0a10] border-b border-[#15151c]">
      <span className="w-2 flex-shrink-0" />
      <span className="flex-1 min-w-0" />
      <div className={`${STATS_GRID_CLS} text-[#666]`}>
        {STAT_COLUMNS.map(({ key, label }) => (
          <div key={key} className="text-center">{label}</div>
        ))}
      </div>
      <span className="w-6 flex-shrink-0" />
    </div>
  );
}

function buildGlobalList(): GlobalEntry[] {
  const out: GlobalEntry[] = [];
  for (const preset of SEASON_PRESETS) {
    const sorted = [...preset.season.queens].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const q of sorted) {
      out.push({ seasonId: preset.id, seasonName: preset.name, queen: q });
    }
  }
  return out;
}

export default function CastEditorPanel({ onClose }: Props) {
  const activeSeasonId = useStore((s) => s.activeSeasonId);
  const seasonsById = useStore((s) => s.seasonsById);
  const loadSeason = useStore((s) => s.loadSeason);
  const setSeasonCast = useStore((s) => s.setSeasonCast);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Both the season selection and the cast are staged locally — only Apply
  // commits anything to the store, so the in-modal season dropdown never
  // triggers a re-simulation.
  const [stagedSeasonId, setStagedSeasonId] = useState(activeSeasonId);
  const [stagedCast, setStagedCast] = useState<Queen[]>(() => {
    const s = seasonsById[activeSeasonId];
    return s ? s.queens.map((q) => ({ ...q, skills: { ...q.skills } })) : [];
  });

  const requiredSize = useMemo(() => {
    const preset = SEASON_PRESETS.find((p) => p.id === stagedSeasonId);
    return preset?.season.queens.length ?? 0;
  }, [stagedSeasonId]);

  const stagedIds = useMemo(() => new Set(stagedCast.map((q) => q.id)), [stagedCast]);

  const [filter, setFilter] = useState('');

  const globalList = useMemo(() => buildGlobalList(), []);

  const groupedGlobal = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    const groups: { seasonId: string; seasonName: string; queens: Queen[] }[] = [];
    for (const entry of globalList) {
      if (needle && !entry.queen.name.toLowerCase().includes(needle)) continue;
      let g = groups.find((x) => x.seasonId === entry.seasonId);
      if (!g) {
        g = { seasonId: entry.seasonId, seasonName: entry.seasonName, queens: [] };
        groups.push(g);
      }
      g.queens.push(entry.queen);
    }
    return groups;
  }, [globalList, filter]);

  const handleSeasonChange = (newId: string) => {
    setStagedSeasonId(newId);
    const s = seasonsById[newId];
    setStagedCast(s ? s.queens.map((q) => ({ ...q, skills: { ...q.skills } })) : []);
  };

  const restoreDefault = () => {
    const preset = SEASON_PRESETS.find((p) => p.id === stagedSeasonId);
    if (!preset) return;
    setStagedCast(preset.season.queens.map((q) => ({ ...q, skills: { ...q.skills } })));
  };

  const removeQueen = (queenId: string) => {
    setStagedCast((prev) => prev.filter((q) => q.id !== queenId));
  };

  const clearCast = () => {
    setStagedCast([]);
  };

  const addQueen = (q: Queen) => {
    if (stagedIds.has(q.id)) return;
    setStagedCast((prev) => [...prev, { ...q, skills: { ...q.skills } }]);
  };

  const apply = () => {
    if (stagedCast.length !== requiredSize) return;
    setSeasonCast(stagedSeasonId, stagedCast);
    if (stagedSeasonId !== activeSeasonId) {
      loadSeason(stagedSeasonId);
    }
    onClose();
  };

  const sizeOk = stagedCast.length === requiredSize;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[900px] max-h-[90vh] overflow-y-auto bg-[#121218] border border-[#1a1a24] rounded-lg p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#ddd]">Edit cast of</h3>
          <select
            value={stagedSeasonId}
            onChange={(e) => handleSeasonChange(e.target.value)}
            className="bg-[#0a0a10] border border-[#3a3a4a] rounded text-sm text-[#ccc] px-2 py-1 focus:outline-none focus:border-amber-500/50"
          >
            {Object.values(seasonsById).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: current staged cast */}
        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-wide text-[#bbb] mb-1.5">Cast</div>
          <div className="bg-[#0a0a10] border border-[#1a1a24] rounded h-[455px] overflow-y-scroll">
            <ColumnHeader />
            <ul>
              {stagedCast.length === 0 && (
                <li className="px-3 py-2 text-sm text-[#555] italic">Empty</li>
              )}
              {stagedCast.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#ccc] border-b border-[#15151c] last:border-b-0"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: q.color }}
                  />
                  <span className="flex-1 truncate min-w-0">{q.name}</span>
                  <div className={STATS_GRID_CLS}>
                    {STAT_COLUMNS.map(({ key }) => {
                      const v = statValue(q, key);
                      return (
                        <div key={key} className={`text-center ${statColorClass(v)}`}>
                          {v}
                        </div>
                      );
                    })}
                  </div>
                  <span className="w-6 flex-shrink-0 flex items-center justify-center">
                    <button
                      onClick={() => removeQueen(q.id)}
                      className="text-[#888] hover:text-red-400 transition-colors text-lg font-bold leading-none"
                      title="Remove from cast"
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 items-center mt-2 gap-2">
            <div className="justify-self-start">
              <button
                onClick={restoreDefault}
                className="inline-flex items-center justify-center leading-none w-[145px] px-2 py-1.5 rounded text-sm font-medium text-[#999] border border-[#3a3a4a] hover:text-[#ccc] hover:border-[#4a4a5a] transition-colors"
              >
                Restore default cast
              </button>
            </div>
            <div
              className={`justify-self-center text-sm font-mono ${
                sizeOk ? 'text-[#ccc]' : 'text-amber-400'
              }`}
            >
              {stagedCast.length}/{requiredSize} queens
            </div>
            <div className="justify-self-end">
              <button
                onClick={clearCast}
                className="inline-flex items-center justify-center leading-none w-[145px] px-2 py-1.5 rounded text-sm font-medium text-[#999] border border-[#3a3a4a] hover:text-[#ccc] hover:border-[#4a4a5a] transition-colors"
              >
                Clear cast
              </button>
            </div>
          </div>
        </div>

        {/* Right: global queen list, grouped by season */}
        <div className="flex flex-col">
          <div className="flex items-end justify-between mb-1.5 gap-2">
            <div className="text-xs uppercase tracking-wide text-[#bbb]">All queens</div>
            <div className="relative w-40">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search…"
                className="w-full text-xs leading-none px-1.5 py-0.5 pr-5 bg-[#0a0a10] border border-[#3a3a4a] rounded text-[#ccc] placeholder-[#555] focus:outline-none focus:border-amber-500/50"
              />
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center rounded text-[#888] hover:text-[#ccc] hover:bg-[#3a3a4a] text-xs leading-none"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="bg-[#0a0a10] border border-[#1a1a24] rounded h-[455px] overflow-y-auto">
            <ColumnHeader />
            <ul>
              {groupedGlobal.map((group) => (
                <li key={group.seasonId}>
                  <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-medium text-amber-300 bg-amber-700/40 border-b border-amber-500/40 sticky top-7 z-10">
                    {group.seasonName}
                  </div>
                  <ul>
                    {group.queens.map((q) => {
                      const inCast = stagedIds.has(q.id);
                      return (
                        <li
                          key={`${group.seasonId}:${q.id}`}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#ccc] border-b border-[#15151c]"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: q.color }}
                          />
                          <span
                            className={`flex-1 truncate min-w-0 ${inCast ? 'text-[#555]' : ''}`}
                          >
                            {q.name}
                          </span>
                          <div className={`${STATS_GRID_CLS} ${inCast ? 'opacity-40' : ''}`}>
                            {STAT_COLUMNS.map(({ key }) => {
                              const v = statValue(q, key);
                              return (
                                <div key={key} className={`text-center ${statColorClass(v)}`}>
                                  {v}
                                </div>
                              );
                            })}
                          </div>
                          <span className="w-6 flex-shrink-0 flex items-center justify-center">
                            <button
                              onClick={() => addQueen(q)}
                              disabled={inCast || sizeOk}
                              className="text-[#888] hover:text-emerald-400 transition-colors text-lg font-bold leading-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#888]"
                              title={inCast ? 'Already in cast' : sizeOk ? 'Cast is full' : 'Add to cast'}
                            >
                              +
                            </button>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded text-sm font-medium text-[#999] border border-[#3a3a4a] hover:text-[#ccc] hover:border-[#4a4a5a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            disabled={!sizeOk}
            className="px-3 py-1 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
