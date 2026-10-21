"""
Builds analysis/moonlight.analysis.json, the timing source of truth for the Remotion project.

Inputs (made by separate_vocals.py from the master):
  song.wav, vocals.wav, accompaniment.wav
Usage:
  python3 build_analysis.py <dir-with-wavs> <out.json>

Measured facts (see analysis/SONG_ANALYSIS.md for how they were derived):
  * tempo 128.00 BPM (the 130 TBPM tag in the MP3 is wrong), grid starts at 0.000 s
  * 121 bars of 1.875 s, 4-bar loop Ab - Fm - Cm - Bb
Section and lyric times below were curated from the phrase / Whisper runs (vocal_phrases.py and
manual dip inspection on the vocal stem) and snapped to what the stem actually shows.
"""
import sys, json
import numpy as np
import librosa
import scipy.signal as ss

src, out_path = sys.argv[1], sys.argv[2]
BPM = 128.0
BEAT = 60.0 / BPM
BAR = BEAT * 4
FPS = 30
SR = 22050

mix, _ = librosa.load(f"{src}/song.wav", sr=SR, mono=True)
acc, _ = librosa.load(f"{src}/accompaniment.wav", sr=SR, mono=True)
voc, _ = librosa.load(f"{src}/vocals.wav", sr=SR, mono=True)
harm, perc = librosa.effects.hpss(acc, margin=2.0)
dur = len(mix) / SR
n_frames = int(np.ceil(dur * FPS))


def band(sig, lo, hi):
    sos = ss.butter(4, [lo / (SR / 2), hi / (SR / 2)], btype="band", output="sos")
    return ss.sosfiltfilt(sos, sig)


def frame_env(sig, attack_ms=5, release_ms=120):
    """Per-video-frame envelope with fast attack / slower release, normalised 0..100."""
    hop = SR // FPS
    rms = np.array([np.sqrt(np.mean(sig[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n_frames)])
    db = 20 * np.log10(rms + 1e-9)
    lo, hi = np.percentile(db, 5), np.percentile(db, 99.5)
    x = np.clip((db - lo) / (hi - lo + 1e-9), 0, 1)
    out = np.zeros_like(x)
    a = 1 - np.exp(-1000 / (attack_ms * FPS))
    r = 1 - np.exp(-1000 / (release_ms * FPS))
    for i, v in enumerate(x):
        p = out[i - 1] if i else 0
        out[i] = p + (v - p) * (a if v > p else r)
    return [int(round(v * 100)) for v in out]


envelopes = {
    "rms": frame_env(mix, 10, 250),
    "kick": frame_env(band(perc, 40, 110), 3, 90),
    "bass": frame_env(band(harm, 55, 200), 15, 200),
    "clap": frame_env(band(perc, 1200, 4000), 3, 80),
    "hat": frame_env(band(perc, 7000, 10500), 3, 60),
    "pad": frame_env(band(harm, 500, 4000), 30, 300),
    "vocal": frame_env(band(voc, 200, 5000), 10, 150),
}

t_bar = lambda b: round((b - 1) * BAR, 3)  # bar numbers are 1-based

sections = [
    {"id": "intro", "label": "Intro", "bars": [1, 8], "energy": 2, "desc": "Keys/pad on Ab-Fm-Cm-Bb, no drums, riser in bar 8"},
    {"id": "verse1a", "label": "Verse 1 (no kick)", "bars": [9, 16], "energy": 3, "desc": "First vocal at 15.96 s; light percussion, still no kick or sub"},
    {"id": "verse1b", "label": "Verse 1 (kick + sub in)", "bars": [17, 24], "energy": 5, "desc": "Four-on-the-floor kick with sub enters on 'alive' at 30.00 s; moonlight line"},
    {"id": "build1", "label": "Pre-chorus / build 1", "bars": [25, 32], "energy": 7, "desc": "Out of sight, out of mind. Claps every beat, kick filters out after 50.6 s, 8th roll bars 29-30, 16th roll bars 31-32"},
    {"id": "drop1", "label": "Drop 1 / chorus", "bars": [33, 56], "energy": 9, "desc": "Impact 60.000 s on 'kicks us OUT'. Rolling sidechained bass, offbeat open hats, vocal chops"},
    {"id": "breakdown", "label": "Breakdown", "bars": [57, 64], "energy": 3, "desc": "Kick stops after the 105.000 s hit. 'Grooving till the bar kicks us out / oh, oh' over keys. Most intimate moment"},
    {"id": "verse2", "label": "Verse 2 (bridge lyric)", "bars": [65, 80], "energy": 5, "desc": "Kick back at 120.00 s, no claps. 'Shoot for the stars...' then 'We rise and we fall, living forever young'"},
    {"id": "build2", "label": "Pre-chorus / build 2", "bars": [81, 88], "energy": 8, "desc": "Same build shape as build 1, kick out after 155.6 s, rolls into drop 2"},
    {"id": "drop2", "label": "Drop 2 / final chorus", "bars": [89, 112], "energy": 10, "desc": "Impact 165.000 s. Kick drops out for bar 104 (193.1-195.0) and bar 112 (208.1-210.0). Strongest section"},
    {"id": "outro", "label": "Outro", "bars": [113, 121], "energy": 2, "desc": "Last hit 210.000 s, keys and shaker fade, silence at ~226 s"},
]
for s in sections:
    s["start"] = t_bar(s["bars"][0])
    s["end"] = round(min(dur, s["bars"][1] * BAR), 3)

lyrics = [
    ("V1L1", "Moving my feet to the beat of a drum", 15.96, 20.76, "verse1a"),
    ("V1L2", "It's not where you been, it's about where you're goin", 23.41, 28.64, "verse1a"),
    ("V1L3", "If I took it alive, I promise to say it in the moonlight", 29.31, 34.76, "verse1b"),
    ("V1L4", "I'm taking my time, telling the truth", 37.06, 42.80, "verse1b"),
    ("V1L5", "'Cause only fools lie, fools lie", 42.80, 46.20, "verse1b"),
    ("PC1L1", "Out of sight, out of mind", 46.60, 48.63, "build1"),
    ("PC1L2", "Take a chance, rolling it twice", 48.73, 51.60, "build1"),
    ("PC1L3", "It's out of sight, out of mind", 51.60, 55.43, "build1"),
    ("PC1L4", "Moving to the music,", 55.97, 57.85, "build1"),
    ("PC1L5", "grooving till the bar kicks us out", 57.92, 61.37, "build1"),
    ("BRL1", "Moving to the music,", 100.93, 102.70, "drop1"),
    ("BRL2", "grooving till the bar kicks us out", 102.94, 106.20, "breakdown"),
    ("BRL3", "Oh, oh", 106.46, 110.47, "breakdown"),
    ("BRL4", "Grooving till the bar kicks us out", 110.67, 115.20, "breakdown"),
    ("BRL5", "Oh, oh, oh", 115.20, 118.90, "breakdown"),
    ("V2L1", "Shoot for the stars with our backs to the sun", 120.79, 125.74, "verse2"),
    ("V2L2", "We rise and we fall, living forever young", 127.99, 134.03, "verse2"),
    ("V2L3", "If I took it alive, I promise to say it in the moonlight", 134.31, 139.77, "verse2"),
    ("V2L4", "I'm taking my time, telling the truth", 142.06, 147.80, "verse2"),
    ("V2L5", "'Cause only fools lie, fools lie", 147.80, 151.10, "verse2"),
    ("PC2L1", "Out of sight, out of mind", 151.59, 153.63, "build2"),
    ("PC2L2", "Take a chance, rolling it twice", 153.73, 156.50, "build2"),
    ("PC2L3", "It's out of sight, out of mind", 156.50, 160.83, "build2"),
    ("PC2L4", "Moving to the music,", 160.96, 162.85, "build2"),
    ("PC2L5", "grooving till the bar kicks us out", 162.95, 165.85, "build2"),
]
lyrics = [{"id": i, "text": tx, "start": a, "end": b, "section": s} for i, tx, a, b, s in lyrics]

# Musical events. type drives which visual behaviour may react to it.
ev = []
add = lambda t, typ, w, note: ev.append({"t": round(t, 3), "type": typ, "weight": w, "note": note})
add(14.06, "riser", 0.4, "riser tail into first percussion bar")
add(15.00, "section", 0.4, "percussion layer enters (bar 9)")
add(15.96, "vocal_in", 0.6, "first vocal: 'Moving my feet'")
add(30.00, "impact", 0.7, "kick + sub enter under 'alive' (bar 17)")
add(33.30, "lyric_key", 0.6, "'moonlight' (verse 1)")
add(35.62, "breath", 0.5, "vocal gap after 'moonlight', 35.6-37.0")
add(45.00, "section", 0.6, "build 1 starts, claps every beat")
add(50.625, "kick_out", 0.6, "kick filtered out, tension without a floor")
add(52.50, "roll_8th", 0.6, "snare/clap roll doubles to 8ths (bar 29)")
add(56.25, "roll_16th", 0.8, "roll goes to 16ths (bar 31)")
add(59.53, "pickup", 0.7, "sub pickup on beat 4 of bar 32")
add(60.00, "drop", 1.0, "DROP 1 on 'kicks us OUT'")
add(67.70, "chop", 0.4, "vocal chop")
add(69.16, "chop", 0.4, "vocal chop phrase")
add(84.60, "chop", 0.4, "vocal chop")
add(88.03, "chop", 0.5, "vocal chop phrase leading into second half of drop")
add(90.00, "phrase", 0.6, "drop 1 second half (bar 49)")
add(101.25, "fill", 0.6, "end-of-drop lift (bars 55-56)")
add(105.00, "impact_out", 0.9, "last kick, drop 1 collapses into breakdown")
add(118.12, "breath", 0.5, "near silence before verse 2 (bar 64)")
add(120.00, "impact", 0.7, "kick returns for verse 2 (bar 65)")
add(125.74, "breath", 0.7, "after 'backs to the sun', 2.2 s with no vocal")
add(127.99, "vocal_in", 0.8, "'We rise and we fall'")
add(138.40, "lyric_key", 0.6, "'moonlight' (verse 2)")
add(140.62, "breath", 0.5, "vocal gap 140.6-142.0")
add(150.00, "section", 0.6, "build 2 starts")
add(155.625, "kick_out", 0.6, "kick out in build 2")
add(157.50, "roll_8th", 0.6, "8th roll (bar 85)")
add(161.25, "roll_16th", 0.8, "16th roll (bar 87)")
add(164.53, "pickup", 0.7, "breath + pickup before drop 2")
add(165.00, "drop", 1.0, "DROP 2 on 'kicks us OUT'")
add(187.63, "chop", 0.4, "vocal chop")
add(193.125, "kick_out", 0.8, "kick drops out for one bar inside drop 2 (bar 104)")
add(195.00, "impact", 0.9, "kick slams back (bar 105)")
add(206.16, "vocal_in", 0.6, "final vocal phrase over the end of drop 2")
add(208.125, "kick_out", 0.7, "kick out, last lift (bar 112)")
add(210.00, "impact_out", 0.9, "final hit, outro (bar 113)")
add(225.00, "end", 0.3, "last chord tail")

# Bass weight peaks on bar 3 of every 4-bar phrase in the drops (the Cm bar).
bass_accents = [t_bar(b) for b in list(range(35, 57, 4)) + list(range(91, 113, 4))]

kick_sections = [(17, 28.25), (33, 57.25), (65, 80.75), (81, 84.25), (89, 104), (105, 112), (113, 113.25)]
kicks = []
for a, b in kick_sections:
    t = t_bar(a)
    while t < t_bar(1) + (b - 1) * BAR - 1e-6:
        kicks.append(round(t, 4)); t += BEAT
claps = [round(t_bar(b) + BEAT * k, 4) for b in list(range(33, 57)) + list(range(89, 113)) for k in (1, 3)]

data = {
    "title": "Moonlight", "artist": "AMISHAR", "key": "C minor", "bpm": BPM, "beat": BEAT, "bar": BAR,
    "grid_offset": 0.0, "bars": 121, "duration": round(dur, 3), "fps": FPS,
    "progression": ["Ab", "Fm", "Cm", "Bb"],
    "sections": sections, "lyrics": lyrics, "events": ev,
    "bass_accent_bars": bass_accents, "kicks": kicks, "claps_drop": claps,
    "envelopes": envelopes,
}
json.dump(data, open(out_path, "w"), separators=(",", ":"))
print("wrote", out_path, "frames", n_frames, "kicks", len(kicks))
