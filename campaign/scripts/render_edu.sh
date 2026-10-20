#!/usr/bin/env bash
# Render every education-series video (or the slugs given) to out/edu/, then run the delivery pass.
# Usage: bash scripts/render_edu.sh [slug ...]
set -euo pipefail
cd "$(dirname "$0")/.."
# use a preinstalled headless Chromium when Remotion cannot download its own
if [ -z "${REMOTION_BROWSER:-}" ] && [ -x /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell ]; then
  export REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
fi
mkdir -p out/edu
npx remotion bundle src/index.ts --out-dir build >/dev/null
ids=$(node -e '
const t=require("./src/edu/topics.json"), tm=require("./src/edu/timings.json"), only=process.argv.slice(1);
for (const x of t) if (tm[x.slug] && (!only.length || only.includes(x.slug))) console.log(`Edu-${String(x.n).padStart(2,"0")}-${x.slug}`);
' "$@")
for id in $ids; do
  out="out/edu/$(echo "$id" | tr 'A-Z' 'a-z').mp4"
  npx remotion render build "$id" "$out" --concurrency=4 --log=error
  bash scripts/finish.sh "$out"
done
