import { useState, useRef, useCallback, type DragEvent } from 'react';
import { SEASON_PRESETS } from '../data/presets';
import { BASE_STATS, BASE_STAT_DISPLAY, type BaseStat, type Queen } from '../engine/types';

type StatKey = BaseStat | 'lipSync';

interface RosterEntry {
  seasonId: string;
  seasonName: string;
  queen: Queen;
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

function setStatValue(queen: Queen, stat: StatKey, value: number): Queen {
  if (stat === 'lipSync') {
    return { ...queen, lipSync: value };
  }
  return { ...queen, skills: { ...queen.skills, [stat]: value } };
}

function buildInitialRoster(): RosterEntry[] {
  const entries: RosterEntry[] = [];
  for (const preset of SEASON_PRESETS) {
    for (const queen of preset.season.queens) {
      entries.push({
        seasonId: preset.season.id,
        seasonName: preset.season.name,
        queen: { ...queen, skills: { ...queen.skills } },
      });
    }
  }
  return entries;
}

function compositeKey(entry: RosterEntry): string {
  return `${entry.seasonId}:${entry.queen.id}`;
}

const STORAGE_KEY = 'rpdr-calibrate-roster';

function migrateEntry(entry: RosterEntry): RosterEntry {
  // Backfill any base stats added after the roster was saved (e.g. charisma).
  let patched = false;
  const skills = { ...entry.queen.skills };
  for (const stat of BASE_STATS) {
    if (skills[stat] === undefined) {
      skills[stat] = 5; // neutral default
      patched = true;
    }
  }
  return patched ? { ...entry, queen: { ...entry.queen, skills } } : entry;
}

function loadRoster(): RosterEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as RosterEntry[];
      if (Array.isArray(data) && data.length > 0) return data.map(migrateEntry);
    }
  } catch { /* ignore corrupt data */ }
  return buildInitialRoster();
}

function saveRoster(roster: RosterEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roster));
}

export default function CalibratePage() {
  const [roster, setRosterRaw] = useState<RosterEntry[]>(loadRoster);
  const setRoster = useCallback((update: RosterEntry[] | ((prev: RosterEntry[]) => RosterEntry[])) => {
    setRosterRaw((prev) => {
      const next = typeof update === 'function' ? update(prev) : update;
      saveRoster(next);
      return next;
    });
  }, []);
  const [selectedStat, setSelectedStat] = useState<StatKey>('comedy');
  const [dragOverRow, setDragOverRow] = useState<number | null>(null);
  const [enabledSeasons, setEnabledSeasons] = useState<Set<string>>(
    () => new Set(SEASON_PRESETS.map((p) => p.id)),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSeason = (seasonId: string) => {
    setEnabledSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(seasonId)) next.delete(seasonId);
      else next.add(seasonId);
      return next;
    });
  };

  const allSeasonsEnabled = enabledSeasons.size === SEASON_PRESETS.length;
  const setAllSeasons = (enabled: boolean) => {
    setEnabledSeasons(enabled ? new Set(SEASON_PRESETS.map((p) => p.id)) : new Set());
  };

  const scoreRows = Array.from({ length: 10 }, (_, i) => 10 - i); // [10, 9, 8, ..., 1]

  const entriesByScore = new Map<number, RosterEntry[]>();
  for (const score of scoreRows) entriesByScore.set(score, []);
  for (const entry of roster) {
    if (!enabledSeasons.has(entry.seasonId)) continue;
    const val = getStatValue(entry.queen, selectedStat);
    entriesByScore.get(val)?.push(entry);
  }

  const handleDragStart = (e: DragEvent, entry: RosterEntry) => {
    e.dataTransfer.setData('text/plain', compositeKey(entry));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: DragEvent, targetScore: number) => {
    e.preventDefault();
    setDragOverRow(null);
    const key = e.dataTransfer.getData('text/plain');
    if (!key) return;
    setRoster((prev) =>
      prev.map((entry) =>
        compositeKey(entry) === key
          ? { ...entry, queen: setStatValue(entry.queen, selectedStat, targetScore) }
          : entry,
      ),
    );
  };

  const handleDragOver = (e: DragEvent, score: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverRow(score);
  };

  const handleExport = () => {
    const data: Record<string, { name: string; queens: Queen[] }> = {};
    for (const entry of roster) {
      if (!data[entry.seasonId]) {
        data[entry.seasonId] = { name: entry.seasonName, queens: [] };
      }
      // Ensure consistent key order in skills
      const orderedSkills: Record<string, number> = {};
      for (const cat of BASE_STATS) {
        orderedSkills[cat] = entry.queen.skills[cat];
      }
      data[entry.seasonId].queens.push({
        id: entry.queen.id,
        name: entry.queen.name,
        skills: orderedSkills as Queen['skills'],
        lipSync: entry.queen.lipSync,
        color: entry.queen.color,
      });
    }
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rpdr-queens-roster.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as Record<
          string,
          { name: string; queens: Queen[] }
        >;
        const entries: RosterEntry[] = [];
        for (const [seasonId, season] of Object.entries(data)) {
          for (const queen of season.queens) {
            entries.push({
              seasonId,
              seasonName: season.name,
              queen: { ...queen, skills: { ...queen.skills } },
            });
          }
        }
        setRoster(entries);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
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

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-[#888] hover:text-[#ccc] bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a] px-3 py-1.5 rounded transition-colors"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={handleExport}
            className="text-xs text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded transition-colors font-medium"
          >
            Export JSON
          </button>
        </div>
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
          const checked = enabledSeasons.has(preset.id);
          return (
            <label
              key={preset.id}
              className="flex items-center gap-1 text-xs cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleSeason(preset.id)}
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
                {entries.map((entry) => (
                  <div
                    key={compositeKey(entry)}
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
                ))}
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
