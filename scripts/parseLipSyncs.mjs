// Parses research/lip_syncs/*.md into src/data/lipSyncs.ts.
// Run with: node scripts/parseLipSyncs.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LS_DIR = join(ROOT, 'research', 'lip_syncs');
const OUT = join(ROOT, 'src', 'data', 'lipSyncs.ts');

function slug(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function seasonFromFile(name) {
  const m = name.match(/^lip_sync_(s|as)(\d+)\.md$/);
  if (!m) return null;
  const pad = m[2].padStart(2, '0');
  return m[1] + pad; // s01, as05
}

function seasonLabel(id) {
  if (id.startsWith('as')) return 'AS' + parseInt(id.slice(2), 10);
  return 'S' + parseInt(id.slice(1), 10);
}

// Strip parentheticals AFTER names, e.g. "India Ferrah (top)" -> "India Ferrah".
// Keep apostrophes / accents — handled by slug().
function cleanName(s) {
  return s
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Split a "X vs Y [vs Z]" string into participants. Returns [] if not a pairing.
function splitParticipants(raw) {
  const cleaned = raw.trim();
  if (!cleaned) return [];
  // Skip non-pairings: "Kalorie (solo)", "group", "Crystal, Gigi, Jaida (group)" etc.
  if (/\(solo\)|\(alone\)|\(group\)|\(returning queens\)/i.test(cleaned)) return [];
  if (/^—+$/.test(cleaned)) return [];
  // Split on " vs " or " vs. " (case-insensitive).
  const parts = cleaned
    .split(/\s+vs\.?\s+/i)
    .map(cleanName)
    .filter((n) => n && !/^—+$/.test(n) && /[a-zA-Z]/.test(n));
  if (parts.length < 2) return [];
  return parts;
}

// Match a winner string to participants. Returns an array of participant names
// that won, or 'all' for ties, or [] for none.
function matchWinner(winnerRaw, participants) {
  const w = cleanName(winnerRaw).trim();
  if (!w) return [];
  const lc = w.toLowerCase();
  // No-winner phrasing (treat as tie / both-sides-gray, handled by empty return).
  if (/^(neither|none\b|no\b)/.test(lc)) return [];
  if (
    /^(double shantay|both|tie|n\/a|advanced)\b/.test(lc) ||
    /\b(both won|both saved|double win|joint decision|double shantay|\btie\b)/.test(lc)
  ) {
    return participants.slice(); // all won / tie
  }
  // Helper: match a single queen name to a participant (strict fuzzy — must
  // share a full name token boundary so "Darienne" doesn't match as "Darienne
  // eliminated" via loose prefix.)
  const matchOne = (name) => {
    const ns = slug(name);
    if (!ns) return null;
    return (
      participants.find((p) => slug(p) === ns) ||
      participants.find((p) => slug(p).startsWith(ns + '-')) ||
      participants.find((p) => ns.startsWith(slug(p) + '-'))
    );
  };
  const splitNames = (s) => s.split(/\s*,\s*|\s+and\s+|\s*&\s*/).map(cleanName).filter(Boolean);

  // "X[, Y[, Z]] eliminated/sashay/out" — losers named; winners are the rest.
  const elimMatch = w.match(/^(.+?)\s+(eliminated|sashay(?:ed)?|out|boot(?:ed)?)\b/i);
  if (elimMatch) {
    const losers = splitNames(elimMatch[1]).map(matchOne).filter(Boolean);
    if (losers.length > 0 && losers.length < participants.length) {
      const loserSet = new Set(losers.map((p) => slug(p)));
      return participants.filter((p) => !loserSet.has(slug(p)));
    }
  }

  // "X[, Y[, Z]] advance[d|s]" or "...win/won/saved" — winners named explicitly.
  const advMatch = w.match(/^(.+?)\s+(advance[ds]?|saved|won|win|wins)\b/i);
  if (advMatch) {
    const winners = splitNames(advMatch[1]).map(matchOne).filter(Boolean);
    if (winners.length >= 1) return winners;
  }

  // Comma- / "and"- / "&"-separated multi-winner list without a trailing verb.
  if (/\sand\s|\s&\s|,/.test(w) && !/^(?:only|jaymes)/i.test(w)) {
    const matched = splitNames(w).map(matchOne).filter(Boolean);
    if (matched.length >= 2) return matched;
  }

  // Single winner — find best participant match.
  const ws = slug(w);
  const hit = participants.find((p) => slug(p) === ws)
    || participants.find((p) => slug(p).startsWith(ws + '-') || slug(p).startsWith(ws))
    || participants.find((p) => ws.startsWith(slug(p) + '-') || ws.startsWith(slug(p)))
    || participants.find((p) => slug(p).split('-').includes(ws))
    || participants.find((p) => slug(p).includes(ws));
  return hit ? [hit] : [];
}

function parseFile(path, filename) {
  const seasonId = seasonFromFile(filename);
  if (!seasonId) return { seasonId: null, rows: [] };
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  const rawRows = [];
  let cols = null; // column index map for current table
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      cols = null;
      continue;
    }
    const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
    // Separator: all cells like "---"
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;
    // Header: includes "Queens" and "Winner"
    const lowerCells = cells.map((c) => c.toLowerCase());
    const qIdx = lowerCells.indexOf('queens');
    const wIdx = lowerCells.indexOf('winner');
    if (qIdx !== -1 && wIdx !== -1) {
      cols = { q: qIdx, w: wIdx, ep: lowerCells.findIndex((c) => c === 'ep' || c === 'round' || c === 'stage'), song: lowerCells.indexOf('song') };
      continue;
    }
    if (!cols) continue;
    const queensRaw = cells[cols.q];
    const winnerRaw = cells[cols.w];
    const epRaw = cols.ep >= 0 ? cells[cols.ep] : '';
    const songRaw = cols.song >= 0 ? cells[cols.song] : '';
    const participants = splitParticipants(queensRaw);
    if (participants.length < 2) continue;
    rawRows.push({ seasonId, episode: epRaw, song: songRaw, participants, winnerRaw });
  }

  // Some rows use short forms ("Bob", "Darienne") in later episodes while
  // earlier rows use the full name ("Bob the Drag Queen", "Darienne Lake").
  // Canonicalize each short name to the longest matching full name seen in
  // the same file so we don't emit duplicate per-season nodes.
  const allNames = new Set();
  for (const r of rawRows) r.participants.forEach((n) => allNames.add(n));
  const canonicalize = (name) => {
    const ns = slug(name);
    let best = name;
    let bestLen = ns.length;
    for (const other of allNames) {
      const os = slug(other);
      if (os.startsWith(ns + '-') && os.length > bestLen) {
        best = other;
        bestLen = os.length;
      }
    }
    return best;
  };

  const rows = rawRows.map((r) => {
    const participants = r.participants.map(canonicalize);
    const winners = matchWinner(r.winnerRaw, participants);
    return { seasonId: r.seasonId, episode: r.episode, song: r.song, participants, winners };
  });

  return { seasonId, rows };
}

const files = readdirSync(LS_DIR).filter((f) => f.endsWith('.md')).sort();

const nodesMap = new Map(); // id -> { id, name, seasonId }
const pairMap = new Map(); // key -> { a, b, aWins, bWins, ties, matches: [] }

const warnings = [];

for (const f of files) {
  const { seasonId, rows } = parseFile(join(LS_DIR, f), f);
  if (!seasonId) { warnings.push(`SKIP filename ${f}`); continue; }
  for (const row of rows) {
    const ids = row.participants.map((n) => `${slug(n)}-${seasonId}`);
    row.participants.forEach((n, i) => {
      const id = ids[i];
      if (!nodesMap.has(id)) nodesMap.set(id, { id, name: n, seasonId });
    });
    const winnerIds = new Set(row.winners.map((n) => `${slug(n)}-${seasonId}`));
    if (row.winners.length === 0) warnings.push(`No winner match in ${seasonId} ep ${row.episode}: "${row.participants.join(' | ')}" winner?`);
    // Emit pairs.
    //   - In 3+ way matches with a declared winner: only emit winner↔loser
    //     pairs. Loser-loser pairs never head-to-head'd. Winner-winner pairs
    //     didn't either — they just all advanced past the eliminated queen
    //     (e.g. S8 ep 9 "Bob, Kim Chi, Naomi advance"), so marking them as
    //     mutual ties wrongly credits each other with a win.
    //   - "Both won" ties in 2-way matches (S5 Whip My Hair double save)
    //     legitimately count as a win for both sides so the edge renders
    //     gold-gold.
    //   - No-winner matches (double sashay / uncrowned finale) stay as true
    //     gray-gray ties.
    const isMultiway = ids.length >= 3;
    const hasWinner = winnerIds.size > 0;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [a, b] = ids[i] < ids[j] ? [ids[i], ids[j]] : [ids[j], ids[i]];
        const aWon = winnerIds.has(a);
        const bWon = winnerIds.has(b);
        if (isMultiway && hasWinner && (aWon === bWon)) continue;
        const key = `${a}|${b}`;
        if (!pairMap.has(key)) pairMap.set(key, { a, b, aWins: 0, bWins: 0, ties: 0, matches: [] });
        const pair = pairMap.get(key);
        let outcome;
        if (aWon && bWon) {
          pair.aWins += 1; pair.bWins += 1; pair.ties += 1; outcome = 'tie';
        } else if (aWon) { pair.aWins += 1; outcome = 'a'; }
        else if (bWon) { pair.bWins += 1; outcome = 'b'; }
        else { pair.ties += 1; outcome = 'tie'; }
        pair.matches.push({ episode: row.episode, song: row.song, outcome });
      }
    }
  }
}

const nodes = Array.from(nodesMap.values()).sort((a, b) => a.id.localeCompare(b.id));
const edges = Array.from(pairMap.values()).sort((a, b) => a.a.localeCompare(b.a) || a.b.localeCompare(b.b));

// Build a merged dataset: one node per queen slug (regardless of season).
// Edges are keyed by slug-pair and combine wins/losses across all matchups.
const SEASON_ORDER = [
  's01','s02','s03','s04','s05','s06','s07','s08','s09',
  's10','s11','s12','s13','s14','s15','s16','s17','s18',
  'as01','as02','as03','as04','as05','as06','as07','as08','as09','as10',
];
function seasonRank(id) { const i = SEASON_ORDER.indexOf(id); return i < 0 ? 999 : i; }
function stripSeason(id) { return id.replace(/-(s|as)\d{2}$/, ''); }

const mergedNodesMap = new Map(); // slug -> { id, name, firstSeasonId, seasons: [] }
for (const n of nodes) {
  const slugId = stripSeason(n.id);
  const existing = mergedNodesMap.get(slugId);
  if (!existing) {
    mergedNodesMap.set(slugId, { id: slugId, name: n.name, firstSeasonId: n.seasonId, seasons: [n.seasonId] });
  } else {
    existing.seasons.push(n.seasonId);
    if (seasonRank(n.seasonId) < seasonRank(existing.firstSeasonId)) {
      existing.firstSeasonId = n.seasonId;
    }
  }
}
for (const m of mergedNodesMap.values()) {
  m.seasons.sort((a, b) => seasonRank(a) - seasonRank(b));
}

const mergedPairMap = new Map(); // key -> { a, b, aWins, bWins, ties, matches: [] }
for (const e of edges) {
  const aSlug = stripSeason(e.a);
  const bSlug = stripSeason(e.b);
  const [a, b, flipped] = aSlug < bSlug ? [aSlug, bSlug, false] : [bSlug, aSlug, true];
  const key = `${a}|${b}`;
  if (!mergedPairMap.has(key)) mergedPairMap.set(key, { a, b, aWins: 0, bWins: 0, ties: 0, matches: [] });
  const pair = mergedPairMap.get(key);
  // If slugs were swapped, swap aWins/bWins and remap outcomes.
  pair.aWins += flipped ? e.bWins : e.aWins;
  pair.bWins += flipped ? e.aWins : e.bWins;
  pair.ties += e.ties;
  const edgeSeasonMatch = e.a.match(/-((?:s|as)\d{2})$/);
  const edgeSeasonId = edgeSeasonMatch ? edgeSeasonMatch[1] : '';
  for (const m of e.matches) {
    const outcome = flipped
      ? (m.outcome === 'a' ? 'b' : m.outcome === 'b' ? 'a' : 'tie')
      : m.outcome;
    pair.matches.push({ episode: m.episode, song: m.song, outcome, seasonId: edgeSeasonId });
  }
}

const mergedNodes = Array.from(mergedNodesMap.values())
  .map((m) => ({ id: m.id, name: m.name, seasonId: m.firstSeasonId, seasons: m.seasons }))
  .sort((a, b) => a.id.localeCompare(b.id));
const mergedEdges = Array.from(mergedPairMap.values())
  .sort((a, b) => a.a.localeCompare(b.a) || a.b.localeCompare(b.b));

const ts = `// AUTO-GENERATED by scripts/parseLipSyncs.mjs — do not edit by hand.
// Sources: research/lip_syncs/*.md
export type LipSyncQueenId = string;

export type LipSyncNode = {
  id: LipSyncQueenId;
  name: string;
  seasonId: string; // e.g. "s02", "as05"
};

export type LipSyncMatch = {
  episode: string;
  song: string;
  outcome: 'a' | 'b' | 'tie';
};

export type LipSyncEdge = {
  a: LipSyncQueenId;
  b: LipSyncQueenId;
  aWins: number;
  bWins: number;
  ties: number;
  matches: LipSyncMatch[];
};

export type LipSyncNodeMerged = {
  id: LipSyncQueenId; // slug only, no season suffix
  name: string;
  seasonId: string; // first (earliest) season this queen appeared
  seasons: string[]; // all seasons this queen appeared in
};

export type LipSyncMatchMerged = {
  episode: string;
  song: string;
  outcome: 'a' | 'b' | 'tie';
  seasonId: string; // season this particular matchup happened in
};

export type LipSyncEdgeMerged = {
  a: LipSyncQueenId;
  b: LipSyncQueenId;
  aWins: number;
  bWins: number;
  ties: number;
  matches: LipSyncMatchMerged[];
};

export function seasonLabel(seasonId: string): string {
  if (seasonId.startsWith('as')) return 'AS' + parseInt(seasonId.slice(2), 10);
  return 'S' + parseInt(seasonId.slice(1), 10);
}

export const LIP_SYNC_NODES: LipSyncNode[] = ${JSON.stringify(nodes, null, 2)};

export const LIP_SYNC_EDGES: LipSyncEdge[] = ${JSON.stringify(edges, null, 2)};

export const LIP_SYNC_NODES_MERGED: LipSyncNodeMerged[] = ${JSON.stringify(mergedNodes, null, 2)};

export const LIP_SYNC_EDGES_MERGED: LipSyncEdgeMerged[] = ${JSON.stringify(mergedEdges, null, 2)};
`;

writeFileSync(OUT, ts);
console.log(`Wrote ${OUT}: ${nodes.length} nodes, ${edges.length} edges (merged: ${mergedNodes.length} nodes, ${mergedEdges.length} edges)`);
if (warnings.length) {
  console.log('\nWARNINGS:');
  for (const w of warnings) console.log(' - ' + w);
}
