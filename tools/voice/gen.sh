#!/usr/bin/env bash
set -euo pipefail
KEY="${ELEVENLABS_API_KEY:-$(cat ~/.private/el_key 2>/dev/null)}"; [ -n "$KEY" ] || { echo "Set ELEVENLABS_API_KEY"; exit 1; }
V=cBTYF7NiJbR8Bvmdeuse
mapfile -t L < lines.txt
for row in "${L[@]}"; do
  id=${row%%|*}; txt=${row#*|}
  [ -f raw_$id.mp3 ] || curl -s -o raw_$id.mp3 -X POST "https://api.elevenlabs.io/v1/text-to-speech/$V" \
    -H "xi-api-key: $KEY" -H "Content-Type: application/json" \
    -d "$(python3 -c 'import json,sys;print(json.dumps({"text":sys.argv[1],"model_id":"eleven_v4","voice_settings":{"stability":0.5,"similarity_boost":0.75}}))' "$txt")" </dev/null
  ffmpeg -nostdin -y -loglevel error -i raw_$id.mp3 -af "silenceremove=start_periods=1:start_threshold=-62dB:start_silence=0.12:stop_periods=-1:stop_duration=0.2:stop_threshold=-38dB:stop_silence=0.18,areverse,silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.1,areverse,atempo=1.07" -ar 48000 -ac 1 f$id.wav
done
