# P-5 visual + sound plan · 26 Nov · v1 (before build)

Times are from beats.py (rough); the real ones come from the ElevenLabs alignment. 1080x1920, 30 fps.

## Look
- Layout: real chat screens fill the top 62% (y 0-1190). Sage small in the bottom-right, captions bottom-left
  (max 3 words, fixed width 630, nothing near Sage's hand). The seam pill sits at y≈1190.
- Screens are rebuilt in Remotion as exact copies of the real runs (dark ChatGPT UI, dark Claude UI),
  using the verbatim text from runs/*.txt. That lets each tell light up word by word. A small
  "real run · 26 Nov · ChatGPT Free / Claude Opus 5.5" tag goes on each screen.
- Colours: tells = red marker, fixed = mint strike, still there = amber marker. One accent per frame.
- Camera: every beat moves (push-in, pan between emails, pull-back). No static slides.
- Banned (no-slop-motion + remocn craft): glows, vignettes, drop shadows on cards, glitch cuts, linear moves,
  overshoot on UI, hard 1-frame pops, ALL CAPS, gradient text, text parked at the top.

## Beats
| t | Line | Picture | remocn | Sound |
| --- | --- | --- | --- | --- |
| 0.0 | Lose sales with your AI email? | Frame 0: ChatGPT chat, the user's message "Why does my AI email lose sales?" already typed, its real email below, 4 "!" + bold + dash already marked red. Pill "2 AIs. 2 signatures." at the seam | marker-highlight (red), drift on the screen | soft keyboard tail + send whoosh (frame 0-6) |
| 2.0 | Customers still spot 2 AI signatures. | Pill pulses; camera pushes into the email | zoom-blur (push) | zoomwhoosh |
| 4.4 | Same sale email, ChatGPT and Claude. | Pan right: Claude's real email slides in beside it, both visible (split) | whip-pan | swoosh2 + chatblip as Claude's reply lands |
| 6.6 | One shouts, one decorates. | "Shouts." stamps under ChatGPT, "Decorates." under Claude | impact-shake (low intensity, 0.4) per word | stampthunk ×2 (different pitch) |
| 8.0 | ChatGPT: 3 exclamation marks, a bold line, a long dash. | Push into ChatGPT email; each tell gets a red marker as it is named, with a short burst | marker-highlight + trim-burst | markerstroke ×4 (varied), click on the dash |
| 11.6 | Then "Don't miss out." | The phrase marked red, quote card lifts off the email | marker-highlight | markersq |
| 13.1 | Claude: 3 emoji and a list of 3. | Whip to Claude; 🧼🗓💸 circled one by one, the list of 3 bracketed | scribble-circle ×3 (bubble pop), squiggle under the list | pop ×3 (pitch steps), pencilcurve |
| 16.0 | Then "It truly means the world." | Phrase marked red | marker-highlight | markersq (other take) |
| 18.2 | And both wrote "the perfect time." | Pull back to both emails; the same phrase lights up in both, a line joins them | squiggle (wave) linking both | riser short + pencilcurve |
| 20.4 | So one "sound human" rule can't fix ChatGPT and Claude. | A settings box types "Write like a human", then it is struck out | strikethrough-replace (from "Write like a human" to "1 list per tool") | keyboard typing, rip on the strike |
| 23.3 | 2 tools, 2 different mistakes. | "2 tools. 2 mistakes." slams in over both emails (rehook) | impact-shake (0.8) | impact (the one big hit of the Reel) |
| 25.4 | The fix is 1 short list per tool. | Strike resolves to "1 list per tool"; two instruction cards draw in, one per tool | rim-draw-card ×2 (title "Plain Voice · ChatGPT" / "· Claude", line from the guide) | cardfly ×2 |
| 27.6 | You paste it into its settings once. | Card drops into the real settings box of each tool | layout move + toggle-on | stickypress, click |
| 29.8 | Same request again. | Prompt box: the same request, press send, dive into the new replies | press-warp-dive | keyboard + push + airwhoosh |
| 31.3 | Claude: 0 emoji, 0 perfect time, real dates instead. | Claude's new email (runs/claude_list); counters roll to 0; "November 28 and 29" marked mint | slim-count ×2 (3→0, 1→0), marker-highlight (mint) | clocktick on the count, coin when it lands on 0 |
| 34.5 | ChatGPT: the bold and the dash are gone. | ChatGPT's new email; ghost red marks where bold and dash were, struck mint | strikethrough-replace (small) | rip soft ×2 |
| 37.5 | But it kept the 3 exclamation marks. | The 4 "!" marked amber; "don't miss out" and "perfect time" also amber (they stayed too, honest) | marker-highlight (amber) | emptythud (a "hm" note), tick ×4 |
| 40.7 | So read every ChatGPT email once before you send. | Small checkmark pass over the ChatGPT email | check-list feel (one line) | pencilcurve |
| 43.6 | Comment PLAIN and I'll send you all 3 lists, free. | Instagram comment bar types "PLAIN", send; three list cards fan out (ChatGPT, Claude, Gemini) | card-fan + trim-burst | keyboard, notif, cardfan |
| 46.9 | Then customers only see your email. | Pull back to the ChatGPT chat of frame 0 (loop: last frame = frame 0) | zoom-blur (reverse) | soft airwhoosh, fades into the frame-0 sound |

## Sound rules
- A sound on everything new that appears (standing rule); no sound used twice in a row, and repeats get
  pitch/take variation (the N-8 variety pass).
- Sources: ElevenLabs library (~/sfx-library/elevenlabs: markerstroke, markersq, stampthunk, pencilcurve,
  clocktick, coin, chatblip, cardfly, cardfan, stickypress, impact, rip, notif, zoomwhoosh, swoosh2, airwhoosh,
  emptythud) + the real-sfx main pack for keyboard and clicks. New sounds if needed via ElevenLabs
  sound-generation (Composio). Mix with real-sfx mix.py --voice-safe, then critique.py.
- One big hit only (the rehook). Everything else sits under the voice.
