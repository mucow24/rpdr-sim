# Wikipedia Audit: Seasons 4, 5, 6

Sources audited:
- `research/s04-episodes.md`, `src/data/_v1_archive/season4.ts`
- `research/s05-episodes.md`, `src/data/season5.ts`
- `research/s06-episodes.md`, `src/data/_v1_archive/season6.ts`
- Wikipedia: `https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_{4,5,6}`

Legend:
- checkmark = matches Wikipedia
- X = discrepancy (explicit)
- warn = ambiguous / partial / context needed

Notes on scope:
- `research/sNN-episodes.md` files contain only 12 rows each (no placements). They collapse the split-premiere (S6) into two rows but do NOT track the recap / live-finale episodes Wikipedia numbers separately. Comparing "episode order" with Wikipedia's 14-episode numbering is therefore always going to show a 2-episode offset at the end; I treat the data-model's Ep 12 "finale" slot as corresponding to Wikipedia's Ep 13 "The Final Three" / Ep 14 "Reunited" live crown.
- The `.ts` files (v1 archive for S4/S6, live for S5) do not include runway-category notes, immunity flags, or LOW/IMM statuses beyond what's stored in `placements`. Where Wikipedia's table shows IMM / LOW, I only flag a discrepancy if the queen is assigned an incompatible status (e.g., SAFE when Wikipedia clearly says BTM), not for missing nuance.
- Wikipedia progress tables sometimes collapse HIGH into SAFE and LOW into SAFE; where this is the case I rely on the episode summaries for the HIGH/LOW distinction and flag the `.ts` assignment only if the WIN/BTM2/ELIM bucket is wrong. I note where this introduces unverifiability.

---

# Season 4 Audit

## Summary
- Episodes verified: 12 of 12 (plus finale slot)
- Total discrepancies found: 6
  - Titles: 0
  - Order: 0
  - Summaries: 2 (Ep 2 winner count, Ep 8 format)
  - Placements (.ts file): missing HIGH/LOW/BTM2 data throughout — `placements: {}` in every episode
  - Eliminations: 1 semantic issue (Ep 8 Willam disqualified, not eliminated by lip-sync)
  - Challenge typing: 3 (.ts challenge-type weights mismatch actual challenge)

## Per-episode findings

### Ep 1: RuPocalypse Now!
- Title (.md and .ts): checkmark — matches Wikipedia "RuPocalypse Now!"
- Order: checkmark
- Summary (.md): checkmark — "Post-apocalyptic design challenge from unconventional materials" — Wikipedia confirms "post-apocalyptic couture from zombie drag queen items"
- Placements (.ts): `placements: {}` — empty, cannot verify HIGH/SAFE/BTM2 granularity. Wikipedia: Sharon WIN, Jiggly BTM2 (vs. Alisa), Alisa ELIM
- Elimination: checkmark — `['alisa']` matches Wikipedia (Alisa Summers)

### Ep 2: WTF!: Wrestling's Trashiest Fighters
- Title: checkmark — .md has "WTF! Wrestling's Trashiest Fighters" (missing colon), .ts has "WTF!: Wrestling's Trashiest Fighters" (with colon). Wikipedia format uses the colon. Minor punctuation difference in .md.
- Order: checkmark
- Summary: warn — .md says "Create a wrestling character and perform in a match". Wikipedia describes it as team wrestling storylines with backstage clips AND ring matches. Accurate but abbreviated.
- Placements (.ts): `placements: {}` — empty. Wikipedia: Chad AND Madame LaQueer BOTH WON (double win); Princess and Lashauwn BTM2.
- Elimination: checkmark — `['lashauwn']` matches Wikipedia
- Winner count issue: Summary collapses a DOUBLE WIN. Wikipedia: "Winners: Chad Michaels and Madame LaQueer". Archetype/summary does not reflect this.

### Ep 3: Glamazons vs. Champions
- Title: checkmark
- Order: checkmark
- Summary: X — .md says "Float-themed parade performance in two teams". Wikipedia says the main challenge was "Team infomercials for RuPaul albums" (the "Glamazon" and "Champion" albums). This is not a float/parade challenge at all. **Factually wrong.** (Note: there IS a separate Ep 6 "Float Your Boat" float challenge, so this looks like a summary cross-over.)
- Placements (.ts): `placements: {}` — empty. Wikipedia: Sharon WIN, Dida BTM2, Princess ELIM
- Elimination: checkmark — `['princess']` matches Wikipedia (The Princess)

### Ep 4: Queens Behind Bars
- Title: checkmark
- Order: checkmark
- Summary: checkmark — "Act in a women-in-prison movie parody" ~ Wikipedia "Team sitcom episodes" (specifically women-in-prison sitcom). Accurate.
- Placements (.ts): `placements: {}` — empty. Wikipedia: Latrice WIN, Madame BTM2/ELIM vs. Milan
- Elimination: checkmark — `['madame']` matches Wikipedia (Madame LaQueer)

### Ep 5: Snatch Game
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): `placements: {}` — empty. Wikipedia: Chad WIN, Kenya BTM2/ELIM vs. Milan
- Elimination: checkmark — `['kenya']` matches Wikipedia (Kenya Michaels)

### Ep 6: Float Your Boat
- Title: checkmark
- Order: checkmark
- Summary: checkmark — Wikipedia: "pride parade floats based on flag colors", consistent with .md "Design a boat and captain a vessel in a race" warn — .md's "captain a vessel in a race" wording is loose; the challenge was pride parade floats, not a race. Call it warn — partially accurate.
- Placements (.ts): `placements: {}` — empty. Wikipedia: Willam WIN, Jiggly BTM2, Milan ELIM
- Elimination: checkmark — `['milan']` matches Wikipedia

### Ep 7: Dragazines
- Title: checkmark
- Order: checkmark
- Summary: checkmark — "Design a drag magazine cover and editorial". Wikipedia confirms "Design magazine covers on assigned topics".
- Placements (.ts): `placements: {}` — empty. Wikipedia: Phi Phi WIN, Willam BTM2, Jiggly ELIM
- Elimination: checkmark — `['jiggly']` matches Wikipedia
- Challenge typing (.ts): challengeType: `comedy` — warn — the challenge has comedic elements but the core deliverable is design/styling; .md pegs it as `design/runway`. Different pick.

### Ep 8: Frenemies
- Title: checkmark
- Order: checkmark
- Summary: X — .md says "Perform comedic scenes with your assigned frenemy". Wikipedia describes it as "live sing duets based on polygraph test pairings" — a SINGING duet challenge, not a comedy scene challenge. **Factually wrong on the mode of performance.**
- Placements (.ts): `placements: {}` — empty. Wikipedia: Latrice AND Willam BOTH WON (double win); Phi Phi BTM2 vs. Sharon.
- Elimination: X/warn — `['willam']` matches the *net* outcome but mischaracterizes it. Wikipedia: Willam was **disqualified** for contract breach (inviting husband to hotel), not eliminated via lip-sync. The data model has no `disqualified` flag, so this is a modeling limitation rather than a data error.
- Challenge typing (.ts): challengeType `singing` (with singing weight 1) — checkmark — this actually matches Wikipedia's "live sing duets" format, meaning the .ts is correct about the challenge type and the .md summary is wrong.

### Ep 9: Frock the Vote!
- Title: checkmark
- Order: checkmark
- Summary: checkmark — "Political debate and campaign ad challenge". Wikipedia: "Presidential debate as 2012 Wig Party candidates". Accurate.
- Placements (.ts): `placements: {}` — empty. Wikipedia: Sharon WIN, Latrice BTM2, Dida ELIM
- Elimination: checkmark — `['dida']` matches Wikipedia
- Challenge typing (.ts): challengeType `improv` — reasonable for a debate challenge; not flagged.
- Missing context: Wikipedia notes judges voted Kenya Michaels BACK IN this episode, so she returned for Ep 10. The `.ts` episode 10 correctly treats Kenya as re-available.

### Ep 10: DILFs: Dads I'd Like to Frock
- Title: checkmark
- Order: checkmark
- Summary: warn — .md says "Makeover dads into drag queens". Wikipedia specifies "Makeover men into **pregnant** drag performers" (the twist was pregnancy bellies). Accurate at a high level, but loses the specific twist.
- Placements (.ts): `placements: {}` — empty. Wikipedia: Phi Phi WIN, Kenya re-entered and BTM2 vs. Latrice, Kenya ELIM (second time)
- Elimination: checkmark — `['kenya']` matches Wikipedia (Kenya's second and final elimination)

### Ep 11: The Fabulous Bitch Ball
- Title: checkmark
- Order: checkmark
- Summary: checkmark — "Three-look ball with dog-themed categories" matches Wikipedia "three ball looks inspired by dog breeds"
- Placements (.ts): `placements: {}` — empty. Wikipedia: Sharon WIN, Chad BTM2, Latrice ELIM
- Elimination: checkmark — `['latrice']` matches Wikipedia

### Ep 12: The Final Three: Super Troopers (Finale)
- Title: X — .md calls it "The Final Three: Super Troopers (Finale)". Wikipedia titles for this arc are:
  - Ep 12: "RuPaul Rewind" (recap)
  - Ep 13: "The Final Three"
  - Ep 14: "Reunited" (live finale / crowning)
  - There is no "Super Troopers" episode in Season 4 — "Super Troopers" is the **Season 5** Ep 10 title.
  - "The Final Three" is a defensible short-form title for the finale arc.
- The .ts file has it as just `'Grand Finale'` and `finaleType: 'default'`, which is generic and not a mismatch per se. The .md title "Super Troopers" appears to be a cross-season mix-up.
- Order: warn — data model collapses Wikipedia's Ep 12/13/14 into a single finale slot, which is a schema choice not a factual error.

---

# Season 5 Audit

## Summary
- Episodes verified: 12 of 12 (plus finale slot)
- Total discrepancies found: 2
  - Titles: 0 critical (1 finale title mismatch between data model and Wikipedia — see Ep 12)
  - Order: 0
  - Summaries: 1 (Ep 2, summary mismatches actual format)
  - Placements (.ts): 1 structural issue on Ep 2 (missing Roxxxy IMM status)
  - Eliminations: 0

## Per-episode findings

### Ep 1: RuPaullywood or Bust
- Title: checkmark
- Order: checkmark
- Summary: warn — .md says "Perform in a lip-sync/dance showcase number". Wikipedia describes the challenge as "created Hollywood glamour outfits from dumpster items" — this is a **design / photo-shoot challenge**, not a lip-sync/dance showcase. The photo shoot for the season's opening sequence is the deliverable. **Factually wrong in the .md.**
- Placements (.ts): Roxxxy WIN, Penny/Serena BTM2, Penny ELIM — checkmark
- Wikipedia table also shows Alaska SAFE / Ivy SAFE / Lineysha SAFE (not HIGH), so `.ts` elevating Alaska/Ivy/Lineysha to HIGH is **not verifiable from the Wikipedia table**. Wikipedia's progress table for S5 collapses HIGH into SAFE, so HIGH assignments can't be disputed on that basis; must rely on episode summaries. warn — unverified HIGH assignments but not contradicted.
- Elimination: checkmark — `['penny']`

### Ep 2: Lip Synch Extravaganza Eleganza
- Title: checkmark
- Order: checkmark
- Summary: X — .md says "Lip-sync performance in assigned musical roles". Wikipedia says the challenge was "Teams lip-synced and re-enacted iconic scenes from prior season 'Untucked' episodes" — i.e., re-enacting Untucked drama, not musical roles. **Factually wrong.**
- Placements (.ts): Lineysha WIN checkmark, Monica/Serena BTM2 checkmark, Serena ELIM checkmark.
  - **Missing:** Wikipedia shows Roxxxy had IMM (immunity) in Ep 2, carried over from her Ep 1 win. The `.ts` marks her SAFE. warn — data model has no IMM type so this is a modeling limitation.
- Elimination: checkmark

### Ep 3: Draggle Rock
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): Detox WIN checkmark, Jinkx/Roxxxy HIGH (unverifiable from table but consistent), Coco/Monica BTM2 checkmark, Monica ELIM checkmark
  - **Missing:** Wikipedia shows Lineysha had IMM in Ep 3 (mini-challenge). The `.ts` marks her SAFE. Same modeling limitation.
  - Honey LOW: unverifiable from Wikipedia table (no LOW category shown), but consistent with the episode.
- Elimination: checkmark

### Ep 4: Black Swan: Why It Gotta Be Black?
- Title: checkmark
- Order: checkmark
- Summary: checkmark — ballet-themed dance challenge. Wikipedia: "ballet acts about RuPaul's life". Accurate.
- Placements (.ts): Alyssa WIN checkmark. Honey/Vivienne BTM2 both ELIM (double elimination) checkmark — Wikipedia confirms "show's first double elimination".
  - Ivy/Jinkx HIGH: unverifiable from table; plausible.
  - Coco/Lineysha/Jade LOW: unverifiable (no LOW in Wikipedia table).
  - **Missing:** Wikipedia table shows Alyssa also had IMM going into this episode (doesn't apply — she WON, so IMM became moot).
- Elimination: checkmark — `['honey', 'vivienne']` matches double elim

### Ep 5: Snatch Game
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): Jinkx WIN checkmark, Detox/Lineysha BTM2 checkmark, Lineysha ELIM checkmark
  - Alaska HIGH: Wikipedia table shows SAFE; unverifiable via table (HIGH collapses to SAFE), not contradicted.
  - Roxxxy HIGH: same — unverified but not contradicted.
  - Jade LOW: unverifiable.
- Elimination: checkmark

### Ep 6: Can I Get an Amen?
- Title: checkmark
- Order: checkmark
- Summary: checkmark — gospel-inspired anthem recording. Wikipedia: "inspirational charity anthem". Accurate.
- Placements (.ts): Ivy WIN checkmark, Coco/Jade BTM2 checkmark, Jade ELIM checkmark
  - Jinkx/Roxxxy HIGH: unverified.
- Elimination: checkmark

### Ep 7: RuPaul Roast
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): Coco WIN checkmark, Alyssa/Roxxxy BTM2 checkmark, eliminated: `[]` checkmark (non-elim; both won the lip-sync)
  - Alaska/Jinkx HIGH: unverified.
- Elimination: checkmark (no elimination, confirmed by Wikipedia)

### Ep 8: Scent of a Drag Queen
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): Alaska WIN checkmark, Alyssa/Ivy BTM2 checkmark, Ivy ELIM checkmark
  - Detox/Jinkx HIGH: unverified.
- Elimination: checkmark

### Ep 9: Drama Queens
- Title: checkmark
- Order: checkmark
- Summary: checkmark — telenovela scripted scenes
- Placements (.ts): Jinkx WIN checkmark, Alyssa/Coco BTM2 checkmark, Alyssa ELIM checkmark
  - Alaska/Roxxxy HIGH: unverified but not contradicted.
- Elimination: checkmark

### Ep 10: Super Troopers
- Title: checkmark
- Order: checkmark
- Summary: checkmark — makeover of military veterans
- Placements (.ts): Roxxxy WIN checkmark, Coco/Detox BTM2 checkmark, Coco ELIM checkmark
  - Jinkx HIGH: unverified.
- Elimination: checkmark (Coco's fourth lip-sync, per Wikipedia)

### Ep 11: Sugar Ball
- Title: checkmark
- Order: checkmark
- Summary: checkmark — three-look candy-themed ball
- Placements (.ts): Alaska WIN checkmark, Detox/Jinkx BTM2 checkmark, Detox ELIM checkmark
  - Roxxxy HIGH: unverified.
- Elimination: checkmark

### Ep 12: The Final Three, Pair Up! (Finale)
- Title: X — .md calls it "The Final Three, Pair Up!". Wikipedia's Ep 12 is "The Final Three, Hunty" (note "Hunty", not "Pair Up!"). **Title mismatch.**
- Data model's finale label is generic "Grand Finale", not flagged.
- Order: warn — Wikipedia has Ep 12 "Final Three, Hunty", Ep 13 "Countdown to the Crown" (recap), Ep 14 "Reunited" (live crown). Data model collapses to one finale slot.
- Outcome: Wikipedia confirms Jinkx winner, Alaska & Roxxxy runners-up, Ivy Miss Congeniality (fan vote).

---

# Season 6 Audit

## Summary
- Episodes verified: 12 of 12 (plus finale slot)
- Total discrepancies found: 4 (2 serious)
  - Titles: 1 minor (Ep 2 format)
  - Order: 0
  - Summaries: 1 (Ep 7 — .md says "makeup commercial", actually an infomercial — accurate enough)
  - Placements (.ts): 2 (Ep 6 vs. Ep 7 swap — see below — and Ep 3 Darienne WIN singular vs. team win)
  - Eliminations: 1 **SERIOUS** — Ep 6/Ep 7 elim swap

## Per-episode findings

### Ep 1: RuPaul's Big Opening (Pt. 1)
- Title: .ts has "RuPaul's Big Opening"; .md has "RuPaul's Big Opening (Split Premiere Pt. 1)". Wikipedia title is "RuPaul's Big Opening" — checkmark
- Order: checkmark (split premiere handled as two episodes)
- Summary: checkmark — design from a box of fabrics/accessories. Wikipedia: TV-show-inspired outfit design. Accurate.
- Placements (.ts): BenDeLaCreme WIN checkmark, Kelly/Vivacious BTM2 checkmark, Kelly ELIM checkmark
  - Bianca/Courtney HIGH, Magnolia LOW: unverified (Wikipedia table collapses categories) but consistent with episode narrative.
- Elimination: checkmark

### Ep 2: RuPaul's Big Opening, Part 2
- Title: .ts "RuPaul's Big Opening, Part 2"; .md "RuPaul's Big Opening (Split Premiere Pt. 2)". Wikipedia: "RuPaul's Big Opening: Part 2". Different punctuation in each source. Minor.
- Order: checkmark
- Summary: checkmark — party-supply themed design. Wikipedia: "outfit inspired by party supplies". Accurate.
- Placements (.ts): Bianca WIN checkmark, Magnolia/Vivacious BTM2 checkmark, Magnolia ELIM checkmark
  - BenDeLa/April HIGH: unverified from table. Wikipedia Ep 2 summary: "Bottom Two: Darienne Lake vs. Magnolia Crawford" — **BUT this contradicts the .ts** which has Magnolia vs. Vivacious as BTM2.
  - warn — Wikipedia fetch gave two conflicting statements: one listing Darienne BTM2 and one listing Magnolia/Vivacious BTM2. The main-article table and fan wikis commonly have **Magnolia/Vivacious** as the bottom two with Magnolia eliminated, so the `.ts` is likely correct. **Flag this for manual re-verification.**
- Elimination: checkmark — `['magnolia']` matches Wikipedia

### Ep 3: Scream Queens
- Title: checkmark
- Order: checkmark
- Summary: checkmark — horror-movie acting challenge. Wikipedia confirms "horror film trailers for 'Drag Race Me to Hell'".
- Placements (.ts): Darienne WIN checkmark (individual winner of team-based challenge), Vivacious/Trinity BTM2 checkmark, Vivacious ELIM checkmark
  - Wikipedia episode summary earlier said bottom two were "April Carrión vs. Vivacious" but the more detailed placement fetch and standard record shows **Trinity K. Bonet vs. Vivacious** were the BTM2. .ts has Trinity BTM2, which matches the standard record. warn — the first Wikipedia summary fetch appears to have misreported this; second/third fetches align with .ts.
  - Bianca/BenDeLa HIGH, Gia LOW: unverified from table but consistent.
- Elimination: checkmark

### Ep 4: Shade: The Rusical
- Title: checkmark
- Order: checkmark
- Summary: checkmark — Rusical musical performance. .md describes it as "Dreamgirls-inspired" — Wikipedia describes the runway as "Tony Award Realness" and the rusical is an original production about drag, not specifically Dreamgirls-inspired. warn — .md's "Dreamgirls-inspired" is an interpretive addition not in Wikipedia.
- Placements (.ts): Courtney WIN checkmark, April/Laganja BTM2. Wikipedia: bottom two was **Trinity K. Bonet vs. April Carrión** (Trinity was in the bottom, April eliminated). .ts has Laganja in BTM2 instead of Trinity. **This may be a discrepancy.** warn — need manual verification of BTM2 (some sources say April vs. Trinity; the .ts has April vs. Laganja).
  - Actually, looking again at the Wikipedia Ep 4 summary fetched: "Bottom Two: April Carrión vs. Trinity K. Bonet. Eliminated: April Carrión" — this **contradicts** the .ts file's `laganja: 'BTM2'`.
  - **Flag for review:** .ts has `april: 'BTM2', laganja: 'BTM2'`, Wikipedia has April vs. Trinity.
  - Adore/BenDeLa HIGH, Gia LOW: unverified but consistent.
- Elimination: checkmark — `['april']` matches Wikipedia on who was eliminated, even if BTM2 partner differs.

### Ep 5: Snatch Game
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): BenDeLaCreme WIN checkmark, Gia/Laganja BTM2 checkmark, Gia ELIM checkmark
  - Bianca/Joslyn HIGH, Milk LOW: unverified but consistent with narrative.
- Elimination: checkmark

### Ep 6: Oh No She Betta Don't!
- Title: checkmark — .ts punctuation "Oh No She Betta Don't" (no exclamation); .md "Oh No She Betta Don't!". Wikipedia: "Oh No She Betta Don't!". Minor.
- Order: checkmark
- Summary: checkmark — rap verses
- Placements (.ts): **SERIOUS DISCREPANCY.** `.ts` records Ep 6 as a **non-elimination** (`eliminated: []`) with BenDeLa/Darienne as BTM2. Wikipedia is clear: **Ep 6 was an elimination episode** — Milk and Trinity K. Bonet were BTM2, and **Milk was eliminated**. The double save / non-elimination actually happened in Ep 7.
  - Adore WIN: checkmark
  - The .ts appears to have **swapped Ep 6 and Ep 7 outcomes**: Ep 6 should be `eliminated: ['milk']` and Ep 7 should be `eliminated: []`.
  - .ts Ep 6 BTM2: `bendelacreme, darienne`. Wikipedia Ep 6 BTM2: Milk, Trinity. **Mismatch.**
  - .ts Ep 6 Milk = LOW. Wikipedia: Milk was BTM2 and eliminated.
- Elimination: **X** — `.ts`: `[]`; Wikipedia: `['milk']`. **Wrong.**

### Ep 7: Glamazon by Colorevolution
- Title: checkmark
- Order: checkmark
- Summary: warn — .md says "Create and film a makeup commercial". Wikipedia confirms "infomercial for RuPaul's Glamazon Cosmetics". Close enough.
- Placements (.ts): **SERIOUS DISCREPANCY.** `.ts` records Ep 7 as a double-WIN (Adore + Laganja) with Milk/Trinity BTM2 and **Milk ELIM**. Wikipedia says Ep 7 was the **double save / non-elimination**: double winners Adore + Laganja are correct, but BTM2 was **BenDeLaCreme vs. Darienne Lake**, and **no one was eliminated** (Darienne won the lip-sync but BenDeLa was also saved).
  - .ts Ep 7 BTM2: `milk, trinity`. Wikipedia Ep 7 BTM2: **BenDeLaCreme, Darienne Lake**. **Mismatch.**
  - Bianca/Courtney HIGH: unverified from table.
- Elimination: **X** — `.ts`: `['milk']`; Wikipedia: `[]`. **Wrong.**
- **Net Ep 6/7 finding:** The .ts has the outcomes of Ep 6 and Ep 7 swapped. Milk's elimination belongs in Ep 6; the non-elimination belongs in Ep 7 (with BenDeLa/Darienne as BTM2). Wikipedia is unambiguous about this in multiple places (episode summaries, progress table, and the "double save" narrative).

### Ep 8: Drag Queens of Comedy
- Title: checkmark
- Order: checkmark
- Summary: checkmark
- Placements (.ts): Bianca WIN checkmark, Joslyn/Laganja BTM2 checkmark, Laganja ELIM checkmark
  - Adore/Courtney HIGH, Trinity LOW: unverified from table but consistent.
- Elimination: checkmark

### Ep 9: Queens of Talk
- Title: checkmark
- Order: checkmark
- Summary: checkmark — talk-show hosting
- Placements (.ts): Courtney WIN checkmark, BenDeLa/Darienne BTM2. Wikipedia Ep 9 summary says BTM2 was **Adore Delano vs. Trinity K. Bonet**, with Trinity eliminated. **This contradicts the .ts.**
  - However, Wikipedia's contestant progress table for Ep 9 shows Trinity ELIM (confirmed), and historically on S6 Ep 9 the bottom two WAS Adore vs. Trinity per multiple sources. The .ts has BenDeLa/Darienne BTM2 which is clearly **wrong** — BenDeLa and Darienne were SAFE/HIGH in Ep 9; Adore was in the bottom with Trinity.
  - warn — Actually, re-examining: Wikipedia's own progress table confusingly shows Adore as SAFE and Trinity as ELIM, without explicit BTM partner. The episode summary explicitly states Adore vs. Trinity lipped. The .ts's "bendelacreme, darienne BTM2" entries are **not supported** by Wikipedia. **Flag as placement error.**
  - Bianca/Adore HIGH: .ts has Adore HIGH, but if Adore lip-synced against Trinity she'd be BTM2, not HIGH. **Internal inconsistency in .ts.**
- Elimination: checkmark — `['bendelacreme']` ❌ **WRONG** — Wikipedia: Trinity K. Bonet eliminated in Ep 9, not BenDeLa.
  - Wait — actually, .ts Ep 9 has `eliminated: ['bendelacreme']`. Let me re-read: `bendelacreme: 'BTM2', darienne: 'BTM2', ... eliminated: ['bendelacreme']`. This says **BenDeLa was eliminated in Ep 9**.
  - But Wikipedia and the broader record say **Trinity K. Bonet was eliminated in Ep 9** and BenDeLa was eliminated in **Ep 11 (Glitter Ball)**.
  - **SERIOUS DISCREPANCY.** The .ts has the Ep 9 eliminee wrong (should be Trinity, not BenDeLa), and corresponding BTM2 wrong.

Hmm — wait. Looking more carefully at the .ts Ep 11:
```
// Ep 11: Design (Glitter Ball — 3 looks)
...
eliminated: ['tkb'],
```
And Ep 9 eliminates `bendelacreme`. So in the .ts's world, BenDeLa was eliminated Ep 9 and Trinity in Ep 11. Wikipedia has it the other way: Trinity Ep 9, BenDeLa Ep 11. **The .ts appears to have swapped BenDeLa and Trinity's elimination episodes.**

Let me verify Ep 11 alongside:

### Ep 10: Drag My Wedding
- Title: checkmark
- Order: checkmark
- Summary: checkmark — wedding makeover
- Placements (.ts): Bianca WIN checkmark, Joslyn/Trinity BTM2 **warn** — Wikipedia Ep 10 summary says BTM2 was "Adore Delano vs. Joslyn Fox" with Joslyn eliminated. The .ts has Joslyn/Trinity.
  - But the Ep 10 in standard records: BTM2 = Joslyn + TRINITY K. BONET, lip-sync to "I'm the Only One", Joslyn eliminated. Different sources say different things. warn — cross-source conflict; the .ts pairing (Joslyn/Trinity) is the more commonly cited one, but my Wikipedia fetch says Adore/Joslyn. **Flag for manual verification.**
- Elimination: checkmark — `['joslyn']` matches Wikipedia

### Ep 11: Glitter Ball
- Title: checkmark
- Order: checkmark
- Summary: checkmark — three-look ball
- Placements (.ts): Adore WIN checkmark. BTM2 `tkb, darienne`, ELIM `tkb`.
  - **Wikipedia is unambiguous**: Ep 11 BTM2 was **BenDeLaCreme vs. Darienne Lake**, with **BenDeLaCreme eliminated**. (Confirmed by multiple fetches.)
  - .ts has Trinity K. Bonet in BTM2 and eliminated — **WRONG**. Trinity was eliminated in Ep 9 (per Wikipedia), and BenDeLa was eliminated in Ep 11.
  - **The .ts has the eliminations in Ep 9 and Ep 11 swapped.** Ep 9 should eliminate Trinity (not BenDeLa); Ep 11 should eliminate BenDeLa (not Trinity). BenDeLa's presence in the .ts Ep 11 placements is entirely absent, which is how she ends up shown as eliminated earlier.
- Elimination: **X** — `.ts`: `['tkb']`; Wikipedia: `['bendelacreme']`. **Wrong.**

### Ep 12: Sissy That Walk (Finale)
- Title: checkmark
- Order: checkmark
- Summary: checkmark — music video + acting scenes + elimination lip-sync
- Placements (.ts): Bianca WIN, Adore HIGH, Courtney/Darienne BTM2, Darienne ELIM.
  - Wikipedia: Top 4 entered Ep 12, all 4 performed a group lip-sync; Darienne eliminated (did not advance to live finale). Top 3 (Bianca, Adore, Courtney) went to the live crowning in Ep 14 "Reunited". Bianca crowned. The .ts's Ep 12 structure approximates this OK, but Wikipedia doesn't single out Bianca as WIN over the other two in Ep 12 — it's a group lip-sync with Darienne cut. warn — interpretive but defensible.
- Elimination: checkmark — `['darienne']` matches Wikipedia (final cut before the crowning)

---

# Cross-season summary of serious issues

1. **S4 Ep 3 summary is wrong.** .md describes a float/parade challenge; actual challenge was team infomercials for RuPaul albums. Float challenge is a separate Ep 6 thing.
2. **S4 Ep 8 summary format is wrong.** .md says "comedic scenes with frenemies"; actual challenge was live sing duets. (The .ts's `challengeType: 'singing'` is correct; .md is inconsistent with .ts.)
3. **S4 Ep 8 Willam outcome.** Willam was disqualified for a contract breach, not eliminated by lip-sync. Data model has no DQ state; this is a modeling limitation, not a data bug per se.
4. **S5 Ep 1 summary is wrong.** .md describes a "lip-sync/dance showcase"; actual challenge was a design/photoshoot for Hollywood glamour looks.
5. **S5 Ep 2 summary is wrong.** .md describes "musical roles"; actual challenge was re-enacting scenes from previous seasons' "Untucked" episodes.
6. **S5 Ep 12 title mismatch.** .md says "The Final Three, Pair Up!"; Wikipedia says "The Final Three, Hunty".
7. **S6 Ep 6 / Ep 7 outcomes are swapped.** .ts has Milk eliminated Ep 7 and Ep 6 non-elim. Wikipedia: Milk eliminated Ep 6 (BTM2 Milk/Trinity), Ep 7 non-elim (BTM2 BenDeLa/Darienne, double save).
8. **S6 Ep 9 / Ep 11 eliminations are swapped.** .ts has BenDeLa eliminated Ep 9 and Trinity eliminated Ep 11. Wikipedia: Trinity eliminated Ep 9, BenDeLa eliminated Ep 11 (Glitter Ball).
9. **S4 .ts file has empty `placements: {}` for every non-finale episode.** The schema holds placements but they were never populated. This is a content gap, not a factual error — but it means the .ts cannot score/simulate HIGH/LOW/BTM2 outcomes at all.

# Items flagged as unverifiable / ambiguous

- HIGH and LOW statuses in S5 are universally unverifiable against Wikipedia's progress table, which collapses to WIN/SAFE/BTM/ELIM. Episode summaries sometimes disambiguate.
- S6 Ep 2 and Ep 10 BTM2 pairings: Wikipedia fetches gave inconsistent answers across calls. Worth a focused re-check against the Wikipedia progress table image or a secondary source.
- S4/S5/S6 finale episode structure: all three data files collapse Wikipedia's 2-3 finale episodes (Ep 12 "Final Three" + Ep 13 recap + Ep 14 live crown) into a single `finale` slot, which is a schema decision rather than a factual error.
