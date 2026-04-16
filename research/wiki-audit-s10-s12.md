# Wikipedia Audit: Seasons 10–12

Source: Wikipedia pages for RuPaul's Drag Race seasons 10, 11, 12 (fetched during audit).
Data audited: `research/sNN-episodes.md` and `src/data/_v1_archive/seasonN.ts`.

Notation: ✓ matches, ✗ mismatch, ⚠ partial/ambiguous.
Where Wikipedia groups placements as "High/Low/Bottom 2", those are the canonical targets.

---

# Season 10 Audit

## Summary
- Episodes verified: 12 of 12 (regular episodes + finale)
- Total discrepancies: ~17 (titles: 1, order: 0, summaries: 2, placements: ~13, eliminations: 0)

## Per-episode findings

### Ep 1: 10s Across the Board
- **Title**: ✓ matches both sources
- **Order**: ✓
- **Summary**: ⚠ research md says "thrift store materials"; Wikipedia says "99-cent store". Minor — 99-cent Only Store is a thrift-like dollar store, not a thrift store.
- **Placements (.ts)**:
  - Mayhem WIN ✓
  - Blair HIGH ✓, Cracker HIGH ✓
  - ✗ .ts has Yuhua as SAFE; Wikipedia has Yuhua HIGH
  - ✗ .ts has Dusty as SAFE; Wikipedia has Dusty LOW (not represented in .ts schema except via SAFE)
  - Kalorie/Vanjie BTM2 ✓
- **Elimination**: Vanjie ✓

### Ep 2: PharmaRusical
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓ accurate (team musical performance)
- **Placements (.ts)**:
  - Vixen WIN ✓
  - ✗ .ts lists Monet HIGH and Blair HIGH. Wikipedia describes "Team The Vixen members" as HIGH rather than naming Monet/Blair specifically — Wikipedia does NOT list Monet as HIGH. Cannot confirm Blair HIGH from Wikipedia.
  - ✗ .ts has Monique as SAFE; Wikipedia has Monique LOW
  - Eureka/Kalorie BTM2 ✓
- **Elimination**: Kalorie ✓

### Ep 3: Tap That App
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md describes "Design and market a drag queen dating app"; Wikipedia describes filming dating app advertisements. Close but not exact — the challenge was producing commercials for Drag Queen dating apps.
- **Placements (.ts)**:
  - Asia WIN ✓
  - Blair HIGH ✓, Eureka HIGH ✓
  - ✗ .ts has Kameron as SAFE; Wikipedia has Kameron LOW
  - Mayhem/Yuhua BTM2 ✓
- **Elimination**: Yuhua ✓

### Ep 4: The Last Ball on Earth
- **Title**: ✓ (research md); ⚠ .ts has `challengeName: 'Last Ball on Earth'` (missing "The")
- **Order**: ✓
- **Summary**: ⚠ research md lists "martian couture, alaskan winter, and Miami summer"; Wikipedia lists Alaskan Winter, Miami Summer, Martian Eleganza. Descriptors slightly differ but themes align.
- **Placements (.ts)**:
  - Aquaria WIN ✓
  - Kameron HIGH ✓, Cracker HIGH ✓
  - ✗ .ts has Asia as SAFE; Wikipedia has Asia LOW
  - Dusty/Monet BTM2 ✓
- **Elimination**: Dusty ✓

### Ep 5: The Bossy Rossy Show
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Eureka WIN ✓
  - Monique HIGH ✓, Cracker HIGH ✓
  - ✗ .ts has Vixen as SAFE; Wikipedia has Vixen LOW
  - Mayhem/Monet BTM2 ✓
- **Elimination**: Mayhem ✓

### Ep 6: Drag Con Panels
- **Title**: ⚠ research md and .ts use "Drag Con Panels" / "DragCon Panels"; Wikipedia episode title is "Drag Con Panel Extravaganza"
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Eureka WIN ✓
  - Kameron HIGH ✓, Monet HIGH ✓
  - ✗ .ts has Cracker as SAFE; Wikipedia has Cracker LOW
  - Blair/Vixen BTM2 ✓
- **Elimination**: Blair ✓

### Ep 7: Snatch Game
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Aquaria WIN ✓
  - Eureka HIGH ✓, Monet HIGH ✓
  - Asia LOW ✓
  - Monique/Vixen BTM2 ✓
- **Elimination**: Monique ✓

### Ep 8: The Unauthorised Rusical (Cher)
- **Title**: ⚠ research md uses "The Unauthorised Rusical"; Wikipedia uses "The Unauthorized Rusical" (American spelling). .ts uses "Cher: The Unauthorized Rusical" which is descriptive but not the exact aired title.
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Kameron WIN ✓
  - Monet HIGH ✓
  - ✗ .ts has Aquaria as HIGH; Wikipedia has Aquaria LOW
  - Asia/Vixen BTM2 ✓
- **Elimination**: Vixen ✓

### Ep 9: Breastworld
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Asia WIN ✓
  - Aquaria HIGH ✓, Monet HIGH ✓
  - ✗ .ts has Cracker as SAFE; Wikipedia has Cracker LOW
  - Eureka/Kameron BTM2 ✓
- **Elimination**: None (double shantay) ✓

### Ep 10: Social Media Kings Into Queens
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Cracker WIN ✓
  - Asia HIGH ✓, Eureka HIGH ✓
  - ✗ .ts has Aquaria as SAFE; Wikipedia has Aquaria LOW
  - Kameron/Monet BTM2 ✓
- **Elimination**: Monet ✓

### Ep 11: Evil Twins
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Aquaria WIN ✓
  - Asia HIGH ✓, Eureka HIGH ✓
  - Kameron/Cracker BTM2 ✓
- **Elimination**: Cracker ✓

### Ep 12 (Finale): American
- **Title**: ⚠ research md calls this "American (Finale)"; Wikipedia splits this into Ep 12 "American" (final four music video — not a traditional elimination) and Ep 14 "Grand Finale" (lip-sync smackdown). The .ts flattens these into one finale entry.
- **Order**: ⚠ .ts has 12 episodes before finale; Wikipedia has 12 regular episodes + reunion + grand finale.
- **Summary**: ✓ broadly
- **Placements**: N/A (finale)
- **Elimination**: Aquaria won the season — .ts does not encode winner; engine presumably derives this.

---

# Season 11 Audit

## Summary
- Episodes verified: 12 of 12 (regular episodes + finale)
- Total discrepancies: ~14 (titles: 2, order: 0, summaries: 1, placements: ~11, eliminations: 0)

## Per-episode findings

### Ep 1: Whatcha Unpackin'?
- **Title**: ⚠ .ts uses "Whatcha Unpackin?" (no apostrophe); research md has apostrophe. Wikipedia: "Whatcha Unpackin?". Trivial.
- **Order**: ✓
- **Summary**: ⚠ research md says "from materials in suitcases"; Wikipedia says "using materials from former Drag Race queens" — the suitcases contained items sent by past queens. Close.
- **Placements (.ts)**:
  - Brooke Lynn WIN ✓
  - ✗ .ts lists Plastique HIGH, Shuga HIGH, Yvie HIGH. Wikipedia lists A'keria, Plastique, Vanjie as HIGH (not Shuga, not Yvie).
  - ✗ .ts has Akeria SAFE; Wikipedia has Akeria HIGH
  - ✗ .ts has Vanjie SAFE; Wikipedia has Vanjie HIGH
  - ✗ .ts has Shuga HIGH; Wikipedia does not list Shuga HIGH
  - ✗ .ts has Yvie HIGH; Wikipedia does not list Yvie HIGH
  - ✗ .ts has Nina LOW and Silky LOW; Wikipedia doesn't list a LOW — needs cross-check (Wikipedia doesn't explicitly note LOW for Ep 1)
  - Kahanna/Soju BTM2 ✓
- **Elimination**: Soju ✓

### Ep 2: Good God Girl, Get Out
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md describes "Get Out parody"; Wikipedia describes parodies of both Get Out and Black Panther. The summary omits Black Panther.
- **Placements (.ts)**:
  - Scarlet WIN ✓, Yvie WIN ✓ (shared)
  - Plastique HIGH ✓, Shuga HIGH ✓
  - ✗ .ts has Brooke Lynn SAFE; Wikipedia has Brooke Lynn LOW
  - ✗ .ts has Ariel SAFE; Wikipedia has Ariel LOW
  - Kahanna/Mercedes BTM2 ✓
- **Elimination**: Kahanna ✓

### Ep 3: Diva Worship
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Nina WIN ✓
  - ✗ .ts has Yvie HIGH, Silky HIGH. Wikipedia HIGH list: Brooke Lynn, Silky, Vanjie, Yvie. So Brooke Lynn HIGH and Vanjie HIGH are missing from .ts.
  - ✗ .ts has Brooke Lynn SAFE; Wikipedia has Brooke Lynn HIGH
  - ✗ .ts has Vanjie SAFE; Wikipedia has Vanjie HIGH
  - Bottom 6 (Akeria, Honey, Plastique, Rajah, Scarlet, Shuga) ✓ — all marked BTM2 in .ts which approximates the 6-way lip sync
- **Elimination**: Honey Davenport ✓

### Ep 4: Trump: The Rusical
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Silky WIN ✓
  - Yvie HIGH ✓, Brooke Lynn HIGH ✓
  - Vanjie LOW ✓
  - Rajah/Mercedes BTM2 ✓
- **Elimination**: Mercedes ✓

### Ep 5: Monster Ball
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Brooke Lynn WIN ✓
  - ✗ .ts has Yvie HIGH, Plastique HIGH. Wikipedia HIGH: Plastique, Yvie ✓ — these actually match.
  - Silky LOW ✓
  - Ariel/Shuga BTM2 ✓
- **Elimination**: Ariel ✓

### Ep 6: The Draglympics
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Akeria WIN ✓
  - Brooke Lynn HIGH ✓, Yvie HIGH ✓, Silky HIGH ✓, Shuga HIGH ✓ (Wikipedia HIGH list also includes Plastique and Akeria herself)
  - ✗ .ts has Plastique SAFE; Wikipedia has Plastique HIGH
  - Nina LOW ✓
  - Rajah/Scarlet BTM2 ✓
- **Elimination**: Scarlet ✓

### Ep 7: From Farm to Runway
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Plastique WIN ✓
  - Brooke Lynn HIGH ✓, Yvie HIGH ✓
  - ✗ .ts has Nina SAFE; Wikipedia has Nina LOW
  - Akeria/Rajah BTM2 ✓
- **Elimination**: Rajah ✓

### Ep 8: Snatch Game at Sea
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Silky WIN ✓
  - Nina HIGH ✓, Shuga HIGH ✓
  - ✗ .ts has Vanjie SAFE; Wikipedia has Vanjie LOW
  - Brooke Lynn/Yvie BTM2 ✓
- **Elimination**: None (double shantay) ✓

### Ep 9: L.A.D.P.!
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Akeria WIN ✓
  - Silky HIGH ✓, Brooke Lynn HIGH ✓
  - Shuga LOW ✓
  - Plastique/Vanjie BTM2 ✓
- **Elimination**: Plastique ✓

### Ep 10: Dragracadabra
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Nina WIN ✓
  - Brooke Lynn HIGH ✓
  - ✗ .ts has Yvie HIGH; Wikipedia does not list Yvie HIGH (only Brooke Lynn HIGH)
  - ✗ .ts has Akeria SAFE (plausible — Wikipedia doesn't list Akeria either HIGH or LOW)
  - Silky LOW ✓
  - Shuga/Vanjie BTM2 ✓
- **Elimination**: Shuga ✓

### Ep 11: Bring Back My Queens!
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Brooke Lynn WIN ✓
  - Akeria HIGH ✓, Vanjie HIGH ✓
  - ✗ .ts has Yvie SAFE; Wikipedia has Yvie LOW
  - Silky/Nina BTM2 ✓
- **Elimination**: Nina ✓

### Ep 12: Queens Everywhere
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - No WIN recorded in .ts. Wikipedia does not identify a single maxi-challenge winner for this episode (performance-review style), so absence is defensible.
  - Yvie HIGH ✓, Akeria HIGH ✓
  - ✗ .ts has Silky HIGH; Wikipedia has Silky LOW
  - Brooke Lynn/Vanjie BTM2 ✓
- **Elimination**: Vanjie ✓

### Ep 13 (Finale)
- Research md and .ts treat Ep 13 as finale combining reunion + lip-sync smackdown. Wikipedia splits into Ep 13 "Reunited" (no eliminations) and Ep 14 "Grand Finale" (Yvie wins).
- **Winner**: Yvie Oddly (per Wikipedia). Not explicitly encoded in .ts.

---

# Season 12 Audit

## Summary
- Episodes verified: 12 of 12 (regular episodes + finale)
- Total discrepancies: MANY — Sherry Pie is entirely absent from the .ts queens list and from all placements. This is a structural omission.
- (titles: 0, order: 0, summaries: 1, placements: ~15, eliminations: 0 direct; Sherry Pie absence affects nearly every episode)

## IMPORTANT: Sherry Pie
Sherry Pie was the 13th contestant on Season 12. She was disqualified before the finale aired due to misconduct allegations and was excluded from the final three, but she appeared and was placed in Episodes 1–12. Wikipedia's placement data for every episode 1–12 includes her. The `.ts` file has **only 12 queens** and does not list Sherry Pie at all. All placement discrepancies in S12 are driven partly by this omission. This should be flagged explicitly — do NOT silently fix.

## Per-episode findings

### Ep 1: I'm That Bitch
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓ (split premiere, written/performed verses)
- **Placements (.ts)**:
  - Widow WIN ✓
  - Gigi HIGH ✓, Jan HIGH ✓
  - ✗ .ts does not list Brita HIGH; Wikipedia has Brita HIGH (also Jackie HIGH)
  - ✗ .ts has Jackie SAFE; Wikipedia has Jackie HIGH
  - ✗ .ts has Heidi SAFE, Nicky SAFE; Wikipedia has both LOW
  - ✗ .ts has Dahlia LOW; Wikipedia does not list Dahlia LOW
  - ✗ Bottom 2 in .ts: none shown; Wikipedia Bottom 2 = Gigi vs. Widow (top two lip-synced for the win, not bottoms) — this is the split premiere top-lip-sync format, which the .ts schema may not model. Clarify.
- **Elimination**: None ✓ (correctly reflected — split premiere no elimination)

### Ep 2: You Don't Know Me
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Jaida WIN ✓
  - ✗ .ts has Jan HIGH, Heidi HIGH. Wikipedia HIGH: Aiden, Jan, Sherry Pie. Heidi NOT in Wikipedia HIGH.
  - ✗ Sherry Pie missing entirely
  - ✗ .ts has Aiden SAFE; Wikipedia has Aiden HIGH
  - ✗ .ts has Heidi HIGH; Wikipedia does not list Heidi HIGH
  - Dahlia LOW ✓, Rock LOW ✓
  - ✗ Bottom 2 in .ts: none shown; Wikipedia Bottom 2 = Jaida vs. Sherry Pie (top-two lip sync format)
- **Elimination**: None ✓

### Ep 3: World's Worst
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - ✗ .ts has Heidi WIN. Wikipedia has Sherry Pie WIN.
  - Jackie HIGH ✓
  - ✗ .ts has Widow HIGH; Wikipedia does not list Widow HIGH — Widow's placement here is unclear from Wikipedia fetch; needs cross-check.
  - ✗ .ts has Heidi WIN but Wikipedia has Heidi HIGH (since Sherry won)
  - ✗ .ts has Crystal LOW; Wikipedia has Crystal LOW ✓ (matches)
  - ✗ .ts has Nicky BTM2 but Wikipedia says Nicky was LOW (and BTM2 with Dahlia); slight ambiguity
  - Dahlia BTM2 ✓
- **Elimination**: Dahlia ✓

### Ep 4: The Ball Ball
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md says "basketball wife, balls to the wall, ball gown eleganza"; Wikipedia lists "Lady Baller, Basketball Wife Realness, Balls to the Wall Eleganza" — "Lady Baller" is the athletic look; "ball gown eleganza" is not exactly the category name.
- **Placements (.ts)**:
  - Gigi WIN ✓
  - Jaida HIGH ✓, Nicky HIGH ✓
  - ✗ .ts has Crystal SAFE; Wikipedia has Crystal LOW
  - Aiden LOW ✓
  - ✗ Sherry Pie missing
  - Brita/Rock BTM2 ✓
- **Elimination**: Rock ✓

### Ep 5: Gay's Anatomy
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - ✗ .ts has Jan WIN. Wikipedia has Sherry Pie WIN.
  - ✗ .ts has Gigi HIGH, Jackie HIGH. Wikipedia HIGH list: Aiden, Gigi, Jan, Jackie, Widow.
  - ✗ .ts has Jan as WIN (Jan was actually HIGH per Wikipedia)
  - ✗ .ts has Aiden SAFE; Wikipedia has Aiden HIGH
  - ✗ .ts has Widow SAFE; Wikipedia has Widow HIGH
  - Brita LOW ✓
  - ✗ .ts has Heidi BTM2; Wikipedia has Heidi LOW (and BTM2). Consistent with elimination.
  - Nicky BTM2 ✓
- **Elimination**: Nicky ✓

### Ep 6: Snatch Game
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Gigi WIN ✓
  - Jackie HIGH ✓
  - ✗ .ts has Widow HIGH; Wikipedia HIGH = Jackie, Sherry Pie (not Widow)
  - ✗ Sherry Pie missing
  - ✗ .ts has Jan LOW; Wikipedia does not list Jan LOW
  - Aiden LOW ✓ (Wikipedia has Aiden LOW, then BTM2)
  - Brita BTM2 ✓
- **Elimination**: Aiden ✓

### Ep 7: Madonna: The Unauthorized Rusical
- **Title**: ✓
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Gigi WIN ✓
  - ✗ .ts has Jan HIGH, Crystal HIGH. Wikipedia HIGH = Crystal, Jan ✓ — these actually match.
  - ✗ .ts has Jackie SAFE; Wikipedia has Jackie LOW
  - Brita BTM2 ✓, Heidi BTM2 ✓
- **Elimination**: Brita ✓

### Ep 8: Droop
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md describes "Political debate parody improv challenge"; Wikipedia describes creating/marketing drag lifestyle brand products ("Droop" parody of Goop). This is a significant summary error.
- **Placements (.ts)**:
  - Heidi WIN ✓
  - Crystal HIGH ✓, Jackie HIGH ✓
  - ✗ .ts missing Jaida HIGH; Wikipedia has Jaida HIGH (not SAFE)
  - Jaida listed SAFE in .ts; Wikipedia has Jaida HIGH
  - ✗ .ts has Gigi LOW; Wikipedia has Gigi LOW ✓ (matches)
  - ✗ Sherry Pie missing (Wikipedia has Sherry Pie LOW)
  - Jan BTM2 ✓, Widow BTM2 ✓
- **Elimination**: Jan ✓

### Ep 9: Choices 2020
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md says "One-woman show performances about personal stories"; Wikipedia says "Presidential debate competition". These are different challenges — Wikipedia is correct (Choices 2020 is a presidential debate format). The research md summary is WRONG.
- **Placements (.ts)**:
  - Jaida WIN ✓
  - Crystal HIGH ✓, Gigi HIGH ✓
  - ✗ .ts has Heidi SAFE; Wikipedia has Heidi HIGH
  - ✗ .ts missing Gigi/Jackie LOW note; Wikipedia has Gigi LOW and Jackie LOW
  - ✗ Sherry Pie was disqualified/absent by this episode (check — Sherry Pie's last filmed episode was Ep 12, but her eliminations were edited. Wikipedia notes her present through Ep 12.)
  - Jackie BTM2 ✓, Widow BTM2 ✓
- **Elimination**: Widow ✓

### Ep 10: Superfan Makeover
- **Title**: ⚠ research md has "Superfan Makeover"; .ts has "Makeover"; Wikipedia has "Superfan Makeover". .ts title is truncated.
- **Order**: ✓
- **Summary**: ✓
- **Placements (.ts)**:
  - Jaida WIN ✓
  - Crystal HIGH ✓, Gigi HIGH ✓
  - ✗ Wikipedia HIGH also includes Sherry Pie; .ts missing
  - Heidi BTM2 ✓, Jackie BTM2 ✓
- **Elimination**: None (double shantay) ✓

### Ep 11: One-Queen Show
- **Title**: ⚠ research md has "One-Queen Show"; .ts has "One-Woman Show"; Wikipedia has "One-Queen Show". .ts title is wrong.
- **Order**: ✓
- **Summary**: ⚠ research md describes "Solo stand-up/variety performance"; Wikipedia describes "Create and perform one-woman show". The S12 ep 11 was a one-woman show specifically, not pure stand-up. Close enough.
- **Placements (.ts)**:
  - Crystal WIN ✓
  - Gigi HIGH ✓
  - ✗ .ts missing Jackie HIGH; Wikipedia has Jackie HIGH
  - ✗ .ts has Jaida SAFE; Wikipedia has Jaida LOW
  - ✗ .ts has Jackie BTM2; Wikipedia has Heidi and Jaida BTM2 (not Jackie)
  - Heidi BTM2 ✓
  - ✗ Sherry Pie missing (Wikipedia has Sherry Pie LOW)
- **Elimination**: Heidi ✓

### Ep 12: Viva Drag Vegas
- **Title**: ✓
- **Order**: ✓
- **Summary**: ⚠ research md describes "Create and perform a Las Vegas drag show number in teams"; Wikipedia describes performing a medley from RuPaul's Drag Race Live! (the real Vegas residency). Factually the routine was pre-choreographed by the Vegas show's team, not created by contestants.
- **Placements (.ts)**:
  - Gigi WIN ✓
  - Jaida HIGH ✓
  - Crystal BTM2 ✓, Jackie BTM2 ✓
  - Note: Sherry Pie's disqualification announcement occurred around this episode's airing window; Wikipedia flags her as disqualified from the finale.
- **Elimination**: Jackie ✓

### Finale (Ep 13 in .ts)
- .ts has one finale node; Wikipedia splits into Ep 13 "Alone Together" reunion (virtual due to COVID) and Ep 14 "Grand Finale" (Jaida wins).
- **Winner**: Jaida Essence Hall (per Wikipedia). Not explicitly encoded in .ts.

---

# Cross-season observations

1. **Sherry Pie omission (S12)**: `src/data/_v1_archive/season12.ts` completely omits Sherry Pie from its queens list and all placements. This is the single largest structural discrepancy across all three seasons. Wikipedia records her as one of the 13 queens and includes her placements for Episodes 1–12. Note: She was disqualified from appearing in the Grand Finale after misconduct allegations surfaced post-filming, so her exclusion from the *finalist* list is correct — but excluding her from Episodes 1–12 is not factually accurate per Wikipedia.

2. **SAFE vs. LOW**: Across all three seasons, `.ts` files frequently use SAFE where Wikipedia records LOW. The `.ts` schema may not require LOW encoding (BTM2 is enough to drive eliminations in the sim), but for data-faithful auditing this is a persistent discrepancy.

3. **HIGH under-recording**: Multiple episodes across S11 and S12 list fewer HIGH queens than Wikipedia. Since Wikipedia's HIGH lists (especially for team challenges) are often large, this may be a deliberate simplification, but it's a discrepancy.

4. **S10 Ep 2 team-win HIGH attribution**: Wikipedia attributes HIGH to team members (not named individually for some weeks); the .ts names specific queens, which may be incorrect attributions.

5. **S10 Ep 6 title**: Wikipedia's full title is "Drag Con Panel Extravaganza"; both the research md and .ts use the shorter form "Drag Con Panels" / "DragCon Panels".

6. **Split premiere / top-two lip-sync format**: S12 Eps 1 and 2 used the split-premiere format where the top two lip-sync for the win (not the bottom two for elimination). The `.ts` encodes no BTM2 for these episodes, which is schema-correct for this format but means the "loser" of the lip-sync is not recorded.

7. **Finale structure**: All three seasons split their finale across a reunion episode and a Grand Finale episode on Wikipedia. The `.ts` files collapse these into a single finale node. Winner identity is not encoded in any of the three .ts files (the sim presumably determines finale placement at runtime).

8. **S12 Ep 8 "Droop" summary error**: The research md summary describes a political debate parody, but the Droop challenge was a Goop-parody drag lifestyle brand marketing challenge. These are different. (S12 Ep 9 "Choices 2020" is the political debate.)

9. **S12 Ep 11 `.ts` title "One-Woman Show" vs. Wikipedia "One-Queen Show"**: Worth fixing for fidelity.

# Notes on Wikipedia coverage limits

- Wikipedia fetches returned summarized placement data; in a few cases the LOW list for an episode was not fully enumerated by the WebFetch response, which limits certainty on SAFE vs. LOW distinctions. Flagged as ⚠ rather than ✗ where ambiguous.
- S11 Ep 1 LOW list was not explicitly given by the Wikipedia fetch; .ts has Nina LOW and Silky LOW which may be correct but is not verified here.
- S12 Ep 3 Widow's placement was not enumerated as HIGH by the Wikipedia fetch; needs secondary cross-check.

# Recommended next steps (not applied)

- Add Sherry Pie to `src/data/_v1_archive/season12.ts` queens list and to episode placements for Eps 1–12.
- Align SAFE entries with Wikipedia LOW where the sim schema supports it.
- Correct S12 Ep 5 winner (Sherry Pie, not Jan) and Ep 3 winner (Sherry Pie, not Heidi) after confirming with a secondary source.
- Correct S12 Ep 8 research-md summary (Droop is a Goop/lifestyle-brand parody, not a debate).
- Correct S12 Ep 9 research-md summary (Choices 2020 is a debate, not a one-woman show).
- Fix `.ts` Ep 11 challengeName from "One-Woman Show" to "One-Queen Show".
- Consider expanding `.ts` S10 Ep 12 / S11 Ep 13 / S12 Ep 13 to split reunion from grand finale.
