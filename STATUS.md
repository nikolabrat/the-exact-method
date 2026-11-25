# Status and calendar (keep this current)

Every chat that finishes or changes something updates this file and pushes it (branch `references`).
Dates are Europe/Sofia. Last updated: 24 Nov 2026.

- **Own comment-to-DM bot (built 24 Nov, testing):** Cloudflare Worker `exact-dm` (https://exact-dm.theexactmethodhq.workers.dev, code on branch `bot`, auto-deploys on push). Meta app "Exact Method DM" (id 1400181691959713, Live, Unified login, business portfolio "The Exact Method"), @theexactmethod = Instagram Tester, token in Cloudflare secret `IG_TOKEN` (system-user, never expires), webhooks comments/messages/messaging_postbacks. Flow: intro [Send it] → follow ask [I'm following] (skipped if they follow) → Gumroad keywords (NARROW/METHOD/PLAIN/VIDEO): guide + pointer · email keywords (PROMPT + future): "lmk which email" → Kit form email (form "IG PROMPT (DM bot)" 10238346) → DM "Sent ✅ check your inbox"; existing Kit subscribers get the freebie in the DM. Kit: account theexactmethodhq@gmail.com, Creator trial (14 days, then free Newsletter), secret `KIT_API_KEY`, tags `ig-<KEYWORD>`. Log: `/log`.
  - **25 Nov evening: the DM bot is official.** Kit/email flow removed (Kit never sent the email); flow = intro → follow (skipped for followers) → Gumroad link in the DM, PROMPT gets both prompts in the DM. KV write limit fixed (all state in the Durable Object). Old 2-hourly DM task trig_01TXEiDaG5Eg9imrwsLbhUd3 switched off. User may cancel the Kit trial and delete the KIT_API_KEY secret. Optional: PROMPT prompts as a free Gumroad product (ask first).
  - Later: send Kit emails from hello@theexactmethod.com instead of Gmail (Kit warned about deliverability; DNS in Cloudflare, ask first). Optional paid: Cloudflare email sending ($5/mo) so existing subscribers also get freebies by email.

## Daily routine (every day)

- 20:00 the day's Reel goes out (one-shot publish task). The user uploads the TikTok version by hand
  (`<id>-tt` file, "DM me KEYWORD" caption, AI-generated label on).
- 20:17 the pins task posts 3 pins (16-30 Nov).
- Every 2 h (08-22, plus 00:48) the keyword task DMs people who commented NARROW / PLAIN / VIDEO.
  When a new Reel uses a keyword with a new promise, add its pointer line to that task's prompt.
- Morning check: yesterday's Reel stats (reach, skip rate, avg watch, saves, shares) into the log below.
- Buyer conversations this week (see Outreach).

## Calendar

Rhythm (from 19 Nov): 5 Reels a week, Mon-Fri. Weekends: no Reels; strategy and content-quality work. Sunday builds Monday's Reel.

| Day | Reel (20:00) | Also that day |
| --- | --- | --- |
| Mon 16 Nov | W-5 · Stop typing the same rules (PLAIN), scheduled | Plain Voice PDF switch (laptop chat) before 20:00; TikTok upload of W-5 |
| Tue 17 Nov | A-1 · Stop asking "are you sure?" (METHOD → The Narrowing Method), rebuilt from scratch, 58.7 s, scheduled | TikTok upload of A-1 (laptop: Videos/TikTok versions). **N-7 real run** (AI run for Thu's Reel) |
| Wed 18 Nov | V-2 · Stop hunting for mistakes (VIDEO → The Video Brief, section 10 p12), new script, 28.1 s, first short-Reel test, scheduled (container 18079389593505069) | TikTok upload of V-2 (laptop: Videos/TikTok versions). Log V-2 stats 19 Nov |
| Thu 19 Nov | N-7 · Never sell ChatGPT's first idea (NARROW → section 03 p4), new script, hook 100, 30.0 s, real run 19 Nov, scheduled (container 18079790555505069) | TikTok upload of N-7 (laptop: Videos/TikTok versions). **P-4 real run**. Log N-7 stats 20 Nov |
| Fri 20 Nov | P-6 · Never send ChatGPT's first draft (PLAIN → sections 04 + 05), new script, hook 92.6, 24.1 s, 3 real runs 20 Nov, scheduled (container 18080082737505069) | TikTok upload of P-6 (laptop: Videos/TikTok versions). Log N-7 stats (24 h) and P-6 stats 21 Nov |
| Sat 21 Nov | none | **Strategy day**: next Short Form Growth System emails → update growth-system. **First Idea Mining** (growth-system §10, ig-viral skill): watchlist of 10-15 accounts serving our buyer, their Reels from the last 30 days with outlier score ≥ 1, ≥ 25,000 views, engagement ≥ 2%; top 5-7 winning topics; shortlist of 10-20 ideas (topic + our new seed from a real run + link to the outlier) in `scripts/idea-shortlist.md`. Analyse each with the 5 questions |
| Sun 22 Nov | none | **Hook mining first** (growth-system §12, from Day 3): from the outliers in `scripts/idea-shortlist.md`, write each one's text hook, frame-0 visual and spoken hook, check alignment, and keep the hook structures that won in `scripts/hook-bank.md`; pick W-7's hook from it. Then **build Mon's W-7** with the new rules: pick its idea from the outlier shortlist (remix: keep 8-10 of the outlier's 11 bricks, change 1-3), full §11 structure at 40-60 s (hook, lock-in, body 1 with 3-5 sentences of proof, rehook, body 2 with 3-5 sentences of proof, CTA); each body block states its surprising point out loud and explains why it works, schedule for Mon 20:00 (container valid 24 h: create it after ~20:00 Sun). **N-8 real run** |
| Mon 23 Nov | ✅ W-7 · 2 prompts built this calculator ($17 pack) | Scheduled 20:00 (container 18081153728505069, task trig_01PXKcCFgw6A2W5NbwDP4NY3). PROMPT rule added to the DM task. Laptop folder done. **User: upload TikTok version.** Log stats 24 Nov |
| Tue 24 Nov | ✅ N-8 · Stop paying for 3 AI tools (NARROW → section 03 p4), real runs 12:27/12:28, 67.6 s, hook 94.8, 14 QA fixes | Scheduled 20:00 (container 18081397130505069, task trig_01Cvv4rpws7fsizNT8mHh9aF). DM task: N-8 pointer added. Schedule page + laptop folder done. **User: upload TikTok version.** Log stats 25 Nov. **Next: build our own ManyChat (comment-to-DM bot)** |
| Wed 25 Nov | ✅ V-3 · Stop editing your Reels (VIDEO → section 07 p9), idea 19 (Reel built from its own 6-block brief), 76.8 s, brief-card spine + rail, 106 real SFX, −14.2 LUFS; audit fixed overlaps/mistimings, pointing pose dropped so captions stay full width | Scheduled 20:00 (container 18081746135505069, task trig_01WZ8QRN7q8skECd7fe2XfXi). Bot + 2-hourly DM task: V-3 pointer ("6-block brief"). Schedule page + laptop folder done. **User: upload TikTok version.** Log stats 26 Nov. Still open: bot PROMPT retest, N-9 real run |
| Thu 26 Nov | P-5 · Three tools, three habits (PLAIN) | **Batch 2 test starts here** (one change: frame 0). Audit C1-C14 all PASS before building: real AI chat on frame 0 with the hook as the question, Sage small below (split screen), buyer-pool problem in the first words, no "Stop" opener, different look from N-8/V-3, text = visual = spoken on mute, contrast belief → reality, 10-year-old words, motion in frame 0, feed-size test at 360 px. Test column: "frame 0 = real AI chat vs designed poster" |
| Fri 27 Nov | N-9 · Where the first 100 visitors come from (NARROW) | |
| Sat 28 Nov | none | |
| Sun 29 Nov | none | Build Mon's P-4 (create the container after ~20:00) |
| Mon 30 Nov | P-4 · The number nobody could source (PLAIN), moved from Sun 29 | Last pins day. **Switch off the pins task** and plan the next pin batch (with the cheat-sheet test, see scripts/pin-ideas.md) |

The live schedule page (https://claude.ai/artifact/FJ7UGJZBNgN7mehAp4hE9Y) has the same Reels with notes;
update it too when a date moves. Reels without a script in `scripts/` get their script written on the day,
from the title, the guide it points to, and the rules in memory.

## Open to-dos

- [ ] Plain Voice section 04: add a line that ChatGPT's email-draft view mostly ignores the formatting rule (P-6 run: rules alone 9 → 7 marks), and that the follow-up line fixes it (7 → 0). New PDF version via product-files
- [ ] Sage lip sync: real open-mouth poses made in Gemini 22 Nov (`public/sage/<pose>-mid.jpg` and `-open.jpg`, same 848x1264 framing as the originals): **all 16 Sage done**, Brick 1 of 18 (`brick-mid`). Gemini daily image limit hit; Brick resumes after the reset (same prompts, one new chat per image, download → ~/Downloads → stage). Then switch P6-style lip sync from drawn mouths to swapping closed/mid/open images

- [x] Instagram link restriction (19 Nov 20:14) lifted after review 20:24 same day ("our technology made a mistake"). DM task re-enabled

- [ ] Delete GitHub branch `plain-voice-claude-path` (user, on GitHub)
- [ ] Remove unused connectors from the keyword DM task (user, in the task's settings)
- [ ] Publish the 3 Gumroad email workflows once earnings pass $100 and a payout has happened
- [ ] Check that theexactmethod.com/plain-voice/ shows "Settings, then Your Claude, then Instructions" (merged 16 Nov, PR #15)
- [x] Plain Voice PDF switched into the folder and Gumroad (16 Nov)
- [ ] Re-run /ig-viral about monthly (next ~16 Dec) and update the project doc `claude/viral-formats.md`

## Notes (17 Nov)

- **Short-Reel test: ended 20 Nov, verdict: drop it.** V-2 6.0 s, N-7 7.3 s, P-6 6.0 s average watch vs ~7 s before; skip 58-72%. Shorter Reels did not keep people longer, they only gave them less. From W-7: 40-60 s with the full growth-system §11 structure (two real body blocks + one rehook). Keep: frame-0 headline, real result on frame 0, payoff teased by s 5.
- **Never done yet (found 20 Nov, from the growth-system emails):** (1) no Reel idea has ever come from a proven outlier (all ours were originals, pipe 6) → Idea Mining every 2 weeks from 21 Nov; (2) two full body blocks + rehook never had room → 40-60 s from W-7; (3) lock-in methods other than teasing proof (magic box, clarifying contrast) never tried; (4) never an open loop to the next Reel ("tomorrow: …") or a quick self-check for the viewer; (5) Follows / Keyword comments / Free downloads columns never filled → fill them for every Reel from now (follows: account insights; downloads: Gumroad /v2/sales).
- **P-6 diagnosis by brick (20 Nov):** text hook unclear ("giveaways" of what?); lock-in gave the end result by s 4; body 1 was only evidence (no point); body 2 one sentence, the line shown but never explained. The real surprises from the run (email-draft view ignores formatting rules; quoting its own mistakes back fixes it) were never said.

- Script audits now also check the script matches a viral format (project doc `claude/viral-formats.md`, research in `workspace/research/`).
- Every video also goes into the laptop folder `The Exact Method/Videos/` (manual §4 step 10).
- METHOD keyword added to the DM task: sends The Narrowing Method (habit one). Offer Reels point to a free guide, with the paid product as "link in bio".

## Outreach (week of 16 Nov: talk to possible buyers)

Goal: learn how buyers describe their AI problems; no selling in first messages.
- Who: people who commented on the Reels; buyer-type accounts nobleejohnson, emv710 (comment on their posts
  first); people asking "how do I get ChatGPT/Claude to..." under other AI creators' posts.
- How: no pitch, no link in message 1. One question about something they actually did, e.g. "What's the last
  thing you tried to get ChatGPT or Claude to do that came out wrong?" Offer the matching free guide only if
  they answer, then ask what was missing. 2-3 lines, max one follow-up. The user sends these by hand
  (ig-dm skill drafts them). Log replies below.
- Reddit: a post was taken down; mods have not replied. Don't repost in the same subreddit. One polite modmail
  asking which rule it broke. Meanwhile give useful answers (no links) in threads about bad AI answers, and
  only post in subreddits whose rules allow feedback/self-promo posts.

| Date | Who | Where | What they said |
| --- | --- | --- | --- |

## Reel results log

| Reel | Posted | Length | Reach | Skip rate | Avg watch | Saves | Shares | Follows | Keyword comments | Free downloads | Test (hypothesis) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V-5 | 15 Nov | 32.4 s | 209 | 66.5% | 6.9 s | 4 | 1 |  |  |  |  |
| W-5 | 16 Nov | 49.8 s | 166 | 52% | 7.3 s | 1 | 0 |  |  |  |  |
| A-1 | 17 Nov | 58.7 s | 125 | 60% | 7.2 s | 1 | 0 |  |  |  |  |
| V-2 | 18 Nov | 28.1 s | 125 | 72% | 6.0 s | 1 | 0 |  |  |  |  |
| N-7 | 19 Nov | 30.0 s | 95 | 58.9% | 7.3 s | 1 | 0 | 0 (5 total) | 0 |  | first Reel with the frame-0 headline + real run on frame 0 (vs V-2 skip 72%). 2 h: reach 23 (flag); 48 h: 95, lowest skip of the 3 |
| P-6 | 20 Nov | 24.1 s | 22 | 64.0% | 6.5 s | 1 | 0 | 0 | 0 |  | two real answers side by side on frame 0 + giveaway counter; first talking-bust Sage. 24 h: reach 22 only (N-7 was 95 at 48 h): distribution problem, not the video (skip and watch in line) |
| W-7 | 23 Nov | 59.6 s | 106 | 73.5% | 6.6 s | 1 | 0 |  | 2 (user tests) |  | (stats 25 Nov 22:00) |
| N-8 | 24 Nov | 67.7 s | 58 | 93.8% | 5.1 s | 1 | 0 |  | 1 (user test) |  | (stats 25 Nov 22:00) |
| V-3 | 25 Nov | 76.8 s | 85 | 93.5% | 5.3 s | 1 | 0 |  | 1 (user test) |  | 2 h only; recheck at 24 h |

Finding (25 Nov): skip rate has climbed Reel after Reel since the talking-bust layout came in: N-7 58.9% (full-body
Sage, real ChatGPT chat as the main picture) → P-6 64% (first bust) → W-7 73.5% → N-8 93.8% → V-3 93.5%. The last
three open on a designed poster (big headline + dense card + big Sage bust) that looks the same every day, and two
in a row opened with "Stop ...". V-3's hook speaks to Reel creators, not the buyer pool. Samples are tiny (58-106
reach), so treat this as a hypothesis. Test for the next batch (one change): frame 0 = a real, recognisable AI
chat (the W-5/A-1/N-7 look, skip 52-60%) with the hook as the question in it; buyer-pool problem in the first words;
no "Stop" opener.

Earlier Reels (reach / avg watch): 9 Nov 344 / 12.1 s (best), 10 Nov 225 / 7.9 s, 1 Nov 186 / 9.6 s,
14 Nov 109 / 3.8 s. Account median reach about 130. Followers: 5 (16 Nov).
Finding (16 Nov): views stop after Instagram's first test group; 2 of 3 viewers leave in the first 3 s, so
the hook is the main problem. Not caused by posting from Bulgaria.
Finding (17 Nov): skip rate improved (60% and 52% vs 66-95% before), but average watch stays at ~7 s on every Reel
whatever its length (32-59 s), so viewers leave right after the hook. With 0 shares and 0-1 saves, no Reel gets past the
first test group (~100-250). Next test: short Reels (15-25 s) with the payoff in the first 5 s.

## Sales

- The Narrowing Method: 1 free claim (2 Nov, Sofia, from gumroad.com; probably the user or a friend), 2 downloads.
- All other products: 0 (16 Nov).

## Notes (18 Nov)

- V-2 rebuilt from a new script ("Stop hunting for mistakes": paste the phone-check line before watching a Claude video; proof = the two real A-1 bugs it caught). Sources: `workspace/reels/v2v/`, `workspace/reels/v2sfx/make_sheet.py`, `src/V2.tsx`.
- Caption timing: word times now come from ElevenLabs forced alignment (Composio tool ELEVENLABS_ALIGN_AUDIO_AND_TRANSCRIPT on each processed line file; `el_align.json` + `totiming_el.py`). Whisper word times ran 2-3 frames late and got pauses wrong. Use this for every new Reel. Words light 1 frame before they are spoken; caption breaks set by hand (max 3 words, by meaning).
- New V2 building blocks reusable for the next Reels: card transitions (crash zoom, fly-off, push, page turn, whip, pull back), a loop-safe camera (drift, punch-ins, impact shakes), the 8-chip pile-up from the pile-up reference.
- Sound: user wants effects clearly audible. V-2 mix used `--voice-depth normal --sfx-trim-db 9` (effects about 9 dB louder than before, ducked harder under speech); big hits as role "hit" with highpass 150. New ElevenLabs sounds in ~/sfx-library/elevenlabs: riser, impact, zoomwhoosh, cardfly, scan, stampthunk, cardpile, notif.
- DM keyword task: added the V-2 pointer (caption contains "like you're on your phone" → section 10, page 12).
- V-2 results (4 h, final): IG reach 125, skip 72%, avg watch 6.0 s, 0 likes, 1 save. TikTok 67 views, avg 2.5 s, 1.5% full watch, most left at 0:01. Shorter did not raise watch time (6-7 s at 28, 50 and 59 s): viewers decide in the first second. Frame 0 shows an abstract phone mock-up and two words ("Stop hunting"), the hook assumes the viewer already makes videos with Claude, and half the screen is empty. Next Reels: full hook as a big headline on frame 0, a real result or face on frame 0, a broader audience in the first words.

## Notes (21 Nov)

- First Idea Mining done: `scripts/idea-shortlist.md` (10 accounts, ~170 Reels, 26 outliers ≥3x, 12 relevant, 12 ideas). Picks: W-7 = idea 3 (one prompt builds a real thing + "comment PROMPT for the exact prompt"), N-8 = idea 6 (which AI for which job, as a map). Next mining ~5 Dec.
- Engagement list updated 21 Nov (schedule page too): Reach = okaashish, stm_fast, trywithmark, cracked.artificial, rubenhassid · Peers = saib.tech, ernestosoftware, adam.kelada.media · Buyers = each round reply to 2 commenters on those outliers who asked a real build/sell-with-AI question, never pitch. Dropped: growthwithhardik, ai_indiaaa, ai_prompt.s, ai.prompts.lab, ai.promptstu, nobleejohnson, emv710. Follows synced 21 Nov as theexactmethod: followed cracked.artificial, rubenhassid, saib.tech, ernestosoftware, adam.kelada.media; unfollowed the dropped 6 (ai_indiaaa gone).
- Idea mining batch 2 (21 Nov evening): 161 Reels from the 5 new accounts, 17 relevant outliers, ideas 13-18 in scripts/idea-shortlist.md. saib.tech = no idea source (PC tricks). Priority: W-7 idea 3, N-8 ideas 6+18, then 15 (tier list) and 14 (warning + 3 prompts).
- Hook mining round 1 done 22 Nov: 22 outliers → 11 hook structures in scripts/hook-bank.md. Result-first confirmed (15/22 by 1.5 s); new gap = short save-able silent loops 6-13 s (H4). W-7 hook: text "One prompt built this", frame 0 = finished pricing sheet, spoken "Look at this pricing calculator. One prompt built it. No edits."
- Pinterest idea mining round 1 done 22 Nov: scripts/pin-ideas.md (596 pins over 12 keywords + our 55). Dense cheat sheets/carousels win saves; Plain Voice topic proven on Pinterest (10K saves). 7 pin ideas P1-P7. Decided 22 Nov: test a dense cheat-sheet pin type next to the standard pins for 3 weeks. b45 already fills 23-30 Nov, so nothing new is scheduled now: the next pin batch (from 1 Dec, planned on 30 Nov) includes the cheat-sheet pins (P1-P7 in scripts/pin-ideas.md).
- Kallaway Day 4 read 22 Nov → growth-system section 13 (funnel, conversions per view). Decided 22 Nov: (1) W-7 keeps the planned DM (both prompts in the DM + $17 link, no email capture) because we're still in the setup phase; revisit the $0-product version once numbers grow; (2) email nurture is the biggest gap (Gumroad workflows locked until $100) → option: free email tool now. From W-7 on, log keyword DMs + free downloads per Reel (48 h) in the stats.
- ~~OpenReply~~ replaced 24 Nov by our own Cloudflare bot (see top). Old note: decided 22 Nov: original OpenReply (github.com/diwenne/openreply), all 4 parts on Railway (web app, worker, Postgres, Redis), no code changes. Railway: signed up 22 Nov on the free trial ($5, 30 days; nothing deployed yet so credit untouched) → upgrade to Hobby before the trial ends (by ~20 Dec), set usage limit. Meta developer sign-up blocked by Facebook's new-device lock 22 Nov → user uses Facebook normally on the laptop, **retry once on Thu 26 Nov**. Still to do: fork to nikolabrat/openreply, Resend + verify theexactmethod.com (Claude adds DNS in Cloudflare). Then Claude builds Railway + Meta app + campaigns per Reel, test DM, then switch off trig_01TXEiDaG5Eg9imrwsLbhUd3 and update CLAUDE.md.
- **Email capture plan (decided 23 Nov):** Gumroad free products force the pay-what-you-want "0" field (too many steps), so emails move to **Kit free** (up to 10k subscribers; API, tags, incentive files included; no sequences/automations on free). Flow once OpenReply is live: comment KEYWORD → instant DM asks for the email → bot adds them to Kit with a topic tag (consent line in the DM) → DM sends the guide right away. Lets any Reel offer a non-PDF freebie (prompts, skills, checklists). Still to check in the first test: whether an API-added subscriber gets the form's incentive email. User: sign up Kit with theexactmethodhq@gmail.com, then make an API key (never paste it in chat; it goes into Railway). Nurture = manual weekly broadcast until the list is ~300 or Gumroad workflows unlock; then Kit Creator ($39/mo). Kit's $20/mo promo ends 1 Dec.
- **W-7 (23 Nov):** built, audited, 115 sounds, captions on ElevenLabs forced alignment (old whisper timings were up to 8 frames late). Final files: workspace/remotion/out/W7-ig.mp4, W7-tt.mp4. Scheduled 23 Nov 20:00.
- **Instagram reconnected 23 Nov:** Meta invalidated the old Composio session (code 190) after the phone-number security change. New account instagram_caner-afore (default); DM task and CLAUDE.md updated. Old instagram_aspace-nabs still listed in Composio (dead) — remove when the user OKs.
- **W-7 stats at 2 h (23 Nov 21:50):** reach 93, views 109, skip 74.7%, avg watch 5.5 s (of 58.5 s), 0 likes, 0 comments, 1 save. Account: 5 followers, 22 posts; last 7 days reach 459 (454 non-followers). Last 12 Reels: 0-2 likes each, skip 52-79%, avg watch 3.8-7.3 s (best: W-2 9 Nov, reach 344, skip 48%, 12.1 s). P-6 (20 Nov) only 22 reach. Diagnosis + plan in chat 23 Nov: length (58 s broke the 15-25 s test), frame 0 not readable at feed size, own formats instead of remixed 5x+ outliers, topic demand. **User: check Settings → Account Status (recommendable?).**
- **Engagement round 24 Nov:** comments posted from @theexactmethod (~2 min apart, all verified) on trywithmark (Sjinn hour-long AI movies, DgIH3Hhyicu: character consistency question), okaashish (TSMC, DgHZo7xvBUC: who can catch up), techguyver (Suno MCP, DgFA23agOAM: grime style across takes). Skipped: cracked.artificial/rubenhassid/stm_fast (done yesterday), ernestosoftware/adam.kelada.media (no fresh post), saib.tech (caption too thin), ai__indiaaa (off-niche). Next round: check replies on these 3.
- **Engagement round 23 Nov (19:35):** comments posted from @theexactmethod on cracked.artificial (security stack, DgFcj0HA-7u), rubenhassid (Claude docs, DgFVb4jBGEe), stm_fast (10 IG checks, DgF6TPxIBKx). Skipped: okaashish/ernestosoftware/adam.kelada.media (no fresh Reel), trywithmark (already commented), saib.tech (comments off). Chrome had flipped to the personal account again; switched back before posting.
- **Idea mining batch 3 (23 Nov, wide):** 92 IG outliers + Reddit 20 subs + news → ideas 19-30 in scripts/idea-shortlist.md. Priority: 19/20 (Reels made with Claude, VIDEO, no new run), then 22, 24, N-8 as 29; 21/25/27/30 after Kit + OpenReply.
- **TikTok DM automation:** comment-to-DM isn't possible on TikTok; keyword replies to inbound DMs need a Business account (native Business Suite, free) or ManyChat. User can't switch to Business until registered as a business — revisit then (short replies under 500 chars per keyword).
- **Meta developer sign-up:** done 24 Nov (worked after removing the phone number from settings).
- 2 unread DMs on @theexactmethod (seen 21 Nov, not opened).

## Notes (20 Nov)

- Engagement round 20 Nov (Chrome, as theexactmethod, ~3 min apart): commented on stm_fast (Google History reel), okaashish (new-laptop VRAM reel), trywithmark (stickman AI video). Engagement list refreshed 21 Nov (reasons: ai_indiaaa account gone; ai_prompt.s, ai.prompts.lab, ai.promptstu post AI portrait prompts (off-topic for builders); growthwithhardik no new reels in 12 weeks; nobleejohnson and emv710 post personal content).

- P-6 rebuilt from 3 real ChatGPT runs (20 Nov, same prompt, candle-shop email): A default = 9 marks (1 emoji, 3 bold, 5 "!"); B with Plain Voice instructions + Headers & Lists/Emojis on Less = 7; C after the follow-up line "Your last answer used bold and exclamation marks. My instructions say plain paragraphs only. Rewrite the same answer following them exactly." = 0. C still has hype wording, so the Reel only claims the visible marks went to 0. ChatGPT opened its email-draft view ("Connect email") in every run.
- Build: `src/P6.tsx`. remocn used: SmashCount (7 → 0, Google-font load removed for offline render), ScanBand (from scan-fix, A → C), CrumpleToss, ScribbleCircle, InkArrow, TrimBurst, Caret. Swinging counter hang-tag, "+1" per mark, tape on cards.
- Sage is now a talking bust (reference: thomassmithai Reel): instant pose swaps with a small pop, 13 poses by content, lip sync = per-word open/close cycles scaled by voice loudness (`src/p6mouth_*.json`), drawn mouth over a painted-out patch of the original mouth (`public/sage/<pose>-patch.png`, measured mouth positions in P6.tsx). Copy this for future Sage Reels.
- Voice: extra atempo 1.08 (like N-7), ElevenLabs forced alignment for word timings. Sound: 50 cues, 47 distinct, 4 new ElevenLabs sounds (matchstrike, vertigo, numslam, puff). -14.2 LUFS.
- DM task: PLAIN + caption "candle shop" → sections 05 (p6) and 04 (p5) with the follow-up line.

## Notes (19 Nov)

- N-7 built with the frame-0 test: full hook as a headline (outside the camera layer so a push-in never moves it out of the safe zone), real ChatGPT answers re-typeset word for word in large text ("excerpt · real run" label), since 1920-wide screen recordings are unreadable on a phone. Real footage kept for the shortlist scroll. Raw runs in the laptop's Videos/Raw footage.
- Sound on everything: 50 cues, 49 distinct (library + uisfx + 6 new ElevenLabs sounds: markersq, cardfan, focussnap, coin, clocktick, emptythud). Critique flags pacing (13/10 s), accepted on purpose.
- /home/claude/dl.sh now takes the signing date from the X-Amz-Date argument (it was fixed to 18 Nov).
- DM keyword task: NARROW + caption "what should i sell online first" → section 03, page 4.
- 20:14 Instagram restricted @theexactmethod from sharing links until 19 Dec (reason: "may deceive others to take their money…"). No keyword DMs had gone out yet (only 1 test DM to the user's own account), so not a DM-volume issue. Likely trigger: an automated classifier on a 5-follower account that posted 20 Reels via API in a short time, with 'Comment X and I'll DM you a free guide' captions + 'free guides / instant PDF downloads' bio + external link. N-7 at 2 h: reach 23, 33 views, avg watch 8.0 s (best yet), skip 66.7%. Reach likely cut by the integrity flag that hit 14 min after posting (first test batch). Recheck at 24 h and check Account status → recommendations. User requested review; Instagram removed it at 20:24 ("our technology made a mistake"). DM task paused 20:15, re-enabled 20:24, back to normal.
- New skill `skills/growth-system` (from the Short Form Growth System emails): Game 5, buyer-pool relevance gate, trust = minutes × relevance × usefulness, trust metrics in the results log (follows, keyword comments, free downloads added). Updated after each email the user sends.

## TikTok keyword DMs (copy-paste by hand, until a Business account or 1,000 followers)

Open TikTok DMs once a day. Reply to each "KEYWORD" DM with the matching text. For a Reel with a specific
pointer (section/page), use the pointer line from the Instagram DM task instead of the general one.

PROMPT (W-7):
```
Here are both prompts, word for word. Run them in order, in the same chat:

1. "I want to build [what you want to build, in plain language]. Give me a numbered build plan where each number is a single, indivisible task. Anywhere a number would secretly cover two different jobs, break it into two separate numbers instead."

2. "Rewrite the plan above as direct instructions for an AI coding assistant to carry out, one number at a time, in order. Keep the one-task-per-number structure exactly as it is: nothing merged, nothing skipped, nothing reordered."

Then paste what prompt 2 gives you into a new chat or your coding tool.

If you want more prompts like that, there are 10 in the pack: https://theexactmethod.gumroad.com/l/aoyxea

Follow so you don't miss the next one.
```

NARROW:
```
Here's The Narrowing Method, free (enter $0 at checkout): https://theexactmethod.gumroad.com/l/bwydhs

The three prompts from the video are in section 03, The Three-Prompt Template (page 4), ready to copy.

I post AI workflows like this several times a week. Follow so you don't miss the next one.
```

PLAIN:
```
Here's Plain Voice, free (enter $0 at checkout): https://theexactmethod.gumroad.com/l/vxwyul

The ready-to-paste rules for ChatGPT, Claude and Gemini are in sections 05 to 07 (pages 6 to 8), and where to paste each one is in section 04 (page 5).

I post AI workflows like this several times a week. Follow so you don't miss the next one.
```

VIDEO:
```
Here's The Video Brief, free (enter $0 at checkout): https://theexactmethod.gumroad.com/l/atnqas

The brief template is in section 07 (page 9), and the eight checks for every render are in section 10 (page 12).

I post AI workflows like this several times a week. Follow so you don't miss the next one.
```
