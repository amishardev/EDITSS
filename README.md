# MIZRAB Reels

Ten 9:16 Instagram Reels for **MIZRAB** by **AMISHAR**, cut from the FL Studio session recording (`flrecording.mp4`, 1080x1920, 24fps, 128 BPM) with Remotion.

## Setup

```bash
npm install
# flrecording.mp4 is stored in Git LFS. If `git lfs pull` is not available,
# the render script downloads it to public/flrecording.mp4 automatically.
npm run render              # all ten -> out/MIZRAB_REEL_01..10.mp4
bash scripts/render-all.sh 03 07   # just some of them
npm run studio              # preview / tweak in Remotion Studio
```

The render uses a local Chromium when one is found (see `remotion.config.ts`), or set `REMOTION_BROWSER_EXECUTABLE`.

## Layout

- `src/reels.ts` holds every edit decision: source slices, camera keyframes, spotlights, grade and captions. It also has the section map of the track.
- `src/components/Reel.tsx` renders one reel: camera, punch-ins, motion blur, beat pulse, spotlight mask, panes, grade, vignette.
- `src/components/Type.tsx` handles the typography (Inter + JetBrains Mono, from `public/fonts`).
- `src/components/Footage.tsx` cuts the source into slices. Picture and sound come from the same slice, so they stay in sync.
- `src/lib/timeline.ts` has the 128 BPM grid and the FL Studio lane geometry.

## The ten reels

| # | Source | Hook | Treatment |
|---|---|---|---|
| 01 | 1:00-1:15 build into drop 1 | listen to what happens here. | slow push on risers, opens wide on the drop, bar cuts |
| 02 | 0:00-0:15 live sitar intro | the sitar wasn't supposed to sound like this. | tight tracking along the sitar lane, warm, pull-back |
| 03 | 1:39-1:56 breakdown | i almost deleted this part. | desaturated, sitar sample spotlight, colour on the hit |
| 04 | 2:37-2:52 drop 2 | this started with one tiny melody. | mask opens 1, 4, 9, 16 lanes every 2 bars |
| 05 | 2:05-2:20 re-entry | bar 69. everything comes back. | cuts on every bar, track by track, bar counter |
| 06 | 0:33-0:48 intro to build | this is where MIZRAB changed. | black and white until bar 21, then colour |
| 07 | 2:52-3:07 drop 2 | watch the bass, not the drums. | three stacked instrument panes, kick-synced |
| 08 | 3:20-3:38 outro | how MIZRAB says goodbye. | sitar returns, reverb automation, end card |
| 09 | 1:22-1:39 drop 1 | no vocals. no lyrics. just this. | letterbox, one unbroken drift, cut to dark |
| 10 | four slices | one sitar. four lives. | played / chopped / sampled / dropped, bar-accurate cuts |
