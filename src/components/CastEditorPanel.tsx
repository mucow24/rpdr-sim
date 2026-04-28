import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { SEASON_PRESETS } from '../data/presets';
import { BASE_STATS, type Queen } from '../engine/types';

type StatTooltip = {
  rows: { label: string; value: number }[];
  cellLeft: number;
  cellTop: number;
  cellBottom: number;
  cellWidth: number;
};

interface Props {
  onClose: () => void;
}

interface GlobalEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
}

// List view shows aggregated buckets (HUM/PERF/LOOK) plus the two standalone
// stats — derived values are always rendered with one decimal place to make it
// obvious they aren't base stats.
type StatKey = 'humor' | 'performance' | 'look' | 'charisma' | 'lipSync';

const STAT_COLUMNS: { key: StatKey; label: string }[] = [
  { key: 'humor', label: 'HUM' },
  { key: 'performance', label: 'PERF' },
  { key: 'look', label: 'LOOK' },
  { key: 'charisma', label: 'CH' },
  { key: 'lipSync', label: 'LS' },
];

function statValue(q: Queen, key: StatKey): number {
  switch (key) {
    case 'humor':
      return (q.skills.comedy + q.skills.improv) / 2;
    case 'performance':
      return (q.skills.acting + q.skills.dance + q.skills.music) / 3;
    case 'look':
      return (q.skills.design + q.skills.runway) / 2;
    case 'charisma':
      return q.skills.charisma;
    case 'lipSync':
      return q.lipSync;
  }
}

// Mirrors QueenStatsPanel: arithmetic mean of all 8 base skills + lipSync.
function queenStrength(q: Queen): number {
  const base = BASE_STATS.reduce((a, s) => a + (q.skills[s] ?? 0), 0);
  return (base + (q.lipSync ?? 0)) / (BASE_STATS.length + 1);
}

const STAT_LABEL: Record<StatKey, string> = {
  humor: 'HUM',
  performance: 'PERF',
  look: 'LOOK',
  charisma: 'Charisma',
  lipSync: 'Lip Sync',
};

// Always returns at least the stat itself; derived stats also include their
// component base stats so the tooltip exposes every number behind the dot.
function tooltipRows(q: Queen, key: StatKey): { label: string; value: number }[] {
  const top = { label: STAT_LABEL[key], value: statValue(q, key) };
  switch (key) {
    case 'humor':
      return [
        top,
        { label: 'Comedy', value: q.skills.comedy },
        { label: 'Improv', value: q.skills.improv },
      ];
    case 'performance':
      return [
        top,
        { label: 'Acting', value: q.skills.acting },
        { label: 'Dance', value: q.skills.dance },
        { label: 'Music', value: q.skills.music },
      ];
    case 'look':
      return [
        top,
        { label: 'Design', value: q.skills.design },
        { label: 'Runway', value: q.skills.runway },
      ];
    case 'charisma':
    case 'lipSync':
      return [top];
  }
}

function formatTooltipNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

// Color palette for stat values. Bands are inclusive on the lower bound, so
// e.g. 5.99 is still neutral and only a true 6 reads as green. Glow on 10.
function statColorClass(value: number): string {
  if (value >= 10) return 'text-amber-300 font-semibold drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]';
  if (value >= 8) return 'text-sky-300';
  if (value >= 6) return 'text-green-400';
  if (value >= 5) return 'text-[#ddd]';
  if (value >= 3) return 'text-orange-400';
  return 'text-red-400';
}

type SortCol = 'name' | 'strength' | StatKey;
type SortState = { col: SortCol; dir: 'asc' | 'desc' };

function sortKey(q: Queen, col: SortCol): string | number {
  if (col === 'name') return q.name.toLowerCase();
  if (col === 'strength') return queenStrength(q);
  return statValue(q, col);
}

function compareQueens(a: Queen, b: Queen, sort: SortState): number {
  const va = sortKey(a, sort.col);
  const vb = sortKey(b, sort.col);
  const cmp =
    typeof va === 'string' && typeof vb === 'string'
      ? va.localeCompare(vb)
      : (va as number) - (vb as number);
  return sort.dir === 'asc' ? cmp : -cmp;
}

// Shared stats column block. The grid + fixed width guarantees the header
// labels land in the same x-positions as the dots below them.
const STATS_GRID_CLS = 'grid grid-cols-5 w-[140px] flex-shrink-0';
const STRENGTH_COL_CLS = 'w-6 flex-shrink-0';

function SortableLabel({
  col,
  sort,
  onSort,
  className = '',
  children,
}: {
  col: SortCol;
  sort: SortState | null;
  onSort: (col: SortCol) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const active = sort?.col === col;
  return (
    <button
      type="button"
      onClick={() => onSort(col)}
      className={`cursor-pointer transition-colors ${
        active ? 'text-amber-300' : 'text-[#666] hover:text-[#999]'
      } ${className}`}
    >
      {children}
      {active && (
        <span className="ml-0.5 text-[8px] align-middle">
          {sort.dir === 'asc' ? '▲' : '▼'}
        </span>
      )}
    </button>
  );
}

// Sticky inside the scrollable list so it shares the same content width as the
// rows (otherwise the scrollbar inside the ul shifts row columns left vs the
// header). Height is fixed so callers can offset other sticky headers by it.
function ColumnHeader({
  sort,
  onSort,
}: {
  sort: SortState | null;
  onSort: (col: SortCol) => void;
}) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 px-3 h-7 bg-[#0a0a10] border-b border-[#15151c]">
      <span className="w-2 flex-shrink-0" />
      <SortableLabel
        col="name"
        sort={sort}
        onSort={onSort}
        className="flex-1 min-w-0 text-left font-mono text-[10px] uppercase tracking-wide truncate"
      >
        Name
      </SortableLabel>
      <SortableLabel
        col="strength"
        sort={sort}
        onSort={onSort}
        className={`${STRENGTH_COL_CLS} text-center text-base leading-none`}
      >
        💪
      </SortableLabel>
      <div className={STATS_GRID_CLS}>
        {STAT_COLUMNS.map(({ key, label }) => (
          <SortableLabel
            key={key}
            col={key}
            sort={sort}
            onSort={onSort}
            className="font-mono text-[10px] text-center"
          >
            {label}
          </SortableLabel>
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

  // One shared tooltip rendered via portal at <body>. Each stat dot wires
  // mouseenter/leave to populate it; this avoids per-row absolute popovers
  // getting clipped by the surrounding scroll container.
  const [tooltip, setTooltip] = useState<StatTooltip | null>(null);
  const showTooltip = (
    e: ReactMouseEvent<HTMLDivElement>,
    rows: { label: string; value: number }[],
  ) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTooltip({
      rows,
      cellLeft: r.left,
      cellTop: r.top,
      cellBottom: r.bottom,
      cellWidth: r.width,
    });
  };
  const hideTooltip = () => setTooltip(null);

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

  // Per-list sort state. null = no sort (cast list shows insertion order;
  // global list shows season-grouped). Click a column → sort asc; click the
  // same column → flip dir. Switching to a different column resets to asc.
  const [castSort, setCastSort] = useState<SortState | null>(null);
  const [globalSort, setGlobalSort] = useState<SortState | null>(null);
  const cycleSort = (
    current: SortState | null,
    set: (s: SortState | null) => void,
    col: SortCol,
  ) => {
    // unsorted -> asc -> desc -> unsorted (third click on the active column
    // clears the sort, so the right list returns to its season-grouped view).
    if (!current || current.col !== col) set({ col, dir: 'asc' });
    else if (current.dir === 'asc') set({ col, dir: 'desc' });
    else set(null);
  };
  const onCastSort = (col: SortCol) => cycleSort(castSort, setCastSort, col);
  const onGlobalSort = (col: SortCol) => cycleSort(globalSort, setGlobalSort, col);

  const sortedStagedCast = useMemo(() => {
    if (!castSort) return stagedCast;
    return [...stagedCast].sort((a, b) => compareQueens(a, b, castSort));
  }, [stagedCast, castSort]);

  const globalList = useMemo(() => buildGlobalList(), []);

  const filteredEntries = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return globalList;
    return globalList.filter((e) => e.queen.name.toLowerCase().includes(needle));
  }, [globalList, filter]);

  // When sorted, the right list goes flat; when not, it groups by season.
  const sortedGlobal = useMemo(() => {
    if (!globalSort) return null;
    return [...filteredEntries].sort((a, b) =>
      compareQueens(a.queen, b.queen, globalSort),
    );
  }, [filteredEntries, globalSort]);

  const groupedGlobal = useMemo(() => {
    if (globalSort) return null;
    const groups: { seasonId: string; seasonName: string; queens: Queen[] }[] = [];
    for (const entry of filteredEntries) {
      let g = groups.find((x) => x.seasonId === entry.seasonId);
      if (!g) {
        g = { seasonId: entry.seasonId, seasonName: entry.seasonName, queens: [] };
        groups.push(g);
      }
      g.queens.push(entry.queen);
    }
    return groups;
  }, [filteredEntries, globalSort]);

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
            <ColumnHeader sort={castSort} onSort={onCastSort} />
            <ul>
              {sortedStagedCast.length === 0 && (
                <li className="px-3 py-2 text-sm text-[#555] italic">Empty</li>
              )}
              {sortedStagedCast.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#ccc] border-b border-[#15151c] last:border-b-0"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: q.color }}
                  />
                  <span className="flex-1 truncate min-w-0">{q.name}</span>
                  <div
                    className={`${STRENGTH_COL_CLS} h-4 flex items-center justify-center font-mono text-xs leading-none ${statColorClass(queenStrength(q))}`}
                  >
                    {queenStrength(q).toFixed(1)}
                  </div>
                  <div className={STATS_GRID_CLS}>
                    {STAT_COLUMNS.map(({ key }) => {
                      const v = statValue(q, key);
                      const rows = tooltipRows(q, key);
                      return (
                        <div
                          key={key}
                          className={`cursor-help flex items-center justify-center text-base leading-none ${statColorClass(v)}`}
                          onMouseEnter={(e) => showTooltip(e, rows)}
                          onMouseLeave={hideTooltip}
                        >
                          ●
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
            <ColumnHeader sort={globalSort} onSort={onGlobalSort} />
            {(() => {
              const renderGlobalRow = (q: Queen, seasonId: string) => {
                const inCast = stagedIds.has(q.id);
                return (
                  <li
                    key={`${seasonId}:${q.id}`}
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
                    <div
                      className={`${STRENGTH_COL_CLS} h-4 flex items-center justify-center font-mono text-xs leading-none ${statColorClass(queenStrength(q))} ${inCast ? 'opacity-40' : ''}`}
                    >
                      {queenStrength(q).toFixed(1)}
                    </div>
                    <div className={`${STATS_GRID_CLS} ${inCast ? 'opacity-40' : ''}`}>
                      {STAT_COLUMNS.map(({ key }) => {
                        const v = statValue(q, key);
                        const rows = tooltipRows(q, key);
                        return (
                          <div
                            key={key}
                            className={`cursor-help flex items-center justify-center text-base leading-none ${statColorClass(v)}`}
                            onMouseEnter={(e) => showTooltip(e, rows)}
                            onMouseLeave={hideTooltip}
                          >
                            ●
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
              };
              return (
                <ul>
                  {sortedGlobal
                    ? sortedGlobal.map((e) => renderGlobalRow(e.queen, e.seasonId))
                    : groupedGlobal!.map((group) => (
                        <li key={group.seasonId}>
                          <div className="px-3 py-1 text-[11px] uppercase tracking-wider font-medium text-amber-300 bg-amber-700/40 border-b border-amber-500/40 sticky top-7 z-10">
                            {group.seasonName}
                          </div>
                          <ul>{group.queens.map((q) => renderGlobalRow(q, group.seasonId))}</ul>
                        </li>
                      ))}
                </ul>
              );
            })()}
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
      {tooltip &&
        createPortal(
          <div
            className="fixed z-[100] bg-[#0a0a10] border border-[#3a3a4a] rounded px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap text-left"
            style={{
              left: tooltip.cellLeft + tooltip.cellWidth / 2,
              top: tooltip.cellTop - 4,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {tooltip.rows.map(({ label, value }) => (
              <div key={label} className="font-mono text-[11px]">
                <span className="text-[#aaa]">{label}:</span>
                <span className={`ml-1 ${statColorClass(value)}`}>{formatTooltipNumber(value)}</span>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
