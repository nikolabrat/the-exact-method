#!/usr/bin/env bash
# One-time setup for a new Claude chat working on The Exact Method.
# Run from the repo root (branch "references"):  bash setup.sh
# Safe to run again: every step skips what is already there.
set -uo pipefail
REPO="$(cd "$(dirname "$0")" && pwd)"
SK="$HOME/.claude/skills"
TMP="$(mktemp -d)"
mkdir -p "$SK"
ok(){ echo "OK   $*"; }
warn(){ echo "WARN $*"; }

clone(){ git clone -q --depth 1 "$1" "$2" 2>/dev/null || warn "could not clone $1"; }

# 1. Skills ---------------------------------------------------------------
[ -d "$SK/content-principles" ] || cp -R "$REPO/skills/content-principles" "$SK/" && ok "content-principles"

if [ ! -d "$SK/ig-reel" ]; then
  clone https://github.com/Jakeschincariol/instagram-agent-skill.git "$TMP/ig" && cp -R "$TMP/ig/skills/"* "$SK/"
fi; [ -d "$SK/ig-reel" ] && ok "instagram-agent (ig-*)"

if [ ! -d "$SK/no-slop-motion" ]; then
  clone https://github.com/ferndesk/no-slop-motion.git "$TMP/nsm" && cp -R "$TMP/nsm/skills/no-slop-motion" "$SK/"
fi; [ -d "$SK/no-slop-motion" ] && ok "no-slop-motion"

if [ ! -d "$SK/copywriting" ]; then
  clone https://github.com/coreyhaines31/marketingskills.git "$TMP/mk" && cp -R "$TMP/mk/skills/"* "$SK/"
fi; [ -d "$SK/copywriting" ] && ok "marketing skills"

if [ ! -d "$SK/remocn" ]; then
  clone https://github.com/Remocn/remocn.git "$TMP/rc" && {
    cp -R "$TMP/rc/plugins/remocn/skills/remocn" "$SK/remocn"
    cp -R "$TMP/rc/plugins/remocn/skills/add" "$SK/remocn-add"
    cp -R "$TMP/rc/plugins/remocn/skills/video" "$SK/remocn-video"
    sed -i 's/^name: .*/name: remocn-add/' "$SK/remocn-add/SKILL.md"
    sed -i 's#\.\./video/#../remocn-video/#g' "$SK/remocn-add/SKILL.md"
    sed -i 's/^name: .*/name: remocn-video/' "$SK/remocn-video/SKILL.md"
  }
fi; [ -d "$SK/remocn" ] && ok "remocn"

# real-sfx is not redistributed here (no licence file upstream): clone it.
if [ ! -d "$SK/real-sfx" ]; then
  clone https://github.com/Clipwing/skills.git "$TMP/cw" && cp -R "$TMP/cw/skills/real-sfx" "$SK/"
fi
if [ -d "$SK/real-sfx" ]; then
  mkdir -p "$HOME/sfx-library" && cp -R --update=none "$REPO/assets/sfx-library/"* "$HOME/sfx-library/"
  ( cd "$SK/real-sfx" && [ -f library_index.json ] || {
      python3 scripts/setup.py init --uisfx >/dev/null 2>&1
      python3 scripts/setup.py add-library main "$HOME/sfx-library/openverse-cc0" --tier main >/dev/null 2>&1
      python3 scripts/setup.py add-library elevenlabs "$HOME/sfx-library/elevenlabs" --tier extra --index >/dev/null 2>&1
    } )
  ( cd "$SK/real-sfx" && python3 scripts/setup.py check 2>&1 | tail -3 )
  ok "real-sfx + libraries in ~/sfx-library"
fi

# 2. Plugins: Caveman on, AgentOne installed but off (its hook hides code bodies).
if command -v claude >/dev/null; then
  claude plugin marketplace add JuliusBrussee/caveman >/dev/null 2>&1
  claude plugin install caveman@caveman >/dev/null 2>&1
  claude plugin marketplace add IterateAI/compression >/dev/null 2>&1
  claude plugin install agentone-token-compression@iterate-ai >/dev/null 2>&1
  claude plugin disable agentone-token-compression@iterate-ai >/dev/null 2>&1
  AO=$(ls -d "$HOME"/.claude/plugins/cache/iterate-ai/agentone-token-compression/*/ 2>/dev/null | tail -1)
  if [ -n "$AO" ]; then
    mkdir -p "$HOME/.claude/plugins/agentone-token-compression"
    ln -sfn "${AO}dist" "$HOME/.claude/plugins/agentone-token-compression/dist"
    [ -d "$SK/agentone-token-compression" ] || { S=$(find "$AO" -name SKILL.md | head -1); [ -n "$S" ] && mkdir -p "$SK/agentone-token-compression" && cp "$S" "$SK/agentone-token-compression/"; }
  fi
  mkdir -p "$HOME/.config/caveman" && [ -f "$HOME/.config/caveman/config.json" ] || echo '{"defaultMode": "caveman"}' > "$HOME/.config/caveman/config.json"
  ok "plugins (Caveman hooks start working in the next chat; the skills work now)"
else
  warn "claude CLI not found: plugins skipped"
fi

# 3. Remotion project -------------------------------------------------------
RM="$REPO/workspace/remotion"
if [ ! -d "$RM/node_modules" ]; then (cd "$RM" && npm ci --silent >/dev/null 2>&1) || warn "npm ci failed in $RM"; fi
B=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | tail -1)
[ -n "$B" ] && echo "$B" > "$RM/.browser"
[ -d "$RM/node_modules/remotion" ] && ok "Remotion project in workspace/remotion"

# 4. Python tools ----------------------------------------------------------
python3 -c "import pymupdf" 2>/dev/null || pip install -q --break-system-packages pymupdf >/dev/null 2>&1
python3 -c "import faster_whisper" 2>/dev/null || pip install -q --break-system-packages faster-whisper >/dev/null 2>&1
python3 -c "import faster_whisper" 2>/dev/null && ok "faster-whisper (caption check)" || warn "faster-whisper not installed"

ok "ElevenLabs: through Composio (no key needed in the chat)"

rm -rf "$TMP"
echo "Setup done."
