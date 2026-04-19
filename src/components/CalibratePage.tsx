import { useEffect, useState, type DragEvent } from 'react';
import { useStore } from '../store/useStore';
import { SEASON_PRESETS } from '../data/presets';
import {
  BASE_STATS, BASE_STAT_DISPLAY, queenUid, isFinale,
  type BaseStat, type Queen, type SeasonData, type Placement,
} from '../engine/types';
import { ARCHETYPES } from '../data/archetypes';

type StatKey = BaseStat | 'lipSync';

interface RosterEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
}

const PLACEMENT_COLORS: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#888888',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
  ELIM: '#8b0000',
};

type PlacementOrElim = Placement | 'ELIM';

interface HeavyEpisodeRow {
  epNumber: number;
  challengeName: string;
  icon: string;
  placement: PlacementOrElim;
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
    if (isFinale(ep)) continue;

    const alive = !eliminatedBefore.has(queenId);
    if (!alive) break; // queen is out; no later episode can match

    const weights = ep.weights ?? ARCHETYPES[ep.archetype].weights;
    let total = 0;
    for (const s of BASE_STATS) total += weights[s];

    if (total > 0 && weights[stat] / total >= HEAVY_WEIGHT_THRESHOLD) {
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
      });
    }

    for (const id of ep.eliminated) eliminatedBefore.add(id);
  }

  return rows;
}

function HistoryTooltip({ rows }: { rows: HeavyEpisodeRow[] }) {
  return (
    <div
      className="absolute left-0 top-full mt-1 z-50 bg-[#121218] border border-[#2a2a3a] rounded shadow-xl p-2 pointer-events-none"
      style={{ minWidth: 220 }}
    >
      {rows.length === 0 ? (
        <div className="text-[10px] text-[#666] italic px-1 py-0.5 whitespace-nowrap">
          No heavy-weight episodes for this stat
        </div>
      ) : (
        <table className="text-[10px] font-mono border-separate" style={{ borderSpacing: '6px 2px' }}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.epNumber}>
                <td className="text-[#ccc] whitespace-nowrap">
                  <span className="text-[#666]">Ep {row.epNumber}</span>{' '}
                  {row.challengeName} {row.icon}
                </td>
                <td>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      backgroundColor: PLACEMENT_COLORS[row.placement] + '33',
                      color: PLACEMENT_COLORS[row.placement],
                      border: `1px solid ${PLACEMENT_COLORS[row.placement]}66`,
                    }}
                  >
                    {row.placement}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const STAT_OPTIONS: { value: StatKey; label: string }[] = [
  ...BASE_STATS.map((c) => ({ value: c as StatKey, label: BASE_STAT_DISPLAY[c] })),
  { value: 'lipSync', label: 'Lip Sync' },
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
  const [dragOverRow, setDragOverRow] = useState<number | null>(null);
  const [hoveredUid, setHoveredUid] = useState<string | null>(null);

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
  for (const score of scoreRows) entriesByScore.set(score, []);
  for (const entry of roster) {
    if (!enabledSet.has(entry.seasonId)) continue;
    const val = getStatValue(entry.queen, selectedStat);
    entriesByScore.get(val)?.push(entry);
  }

  const handleDragStart = (e: DragEvent, entry: RosterEntry) => {
    e.dataTransfer.setData('text/plain', queenUid(entry.seasonId, entry.queen.id));
    e.dataTransfer.effectAllowed = 'move';
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
          className="bg-[#1a1a24] border border-[#2a2a3a] text-[#ccc] text-sm rounded px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
        >
          {STAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Season filter */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 p-2 bg-[#111118] rounded">
        <button
          onClick={() => setAllSeasons(!allSeasonsEnabled)}
          className="text-[10px] uppercase tracking-wide text-[#888] hover:text-[#ccc] px-2 py-0.5 border border-[#2a2a3a] hover:border-[#3a3a4a] rounded transition-colors"
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
          const entries = entriesByScore.get(score) ?? [];
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
              <span className="text-sm font-mono font-bold w-6 text-right flex-shrink-0 text-amber-400 pt-1">
                {score}
              </span>
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
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs select-none bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] cursor-grab active:cursor-grabbing transition-colors"
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
