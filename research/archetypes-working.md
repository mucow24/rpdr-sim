# Episode Archetypes — Working Doc

## Proposed archetype list (v1, from S1-S18 clustering)

12 archetypes with concrete stat weights. Dominant stat per archetype in **bold**.

| Id | Display | Com | Imp | Act | Dan | Mus | Des | Run | **Cha** | Σ |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `snatchGame` | Snatch Game | 30 | **50** | 5 | · | · | · | · | 15 | 100 |
| `improv` | Improv Challenge | 10 | **60** | · | · | · | · | · | 30 | 100 |
| `acting` | Acting Challenge | 20 | 5 | **55** | · | · | · | · | 20 | 100 |
| `standUpRoast` | Stand-Up / Roast | **60** | 10 | · | · | · | · | · | 30 | 100 |
| `branding` | Branding / Selling | 30 | 15 | 15 | · | · | · | · | **40** | 100 |
| `ball` | Ball | · | · | · | · | · | 35 | **65** | · | 100 |
| `designChallenge` | Design Challenge | · | · | · | · | · | **75** | 25 | · | 100 |
| `makeover` | Makeover | · | · | 10 | · | · | 25 | 25 | **40** | 100 |
| `girlGroup` | Girl Group / Music Performance | 10 | · | · | 30 | **35** | · | · | 25 | 100 |
| `rusical` | Rusical | · | · | 25 | **35** | 15 | · | · | 25 | 100 |
| `dance` | Dance | · | · | 10 | **60** | 10 | · | · | 20 | 100 |
| `talentShow` | Talent Show | 11 | 11 | 11 | 11 | 11 | 11 | 11 | **20** | 97 |

### Changes from v0 (the original 12)

| Change | Reason |
|---|---|
| Merged `unconventional` + `sewing` → `designChallenge` | v0 weights were 0.99 cosine-similar. Same queens would score the same in both. |
| Merged `rdrLive` and `actingSketch` → `acting` | 0.97 cosine-similar. RDR Live is essentially an acting challenge with live flavor. |
| `girlGroup` bumps music 30→35, charisma 20→25 | Merged in pure music performance challenges (Rocker Chicks, etc.). |
| `rusical` weights now 25/35/15/25 | More dance-heavy (queens perform others' music), less music (they're not writing). |
| `dance` added (new) | 7 pure-choreography episodes were being shoehorned into girlGroup. |
| `standUpRoast`, `branding` redistributed charisma | Charisma bumped across performance archetypes. |
| Acting weight profile sharpened (com 20, imp 5, act 55, cha 20) | More purely about acting, less about joke writing. |

### Weight design principles

- **Charisma as glue stat**: modest in most archetypes (15-30), dominant only in branding + makeover, absent from pure design. Queens can coast slightly on personality in improv/performance challenges.
- **Weights sum to ~100**: treated as percentages for readability; sim normalizes at scoring time.
- **One "dominant" stat per archetype**: distinguishes what each challenge actually rewards.

## Overlap analysis

Cosine similarity check (see `archetype-overlap.py`). All pairs ≥ 0.70:

| Pair | Sim | Acceptable? |
|---|---:|---|
| snatchGame ↔ improv | 0.92 | Yes — both are improv-dominant by nature. Differentiate on comedy (30 vs 10) and charisma (15 vs 30). |
| rusical ↔ dance | 0.89 | Yes — both are dance-heavy performance. Acting (25 vs 10) differentiates. |
| standUpRoast ↔ branding | 0.86 | Yes — both reward comedy + charisma. Magnitudes flip which dominates. |
| girlGroup ↔ rusical | 0.79 | Yes — natural family resemblance. |
| girlGroup ↔ dance | 0.77 | Yes — overlap on dance + charisma. |
| makeover ↔ talentShow | 0.76 | Yes — talentShow's flat profile creates moderate overlap with everything charisma-leaning. |
| branding ↔ talentShow | 0.76 | Same as above. |
| ball ↔ designChallenge | 0.73 | Yes — both design/runway. Ball emphasizes runway (65), designChallenge emphasizes design (75). Meaningful split. |
| rusical ↔ talentShow | 0.72 | Natural overlap. |
| snatchGame ↔ branding | 0.71 | Acceptable. |
| girlGroup ↔ talentShow | 0.70 | Right at threshold. |

All top-of-threshold pairs are either expected family resemblance or accepted tradeoffs.

## Coverage

**100% of S1-S18 mainline episodes map to an archetype.** No weird list / overrides needed for historical data.

### Oddballs resolved

11 episodes that didn't obviously cluster got individually reviewed against Wikipedia, then assigned to the closest narrative+weight fit:

| Season | Episode | Archetype | Notes |
|---|---|---|---|
| S3 | Face, Face, Face of Cakes | `designChallenge` | Outfit inspired by a cake, not cake decorating. |
| S4 | Dragazines | `branding` | Magazine cover + editorial. Branding fits better than design. |
| S4 | Glamazons vs. Champions | `branding` | Team infomercials for RuPaul albums. |
| S4 | Float Your Boat | `designChallenge` | Wearable parade float styled to a pride-flag color. |
| S4 | WTF! Wrestling | `dance` | Choreographed wrestling match. Physical performance = dance. |
| S7 | Hello Kitty Girls! | `ball` | Two-look Hello Kitty ball, not a commercial. |
| S11 | Dragracadabra | `acting` | Team-written and team-performed magic show. Acting-adjacent. |
| S11 | The Draglympics | `dance` | Fanography/voguing/shablam floor performance. |
| S12 | Choices 2020 | `improv` | Presidential debate, like Shady Politics / Droop. |
| S16 | Bathroom Hunties | `designChallenge` | Room design instead of garment. Profile matches. |
| S16 | Booked & Blessed | `branding` | Memoir + interview = selling your story. |

### All Stars foreshadowing
Noted for when All Stars simulation work begins:
- **Room/space design** (Bathroom Hunties pattern) — AS has had multiple "design a club/lounge/bathroom" challenges. May want its own archetype.
- **Monologue / personal storytelling** — AS has had multiple monologue episodes. Worth tracking whether the `improv` bucket is still the right home.

## Source data

- S1-S18 episode breakdowns in `sNN-episodes.md` files
- 222 total episodes catalogued
- Clustering done by (stat1, stat2) tuple, ignoring order

## Open items for next pass

- Re-tag season data files (`src/data/*.ts`) with new archetype IDs (especially S5 which is live)
- Update `docs/stats-and-archetypes.md` with the final list and weights
- Sanity check: does each archetype have enough episodes to train stat calibration?

---

*Living artifact. Updated as decisions are made.*
