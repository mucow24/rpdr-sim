"""Compute cosine similarity between archetype weight vectors.

Cosine similarity measures the angle between two vectors, ignoring magnitude.
This is what matters here because the sim normalizes weights at scoring time —
[30, 50, 20] and [3, 5, 2] are effectively the same archetype.

  1.00 = identical direction (same profile)
  0.00 = orthogonal (no shared stats)

Flags pairs above threshold as potentially too-similar.
"""

import math

# Stat order: comedy, improv, acting, dance, music, design, runway, charisma
ARCHETYPES = {
    'snatchGame':      [30, 50,  5,  0,  0,  0,  0, 15],
    'improv':          [10, 60,  0,  0,  0,  0,  0, 30],
    'acting':          [20,  5, 55,  0,  0,  0,  0, 20],
    'standUpRoast':    [60, 10,  0,  0,  0,  0,  0, 30],
    'branding':        [30, 15, 15,  0,  0,  0,  0, 40],
    'ball':            [ 0,  0,  0,  0,  0, 35, 65,  0],
    'designChallenge': [ 0,  0,  0,  0,  0, 75, 25,  0],
    'makeover':        [ 0,  0, 10,  0,  0, 25, 25, 40],
    'girlGroup':       [10,  0,  0, 30, 35,  0,  0, 25],
    'rusical':         [ 0,  0, 25, 35, 15,  0,  0, 25],
    'dance':           [ 0,  0, 10, 60, 10,  0,  0, 20],
    'talentShow':      [11, 11, 11, 11, 11, 11, 11, 20],
}

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    return dot / (mag_a * mag_b) if mag_a and mag_b else 0.0

names = list(ARCHETYPES.keys())

# Full matrix
print("Cosine similarity matrix:\n")
header = "                   " + " ".join(n[:6].rjust(6) for n in names)
print(header)
for i, n1 in enumerate(names):
    row = [n1.ljust(18)]
    for j, n2 in enumerate(names):
        sim = cosine(ARCHETYPES[n1], ARCHETYPES[n2])
        if i == j:
            row.append(" 1.00 ".rjust(6))
        elif j < i:
            row.append("  .   ".rjust(6))
        else:
            row.append(f"{sim:.2f}".rjust(6))
    print(" ".join(row))

# Flag similar pairs
THRESHOLD = 0.70
print(f"\nPairs with cosine similarity >= {THRESHOLD}:\n")
pairs = []
for i, n1 in enumerate(names):
    for j, n2 in enumerate(names):
        if j <= i:
            continue
        sim = cosine(ARCHETYPES[n1], ARCHETYPES[n2])
        if sim >= THRESHOLD:
            pairs.append((sim, n1, n2))

for sim, n1, n2 in sorted(pairs, reverse=True):
    print(f"  {sim:.3f}  {n1} <-> {n2}")

# For each archetype, find its closest neighbor
print("\nClosest neighbor for each archetype:\n")
for n1 in names:
    best_sim, best = 0, None
    for n2 in names:
        if n2 == n1:
            continue
        sim = cosine(ARCHETYPES[n1], ARCHETYPES[n2])
        if sim > best_sim:
            best_sim, best = sim, n2
    print(f"  {n1.ljust(18)} -> {best.ljust(18)} ({best_sim:.3f})")
