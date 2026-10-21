"""Beat grid, energy envelopes and section detection for MOONLIGHT."""
import json, sys
import numpy as np, librosa, scipy.signal as sig

SRC = sys.argv[1] if len(sys.argv) > 1 else "audio/moonlight_from_mp3.wav"
y, sr = librosa.load(SRC, sr=44100, mono=True)
dur = len(y) / sr
HOP = 128

# kick-band onset envelope (lowpass ~150 Hz)
b, a = sig.butter(4, 150 / (sr / 2), "low")
kick = sig.filtfilt(b, a, y)
oenv_k = librosa.onset.onset_strength(y=kick, sr=sr, hop_length=HOP, aggregate=np.median)
oenv = librosa.onset.onset_strength(y=y, sr=sr, hop_length=HOP)
env = oenv_k / (oenv_k.max() + 1e-9) + 0.5 * oenv / (oenv.max() + 1e-9)
fps_env = sr / HOP

tempo0, _ = librosa.beat.beat_track(onset_envelope=env, sr=sr, hop_length=HOP, start_bpm=128)
tempo0 = float(np.atleast_1d(tempo0)[0])

def score(bpm, phase):
    period = 60.0 / bpm
    t = np.arange(phase, dur, period)
    idx = np.round(t * fps_env).astype(int)
    idx = idx[idx < len(env)]
    return env[idx].mean()

best = (0, None, None)
for bpm in np.arange(126.0, 132.0, 0.01):
    period = 60.0 / bpm
    for phase in np.arange(0, period, 0.002):
        s = score(bpm, phase)
        if s > best[0]:
            best = (s, bpm, phase)
# refine
_, bpm, phase = best
for b2 in np.arange(bpm - 0.02, bpm + 0.02, 0.0005):
    period = 60.0 / b2
    for p2 in np.arange(max(0, phase - 0.01), phase + 0.01, 0.0005):
        s = score(b2, p2)
        if s > best[0]:
            best = (s, b2, p2)
_, bpm, phase = best
period = 60.0 / bpm
first = phase
while first - period >= -1e-6:
    first -= period
beats = np.arange(first, dur, period)
beats = beats[beats >= 0]

# per-beat RMS & bass to find drops / downbeat phase
S = np.abs(librosa.stft(y, n_fft=4096, hop_length=1024))
freqs = librosa.fft_frequencies(sr=sr, n_fft=4096)
bass_band = S[(freqs >= 20) & (freqs <= 150)].sum(0)
rms = librosa.feature.rms(S=S, frame_length=4096)[0]
times = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=1024)
def mean_between(arr, t0, t1):
    m = (times >= t0) & (times < t1)
    return arr[m].mean() if m.any() else 0.0
beat_rms = np.array([mean_between(rms, t, t + period) for t in beats])
beat_bass = np.array([mean_between(bass_band, t, t + period) for t in beats])

np.save("/tmp/beat_rms.npy", beat_rms)
print("raw librosa tempo", tempo0)
print("fitted bpm %.4f period %.5f first beat %.4f nbeats %d" % (bpm, period, first, len(beats)))
for i in range(0, len(beats), 4):
    print("%4d %7.3f  rms %.3f bass %.1f" % (i, beats[i], beat_rms[i:i+4].mean(), beat_bass[i:i+4].mean()))
json.dump({"bpm": bpm, "period": period, "first": first, "duration": dur,
           "beats": beats.tolist(), "beat_rms": beat_rms.tolist(), "beat_bass": beat_bass.tolist()},
          open("analysis/_beats_raw.json", "w"))
