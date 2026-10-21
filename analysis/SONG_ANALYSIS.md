# MOONLIGHT - AMISHAR - audio analysis

Everything here was measured from `moonlight.mp3`, not guessed from the lyrics. Machine-readable version: `analysis/moonlight.analysis.json` (sections, lyric line times, events, kick grid, per-frame envelopes at 30 fps). Scripts that produced it live in `scripts/analysis/`.

## Core facts

| | |
|---|---|
| Tempo | **128.00 BPM** (the MP3's TBPM tag says 130, the audio says 128. Kick phase-fit on both drops lands on 127.97-128.00, and the file is exactly 121 bars of 1.875 s) |
| Grid | bar 1 starts at 0.000 s. 1 beat = 0.46875 s, 1 bar = 1.875 s, 4 bars = 7.5 s, 8 bars = 15 s |
| Length | 3:46.93, 121 bars |
| Key | C minor |
| Harmony | one 4-bar loop for the whole record: **Ab - Fm - Cm - Bb** (VI - iv - i - VII). It never resolves cleanly to a major chord, it just keeps turning. That's the "moving anyway" feeling in the harmony itself |
| Drop bass | walks Ab-G / F-Ab / C / Bb-A inside the loop. The **Cm bar (bar 3 of every 4-bar phrase) carries ~3 dB more bass** than the others, so the heaviest low end lands every 7.5 s on the "home" chord |

## Timeline

Bar numbers are 1-based. `m:ss.xx`.

| Bars | Time | Section | What is actually happening | Energy /10 |
|---|---|---|---|---|
| 1-8 | 0:00.00-0:15.00 | **Intro** | Keys / pad on the loop. No kick, no sub. Riser opens in bar 8 (~0:13) | 2 |
| 9-16 | 0:15.00-0:30.00 | **Verse 1a** | Light percussion layer arrives at 0:15.00. **First vocal at 0:15.96**: "Moving my feet to the beat of a drum". Still no kick | 3 |
| 17-24 | 0:30.00-0:45.00 | **Verse 1b** | **Kick + sub enter at 0:30.00, right under "If I took it ALIVE"**. Four-on-the-floor, kick carries the sub, no claps. "Moonlight" sung ~0:33.3. Vocal breath 0:35.6-0:37.0 | 5 |
| 25-32 | 0:45.00-1:00.00 | **Build 1 / pre-chorus** | Claps every beat from 0:45. "Out of sight, out of mind" 0:46.6. Sub filters down, **kick drops out at 0:50.63**, 8th-note roll from 0:52.50, 16th roll from 0:56.25. "Moving to the music" 0:55.97, "grooving till the bar kicks us out" from 0:57.92 | 6 → 8 |
| 33-56 | **1:00.000**-1:45.00 | **Drop 1** | Impact exactly on "kicks us **OUT**". Kick on every beat, sidechained rolling sub on the 16th after each kick, offbeat open hat, claps 2 & 4 with a lighter layer on every beat. Vocal chops at 1:07.7, 1:09.2, 1:24.6, 1:28.0. Lift in bars 55-56. Continuous 24 bars, no dropouts | 9 |
| 57-64 | 1:45.00-2:00.00 | **Breakdown** | Last kick at 1:45.000, then nothing under the vocal but keys. "Grooving till the bar kicks us out" (crosses 1:45), "Oh, oh" 1:46.5, "Grooving till the bar kicks us out / oh, oh, oh" 1:50.7-1:58.9. **Most intimate moment of the record**. Near-silence 1:58.1-2:00 | 3 |
| 65-80 | 2:00.00-2:30.00 | **Verse 2** | Kick back at 2:00.00, no claps. **"Shoot for the stars with our backs to the sun"** 2:00.79. Then a **2.2 s vocal gap** (2:05.7-2:08.0). **"We rise and we fall, living forever young"** 2:07.99. Moonlight line 2:14.3. Gap 2:20.6-2:22.0. "Taking my time / fools lie" 2:22.1-2:31.1 | 5 |
| 81-88 | 2:30.00-2:45.00 | **Build 2** | Same shape as build 1, kick out at 2:35.63, 8ths 2:37.50, 16ths 2:41.25, "grooving till the bar kicks us out" from 2:42.95 | 7 → 8.5 |
| 89-112 | **2:45.000**-3:30.00 | **Drop 2** | Same impact on "OUT". **Second-half escalation: the kick drops out for all of bar 104 (3:13.13-3:15.00) and slams back at 3:15.000**, then drops out again in bar 112 (3:28.13-3:30.00) under a final vocal (3:26.2-3:31.6) | 10 |
| 113-121 | 3:30.00-3:46.93 | **Outro** | One last hit at 3:30.000, then keys and shaker thin out to silence | 2 |

## Lyric map (measured on the separated vocal stem)

| Line | Start | End |
|---|---|---|
| Moving my feet to the beat of a drum | 0:15.96 | 0:20.76 |
| It's not where you been, it's about where you're goin | 0:23.41 | 0:28.64 |
| If I took it alive, I promise to say it in the moonlight | 0:29.31 | 0:34.76 |
| I'm taking my time, telling the truth | 0:37.06 | 0:42.80 |
| 'Cause only fools lie, fools lie | 0:42.80 | 0:46.20 |
| Out of sight, out of mind | 0:46.60 | 0:48.63 |
| Take a chance, rolling it twice | 0:48.73 | 0:51.60 |
| It's out of sight, out of mind | 0:51.60 | 0:55.43 |
| Moving to the music, | 0:55.97 | 0:57.85 |
| grooving till the bar kicks us out | 0:57.92 | 1:01.37 (drop at 1:00.000) |
| Moving to the music, | 1:40.93 | 1:42.70 |
| grooving till the bar kicks us out | 1:42.94 | 1:46.20 |
| Oh, oh | 1:46.46 | 1:50.47 |
| Grooving till the bar kicks us out | 1:50.67 | 1:55.20 |
| Oh, oh, oh | 1:55.20 | 1:58.90 |
| Shoot for the stars with our backs to the sun | 2:00.79 | 2:05.74 |
| We rise and we fall, living forever young | 2:07.99 | 2:14.03 |
| If I took it alive, I promise to say it in the moonlight | 2:14.31 | 2:19.77 |
| I'm taking my time, telling the truth | 2:22.06 | 2:27.80 |
| 'Cause only fools lie, fools lie | 2:27.80 | 2:31.10 |
| Out of sight, out of mind | 2:31.59 | 2:33.63 |
| Take a chance, rolling it twice | 2:33.73 | 2:36.50 |
| It's out of sight, out of mind | 2:36.50 | 2:40.83 |
| Moving to the music, | 2:40.96 | 2:42.85 |
| grooving till the bar kicks us out | 2:42.95 | 2:45.85 (drop at 2:45.000) |

Method: Spleeter 2-stem ONNX separation, phrase detection on the vocal stem, Whisper small.en per phrase, then line boundaries set on the measured energy dips. Line ends inside long legato phrases are +/- 0.2 s.

## Drum & bass behaviour (16th-note folding across each section)

- **Verses**: kick on all four beats, the kick itself carries the sub. No clap in verse 2 at all, which is why it feels open and "walking" rather than dancing.
- **Builds**: claps on every beat (bars 25-28) → 8ths (29-30) → 16ths (31-32). The kick disappears for the last ~9.4 s of each build, so the floor drops away right when the vocal says "take a chance, rolling it twice".
- **Drops**: kick on every beat, sub note on the 16th straight after each kick (classic sidechained rolling progressive bass), pad pumps on every beat, open hat on every offbeat, clap 2 & 4. Heaviest bass on the Cm bar of each 4-bar phrase.
- **Breakdown and outro**: one hit on the downbeat, nothing else in the low end.

## Vocal density

- Dense: 0:15-0:61 and 2:00-2:46 (almost continuous phrasing, short breaths)
- Sparse: inside both drops (chops only)
- Exposed: breakdown 1:45-1:59 (vocal + keys only)

## Energy curve

```
10 |                                                                   ████████
 9 |                       ██████████                                  ████████
 8 |                    ▄▄▄                                       ▄▄▄  ████████
 7 |                  ▄▄                                        ▄▄     ████████
 5 |           ██████                 ░░        ██████████████         ████████
 3 |     ██████                       ██████                                    
 2 | ████                                                                       ████
   +--------------------------------------------------------------------------------
    0:00 0:15 0:30 0:45 1:00          1:45 2:00          2:30 2:45          3:30 3:46
```

## What this means for the edits

| Need | Use | Why |
|---|---|---|
| Strongest hook | **0:55.97-1:01.4** "Moving to the music, grooving till the bar kicks us **OUT**" → drop | the lyric literally announces the drop |
| Strongest dance section | **2:45-3:30 drop 2**, especially 3:13.1-3:16 (kick-out → slam back) | only drop with internal dynamics |
| Emotional peak | **2:00.8-2:14** "Shoot for the stars... we rise and we fall, living forever young" | only sung once, sits on the first kick after the breakdown |
| Intimate moments | 0:00-0:15 intro, **1:45-1:59 breakdown**, 2:05.7-2:08 vocal gap | |
| Quiet-to-loud contrast | 0:45 → 1:00, 2:30 → 2:45 | 15 s each, kickless last 9.4 s |
| First vocal | 0:15.96 | |
| "moonlight" | 0:33.3 and 2:18.4 (approx word time) | each followed by an instrumental breath |
| Natural loops | any 4 or 8 bars (7.5 s / 15 s) because the loop is Ab-Fm-Cm-Bb throughout | a Reel cut to 7.5 / 15 s ends on Bb and falls straight back into Ab |
| Replayable moments | 1:00 drop impact; 3:15 slam back; 2:07.99 "We rise"; 0:30 "alive" kick entry | |
