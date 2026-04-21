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
  // "A and B" or "A & B"
  if (/\sand\s|\s&\s/.test(w) && !/^(?:only|jaymes)/i.test(w)) {
    const split = w.split(/\s+and\s+|\s*&\s*/).map(cleanName).filter(Boolean);
    const matched = split
      .map((n) => participants.find((p) => slug(p) === slug(n) || slug(p).startsWith(slug(n)) || slug(n).startsWith(slug(p))))
      .filter(Boolean);
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
  const rows = [];
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
    const winners = matchWinner(winnerRaw, participants);
    rows.push({ seasonId, episode: epRaw, song: songRaw, participants, winners });
  }
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
    // Emit pairs
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [a, b] = ids[i] < ids[j] ? [ids[i], ids[j]] : [ids[j], ids[i]];
        const key = `${a}|${b}`;
        if (!pairMap.has(key)) pairMap.set(key, { a, b, aWins: 0, bWins: 0, ties: 0, matches: [] });
        const pair = pairMap.get(key);
        const aWon = winnerIds.has(a);
        const bWon = winnerIds.has(b);
        let outcome;
        if (aWon && bWon) { pair.ties += 1; outcome = 'tie'; }
        else if (aWon) { pair.aWins += 1; outcome = 'a'; }
        else if (bWon) { pair.bWins += 1; outcome = 'b'; }
        else { pair.ties += 1; outcome = 'tie'; }
        pair.matches.push({ episode: row.episode, song: row.song, outcome });
      }
    }
  }
}

const nodes = Array.from(nodesMap.values()).sort((a, b) => a.id.localeCompare(b.id));
const edges = Array.from(pairMap.values()).sort((a, b) => a.a.localeCompare(b.a) || a.b.localeCompare(b.b));

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

export function seasonLabel(seasonId: string): string {
  if (seasonId.startsWith('as')) return 'AS' + parseInt(seasonId.slice(2), 10);
  return 'S' + parseInt(seasonId.slice(1), 10);
}

export const LIP_SYNC_NODES: LipSyncNode[] = ${JSON.stringify(nodes, null, 2)};

export const LIP_SYNC_EDGES: LipSyncEdge[] = ${JSON.stringify(edges, null, 2)};
`;

writeFileSync(OUT, ts);
console.log(`Wrote ${OUT}: ${nodes.length} nodes, ${edges.length} edges`);
if (warnings.length) {
  console.log('\nWARNINGS:');
  for (const w of warnings) console.log(' - ' + w);
}
