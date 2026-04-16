# Wikipedia Audit — Seasons 13, 14, 15

Source of truth: English Wikipedia season pages, fetched 2026-04-16.

Audited data:
- `research/sNN-episodes.md` (research table: title, order, challenge summary)
- `src/data/_v1_archive/seasonN.ts` (title, order, per-queen `placements`, `eliminated[]`)

## Preamble: placements fields are empty across all three seasons

Every episode in `season13.ts`, `season14.ts`, and `season15.ts` has `placements: {}`. There are **no per-queen WIN/HIGH/SAFE/LOW/BTM2 assignments encoded** in the v1 archive files. Therefore the "Placements (.ts file)" line in every episode below is marked **N/A (empty `placements: {}`)**. The per-queen result comparison the prompt asked for cannot be performed against data that doesn't exist; I'm reporting this as a structural gap rather than fabricating matches or mismatches.

The only queen-level outcome encoded per episode is the `eliminated: [...]` array, which is audited below.

---

# Season 13 Audit

## Summary
- Episodes verified: 14 of 14 competition episodes in `season13.ts` (research `s13-episodes.md` covers eps 2-14; ep 1 "The Pork Chop" is not listed in the research table).
- Total discrepancies: 4 (titles: 1, order: 0, summaries: 0, placements: N/A across the board, eliminations: 0 — plus 3 structural notes)
- Wikipedia lists 16 total episodes including a reunion (ep 15) and a lip-sync-for-the-crown finale (ep 16); the `.ts` collapses those into a single `Grand Finale` at ep 14.

## Per-episode findings

### Ep 1: The Pork Chop (lip-sync extravaganza premiere)
- **Title** (.ts): `"The Pork Chop"` — matches Wikipedia's "The Pork Chop".
- **Research md**: Not present (research table starts at ep 2).
- **Order**: matches.
- **Summary**: research has no entry. The .ts `challengeType: 'dance'` with all weight on `dance` is a reasonable simplification for lip-sync battles; Wikipedia calls this a "Lip-Sync Extravaganza" premiere with six head-to-head lip-syncs where losers voted one out.
- **Placements (.ts)**: N/A (empty `placements: {}`).
- **Elimination**: `['elliott']` is empty in the .ts (`eliminated: []`). Per Wikipedia, **Elliott with 2 Ts was eliminated** in ep 1 (voted out by the six losing lip-syncers, including Elliott himself). **Discrepancy: ep 1 should list Elliott as eliminated, but it's empty.** Note, however, that Elliott returns in ep 2, so the net effect depends on how the engine models this.

### Ep 2: Condragulations
- **Title**: .ts `"Condragulations"` matches; research md `"Condragulations"` matches Wikipedia's "Condragulations".
- **Order**: matches.
- **Summary** (research): "Write and perform a verse in a RuMix of Condragulations" — matches Wikipedia.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches (no elimination; Symone won, Elliott returned to competition).

### Ep 3: Phenomenon
- **Title**: both files and Wikipedia match ("Phenomenon").
- **Order**: matches.
- **Summary**: "Both groups perform a RuMix to Phenomenon" — matches Wikipedia.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches (no elimination; Denali won).

### Ep 4: RuPaulmark Channel
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['kahmora']` — matches Wikipedia (Kahmora Hall eliminated).

### Ep 5: The Bag Ball
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['joey']` — matches (Joey Jay eliminated).

### Ep 6: Disco-mentary
- **Title**: .ts `"Disco-mentary"` and research md `"Disco-Mentary"` — Wikipedia uses "Disco-mentary" (lowercase m). Research file has a minor capitalization mismatch; the .ts matches Wikipedia.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['tamisha']` — matches (Tamisha Iman eliminated).

### Ep 7: Bossy Rossy: The RuBoot
- **Title**: .ts `"Bossy Rossy: The RuBoot"` and research `"Bossy Rossy: The RuBoot"`. Wikipedia's article title for this episode is "Bossy Rossy RuBoot" (no colon, no "The"). Minor title discrepancy — both local files carry the same long-form variant. Low-severity.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['lala']` — matches (LaLa Ri eliminated).

### Ep 8: Social Media: The Unverified Rusical
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches (no elimination; Symone won lip-sync against Kandy Muse).

### Ep 9: Snatch Game
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['elliott']` — matches (Elliott with 2 Ts eliminated, for the second time).

### Ep 10: Freaky Friday Queens
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches (makeover/doppelganger challenge).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['denali']` — matches (Denali eliminated).

### Ep 11: Pop! Goes the Queens
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['tina']` — matches (Tina Burner eliminated).

### Ep 12: Nice Girls Roast
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['utica']` — matches (Utica Queen eliminated).

### Ep 13: Henny, I Shrunk the Drag Queens!
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['olivia']` — matches (Olivia Lux eliminated).

### Ep 14: Gettin' Lucky / Grand Finale
- **Title**: .ts uses `"Grand Finale"`; research md uses `"Gettin' Lucky (Finale)"`. Wikipedia distinguishes: **ep 14 is "Gettin' Lucky"** (write/record verses to "Lucky"; final four established), **ep 15 is "Reunited"**, **ep 16 is "Grand Finale"** (lip-sync smackdown, Symone crowned over Kandy Muse). Structural: the .ts compresses three Wikipedia episodes into one finale slot. This is a known intentional simplification of the engine's data model, not an error; flagging for awareness.
- **Order**: per the local 14-episode model, matches.
- **Summary**: research `"Write and perform original verses in a RuMix to Lucky"` matches what Wikipedia calls ep 14. It does **not** describe the actual crowning (ep 16).
- **Placements (.ts)**: N/A (final four Symone/Kandy/Rosé/Gottmik not recorded). Winner per Wikipedia: **Symone**. Runner-up: Kandy Muse. The .ts does not encode this outcome.
- **Elimination**: `.ts: []`. In the actual series, Gottmik and Rosé are eliminated in the ep-16 lip-sync smackdown before Symone defeats Kandy Muse; none of this is encoded.

## Season 13 additional notes
- Wikipedia's contestant progress chart for ep 1 shows "STAY"/"LOSS" rather than WIN/HIGH/SAFE/LOW/BTM because the format was the lip-sync premiere; I did not find a canonical WIN-per-queen for ep 1 that would cleanly map to the sim's schema.

---

# Season 14 Audit

## Summary
- Episodes verified: 14 of 14 in `season14.ts` (research `s14-episodes.md` lists 13 — it **skips episode 11 entirely**).
- Total discrepancies: 4 (titles: 2, order: 1 structural, summaries: 0, placements: N/A across the board, eliminations: 0 — research md has a missing episode which is a structural gap).
- Wikipedia lists 16 total episodes including a reunion (ep 15) and finale (ep 16).

## Per-episode findings

### Ep 1: Big Opening #1
- **Title**: .ts `"Big Opening #1"` — matches Wikipedia. Research md `"Big Opening No. 1"` — cosmetic mismatch (`No. 1` vs `#1`); Wikipedia renders it as "Big Opening #1".
- **Order**: matches.
- **Summary**: matches (talent show, split premiere Group A).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['orion']` — matches (Orion Story eliminated).

### Ep 2: Big Opening #2
- **Title**: .ts `"Big Opening #2"` matches; research md `"Big Opening No. 2"` same cosmetic mismatch.
- **Order**: matches.
- **Summary**: matches (talent show, split premiere Group B).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['daya']` — matches (Daya Betty eliminated).

### Ep 3: A Pair of Balls
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches (Hide & Chic + Red, White & Blue balls). Research md omits the chocolate-bar twist and the return of Orion and Daya — but this is a summary elision, not a factual error.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['june']` — matches (June Jambalaya eliminated).

### Ep 4: She's a Super Tease
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['alyssa14']` — matches (Alyssa Hunter eliminated).

### Ep 5: Save a Queen
- **Title**: matches.
- **Order**: matches.
- **Summary**: Research says "Film parody PSAs for a charity supporting first-eliminated queens." Per Wikipedia, the actual challenge was writing/performing commercials for a (fictional) charity called "Save a Queen" that helps first-boots; the research summary is directionally correct but lightly paraphrased. No factual mismatch flagged.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['orion', 'kornbread']`. Per Wikipedia, **Kornbread was removed mid-episode due to an ankle injury (medical withdrawal, not a lip-sync elim), and Orion Story was eliminated via lip-sync**. The .ts captures both losses as eliminations, which matches the chart; note, however, that one is a medical withdrawal rather than a competitive elimination. Flagging for the engine's awareness.

### Ep 6: Glamazon Prime
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches (build a look from Amazon-delivery-style junk).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['maddy']` — matches (Maddy Morphosis eliminated).

### Ep 7: The Daytona Wind
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches (soap-opera acting parody).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches (no elimination; Lady Camden won "lip-sync for the win" over Daya Betty).

### Ep 8: 60s Girl Groups
- **Title**: .ts `"60s Girl Groups"` matches Wikipedia; research md `"Girl Groups"` — **mild mismatch** (missing the "60s" prefix per Wikipedia's title).
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['kerri']` — matches (Kerri Colby eliminated).

### Ep 9: Menzeses
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches (no elimination; both Jasmine and Jorgeous won the double-shantay lip-sync).

### Ep 10: Snatch Game
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: []` — matches Wikipedia (no elimination; all seven non-winners went into the LaLaPaRuZa tournament next week).

### Ep 11: An Extra Special Episode (Lip Sync LaLaPaRuZa Smackdown)
- **Title**: .ts `"Lip Sync LaLaPaRuZa Smackdown"` — **mismatch**. Per Wikipedia the official episode title is **"An Extra Special Episode"**; the LaLaPaRuZa Smackdown is the *format/challenge name* inside that episode. Research md: **episode is missing entirely** — s14-episodes.md jumps from ep 10 to ep 12.
- **Order**: .ts order is correct. Research md is missing this row.
- **Summary**: n/a in research.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['jasmine14']` — matches (Jasmine Kennedie eliminated after the tournament).

### Ep 12: Moulin Ru: The Rusical
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['bosco']` — **mismatch**. Per Wikipedia, **no one was eliminated in ep 12**. Jorgeous won the bottom-two lip-sync vs. Bosco, and Bosco revealed the golden chocolate bar, saving herself. The .ts incorrectly lists Bosco as eliminated here. In reality Bosco advanced to the final four and was eliminated later (at the finale smackdown); the engine likely needs to shift her elimination to the finale episode.

### Ep 13: The Ross Mathews Roast
- **Title**: matches.
- **Order**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['deja', 'jorgeous']` — matches (double elimination: DeJa Skye and Jorgeous).

### Ep 14: Catwalk / Grand Finale
- **Title**: .ts uses `"Grand Finale"`; research md uses `"Catwalk (Finale)"`. Wikipedia splits this: **ep 14 is "Catwalk"** (pre-finale challenge, both bottom-twos saved via double-shantay), **ep 15 is "Reunited"**, **ep 16 is "Grand Finale"** (final five lip-syncs, Willow Pill crowned). Same structural compression as S13.
- **Order**: per the local 14-ep model, matches.
- **Summary**: research matches ep 14's "Catwalk" challenge, not the actual crowning event.
- **Placements (.ts)**: N/A. Winner per Wikipedia: **Willow Pill**. Runner-up: Lady Camden. Also in the final: Angeria, Bosco, Daya Betty. Not encoded.
- **Elimination**: `.ts: []`. The real finale eliminates Angeria, Bosco, Daya Betty before crowning Willow over Lady Camden; none encoded.

## Season 14 additional notes
- The research md's skipped ep-11 row is the biggest research-file gap for this season.
- The .ts's ep-12 Bosco elimination is the one clear **factual elimination error** found across all three seasons.

---

# Season 15 Audit

## Summary
- Episodes verified: 13 of 13 in `season15.ts` vs Wikipedia's 16-ep season.
- Total discrepancies: 5 (titles: 1, order: structural renumbering throughout, summaries: 0, placements: N/A across the board, eliminations: 1 — plus structural notes).
- **Structural mismatch**: `season15.ts` collapses Wikipedia's eps 1 and 2 ("One Night Only" Part 1 + Part 2) into a single ep 1, and collapses eps 14/15/16 (Blame It on the Edit / Reunited / Grand Finale) into a single `Grand Finale` at ep 13. Research md's numbering is a third variant (see below). Per-episode cross-checks here treat Wikipedia's ep numbering as truth and map the local files onto it.

## Per-episode findings

### Wiki Ep 1 ("One Night Only, Part 1") + Wiki Ep 2 ("One Night Only, Part 2")
- **.ts** collapses both into a single `number: 1, challengeName: 'One Night Only'`.
- **Research md** splits them into two entries at positions 1 and 2 ("One Night Only Part 1", "One Night Only Part 2"), but **then renumbers subsequent episodes inconsistently** (see below).
- **Title**: .ts `"One Night Only"` — Wikipedia uses "One Night Only, Part 1" / "…Part 2" (two distinct aired episodes, same night). Flag: collapsed title.
- **Summary (research)**: "Premiere A: Talent show performances" / "Premiere B: Talent show performances" — misleading. Per Wikipedia, **Part 1 had no maxi challenge** (mini-challenges and introductions only) and **the talent show was the maxi challenge of Part 2**. The research summaries treat both halves as talent-show premieres, which is factually inaccurate for Part 1.
- **Placements (.ts)**: N/A.
- **Elimination**: .ts `eliminated: ['irene']`. Per Wikipedia, **Irene Dubois is eliminated in ep 2** (not ep 1; ep 1 has no elimination). The .ts's collapsed model correctly attributes the elim to Irene, just not split across the two eps.

### Wiki Ep 3: All Queens Go to Heaven (= .ts ep 2, research md ep 3)
- **Title**: all three match.
- **Order**: structural difference only; otherwise the adjacency to the previous ep is correct.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['poppy']` — matches (Princess Poppy eliminated).

### Wiki Ep 4: Supersized Snatch Game (= .ts ep 3, research md ep 4)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['sugar']` — matches (Sugar eliminated).

### Wiki Ep 5: House of Fashion (= .ts ep 4, research md ep 5)
- **Title**: matches.
- **Summary**: matches (design from home-decor materials).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['amethyst']` — matches (Amethyst eliminated).

### Wiki Ep 6: Old Friends Gold (= .ts ep 5, research md ep 6)
- **Title**: matches.
- **Summary**: matches (old-lady girl group verses).
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['robin']` — matches (Robin Fierce eliminated).

### Wiki Ep 7: The Daytona Wind 2 (= .ts ep 6, research md ep 7)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['aura']` — matches (Aura Mayari eliminated).

### Wiki Ep 8: Lip Sync LaLaPaRuZa Smackdown (= .ts ep 7)
- **Title**: .ts `"Lip Sync LaLaPaRuZa Smackdown"` — matches Wikipedia.
- **Research md**: **episode missing** — s15-episodes.md jumps from ep 7 to ep 9 (no row for ep 8). This is a research-file gap.
- **Summary**: n/a in research.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['jax']` — matches (Jax eliminated).

### Wiki Ep 9: The Crystal Ball (= .ts ep 8, research md ep 9 titled "The Crystal Ball: Episode 200")
- **Title**: .ts `"The Crystal Ball"` matches Wikipedia. Research md uses `"The Crystal Ball: Episode 200"` — the ":Episode 200" suffix is a promotional label (this was the 200th episode of the franchise) but Wikipedia's canonical episode title is just "The Crystal Ball".
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['spice']` — matches (Spice eliminated).

### Wiki Ep 10: 50/50's Most Gagworthy Stars (= .ts ep 9, research md ep 10)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['malaysia']` — matches (Malaysia Babydoll Foxx eliminated).

### Wiki Ep 11: Two Queens, One Joke (= .ts ep 10, research md ep 11)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['marcia']` — matches (Marcia Marcia Marcia eliminated; both Loosey and Luxx won the challenge).

### Wiki Ep 12: Wigloose: The Rusical! (= .ts ep 11, research md ep 12)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['salina']` — matches (Salina EsTitties eliminated).

### Wiki Ep 13: Teacher Makeovers (= .ts ep 12, research md ep 13)
- **Title**: matches.
- **Summary**: matches.
- **Placements (.ts)**: N/A.
- **Elimination**: `.ts: ['loosey']` — matches (Loosey LaDuca eliminated).

### Wiki Ep 14: Blame It on the Edit / Grand Finale
- **.ts** has `Grand Finale` at ep 13 with no title matching "Blame It on the Edit". Research md has ep 14 `"Blame It on the Edit (Finale)"`.
- Wikipedia: **ep 14 is "Blame It on the Edit"** (pre-finale lipsync-writing challenge with a double-shantay), **ep 15 is "Reunited!"**, **ep 16 is "Grand Finale"** (lip-sync-for-the-crown smackdown; Sasha Colby wins). Same structural compression as S13 and S14.
- **Summary** (research): "Write verses and star in a space-themed RuMix music video" — reasonably matches the ep-14 "Blame It on the Edit" challenge (the song is "Blame It on the Edit"; ambition was Broadway/pop). No factual flag.
- **Placements (.ts)**: N/A. Winner per Wikipedia: **Sasha Colby**. Runner-up: Anetra. Final four also includes Mistress Isabelle Brooks and Luxx Noir London (eliminated in the finale smackdown). Not encoded.
- **Elimination**: `.ts: []`. Reality: Mistress and Luxx lose lip-syncs in the finale before Sasha defeats Anetra. None encoded.

## Season 15 additional notes
- The research md's ep numbering in the table header is misleading: it assigns number "9" to "The Crystal Ball" and number "12" to "Wigloose" but skips the number "8" entirely (no LaLaPaRuZa row). That is an internal numbering inconsistency in the research file itself.
- The .ts's own numbering is internally consistent (1..13) but does not align with Wikipedia's 16-episode numbering.

---

# Cross-season structural observations

1. **Empty `placements`**: every episode in all three season files has no per-queen placements recorded. The prompt's requested WIN/HIGH/SAFE/LOW/BTM2 audit cannot be performed against the .ts files as-is. Recommendation: either populate `placements` from Wikipedia's contestant progress charts, or treat this as an intentional schema choice and adjust the prompt.
2. **Finale compression**: in all three seasons the .ts collapses Wikipedia's pre-finale + reunion + finale (three eps) into a single "Grand Finale" entry. This is consistent across seasons — likely intentional for the engine — but means no finale placement/elimination data is encoded. No winner/runner-up is recorded anywhere in the .ts.
3. **Research md "episode number" column is unreliable**: S14's md skips 11, S15's md skips 8, S13's md starts at 2. The column header reads "#" but it is neither a strict 1..N index nor a consistent mapping to Wikipedia episode numbers. This is a data-entry risk.
4. **One clear factual elimination error**: `season14.ts` ep 12 ("Moulin Ru: The Rusical") lists `['bosco']` as eliminated. Per Wikipedia, **no one was eliminated in ep 12**; Bosco was saved by the golden chocolate bar. This is the single non-structural elimination discrepancy found across S13-S15.
5. **One title mismatch worth correcting**: `season14.ts` ep 11 is `"Lip Sync LaLaPaRuZa Smackdown"`; Wikipedia's episode title is `"An Extra Special Episode"` (with the LaLaPaRuZa being the format). The Smackdown label is used correctly as the ep-title in S15, but in S14 the episode has a different on-air title.
6. **Minor title variants** (cosmetic, not factual): `"Big Opening No. 1"` vs `"Big Opening #1"`; `"Disco-Mentary"` vs `"Disco-mentary"`; `"The Crystal Ball: Episode 200"` vs `"The Crystal Ball"`; `"Bossy Rossy: The RuBoot"` vs `"Bossy Rossy RuBoot"`; `"Girl Groups"` vs `"60s Girl Groups"`.

# Ambiguities / could not verify
- S13 Ep 1 ("The Pork Chop"): Wikipedia's progress chart records "STAY"/"LOSS" rather than WIN/HIGH/SAFE/LOW/BTM for this format; I did not find a clean mapping to the sim's placement schema and did not force one.
- S14 Ep 5 ("Save a Queen"): Kornbread's removal is a medical withdrawal, not a lip-sync elimination; the .ts treats both her and Orion as a single `eliminated: ['orion', 'kornbread']` array. Not strictly wrong for a "who leaves" model but worth noting for anyone modeling lip-sync outcomes.
- S15 "One Night Only" Part 1 vs Part 2 split: research md calls both a talent-show premiere, but per Wikipedia Part 1 had no maxi challenge (only mini-challenges and entrances). Verified against the secondary fetch; flagging as a factual-accuracy concern in the research md.
