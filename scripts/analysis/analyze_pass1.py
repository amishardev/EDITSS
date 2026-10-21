"""Pass 1: tempo, beat grid, per-bar energy profile in frequency bands."""
import sys, json
import numpy as np
import librosa

path = sys.argv[1]
y, sr = librosa.load(path, sr=22050, mono=True)
dur = len(y) / sr
print("duration", round(dur, 3))

onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=256)
tempo, beats = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, hop_length=256, start_bpm=130, tightness=400)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=256)
print("tempo", tempo, "nbeats", len(bt), "first beats", np.round(bt[:8], 3))
ibi = np.diff(bt)
print("median ibi", np.median(ibi), "->", 60 / np.median(ibi))

# Band energies via STFT
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512)) ** 2
freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=512)
bands = {"sub": (20, 60), "bass": (60, 250), "lowmid": (250, 1000), "mid": (1000, 4000), "high": (4000, 11000)}
B = {k: S[(freqs >= a) & (freqs < b)].sum(axis=0) for k, (a, b) in bands.items()}
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]

spb = 60 / 130.0
bar = spb * 4
# find a phase: choose offset maximizing low-band onset at bar starts later
nbars = int(dur / bar) + 1
rows = []
for i in range(nbars):
    t0, t1 = i * bar, (i + 1) * bar
    m = (times >= t0) & (times < t1)
    if not m.any():
        continue
    row = {"bar": i + 1, "t": round(t0, 2)}
    row["rms_db"] = round(float(20 * np.log10(rms[m].mean() + 1e-9)), 1)
    for k in bands:
        row[k] = round(float(10 * np.log10(B[k][m].mean() + 1e-9)), 1)
    rows.append(row)
for r in rows:
    print(f"bar {r['bar']:3d} t={r['t']:7.2f} rms={r['rms_db']:6.1f} sub={r['sub']:6.1f} bass={r['bass']:6.1f} lm={r['lowmid']:6.1f} mid={r['mid']:6.1f} hi={r['high']:6.1f}")
