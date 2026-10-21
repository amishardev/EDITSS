"""Writes beats.json, energy.json and segments.json from the fitted grid."""
import json, sys
import numpy as np, librosa, scipy.signal as sig

SRC = sys.argv[1] if len(sys.argv) > 1 else "audio/moonlight_from_mp3.wav"
raw = json.load(open("analysis/_beats_raw.json"))
bpm, P, first, dur = raw["bpm"], raw["period"], raw["first"], raw["duration"]
beats = [round(first + i * P, 4) for i in range(int((dur - first) / P) + 1)]
B = lambda i: round(first + i * P, 4)

DROP1, DROP2, OUTRO = 128, 352, 448
beats_json = {
    "source": SRC, "bpm": round(bpm, 3), "beat_period": round(P, 6), "first_beat": round(first, 4),
    "beats_per_bar": 4, "phrase_bars": 8,
    "beats": beats,
    "downbeats": beats[::4],
    "phrases": beats[::32],
    "drops": {"drop1": {"beat": DROP1, "time": B(DROP1)}, "drop2": {"beat": DROP2, "time": B(DROP2)}},
    "sections": [
        {"name": "intro", "start": 0.0, "end": B(32)},
        {"name": "verse_build", "start": B(32), "end": B(DROP1)},
        {"name": "drop1", "start": B(DROP1), "end": B(224)},
        {"name": "break2", "start": B(224), "end": B(DROP2)},
        {"name": "drop2", "start": B(DROP2), "end": B(OUTRO)},
        {"name": "outro", "start": B(OUTRO), "end": round(dur, 3)},
    ],
    "stops": [
        {"name": "stop1", "start": B(268), "end": B(273), "note": "kick/bass drop out, pads ring"},
        {"name": "stop2", "start": B(298), "end": B(303), "note": "kick/bass drop out, pads ring"},
    ],
}
json.dump(beats_json, open("analysis/beats.json", "w"), indent=1)

# energy envelopes at 30 fps
y, sr = librosa.load(SRC, sr=44100, mono=True)
hop = sr // 30
nfr = int(np.ceil(len(y) / hop))
rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop, center=True)[0][:nfr]
b, a = sig.butter(4, [20 / (sr / 2), 150 / (sr / 2)], "band")
bass = np.abs(sig.filtfilt(b, a, y))
bass_env = np.array([bass[i * hop:(i + 1) * hop].mean() if i * hop < len(y) else 0 for i in range(nfr)])
def norm(x): return (x / (np.percentile(x, 99.5) + 1e-9)).clip(0, 1)
json.dump({"fps": 30, "frames": nfr, "rms": np.round(norm(rms), 4).tolist(),
           "bass": np.round(norm(bass_env), 4).tolist()}, open("analysis/energy.json", "w"))

# beat-snapped segments (lyric-based ones wait on accurate alignment)
def seg(name, b0, b1, note=""):
    return {"name": name, "start_beat": b0, "end_beat": b1, "start": B(b0), "end": B(b1),
            "duration": round(B(b1) - B(b0), 3), "bars": (b1 - b0) / 4, "note": note}
segments = {
    "S1": seg("HOOK_INTO_DROP1", 96, 140, "8 bars of build + 3 bars of drop 1"),
    "S2": seg("DROP1_CORE", DROP1, DROP1 + 32, "first 8 bars of drop 1"),
    "S5": seg("THE_STOPS", 260, 308, "covers stop1 2:05.7 and stop2 2:19.7"),
    "S7": seg("HOOK_INTO_DROP2", 328, 368, "6 bars before drop 2 + 4 bars of drop 2"),
    "S8": seg("OUTRO_SUNRISE", 432, 480, "last 4 bars of drop 2 + outro; 8 bars would run 31s"),
}
pending = {
    "S3": "VERSE_LYRIC, needs accurate word timing",
    "S4": "MOONLIGHT_LINE, needs accurate word timing (and runs ~30s, over the 24s cap)",
    "S6": "STARS_LINE, line not located yet",
    "S9": "OUT_OF_SIGHT, line not located yet",
}
json.dump({"segments": segments, "pending": pending}, open("analysis/segments.json", "w"), indent=1)
print("BPM %.3f | drop1 %.3fs | drop2 %.3fs | outro %.3fs" % (bpm, B(DROP1), B(DROP2), B(OUTRO)))
for k, s in segments.items():
    print(k, s["name"], "%.2f-%.2f (%.2fs, %g bars)" % (s["start"], s["end"], s["duration"], s["bars"]))
