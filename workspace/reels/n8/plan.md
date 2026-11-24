# N-8 · "Stop paying for 3 AI tools" · visual + sound plan v2 (24 Nov 2026, more dynamic)

Built only after this plan and the audit pass. Times are estimates from beats.py; after voicing, every cue
is recomputed from the **ElevenLabs forced alignment** (word starts), with the same formulas, like W-7.

## 0. Real-run sources (everything on screen comes from these, verbatim, "…" for cuts)

| ID | Source | Text / data used |
| --- | --- | --- |
| R1 | Chat 1, 12:27, one line "Which AI should I pay for?" (searched 10 sites) | "Based on the projects you've worked on and how you use AI, I'd choose **Claude Pro** over ChatGPT Plus or Gemini AI Pro if you're paying for just one AI subscription." |
| R2a | Chat 2, prompt 1, 12:28 (searched the web) | Table: ChatGPT Plus $20/month · Claude Pro $20/month · Google AI Pro $19.99 · and "I wouldn't pay for all three simultaneously unless each has a clearly separate job." |
| R2b | Chat 2, prompt 2 | "For writing product pages and building small tools, I would narrow the choice to ChatGPT Plus and Claude Pro. Gemini is a credible third option, but I don't think it is the strongest first subscription…" |
| R2c | Chat 2, prompt 3 | "My suggested setup is simple: spend your €20 on **ChatGPT Plus**, keep the other two free, and use them as independent reviewers." · "If you eventually find yourself spending most of your time building software, Claude Pro becomes a strong candidate." |
| FOOT | Screen recordings | Only the chat column (x 720-1700) is used: R1 0:08-0:12 (question + "Searching 10 websites"), R2 0:03-0:08 (prompt 1 typed + "Searching the web"), R2 1:44-1:48 (final answer). **Never** the sidebar (your name), the tab bar, or R2 0:37-0:46 (our Claude chat is on screen there) |

Label on every excerpt: `excerpt · real run · ChatGPT · 24 Nov 2026`. $59.99 = sum of R2a's three prices (our arithmetic, shown as "all 3").

## 1. System (same as W-7/P-6, so the look stays ours)

- 1080x1920, 30 fps. Paper `#E9E5DA` with ruled lines; cards `#FCFBF7` 4 px ink border, radius 20; ChatGPT excerpts on dark `#151515` (reads as "AI answer" at a glance).
- Fonts: Archivo 900 headlines/numbers, Archivo 600 excerpts (≥ 43 px), Plex Mono labels (26 px).
- Accents: mint = the answer/keep, red = cost/cut, green = the money kept. One mint highlight per frame max, plus the caption's.
- **Zones:** key text inside y 230-1440 and x 50-1030; nothing key in the right 230 px below y 1100 (Sage + IG rail). Captions at x 66, y 1280, width 720, max 3 words, mint word-highlight, timed from ElevenLabs alignment. Sage bust bottom-right (top 1388), mouth from RMS (closed/mid/open), poses below. Nothing ever overlaps Sage's hand.
- Camera: slow push 1.00→1.03 per section, punch-ins (4 frames, 1.06) on the 4 key reveals, small shake on "It cut Gemini" only.
- Section tag bottom-left (y 1240): "1 line" / "3 prompts" with dots 1-2-3, so the viewer always knows where they are.
- no-slop-motion banned list applies: no glow, no gradient text, no bounce-everything, no random particles, no typewriter on long text, no stock icons/logos (product names are typed in our font, never brand logos).

## 2. Frame 0 (tested, `frame0_test.png` + `frame0_test_360.png`)

Headline "Stop paying / for **3 AI tools.**" 148 px (y 250-560) · left: "3 tools" + dark card with R2a's three prices + **$59.99** red 124 px "a month, all 3" · right: "1 tool" + R2c quote card ("spend your €20 on **ChatGPT Plus**, keep the other two free") + **$20** green "a month, 1 tool" · excerpt label · caption "Stop paying for" · Sage `s-present` palm toward the cards.
360 px test: headline, both prices and "ChatGPT Plus" readable; nothing clipped; frame filled from y 250 to Sage.
Motion on frame 0: the cards are already there (no fade from black); 3 prices pulse once in sequence (frames 0-12) so the frame moves from the first frame.

## 1b. Motion grammar v2 (more dynamic, 24 Nov): what moves and why

Borrowed from our two reference films (`video/PileUp-reference.mp4`, `video/PhoneFilm-reference.mp4`) and remocn.
Rule: **every beat has one camera move + one element move + one transition**, and no two neighbouring beats use the same transition.

| Move | From | Used at |
| --- | --- | --- |
| Phone with the real chat, slow scroll, key line pops out as an overlay card over the blurred phone | PhoneFilm ref | beats 4-5, 8, 11, 14 |
| Chips pile up physically, then **implode into a dot** that floods the frame in one colour | PileUp ref + remocn `gravity-pile` | beat 6 |
| Giant full-bleed number card ("1" / "2" / "3"), background colour swaps per card, 8-10 frames each | PileUp ref ("GLOWS / POP-INS") | beats 7, 8, 11, 13 |
| Limit chips with coloured dots that light up as each one is said, each cuts a row | PhoneFilm ref ("Your limits do the work") | beats 11-12 |
| Hub: one tile in the middle, lines out to two tiles | PileUp ref ("Everything it checks") | beat 14 |
| Cursor clicks a checkbox | PhoneFilm ref ("Start this week") | beat 17 |
| Vertical stripe wipe | PileUp ref (end) | into the CTA, beat 18 |
| Receipt builds line by line, total lands word by word | remocn `the-tab` | beat 10 |
| Price strikes and is replaced underneath | remocn `strikethrough-replace` | beat 2 |
| Prices roll in like a slot machine | remocn `slot-machine-roll` | beat 10 |
| Dolly-zoom on the turning point | remocn `dolly-zoom` | beat 15 ("a minute earlier it picked Claude") |
| Push-through into a deeper chapter | remocn `push-through` | beat 7 (rehook) |
| Lens-zoom on the payoff | remocn `lens-zoom` | beat 14 (the verdict) |
| Whip-pan between peers | remocn `whip-pan` (have) | prompt 1 → 2 → 3 |
| Paper-tear / impact-shake | have | beat 12 (Gemini cut) |
| Serif italic accent word with a mint swash under it | PhoneFilm ref ("*25 ideas*", "*do the work*") | section headlines: "a *different* AI", "3 *smaller* questions", "*my* call" |

Install before building: `the-tab gravity-pile slot-machine-roll strikethrough-replace push-through lens-zoom dolly-zoom` (check each page's props first; fonts local only, no Google Fonts in the render browser).

## 3. Beat by beat (v2)

| # | Time (est.) | Spoken | Picture (what is new) | Camera · element · transition | Sage | Sound (one per new thing) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0-2.2 | Stop paying for 3 AI tools. | Frame 0 (tested). The 3 price rows pulse in sequence 0/4/8 f | slow push 1.00→1.02 · row pulses · none (cold open) | present | slap on f0 (voice-safe) · 3 soft ticks |
| 2 | 2.2-4.4 | 3 prompts cut it to one. | `strikethrough-replace`: **$59.99** gets the red line and **$20** rises beneath it; the 3 left rows collapse into one mint row "ChatGPT Plus" | punch-in 1.06 on "one" · strike + collapse · none | point | marker scratch · "stack" thunk on collapse |
| 3 | 4.4-9.1 | Same ChatGPT, one minute apart, and the one-line question picked a *different* AI. | Whip to two phones side by side (PhoneFilm style), status-bar clocks **12:27** and **12:28** (real). Each screen fills with its answer word: left "Claude Pro", right "ChatGPT Plus"; a red "≠" drops between and shakes | whip-pan in · phones slide up from below, staggered 6 f · ≠ with ImpactShake | finger | whoosh · 2 slides · numslam on ≠ |
| 4 | 9.1-12.0 | One line: which AI should I pay for? | Left phone grows to centre, the other leaves frame. Real R1: the question bubble types in (3 words a tick), "Searching 10 websites" shimmer | push-through (phone becomes the frame) · bubble type · push-through | think | push · soft keys · scan |
| 5 | 12.0-13.4 | Claude Pro, it said. | R1 answer scrolls in; the key line pops out as an overlay card over the blurred phone: "…I'd choose **Claude Pro**…" | card pops 1.0→1.04→1.0 · mint wipe · blur behind | check | pop · mint "swipe" |
| 6 | 13.4-21.8 | Based on the projects I've worked on, so it answered from my old chats and not from what I plan to build next. | a) R1's own list falls as chips onto the phone and **piles up** (`gravity-pile`): "coding projects", "online products", "business ideas", "marketing strategies", "Brick & Sage videos", "Claude desktop app" (label "what it remembered"); b) the whole pile **implodes into one dot** (PileUp); c) the dot opens into a paper card: left half "old chats ✓", right half "my plan: ?" (empty, dashed) | slow drift down with the pile · pile → implode → card · implode is the transition | shrug → sigh | 6 "cardpile" drops (varied) · reverse whoosh on implode · emptythud on "my plan: ?" |
| 7 | 21.8-24.0 | So I asked 3 *smaller* questions. | **Rehook.** Push-through the "?" into three giant full-bleed number cards flashing **1** (mint bg) · **2** (gold bg) · **3** (ink bg), 8 f each, then they shrink into a row of 3 index cards | push-through · giant numbers · scale-down into row | present | 3 hits on the cards (low-mid, rising) |
| 8 | 24.0-28.7 | One: what is each one best at, and what does it cost today? | Card 1 flips (`rolodex-flip`) into a phone: prompt 1 types (4 words/tick), then "Searching the web" from the real recording | camera follows card 1 left→centre · flip · whip to phone | point | flutter · keys · scan |
| 9 | 28.7-31.6 | Web search on, or it prices from memory. | A toggle "Web search" snaps **on** (mint); a sticky note "prices from memory" next to it crumples and is tossed | small punch on the toggle · toggle + `crumple-toss` · none | finger | click · crumple |
| 10 | 31.6-34.9 | All three: about 20 dollars. Price can't decide it. | `the-tab` receipt builds: ChatGPT Plus ····· `slot-machine-roll` **$20**, Claude Pro ····· **$20**, Google AI Pro ····· **$19.99**; the total lands word by word: "**a tie.**" (accent red) | tilt the receipt 2° as it builds · rolls · none | shrug | 3 slot "ticks-rolls" · emptythud on "a tie." |
| 11 | 34.9-40.4 | Two: which fit someone who writes product pages and builds small tools, on 20 euros? | Whip to card 2 → a "Your limits" panel (PhoneFilm): 3 chips land as they're spoken, each with a dot that lights: "product pages" ● "small tools" ● "€20 a month" ●; the 3 plan rows sit below | whip-pan · chips spring in on their word · whip | think → point | whoosh · 3 pops (rising pitch) |
| 12 | 40.4-41.5 | It cut Gemini. | The Google AI Pro row is **torn out** of the list (`paper-tear` + small ImpactShake); label "cut · prompt 2" | shake 4 f · tear · tear is the transition | check | rip |
| 13 | 41.5-43.6 | Three: which one first, and why? | Giant full-bleed **3** flash (ink bg, 8 f) → card 3 → phone, prompt 3 types | snap zoom · flash card · whip | finger | hit · keys |
| 14 | 43.6-48.0 | ChatGPT Plus. Keep the other two free, and use them as reviewers. | `lens-zoom` into the real verdict card (R2c, same card as frame 0, bigger); "ChatGPT Plus" mint wipe; then the **hub**: ChatGPT Plus tile centre, lines draw out to "Claude · free · reviewer" and "Gemini · free · reviewer" | lens-zoom (the beat drop) · wipe + lines draw · none | present | impact (main hit) · mint swipe · 2 line "scratch"es + 2 pops |
| 15 | 48.0-51.6 | Yes, ChatGPT picked itself. A minute earlier it picked Claude. | Red handwritten note "ChatGPT picked itself?" slaps onto the hub; on "a minute earlier" `dolly-zoom` while the **12:27 · Claude Pro** phone slides back in beside it | dolly-zoom (the turn) · note slap + phone return · none | shrug | slap · tape · low riser under the dolly (quiet) |
| 16 | 51.6-56.4 | And it said when to switch: if I mostly build software, Claude Pro. | R2c excerpt card "If you eventually find yourself spending most of your time building software, Claude Pro becomes a strong candidate." `ink-arrow` draws from ChatGPT Plus to Claude Pro, label "when to switch" in serif italic | drift right along the arrow · arrow draw · none | point | scratch (arrow) · tick (label) |
| 17 | 56.4-58.9 | That's its pick. The call is *mine*. | Stamp "its pick" thumps on the card; a cursor glides in and **clicks** a checkbox "my call" (PhoneFilm) | punch-in on the click · stamp + cursor · none | check | stamp · click |
| 18 | 58.9-61.1 | Comment NARROW for the 3 prompts. | **Vertical stripe wipe** (PileUp end) to the CTA: the 3 prompt cards fan as a hand (`card-fan` style, our cards); a comment field types **NARROW** letter by letter and posts; tag "Free guide · section 03 · page 4" | stripe wipe · fan + typing · stripe wipe | present | stripe whooshes (×1, swept) · cardfan · keys · notif on post |
| 19 | 61.1-64.4 | Run them before you pay for 3 AI tools. | The cards fly back to frame 0's positions: headline drops in word by word, the two price blocks slide back (unstruck) | pull-out to 1.00 · match-cut into frame 0 · seam | present | short riser into the seam, cut clean on the loop frame |

Loop: the last 10 frames are frame 0 exactly; spoken "…pay for 3 AI tools" → "Stop paying for 3 AI tools".
Longest stretch without a new element: ≤ 2.0 s (was 2.5 s in v1). 7 different transitions, none repeated back to back.
Real screens shown only as our phone mock with re-typeset real text, plus the real "Searching…" shimmer: never the sidebar, tabs or the 0:37-0:46 part of R2.

## 4. Sound rules (real-sfx)

Library (as W-7): main pack + uisfx + ~/sfx-library/elevenlabs (rip, tape, flutter, push, slap). One sound per new element; no repeat of the same file twice in a row (vary by take); all under the voice (`--voice-safe --voice-depth light --no-match-layer --sfx-trim-db -1.5`), then `critique.py` must show no speech-masking and no clusters. No music. Final mix −14 LUFS, true peak < −1 dB.

## 5. TikTok version

Same edit; beat 18 says "DM me NARROW", the comment bubble becomes a DM bubble. Captions from its own alignment.

## 6. Cover

Frame 0 without the caption line and without Sage's open mouth (closed): headline + both prices. Readable in the profile grid (3:4 centre crop, y 240-1680, keeps the headline and both numbers).
