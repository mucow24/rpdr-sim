// Tooltip data for the Calibrate tab's Lip Sync stat.
// For a given queen, returns one row per canonical lip sync she appeared in
// (across ALL seasons — main + All Stars), sorted chronologically.
//
// Self-eliminations are skipped (same convention as `lipSyncsGraph.ts`).
import { LIP_SYNCS_CANONICAL, type QueenId } from '../data/lipSyncsCanonical';
import { SEASON_PRESETS } from '../data/presets';

export type LipSyncResult = 'W' | 'L' | 'T';

export type LipSyncRow = {
  episode: string;            // "S3E2", "AS5E7"
  opponent: string;           // "v. Aquaria", or "v. Aquaria +2" for multi-way matchups
  /** The QueenId of the opponent named in `opponent` — i.e. the first opponent
   *  when there are several. Null only when this row has no opponent at all
   *  (defensive; canonical data always has at least one). Consumers use this
   *  to look up the opponent's live lip-sync stat from the store. */
  namedOpponentId: QueenId | null;
  result: LipSyncResult;
  notes: string;              // empty string if the canonical entry has no notes
  seasonRank: number;         // chronological sort: s01..s18 → 1..18, as01..as10 → 101..110
  episodeNum: number;         // secondary chronological sort
  sequence: number;           // tertiary sort (multiple lip syncs in one episode)
};

// Wins first, ties middle, losses last — within each bucket, chronological.
const RESULT_BUCKET: Record<LipSyncResult, number> = { W: 0, T: 1, L: 2 };

function seasonRank(seasonId: string): number {
  const isAS = seasonId.startsWith('as');
  const num = parseInt(seasonId.slice(isAS ? 2 : 1), 10);
  return (isAS ? 100 : 0) + num;
}

function seasonLabel(seasonId: string): string {
  if (seasonId.startsWith('as')) return 'AS' + parseInt(seasonId.slice(2), 10);
  return 'S' + parseInt(seasonId.slice(1), 10);
}

// Cross-season name lookup. Returnees keep the same QueenId across appearances,
// so first-seen name wins (which is canonical: same drag name).
const QUEEN_NAME_MAP: Map<QueenId, string> = (() => {
  const map = new Map<QueenId, string>();
  for (const preset of SEASON_PRESETS) {
    for (const q of preset.season.queens) {
      if (!map.has(q.id)) map.set(q.id, q.name);
    }
  }
  return map;
})();

// International returnees (UK Vivienne on AS7, etc.) aren't in SEASON_PRESETS;
// fall back to the QueenId so the row still renders rather than breaking.
function queenName(id: QueenId): string {
  return QUEEN_NAME_MAP.get(id) ?? id;
}

export function getLipSyncRows(queenId: QueenId): LipSyncRow[] {
  const rows: LipSyncRow[] = [];
  for (const ls of LIP_SYNCS_CANONICAL) {
    if (ls.outcome === 'self_elimination') continue;

    const sideIdx = ls.sides.findIndex((s) => s.queens.includes(queenId));
    if (sideIdx === -1) continue;

    // Win/Loss/Tie classification.
    // Tie outcomes (double_shantay/double_sashay/tie_with_elim) flatten to 'T'
    // regardless of the winners[] shape — see the canonical-data caveat in
    // lipSyncsGraph.ts (some tie rows have empty winners[] arrays).
    const isTie =
      ls.outcome === 'double_shantay' ||
      ls.outcome === 'double_sashay' ||
      ls.outcome === 'tie_with_elim';
    let result: LipSyncResult;
    if (isTie) {
      result = 'T';
    } else {
      const winnerQueens = new Set(ls.winners.flatMap((w) => w.queens));
      const onWinningSide = ls.sides[sideIdx].queens.every((q) => winnerQueens.has(q));
      result = onWinningSide ? 'W' : 'L';
    }

    // Opponents = every queen on a side that's NOT this queen's side.
    const opponentIds: QueenId[] = [];
    for (let i = 0; i < ls.sides.length; i += 1) {
      if (i === sideIdx) continue;
      for (const q of ls.sides[i].queens) opponentIds.push(q);
    }
    let opponent: string;
    if (opponentIds.length === 0) {
      opponent = '—';
    } else if (opponentIds.length === 1) {
      opponent = `v. ${queenName(opponentIds[0])}`;
    } else {
      opponent = `v. ${queenName(opponentIds[0])} +${opponentIds.length - 1}`;
    }

    rows.push({
      episode: `${seasonLabel(ls.seasonId)}E${ls.episode}`,
      opponent,
      namedOpponentId: opponentIds[0] ?? null,
      result,
      notes: ls.notes ?? '',
      seasonRank: seasonRank(ls.seasonId),
      episodeNum: ls.episode,
      sequence: ls.sequence,
    });
  }

  rows.sort(
    (a, b) =>
      RESULT_BUCKET[a.result] - RESULT_BUCKET[b.result] ||
      a.seasonRank - b.seasonRank ||
      a.episodeNum - b.episodeNum ||
      a.sequence - b.sequence,
  );
  return rows;
}
