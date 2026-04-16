# S1–S3 Wikipedia Audit

Verification pass comparing `research/sNN-episodes.md` and `src/data/_v1_archive/seasonN.ts` against Wikipedia. Checks episode titles, order, challenge summaries, placements, and eliminations.

**Important caveat on placements:** the `.ts` files for S1, S2, and S3 all have `placements: {}` for every episode — no WIN/HIGH/SAFE/LOW/BTM2 data is stored in the v1 archive for these seasons. That column in the audit is therefore vacuously "nothing to verify" rather than verified-accurate. Only eliminations can be audited from the `.ts` files.

Wikipedia sources consulted:
- https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1
- https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2
- https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3

---

# Season 1 Audit

## Summary
- Episodes verified: 8 research rows + 7 TS episodes vs 8 Wikipedia aired episodes (excluding reunion). All eliminations match.
- Total discrepancies: 5 (titles: 1, order: 1 structural, summaries: 3, placements: n/a, eliminations: 0)

## Structural notes
- Wikipedia has 9 aired episodes: Ep1–8 + "Reunited" (Ep9). Ep7 "Extra Special Edition" is a retrospective clip show with no maxi-challenge; Ep8 is the Grand Finale.
- `research/s01-episodes.md` lists 8 rows, with its Ep7 as "Extra Special Edition" and Ep8 as "Grand Finale." Numbering therefore lines up with Wikipedia Ep1–8.
- `src/data/_v1_archive/season1.ts` has 7 episodes. It skips the Ep7 clip show entirely — TS Ep1–6 = Wikipedia Ep1–6, and TS Ep7 (finale) = Wikipedia Ep8. This is a data-modeling choice (no challenge means no simulated episode), not a factual error, but it does mean `number: 7` in the TS does not correspond to Wikipedia Ep7.

## Per-episode findings

### Ep 1: Drag on a Dime
- **Title (research/TS)**: matches Wikipedia "Drag on a Dime"
- **Order**: matches
- **Summary (research)**: "Design a look from thrift store materials" — matches Wikipedia ("outfit made from items from the thrift store")
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: porkchop — matches Wikipedia (Victoria "Porkchop" Parker, 9th)

### Ep 2: Girl Groups
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Form girl groups and perform an original routine" — generally accurate; Wikipedia specifies it was a Destiny's Child–themed girl-group battle (not original songs). Minor imprecision.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: tammie — matches Wikipedia (Tammie Brown, 8th)

### Ep 3: Queens of All Media
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Host your own TV show segment" — partially accurate. Wikipedia describes it as channeling Oprah Winfrey across various TV-personality roles.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: akashia — matches Wikipedia (7th)

### Ep 4: Mac Viva-Glam Challenge
- **Title**: research has "Mac Viva-Glam Challenge"; TS has "MAC Viva Glam"; Wikipedia uses "Mac-Viva Glam". All three differ slightly in casing/punctuation/suffix — acceptable variation.
- **Order**: matches
- **Summary (research)**: "Create and pitch a MAC cosmetics campaign" — close to Wikipedia's "Write and film a Mac-Viva Glam commercial" (the challenge was to write and film a commercial, not "pitch a campaign"). Minor imprecision.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: jade — matches Wikipedia (Jade, 6th)

### Ep 5: Drag School of Charm
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Demonstrate poise and presentation in a charm school setting" — FACTUALLY WRONG. Wikipedia: the maxi-challenge was to makeover female extreme fighters into drag daughters. The "School of Charm" was the framing device for the makeover coaching, not a pure charm-school presentation challenge.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: ongina — matches Wikipedia (Ongina, 5th)

### Ep 6: Absolut Drag Ball
- **Title**: research has "Absolut Drag Ball"; TS has "The Absolut Ball"; Wikipedia: "The Absolut Ball." TS title matches Wikipedia exactly; research has extra word "Drag."
- **Order**: matches
- **Summary (research)**: "Design three looks for an Absolut-themed ball" — matches Wikipedia
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: shannel — matches Wikipedia (Shannel, 4th)

### Ep 7: Extra Special Edition (research only; not present as an episode in TS)
- **Title (research)**: matches Wikipedia "Extra Special Edition"
- **Order**: matches Wikipedia numbering
- **Summary (research)**: ✗ "Write and perform in a drag tabloid talk show" — FACTUALLY WRONG. Wikipedia: no maxi-challenge; this was a retrospective clip show with unaired footage and audition tapes.
- **Placements (TS)**: n/a (TS omits this episode)
- **Elimination**: n/a

### Ep 8: Grand Finale (research Ep8 / TS Ep7)
- **Title**: matches Wikipedia "Grand Finale"
- **Order**: matches Wikipedia Ep8 (research numbers it 8; TS numbers it 7 because it omitted the clip show — see structural note)
- **Summary (research)**: ⚠ "Lip-sync spectacular and final runway" — partially inaccurate. Wikipedia: final maxi-challenge was to record a verse and film a spot for RuPaul's music video. (A final lip-sync was also part of the episode between the top two, but the described maxi-challenge was the music-video shoot.)
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: `[]` — acceptable within the engine's finale model; Wikipedia shows Rebecca Glasscock ELIM at this episode before BeBe Zahara Benet vs. Nina Flowers for the crown (BeBe = winner). The finale elimination of Rebecca is not represented in the TS `eliminated` array.

---

# Season 2 Audit

## Summary
- Episodes verified: 10 research rows + 10 TS episodes vs 11 Wikipedia aired episodes (excluding reunion).
- Total discrepancies: 6 (titles: 1, order: 0, summaries: 5, placements: n/a, eliminations: 0)

## Structural notes
- Wikipedia has 12 aired episodes: Ep1–9 maxi challenges, Ep10 "The Main Event Clip Show," Ep11 "Grand Finale," Ep12 "Reunited."
- `research/s02-episodes.md` lists 10 rows and `season2.ts` has 10 episodes — both skip the clip show. Research/TS Ep10 (finale) = Wikipedia Ep11.

## Per-episode findings

### Ep 1: Gone with the Window
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Style a themed storefront window display" — inaccurate framing. Wikipedia: create an outfit from curtains and home furnishings. Not a storefront display; it was a garment design challenge using home-décor materials.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: shangela — matches Wikipedia (Shangela, 12th; eliminated Ep1 via DQ storyline)

### Ep 2: Starrbootylicious
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Choreograph and perform in a Beyoncé-inspired music video" — FACTUALLY WRONG. Wikipedia: team burlesque performance and selling gift certificates (not a Beyoncé music video).
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: nicole — matches Wikipedia (Nicole Paige Brooks, 11th)

### Ep 3: Country Queens
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Write and perform original country songs" — FACTUALLY WRONG. Wikipedia: in teams, act as feuding families in a TV commercial for "Disco Shortening." Not a country-song performance.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: mystique — matches Wikipedia (Mystique Summers Madison, 10th)

### Ep 4: The Snatch Game
- **Title**: research "The Snatch Game"; TS "Snatch Game"; Wikipedia "Snatch Game." TS matches Wikipedia exactly; research has extra "The."
- **Order**: matches
- **Summary (research)**: "Celebrity impersonation panel game show" — matches Wikipedia
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: sonique — matches Wikipedia (Sonique, 9th)

### Ep 5: Here Comes the Bride
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ⚠ "Makeover a wedding party member into a drag bride" — close but not exact. Wikipedia: bride-and-groom wedding photoshoot (pairs, with partner). Minor imprecision in framing but thematically on-target.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: morgan — matches Wikipedia (Morgan McMichaels, 8th)

### Ep 6: Rocker Chicks
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ⚠ "Form rock bands and perform original songs" — inaccurate. Wikipedia: live rock performance of RuPaul's "Lady Boy" (not original songs).
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: sahara — matches Wikipedia (Sahara Davenport, 7th)

### Ep 7: Once Upon a Queen
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Write and star in a fairy tale storybook" — FACTUALLY WRONG. Wikipedia: create and promote a concept for an autobiography (with book covers reflecting their drag personas). No fairy-tale challenge.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: jessica — matches Wikipedia (Jessica Wild, 6th)

### Ep 8: Golden Gals
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Act in a Golden Girls parody sitcom" — FACTUALLY WRONG. Wikipedia: makeover older gay men ("Golden Gals" = the older subjects being made over). Not an acting challenge.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: pandora — matches Wikipedia (Pandora Boxx, 5th; Miss Congeniality)

### Ep 9: The Diva Awards
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ⚠ "Write acceptance speeches and perform at an awards show" — imprecise. Wikipedia: create three looks for The Diva Awards (a three-look design/runway challenge). Speeches were an element, but the challenge's core was the three-look design package.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: tatianna — matches Wikipedia (Tatianna, 4th)

### Ep 10: Grand Finale (TS/research Ep10 = Wikipedia Ep11)
- **Title**: matches
- **Order**: matches (allowing for the skipped clip show)
- **Summary (research)**: ✗ "Wedding-themed final challenge with a bridal runway" — FACTUALLY WRONG. Wikipedia: star in a music video and act in a scripted scene with RuPaul. No wedding/bridal theme.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: `[]` — acceptable finale representation (Jujubee 3rd, Raven runner-up, Tyra Sanchez winner).

---

# Season 3 Audit

## Summary
- Episodes verified: 14 research rows + 13 TS episodes vs 15 Wikipedia aired maxi-challenge/finale episodes (Wikipedia has 16 including reunion).
- Total discrepancies: 12 (titles: 2, order: mixed numbering, summaries: 8, placements: n/a, eliminations: 0)

## Structural notes
- Wikipedia Season 3 has 16 aired episodes: Ep1 "Casting Extravaganza" (casting special, no maxi-challenge), Ep2 "The Queen Who Mopped Xmas" (first actual maxi), Ep3–13 maxi challenges, Ep14 "RuPaul Rewind" (retrospective), Ep15 "Grand Finale," Ep16 "Reunited."
- `research/s03-episodes.md` lists 14 rows. Its Ep1 is "Casting Extravaganza" (matching Wikipedia Ep1 which had no challenge), Ep2 = Wikipedia Ep2, etc., through research Ep14 = Grand Finale = Wikipedia Ep15. Research skips Wikipedia Ep14 "RuPaul Rewind." Numbering otherwise aligns with Wikipedia.
- `src/data/_v1_archive/season3.ts` uses a different numbering: TS Ep1 is "The Queen Who Mopped Xmas" (Wikipedia Ep2). TS skips both the Ep1 casting special and the Ep14 rewind. TS Ep1–12 correspond to Wikipedia Ep2–13, and TS Ep13 (finale) = Wikipedia Ep15.

## Per-episode findings

### Research Ep 1 / (no TS counterpart): Casting Extravaganza
- **Title (research)**: matches Wikipedia "Casting Extravaganza"
- **Order**: matches Wikipedia Ep1
- **Summary (research)**: ✗ "Design a look from basic materials on the spot" — FACTUALLY WRONG. Wikipedia: behind-the-scenes casting special with audition profiles of contestants; no maxi-challenge. The first on-the-spot design-ish challenge (Christmas outfits) was Ep2, not this.
- **Placements / Elimination**: n/a (no competition)

### Research Ep 2 / TS Ep 1: The Queen Who Mopped Xmas (= Wikipedia Ep 2)
- **Title**: matches both
- **Order**: matches
- **Summary (research)**: ✗ "Act in a low-budget Christmas movie" — FACTUALLY WRONG. Wikipedia: "create an outfit made from Christmas-themed items" — this was a design challenge, not an acting challenge. (The Christmas-movie framing may have been pulled from the episode's title-parody vibe, not from any maxi-challenge content.)
- **TS Ep 1 `challengeType`**: `design` with all weight on design — correct in spirit relative to Wikipedia (Christmas outfit design), but inconsistent with the research summary.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: venus — matches Wikipedia (Venus D-Lite, 13th)

### Research Ep 3 / TS Ep 2: Queens in Space (= Wikipedia Ep 3)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Act in a low-budget sci-fi movie" — matches Wikipedia (teams starred in sci-fi movie trailers)
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: phoenix — matches Wikipedia (Phoenix, 12th)

### Research Ep 4 / TS Ep 3: Totally Leotarded (= Wikipedia Ep 4)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Create and star in a workout/exercise video" — matches Wikipedia (in teams, produce a fitness workout video)
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: mimi — matches Wikipedia (Mimi Imfurst, 11th)

### Research Ep 5 / TS Ep 4: QNN News (= Wikipedia Ep 5)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Anchor and report in a drag news broadcast" — matches Wikipedia (morning news show segment)
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: india — matches Wikipedia (India Ferrah, 10th)

### Research Ep 6 / TS Ep 5: Snatch Game (= Wikipedia Ep 6)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Celebrity impersonation panel game show" — matches Wikipedia
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: mariah — matches Wikipedia (Mariah, 9th)

### Research Ep 7 / TS Ep 6: Face, Face, Face of Cakes (= Wikipedia Ep 7)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Decorate a cake in your drag image and present it" — FACTUALLY WRONG. Wikipedia: queens created drag *outfits* inspired by bakery cakes (the challenge was garment design inspired by specialty cakes, not decorating the cakes themselves).
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: stacy — matches Wikipedia (Stacy Layne Matthews, 8th)

### Research Ep 8 / TS Ep 7: Ru Ha Ha / Ru Ha Ha! (= Wikipedia Ep 8)
- **Title**: research "Ru Ha Ha!"; TS "Ru Ha Ha"; Wikipedia "Ru Ha Ha!" — research matches Wikipedia; TS missing exclamation point (minor).
- **Order**: matches
- **Summary (research)**: "Stand-up comedy performance" — matches Wikipedia
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: delta — matches Wikipedia (Delta Work, 7th)

### Research Ep 9 / TS Ep 8: Life, Liberty, and the Pursuit of Style (= Wikipedia Ep 9)
- **Title**: research "Life, Liberty, and the Pursuit of Style"; TS "Life, Liberty & the Pursuit of Style"; Wikipedia "Life, Liberty and the Pursuit of Style." All essentially match modulo punctuation.
- **Order**: matches
- **Summary (research)**: ⚠ "Patriotic design challenge creating American-themed looks" — incomplete. Wikipedia: film a patriotic message addressed to US military personnel overseas. A patriotic runway was part of the episode, but the maxi-challenge was the filmed message to the troops, not a design challenge.
- **TS Ep 8 `challengeType`**: `acting` — plausible for a filmed-message challenge, arguably closer to Wikipedia than the research summary.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: `[]` — correct. Wikipedia shows no elimination at Ep9; two queens landed in the bottom (Carmen and Yara, both BTM) and Carmen was eliminated at the next episode (Ep10) instead.

### Research Ep 10 / TS Ep 9: RuPaul-a-Palooza (= Wikipedia Ep 10)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: ✗ "Live comedy/variety performance showcase" — FACTUALLY WRONG. Wikipedia: queens performed RuPaul's song "Superstar" in different music genres (Hip Hop, Reggae, Disco, Punk Rock, Country, Pop). This was a singing/performance challenge with assigned genres, not a comedy/variety showcase.
- **TS Ep 9 `challengeType`**: `singing` — matches Wikipedia better than the research summary does.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: carmen — matches Wikipedia (Carmen Carrera eliminated at Ep10; she does return for Ep12)

### Research Ep 11 / TS Ep 10: The Hair Ball / RuPaul's Hair Extravaganza (= Wikipedia Ep 11)
- **Title**: ✗ research "The Hair Ball" matches Wikipedia exactly; TS "RuPaul's Hair Extravaganza" is WRONG — Wikipedia calls it "The Hair Ball," not "RuPaul's Hair Extravaganza." TS title is a fabrication.
- **Order**: matches
- **Summary (research)**: ⚠ "Three-look hair-themed ball" — imprecise. Wikipedia: three categories were "A Classic Look from Another Era," "A Modern Red Carpet Look," and "A Fantasy Hair Outfit." Only the third is explicitly hair-themed, though the episode's framing is a hair-ball.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: shangela3 — matches Wikipedia (Shangela, 6th)

### Research Ep 12 / TS Ep 11: Jocks in Frocks (= Wikipedia Ep 12)
- **Title**: matches
- **Order**: matches
- **Summary (research)**: "Makeover athletes into drag queens" — matches Wikipedia (makeover heterosexual male athletes)
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: carmen — matches Wikipedia on the returnee-elimination narrative: Carmen Carrera returned after her Ep10 elimination (the Wikipedia chart shows "GUEST" for Ep12, but she is credited with 5th place, consistent with being re-eliminated at Ep12 rather than returning purely as a guest subject). Note: some Wikipedia chart labellings are ambiguous — Carmen's role at Ep12 is worth flagging for manual verification. Regardless, TS pinning Carmen's final elimination to Ep11 (= Wikipedia Ep12) is consistent with her being placed 5th.

### Research Ep 13 / TS Ep 12: The Money Ball / Make Dat Money (= Wikipedia Ep 13)
- **Title**: research "The Money Ball" matches Wikipedia exactly; TS "Make Dat Money" is WRONG — Wikipedia calls it "The Money Ball," not "Make Dat Money."
- **Order**: matches
- **Summary (research)**: ⚠ "Three-look glamour/money-themed ball" — Wikipedia categories were "Swimsuit Body Beautiful," "Cocktail Attire After 5," "Evening Gown Eleganza." The ball was thematically framed around money/glamour but the three looks themselves were a progression of formality (swimsuit → cocktail → evening gown), not explicitly money-themed.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: yara — matches Wikipedia (Yara Sofia, 4th; also Miss Congeniality)

### Research Ep 14 / TS Ep 13: Grand Finale (= Wikipedia Ep 15)
- **Title**: matches
- **Order**: matches (research and TS both skip the Wikipedia Ep14 "RuPaul Rewind" retrospective)
- **Summary (research)**: "Final runway and crowning" — Wikipedia: final three performed in music video; Raja crowned winner. Generally accurate.
- **Placements (TS)**: `{}` — nothing to verify
- **Elimination (TS)**: `[]` — acceptable finale representation (Alexis Mateo 3rd, Manila Luzon runner-up, Raja winner).

---

# Cross-season summary of issues to fix (for a future pass — NOT fixed here)

**Wrong challenge summaries (material factual errors):**
- S1 Ep5 "Drag School of Charm" — is a MMA-fighter makeover, not a charm-school presentation.
- S1 Ep7 "Extra Special Edition" — is a clip show; the "drag tabloid talk show" summary is fabricated.
- S1 Ep8 "Grand Finale" — the maxi was a music-video shoot, not a lip-sync.
- S2 Ep1 "Gone with the Window" — is a curtains/home-décor outfit, not a storefront display.
- S2 Ep2 "Starrbootylicious" — is a burlesque team performance, not a Beyoncé music video.
- S2 Ep3 "Country Queens" — is the Disco Shortening commercial, not country songs.
- S2 Ep6 "Rocker Chicks" — performed RuPaul's "Lady Boy," not original songs.
- S2 Ep7 "Once Upon a Queen" — autobiography concepts, not fairy tales.
- S2 Ep8 "Golden Gals" — makeover of older gay men, not a Golden Girls sitcom parody.
- S2 Ep10 "Grand Finale" — music-video/scripted-scene, not a wedding/bridal theme.
- S3 Ep1 "Casting Extravaganza" — no maxi-challenge; casting special.
- S3 Ep2 "The Queen Who Mopped Xmas" — design Christmas outfits, not act in a Christmas movie.
- S3 Ep7 "Face, Face, Face of Cakes" — design cake-inspired outfits, not decorate cakes.
- S3 Ep9 "Life, Liberty and the Pursuit of Style" — film a message to the troops, not a design challenge.
- S3 Ep10 "RuPaul-a-palooza" — sing "Superstar" in assigned genres, not comedy/variety.

**Wrong TS titles:**
- S3 TS Ep10 titled "RuPaul's Hair Extravaganza" — should be "The Hair Ball."
- S3 TS Ep12 titled "Make Dat Money" — should be "The Money Ball."

**Placements**: all three TS files have `placements: {}` for every episode — no placement data exists to audit or verify.

**Eliminations**: all 0 discrepancies across S1–S3; the TS `eliminated` arrays are consistent with Wikipedia. Finale eliminations (Rebecca in S1, Jujubee/Raven in S2, Alexis/Manila in S3) are not represented as regular eliminations — a data-model choice to watch for but not a factual error in the existing entries.
