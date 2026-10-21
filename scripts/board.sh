#!/usr/bin/env bash
# Regenerate the whole visual board: clips.json, category pages, reel docs, stills, contact sheet.
set -e
cd "$(dirname "$0")/.."
npx tsx scripts/export.ts
TMP=$(mktemp -d)
node -e "
const ids=require('./visual-board/clips.json').clips.map(c=>c.id);
require('fs').writeFileSync('$TMP/jobs.json', JSON.stringify(ids.map(id=>({name:id, comp:'Shot-'+id, props:{}, frame:75}))));
"
node scripts/stills.mjs "$TMP/jobs.json" "$TMP/png" 0.5
python3 scripts/contact_sheet.py "$TMP/png"
