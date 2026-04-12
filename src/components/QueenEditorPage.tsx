import { useState } from 'react';
import { useStore } from '../store/useStore';
import { CHALLENGE_CATEGORIES, type Queen, type ChallengeCategory } from '../engine/types';
import { SEASON_PRESETS } from '../data/presets';
import RadarChart from './RadarChart';

const CATEGORY_DISPLAY: Record<ChallengeCategory, string> = {
  comedy: 'Comedy',
  design: 'Design',
  acting: 'Acting',
  dance: 'Dance',
  snatchGame: 'Snatch Game',
  improv: 'Improv',
  runway: 'Runway',
  singing: 'Singing',
};

const DEFAULT_COLORS = [
  '#e74c3c', '#3498db', '#f39c12', '#2ecc71', '#9b59b6',
  '#e91e90', '#1abc9c', '#f1c40f', '#e67e22', '#c0392b',
  '#d4a574', '#8e44ad', '#16a085', '#7f8c8d',
];

function makeDefaultQueen(index: number): Queen {
  const skills = {} as Record<ChallengeCategory, number>;
  for (const cat of CHALLENGE_CATEGORIES) skills[cat] = 5;
  return {
    id: crypto.randomUUID(),
    name: 'New Queen',
    skills,
    lipSync: 5,
    color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  };
}

function QueenCard({
  queen,
  onUpdate,
  onRemove,
}: {
  queen: Queen;
  onUpdate: (q: Queen) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Queen>(queen);

  const startEdit = () => {
    setDraft({ ...queen, skills: { ...queen.skills } });
    setEditing(true);
  };

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const setSkill = (cat: ChallengeCategory, val: number) => {
    setDraft((d) => ({ ...d, skills: { ...d.skills, [cat]: val } }));
  };

  return (
    <div className="rounded-lg border bg-[#121218] border-[#1a1a24] p-4">
      {/* View header — always shown */}
      <div className="flex items-start gap-4">
        <RadarChart queen={editing ? draft : queen} size={120} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: queen.color }}
            />
            <span className="text-sm font-medium text-[#ddd] truncate">
              {queen.name}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs">
            {CHALLENGE_CATEGORIES.map((cat) => (
              <div key={cat} className="flex justify-between">
                <span className="text-[#666]">{CATEGORY_DISPLAY[cat]}</span>
                <span className="text-[#aaa] font-mono">{queen.skills[cat]}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-[#666]">Lip Sync</span>
              <span className="text-[#aaa] font-mono">{queen.lipSync}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {!editing && (
              <>
                <button
                  onClick={startEdit}
                  className="px-2.5 py-1 rounded text-xs text-[#666] hover:text-[#aaa] hover:bg-[#1a1a24] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={onRemove}
                  className="px-2.5 py-1 rounded text-xs text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="mt-4 pt-4 border-t border-[#1a1a24]">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-[#666] mb-1">Name</label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full bg-[#0f0f13] border border-[#2a2a3a] rounded px-2 py-1.5 text-sm text-[#ddd] outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-[#666] mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))}
                  className="w-8 h-8 rounded border border-[#2a2a3a] bg-transparent cursor-pointer"
                />
                <span className="text-xs text-[#666] font-mono">{draft.color}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {CHALLENGE_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-xs text-[#666] w-20 shrink-0">
                  {CATEGORY_DISPLAY[cat]}
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={draft.skills[cat]}
                  onChange={(e) => setSkill(cat, Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-xs text-[#aaa] font-mono w-4 text-right">
                  {draft.skills[cat]}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#666] w-20 shrink-0">Lip Sync</span>
              <input
                type="range"
                min={1}
                max={10}
                value={draft.lipSync}
                onChange={(e) => setDraft((d) => ({ ...d, lipSync: Number(e.target.value) }))}
                className="flex-1 accent-amber-500"
              />
              <span className="text-xs text-[#aaa] font-mono w-4 text-right">
                {draft.lipSync}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded text-sm text-[#666] hover:text-[#aaa] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QueenEditorPage() {
  const queens = useStore((s) => s.editorQueens);
  const episodes = useStore((s) => s.editorEpisodes);
  const setQueens = useStore((s) => s.setEditorQueens);
  const setAppMode = useStore((s) => s.setAppMode);

  const [presetId, setPresetId] = useState(SEASON_PRESETS[0].id);

  const handleLoadPreset = () => {
    const preset = SEASON_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setQueens(
      preset.season.queens.map((q) => ({
        ...q,
        skills: { ...q.skills },
      })),
    );
  };

  const handleNewQueen = () => {
    setQueens([...queens, makeDefaultQueen(queens.length)]);
  };

  const handleUpdate = (index: number, q: Queen) => {
    setQueens(queens.map((existing, i) => (i === index ? q : existing)));
  };

  const handleRemove = (index: number) => {
    setQueens(queens.filter((_, i) => i !== index));
  };

  const canApply = episodes.length > 0 && queens.length > 0;

  const handleApply = () => {
    const season = {
      id: 'custom',
      name: 'Custom Season',
      queens: queens.map((q) => ({ ...q, skills: { ...q.skills } })),
      episodes: episodes.map((ep) => ({
        ...ep,
        placements: { ...ep.placements },
        eliminated: [...ep.eliminated],
      })),
    };
    useStore.setState({
      realSeason: season,
      currentSeason: {
        ...season,
        episodes: season.episodes.map((ep) => ({
          ...ep,
          placements: { ...ep.placements },
          eliminated: [...ep.eliminated],
        })),
      },
      baselineResults: null,
    });
    setAppMode('simulation');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[#666]">
          {queens.length} queen{queens.length !== 1 ? 's' : ''}
        </p>
        {canApply && (
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
          >
            Apply to Simulation
          </button>
        )}
        {!canApply && queens.length > 0 && (
          <span className="text-xs text-[#555]">
            Add episodes to enable simulation
          </span>
        )}
      </div>

      <section className="bg-[#121218] rounded-lg border border-[#1a1a24] p-4 mb-6">
        <div className="flex items-center gap-3">
          <select
            value={presetId}
            onChange={(e) => setPresetId(e.target.value)}
            className="bg-[#0f0f13] border border-[#2a2a3a] rounded px-3 py-1.5 text-sm text-[#ddd] outline-none focus:border-amber-500/50"
          >
            {SEASON_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleLoadPreset}
            className="px-3 py-1.5 rounded text-sm font-medium text-[#ddd] bg-[#1a1a24] hover:bg-[#2a2a3a] transition-colors"
          >
            Load queens
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[#888]">Active Queens</h3>
          <div className="flex gap-2">
            <button
              onClick={handleNewQueen}
              className="px-3 py-1.5 rounded text-sm text-[#ddd] bg-[#1a1a24] hover:bg-[#2a2a3a] transition-colors"
            >
              New Queen
            </button>
            <button
              onClick={() => setQueens([])}
              disabled={queens.length === 0}
              className="px-3 py-1.5 rounded text-sm text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              Clear List
            </button>
          </div>
        </div>

        {queens.length === 0 ? (
          <div className="text-center py-12 text-[#444]">
            No queens yet. Load a preset or add a new queen.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queens.map((q, i) => (
              <QueenCard
                key={q.id}
                queen={q}
                onUpdate={(updated) => handleUpdate(i, updated)}
                onRemove={() => handleRemove(i)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
