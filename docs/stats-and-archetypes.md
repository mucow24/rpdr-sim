# Queen Stats & Episode Archetypes

Design doc for the stat + archetype system powering the simulation.

## The 8 base stats

Each queen is rated 1–10 on each of these eight dimensions. Ratings follow the [scoring rubric](#scoring-rubric) below. The "10-tier anchors" named here are proposals for calibration — queens whose dominance is widely recognized across multiple seasons or All Stars appearances; open for user review.

### Comedy
Joke writing, timing, landing reads, comedic craft. Measurable in stand-up sets, reading challenges, branded humor maxis, and one-liners in confessionals. Distinct from Improv in that Comedy rewards prepared material.

**10-tier anchors:** Bianca Del Rio (S6), Bob the Drag Queen (S8).

### Improv
On-the-spot character work, unscripted reactions, staying in-scene without a script. Measurable in Snatch Game, improv-troupe challenges (Bossy Rossy-style talk shows), and unscripted moments inside broader challenges.

**10-tier anchors:** Jinkx Monsoon (S5/AS7), BenDeLaCreme (S6/AS3).

### Acting
Scripted performance craft, emotional truth, character embodiment with lines. Measurable in Rusical book scenes, commercial acting, soap/telenovela parodies, dramatic sketch work.

**10-tier anchors:** BenDeLaCreme (S6/AS3), Jinkx Monsoon (S5/AS7).

### Dance
Choreography execution, body control, rhythm. Measurable in girl groups, Rusical choreo, lip-sync floor-work, dance-heavy challenges.

**10-tier anchors:** Shangela (S2/S3/AS3), Alyssa Edwards (S5/AS2).

### Music
Vocal ability + lyric/verse writing + delivering written material. A queen can score high on any mix of these three. Measurable in Rusicals (writing/performing a character's verses), girl groups (verse-writing + performance), original-song challenges, group anthems.

**10-tier anchors:** Jinkx Monsoon (S5/AS7), Ginger Minj (S7/AS2/AS6).

### Design
Garment construction, sewing, engineering a look from raw materials. Distinct from Runway — Design is the making; Runway is the wearing.

**10-tier anchors:** Violet Chachki (S7/AS4), Aquaria (S10).

### Runway
Aesthetic taste, presentation, serving looks week-to-week. Fashion IQ on the main stage. Scored on whether a queen's looks are consistently strong and cohesive, regardless of whether she constructed them.

**10-tier anchors:** Raja (S3), Aquaria (S10).

### Charisma
Star quality, stage presence, connecting with the audience, confessional pop, the "it" factor. Shows up in lip syncs, talent shows, finale moments, and confessional quotability. The glue stat — it appears as a weight in almost every archetype.

**10-tier anchors:** Shangela (multi-season), Bob the Drag Queen (S8).

---

### Lip Sync (separate)

`lipSync` is a **non-skill** number (still 1–10) kept separately on each queen, used only for bottom-2 elimination scoring. It is not a base stat and doesn't appear in archetype weights.

---

## Scoring rubric

How to rate a queen 1–10 on any given stat. The key distinction is **10 = consistency (multiple 9-caliber performances)** vs. **9 = one legendary performance**.

| Score | Label | Evidence needed | Anchors (from Snatch Game example) |
|---:|---|---|---|
| 10 | Undisputed, repeatable mastery | Multiple 9-caliber performances across her run (or across seasons/AS). Zero ambiguity. | Jinkx, BenDeLaCreme, Bob |
| 9 | Legendary single performance; virtually guaranteed to win the episode | One world-class delivery in the stat | Kennedy, Chad, Loosey |
| 8 | Win-capable, not legendary | Clearly the top tier of the episode, not iconic | Bianca, Alaska, Pearl, Thorgy, Onya, Mykki |
| 7 | Strong. Likely safe-to-high. Could win on a weak field | Solid, memorable-in-the-moment | Manila, Katya, Chi Chi, Aquaria, Jackie Cox, Jan |
| 6 | Above average, competent; forgettable | Enjoyable but no lasting impression | Kim Chi, Derrick Barry, Courtney Act |
| 5 | Neutral. No signal either way | Totally inoffensive. Default for unknowns | Kameron Michaels, Violet Chachki |
| 4 | Below average, inoffensive | Would be in danger on a strong-field episode | Peppermint, Lady Camden |
| 3 | Significantly bad; cringe | Actively weak | Phi Phi, Spice, Lineysha |
| 2 | Abysmal, painful | Severe cringe | Gia Gunn, Asia, Vixen, Jiggly, Utica |
| 1 | Historically remembered as worst-ever | Iconic disaster | Alyssa, Aiden, Mia |

### Rubric application notes

- **Default for evidence-sparse stats is 5.** If a queen never gets tested on Dance (e.g., eliminated early, no dance challenges in her season), she starts at 5. Only upgrade from 5 if there's real evidence.
- **"Average" means average among show cast**, not among working drag queens generally. Every queen on the show cleared an audition bar; the rubric calibrates within that pool.
- **10 requires demonstrated consistency.** A single iconic performance caps at 9 — until a later AS appearance or a second in-season peak proves the ceiling was real.
