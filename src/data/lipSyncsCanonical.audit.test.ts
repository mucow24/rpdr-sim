// Diagnostic audit of lipSyncsCanonical.ts against the sanitization spec.
// Fails with a full violation report so we can see every issue at once.
// This file is intended to stay as a permanent regression guard once the
// canonical data is clean, but for now it surfaces all existing bugs.

import { test } from 'vitest';
import { LIP_SYNCS_CANONICAL, type LipSync } from './lipSyncsCanonical';

type Violation = { rowId: string; rule: string; detail: string };

function auditCanonical(): Violation[] {
  const violations: Violation[] = [];
  const seenIds = new Set<string>();
  const seenSequences = new Map<string, number[]>();

  for (const row of LIP_SYNCS_CANONICAL) {
    const v = (rule: string, detail: string) => {
      violations.push({ rowId: row.id, rule, detail });
    };

    // Universal: unique row IDs
    if (seenIds.has(row.id)) v('unique_row_id', 'duplicate id');
    seenIds.add(row.id);

    // Universal: verified: true
    if (!row.verified) v('verified', `verified is ${row.verified}`);

    // Universal: sides.length >= 2
    if (row.sides.length < 2) {
      v('sides_min', `sides.length=${row.sides.length}`);
      continue;
    }

    // Universal: no duplicate queen IDs within a single queens[] list
    for (let i = 0; i < row.sides.length; i += 1) {
      const qs = row.sides[i].queens;
      if (new Set(qs).size !== qs.length) {
        v('duplicate_in_side', `side ${i}: [${qs.join(', ')}]`);
      }
    }

    // Universal: no queen in two different sides
    const sideQueens = row.sides.flatMap((s) => s.queens);
    const sideQueenSet = new Set(sideQueens);
    if (sideQueenSet.size !== sideQueens.length) {
      const dups = [...new Set(sideQueens.filter((q, i) => sideQueens.indexOf(q) !== i))];
      v('queen_in_multiple_sides', `duplicated across sides: ${dups.join(', ')}`);
    }

    const winnerQueens = row.winners.flatMap((w) => w.queens);
    const winnerQueenSet = new Set(winnerQueens);
    const elimQueens = row.eliminated.flatMap((e) => e.queens);
    const elimQueenSet = new Set(elimQueens);

    // Universal: every queen in winners must appear in sides
    for (const q of winnerQueenSet) {
      if (!sideQueenSet.has(q)) {
        v('winner_not_in_sides', `queen "${q}" in winners but not in sides`);
      }
    }

    // Universal: no queen in both winners AND eliminated, except self_elimination
    const overlap = [...winnerQueenSet].filter((q) => elimQueenSet.has(q));
    if (row.outcome === 'self_elimination') {
      if (overlap.length === 0) {
        v('self_elim_missing_overlap', 'self_elimination but no queen in both winners and eliminated');
      }
    } else {
      for (const q of overlap) {
        v('winner_and_elim_overlap', `queen "${q}" in both winners and eliminated`);
      }
    }

    // Universal: eliminated ⊆ sides.queens, except for specific types/outcomes.
    // `lalaparuza` bracket-final rows bulk-record the whole bracket's losers
    // in `eliminated`, even though only two queens lip-synced in that row.
    const elimOutsideAllowed =
      row.type === 'team' ||
      row.type === 'legacy' ||
      row.type === 'assassin' ||
      row.type === 'lalaparuza' ||
      row.outcome === 'tie_with_elim';
    if (!elimOutsideAllowed) {
      for (const q of elimQueenSet) {
        if (!sideQueenSet.has(q)) {
          v(
            'elim_outside_sides',
            `queen "${q}" in eliminated but not in sides (type=${row.type}, outcome=${row.outcome})`,
          );
        }
      }
    }

    // Sequence contiguity tracking (evaluated after the loop)
    const groupKey = `${row.seasonId}|${row.episode}|${row.bracket ?? ''}|${row.round ?? ''}`;
    if (!seenSequences.has(groupKey)) seenSequences.set(groupKey, []);
    seenSequences.get(groupKey)!.push(row.sequence);

    // Outcome-specific
    switch (row.outcome) {
      case 'single_winner':
        if (row.winners.length !== 1) {
          v('single_winner.winners_count', `winners.length=${row.winners.length}, expected 1`);
        }
        break;

      case 'double_shantay':
        if (row.winners.length !== 2) {
          v('double_shantay.winners_count', `winners.length=${row.winners.length}, expected 2`);
        } else {
          const a = new Set(row.winners[0].queens);
          const b = new Set(row.winners[1].queens);
          for (const q of a) {
            if (b.has(q)) v('double_shantay.winners_overlap', `queen "${q}" in both winner sides`);
          }
        }
        if (row.eliminated.length !== 0) {
          v('double_shantay.eliminated_nonempty', `eliminated.length=${row.eliminated.length}, expected 0`);
        }
        break;

      case 'multi_advance':
        if (row.winners.length < 1) {
          v('multi_advance.winners_count', `winners.length=${row.winners.length}, expected >=1`);
        }
        if (row.sides.length < 3) {
          v('multi_advance.sides_count', `sides.length=${row.sides.length}, expected >=3`);
        }
        break;

      case 'tie_with_elim':
        if (row.winners.length !== 2) {
          v('tie_with_elim.winners_count', `winners.length=${row.winners.length}, expected 2`);
        } else {
          const a = new Set(row.winners[0].queens);
          const b = new Set(row.winners[1].queens);
          for (const q of a) {
            if (b.has(q)) v('tie_with_elim.winners_overlap', `queen "${q}" in both winner sides`);
          }
        }
        if (row.eliminated.length !== 1 || (row.eliminated[0]?.queens.length ?? 0) !== 1) {
          v(
            'tie_with_elim.eliminated_shape',
            `eliminated=${row.eliminated.length} side(s), first side queens=${row.eliminated[0]?.queens.length ?? 0}; expected 1/1`,
          );
        } else {
          const elimQ = row.eliminated[0].queens[0];
          if (sideQueenSet.has(elimQ)) {
            v('tie_with_elim.elim_in_sides', `elim queen "${elimQ}" appears in sides`);
          }
        }
        break;

      case 'double_sashay':
        if (row.winners.length !== 0) {
          v('double_sashay.winners_nonempty', `winners.length=${row.winners.length}, expected 0`);
        }
        if (row.eliminated.length !== 2) {
          v('double_sashay.eliminated_count', `eliminated.length=${row.eliminated.length}, expected 2`);
        } else {
          for (let i = 0; i < 2; i += 1) {
            if (row.eliminated[i].queens.length !== 1) {
              v(
                'double_sashay.elim_side_shape',
                `elim side ${i} has ${row.eliminated[i].queens.length} queens, expected 1`,
              );
            }
          }
        }
        break;

      case 'self_elimination':
        if (row.winners.length < 1) v('self_elim.winners_empty', 'winners is empty');
        if (row.eliminated.length < 1) v('self_elim.eliminated_empty', 'eliminated is empty');
        break;
    }
  }

  // Sequence contiguity per (seasonId, episode, bracket, round)
  for (const [groupKey, seqs] of seenSequences) {
    const sorted = [...seqs].sort((a, b) => a - b);
    // Check 1-indexed + contiguous
    for (let i = 0; i < sorted.length; i += 1) {
      if (sorted[i] !== i + 1) {
        violations.push({
          rowId: `<group ${groupKey}>`,
          rule: 'sequence_non_contiguous',
          detail: `got sequences [${sorted.join(', ')}], expected [1..${sorted.length}]`,
        });
        break;
      }
    }
  }

  return violations;
}

test('canonical data audit', () => {
  const violations = auditCanonical();
  if (violations.length === 0) return;

  const byRule = new Map<string, Violation[]>();
  for (const v of violations) {
    if (!byRule.has(v.rule)) byRule.set(v.rule, []);
    byRule.get(v.rule)!.push(v);
  }
  const sortedRules = [...byRule.entries()].sort((a, b) => b[1].length - a[1].length);
  const lines: string[] = [
    `\n${violations.length} violation(s) found across ${byRule.size} rule(s):\n`,
  ];
  for (const [rule, vs] of sortedRules) {
    lines.push(`  [${rule}]  ×${vs.length}`);
    for (const vv of vs) {
      lines.push(`    - ${vv.rowId}: ${vv.detail}`);
    }
    lines.push('');
  }
  throw new Error(lines.join('\n'));
});
