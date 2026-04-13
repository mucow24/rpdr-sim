import { useState } from 'react';
import { useStore } from '../store/useStore';
import { CHALLENGE_CATEGORIES, type EpisodeData, type ChallengeCategory } from '../engine/types';
import { SEASON_PRESETS } from '../data/presets';

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

function EpisodeCard({
  episode,
  index,
  isFirst,
  isLast,
  isEditing,
  onEdit,
  onUpdate,
  onMove,
  onRemove,
}: {
  episode: EpisodeData;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (ep: EpisodeData) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [editName, setEditName] = useState(episode.challengeName);
  const [editType, setEditType] = useState<ChallengeCategory>(episode.challengeType);
  const [editSplitPremiere, setEditSplitPremiere] = useState(episode.splitPremiere ?? false);

  const handleConfirm = () => {
    onUpdate({ ...episode, challengeName: editName, challengeType: editType, splitPremiere: editSplitPremiere || undefined });
    onEdit();
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-[#121218] border-[#1a1a24]">
      <span className="text-xs text-[#555] font-mono w-8 shrink-0">
        {index + 1}.
      </span>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            className="flex-1 min-w-0 bg-[#0f0f13] border border-[#2a2a3a] rounded px-2 py-1 text-sm text-[#ddd] outline-none focus:border-amber-500/50"
            autoFocus
          />
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value as ChallengeCategory)}
            className="bg-[#0f0f13] border border-[#2a2a3a] rounded px-2 py-1 text-sm text-[#ddd] outline-none focus:border-amber-500/50"
          >
            {CHALLENGE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_DISPLAY[cat]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-[#888] shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={editSplitPremiere}
              onChange={(e) => setEditSplitPremiere(e.target.checked)}
              className="accent-purple-500"
            />
            Split
          </label>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="text-sm text-[#ddd] truncate">{episode.challengeName}</span>
          <span className="text-xs text-[#666] bg-[#1a1a24] rounded px-2 py-0.5 shrink-0">
            {CATEGORY_DISPLAY[episode.challengeType]}
          </span>
          {episode.splitPremiere && (
            <span className="text-xs text-purple-400 bg-purple-500/10 rounded px-2 py-0.5 shrink-0">
              Split
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <button
            onClick={handleConfirm}
            className="p-1.5 rounded text-green-400 hover:bg-green-500/10 transition-colors"
            title="Confirm"
          >
            &#10003;
          </button>
        ) : (
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-[#666] hover:text-[#aaa] hover:bg-[#1a1a24] transition-colors"
            title="Edit"
          >
            &#9998;
          </button>
        )}
        <button
          onClick={() => onMove(-1)}
          disabled={isFirst}
          className="p-1.5 rounded text-[#666] hover:text-[#aaa] hover:bg-[#1a1a24] transition-colors disabled:opacity-20 disabled:cursor-default"
          title="Move up"
        >
          &#9650;
        </button>
        <button
          onClick={() => onMove(1)}
          disabled={isLast}
          className="p-1.5 rounded text-[#666] hover:text-[#aaa] hover:bg-[#1a1a24] transition-colors disabled:opacity-20 disabled:cursor-default"
          title="Move down"
        >
          &#9660;
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Remove"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}

export default function SeasonEditorPage() {
  const episodes = useStore((s) => s.editorEpisodes);
  const queens = useStore((s) => s.editorQueens);
  const setEpisodes = useStore((s) => s.setEditorEpisodes);
  const setAppMode = useStore((s) => s.setAppMode);

  const [presetId, setPresetId] = useState(SEASON_PRESETS[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);

  const ensureIds = (eps: EpisodeData[]) =>
    eps.map((ep, i) => ({ ...ep, id: ep.id ?? crypto.randomUUID(), number: i + 1 }));

  const handleLoadPreset = () => {
    const preset = SEASON_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setEpisodes(
      ensureIds(preset.season.episodes.map((ep) => ({
        ...ep,
        placements: { ...ep.placements },
        eliminated: [...ep.eliminated],
      }))),
    );
    setEditingId(null);
  };

  const handleNewEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        id: crypto.randomUUID(),
        number: episodes.length + 1,
        challengeType: 'comedy',
        challengeName: 'New Challenge',
        placements: {},
        eliminated: [],
      },
    ]);
  };

  const handleUpdate = (index: number, ep: EpisodeData) => {
    setEpisodes(episodes.map((e, i) => (i === index ? ep : e)));
  };

  const handleMove = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= episodes.length) return;
    const next = [...episodes];
    [next[index], next[target]] = [next[target], next[index]];
    setEpisodes(ensureIds(next));
    setEditingId(null);
  };

  const handleRemove = (index: number) => {
    setEpisodes(ensureIds(episodes.filter((_, i) => i !== index)));
    setEditingId(null);
  };

  const canApply = episodes.length > 0 && queens.length > 0;

  const handleApply = () => {
    const season = {
      id: 'custom',
      name: 'Custom Season',
      queens: [...queens],
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
          {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
        </p>
        {canApply && (
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
          >
            Apply to Simulation
          </button>
        )}
        {!canApply && episodes.length > 0 && (
          <span className="text-xs text-[#555]">
            Add queens to enable simulation
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
            Load episodes
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[#888]">Active Episodes</h3>
          <div className="flex gap-2">
            <button
              onClick={handleNewEpisode}
              className="px-3 py-1.5 rounded text-sm text-[#ddd] bg-[#1a1a24] hover:bg-[#2a2a3a] transition-colors"
            >
              New Episode
            </button>
            <button
              onClick={() => {
                setEpisodes([]);
                setEditingId(null);
              }}
              disabled={episodes.length === 0}
              className="px-3 py-1.5 rounded text-sm text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              Clear List
            </button>
          </div>
        </div>

        {episodes.length === 0 ? (
          <div className="text-center py-12 text-[#444]">
            No episodes yet. Load a preset or add a new episode.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {episodes.map((ep, i) => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                index={i}
                isFirst={i === 0}
                isLast={i === episodes.length - 1}
                isEditing={editingId === ep.id}
                onEdit={() => setEditingId(editingId === ep.id ? null : ep.id!)}
                onUpdate={(updated) => handleUpdate(i, updated)}
                onMove={(dir) => handleMove(i, dir)}
                onRemove={() => handleRemove(i)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
