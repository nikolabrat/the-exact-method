# Reel audit: the full checklist (every Reel, before building)

Decided 23 Nov 2026: the audit checks **everything**, not a summary. Every line below gets a verdict
(PASS / FAIL / N/A) and one line of evidence. A FAIL on a **hard** line (marked ⛔) means rewrite before
building. Show the user the whole filled table with the script.

Sources merged here: memory preferences, CLAUDE.md §4, growth-system (all sections), ig-reel (hookscore,
beats, on-screen rules), content-principles, ig-human, ig-caption, no-slop-motion, real-sfx, remocn, the
Kallaway course (days 1-6 + Storytelling guide). Update this file with every new rule. Day 6's 11-point
checklist is section H: answer it first, as the honest overview, then fill A-G.

Length: **45-90 s** (Kallaway's ideal; the 15-25 s test didn't beat it). Every sentence must earn its place;
45 s is the floor, not a target to pad to.

---

## A. Idea and demand

| # | Check | How to verify |
| --- | --- | --- |
| A1 ⛔ | **Buyer named and passes the relevance gate** (would someone who uses AI to build, sell or create buy a $17-$127 method?) | growth-system §2-3 |
| A2 ⛔ | **Proven demand:** the topic won in our niche recently (idea-shortlist outlier, Reddit/news evidence), not a blank-page idea | link the evidence |
| A3 ⛔ | **Remix source named:** one specific outlier ≥5x its account's median (account, link, multiple, views). Pipe order: our own outliers > competitor outliers > other media > news | growth-system §10, §14 |
| A4 | Seed is non-obvious (a "huh, I didn't know that") and our substance beats the source (real run, better example, sharper take) | write seed in 1 line |
| A5 ⛔ | **Real proof exists:** a real run / real screen / real numbers, model + date; no invented results or numbers | files in workspace/reels/<id> |
| A6 | One idea only; hook breadth = anyone in the buyer pool, narrowing after s3 | growth-system §5 |
| A7 | Not a repeat of a topic/format that just failed without a changed brick | STATUS results log |

## B. Format (remix discipline)

| # | Check | How to verify |
| --- | --- | --- |
| B1 ⛔ | **Hold 4 constant, change 1:** list the 4 bricks kept from the source (format, hook structure, script flow, visual style) and the 1 changed (idea) | growth-system §14 |
| B2 | Format also matches a viral format F1-F5 (`claude/viral-formats.md`), named | |
| B3 | Our production can actually match the source's look and pace (if not, pick another source) | |
| B4 | The 11 bricks written out in one table | growth-system §0 |
| B5 | Improvement hypothesis: the one brick this Reel tests vs the last Reels, written for the STATUS Test column | growth-system §0b, §9 |

## C. Hook (text > visual > spoken)

| # | Check | How to verify |
| --- | --- | --- |
| C1 ⛔ | **Text hook** on frame 0: the full hook as a big headline, ≤ ~8 words, readable in < 1 s | render frame 0 |
| C2 ⛔ | **Feed-size test:** frame 0 scaled to 360 px wide (phone feed): headline and the result still readable/recognisable | export a 360 px still and look |
| C3 ⛔ | **Visual hook** = a real, recognisable result or face on frame 0, not a diagram, not small-text screenshots | |
| C4 ⛔ | **Max alignment:** text, frame-0 visual and spoken hook, one line each, all say the same thing a stranger gets on mute | growth-system §12 |
| C5 | **Clarity:** after sentence 1 the viewer knows the subject and that it's for them; 10-year-old words; no unknown names as the hook | |
| C6 ⛔ | **Contrast:** write "belief → reality" (or price/time/effort gap). Bigger gap = stronger. No contrast = rewrite | growth-system §12 |
| C7 | 4 S's: subject named, stakes, simple words, superclear sentence | §11 |
| C8 | Spoken hook: hookscore ≥ 90 (last check, not the main one); first word spoken by frame ~3 | `hookscore.py` |
| C9 | Motion in the first frame; screen filled, no big empty areas | |
| C10 | Loop: last frame = frame 0, ends on a word from the hook | |

## D. Script

| # | Check | How to verify |
| --- | --- | --- |
| D1 | Parts in order: hook · lock-in (type named) · body 1 · rehook · body 2 · (rehook 2 · body 3) · CTA | §11 |
| D2 ⛔ | Payoff teased on screen by second 5 (teasing proof) | |
| D3 | Two non-obvious points, each with 2-4 sentences of proof | |
| D4 | Rehook is a real contrast, not filler, placed ~20-25 s | |
| D5 | Something new on screen every ~3 s; no beat over 4 s; `beats.py` clean | `beats.py` |
| D6 | The end actually answers the hook; CTA comes after the answer as a bonus; one ask only | memory rule |
| D7 | Length 45-90 s at Mike's pace (~2.85 words/s + pauses); no padding | `beats.py` |
| D8 | Every claim true and checkable; numbers over adjectives; no "AI decides for you" | |
| D9 | ig-human: no AI tells, human score passes; read aloud once | ig-human |
| D10 | Something worth saving on screen (the prompt, the list, the rule) | |

## E. Edit and finish (checked again in QA after render)

| # | Check | How to verify |
| --- | --- | --- |
| E1 | Pacing and look match the remix source | side-by-side |
| E2 | no-slop-motion banned list clear; remocn used for finesse | pop-scan |
| E3 | Captions ≤ 3 words, balanced chunks, timed from **ElevenLabs forced alignment** | caption sheet at word starts |
| E4 | Nothing overlaps Sage's hand; no clipped text; nothing in IG's UI zones (top 230 px, bottom below 1440, right 230 px for key text) | frame sheets every 12 frames |
| E5 | Sound on every new element; voice clear; −14 LUFS, true peak < −1 dB | real-sfx critique |
| E6 | Loop seam clean; 1080x1920, 30 fps | |
| E7 | Cover/thumbnail = the hook, readable in the profile grid | |

## F. Funnel and post

| # | Check | How to verify |
| --- | --- | --- |
| F1 ⛔ | The freebie delivers exactly what the Reel promised | |
| F2 ⛔ | Keyword live **before** posting in the DM bot (`bot` branch, `src/rules.js`): Gumroad keyword → guide + pointer line (section and page); email keyword → its own Kit form whose email holds the freebie (`KIT_FORMS`). Tested with a real comment | bot `/log` |
| F3 | Caption rules (8 standing rules): starts with the keyword CTA, process in one line, exact facts, 3 specific hashtags, no URL | memory |
| F4 | TikTok version ("DM me KEYWORD") + its copy-paste DM in STATUS | |
| F5 | Trial Reel or normal post? (Trial for risky new formats) | |
| F6 | Engagement round planned 20 min before posting | schedule page |

## H. The 11 questions (day 6; one per brick, answer honestly first)

| # | Brick | Question (PASS / FAIL + one line why) |
| --- | --- | --- |
| H1 | Format | Most compelling frame for this information? |
| H2 | Topic | Data says our buyer cares (not just us)? |
| H3 | Seed | Non-obvious angle that challenges a belief usefully? |
| H4 | Substance | They can do something right after watching? |
| H5 | Visual hook | Frame 0 stops the scroll (contrast, movement, unexpected)? |
| H6 | Text hook | Creates a need to know more, aligned with visual + spoken? |
| H7 | Spoken hook | Subject 100% clear + curiosity loop in the first 3 s? |
| H8 | Structure | Builds anticipation, not a list of facts? |
| H9 | CTA | One clear next step (comment KEYWORD)? |
| H10 | Layout | Plays to our strengths (faceless: Sage, real screens, lists)? |
| H11 | Elements | Cuts, captions, sound match the pace; always clear what's happening? |

## G. After posting (24 h and 48 h)

Log in STATUS: reach, views, skip rate, avg watch (and % of length), likes, comments, saves, shares, follows,
keyword comments, guide downloads. Diagnose **by brick**, against the baseline and the hypothesis (B5):
- skip rate high (> 60%) → text/visual hook or frame 0 (C1-C6)
- low skip but avg watch < 25% of length → lock-in / body / rehook (D1-D5)
- watched but no likes/saves/comments → usefulness or relevance (A1, A4, D10)
- comments but no keyword → CTA/funnel (D6, F1-F2)
- low reach with OK retention → check Account Status, posting time, test-pool signals

**Every 10 Reels (batch analysis, growth-system §15):** rank the 10 on views, follows and conversions (bot log,
Gumroad, Kit); run H1-H11 on the 5x+ winners and the worst; write the pattern; pick ONE brick to change for
the next 10. A Reel at 10x+ our average → make 3-5 more with the same format, hook structure and look,
changing only seed or substance (triple down).
