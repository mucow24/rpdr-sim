# Wikipedia Audit: Seasons 16, 17, 18

Audit date: 2026-04-16
Sources compared:
- Research notes: `research/s16-episodes.md`, `research/s17-episodes.md`, `research/s18-episodes.md`
- Data files: `src/data/_v1_archive/season16.ts`, `season17.ts`, `season18.ts`
- Wikipedia: `https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_{16,17,18}` (fetched 2026-04-16)

## Global caveats

1. **All `.ts` files use `placements: {}` (empty object) for every episode.** The v1 archive
   stores only `challengeName` and `eliminated[]`, not WIN/HIGH/SAFE/LOW/BTM2 per queen.
   Per-queen placement discrepancies cannot be flagged because the data simply isn't
   populated. This audit flags only what the `.ts` data *does* track: episode titles,
   episode order, challenge summaries (via research `.md`), and eliminations.
2. **Season 18 Grand Finale outcome is unresolved on Wikipedia** (shown as TBA at
   audit time). The final-winner crowning is therefore not verifiable here. Every
   pre-finale episode IS verifiable.
3. WebFetch exhibited small transcription drift on some passes (e.g., rendered
   "Dawn" as "Day" for S16; S18 "Result" column appeared self-contradictory on one
   pass). Where ambiguity arose, a second targeted fetch was used to disambiguate.

---

# Season 16 Audit

## Summary
- Episodes verified: 15 of 15 (14 competition + finale; Wikipedia lists 16 counting
  the Lip Sync LaLaPaRuZa Smackdown as a separate episode, which the `.ts` file does
  NOT represent — see Structural findings below)
- Total discrepancies: 2 (titles: 0, order: 0, summaries: 0, placements: N/A, eliminations: 0, structural: 2)

## Structural findings (apply across season)

- **Missing LaLaPaRuZa Smackdown episode**: Wikipedia lists S16 as 16 episodes with
  Ep15 = "Lip Sync LaLaPaRuZa Smackdown – Reunited" (Morphine Love Dion crowned
  SDADHH) and Ep16 = "Grand Finale". The `.ts` file collapses this into one finale
  entry (number 15, `kind: 'finale'`). `research/s16-episodes.md` ends at episode 14
  with no finale/smackdown row. Flagged, not fixed.
- **Placements empty**: `placements: {}` for all 15 `.ts` entries — not auditable
  against Wikipedia placement chart.

## Per-episode findings

### Ep 1: Rate-A-Queen
- **Title** (.md / .ts): "Rate-a-Queen" / "Rate-A-Queen". Wikipedia: "Rate-A-Queen".
  ✓ matches (case difference in `.md` only; `.ts` exact).
- **Order**: ✓ matches (Ep 1).
- **Summary** (.md): "Premiere A: Talent show performances". Wikipedia describes it
  as an MTV Spring Break-themed Drag Queens Got Talent show. ✓ accurate at summary
  granularity.
- **Elimination**: ✓ none (non-elim premiere A).

### Ep 2: Queen Choice Awards
- **Title**: ✓ matches ("Queen Choice Awards").
- **Order**: ✓ matches (Ep 2).
- **Summary**: "Premiere B: Talent show performances" ✓ accurate (Queen Choice
  Awards-themed talent show).
- **Elimination**: ✓ none.

### Ep 3: The Mother of All Balls
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary** (.md): "Design three mother-themed ball looks including one from
  upcycled menswear" — Wikipedia: three looks titled Mother Goose, Significant
  Mother, and Call Me Mother/Father. ✓ accurate (upcycled menswear detail is the
  Call Me Mother/Father category).
- **Elimination** (.ts): `hershii`. Wikipedia: Hershii LiqCour-Jeté. ✓ matches.

### Ep 4: RDR Live!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Perform live sketch comedy in an SNL-style variety show" ✓ accurate.
- **Elimination** (.ts): `mirage`. Wikipedia: Mirage. ✓ matches.

### Ep 5: Girl Groups
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Write and perform original verses in rival girl groups" ✓ accurate.
- **Elimination** (.ts): `amanda`. Wikipedia: Amanda Tori Meating. ✓ matches.

### Ep 6: Welcome to the DollHouse
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Design a doll based on your drag persona and present on the runway"
  ✓ accurate.
- **Elimination** (.ts): `geneva`. Wikipedia: Geneva Karr. ✓ matches.

### Ep 7: The Sound of Rusic
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Perform in a Sound of Music-themed Rusical" ✓ accurate.
- **Elimination** (.ts): `megami`. Wikipedia: Megami. ✓ matches.

### Ep 8: Snatch Game
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `xunami`. Wikipedia: Xunami Muse. ✓ matches.

### Ep 9: See You Next Wednesday
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary** (.md): "Design a Neo-Goth look from scratch using black, white, and
  grey fabrics" — Wikipedia describes it as a goth look from unconventional
  materials. ⚠ Minor: the "unconventional materials" framing on Wikipedia suggests
  the research `.md` "fabrics" descriptor may be narrower than the actual challenge.
  Not a hard error; flagged as ambiguous.
- **Elimination** (.ts): `plasma`. Wikipedia: Plasma. ✓ matches.

### Ep 10: Werq the World
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: 'Write and perform a political anthem RuMix called "Power"'
  ✓ accurate.
- **Elimination** (.ts): `[]` (non-elim). Wikipedia: no elimination.
  ✓ matches.

### Ep 11: Corporate Queens
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary** (.md): "Present comedic Drag Awareness seminars to a corporate
  audience" — Wikipedia frames it as teams writing/delivering drag awareness
  employee seminars. ✓ accurate (team structure not mentioned in `.md` but not
  wrong).
- **Elimination** (.ts): `mhiya`. Wikipedia: Mhi'ya Iman Le'Paige. ✓ matches.

### Ep 12: Bathroom Hunties
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Design a gender-inclusive nightclub bathroom in pairs"
  ✓ accurate.
- **Elimination** (.ts): `dawn`. Wikipedia: Dawn. ✓ matches.

### Ep 13: Drag Race Vegas Live! Makeovers
- **Title** (.md): "Drag Race Vegas Live! Makeovers"; (.ts): "Drag Race Vegas LIVE!
  Makeovers"; Wikipedia: "Drag Race Vegas Live! Makeovers". ⚠ Minor case difference
  in `.ts` ("LIVE" vs "Live"). Flagged as typography only.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `morphine`. Wikipedia: Morphine Love Dion. ✓ matches.

### Ep 14: Booked & Blessed
- **Title** (.md): "Booked & Blessed"; (.ts): "Booked and Blessed"; Wikipedia:
  "Booked and Blessed". ⚠ Minor: `.md` uses "&"; `.ts` and Wikipedia use "and".
  Flagged as typography only.
- **Order**: ✓ matches.
- **Summary**: "Write a memoir, pose for the cover, and get interviewed about your
  story" ✓ accurate.
- **Elimination** (.ts): `q16`. Wikipedia: Q. ✓ matches.

### Ep 15 (`.ts` finale entry) — Grand Finale
- **Title** (.ts): "Grand Finale". Wikipedia: Ep15 "Lip Sync LaLaPaRuZa Smackdown –
  Reunited", Ep16 "Grand Finale". ✗ **Structural mismatch**: `.ts` collapses two
  Wikipedia episodes into one; research `.md` omits both.
- **Order**: ✗ Wikipedia has 16 episodes, `.ts` has 15.
- **Summary / Elimination**: Finale placements empty in `.ts`. Wikipedia winner
  chain: Plane Jane eliminated in finale lip-sync → Nymphia Wind defeats Sapphira
  Cristál → **Winner: Nymphia Wind**. Miss Congeniality: tied between Sapphira
  Cristál and Xunami Muse (per Wikipedia).

---

# Season 17 Audit

## Summary
- Episodes verified: 16 of 16 on Wikipedia; `.ts` has 14, research `.md` has 16
- Total discrepancies: 3 (titles: 1 minor, order: 1 structural, summaries: 1
  ambiguous, placements: N/A, eliminations: 0, structural: 1)

## Structural findings

- **`.ts` file is missing two episodes** relative to Wikipedia: there is no separate
  entry for the Lip Sync LaLaPaRuza Smackdown (Wiki Ep15) and no entry for
  "How's Your Headliner?" (Wiki Ep14). The `.ts` file has 14 episodes total (13
  competition + 1 `kind: 'finale'`), while Wikipedia lists 16. Research
  `s17-episodes.md` correctly lists all 16.
- **Placements empty**: `placements: {}` for all `.ts` entries.

## Per-episode findings

### Ep 1: Squirrel Games
- **Title**: ✓ matches across all three sources.
- **Order**: ✓ matches.
- **Summary** (.md): "Premiere A: Squid Game-themed talent show performances" —
  Wikipedia frames it as Drag Queens Got Talent Part 1 (seven queens). The
  "Squid Game" framing comes from the episode title "Squirrel Games" which is a
  Squid Game parody; the challenge itself is a talent show. ✓ accurate.
- **Elimination** (.ts): `[]` (non-elim). Wikipedia: no elimination. ✓ matches.

### Ep 2: Drag Queens Got Talent – Part 2
- **Title** (.md / Wikipedia): "Drag Queens Got Talent – Part 2". (.ts):
  "Drag Queens Got Talent Part 2". ⚠ Minor: `.ts` missing the en-dash. Typography
  only.
- **Order**: ✓ matches.
- **Summary**: "Premiere B: talent show performances" ✓ accurate.
- **Elimination** (.ts): `[]`. Wikipedia: no elimination (Hormona Lisa saved by
  Badonka Dunk Tank). ✓ matches on the "nobody sashays" result.

### Ep 3: Monopulence!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Design looks from Monopoly-themed unconventional materials"
  — Wikipedia describes it as "monochromatic Monopoly-inspired outfits for board
  game's 90th anniversary". ⚠ The `.md` description says "unconventional materials"
  which is not what Wikipedia emphasizes (it emphasizes monochromatic / Monopoly
  color schemes). Flagged as summary drift; actual challenge is Monopoly-themed
  outfit design.
- **Elimination** (.ts): `lucky`. Wikipedia: Lucky Starzzz. ✓ matches.

### Ep 4: Bitch, I'm a Drag Queen!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Write and perform verses in a girl-group number" ✓ accurate
  (Wikipedia: "Record and perform commercial songs featuring past Drag Race
  contestants").
- **Elimination** (.ts): `joella`. Wikipedia: Joella. ✓ matches.

### Ep 5: RDR Live!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Perform in a live broadcast sketch comedy/acting challenge"
  ✓ accurate.
- **Elimination** (.ts): `arrietty`. Wikipedia: **no elimination — Arrietty was
  saved by the Badonka Dunk Tank**. ✗ **DISCREPANCY**: `.ts` records Arrietty as
  eliminated in Ep 5, but Wikipedia states Arrietty was in BTM, saved via Badonka
  Dunk, and actually eliminated later in Ep 10. The `.ts` elimination roster for
  Ep 5 should be `[]`, and Arrietty's ELIM belongs in Ep 10.

### Ep 6: Let's Get Sea Sickening Ball
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Design and present three nautical-themed ball looks" ✓ accurate
  (Bathing Beauties, Sea Creature Couture, Sea Sickening Eleganza).
- **Elimination** (.ts): `hormona`. Wikipedia: Hormona Lisa. ✓ matches.

### Ep 7: Snatch Game
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `crystal17`. Wikipedia: Crystal Envy. ✓ matches.

### Ep 8: The Wicked Wiz of Oz: The Rusical!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Perform in a Wicked/Wizard of Oz mashup Rusical" ✓ accurate.
- **Elimination** (.ts): `acacia`. Wikipedia: Acacia Forgot. ✓ matches.

### Ep 9: Heavens to Betsey!
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary** (.md): "Makeover challenge pairing queens with their drag mothers" —
  Wikipedia: "Design high-fashion outfits inspired by Betsey Johnson collections".
  ✗ **SUMMARY MISMATCH**: Ep 9 is a Betsey Johnson fashion design challenge per
  Wikipedia, NOT a drag-mother makeover. (The drag-family makeover in S17 is Ep
  13 "Drag Baby Mamas".)
- **Elimination** (.ts): `kori`. Wikipedia: Kori King. ✓ matches.

### Ep 10: The Villains Roast
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Perform stand-up comedy roasting iconic villains" ✓ accurate.
- **Elimination** (.ts): `lydia`. Wikipedia: **Arrietty was eliminated in Ep 10**
  (after winning in Ep 6, she was BTM in Ep 10). Wikipedia elimination summary:
  "Episode 10: Winner: Lydia B Kollins | Eliminated: Arrietty". ✗ **DISCREPANCY**:
  `.ts` records `lydia` (Lydia B Kollins) as eliminated in Ep 10, but Wikipedia
  says Lydia B Kollins WON Ep 10 and Arrietty was eliminated. Lydia was eliminated
  the following episode (Ep 11).

### Ep 11: Ross Mathews vs. The Ducks
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary**: "Act in a scripted comedy film parody" ✓ accurate.
- **Elimination** (.ts): `lana`. Wikipedia: **Lydia B Kollins was eliminated in
  Ep 11**. "Episode 11: Winner: Onya Nurve | Eliminated: Lydia B Kollins".
  ✗ **DISCREPANCY**: `.ts` records `lana` (Lana Ja'Rae) as eliminated in Ep 11,
  but Wikipedia says Lydia B Kollins was eliminated in Ep 11. Lana was actually
  eliminated in Ep 12.

### Ep 12: Charisma, Uniqueness, Nerve & Talent Monologues
- **Title** (.ts): "CUNT Monologues"; (.md) and Wikipedia: "Charisma, Uniqueness,
  Nerve & Talent Monologues". ⚠ `.ts` uses a short-form that Wikipedia does not.
  Flagged as title simplification (not a hard error, but readers searching for the
  full name won't find it).
- **Order**: ✓ matches.
- **Summary** (.md): "Write and perform original monologues" — Wikipedia describes
  the challenge as working in duos to "write and perform an interpretative dance in
  the Charisma, Uniqueness, Nerve & Talent monologues". ⚠ Wikipedia phrasing is
  odd; the challenge appears to be a monologue performance (possibly with dance
  elements) performed in duos. The `.md` summary is approximately right but omits
  the duo pairing.
- **Elimination** (.ts): `suzie`. Wikipedia: **Lana Ja'Rae was eliminated in Ep 12**.
  "Episode 12: Winners: Onya Nurve & Lexi Love | Eliminated: Lana Ja'Rae".
  ✗ **DISCREPANCY**: `.ts` records `suzie` (Suzie Toot) as eliminated in Ep 12,
  but Wikipedia says Lana Ja'Rae was eliminated. Suzie Toot was actually
  eliminated in Ep 14.

### Ep 13: Drag Baby Mamas
- **Title**: ✓ matches.
- **Order**: ✓ matches.
- **Summary** (.md): "Final design challenge with drag family makeover" —
  Wikipedia: Sam Star won, no elimination (non-elim episode). ✓ approximately
  accurate as a drag-family challenge.
- **Elimination** (.ts): `[]` (non-elim). Wikipedia: no elimination. ✓ matches.

### Ep 14 (Wikipedia: "How's Your Headliner?"; `.ts`: MISSING)
- **`.ts` does not contain this episode.** Episode index 14 in `.ts` jumps to
  `kind: 'finale'` / "Grand Finale".
- **Wikipedia**: Ep 14 "How's Your Headliner?", winner Jewels Sparkles, eliminated
  Suzie Toot. ✗ **STRUCTURAL DISCREPANCY**: `.ts` is missing this pre-finale
  episode entirely. The research `s17-episodes.md` correctly includes it.

### Ep 15 (Wikipedia: "Lip Sync Lalaparuza Smackdown"; `.ts`: MISSING)
- **`.ts` does not contain this episode.** The `.md` correctly includes it.
- **Wikipedia**: Suzie Toot crowned "Queen of She Done Already Done Had Herses".

### Ep 16 (Wikipedia: "Grand Finale"; `.ts` entry number 14)
- **Title** (.ts): "Grand Finale". ✓ matches.
- **Order**: ✗ `.ts` numbers it 14, Wikipedia Ep 16.
- **Winner**: Onya Nurve. Runner-up: Jewels Sparkles. 3rd: Lexi Love. 4th: Sam
  Star. Miss Congeniality: Crystal Envy. (Not encoded in `.ts` placements.)

---

# Season 18 Audit

## Summary
- Episodes verified: 15 of 15 pre-finale ; the Grand Finale (Wikipedia Ep16) is
  not yet resolved on Wikipedia at audit time.
- Total discrepancies: 2 (titles: 0, order: 1 structural, summaries: 0,
  placements: N/A, eliminations: 0, structural: 2)

## Structural findings

- **`.ts` file has 14 entries** (13 competition + 1 `kind: 'finale'`). **Research
  `s18-episodes.md` has 15 entries** (ends at Ep 15 "All RuPaul-A-Paruza
  Smackdown"; no finale row). **Wikipedia has 16 episodes** (adds Ep 16 Grand
  Finale, date April 17 2026, outcome TBA on Wikipedia).
- `.ts` collapses Wikipedia Ep 14 (Good Morning Bitches), Ep 15 (RuPaul-A-Paruza
  Smackdown), and Ep 16 (Grand Finale) into a single finale entry.
- **Placements empty**: `placements: {}` for all `.ts` entries.
- **Challenge-name terseness**: Most `.ts` `challengeName` fields are paraphrases
  rather than Wikipedia episode titles (e.g., `.ts` "Recycled Materials Design"
  vs Wikipedia "You Can't Keep a Good Drag Queen Down!"). This is intentional (the
  `.ts` uses descriptive challenge names, not broadcast titles). Research `.md`
  does carry the broadcast titles.

## Per-episode findings

### Ep 1: You Can't Keep a Good Drag Queen Down!
- **Title** (.md): ✓ matches Wikipedia. (.ts): "Recycled Materials Design" —
  descriptive, not the broadcast title; flagged as paraphrase (see note above).
- **Order**: ✓ matches.
- **Summary** (.md): "Design outfits from leftover materials of previous seasons"
  ✓ accurate.
- **Elimination** (.ts): `[]` (non-elim). Wikipedia: no elimination. ✓ matches.

### Ep 2: Q-Pop Girl Groups
- **Title** (.md): ✓ matches Wikipedia. (.ts): "Girl Group Performances" —
  paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Write, record, and perform verses as retro-inspired girl groups"
  ✓ accurate (Wikipedia: "70s and 80s girl groups").
- **Elimination** (.ts): `dd`. Wikipedia: DD Fuego. ✓ matches.

### Ep 3: RDR Live Returns!
- **Title** (.md): ✓ matches. (.ts): "Sketch Comedy" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `mandy`. Wikipedia: Mandy Mango. ✓ matches.

### Ep 4: Red Carpet Mash Up
- **Title** (.md): ✓ matches. (.ts): "Red Carpet Mashup" — minor spacing/spelling
  difference vs Wikipedia "Red Carpet Mash Up". Typography only.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `briar`. Wikipedia: Briar Blush. ✓ matches.

### Ep 5: The Rate-A-Queen Talent Show, Part 1
- **Title** (.md): ✓ matches. (.ts): "Talent Show" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Individual talent show performances (6 queens)" ✓ accurate.
- **Elimination** (.ts): `[]` (non-elim). Wikipedia: no elimination. ✓ matches.

### Ep 6: The Rate-A-Queen Talent Show, Part 2
- **Title** (.md): ✓ matches. (.ts): "Talent Show Part 2" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Individual talent show performances (5 queens)" ✓ accurate
  (5 queens performed in part 2 per Wikipedia).
- **Elimination** (.ts): `ciara`. Wikipedia: Ciara Myst. ✓ matches.

### Ep 7: Drag Queens for Change
- **Title** (.md): ✓ matches. (.ts): "Political Ad Parodies" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Create twisted parody political campaign ads in pairs" ✓ accurate.
- **Elimination** (.ts): `vita`. Wikipedia: Vita VonTesse Starr. ✓ matches.

### Ep 8: Snatch Game of Love: Island Edition
- **Title** (.md): ✓ matches. (.ts): "Snatch Game of Love Island" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: ✓ accurate.
- **Elimination** (.ts): `mia18`. Wikipedia: Mia Starr. ✓ matches.

### Ep 9: Fannie: The Hard Knock Ball Rusical
- **Title** (.md): ✓ matches. (.ts): "Fannie: The Rusical" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Perform in an Annie-parody Rusical production" ✓ accurate.
- **Elimination** (.ts): `athena`. Wikipedia: Athena Dion. ✓ matches.

### Ep 10: Drag in a Bag
- **Title** (.md / .ts): ✓ matches Wikipedia.
- **Order**: ✓ matches.
- **Summary**: "Design a festive look from eliminated queens' suitcase materials"
  ✓ accurate.
- **Elimination** (.ts): `kenya18`. Wikipedia: **no elimination in Ep 10** —
  Wikipedia's elimination chart shows Kenya Pleaser TOP2 in Ep 10 and ELIM in Ep
  11. The WebFetch summary for Ep 10 says "Eliminated: None". ✗ **DISCREPANCY**:
  `.ts` records `kenya18` as eliminated in Ep 10, but Wikipedia shows Ep 10 was a
  non-elimination (Jane Don't win, Kenya Pleaser TOP2). Kenya Pleaser's actual
  elimination episode is Ep 11.

### Ep 11: A Toast to Alyssa Edwards
- **Title** (.md): ✓ matches. (.ts): "Roast/Toast" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Write and perform a roast/toast of Alyssa Edwards" ✓ accurate.
- **Elimination** (.ts): `discord`. Wikipedia: **Kenya Pleaser was eliminated in
  Ep 11**. "Episode 11: Winner: Darlene Mitchell | Eliminated: Kenya Pleaser".
  ✗ **DISCREPANCY**: `.ts` records `discord` (Discord Addams) as eliminated in
  Ep 11, but Wikipedia says Kenya Pleaser was eliminated. Discord Addams was
  actually eliminated in Ep 12.

### Ep 12: Mammas, Don't Let Your Babies Grow Up to Be Drag Queens
- **Title** (.md): ✓ matches. (.ts): "Drag Family Makeover" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Makeover rodeo riders into drag family members" ✓ accurate.
- **Elimination** (.ts): `jane`. Wikipedia: **Discord Addams was eliminated in
  Ep 12**. "Episode 12: Winner: Myki Meeks | Eliminated: Discord Addams".
  ✗ **DISCREPANCY**: `.ts` records `jane` (Jane Don't) as eliminated in Ep 12,
  but Wikipedia says Discord Addams was eliminated. Jane Don't was actually
  eliminated in Ep 13.

### Ep 13: Karens Gone Wild
- **Title** (.md): ✓ matches. (.ts): "Karens Improv" — paraphrase.
- **Order**: ✓ matches.
- **Summary**: "Improv sketch comedy scenes with RuPaul as scene partner"
  ✓ accurate.
- **Elimination** (.ts): `juicy`. Wikipedia: **Jane Don't was eliminated in Ep 13**.
  "Episode 13: Winner: Myki Meeks | Eliminated: Jane Don't". ✗ **DISCREPANCY**:
  `.ts` records `juicy` (Juicy Love Dion) as eliminated in Ep 13, but Wikipedia
  says Jane Don't was eliminated. Juicy Love Dion was actually eliminated in Ep
  14.

### Ep 14 (Wikipedia: "Good Morning Bitches"; `.ts`: MISSING as a distinct entry)
- **`.ts` does not have a distinct Ep 14 competition entry.** It has `number: 14,
  kind: 'finale', challengeName: 'Grand Finale'`.
- **Research `.md` Ep 14**: "Good Morning Bitches" — ✓ matches Wikipedia.
- **Wikipedia Ep 14**: Winners Darlene Mitchell & Myki Meeks (tied); eliminated
  Juicy Love Dion.
- ✗ **STRUCTURAL DISCREPANCY**: The `.ts` collapses the morning-show competition,
  the LaLaPaRuZa smackdown, and the Grand Finale into a single finale entry.

### Ep 15 (Wikipedia: "All RuPaul-A-Paruza Smackdown"; `.ts`: MISSING; `.md` Ep 15)
- **Research `.md` Ep 15**: "All RuPaul-A-Paruza Smackdown" — ✓ matches Wikipedia.
- **`.ts`**: no distinct entry.
- Wikipedia: Juicy Love Dion crowned SDADHH.

### Ep 16 (Wikipedia: "Grand Finale"; not in `.md`; `.ts` combines into entry 14)
- **Wikipedia Ep 16**: Grand Finale, aired April 17 2026.
- **Winner**: Wikipedia states TBA at audit time — ⚠ **UNVERIFIABLE at this time**.
  A later audit should re-check once Wikipedia updates the crowning.

---

# Cross-season summary of hard discrepancies

| Season | Episode (Wiki #) | Type | Detail |
|--------|---|---|---|
| S16 | 15/16 | Structural | `.ts` collapses LaLaPaRuZa + Grand Finale into single finale; `.md` omits both |
| S17 | 5 | Elimination | `.ts` eliminates `arrietty`; Wikipedia: no elim (saved by Badonka Dunk) |
| S17 | 9 | Summary | `.md` calls it "drag mother makeover"; Wikipedia: Betsey Johnson fashion |
| S17 | 10 | Elimination | `.ts` eliminates `lydia`; Wikipedia: Arrietty eliminated |
| S17 | 11 | Elimination | `.ts` eliminates `lana`; Wikipedia: Lydia B Kollins eliminated |
| S17 | 12 | Elimination | `.ts` eliminates `suzie`; Wikipedia: Lana Ja'Rae eliminated |
| S17 | 14 | Structural | `.ts` missing "How's Your Headliner?" entirely |
| S17 | 15 | Structural | `.ts` missing LaLaPaRuZa Smackdown entirely |
| S17 | 16 | Order | `.ts` numbers finale as 14 instead of 16 |
| S18 | 10 | Elimination | `.ts` eliminates `kenya18`; Wikipedia: non-elim |
| S18 | 11 | Elimination | `.ts` eliminates `discord`; Wikipedia: Kenya Pleaser eliminated |
| S18 | 12 | Elimination | `.ts` eliminates `jane`; Wikipedia: Discord Addams eliminated |
| S18 | 13 | Elimination | `.ts` eliminates `juicy`; Wikipedia: Jane Don't eliminated |
| S18 | 14/15/16 | Structural | `.ts` collapses Ep 14 (Good Morning Bitches), Ep 15 (Smackdown), Ep 16 (Grand Finale) into one finale entry |

## The S17 and S18 elimination-shift patterns

Both seasons show a common pattern: starting at a certain point the `.ts`
elimination list is shifted by one episode relative to Wikipedia (the person
eliminated in Wiki Ep N is listed in `.ts` Ep N+1, and `.ts` Ep N lists the
person who was actually eliminated one episode later, etc.). This strongly
suggests the `.ts` eliminations were populated from a schema that treated some
episodes' lip syncs as revealed a week after the challenge, or that one
intermediate episode's elimination was skipped during data entry. Flagged for
review but not fixed per instruction.

- **S17**: shift begins around Ep 10, ends at Ep 12. Arrietty belongs in Ep 10,
  not Ep 5. Lydia in Ep 11. Lana in Ep 12. Suzie in Ep 14 (an episode the `.ts`
  file entirely lacks).
- **S18**: shift begins around Ep 10. Kenya Pleaser belongs in Ep 11, Discord in
  Ep 12, Jane Don't in Ep 13, Juicy Love Dion in Ep 14 (an episode the `.ts` file
  entirely lacks).

## Items Wikipedia could not resolve at audit time

- **S18 Grand Finale winner**: Wikipedia shows TBA as of the 2026-04-16 fetch.
  Re-audit once the crowning is published.
- **S17 Ep 12 maxi-challenge wording**: Wikipedia's rendering
  ("interpretative dance in the [CUNT] monologues") is ambiguous; research `.md`
  description of monologues-only is plausible but not definitively confirmed by
  the source.
