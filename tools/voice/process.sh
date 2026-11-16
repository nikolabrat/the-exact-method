#!/usr/bin/env bash
# Turn raw_<id>.mp3 (from ElevenLabs via Composio) into trimmed, sped-up f<id>.wav. Run inside public/<reel>v/.
set -euo pipefail
for r in raw_*.mp3; do
  id=${r#raw_}; id=${id%.mp3}
  ffmpeg -nostdin -y -loglevel error -i "$r" -af "silenceremove=start_periods=1:start_threshold=-62dB:start_silence=0.12:stop_periods=-1:stop_duration=0.2:stop_threshold=-38dB:stop_silence=0.18,areverse,silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.1,areverse,atempo=1.07" -ar 48000 -ac 1 "f$id.wav"
  echo "f$id.wav"
done
