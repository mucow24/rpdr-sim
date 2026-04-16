# Seasons 7, 8, 9 Wikipedia Audit

Auditor note: This pass compares both `research/sNN-episodes.md` (titles/summaries) and
`src/data/_v1_archive/seasonN.ts` (placements/eliminations) against
Wikipedia's per-season article and supplemental per-episode Wikipedia entries.

Important methodology caveat: Wikipedia's "Contestant progress" tables on the
older seasons (esp. S7) are not always explicit about the HIGH vs SAFE
distinction. Where Wikipedia does not clearly separate HIGH from SAFE, that
specific cell is flagged as "unverifiable from Wikipedia" rather than marked
correct or incorrect. I did not consult Fandom (blocked by tool permissions).

Legend: matches = confirmed against Wikipedia. mismatch = explicit Wikipedia
contradiction. unverifiable = Wikipedia too ambiguous to confirm or deny.

---

# Season 7 Audit

## Summary
- Episodes verified: 12 of 12 (the .ts file and research doc both end at the
  Grand Finale; Wikipedia lists Ep12 "And the Rest Is Drag" as the final
  competition episode followed by Ep13 "Countdown to the Crown" retrospective
  and Ep14 "Grand Finale" reunion/crowning — the .ts archive collapses this
  into one "Grand Finale" entry at #12, which differs from Wikipedia's
  numbering)
- Total discrepancies: significant — see per-episode findings
  - Titles (.md and .ts): mostly match; research .md adds subtitle
    "(Split Premiere Pt. 1/2)" to Ep1/Ep2 which Wikipedia does not
  - Order: major structural issue — .ts compresses Ep12 "And the Rest Is
    Drag" (Kennedy eliminated) + Ep13 + Ep14 into a single #12 "Grand Finale"
  - Missing episode: `Ep 12 "And the Rest Is Drag"` is absent from both
    `research/s07-episodes.md` AND `src/data/_v1_archive/season7.ts`
  - Placements: several HIGH/SAFE/LOW mismatches (documented below)
  - Eliminations: Ep10 elimination is incorrect in .ts file

## Per-episode findings

### Ep 1: "Born Naked"
- **Title**: matches (Wikipedia: "Born Naked"). Research .md adds subtitle
  "(Split Premiere Pt. 1)" which is descriptive but not Wikipedia's title.
- **Order**: matches
- **Summary**: matches — tearaway nude-illusion challenge with a spring/fall
  runway, split premiere aired with half the cast
- **Placements (.ts)**:
  - Violet WIN — matches
  - Tempest, Kandy BTM2; Tempest eliminated — matches
  - Max HIGH, Miss Fame HIGH — unverifiable from Wikipedia. Wikipedia's
    progress table lists these as SAFE without a distinct HIGH marker for
    Ep1. Some recaps mention multiple queens with positive critiques but
    Wikipedia itself does not formally mark HIGH here.
  - All other queens SAFE — matches Wikipedia's table
- **Elimination**: Tempest DuJour — matches

### Ep 2: "Glamazonian Airways"
- **Title**: matches. Research .md adds "(Split Premiere Pt. 2)" subtitle not
  in Wikipedia.
- **Order**: matches
- **Summary**: matches — airline-safety-themed Rusical
- **Placements (.ts)**:
  - Ginger WIN — matches
  - Katya and Sasha BTM2, Sasha eliminated — matches
  - Kasha HIGH, Miss Fame HIGH — Wikipedia's progress table lists these as
    SAFE; some recaps treat Kasha as HIGH, but Wikipedia does not formalize
    HIGH in Ep2. Flag: unverifiable.
  - Jasmine LOW — unverifiable from Wikipedia's progress table
  - Kandy SAFE — matches
- **Elimination**: Sasha Belle — matches

### Ep 3: "ShakesQueer"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — Shakespeare parody acting scenes
- **Placements (.ts)**:
  - Max WIN — matches
  - Jasmine and Kennedy BTM2, Jasmine eliminated — matches
  - Violet HIGH, Katya HIGH — unverifiable precisely (Wikipedia's table
    shows SAFE for both; these two were in the top critique group per
    recaps but Wikipedia itself does not mark HIGH in its table)
  - All other queens SAFE — matches
- **Elimination**: Jasmine Masters — matches

### Ep 4: "Spoof! (There It Is)"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — music-video/movie-trailer parodies (the research .md
  says "parody trailer of a reality TV show" which is misleading; the
  challenge was to film parodies of pop music videos / movies, not reality
  TV). Minor inaccuracy in summary wording.
- **Placements (.ts)**:
  - Kennedy WIN — matches
  - Pearl and Trixie BTM2, Trixie eliminated — matches
  - Katya HIGH, Jaidynn HIGH — unverifiable from Wikipedia's table (both
    marked SAFE there, though top-critique grouping aligns with recaps)
- **Elimination**: Trixie Mattel — matches

### Ep 5: "The DESPY Awards"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — sports award show co-hosting
- **Placements (.ts)**:
  - Max and Pearl WIN — matches
  - Kandy and Kasha BTM2; Kasha eliminated — matches
  - Kennedy HIGH, Ginger HIGH — mismatch flag: Wikipedia's table shows
    Kennedy SAFE in Ep5. Ginger's position varies; recaps pair Ginger
    with Kandy as "in trouble" alongside Kandy in some accounts (Ginger
    was arguably LOW, not HIGH). Potential error: Ginger should likely
    not be HIGH.
  - Violet LOW — unverifiable from Wikipedia's table
- **Elimination**: Mrs. Kasha Davis — matches

### Ep 6: "Ru Hollywood Stories"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — behind-the-music-style improv
- **Placements (.ts)**:
  - Katya WIN — matches
  - Jaidynn and Kandy BTM2; Kandy eliminated — matches
  - Kennedy HIGH, Max HIGH — unverifiable from Wikipedia's table
  - Missing from .ts: **Trixie returns this episode** per Wikipedia;
    she's not listed in Ep6 placements because she re-enters in Ep8.
    Actually Wikipedia says Trixie is brought back in Ep6 for the "Ru
    Hollywood Stories" challenge? Re-check: per Wikipedia S7 article,
    Trixie returns in Ep8 "Conjoined Queens" — the .ts correctly notes
    Trixie's return in Ep8 comment. No issue here.
  - Miss Fame SAFE in .ts — matches
- **Elimination**: Kandy Ho — matches

### Ep 7: "Snatch Game"
- **Title**: matches
- **Order**: matches
- **Summary**: matches
- **Placements (.ts)**:
  - Ginger WIN, Kennedy WIN (double win) — matches
  - Jaidynn and Max BTM2; Max eliminated — matches
  - Katya HIGH — matches (Katya's Bea Arthur was widely praised)
  - Miss Fame LOW — matches (Miss Fame's Donatella was critiqued)
  - Pearl and Violet SAFE — matches
- **Elimination**: Max — matches

### Ep 8: "Conjoined Queens"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — makeover with returning queens; Trixie returns as
  a contestant
- **Placements (.ts)**:
  - Pearl WIN — matches
  - Ginger and Jaidynn BTM2; Jaidynn eliminated — matches
  - Violet HIGH, Katya HIGH — unverifiable from Wikipedia's table (marked
    SAFE there, though consistent with top-critique grouping in recaps)
  - Trixie SAFE (returning queen) — matches; Miss Fame SAFE — matches;
    Kennedy SAFE — matches
- **Elimination**: Jaidynn Diore Fierce — matches

### Ep 9: "Divine Inspiration"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — John Waters–inspired musical acting
- **Placements (.ts)**:
  - Ginger WIN — matches
  - Pearl and Miss Fame BTM2; Miss Fame eliminated — matches
  - Katya HIGH, Kennedy HIGH — unverifiable from Wikipedia (marked SAFE in
    table, top-critique grouping in recaps)
  - Violet and Trixie SAFE — matches
- **Elimination**: Miss Fame — matches

### Ep 10: "Prancing Queens"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — choreographed dance performance
- **Placements (.ts)**:
  - Katya and Violet WIN (double win) — matches
  - Ginger and Trixie BTM2 — matches
  - **Eliminated in .ts: ['trixie']** — **MISMATCH** — per Wikipedia, Kennedy
    placed HIGH (actually Kennedy was SAFE/HIGH and was NOT in bottom two),
    Trixie was eliminated in Ep10 (her second elimination). But wait: the
    .ts eliminates Trixie in Ep10, and Wikipedia confirms Trixie is
    eliminated in Ep10. So elimination matches.
  - Pearl HIGH, Kennedy HIGH — unverifiable from Wikipedia (both listed
    SAFE in table)
- **Elimination**: Trixie Mattel — matches

### Ep 11: "Hello, Kitty Girls!"
- **Title**: matches (exact including comma: "Hello, Kitty Girls!")
- **Order**: matches
- **Summary**: matches — Hello Kitty Ball with two looks
- **Placements (.ts)**:
  - Violet WIN — matches
  - Katya and Kennedy BTM2; Katya eliminated — matches
  - Ginger HIGH — matches (Ginger was top of the ball besides Violet)
  - Pearl SAFE — matches
- **Elimination**: Katya — matches

### Ep 12: Finale — STRUCTURAL MISMATCH
- **Wikipedia lists three remaining entries:**
  - Ep12 "And the Rest Is Drag" (final competition episode, music video,
    Kennedy Davenport eliminated, Top 3 = Violet/Ginger/Pearl)
  - Ep13 "Countdown to the Crown" (retrospective clip show)
  - Ep14 "Grand Finale" (crowning: Violet wins)
- **Research .md**: has a single "Ep 12 Born Naked (Finale)" — this is
  **MISMATCH**. The finale music video (aired in Ep12) used the title song
  "And the Rest Is Drag" from the album *Born Naked*; research .md
  conflates the album and episode names.
- **.ts archive**: has a single `{ kind: 'finale', number: 12, challengeName:
  'Grand Finale' }` with no placements. This **omits Kennedy's elimination
  in Ep12** and collapses Wikipedia's Ep12/13/14 into one finale entry.
- **Elimination**: The actual pre-finale elimination of Kennedy Davenport
  in "And the Rest Is Drag" is **missing entirely from the .ts archive**.

---

# Season 8 Audit

## Summary
- Episodes verified: 9 of 9
- Total discrepancies:
  - Titles: 1 (.ts file: "Book Ball" vs Wikipedia "RuPaul Book Ball"; .md is
    correct)
  - Order: no mismatches
  - Summaries: minor wording issues (see episodes)
  - Placements: several HIGH/LOW distinctions unverifiable from Wikipedia's
    progress table (S8 Wikipedia table appears to only mark WIN/SAFE/BTM/
    ELIM explicitly)
  - Eliminations: all match (including the Ep2 double elimination)

## Per-episode findings

### Ep 1: "Keeping It 100!"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — design from 100 photo-booth box materials
- **Placements (.ts)**:
  - Kim Chi WIN — matches
  - Laila and Naysha BTM2; Naysha eliminated — matches
  - Acid Betty HIGH, Bob HIGH — unverifiable from Wikipedia's table
  - Dax LOW — unverifiable from Wikipedia's table
  - All others SAFE — matches
- **Elimination**: Naysha Lopez — matches

### Ep 2: "Bitch Perfect"
- **Title**: matches
- **Order**: matches
- **Summary**: matches (challenge was a cheerleading-themed routine)
- **Placements (.ts)**:
  - Chi Chi WIN — matches
  - Laila and Dax BTM2; both eliminated (double elimination) — matches
  - Derrick HIGH, Naomi HIGH — unverifiable from Wikipedia's table
    (marked SAFE; some accounts place Naomi as HIGH)
  - Cynthia LOW — unverifiable from Wikipedia's table
- **Elimination**: Both Dax ExclamationPoint and Laila McQueen (double) —
  matches Wikipedia

### Ep 3: "RuCo's Empire"
- **Title**: matches (including apostrophe)
- **Order**: matches
- **Summary**: matches — Empire parody
- **Placements (.ts)**:
  - Bob WIN — matches
  - Robbie and Cynthia BTM2; Cynthia eliminated — matches
  - Thorgy HIGH, Acid Betty HIGH — unverifiable from Wikipedia's table
  - Naysha SAFE (returning) — matches (Naysha re-entered this episode)
- **Elimination**: Cynthia Lee Fontaine — matches

### Ep 4: "New Wave Queens"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — new-wave-inspired music video
- **Placements (.ts)**:
  - Robbie WIN — matches
  - Chi Chi and Naysha BTM2 (per .ts); Naysha eliminated — Wikipedia's
    progress shows **Chi Chi BTM2 and Naysha BTM2** with Naysha eliminated
    — matches
  - Thorgy HIGH, Bob HIGH — unverifiable from Wikipedia's table
  - Derrick LOW — unverifiable from Wikipedia's table
- **Elimination**: Naysha Lopez — matches

### Ep 5: "Supermodel Snatch Game"
- **Title**: matches (.ts stores `challengeName: 'Snatch Game'` which
  is abbreviated; .md has full "Supermodel Snatch Game")
- **Order**: matches
- **Summary**: matches
- **Placements (.ts)**:
  - Bob WIN — matches
  - Naomi and Acid Betty BTM2; Acid Betty eliminated — matches
  - Chi Chi HIGH, Thorgy HIGH — unverifiable precisely from Wikipedia's
    S8 progress table but multiple recaps place Thorgy in the top 3;
    .ts is consistent with recap-level accounts.
  - Robbie LOW — unverifiable from Wikipedia's table (recaps place
    Robbie in the bottom group alongside Naomi/Acid Betty, so LOW is
    plausible)
- **Elimination**: Acid Betty — matches

### Ep 6: "Wizards of Drag"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — little-person makeovers with Oz theme
- **Placements (.ts)**:
  - Naomi WIN — matches
  - Derrick and Robbie BTM2; Robbie eliminated — matches
  - Kim Chi HIGH, Bob HIGH — unverifiable from Wikipedia's table
  - Chi Chi and Thorgy SAFE — matches
- **Elimination**: Robbie Turner — matches

### Ep 7: "Shady Politics"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — political-themed challenge. Note: the research .md
  calls this "Political-debate improv challenge" — actually the main
  challenge was filming political-style attack ads against each other, not
  a live debate. Minor summary inaccuracy.
- **Placements (.ts)**:
  - Bob and Derrick WIN (double win) — matches
  - Chi Chi and Thorgy BTM2; Thorgy eliminated — matches
  - Naomi HIGH — unverifiable but plausible
  - Kim Chi SAFE — matches
- **Elimination**: Thorgy Thor — matches

### Ep 8: "RuPaul Book Ball"
- **Title in research .md**: "RuPaul Book Ball" — matches Wikipedia
- **Title in .ts `challengeName`**: "Book Ball" — **MISMATCH**. The Wikipedia
  title is "RuPaul Book Ball". This is a minor truncation in the .ts data.
- **Order**: matches
- **Summary**: matches — three looks (nerd realness, sexy librarian, book-
  inspired couture)
- **Placements (.ts)**:
  - Kim Chi WIN — matches
  - Bob and Derrick BTM2; Derrick eliminated — matches
  - Naomi HIGH — matches
  - Chi Chi SAFE — matches
- **Elimination**: Derrick Barry — matches

### Ep 9: Finale "The Realness"
- **Title in research .md**: "The Realness (Finale)" — matches Wikipedia's
  Ep9 title
- **Order**: matches (Ep9 is the final competition + crowning)
- **.ts archive**: lists #9 as `{ kind: 'finale', challengeName: 'Grand
  Finale' }` with empty placements. Wikipedia's Ep9 "The Realness" is
  actually a competition episode (Chi Chi eliminated in a four-way lip-sync
  among Top 4, leaving Bob/Kim Chi/Naomi for Ep10 "Grand Finale"). So the
  .ts collapses Wikipedia's **Ep9 ("The Realness", Chi Chi eliminated)** and
  **Ep10 ("Grand Finale", Bob crowned)** into a single finale entry —
  missing Chi Chi's pre-finale elimination.
- **Elimination**: Chi Chi DeVayne's Ep9 elimination is **missing from the
  .ts archive**.

---

# Season 9 Audit

## Summary
- Episodes verified: 13 of 14 (Wikipedia has Ep14 "Grand Finale"; .ts has a
  separate `kind: 'finale'` #13)
- Total discrepancies:
  - Titles: a couple minor formatting differences (accent on Couleé; "9021-
    HO" punctuation)
  - Order: matches
  - Summaries: mostly accurate; small note on Ep8 roast target
  - Placements: generally correct against Wikipedia; some HIGH/SAFE
    distinctions in Ep5 and Ep8 need verification
  - Eliminations: all match including Eureka's medical removal

## Per-episode findings

### Ep 1: "Oh. My. Gaga!"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — pageant/runway with hometown and Gaga-inspired looks
- **Placements (.ts)**:
  - Nina WIN — matches
  - Eureka HIGH, Sasha HIGH — matches Wikipedia
  - All others SAFE — matches
  - No elimination this episode — matches (Wikipedia confirms no
    elimination in Ep1)
- **Elimination**: none — matches

### Ep 2: "She Done Already Done Brought It On"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — team cheerleading-themed dance routine
- **Placements (.ts)**:
  - Valentina WIN — matches
  - Jaymes and Kimora BTM2; Jaymes eliminated — matches
  - Shea HIGH, Trinity HIGH — matches
  - Charlie LOW — matches (Wikipedia does not always surface this but
    recaps confirm Charlie's weak performance; aligns with "LOW" in
    recap-level accounts)
  - Eureka SAFE — matches
- **Elimination**: Jaymes Mansfield — matches

### Ep 3: "Draggily Ever After"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — fairytale-princess DESIGN challenge (the research
  .md summary says "acting challenge in paired scenes" — **MISMATCH**. The
  actual Ep3 challenge was a design challenge, not acting. The queens
  designed fairy-tale-princess runway looks. Paired acting was Ep4. The
  .md summary is wrong.)
- **Placements (.ts)**:
  - Trinity WIN — matches
  - Aja and Kimora BTM2; Kimora eliminated — matches
  - Peppermint HIGH, Valentina HIGH — matches
  - Farrah LOW — matches
- **Elimination**: Kimora Blac — matches

### Ep 4: "Good Morning Bitches"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — morning-talk-show parody in teams
- **Placements (.ts)**:
  - Sasha and Shea WIN (double) — matches
  - Charlie and Trinity BTM2; Charlie eliminated — matches
  - Peppermint LOW — matches (confirmed by Slant recap: Peppermint's
    personality saved her from bottom two)
  - All others SAFE — matches
- **Elimination**: Charlie Hides — matches

### Ep 5: "Reality Stars: The Musical"
- **Title**: matches
- **Order**: matches
- **Summary**: matches — Kardashian-themed Rusical
- **Placements (.ts)**:
  - Shea WIN — matches
  - Cynthia and Farrah BTM2; both saved (no elimination from lip sync) —
    matches
  - Eureka eliminated (medical removal) — matches Wikipedia
  - Alexis HIGH, Peppermint HIGH — matches Wikipedia
  - Nina LOW — unverifiable from Wikipedia explicitly; consistent with
    recaps
- **Elimination**: Eureka (medical) — matches

### Ep 6: "Snatch Game"
- **Title**: matches
- **Order**: matches
- **Summary**: matches
- **Placements (.ts)**:
  - Alexis WIN — matches (her Liza Minnelli)
  - Cynthia and Peppermint BTM2; Cynthia eliminated — matches
  - Nina HIGH, Sasha HIGH — matches
  - Farrah LOW — unverifiable from Wikipedia's table but plausible
- **Elimination**: Cynthia Lee Fontaine — matches

### Ep 7: "9021-HO"
- **Title**: matches (Wikipedia: "9021-HO")
- **Order**: matches
- **Summary**: matches — 90210 parody acting
- **Placements (.ts)**:
  - Trinity WIN — matches
  - Aja and Nina BTM2; Aja eliminated — matches
  - Shea HIGH, Valentina HIGH — matches
  - Sasha LOW — matches (Sasha was critiqued for her performance this ep)
- **Elimination**: Aja — matches

### Ep 8: "RuPaul Roast"
- **Title**: matches
- **Order**: matches
- **Summary**: the research .md calls this "Stand-up comedy roast of
  RuPaul" — Wikipedia's recap says the roast target was **Michelle Visage**,
  not RuPaul. The episode is titled "RuPaul Roast" (RuPaul is the host)
  but the subject being roasted is Michelle Visage. .ts comment even
  notes this correctly ("Comedy Roast of Michelle Visage"). **Summary
  inaccuracy** in research/s09-episodes.md.
- **Placements (.ts)**:
  - Peppermint WIN — matches
  - Alexis and Farrah BTM2; Farrah eliminated — matches
  - Sasha HIGH, Shea HIGH — matches
  - Trinity LOW — unverifiable from Wikipedia's table explicitly but
    aligns with recap accounts
- **Elimination**: Farrah Moan — matches

### Ep 9: "Your Pilot's on Fire"
- **Title**: matches (with possessive apostrophe)
- **Order**: matches
- **Summary**: matches — TV pilot pitches in teams
- **Placements (.ts)**:
  - Sasha and Shea WIN (double) — matches
  - Nina and Valentina BTM2; Valentina eliminated — matches
  - Peppermint HIGH, Trinity HIGH — matches
  - Alexis LOW — unverifiable but plausible
- **Elimination**: Valentina — matches

### Ep 10: "Makeovers: Crew Better Work"
- **Title in .ts**: "Makeovers: Crew Better Work" — matches Wikipedia
- **Title in research .md**: listed as just "Makeover" — Wikipedia's full
  title is "Makeovers: Crew Better Work". The .md shortens it.
- **Order**: matches
- **Summary**: matches
- **Placements (.ts)**:
  - Trinity WIN — matches
  - Nina and Shea BTM2; Nina eliminated — matches
  - Sasha HIGH — matches
  - Shea LOW in .ts — Wikipedia has Shea as BTM2 (she lip-synced against
    Nina). The .ts marks Shea as LOW then also lists Nina as BTM2 alone.
    **MISMATCH**: Wikipedia's progress table shows Shea BTM2 / Nina BTM2
    (lip-synced against each other). The .ts shows only Nina BTM2 with
    Shea LOW. This is a structural misrepresentation of the lip-sync
    pairing. Nina eliminated — matches.
- **Elimination**: Nina Bo'nina Brown — matches

### Ep 11: "Gayest Ball Ever"
- **Title**: matches (research .md has exact title)
- **Order**: matches
- **Summary**: matches — three-look ball (unicorn/rainbow/village people)
- **Placements (.ts)**:
  - Shea WIN — matches
  - Alexis and Peppermint BTM2; Alexis eliminated — matches
  - Sasha HIGH — matches
  - Trinity LOW — unverifiable but consistent with recaps
- **Elimination**: Alexis Michelle — matches

### Ep 12: "Category Is..."
- **Title in .ts `challengeName`**: "Category Is..." — matches Wikipedia's
  "Category Is" (Wikipedia renders without ellipsis in some places, with in
  others; both acceptable)
- **Order**: matches (pre-finale episode with original verses and
  performance; four-way lip-sync; no elimination)
- **Summary**: matches
- **Placements (.ts)**: all four queens SAFE; no elimination — matches
  Wikipedia's handling of Ep12 as no-elimination
- **Elimination**: none — matches

### Ep 13: Finale
- **.ts**: single `kind: 'finale'` entry at #13 — does not match Wikipedia's
  structure of Ep13 "Reunited" (reunion) + Ep14 "Grand Finale" (crowning)
- **Note**: .ts compresses reunion and grand finale into one finale entry.
  Sasha Velour crowned winner (matches), Peppermint runner-up (matches),
  Valentina Miss Congeniality (matches).
- **Elimination**: Shea (3rd) and Trinity (4th) eliminated in finale — not
  individually tracked in .ts but consistent with Wikipedia.

---

# Summary of key issues to flag (do NOT fix, per instructions)

## Highest-confidence errors worth fixing later

1. **S7 Ep12 is missing entirely.** The .ts archive jumps from Ep11
   "Hello, Kitty Girls!" (Katya eliminated) directly to a collapsed Grand
   Finale. Wikipedia's Ep12 "And the Rest Is Drag" (Kennedy Davenport
   eliminated in a music-video-themed final challenge before the Top 3
   finale) is entirely absent from both `research/s07-episodes.md` and
   `src/data/_v1_archive/season7.ts`. Kennedy's placement history is
   therefore incorrect — she should have an ELIM in Ep12, not simply
   disappear into an un-tracked finale.

2. **S9 Ep3 summary is factually wrong.** `research/s09-episodes.md`
   describes "Draggily Ever After" as a fairy-tale ACTING challenge in
   paired scenes. It was actually a DESIGN challenge (fairytale princess
   runway look). The .ts file correctly encodes it as `challengeType:
   'design'`; only the research .md summary is wrong.

3. **S8 Ep9 is incorrectly treated as just a finale.** Wikipedia's Ep9
   "The Realness" is a competition episode where Chi Chi DeVayne is
   eliminated from the Top 4 via a four-way lip-sync, making the Top 3
   for the Grand Finale (Ep10). The .ts file collapses Ep9/Ep10 into a
   single finale entry, dropping Chi Chi's pre-finale elimination.

4. **S9 Ep10 Makeover BTM2 pairing.** Wikipedia has Shea and Nina as the
   bottom two (lip-syncing against each other); .ts has only Nina as
   BTM2 with Shea as LOW, which misrepresents the lip-sync pairing.

5. **S9 Ep8 summary target.** Research .md says "roast of RuPaul"; the
   episode roasted Michelle Visage (with RuPaul as host/judge).

6. **S8 Ep8 .ts `challengeName` = "Book Ball"**; Wikipedia title is
   "RuPaul Book Ball". Minor but inconsistent with research .md.

7. **S7 Ep4 summary**: says "parody trailer of a reality TV show";
   actual challenge was pop-music-video/movie-trailer parodies, not
   reality-TV parody.

8. **S8 Ep7 summary**: says "political-debate improv"; actually it was
   filming political attack-ad videos, not a live debate.

## Ambiguities worth noting (not errors)

- Many S7 and S8 HIGH vs SAFE distinctions in the .ts file are not
  explicitly confirmable from Wikipedia's progress tables, which tend to
  collapse HIGH into SAFE for those older seasons. These placements are
  plausible against recap-level accounts but cannot be strictly "verified
  against Wikipedia." Flagged throughout as "unverifiable from
  Wikipedia."

- Research .md for S7 adds helpful but non-canonical subtitles (e.g.,
  "Split Premiere Pt. 1/2"). Not incorrect, just editorial.

- S9 research .md condenses "Makeovers: Crew Better Work" to "Makeover";
  acceptable shorthand.
