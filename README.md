# MOONLIGHT · AMISHAR · Reel system

A Remotion project that turns one song into a campaign of music-synced Instagram Reels. Every visual is generated procedurally (no stock footage, no AI images, no shoot), and every cut and reaction is placed on events measured from the actual audio.

```
analysis/            measured song map: BPM, sections, lyric timing, events, per-frame envelopes
  SONG_ANALYSIS.md   human-readable analysis
  moonlight.analysis.json
visual-board/        the shot library as a board: 112 shots, stills, categories, clips.json
reels/               CONCEPTS.md (21 Reel concepts), reels.json, SYNC_REPORT.md, previews/
src/
  engine/            song clock, music-reactive signals, canvas, drawing toolkit, palette, fonts
  shots/             20 procedural generators (road, tunnel, train, skyline, moon, stars, bar, neon...)
  library/shots.ts   the 112 presets (source of truth for the board)
  motion/            Camera (music-reactive moves) and Transitions
  type/              typography system (hooks, lyrics, words, labels, title)
  treatments/        grain, vignette, matte, gate weave
  reels/             ReelRenderer + the 21 Reel specs (specs/phase*.ts)
public/audio/        moonlight.mp3 (the master)
scripts/             analysis (python), render, stills, export, sync check
MARKETING_PLAN.md    strategy, posting sequence, hooks, captions, CTA, rules
```

## Setup

```bash
npm install
npm run studio          # preview every Reel and every shot in the browser
```

Python bits (only needed to re-run the analysis or the sync check): `pip install librosa scipy soundfile sherpa-onnx`.

## Render

```bash
npm run render                 # all 21 Reels -> out/reels/*.mp4 (1080x1920, 30 fps, h264, 320k audio)
npm run render -- R09 R14      # just some
npx remotion render src/index.ts R14-exit out/R14.mp4    # or straight through the CLI
```

In a container without a downloadable Chrome, point Remotion at a local one: `REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render`.

After rendering, check the sync:

```bash
python3 scripts/sync_check.py   # writes reels/SYNC_REPORT.md
```

It compares the Reel's audio with the master (offset should be 0 ms), detects every hard cut and compares it with the planned cut frame, and measures where the picture's light peaks inside the beat.

## How the timing works

- `analysis/moonlight.analysis.json` holds the grid (128 BPM from 0.000 s), sections, lyric lines, events (drops, kick-outs, rolls, breaths, chops), the kick list and per-frame envelopes for kick, bass, clap, hat, pad, vocal and overall level.
- `bar(n, beat, sixteenth)` in `src/engine/song.ts` converts musical positions to song seconds. Specs are written in bars, so a cut written as `bar(33)` is the drop frame wherever the Reel starts.
- Each Reel declares `audioStart`/`audioEnd` in song seconds. The renderer plays the master from that point and gives every shot the absolute song time, so a road shot knows it's in a drop and passes a lamp on every kick.
- `src/engine/music.ts` exposes the reactive signals: `kick()`, `clap()`, `bassWeight()` (the heavy Cm bar), `drop()`, `impact()`, `tension()` (0-1 through builds), `travel()` (distance locked to the grid, so passing lights hit the beat), `env(name)`.

## Making a new Reel

1. Pick a stretch of the song in `analysis/SONG_ANALYSIS.md` (start and end on bar lines if you want it to loop).
2. Pick shots from `visual-board/` (or the Shots folder in Studio).
3. Add a spec to `src/reels/specs/` and to the list in `src/reels/index.ts`:

```ts
export const R22: ReelSpec = {
  id: "R22",
  phase: "F",
  audioStart: bar(41),
  audioEnd: bar(45),
  concept: { name: "MY NEW ONE", core: "...", hook: "...", /* ... */ },
  shots: [
    { shot: "S034", from: bar(41), to: bar(43), cam: { kick: 0.01, bass: 0.03 } },
    { shot: "S057", from: bar(43), to: bar(45), cam: { kick: 0.01 }, in: { type: "lampwipe" } },
  ],
  texts: [{ kind: "hook", text: "a line that sounds like a thought.", from: bar(41), to: bar(42, 3) }],
};
```

4. `npx tsx scripts/export.ts` to refresh the board/concept docs, then render.

Shot options: `params` (override any generator parameter), `cam` (`zoom`, `pan`, `rot`, `kick`, `bass`, `clap`, `drop`, `impact`, `tension`, `handheld`, `blur`), `in` (`cut`, `fade`, `dip`, `lampwipe`, `flash`, `iris`, `slit`, `whip`), `warp` (`speed: 0` freeze, `0.5` slow, `-1` reverse while the music runs forward), `grade`.
Reel options: `matte` keyframes (cinematic crop that can close in builds and snap open on drops), `overlays` (flashes on hits), `grade`, `grain`, `vignette`, `fadeIn`, `fadeOut`.
Text kinds: `hook`, `lyric` (by lyric id, word-timed), `word` (on hits), `label`, `title`.

## Re-running the analysis

```bash
python3 scripts/analysis/separate_vocals.py song.wav <spleeter-onnx-dir> <outdir>
python3 scripts/analysis/vocal_phrases.py <outdir>/vocals.wav <whisper-onnx-dir> phrases.json
python3 scripts/analysis/build_analysis.py <outdir> analysis/moonlight.analysis.json
```

Models: Spleeter 2-stem and Whisper small.en ONNX from the sherpa-onnx GitHub releases.

## Notes

- The MP3 moved from the repo root to `public/audio/moonlight.mp3` so Remotion can serve it.
- Song title is taken from the file name ("moonlight"). It's one constant, `SONG_TITLE` in `src/engine/song.ts`, if it changes.
- Rendered videos go to `out/` and are not committed (see `.gitignore`); previews of each Reel are in `reels/previews/`.
