import { describe, test, expect } from 'vitest';
import { buildLipSyncGraph } from './lipSyncsGraph';
import { LIP_SYNCS_CANONICAL } from '../data/lipSyncsCanonical';

describe('buildLipSyncGraph', () => {
  const merged = buildLipSyncGraph(true);
  const unmerged = buildLipSyncGraph(false);

  test('returns non-empty nodes and edges in both modes', () => {
    expect(merged.nodes.length).toBeGreaterThan(0);
    expect(merged.edges.length).toBeGreaterThan(0);
    expect(unmerged.nodes.length).toBeGreaterThan(0);
    expect(unmerged.edges.length).toBeGreaterThan(0);
  });

  test('no edge connects a node to itself', () => {
    for (const e of merged.edges) expect(e.a).not.toBe(e.b);
    for (const e of unmerged.edges) expect(e.a).not.toBe(e.b);
  });

  test('edge endpoints a < b (canonical ordering)', () => {
    for (const e of merged.edges) expect(e.a < e.b).toBe(true);
    for (const e of unmerged.edges) expect(e.a < e.b).toBe(true);
  });

  test('every merged edge match.seasonId appears in both endpoints seasons[]', () => {
    const nodeById = new Map(merged.nodes.map((n) => [n.id, n]));
    for (const e of merged.edges) {
      const a = nodeById.get(e.a)!;
      const b = nodeById.get(e.b)!;
      for (const m of e.matches) {
        expect(a.seasons).toContain(m.seasonId);
        expect(b.seasons).toContain(m.seasonId);
      }
    }
  });

  test('deleted coronation rows stay deleted (s04-e13-1, s05-e12-1)', () => {
    const present = new Set(LIP_SYNCS_CANONICAL.map((r) => r.id));
    expect(present.has('s04-e13-1')).toBe(false);
    expect(present.has('s05-e12-1')).toBe(false);
  });

  test('as01-e05-1 double shantay: jujubee↔raven tie edge', () => {
    const edge = merged.edges.find(
      (e) => (e.a === 'jujubee' && e.b === 'raven') || (e.a === 'raven' && e.b === 'jujubee'),
    );
    expect(edge).toBeDefined();
    const match = edge!.matches.find((m) => m.episode.startsWith('AS01E05'));
    expect(match).toBeDefined();
    expect(match!.outcome).toBe('tie');
    expect(edge!.ties).toBeGreaterThanOrEqual(1);
  });

  test('s05-e04-1 double sashay: honey↔vivienne tie edge', () => {
    const edge = merged.edges.find(
      (e) => (e.a === 'honey' && e.b === 'vivienne') || (e.a === 'vivienne' && e.b === 'honey'),
    );
    expect(edge).toBeDefined();
    const match = edge!.matches.find((m) => m.episode.startsWith('S05E04'));
    expect(match).toBeDefined();
    expect(match!.outcome).toBe('tie');
  });

  test('as05-e08-1 LSFTC finale: shea beats jujubee and cracker; no jujubee↔cracker edge', () => {
    const findEdge = (x: string, y: string) =>
      merged.edges.find((e) => (e.a === x && e.b === y) || (e.a === y && e.b === x));

    const sheaJuju = findEdge('shea', 'jujubee');
    expect(sheaJuju).toBeDefined();
    const sjMatch = sheaJuju!.matches.find((m) => m.episode.startsWith('AS05E08'));
    expect(sjMatch).toBeDefined();
    // shea wins, so the match outcome favors whichever side shea is on.
    const sheaSide = sheaJuju!.a === 'shea' ? 'a' : 'b';
    expect(sjMatch!.outcome).toBe(sheaSide);

    const sheaCracker = findEdge('shea', 'cracker');
    expect(sheaCracker).toBeDefined();
    const scMatch = sheaCracker!.matches.find((m) => m.episode.startsWith('AS05E08'));
    expect(scMatch).toBeDefined();
    expect(scMatch!.outcome).toBe(sheaCracker!.a === 'shea' ? 'a' : 'b');

    // The two losers should NOT have an edge from this row.
    const jujuCracker = findEdge('jujubee', 'cracker');
    const jcMatchFromAS05 = jujuCracker?.matches.find((m) => m.episode.startsWith('AS05E08'));
    expect(jcMatchFromAS05).toBeUndefined();
  });

  test('s07-e12-1 top-4: winners tie among themselves, kennedy loses to all three', () => {
    const findEdge = (x: string, y: string) =>
      merged.edges.find((e) => (e.a === x && e.b === y) || (e.a === y && e.b === x));
    const winners = ['ginger', 'pearl', 'violet'];

    // Winner-winner ties.
    for (let i = 0; i < winners.length; i += 1) {
      for (let j = i + 1; j < winners.length; j += 1) {
        const edge = findEdge(winners[i], winners[j]);
        expect(edge).toBeDefined();
        const match = edge!.matches.find((m) => m.episode.startsWith('S07E12'));
        expect(match).toBeDefined();
        expect(match!.outcome).toBe('tie');
      }
    }

    // Kennedy loses to each winner.
    for (const w of winners) {
      const edge = findEdge(w, 'kennedy');
      expect(edge).toBeDefined();
      const match = edge!.matches.find((m) => m.episode.startsWith('S07E12'));
      expect(match).toBeDefined();
      // match outcome should favor the winner, not kennedy.
      const winnerSide = edge!.a === w ? 'a' : 'b';
      expect(match!.outcome).toBe(winnerSide);
    }
  });

  test('as01-e01-1 team format: chad beats mimi; pandora never gets an edge from this row', () => {
    const findEdge = (x: string, y: string) =>
      merged.edges.find((e) => (e.a === x && e.b === y) || (e.a === y && e.b === x));

    const chadMimi = findEdge('chad', 'mimi');
    expect(chadMimi).toBeDefined();
    const cmMatch = chadMimi!.matches.find((m) => m.episode.startsWith('AS01E01'));
    expect(cmMatch).toBeDefined();
    expect(cmMatch!.outcome).toBe(chadMimi!.a === 'chad' ? 'a' : 'b');

    // Pandora was in eliminated[] but not sides[] — she should never get
    // an edge from this row with anyone.
    const pandoraEdges = merged.edges.filter((e) => e.a === 'pandora' || e.b === 'pandora');
    for (const e of pandoraEdges) {
      expect(e.matches.some((m) => m.episode.startsWith('AS01E01'))).toBe(false);
    }
  });

  test('self-elimination row (as03-e06-1) contributes zero edges', () => {
    // No edge should carry an AS03E06 match.
    const hitsFromSelfElim = merged.edges.flatMap((e) =>
      e.matches.filter((m) => m.episode.startsWith('AS03E06')),
    );
    expect(hitsFromSelfElim).toHaveLength(0);
  });

  test('multi-season queen (shangela) has 2 unmerged nodes and 1 merged node with seasons.length ≥ 2', () => {
    const merged1 = merged.nodes.filter((n) => n.id === 'shangela');
    expect(merged1).toHaveLength(1);
    expect(merged1[0].seasons.length).toBeGreaterThanOrEqual(2);

    const unmergedShangela = unmerged.nodes.filter((n) => n.id.startsWith('shangela-'));
    expect(unmergedShangela.length).toBeGreaterThanOrEqual(2);
  });
});
