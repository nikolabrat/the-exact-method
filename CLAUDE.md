# The Exact Method: manual for every new chat

You work for Nikola (19, Sofia, Europe/Sofia time) on **The Exact Method**, an AI-prompting info product.
Memory is shared across chats: the user's standing rules are in memory (/preferences.md) and the project history
is in /areas/exact-method-launch.md. Read memory before working, and follow it. This file holds what memory
does not: IDs, file locations, tools and step-by-step workflows.

## 0. Start of every chat

1. This repo is cloned with `-b references` and registered (see the project instructions).
2. Run `bash setup.sh` once per chat (skips what is already there). It installs the skills, the sound
   libraries, the plugins and the Remotion project.
3. Use the Caveman skill (terse voice) and AgentOne Token Compression (compress large pastes) before output.
   For anything made for the audience (scripts, captions, pins, DMs, emails, offers, topic plans), apply the
   **growth-system** skill (`skills/growth-system/SKILL.md`, installed by setup.sh). Update it after every email
   of the Short Form Growth System course the user sends, and log the email in its source table.
4. Only do what the chat asks. Don't rebuild finished Reels or touch scheduled tasks unless asked.
5. **STATUS.md is the shared to-do list and calendar.** Read it at the start. Before a chat ends, update it
   (tick done items, add new ones, move dates, log Reel stats and outreach replies) and push it to `references`.
   If you change the Reel calendar, also update the schedule page.
6. **Copy-ready text goes in code boxes.** Anything the user will copy and paste (captions, DMs, comments,
   prompts for another chat, settings values, commands) goes in its own fenced code block, so it copies with
   one click. One box per destination: if texts go to different places (e.g. Instagram caption, TikTok caption,
   a DM), each gets its own box with a one-line label above it saying where it goes. Nothing else inside a box.

## "What's up today?"

When the user asks what's up (today, tomorrow, this week), answer from live data, not from memory alone:
1. Today's date in Europe/Sofia (current_time tool).
2. STATUS.md: today's calendar row, the daily routine, open to-dos, outreach.
3. `list_triggers`: which scheduled tasks run today; flag any whose last run FAILED.
4. Instagram: yesterday's Reel stats (log them in STATUS.md); new comments on recent Reels that are not
   keyword comments (questions, possible buyers) to reply to by hand.
5. Gumroad sales since the last check (`/v2/sales`).
6. DM bot health: `curl https://exact-dm.theexactmethodhq.workers.dev/` (connected?) and `/log` since the last
   check. Flag any `error`, `dm-failed`, `poll-failed` or `token-*` entry, and keyword comments with no `sent`.
Reply with a short ordered list: what you will do today, what the user does (with exact files/prompts),
and what runs on its own. Then wait for the go-ahead.

Secrets: never print or commit keys. ElevenLabs needs no key in the chat: the user's own ElevenLabs account
is connected in Composio (toolkit `elevenlabs`, account `elevenlabs_garava-dinero`, alias own-key). Never use
Composio's "instant account" for ElevenLabs (paid per use, stock voices only, no v4).

## 1. Accounts and IDs

| What | Value |
| --- | --- |
| Site | theexactmethod.com, served from branch `main` (Cloudflare Worker "the-exact-method"). Change it through a PR into main, merged with `gh api` (GraphQL is blocked; branch deletion is blocked) |
| Gumroad store | theexactmethod.gumroad.com (Composio toolkit `gumroad`, account thriftwellstudio) |
| Instagram | @theexactmethod, IG user id `17841445152046754`, Composio toolkit `instagram` (account instagram_caner-afore, alias "The Exact Method 2"; reconnected 23 Nov after Meta reset the old session. If calls fail with OAuth code 190, reconnect via COMPOSIO_MANAGE_CONNECTIONS and update the DM task). Reels post at 20:00 Sofia |
| Pinterest | theexactmethodhq, Composio connection `pinterest_codol-remend` |
| TikTok | the user uploads by hand (DM-keyword version + AI-generated label) |
| Reels schedule page | https://claude.ai/artifact/FJ7UGJZBNgN7mehAp4hE9Y (read and republish with the artifact tools) |
| Contact email | theexactmethodhq@gmail.com |

Gumroad products (id, link):

| Product | Price | id | Link |
| --- | --- | --- | --- |
| The Narrowing Method (free) | $0+ | `S5OmGHPgdouxIPLxPYv0fg==` | /l/bwydhs (keyword NARROW) |
| Plain Voice (free) | $0+ | `2jVJsFb8UfMX_1Qb-ywVwQ==` | /l/vxwyul (keyword PLAIN) |
| The Video Brief (free) | $0+ | `3EeAgeKoA803rEPVr25Ang==` | /l/atnqas (keyword VIDEO) |
| 10 Zero-Ambiguity Prompts | $17 | `nblbWh4y16vBspFinn95GQ==` | /l/aoyxea |
| The Specialist Method | $37 | `wCpn7k4bpOI2plrXtHalgQ==` | /l/wdcsmi |
| Both Packs bundle | $44 | `krWpfnysUM3aTyhhUELzAQ==` | /l/both-packs |
| The Exact Method | $127 | `GuzVk7IFFHaNE-EJ0n-2Vg==` | /l/zwxqfq |

Pinterest boards: AI Decision Making 1150529104746599494 · AI Research and Planning 1150529104746599506 ·
AI Writing Tips 1150529104746599509 · Claude & ChatGPT Prompts 1150529104746599491 ·
Custom Instructions for AI 1150529104746599507.

ElevenLabs voices: Sage = Mike `cBTYF7NiJbR8Bvmdeuse`, Brick = Jerry B `rHWSYoq8UlV0YIBKMryp`.
Model `eleven_v4`, stability 0.5, similarity 0.75. After TTS: trim silence, then `atempo=1.07`.

## 2. GitHub branches (repo nikolabrat/the-exact-method)

| Branch | Holds |
| --- | --- |
| `main` | the live site |
| `references` (this one) | this manual, setup.sh, skills, sound library, Remotion project, tools, reference videos |
| `product-files` | `ready/` new PDF versions + MANIFEST.md, for the laptop chat to switch in (see 6) |
| `ig-media` | final Reel files: `<id>.mp4`, `<id>-cover.jpg`, `<id>-caption.txt` |
| `pin-media` | pin images + `b45/pins.json` (read by the daily pins task) |

Commit as `git -c user.email=nblazarov07@gmail.com -c user.name=nikolabrat commit ...`.

## 3. Scheduled tasks (fresh sessions, Sonnet, short standalone prompts)

| Task | When | Notes |
| --- | --- | --- |
| ~~Instagram comment keywords → DM the guide~~ | switched off 25 Nov | Replaced by the DM bot (3b), which is the official keyword delivery. Kept disabled (trig_01TXEiDaG5Eg9imrwsLbhUd3) as a fallback only. |
| Daily pins 16-30 Nov | 20:17 Sofia, 16-30 Nov | reads pin-media/b45/pins.json. Switch off after 30 Nov |
| One-shot Reel publish | the Reel's day, 20:00 Sofia | only calls media_publish on a container made the day before or same day (valid 24 h) |

Rules: never wake a long chat; create with `create_trigger`, then set model `claude-sonnet-5-5` with `update_trigger`.
Use `list_triggers` before making a new one.

## 3b. Comment-to-DM bot (own ManyChat): the official keyword delivery since 25 Nov

Cloudflare Worker `exact-dm` (https://exact-dm.theexactmethodhq.workers.dev), code on branch `bot`
(clone separately; push = deploy). Meta app "Exact Method DM" 1400181691959713 (Unified login, Live).
Secrets in Cloudflare (never in git, the user sets them): `IG_TOKEN`, `META_APP_SECRET` (`KIT_API_KEY` is unused since 25 Nov).
Check `/` (connected?) and `/log` (events, usernames masked). Local tests: `node --import ./test/register.mjs test/e2e.mjs`.
Flow (every keyword): intro [Send it] → follow ask [I'm following] (skipped for followers) → delivery in the DM.
No email capture in the bot (Kit removed 25 Nov): every freebie is a Gumroad product, Gumroad collects the email.
All state lives in the Durable Object (KV free plan allows only 1000 writes/day; never write to KV).

- Copy and rules: `src/rules.js` (keywords, guides, pointer lines per Reel caption, DM texts).
- **New Reel with a Gumroad keyword:** add its pointer line (caption match) to `POINTERS`.
- **New freebie keyword:** list the freebie as a $0+ product on Gumroad first (ask the user: it is public), then add
  the keyword to `KEYWORDS`, `WHAT`, `GUIDES` (name + link) and its pointer line. Test with a real comment before posting.
- Commit with the identity read from the main clone (the privacy hook blocks the address in the command):
  `E="$(git -C <main clone> config user.email)"; GIT_AUTHOR_EMAIL="$E" GIT_COMMITTER_EMAIL="$E" ... git commit`.

## 4. Building a Reel (built on its posting day)

Folder: `workspace/remotion` (Remotion 4.0.380, 1080x1920, 30 fps, no music). Fonts in `public/`.
Examples to copy from: `src/P6.tsx` (talking-bust Sage with lip sync, the latest system), `src/W5.tsx` (Sage walkthrough), `src/V5.tsx` (pile-up format),
`src/W6.tsx`, `src/N2.tsx`, `src/PhoneFilm2.tsx`. Formats with a reference video in `video/` are built from it.
Per-Reel sources (scripts, lines, timing, sound sheets) of past Reels: `workspace/reels/`. Voice files are not
in git: to re-render an old Reel, copy its folder to `public/<id>v/` and run gen.sh + mix.py again.

1. **Script audit** (skills: ig-reel hookscore/beats, content-principles, marketing skills, ig-human, **growth-system**).
   Hook 90+. Script parts per growth-system section 11 (hook, lock-in, body 1, rehook, body 2, CTA; name the lock-in type). Structure from memory: hook opens the question from word 1 with text on frame 0; something new
   every ~3 s, first value by s 5-10; the end answers it, CTA after. Show the user results before building.
   **Viral-format match**: the script must match one of the formats in the project doc `claude/viral-formats.md`
   (F1-F5, from the ig-viral research). Name the format and its reference reel; if none fits, rewrite first.
   **Full audit (from 23 Nov):** fill every line of `scripts/reel-audit.md` (PASS/FAIL + evidence) and show it
   with the script; any ⛔ FAIL = rewrite before building. **Length 45-90 s** (Kallaway; the 15-25 s test ended
   20 Nov without beating it). Every Reel remixes a named 5x+ outlier (growth-system §14).
   **Frame-0 test (from 19 Nov, after V-2 lost most viewers at 0:01)**: (1) the full hook sentence as a big headline
   readable in under 1 s, spoken captions below it; (2) a real, recognisable result or face on frame 0, not a diagram
   of one; (3) the first words speak to a problem anyone in the buyer pool has (people who use AI to build,
   sell or create something; see growth-system), narrowing to the guide's niche only after second 3; (4) the screen filled, no large empty areas; (5) max alignment (growth-system section 12): text hook, frame-0 visual and spoken hook all say the same thing, clear on mute. Log length, reach, skip rate and
   avg watch in STATUS; compare with the 17 Nov baseline (avg watch ~7 s, skip 52-66%, reach 100-250).
2. **Two versions**: Instagram ends "Comment KEYWORD", TikTok "DM me KEYWORD". Caption starts with the CTA.
3. **Voice** (in `workspace/remotion/public/<id>v/`, with `lines.txt` as `ID|text` per line):
   for each line call COMPOSIO_PROXY_EXECUTE: toolkit `elevenlabs`, POST `/v1/text-to-speech/<voice_id>`,
   body `{"text": ..., "model_id": "eleven_v4", "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}`.
   The result has `binary_data.url`: `curl -sS -o raw_<ID>.mp3 "<url>"` (link lasts 1 h).
   Then `bash ../../../../tools/voice/process.sh` (trim + atempo 1.07 → `f<ID>.wav`), copy
   `tools/voice/mix.py`, set IDS/GAP, run it → `mix_ig.wav`, `mix_tt.wav`, `timing_*.json`, `align_*.json`
   (faster-whisper word timings can be up to 8 frames late: replace them with ElevenLabs forced alignment,
   tool ELEVENLABS_ALIGN_AUDIO_AND_TRANSCRIPT on the mixed voice via the workbench, as done for W-7 in `workspace/reels/w7/el_align.json`). Sound effects the same way:
   POST `/v1/sound-generation` with `{"text": ..., "duration_seconds": ...}`.
4. **Check speech = captions**: transcribe each line with faster_whisper `small.en`; decode audio with
   `ffmpeg -f f32le -ar 16000 -ac 1` (av.open fails). Re-record any line that differs from the text.
5. **Build** the composition (copy the closest example). On-screen captions max 3 words, balanced chunks.
   remocn components for finesse (`npx shadcn@latest add @remocn/<name> --yes`). no-slop-motion banned list.
   Nothing overlaps Sage's hand. Loop: last frame = frame 0.
6. **Sound**: real-sfx skill. A sound on everything new that appears. Sheets like `workspace/reels/w5sfx/`.
   `python3 scripts/mix.py sheet.json --out ... --voice-safe --voice-depth light --no-match-layer --sfx-trim-db -1.5`
   then `critique.py RESOLVED WAV`. New sounds: ElevenLabs sound-generation via Composio (step 3) into ~/sfx-library/elevenlabs.
7. **Render**: `npx remotion render src/index.tsx <Comp> out/<file>.mp4 --concurrency=2 --log=error --browser-executable=$(cat .browser)`,
   then loudnorm to -14 LUFS, true peak < -1 dB. Cover: still of the cover composition.
8. **QA before showing anything**: frame sheets every 12 frames, `pop-scan.py` (no-slop-motion qa), loop seam,
   mistimings, overlaps, clipped text, caption-vs-speech timing. Send the user the IG mp4 to approve.
9. **Publish**: push mp4/cover/caption to `ig-media`. Make the container: in the Composio workbench download the
   raw GitHub file, `upload_local_file`, resolve the redirect, then `POST /17841445152046754/media`
   (media_type REELS, video_url, cover_url, caption, share_to_feed true), poll `status_code` until FINISHED.
   Then a one-shot scheduled task at 20:00 that only calls `media_publish` and returns the permalink.
   Update the schedule page. Remind the user to upload the TikTok version.
10. **Laptop video folder** (every video, from 17 Nov): `~/The Exact Method/Videos/` on the user's laptop (connected
   folder, write with device_commit_files). Subfolders: `Raw footage` (real AI run recordings), `Reference videos`
   (every reference video), `Insta versions` and `TikTok versions`. In the last two, one subfolder per video named
   after it (e.g. `A-1 Stop asking are you sure`) holding `<name>.mp4`, `<name> - thumbnail.jpg`, `<name> - caption.txt`.

Reel stats: `GET /<media_id>/insights?metric=reach,views,likes,comments,saved,shares,ig_reels_avg_watch_time,reels_skip_rate`.

## 5. Pins

`tools/pins/`: specs.py (+ specs_rep.py replacements) → `python3 build.py --render` (validator + images in out/),
`check.py` (excerpts must be verbatim from `src/*.txt`). Rules: seo-pins skill + pin standards in memory.
Host images + pins.json on `pin-media/<batch>/`, then a daily task like the one above.

## 6. Product PDFs

The user's laptop folder "The Exact Method" holds the 6 live PDFs. New versions: build here, push to
`product-files` `ready/` with a MANIFEST.md row ("ready <date>"), and give the user a ready-to-paste prompt for
the laptop chat (pull, swap in folder, replace the file on Gumroad via Composio, mark "switched <date>").
Small text fixes can be done in place with PyMuPDF (redact + insert with Liberation Serif, same size/colour).

## 7. Things to remember

- Gumroad email workflows (3) are drafts: publishing needs $100 earnings + a payout.
- Website changes and anything public: ask first.
- Instagram DMs to people who did not comment a keyword: the user sends them by hand.
