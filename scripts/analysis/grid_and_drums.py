"""Fit the 130 BPM grid and map kick / clap / hat / bass activity on a 16th-note lattice."""
import sys, json
import numpy as np
import soundfile as sf
import librosa

acc_path, mix_path = sys.argv[1], sys.argv[2]
BPM = 128.0
SPB = 60.0 / BPM
y, sr = librosa.load(mix_path, sr=22050, mono=True)
hop = 64
S = np.abs(librosa.stft(y, n_fft=1024, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=1024)
tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=hop)

def band_flux(lo, hi):
    m = (f >= lo) & (f < hi)
    e = np.log1p(S[m] * 10).sum(axis=0)
    d = np.maximum(0, np.diff(e, prepend=e[0]))
    return d / (d.max() + 1e-9), e

kick_flux, kick_e = band_flux(30, 120)
clap_flux, _ = band_flux(1200, 5000)
hat_flux, _ = band_flux(7000, 11000)

# phase fit on drop 1 (60-104 s): find offset maximising kick flux on beats
best = None
for off in np.arange(0, SPB, 0.002):
    beats = np.arange(off + 60 * 0 , 226, SPB)
    beats = beats[(beats > 60) & (beats < 104)]
    idx = np.searchsorted(tt, beats)
    sc = sum(kick_flux[max(0, i - 3):i + 4].max() for i in idx)
    if best is None or sc > best[0]:
        best = (sc, off)
off = best[1]
print("grid offset (s):", round(off, 4))

def strength(flux, t0, win=0.03):
    i0, i1 = np.searchsorted(tt, t0 - win), np.searchsorted(tt, t0 + win)
    return float(flux[i0:i1].max()) if i1 > i0 else 0.0

dur = len(y) / sr
n16 = int((dur - off) / (SPB / 4))
grid = []
for k in range(n16):
    t0 = off + k * SPB / 4
    grid.append((t0, strength(kick_flux, t0), strength(clap_flux, t0), strength(hat_flux, t0)))
grid = np.array(grid)

# print per-bar 16-step patterns using thresholds
def pat(col, thr):
    return "".join("x" if v > thr else ("." if v > thr * 0.5 else "-") for v in col)

kt, ct, ht = 0.35, 0.25, 0.2
bars = n16 // 16
out = []
for b in range(bars):
    g = grid[b * 16:(b + 1) * 16]
    row = {"bar": b + 1, "t": round(g[0, 0], 3), "kick": pat(g[:, 1], kt), "clap": pat(g[:, 2], ct), "hat": pat(g[:, 3], ht)}
    out.append(row)
    print(f"bar {b+1:3d} {g[0,0]:7.2f}  K {row['kick']}  C {row['clap']}  H {row['hat']}")
json.dump({"offset": off, "bpm": BPM, "bars": out}, open("drum_grid.json", "w"), indent=1)
