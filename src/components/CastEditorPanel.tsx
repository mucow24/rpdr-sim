import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { SEASON_PRESETS } from '../data/presets';
import type { Queen } from '../engine/types';

interface Props {
  onClose: () => void;
}

interface GlobalEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
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
  const activeSeason = useStore((s) => s.seasonsById[s.activeSeasonId]);
  const setSeasonCast = useStore((s) => s.setSeasonCast);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const requiredSize = useMemo(() => {
    const preset = SEASON_PRESETS.find((p) => p.id === activeSeasonId);
    return preset?.season.queens.length ?? 0;
  }, [activeSeasonId]);

  // Caller passes a key=activeSeasonId so this remounts (and re-initializes
  // staged cast from the new season) when the dropdown selection changes.
  const [stagedCast, setStagedCast] = useState<Queen[]>(() =>
    activeSeason ? activeSeason.queens.map((q) => ({ ...q, skills: { ...q.skills } })) : [],
  );

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

  const restoreDefault = () => {
    const preset = SEASON_PRESETS.find((p) => p.id === activeSeasonId);
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
    setSeasonCast(activeSeasonId, stagedCast);
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
        <div className="mb-3">
          <h3 className="text-sm font-medium text-[#ddd]">Edit cast</h3>
        </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left: current staged cast */}
        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-wide text-[#bbb] mb-1.5">Cast</div>
          <ul className="h-[427px] overflow-y-auto bg-[#0a0a10] border border-[#1a1a24] rounded">
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
                <span className="flex-1 truncate">{q.name}</span>
                <button
                  onClick={() => removeQueen(q.id)}
                  className="text-[#888] hover:text-red-400 transition-colors px-1 text-lg font-bold leading-none"
                  title="Remove from cast"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
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
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search…"
              className="w-40 text-xs leading-none px-1.5 py-0.5 bg-[#0a0a10] border border-[#3a3a4a] rounded text-[#ccc] placeholder-[#555] focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <ul className="h-[427px] overflow-y-auto bg-[#0a0a10] border border-[#1a1a24] rounded">
            {groupedGlobal.map((group) => (
              <li key={group.seasonId}>
                <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-medium text-amber-300 bg-amber-700/40 border-b border-amber-500/40 sticky top-0">
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
                          className={`flex-1 truncate ${inCast ? 'text-[#555]' : ''}`}
                        >
                          {q.name}
                        </span>
                        <button
                          onClick={() => addQueen(q)}
                          disabled={inCast || sizeOk}
                          className="text-[#888] hover:text-emerald-400 transition-colors px-1 text-lg font-bold leading-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-[#888]"
                          title={inCast ? 'Already in cast' : sizeOk ? 'Cast is full' : 'Add to cast'}
                        >
                          +
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
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
