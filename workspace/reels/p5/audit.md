# P-5 audit · 26 Nov 2026 · script v3 (from the real runs; Gemini dropped, it errored on every try)

Script: `script_v3_spoken.txt` (runs in `runs/`). Batch 2 test starts here (one change: frame 0 = real AI chat). Verdicts: PASS / FAIL /
PENDING (needs today's real runs). ⛔ = hard line: a FAIL means rewrite before building.

## H. The 11 questions (honest overview)

| # | Brick | Verdict | Why |
| --- | --- | --- | --- |
| H1 | Format | PASS | Same request, 2 tools, before/after side by side: the most direct way to show "each AI signs differently" |
| H2 | Topic | PASS | "Sounds like AI" costs sellers trust; PLAIN downloads exist; ChatGPT/Claude/Gemini named in the top outliers (viral-formats) |
| H3 | Seed | PASS | Challenges "one 'write like a human' rule fixes AI writing": the tells differ per tool |
| H4 | Substance | PASS | They can paste one list per tool today (Plain Voice has a version for each) |
| H5 | Visual hook | PASS | Real ChatGPT default reply has visible tells (4 "!", bold line, em dash): circle them on frame 0 |
| H6 | Text hook | PASS | Pill "2 AIs. 2 signatures." + the typed question; aligned with the spoken hook |
| H7 | Spoken hook | PASS | "Lose sales with your AI email? Customers still spot 2 AI signatures." hookscore 93.8 |
| H8 | Structure | PASS | Each tool's tell is a small answer that raises "what about mine?"; the after-numbers are held to the end |
| H9 | CTA | PASS | One ask: comment PLAIN |
| H10 | Layout | PASS | Real screens + small Sage, our strength; drops the poster look that lost 94% |
| H11 | Elements | PENDING | Checked after the build (QA) |

## A. Idea and demand

| # | Verdict | Evidence |
| --- | --- | --- |
| A1 ⛔ | PASS | Buyer: people who sell with AI-written emails/posts (shop owners, freelancers, creators). They'd pay for a method that makes AI output usable |
| A2 ⛔ | PASS | PLAIN guide demand; viral-formats: ChatGPT named in 5 of the top 8; hook-bank H7 (problem everyone has) 60.4x |
| A3 ⛔ | PASS | Remix source: aistuff.muu DfKOAiwClVw, **60.4x** (5,277 comments): "Why does [AI] [annoying thing] every time you [common action]?" + the AI result on screen by 1.5 s. Second source for the side-by-side: okaashish DfuNtfIv3DH 16.4x (H2, two results with a number under each) |
| A4 | PASS | Seed "each AI has a different tell, so one generic rule misses two of them" beats the usual "make AI sound human" (which flopped for rubenhassid, 0.7x): we show it in 3 real replies |
| A5 ⛔ | PASS | 4 real runs, 26 Nov, same prompt ("Write a short email to my customers announcing 20% off everything in my handmade soap shop this weekend."): ChatGPT Free default (temp chat, unpersonalized) + with Plain Voice; Claude Opus 5.5 default (incognito) + with Plain Voice (project instructions). Text + screenshots in runs/. Gemini errored 3 times, dropped (user call) |
| A6 | PASS | One idea (each AI signs differently); hook = anyone who sends AI-written emails; narrows to the 3 lists after s 10 |
| A7 | PASS | P-6 (20 Nov) was ChatGPT only, one draft; this changes the topic brick (3 tools) and the frame 0 |

## B. Format

| # | Verdict | Evidence |
| --- | --- | --- |
| B1 ⛔ | PASS | Kept from aistuff 60.4x: format (problem question + real AI result on screen by 1.5 s), hook structure ("Why does your AI [problem]?"), script flow (problem → why → fix), visual style (real screen top, presenter below). Changed: the idea (email signatures, 3 tools) |
| B2 | PASS | F1 Result first (real replies from frame 0) + F5 flavour (a count with a clear benefit) |
| B3 | PASS | Real screenshots + our Remotion system can match it; no face needed (Sage) |
| B4 | PASS | Bricks: format side-by-side · topic AI-written emails · seed per-tool tells · substance 3 short lists · visual hook real chat with circled tells · text hook "3 AIs. 3 signatures." · spoken hook "Why does your AI email lose sales?" · structure H/L/B1/R/B2/CTA · CTA comment PLAIN · layout split screen · elements counts, circles, strikes |
| B5 | PASS | Hypothesis (STATUS Test column): "frame 0 = real AI chat with the hook as the question, vs the designed poster (N-8/V-3 skip 94%)" |

## C. Hook

| # | Verdict | Evidence |
| --- | --- | --- |
| C1 ⛔ | PASS | Pill "2 AIs. 2 signatures." (4 words) + the typed question "Why does my AI email lose sales?" (7 words) |
| C2 ⛔ | PENDING | 360 px feed test on the frame-0 still once the real screenshot is in |
| C3 ⛔ | PASS | Real ChatGPT default reply (runs/chatgpt_default.jpg): 4 "!", a bold line, an em dash, "Don't miss out" to circle |
| C4 ⛔ | PASS | Text: typed question + pill · visual: real ChatGPT email with tells circled · spoken: "Lose sales with your AI email? Customers still spot 2 AI signatures." One idea, clear on mute |
| C5 | PASS | Subject (your AI email) and stake (sales) in sentence 1; simple words; no product names in the hook |
| C6 ⛔ | PASS | Belief: "AI writing all sounds the same; 'write like a human' fixes it" → reality: "each tool has its own tell; one rule misses two of them" |
| C7 | PASS | Subject: your AI email · stakes: lost sales · simple words · one short question + one short answer |
| C8 | PASS | v3 hook = **93.8** (length 88, the rest 100). 2 caption beats |
| C9 | PASS (plan) | The question types in on frame 0-1 (cursor moving), circles draw from 0.5 s; screen filled top to bottom |
| C10 | PASS | Ends "…AI wrote your email." → loops into "Why does your AI email…" |
| C11 ⛔ | PASS (plan) | Frame 0 = real ChatGPT chat, the hook typed as the user's message, Sage small below, headline pill at the seam. No poster |
| C12 ⛔ | PASS | First words: "your AI email lose sales": everyone who sells with AI writes emails |
| C13 ⛔ | PASS | No "Stop" opener; looks unlike N-8/V-3 (a chat screen, not a headline poster). Side-by-side still check at build |
| C14 | PASS | Structure from aistuff H7 (60.4x); hook work done first today (16 variants scored) |

## D. Script

| # | Verdict | Evidence |
| --- | --- | --- |
| D1 | PASS | Hook · lock-in (**contrast**: "One shouts, one decorates." by 0:07) · body 1 (ChatGPT tells, Claude tells, shared "the perfect time") · rehook ~0:21 ("one rule can't fix ChatGPT and Claude. 2 tools, 2 different mistakes.") · body 2 (list per tool, after-results incl. what ChatGPT kept) · CTA · loop |
| D2 ⛔ | PASS (plan) | By 0:04 the three real replies are on screen with a count under each |
| D3 | PASS | Point 1: each tool signs differently (real tells). Point 2: one list per tool fixes most of it; honest leftover (ChatGPT kept 4 "!") |
| D4 | PASS | Rehook at ~0:21, contrast with block 1 |
| D5 | PASS | v2: one sentence per beat, none over 4 s; a new on-screen element per beat (count, circle, zoom, list line) |
| D6 | PASS | The answer (the 3 lists work, counts drop) comes before the CTA; one ask |
| D7 | PASS | 140 words, beats.py ≈ 51 s: inside 45-90 |
| D8 | PASS | Checked line by line against runs/*.txt: ChatGPT default 4 "!" (subject, "special!", "only!", "Happy shopping!"), 1 bold, 1 em dash, "Don't miss out"; Claude default 3 emoji (🧼 🗓 💸), "every bar, every scent, every gift set", "It truly means the world"; both "the perfect time"; Claude with list: 0 emoji, no "perfect time", dates "November 28 and 29"; ChatGPT with list: no bold, no dash, 4 "!" kept. No claim about what ChatGPT's other leftovers ("perfect time", "don't miss out") did: the script doesn't say they went |
| D9 | PASS | Read aloud: no em dashes, no "not just X", contractions; human score at final |
| D10 | PASS | Saveable: the three short lists on screen, one per tool |

## E. Edit and finish (checked in QA after render)

E1-E7: PENDING (build). Remix pace: aistuff shows the result by 1.5 s; ours by 0.5 s.

## F. Funnel and post

| # | Verdict | Evidence |
| --- | --- | --- |
| F1 ⛔ | PASS | Plain Voice has a separate version for ChatGPT, Claude and Gemini (sections 05-07, pages 6-8), where to paste each in section 04 (page 5) |
| F2 ⛔ | PASS | The bot's default PLAIN pointer already says it: "The ready-to-paste prompts for ChatGPT, Claude and Gemini are in sections 05 to 07 (pages 6 to 8), and where to paste each one is in section 04 (page 5)." The caption must not contain "candle shop" (that pointer belongs to P-6). Test with one real comment after posting |
| F3 | PENDING | Caption at build: starts "Comment PLAIN and I'll send you all 3 lists free…", exact tells from the runs, 3 hashtags. Note: Plain Voice has 3 lists (incl. Gemini), so "all 3 lists" is true |
| F4 | PENDING | TikTok version "DM me PLAIN" |
| F5 | PASS | Normal post (batch 2 test needs the normal audience) |
| F6 | PASS | Engagement round before 20:00 |

## Verdict

**All pre-build lines pass on v3.** Left: C2/C13 on the frame-0 still, then E, F2-F4, H11 after the build.
Note: the ChatGPT-with-list run used a normal chat with the user's custom instructions (temp chat toggle would not switch);
the Claude default run could not check account-level instructions (incognito, no memory).
