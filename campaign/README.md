# Dietary Guide x IRA · vertical ad campaign

Seven 9:16 ads (1080x1920, 30 fps, H.264 + AAC) built in Remotion from the real
Dietary Guide v2 design and the IRA character render, scored with an original
IRA theme composed in code.

| # | Composition | File | Length | Angle |
|---|---|---|---|---|
| 01 | `Ad01-Plate` | `out/ad-01-plate.mp4` | 20.0s | Meal photo analysis |
| 02 | `Ad02-LabelScan` | `out/ad-02-label-scan.mp4` | 19.0s | Food-label scanning |
| 03 | `Ad03-AskIra` | `out/ad-03-ask-ira.mp4` | 20.0s | IRA chat companion |
| 04 | `Ad04-IndianFood` | `out/ad-04-indian-food.mp4` | 19.0s | Real Indian meals, awareness |
| 05 | `Ad05-SmallHabits` | `out/ad-05-small-habits.mp4` | 20.0s | Streaks and milestones |
| 06 | `Ad06-BrandIntro` | `out/ad-06-brand-intro.mp4` | 20.0s | Full product intro |
| 07 | `Ad07-IraHop` | `out/ad-07-ira-hop.mp4` | 22.0s | **Hero:** IRA hops through the app |

Storyboards, captions and voiceover scripts: [`STORYBOARD.md`](STORYBOARD.md).
Contact sheet of every ad: `out/contact-sheet.jpg`.

## Run it

```bash
cd campaign
npm install
npm run dev            # Remotion Studio preview
npm run typecheck
npm run render:all     # all seven MP4s into out/
npm run render:03      # or one ad
npm run finish         # delivery pass: yuv420p, -14 LUFS, exact length, faststart
npm run qa             # verify specs + build out/contact-sheet.jpg
```

Exact render commands (what the npm scripts run):

```bash
npx remotion render src/index.ts Ad01-Plate       out/ad-01-plate.mp4
npx remotion render src/index.ts Ad02-LabelScan   out/ad-02-label-scan.mp4
npx remotion render src/index.ts Ad03-AskIra      out/ad-03-ask-ira.mp4
npx remotion render src/index.ts Ad04-IndianFood  out/ad-04-indian-food.mp4
npx remotion render src/index.ts Ad05-SmallHabits out/ad-05-small-habits.mp4
npx remotion render src/index.ts Ad06-BrandIntro  out/ad-06-brand-intro.mp4
npx remotion render src/index.ts Ad07-IraHop      out/ad-07-ira-hop.mp4
```

Codec settings live in `remotion.config.ts` (H.264, CRF 18, yuv420p, AAC).
On an offline machine, point Remotion at a local Chrome Headless Shell:

```bash
REMOTION_BROWSER=/path/to/headless_shell npm run render:all
```

QA stills for any frames: `node scripts/stills.mjs Ad02-LabelScan 0,150,400`.

## Where things come from

Everything renders from `public/`, nothing loads from the network.

- `public/ui/` real screens rasterised at 600dpi from the Dietary Guide v2
  design PDF (`scripts/extract_screens.py`, boxes found from the phone bezels).
  All screens share a 1626px source width, so overlays and native rebuilds use
  the same coordinates as the raster.
- `public/photos/`, `public/ira/sticker-*.png`, `public/brand/` photos, story
  sticker poses and the wordmark, pulled from the same PDF
  (`scripts/extract_images.py`).
- `public/ira/ira.png` the supplied transparent IRA render (1254x1254 RGBA).
- `public/audio/theme-ad0X.m4a` the original IRA theme, one arrangement per ad,
  synthesised by `scripts/compose.py` (`npm run music`). No samples, no
  third-party music.
- `public/sfx/` UI sounds synthesised by `scripts/make_sfx.py` (no samples).
- `public/fonts/` Sora + Poppins from `@fontsource` (SIL OFL).

`npm run assets` rebuilds all of it (`DESIGN_PDF` and `IRA_PNG` env vars).

## Code map

```
src/theme.ts              brand tokens, safe zone, beat grid, easing helpers
src/assets.ts             asset paths + screen heights
src/components/Ira.tsx    IRA: transform-only animation (uniform scale only)
src/components/Phone.tsx  handset frame, scrolling screens, phonePoint()
src/components/Stage.tsx  Camera, Bg, Photo, FocusCrop, ScreenCrop, ScanBeam, Spot, Tap, Reveal, Scene, Grain
src/components/Text.tsx   Headline (kinetic words, *accent*), Sub, Pill, Count
src/components/Bubble.tsx chat bubbles + typing dots
src/components/Brand.tsx  Logo wipe, EndCard
src/components/Sound.tsx  Music (replaceable layer), Sfx, Cues
src/components/ui/        native rebuild of the meal-result screen, icons
src/ads/Ad0X*.tsx         one file per ad
```

### Music

`scripts/compose.py` writes the IRA theme: 128 BPM, D major (D, Bm, G, A),
synthesised tabla bols (dha, na, tin, ge), a Karplus-Strong sitar-like pluck,
a kalimba hook, bass, pad, clap and shaker, with reverb, kick sidechain and a
soft limiter. Each ad has an arrangement in `ARR` (sections in beats, plus
risers, stabs, stings and single notes on exact video frames), so drops and
stings land on the picture: the product reveal in Ads 01 and 06 (frame 112),
the label result in Ad 02, the "Snap. Log. Samjho." stabs in Ad 04, and in
Ad 07 every IRA landing plays the next note of the hook.

To re-score with other music, pass a file path as `track` to `<Music>`
(`src/components/Sound.tsx`), e.g. `<Music track="audio/my-song.m4a" ... />`.

### Other aspect ratios

Layouts are positioned on a 1080x1920 canvas with the platform safe area in
`SAFE` (top 250px, bottom 300px). For 4:5 or 1:1, register extra
`<Composition>`s with a different height and wrap each ad in a scaled,
centred container. The phone and IRA components take explicit geometry, so
scenes can be re-laid out without touching the animation logic.
