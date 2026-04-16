# Episode Archetypes — Working Doc

## Proposed archetype list (v1, from S1-S18 clustering)

14 archetypes. Additions over current v0: **RDR Live**, **Dance**. Everything else is a rename/refinement of existing categories.

| Id | Display | Core stat profile | Count | Notes |
|---|---|---|---:|---|
| `snatchGame` | Snatch Game | improv-dominant, comedy | 18 | One per season. Character impression + quick wit. |
| `improv` | Improv Challenge | improv-dominant, comedy, some charisma | ~10 | Talk shows, panels, sketch improv (not scripted). |
| `rdrLive` | RDR Live | acting + improv | 3 | Live SNL-style sketch — a hybrid of scripted + unscripted. Recurring format. |
| `actingSketch` | Acting Challenge | acting-dominant, comedy | ~28 | Scripted parodies of TV/film genres. |
| `standUpRoast` | Stand-Up / Roast | comedy-dominant, charisma | 13 | Write your own comedy material and deliver it. |
| `branding` | Branding / Selling | charisma-dominant, comedy | 11 | Pitch, sell, campaign with comedic flair. |
| `ball` | Ball | runway-dominant, design | 18 | Multi-look presentation. |
| `unconventional` | Unconventional Materials | design-dominant, runway | 14 | Construction from weird/limited materials. |
| `sewing` | Design-From-Scratch | design-dominant, runway | 7 | Single look, conventional materials. |
| `makeover` | Makeover | charisma + design | 16 | Transform a non-queen into your drag family. |
| `girlGroup` | Girl Group / Music Performance | dance + music | ~14 | Verse-writing + performance, OR group music performance. |
| `rusical` | Rusical | acting + music/dance | ~9 | Perform an assigned character in a musical. |
| `dance` | Dance | **dance-dominant**, weak-charisma | 7 | Pure choreography, no verses, no character. **NEW.** |
| `talentShow` | Talent Show | flat + charisma 20 | 8 | Queens pick their own talent. Highest-stat-sum wins. |

## Weird list (per-episode override territory)
~5% of episodes don't cluster — these get per-episode weight overrides:

| Season | Episode | Why weird |
|---|---|---|
| S3 | Face, Face, Face of Cakes | Cake decorating + presentation |
| S4 | Dragazines | Editorial/styling, no garment |
| S4 | Glamazons vs. Champions | Team parade performance |
| S4 | Float Your Boat | Boat-building + race |
| S4 | WTF! Wrestling's Trashiest Fighters | Physical wrestling character work |
| S7 | Hello, Kitty Girls! | Design + commercial hybrid |
| S11 | Dragracadabra | Magic show variety act |
| S11 | The Draglympics | Physical comedy athletics |
| S12 | Choices 2020 | Personal storytelling one-woman show |
| S16 | Bathroom Hunties | Room design, not garment |
| S16 | Booked & Blessed | Memoir + interview, charisma-heavy oddball |

### All Stars foreshadowing
A few of these point to recurring formats in All Stars that might warrant their own archetypes later:
- **Room/space design** (Bathroom Hunties) — AS has had multiple "design a club / lounge / bathroom" challenges.
- **Monologue / personal storytelling** (Choices 2020) — AS has had multiple monologue-style episodes.

All Stars work is on hold until simulation complexity (lipstick drops, Fame Games, player-eliminator twists) is addressed. Note these for then.

## Stat-pair clusters (source data from S1-S18)

| Count | Pair | Resolved to |
|---:|---|---|
| 41 | design + runway | ball / unconventional / sewing |
| 29 | comedy + improv | snatchGame / improv |
| 28 | charisma + music | talentShow / girlGroup (music perf.) |
| 27 | acting + comedy | actingSketch |
| 22 | charisma + comedy | standUpRoast / branding |
| 20 | charisma + design | makeover |
| 14 | dance + music | girlGroup / rusical |
| 9 | charisma + dance | dance (+ finales/LaLa → ignore) |
| 7 | charisma + improv | improv + branding (split) |
| 7 | acting + music | rusical |
| 4 | charisma + runway | finales (ignore) |
| 4 | acting + charisma | actingSketch / branding / weird |
| 2 | acting + dance | rusical |
| 1 | acting + improv | rdrLive |
| 1 | dance + design | (was Black Swan, retagged → dance) |
| Long tail | various | weird list |

## Decisions log

### Charisma as a "glue stat"
CHA is a boost/bonus almost everywhere, critical in only a few challenges (makeover, talent show, lip sync, branding, finale). Expect a flatter weight distribution across queens than other stats. In CHA+X clusters, X is the real differentiator.

### Why RDR Live gets its own archetype
The show has made a recurring format of it (S16, S17, S18). It's more acting-focused than pure improv (scripted sketches) but with a live/reactive element that distinguishes it from standard acting challenges.

### Why Dance gets its own archetype
7 episodes are pure choreography performance — no verse-writing (vs girl group), no character work (vs Rusical). Strong dance + weak-charisma profile is distinct enough to warrant its own bucket. Was previously shoehorned into girlGroup (per original S5 notes).

### Talent Show weights
Keep flat weights + CHA 20. "Highest stat sum, slight CHA lean" — simple and sane. Queens pick their best talent, so the strongest overall queen wins.

## Open items for next pass
- Set concrete weight values for each archetype
- Re-tag season data files with new archetype IDs (especially S5 which is live)
- Update `docs/stats-and-archetypes.md` once weights are set
- Sanity check: does each archetype have enough episodes to train stat calibration?

---

*Living artifact. Updated as decisions are made.*
