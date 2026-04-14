import { useStore } from '../../store/useStore';
import { isFinale } from '../../engine/types';
import { CHALLENGE_TYPES } from '../../data/challengeTypes';
import EpisodeDetail from './EpisodeDetail';

export default function Timeline() {
  const { currentSeason: season, conditions, openEpisodeIndex, setOpenEpisodeIndex } =
    useStore();

  const conditionEpisodes = new Set(conditions.map((c) => c.episodeIndex));

  return (
    <div className="w-full py-4 overflow-visible">
      <div className="flex items-center gap-0 px-6 justify-center flex-wrap">
        {season.episodes.map((episode, idx) => {
          const hasCondition = conditionEpisodes.has(idx);
          const isOpen = openEpisodeIndex === idx;

          return (
            <div key={episode.number} className="flex items-center">
              {idx > 0 && (
                <div
                  className={`w-8 h-px ${
                    hasCondition ? 'bg-amber-500/50' : 'bg-[#2a2a3a]'
                  }`}
                />
              )}
              <button
                onClick={() => setOpenEpisodeIndex(idx)}
                className={`
                  relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                  ${
                    hasCondition
                      ? 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a4a]'
                  }
                  ${isOpen ? 'ring-1 ring-white/20' : ''}
                `}
              >
                <span className="text-lg">
                  {isFinale(episode) ? '👑' : (CHALLENGE_TYPES[episode.challengeType]?.icon ?? '❓')}
                </span>
                <span className="text-xs text-[#888] font-mono">
                  {isFinale(episode) ? 'Finale' : `Ep ${episode.number}`}
                </span>
                {hasCondition && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {openEpisodeIndex !== null && (
        <div className="px-4 mt-2">
          <EpisodeDetail episodeIndex={openEpisodeIndex} />
        </div>
      )}
    </div>
  );
}
