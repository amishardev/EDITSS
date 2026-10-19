#!/usr/bin/env bash
# Rebuild everything in public/ from the supplied source files.
#   DESIGN_PDF  Dietary Guide v2 design export (PDF)
#   IRA_PNG     transparent IRA character render
set -euo pipefail
cd "$(dirname "$0")/.."

: "${DESIGN_PDF:?set DESIGN_PDF to the Dietary Guide v2 PDF}"
: "${IRA_PNG:?set IRA_PNG to the IRA character PNG}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

python3 -I scripts/extract_screens.py "$DESIGN_PDF" public/ui
pdfimages -png "$DESIGN_PDF" "$TMP/im"
python3 -I scripts/extract_images.py "$TMP" "$IRA_PNG" public
python3 -I scripts/make_sfx.py public/sfx

mkdir -p public/audio public/fonts
python3 -I scripts/compose.py "$TMP/music"
for f in "$TMP"/music/theme-*.wav; do
  ffmpeg -v error -y -i "$f" -c:a aac -b:a 192k "public/audio/$(basename "${f%.wav}").m4a"
done
for w in 400 600 700 800; do cp node_modules/@fontsource/sora/files/sora-latin-$w-normal.woff2 public/fonts/; done
for w in 400 500 600 700; do cp node_modules/@fontsource/poppins/files/poppins-latin-$w-normal.woff2 public/fonts/; done
echo "assets rebuilt"
