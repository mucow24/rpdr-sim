// Derives the Lip Syncs tab's graph (nodes + edges) from the canonical
// lip-sync dataset. This is a lip-sync-performance graph, not an elimination
// graph — `for_the_win` rows count toward aWins/bWins even though nobody was
// eliminated, because the graph is about who beat whom in a performance.
//
// Known canonical data issues tolerated here (to be addressed in a
// sanitization pass):
//   - Some rows have `outcome: "double_shantay"` with `winners: []` and a
//     non-empty `eliminated` (e.g., s11-e09-1). The derivation treats all
//     tie-outcomes as ties regardless of winners shape.
//   - International returnees on AS seasons (The Vivienne from UK on AS7,
//     Jimbo from Canada on AS8, etc.) have QueenIds that don't appear in
//     SEASON_PRESETS. We fall back to using the QueenId as display name
//     rather than throwing, so the graph still renders their matchups.
import { LIP_SYNCS_CANONICAL, type LipSync, type QueenId } from '../data/lipSyncsCanonical';
import { SEASON_PRESETS } from '../data/presets';

export type LipSyncNode = {
  id: string;
  name: string;
  seasonId: string;
  seasons: string[];
};

export type LipSyncMatch = {
  episode: string;
  song: string;
  outcome: 'a' | 'b' | 'tie';
  seasonId: string;
};

export type LipSyncEdge = {
  a: string;
  b: string;
  aWins: number;
  bWins: number;
  ties: number;
  matches: LipSyncMatch[];
};

export function seasonLabel(seasonId: string): string {
  if (seasonId.startsWith('as')) return 'AS' + parseInt(seasonId.slice(2), 10);
  return 'S' + parseInt(seasonId.slice(1), 10);
}

// Chronological rank: s01..s18 → 1..18, as01..as10 → 101..110. Used so a
// returning queen's merged "home season" reflects her actual debut order.
function seasonRank(seasonId: string): number {
  const isAS = seasonId.startsWith('as');
  const num = parseInt(seasonId.slice(isAS ? 2 : 1), 10);
  return (isAS ? 100 : 0) + num;
}

type QueenMeta = { name: string; color: string };

function buildQueenMap(): Map<QueenId, QueenMeta> {
  const map = new Map<QueenId, QueenMeta>();
  for (const preset of SEASON_PRESETS) {
    for (const queen of preset.season.queens) {
      if (!map.has(queen.id)) {
        map.set(queen.id, { name: queen.name, color: queen.color });
      }
    }
  }
  return map;
}

const QUEEN_MAP = buildQueenMap();

// Default visuals for queens not found in SEASON_PRESETS (international
// returnees). Name falls back to the QueenId so the user can still identify
// them; color is a neutral gray.
const FALLBACK_COLOR = '#888888';

function lookupQueen(queenId: QueenId): QueenMeta {
  return QUEEN_MAP.get(queenId) ?? { name: queenId, color: FALLBACK_COLOR };
}

function formatEpisode(row: LipSync): string {
  const ep = `${row.seasonId.toUpperCase()}E${row.episode.toString().padStart(2, '0')}`;
  return row.episodeLabel ? `${ep} (${row.episodeLabel})` : ep;
}

function songText(row: LipSync): string {
  return row.song.title ?? row.song.raw ?? 'Unknown song';
}

type AnnotatedSide = { queens: QueenId[]; won: boolean };

function annotateSides(row: LipSync): AnnotatedSide[] {
  const winnerQueens = new Set(row.winners.flatMap((w) => w.queens));
  return row.sides.map((s) => ({
    queens: s.queens,
    won: s.queens.every((q) => winnerQueens.has(q)),
  }));
}

type PairVerdict = 'a-wins' | 'b-wins' | 'tie' | 'skip';

// Multi-way loser-vs-loser pairs are intentionally skipped: a third party beat
// them both, so their relative ranking is undefined. Matches the old parser.
function pairVerdict(row: LipSync, a: AnnotatedSide, b: AnnotatedSide): PairVerdict {
  if (row.outcome === 'double_shantay' || row.outcome === 'double_sashay' || row.outcome === 'tie_with_elim') {
    return 'tie';
  }
  if (a.won && b.won) return 'tie';
  if (a.won && !b.won) return 'a-wins';
  if (!a.won && b.won) return 'b-wins';
  return 'skip';
}

export function buildLipSyncGraph(merged: boolean): { nodes: LipSyncNode[]; edges: LipSyncEdge[] } {
  const edges = new Map<string, LipSyncEdge>();
  // Seasons observed per queen from sides[] (NOT eliminated[] — AS1 team
  // partners appear in eliminated without ever lip-syncing themselves).
  const seasonsByQueen = new Map<QueenId, Set<string>>();

  // Non-merged node id encodes the appearance season, NOT the queen's origin
  // season. A returnee gets one node per AS appearance plus her main-season
  // node. Merged collapses all appearances to a single node.
  const nodeIdFor = (q: QueenId, seasonId: string) => (merged ? q : `${q}-${seasonId}`);

  for (const row of LIP_SYNCS_CANONICAL) {
    if (row.outcome === 'self_elimination' || row.flags.includes('self_elimination')) {
      continue;
    }

    if (row.sides.length < 2) {
      throw new Error(`lipSyncsGraph: row ${row.id} has only ${row.sides.length} side(s); need ≥2.`);
    }
    for (const side of row.sides) {
      for (const q of side.queens) {
        if (!seasonsByQueen.has(q)) seasonsByQueen.set(q, new Set());
        seasonsByQueen.get(q)!.add(row.seasonId);
      }
    }

    const annotated = annotateSides(row);

    for (let i = 0; i < annotated.length; i += 1) {
      for (let j = i + 1; j < annotated.length; j += 1) {
        const verdict = pairVerdict(row, annotated[i], annotated[j]);
        if (verdict === 'skip') continue;

        for (const qa of annotated[i].queens) {
          for (const qb of annotated[j].queens) {
            const idA = nodeIdFor(qa, row.seasonId);
            const idB = nodeIdFor(qb, row.seasonId);
            if (idA === idB) continue;

            const [lo, hi] = idA < idB ? [idA, idB] : [idB, idA];
            const swapped = idA !== lo;

            const pairKey = `${lo}|${hi}`;
            let edge = edges.get(pairKey);
            if (!edge) {
              edge = { a: lo, b: hi, aWins: 0, bWins: 0, ties: 0, matches: [] };
              edges.set(pairKey, edge);
            }

            let matchOutcome: 'a' | 'b' | 'tie';
            if (verdict === 'tie') matchOutcome = 'tie';
            else if (verdict === 'a-wins') matchOutcome = swapped ? 'b' : 'a';
            else matchOutcome = swapped ? 'a' : 'b';

            if (matchOutcome === 'tie') {
              edge.aWins += 1;
              edge.bWins += 1;
              edge.ties += 1;
            } else if (matchOutcome === 'a') {
              edge.aWins += 1;
            } else {
              edge.bWins += 1;
            }

            edge.matches.push({
              episode: formatEpisode(row),
              song: songText(row),
              outcome: matchOutcome,
              seasonId: row.seasonId,
            });
          }
        }
      }
    }
  }

  const nodes: LipSyncNode[] = [];
  if (merged) {
    for (const [queenId, seasons] of seasonsByQueen) {
      const meta = lookupQueen(queenId);
      const sorted = [...seasons].sort((a, b) => seasonRank(a) - seasonRank(b));
      nodes.push({
        id: queenId,
        name: meta.name,
        seasonId: sorted[0],
        seasons: sorted,
      });
    }
  } else {
    for (const [queenId, seasons] of seasonsByQueen) {
      const meta = lookupQueen(queenId);
      for (const seasonId of seasons) {
        nodes.push({
          id: `${queenId}-${seasonId}`,
          name: meta.name,
          seasonId,
          seasons: [seasonId],
        });
      }
    }
  }

  nodes.sort((a, b) => {
    const na = a.name.toLowerCase();
    const nb = b.name.toLowerCase();
    if (na < nb) return -1;
    if (na > nb) return 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  return { nodes, edges: [...edges.values()] };
}
