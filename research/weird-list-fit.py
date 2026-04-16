"""For each weird-list episode, draft weights and find 2 closest archetypes.

If a weird episode maps closely to an existing archetype, we can 'round down'
to that archetype rather than treating it as an override.
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

# Weird-list episodes with drafted weights
WEIRD = {
    'S3 Face Face Face of Cakes':       [ 0,  0,  0,  0,  0, 50, 15, 35],
    'S4 Dragazines':                    [ 0,  0,  0,  0,  0, 30, 40, 30],
    'S4 Glamazons vs. Champions':       [10,  0,  0, 35,  0, 20,  0, 35],
    'S4 Float Your Boat':               [20,  0,  0,  0,  0, 35, 10, 35],
    'S4 WTF! Wrestling':                [20, 20, 30,  0,  0,  0,  0, 30],
    'S7 Hello Kitty Girls!':            [ 0,  0, 25,  0,  0, 30, 20, 25],
    'S11 Dragracadabra':                [20, 20, 20,  0,  0,  0,  0, 40],
    'S11 The Draglympics':              [40,  0, 10, 25,  0,  0,  0, 25],
    'S12 Choices 2020':                 [ 0, 20, 40,  0,  0,  0,  0, 40],
    'S16 Bathroom Hunties':             [10,  0,  0,  0,  0, 55, 10, 25],
    'S16 Booked & Blessed':             [10, 20, 25,  0,  0,  0,  0, 45],
}

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    return dot / (mag_a * mag_b) if mag_a and mag_b else 0.0

labels = ['com', 'imp', 'act', 'dan', 'mus', 'des', 'run', 'cha']

print(f"{'Episode':<35} | closest (sim)           | 2nd (sim)               | verdict")
print('-' * 120)
for ep, weights in WEIRD.items():
    sims = [(cosine(weights, av), an) for an, av in ARCHETYPES.items()]
    sims.sort(reverse=True)
    top1_sim, top1_name = sims[0]
    top2_sim, top2_name = sims[1]
    verdict = 'ROUND DOWN' if top1_sim >= 0.90 else ('close-ish' if top1_sim >= 0.80 else 'true exception')
    print(f"{ep:<35} | {top1_name:<15} ({top1_sim:.2f})  | {top2_name:<15} ({top2_sim:.2f})  | {verdict}")

print()
print('Draft weights for each weird episode:')
print()
print(f"{'Episode':<35} | " + ' '.join(l.rjust(3) for l in labels))
print('-' * 80)
for ep, w in WEIRD.items():
    print(f"{ep:<35} | " + ' '.join((str(x).rjust(3) if x else '  .') for x in w))
