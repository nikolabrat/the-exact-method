# V-3 · Stop editing your Reels · look + sound plan (25 Nov 2026)

Script: `script.txt` (21 lines, Sage = Mike). Estimated 78 s before TTS; real timing comes from ElevenLabs
forced alignment and every cue below snaps to its word.
Remix source: mrcreates.ai /reel/DfKFK7RJdjl (115.7x): avatar + one vertical timeline rail on a light grid,
a step chip per step, each step's object builds in the middle, a "key part" card, keyword CTA.
Skills applied: remocn (components below), no-slop-motion (banned list + gates), real-sfx + uisfx (sound),
frontend-design (one distinctive idea, intentional type), growth-system §12/§15 (alignment, 11 bricks).

## 0. Design system (ours, from N-8; kept so the account looks like one brand)

| Token | Value | Use |
| --- | --- | --- |
| paper | #E9E5DA + 1 px grid #D7D1C3 every 54 px | background (the source's grid, in our paper) |
| card | #FCFBF7, 3 px ink border, radius 14, **no shadow** | the brief card, step objects |
| ink | #181714 | text, rail, borders |
| mint | #6BE0A0 | progress on the rail, "kept" ticks, the one CTA colour |
| red | #D9534A | strikes on the default/slop example only |
| gold note | #F6E7A8 | sticky notes ("mine") |
| fonts | Archivo 900 headlines · Newsreader italic 600 for the one emphasised word per scene · IBM Plex Mono for values (hex, sizes, file names) | |

**The one idea (frontend-design):** the Reel builds its own brief. A single brief card is the spine of the
whole video: every step writes one block into it, and at the end the card is complete and holds for the
screenshot. The rail on the left fills mint block by block (1→6), like the source's timeline.

**Never (this Reel's never-list, also the QA list):** no drop shadows, glows, vignettes, gradients; no hard pops
(everything enters over ≥6 frames, leaves over ≥5); no letter-by-letter typing (values appear word by word or
slot-roll); nothing over Sage's hand; no text parked at the top while the action is below; no linear moves
(ease OUT/IO only; overshoot only on the stamp and Sage); captions ≤3 words, one line, from forced alignment;
the only exception: the deliberate "default" example in beat 13 shows a glow and a bounce, labelled and struck.

## 1. Layout (1080x1920, IG safe zone: key content between y 230 and 1440, right 230 px clear of text)

- Headline band y 250-560 (Archivo 900, 92-110 px, ≤3 lines).
- Stage y 600-1300: the phone / brief card / step objects (camera moves here).
- Rail: x 70, y 600-1300, 6 dots, mint fill grows with the blocks.
- Sage bust: bottom-right, as in N-8 (P-6/N-8 talking-bust rig, lip sync from alignment).
- Captions: y 1440-1520, left of Sage (x 70-560), never over Sage's hand.

## 2. Frame 0 (tested first, before any other scene)

- Headline, full, readable < 1 s: **"Stop editing your Reels."** (Archivo 900, 110 px, ink, one word "editing"
  with a red marker underline already drawn on frame 0 (a strike would read as "Stop your Reels")).
- Stage: a phone (ink bezel, radius 56, no shadow) playing a real finished Reel of ours (N-8, a busy mid
  section, muted), with a mint chip on the phone: **"Made by Claude · no editing app"** ("0 edits" was not strictly true: Claude fixed QA notes).
- Behind/below the phone, tilted 4°, the brief card peeks in with its title **"THE BRIEF · 6 blocks"** and
  the first two block labels visible (payoff teased from frame 0).
- Sage bottom-right (as in N-8), mouth already open on "Stop". The phone shows a Reel with Sage in it: proof it is this account's own Reel.
- Screen filled: headline band + phone + card + Sage + rail dots. Feed-size test at 360 px wide.
- Alignment: text "Stop editing your Reels" = spoken line 1 = visual (a finished Reel nobody edited).

## 3. Shot table (times are estimates; snap to words after alignment)

| # | Time | Line | Picture (what moves) | remocn / own | Sound (real-sfx / uisfx) |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.0-1.6 | Stop editing your Reels. | Frame 0 as above; phone already playing; underline on "editing" redraws (wipe 8 f) on "editing" | own strike (StrikethroughReplace style) | soft marker stroke on "editing" |
| 2 | 1.9-4.8 | …hand Claude a 6-block brief instead. | Headline swaps (word handoff) to "Hand Claude a brief."; brief card slides up from under the phone and the "6 blocks" counter rolls 0→6 | baton-word idea (own), rolling-number | paper slide; tick roll (uisfx, 6 soft ticks) |
| 3 | 5.1-9.0 | This Reel is the proof. I never opened an editing app. | Camera pushes into the phone (push-through); inside: an editing-app timeline icon appears and gets a red X (struck), then the phone shows "rendered by Claude · Remotion" stamp | push-through, extrude-pop (stamp) | whoosh-in (short), stamp thud on "never" |
| 4 | 9.3-15.6 | Here's the brief… block by block… copy every line… | Pull back out of the phone; phone slides off left, brief card swings to centre (rotate 4°→0) and fills the stage; rail draws down the left; empty block slots appear one per word-group (6 slots) | dolly-zoom (subtle), own rail draw | air whoosh (card move), 6 slot ticks spread over the line (uisfx) |
| 5 | 15.9-19.8 | One: who it's for. Mine: people who build things with AI. | Rail dot 1 fills mint; block 1 "WHO" writes its value word by word; gold sticky "mine" slaps on | own block-fill, marker-highlight on "build" | rail tick; pencil/write (soft); sticky press |
| 6 | 20.1-23.0 | Two: the script, one line per voice file. | Dot 2; block 2 fills with 3 file rows `v3-01.mp3 · Sage · "Stop editing…"` stacking | own rows (stagger 4 f) | rail tick; 3 light card slides |
| 7 | 23.3-26.9 | Three: the look. Colours as hex codes, fonts by name. | Dot 3; block 3 opens: 4 swatches drop in as chips with hex values slot-rolling (#E9E5DA, #181714, #6BE0A0, #D9534A); then font names | slot-machine-roll (own fixed version from N-8), token-tags idea | swatch pops (uisfx, 4, pitched up) |
| 8 | 27.2-30.1 | Mine are on screen: Archivo, and mint green. | Font specimen: "Archivo" cycles through 3 faces and lands on Archivo 900 (font-cycle); mint swatch scales and the whole rail flashes mint once (fade, not flash) | font-cycle, inline-highlight | font flips (3 soft clicks); mint swell (soft riser 0.6 s) |
| 9 | 30.4-31.3 | Four: timing. | Dot 4; block 4 title; a waveform strip slides in under the card | own waveform | rail tick; tape/strip slide |
| 10 | 31.6-39.9 | Every cue lands on the real voice… half a second after it. | Waveform of the real line with word ticks; captions chips snap onto the ticks (mint); then a "guess" ghost caption lands 0.5 s late in red, gets struck; the true one stays | caption-timeline idea (own, data from alignment) | 3 caption snaps (crisp clicks, varied); late ghost: dull thunk + strike |
| 11 | 40.2-41.4 | Five matters most. | **Rehook:** camera punch-in (lens-zoom style, no black) on block 5; headline: "Five matters most." Newsreader italic on "most" | lens-zoom (own, no flash), impact-shake (tiny) | low hit (rehook), short |
| 12 | 41.7-42.6 | The never-list. | Block 5 title "NEVER" lands as a stamp (extrude-pop), red ink | extrude-pop | stamp |
| 13 | 42.9-46.8 | No glows. No bouncing text. Nothing on top of a hand. | Split (versus-split, diagonal): left "default" = a tiny card with a glow + bouncing text (labelled "default, on purpose"); each item gets a red hand strike as it's said; right = our clean scene; Sage's hand gets a mint "keep clear" outline on "hand" | versus-split, check-list (paper, crossed off by hand) | 3 marker strikes (varied pitch); soft "pop-free" whoosh for the split |
| 14 | 47.1-50.1 | Leave it out, and Claude picks everyone's default. | The default side multiplies into a pile of identical glowing cards (gravity-pile, 6 cards) = "everyone's default"; our clean card stays alone | gravity-pile | cards pile (paper flaps x4) |
| 15 | 50.4-53.6 | Six: export. 1080 by 1920, voice at minus 14. | Dot 6; block 6 fills: `1080×1920 · 30 fps · −14 LUFS` with numbers rolling; a loudness meter needle settles at −14 | rolling-number, own meter | rail tick; number roll; needle settle |
| 16 | 53.9-60.5 | Then Claude writes the whole video as code and checks stills… | Brief card slides left and becomes the input of a code block: real lines from our N-8 source scroll in (glass-code-block, no glow); 3 stills of busy frames appear as a contact strip with mint check marks one by one | glass-code-block (no glow), check-list | soft keyboard bed 2 s (uisfx keys, low); 3 check ticks |
| 17 | 60.8-63.4 | You watch it twice on your phone. | Phone returns centre with the finished Reel; "×2" badge | own | phone slide |
| 18 | 63.7-66.6 | Once with sound, once without, against 8 checks. | Speaker icon on → muted (morph); 8 check chips flow around the phone and tick mint (feature-chips-flow) | feature-chips-flow | mute click; 8 ticks (fast, ascending, quiet) |
| 19 | 66.9-70.1 | So the skill isn't editing. It's writing the brief. | **Answer:** headline returns: "The skill isn't editing." → "editing" strikes → "writing the brief" (strikethrough-replace); camera pulls back to show the complete brief card (all 6 blocks, rail full mint) | strikethrough-replace, dolly-zoom out | marker strike; soft resolve chime (the one chime) |
| 20 | 70.4-74.7 | Comment VIDEO and I'll send you… | CTA: brief card shrinks into a comment bar UI; "VIDEO" types in as a word (not letters) in the comment field, send arrow; DM bubble "The Video Brief · section 07" slides from the right (designed CTA, not plain text) | own comment bar, x-follow-card idea | comment field tap; send whoosh; DM pop (uisfx) |
| 21 | 75.0-78.2 | Hand it to Claude, and stop editing your Reels. | Loop: the DM bubble turns into the brief card again and lands back under the phone; headline returns to frame 0's "Stop editing your Reels." with the strike; last frame = frame 0 | own loop match | marker stroke (same as shot 1, softer) |

## 4. Transitions (named per cut, no black dips, no glitch)

push-through into the phone (3), pull-back + card swing (4), rail-driven block reveals (5-15, no cuts: one
continuous card, camera only), lens-zoom punch without flash (11), versus-split diagonal (13→14),
card-slide into code (16), phone return (17), dolly-out reveal (19), card→comment-bar morph (20),
DM→card match cut back to frame 0 (21).

## 5. Sound plan (real-sfx main pack + uisfx; ElevenLabs only for gaps)

- Your rule wins over no-slop's "no sound on every landing": **a sound on everything new**, kept subtle:
  UI elements = uisfx (ticks, clicks, pops) at −24 to −20 dB under the voice; paper/card moves = real foley
  (paper slides, sticky press, marker strokes); camera moves = short real whooshes; one low hit for the
  rehook (11), one stamp sound (3, 12), one chime only at the answer (19).
- Variety pass: no recording reused within 10 s; pitch ±2 semitones on repeats; KEY labels claim first.
- Mix: `mix.py --voice-safe --voice-depth light --no-match-layer --sfx-trim-db -1.5`, then `critique.py`
  (all axes ≥ 8), then 2-pass loudnorm −14 LUFS, TP −1.5.

## 6. Gates (no-slop-motion order, adapted)

1. Frame-0 still + 360 px feed test → show the user.
2. Voice (Mike, eleven_v4, 0.5/0.75) → atempo 1.07 → ElevenLabs forced alignment → timing file.
3. Build scene by scene; stills of the 3 busiest moments (7, 13, 16) before the full render.
4. Sound sheet → mix → critique.
5. QA: frame sheets every 8 frames, pop-scan, overlaps/clipping/Sage's hand, caption-vs-word, loop seam,
   loudness/resolution → send the IG mp4 for approval → schedule 20:00.
