import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { SEASON_PRESETS } from '../data/presets';
import {
  BASE_STATS, BASE_STAT_DISPLAY, queenUid, isFinale, isPass,
  type BaseStat, type Queen, type SeasonData,
} from '../engine/types';
import { ARCHETYPES } from '../data/archetypes';
import { PLACEMENT_PALETTE as PLACEMENT_COLORS } from './charts/common/palette';
import { skillScore, type HeavyEpisodeRow, type PlacementOrElim } from './calibrateScoring';

type StatKey = BaseStat | 'lipSync';

interface RosterEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
}

const HEAVY_WEIGHT_THRESHOLD = 0.20;

/** Episodes where the selected stat has >= 20% of total archetype weight AND
 *  the queen was alive at episode start. Uses per-episode weight overrides
 *  when present, mirroring the scoring path in simulate.ts. */
function getHeavyEpisodes(
  season: SeasonData,
  queenId: string,
  stat: BaseStat,
): HeavyEpisodeRow[] {
  const rows: HeavyEpisodeRow[] = [];
  const eliminatedBefore = new Set<string>();

  for (const ep of season.episodes) {
    if (isFinale(ep) || isPass(ep)) continue;

    const alive = !eliminatedBefore.has(queenId);
    if (!alive) break; // queen is out; no later episode can match

    const weights = ep.weights ?? ARCHETYPES[ep.archetype].weights;
    let total = 0;
    for (const s of BASE_STATS) total += weights[s];

    const statShare = total > 0 ? weights[stat] / total : 0;
    if (statShare >= HEAVY_WEIGHT_THRESHOLD) {
      let placement: PlacementOrElim;
      if (ep.eliminated.includes(queenId)) {
        placement = 'ELIM';
      } else {
        placement = ep.placements[queenId] ?? 'SAFE';
      }
      rows.push({
        epNumber: ep.number,
        challengeName: ep.challengeName,
        icon: ARCHETYPES[ep.archetype].icon,
        placement,
        statShare,
      });
    }

    for (const id of ep.eliminated) eliminatedBefore.add(id);
  }

  return rows;
}

function TooltipShell({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-0 top-full mt-1 z-50 bg-amber-500/20 border border-amber-500/40 rounded shadow-xl p-2 pointer-events-none w-max backdrop-blur-[10px]">
      {children}
    </div>
  );
}

function QueenChip({ entry }: { entry: RosterEntry }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs bg-[#1a1a24]/80 border border-amber-500/30">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: SEASON_COLORS[entry.seasonId] ?? '#888' }}
      />
      <span className="text-amber-300 whitespace-nowrap">{entry.queen.name}</span>
      <span className="text-amber-500/60 text-[10px]">{seasonAbbrev(entry.seasonId)}</span>
    </div>
  );
}

// Evenly-spaced sample of up to `n` entries across the list. Deterministic.
function sampleEntries(entries: RosterEntry[], n: number): RosterEntry[] {
  if (entries.length <= n) return entries;
  const out: RosterEntry[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i * (entries.length - 1)) / (n - 1));
    out.push(entries[idx]);
  }
  return out;
}

function QueenGrid({ entries }: { entries: RosterEntry[] }) {
  return (
    <div className="flex flex-col gap-1 w-max">
      {entries.map((entry) => (
        <QueenChip key={queenUid(entry.seasonId, entry.queen.id)} entry={entry} />
      ))}
    </div>
  );
}

function ScoreSampleTooltip({ entries }: { entries: RosterEntry[] }) {
  const sample = sampleEntries(entries, 4);
  return (
    <TooltipShell>
      <div className="text-[9px] uppercase tracking-wide text-amber-500/70 mb-1 px-1 whitespace-nowrap">
        Example queens with this score
      </div>
      {sample.length === 0 ? (
        <div className="text-[10px] text-amber-500/60 italic px-1 py-0.5 whitespace-nowrap">
          No queens at this score
        </div>
      ) : (
        <QueenGrid entries={sample} />
      )}
    </TooltipShell>
  );
}

// Brighter tooltip-only shades for placements that read as too dim on the
// amber-tinted tooltip surface.
const TOOLTIP_PLACEMENT_OVERRIDES: Record<string, string> = {
  HIGH: '#4fc3ff',
  SAFE: '#cccccc',
  LOW: '#f2c09a',
};

// Text-only override (bg/border still derive from the base color).
const TOOLTIP_PLACEMENT_FG_OVERRIDES: Record<string, string> = {
  BTM2: '#ff9f95',
};

interface PlacementBadgeStyle {
  bg: string;
  fg: string;
  border: string;
}

function tooltipBadgeStyle(p: PlacementOrElim): PlacementBadgeStyle {
  if (p === 'ELIM') {
    return { bg: '#4a0000', fg: '#ff9999', border: '#8b0000' };
  }
  const c = TOOLTIP_PLACEMENT_OVERRIDES[p] ?? PLACEMENT_COLORS[p];
  const fg = TOOLTIP_PLACEMENT_FG_OVERRIDES[p] ?? c;
  return { bg: c + '33', fg, border: c + '66' };
}

function HistoryTooltip({
  rows,
  sameScoreQueens,
}: {
  rows: HeavyEpisodeRow[];
  sameScoreQueens: RosterEntry[];
}) {
  return (
    <TooltipShell>
      {rows.length === 0 ? (
        <div className="text-[10px] text-amber-500/60 italic px-1 py-0.5 whitespace-nowrap">
          No heavy-weight episodes for this stat
        </div>
      ) : (
        <table className="text-[10px] font-mono border-separate" style={{ borderSpacing: '6px 2px' }}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.epNumber}>
                <td className="text-amber-300 whitespace-nowrap">
                  <span className="text-amber-500/60">Ep {row.epNumber}</span>{' '}
                  {row.challengeName} {row.icon}
                </td>
                <td>
                  {(() => {
                    const bs = tooltipBadgeStyle(row.placement);
                    return (
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{
                          backgroundColor: bs.bg,
                          color: bs.fg,
                          border: `1px solid ${bs.border}`,
                        }}
                      >
                        {row.placement}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {rows.length > 0 && (
        <div className="text-[10px] text-amber-300 px-1 pt-1 whitespace-nowrap">
          <span className="text-amber-500/70">Skill score: </span>
          {skillScore(rows).toFixed(2)}
        </div>
      )}
      <div className="border-t border-amber-500/30 mt-2 pt-2">
        <div className="text-[9px] uppercase tracking-wide text-amber-500/70 mb-1 px-1 whitespace-nowrap">
          Same score, other seasons
        </div>
        {sameScoreQueens.length === 0 ? (
          <div className="text-[10px] text-amber-500/60 italic px-1 py-0.5 whitespace-nowrap">
            No matches in other seasons
          </div>
        ) : (
          <QueenGrid entries={sameScoreQueens} />
        )}
      </div>
    </TooltipShell>
  );
}

const STAT_OPTIONS: { value: StatKey; label: string }[] = [
  ...BASE_STATS.map((c) => ({ value: c as StatKey, label: BASE_STAT_DISPLAY[c] })),
  { value: 'lipSync', label: 'Lip Sync' },
];

type SortMode = 'season' | 'skill-desc' | 'skill-asc' | 'name';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'season', label: 'By season' },
  { value: 'skill-desc', label: 'By skill score (desc)' },
  { value: 'skill-asc', label: 'By skill score (asc)' },
  { value: 'name', label: 'By name' },
];

// "season5" → "S5"
function seasonAbbrev(seasonId: string): string {
  const num = seasonId.replace(/\D/g, '');
  return `S${num}`;
}

const SEASON_COLORS: Record<string, string> = {
  season1: '#e74c3c',
  season2: '#3498db',
  season3: '#2ecc71',
  season4: '#f39c12',
  season5: '#9b59b6',
  season6: '#1abc9c',
  season7: '#e91e63',
  season8: '#ff9800',
  season9: '#00bcd4',
  season10: '#8bc34a',
  season11: '#ff5722',
  season12: '#673ab7',
  season13: '#009688',
  season14: '#ffc107',
  season15: '#03a9f4',
  season16: '#e040fb',
  season17: '#cddc39',
};

function getStatValue(queen: Queen, stat: StatKey): number {
  return stat === 'lipSync' ? queen.lipSync : queen.skills[stat];
}

function sortEntries(
  entries: RosterEntry[],
  sortMode: SortMode,
  selectedStat: StatKey,
  seasonsById: Record<string, SeasonData>,
): RosterEntry[] {
  if (sortMode === 'season') return entries;
  if (sortMode === 'name') {
    return [...entries].sort((a, b) => a.queen.name.localeCompare(b.queen.name));
  }
  // skill-desc / skill-asc
  if (selectedStat === 'lipSync') return entries;
  const scored = entries.map((entry) => {
    const season = seasonsById[entry.seasonId];
    const rows = season ? getHeavyEpisodes(season, entry.queen.id, selectedStat) : [];
    return { entry, score: skillScore(rows) };
  });
  const dir = sortMode === 'skill-desc' ? -1 : 1;
  scored.sort((a, b) => dir * (a.score - b.score));
  return scored.map((s) => s.entry);
}

// One-time cleanup of Calibrate's pre-v2 localStorage keys — their data now
// lives in the store (under `rpdr-sim-store`).
const LEGACY_STORAGE_KEYS = [
  'rpdr-calibrate-roster-v2',
  'rpdr-calibrate-enabled-seasons',
];

export default function CalibratePage() {
  const seasonsById = useStore((s) => s.seasonsById);
  const enabledCalibrateSeasons = useStore((s) => s.enabledCalibrateSeasons);
  const updateQueenSkill = useStore((s) => s.updateQueenSkill);
  const updateQueenLipSync = useStore((s) => s.updateQueenLipSync);
  const toggleCalibrateSeason = useStore((s) => s.toggleCalibrateSeason);
  const setEnabledCalibrateSeasons = useStore((s) => s.setEnabledCalibrateSeasons);

  const [selectedStat, setSelectedStat] = useState<StatKey>('comedy');
  const [sortMode, setSortMode] = useState<SortMode>('season');
  const [dragOverRow, setDragOverRow] = useState<number | null>(null);
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  useEffect(() => {
    for (const key of LEGACY_STORAGE_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch { /* ignore */ }
    }
  }, []);

  const enabledSet = new Set(enabledCalibrateSeasons);
  const allSeasonsEnabled = enabledSet.size === SEASON_PRESETS.length;
  const setAllSeasons = (enabled: boolean) => {
    setEnabledCalibrateSeasons(enabled ? SEASON_PRESETS.map((p) => p.id) : []);
  };

  // Flatten all queens across all seasons into a single roster.
  const roster: RosterEntry[] = [];
  for (const preset of SEASON_PRESETS) {
    const season = seasonsById[preset.id];
    if (!season) continue;
    for (const queen of season.queens) {
      roster.push({ seasonId: preset.id, seasonName: season.name, queen });
    }
  }

  const scoreRows = Array.from({ length: 10 }, (_, i) => 10 - i); // [10, 9, 8, ..., 1]

  const entriesByScore = new Map<number, RosterEntry[]>();
  const allEntriesByScore = new Map<number, RosterEntry[]>();
  for (const score of scoreRows) {
    entriesByScore.set(score, []);
    allEntriesByScore.set(score, []);
  }
  for (const entry of roster) {
    const val = getStatValue(entry.queen, selectedStat);
    allEntriesByScore.get(val)?.push(entry);
    if (enabledSet.has(entry.seasonId)) {
      entriesByScore.get(val)?.push(entry);
    }
  }

  const sameScoreSample = useMemo(() => {
    if (!hoveredUid || selectedStat === 'lipSync') return [] as RosterEntry[];
    const hovered = roster.find(
      (r) => queenUid(r.seasonId, r.queen.id) === hoveredUid,
    );
    if (!hovered) return [] as RosterEntry[];
    const score = getStatValue(hovered.queen, selectedStat);
    const pool = roster.filter(
      (r) =>
        r.seasonId !== hovered.seasonId &&
        getStatValue(r.queen, selectedStat) === score,
    );
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredUid, selectedStat]);

  const handleDragStart = (e: DragEvent, entry: RosterEntry) => {
    e.dataTransfer.setData('text/plain', queenUid(entry.seasonId, entry.queen.id));
    e.dataTransfer.effectAllowed = 'move';
    setHoveredUid(null);
    setHoveredScore(null);
  };

  const handleDrop = (e: DragEvent, targetScore: number) => {
    e.preventDefault();
    setDragOverRow(null);
    const key = e.dataTransfer.getData('text/plain');
    if (!key) return;
    const [seasonId, queenId] = key.split(':');
    if (!seasonId || !queenId) return;
    if (selectedStat === 'lipSync') {
      updateQueenLipSync(seasonId, queenId, targetScore);
    } else {
      updateQueenSkill(seasonId, queenId, selectedStat, targetScore);
    }
  };

  const handleDragOver = (e: DragEvent, score: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverRow(score);
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedStat}
          onChange={(e) => setSelectedStat(e.target.value as StatKey)}
          className="bg-[#1a1a24] border border-[#3a3a4a] text-[#ccc] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
        >
          {STAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-[#888]">
          Sort queens
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="bg-[#1a1a24] border border-[#3a3a4a] text-[#ccc] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Season filter */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 p-2 bg-[#111118] rounded">
        <button
          onClick={() => setAllSeasons(!allSeasonsEnabled)}
          className="text-[10px] uppercase tracking-wide text-[#888] hover:text-[#ccc] px-2 py-0.5 border border-[#3a3a4a] hover:border-[#4a4a5a] rounded transition-colors"
        >
          {allSeasonsEnabled ? 'None' : 'All'}
        </button>
        {SEASON_PRESETS.map((preset) => {
          const checked = enabledSet.has(preset.id);
          return (
            <label
              key={preset.id}
              className="flex items-center gap-1 text-xs cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleCalibrateSeason(preset.id)}
                className="accent-amber-500"
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: SEASON_COLORS[preset.id] ?? '#888' }}
              />
              <span className={checked ? 'text-[#ccc]' : 'text-[#555]'}>
                {seasonAbbrev(preset.id)}
              </span>
            </label>
          );
        })}
      </div>

      {/* Score rows */}
      <div className="flex flex-col gap-1">
        {scoreRows.map((score) => {
          const entries = sortEntries(
            entriesByScore.get(score) ?? [],
            sortMode,
            selectedStat,
            seasonsById,
          );
          return (
            <div
              key={score}
              onDrop={(e) => handleDrop(e, score)}
              onDragOver={(e) => handleDragOver(e, score)}
              onDragLeave={() => setDragOverRow(null)}
              className={`flex items-start gap-3 p-2 rounded min-h-[40px] transition-colors ${
                dragOverRow === score
                  ? 'bg-[#1a1a2a] ring-1 ring-amber-500/30'
                  : 'bg-[#111118]'
              }`}
            >
              <div
                className="relative w-6 flex-shrink-0 pt-1"
                onMouseEnter={() => setHoveredScore(score)}
                onMouseLeave={() =>
                  setHoveredScore((cur) => (cur === score ? null : cur))
                }
              >
                <span className="block text-sm font-mono font-bold text-right text-amber-400 cursor-help">
                  {score}
                </span>
                {hoveredScore === score && (
                  <ScoreSampleTooltip entries={allEntriesByScore.get(score) ?? []} />
                )}
              </div>
              <span className="text-[10px] text-[#444] w-6 flex-shrink-0 pt-1.5">
                {entries.length}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entries.map((entry) => {
                  const uid = queenUid(entry.seasonId, entry.queen.id);
                  const showTooltip =
                    hoveredUid === uid && selectedStat !== 'lipSync';
                  const season = seasonsById[entry.seasonId];
                  return (
                    <div
                      key={uid}
                      className="relative"
                      onMouseEnter={() => setHoveredUid(uid)}
                      onMouseLeave={() => setHoveredUid((cur) => (cur === uid ? null : cur))}
                    >
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, entry)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs select-none bg-[#1a1a24] border border-[#3a3a4a] hover:border-[#4a4a5a] cursor-grab active:cursor-grabbing transition-colors"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: SEASON_COLORS[entry.seasonId] ?? '#888' }}
                        />
                        <span className="text-[#ccc] whitespace-nowrap">
                          {entry.queen.name}
                        </span>
                        <span className="text-[#555] text-[10px]">
                          {seasonAbbrev(entry.seasonId)}
                        </span>
                      </div>
                      {showTooltip && season && (
                        <HistoryTooltip
                          rows={getHeavyEpisodes(
                            season,
                            entry.queen.id,
                            selectedStat as BaseStat,
                          )}
                          sameScoreQueens={sameScoreSample}
                        />
                      )}
                    </div>
                  );
                })}
                {entries.length === 0 && (
                  <span className="text-[#333] text-xs italic px-2">
                    drop here
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
