#!/usr/bin/env bash
# Delivery pass: broadcast-range yuv420p, -14 LUFS audio, faststart.
# Usage: bash scripts/finish.sh out/ad-01-plate.mp4 [...]
set -euo pipefail
for f in "$@"; do
  tmp="${f%.mp4}.finishing.mp4"
  ffmpeg -v error -y -i "$f" \
    -vf "scale=in_range=full:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -color_range tv \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
    -movflags +faststart "$tmp"
  # trim audio to the exact video length (loudnorm pads a few ms)
  n=$(ffprobe -v error -select_streams v -show_entries stream=nb_frames -of default=nw=1:nk=1 "$tmp")
  d=$(python3 -c "print($n / 30)")
  ffmpeg -v error -y -i "$tmp" -c:v copy -af "atrim=end=$d,afade=t=out:st=$(python3 -c "print($n / 30 - 0.05)"):d=0.05" \
    -c:a aac -b:a 192k -movflags +faststart "$f"
  rm "$tmp"
  echo "finished $f"
done
