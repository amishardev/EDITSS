#!/usr/bin/env bash
# Renders every reel to out/MIZRAB_REEL_XX.mp4 (H.264, 1080x1920, 24fps).
# Usage: scripts/render-all.sh [01 02 ...]
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -s public/flrecording.mp4 ] || [ "$(stat -c%s public/flrecording.mp4)" -lt 1000000 ]; then
  echo "Fetching source video from Git LFS media..."
  mkdir -p public
  curl -sSL --retry 4 -o public/flrecording.mp4 \
    https://media.githubusercontent.com/media/amishardev/EDITSS/main/flrecording.mp4
fi

mkdir -p out
npx remotion bundle src/index.ts --out-dir=out/bundle --log=error >/dev/null
ids=("$@")
[ ${#ids[@]} -eq 0 ] && ids=(01 02 03 04 05 06 07 08 09 10 11 12 13 14)
for n in "${ids[@]}"; do
  npx remotion render out/bundle "MIZRAB-REEL-$n" "out/MIZRAB_REEL_$n.mp4" \
    --codec=h264 --crf=16 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k \
    --concurrency="${CONCURRENCY:-4}" --log=error
  echo "rendered out/MIZRAB_REEL_$n.mp4"
done
