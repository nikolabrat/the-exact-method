# Sound effects setup (re-run in a new workspace)

1. real-sfx skill (Clipwing, free, no licence file in the repo: use as is, do not redistribute changes)
   git clone --depth 1 https://github.com/Clipwing/skills.git /tmp/clipwing
   cp -R /tmp/clipwing/skills/real-sfx ~/.claude/skills/
   cd ~/.claude/skills/real-sfx && python3 scripts/setup.py init --uisfx
2. Libraries (from this branch, assets/sfx-library)
   - openverse-cc0: 54 CC0 recordings found through the Openverse API (all Freesound, CC0, credits in CREDITS.json)
   - elevenlabs: our generated SFX (stamp, pop, slide, tick, scratch, stack, click)
   cp -R assets/sfx-library ~/sfx-library
   python3 scripts/setup.py add-library main ~/sfx-library/openverse-cc0 --tier main
   python3 scripts/setup.py add-library elevenlabs ~/sfx-library/elevenlabs --tier extra --index
3. Openverse: no install. Search: https://api.openverse.org/v1/audio/?q=WORDS&license=cc0
   The workspace cannot download from cdn.freesound.org (403). Download through the Composio workbench
   (requests.get on the file URL, then upload_local_file) and curl -L the returned link.
