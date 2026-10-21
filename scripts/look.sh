#!/usr/bin/env bash
# usage: scripts/look.sh <out.png> <gen> '<json params>' <start> <frame>
set -e
OUT=$1; GEN=$2; PARAMS=${3:-"{}"}; START=${4:-30}; FRAME=${5:-0}
npx remotion still src/index.ts Gen "$OUT" --frame="$FRAME" --props="{\"gen\":\"$GEN\",\"params\":$PARAMS,\"start\":$START}" ${REMOTION_BROWSER:+--browser-executable=$REMOTION_BROWSER} --log=error
