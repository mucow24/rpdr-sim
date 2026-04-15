# Episode Archetypes — Working Doc

## Current 12 (v0, penciled in)

| Id | Display | Primary stats |
|---|---|---|
| `snatchGame` | Snatch Game | improv 50, comedy 30 |
| `rusical` | Rusical | dance 40, acting 25, charisma 20 |
| `girlGroup` | Girl Group / Music Video | dance 45, music 30 |
| `actingSketch` | Acting Challenge | acting 40, comedy 35 |
| `improv` | Improv Challenge | improv 60, comedy 25 |
| `standUpRoast` | Stand-Up / Roast | comedy 55, charisma 30 |
| `unconventional` | Unconventional Materials | design 70, runway 30 |
| `sewing` | Design-From-Scratch | design 80, runway 20 |
| `ball` | Ball | runway 60, design 40 |
| `makeover` | Makeover | charisma 40, design 25, runway 25 |
| `branding` | Branding / Infomercial | comedy 35, charisma 30, acting 20 |
| `talentShow` | Talent Show *(placeholder)* | flat + charisma 20 |

## Known gaps (from S5 data)

- Pure dance challenge — shoehorned into `girlGroup`
- Gospel/singing challenge — shoehorned into `girlGroup`

## Design constraints

- Each archetype = weighted mix over 8 base stats
- Weights are normalized at scoring time (don't need to sum to 100)
- Per-episode weight overrides exist as an escape hatch
- Goal: every real RPDR challenge type should map cleanly to an archetype

## Open questions

- What's the right granularity? (e.g., is `unconventional` vs `sewing` worth separating?)
- Are there challenge types from other seasons that don't fit any of the 12?
- ~~Should talentShow get special-case scoring or just better weights?~~ **Decision: keep flat weights + CHA 20. "Highest stat sum, slight CHA lean" — simple and sane.**
- How to handle hybrid challenges (e.g., design + comedy)?

---

*This file is a living artifact for the archetype redesign. Updated as decisions are made.*
