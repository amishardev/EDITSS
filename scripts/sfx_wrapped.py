"""Subtle cinematic sound design for the Wrapped artist message video.

Everything is built from filtered noise and pitch-swept thumps: no notes, no
chords, nothing a music detector can match. Cue times follow the cuts in
NO_AUDIO_MESSAGE.mp4 (found with a frame-difference pass).

usage: python3 scripts/sfx_wrapped.py out.wav [duration_seconds]
"""
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
rng = np.random.default_rng(7)
out_path = sys.argv[1]
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 19.125
N = int(DUR * SR)
mix = np.zeros((N, 2))


def noise(sec, color='white'):
    n = rng.standard_normal(int(sec * SR))
    if color == 'brown':
        n = np.cumsum(n)
        n -= np.convolve(n, np.ones(4800) / 4800, 'same')  # remove the random-walk drift
    return n / (np.abs(n).max() + 1e-9)


def filt(x, kind, f, order=2):
    return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)


def env(n, attack, release, shape=2.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1) ** shape
    r = np.clip((t[-1] - t) / max(release, 1e-4), 0, 1) ** shape
    return a * r


def place(sig, at, gain=1.0, pan=0.0):
    """Adds a mono or stereo signal at `at` seconds, equal-power panned."""
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l, sig * r], 1) * np.sqrt(2)
    i = int(at * SR)
    j = min(N, i + len(sig))
    if j > i:
        mix[i:j] += sig[: j - i] * gain


def reverb(sig, sec=2.5, wet=0.35):
    ir_n = int(sec * SR)
    decay = np.exp(-np.arange(ir_n) / SR * (6.9 / sec))
    ir = np.stack([filt(rng.standard_normal(ir_n), 'lp', 6000) * decay for _ in range(2)], 1)
    ir /= np.sqrt((ir**2).sum(0))
    mono = sig if sig.ndim == 1 else sig.mean(1)
    tail = np.stack([fftconvolve(mono, ir[:, c]) for c in range(2)], 1)
    dry = np.zeros_like(tail)
    dry[: len(mono)] = np.stack([mono, mono], 1) if sig.ndim == 1 else sig
    return dry * (1 - wet) + tail * wet


def whoosh(sec, f0, f1, peak=0.6):
    """Band-passed noise whose centre sweeps f0 -> f1, swelling towards `peak`."""
    n = int(sec * SR)
    x = noise(sec + 0.2)
    out = np.zeros(n + 2048)
    win, hop, pre = 2048, 512, 4096
    w = np.hanning(win)
    for k in range(0, n, hop):
        fc = f0 * (f1 / f0) ** (k / n)
        seg = x[max(0, k - pre) : k + win]
        y = filt(seg, 'bp', [fc * 0.7, min(fc * 1.4, SR / 2 - 100)])[-win:]
        out[k : k + len(y)] += y * w[: len(y)] * (hop / (win / 2))
    out = out[:n]
    t = np.linspace(0, 1, n)
    shape = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.5)
    return out * shape


def thump(sec=1.6, f0=70, f1=32):
    """Soft low impact: a pitch-dropping sine body plus a short noise transient."""
    n = int(sec * SR)
    t = np.arange(n) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 3.2)
    click = filt(noise(0.05), 'lp', 2500) * np.exp(-np.arange(int(0.05 * SR)) / SR * 80)
    body[: len(click)] += click * 0.35
    return body


def ticks(start, end, times, gain):
    """Tiny digital ticks for the glitchy flicker sections."""
    for t in times:
        if start <= t <= end:
            c = filt(noise(0.012), 'hp', 3500) * np.hanning(int(0.012 * SR))
            place(c, t, gain * rng.uniform(0.5, 1), pan=rng.uniform(-0.6, 0.6))


# ---- bed: dark air + low rumble, breathing with the picture ----
air = filt(noise(DUR, 'brown'), 'lp', 700)
air = filt(air, 'hp', 40)
air /= np.abs(air).max()
lfo = 0.75 + 0.25 * np.sin(2 * np.pi * np.arange(N) / SR / 6.0)
bed_env = np.interp(np.arange(N) / SR, [0, 2.5, 14.6, 15.0, 15.9, 17.1, DUR - 1.4, DUR], [0, 1, 1, 0.25, 0.6, 0.8, 0.7, 0])
place(np.stack([air * lfo * bed_env, np.roll(air, 2400) * lfo * bed_env], 1), 0, 0.10)

rumble = filt(noise(DUR), 'lp', 55, order=4)
rumble /= np.abs(rumble).max()
place(rumble * bed_env, 0, 0.18)

# ---- water: soft lapping for the shoreline shots (open and close) ----
def water(sec):
    x = filt(noise(sec), 'bp', [300, 1800])
    lap = np.clip(np.sin(2 * np.pi * np.arange(len(x)) / SR * 0.55 + rng.uniform(0, 6)), 0, 1) ** 3
    lap = np.convolve(lap, np.ones(2400) / 2400, 'same')
    return x * (0.25 + lap) * env(len(x), 1.2, 1.2)

place(reverb(water(4.6), 1.8, 0.4), 0.0, 0.05)
place(reverb(water(DUR - 17.0), 1.8, 0.4), 17.0, 0.05)

# ---- whooshes into and on the cuts ----
place(reverb(whoosh(1.6, 300, 4000, 0.92), 2.0, 0.35), 4.25 - 1.45, 0.16)  # rise into first light
for t, g, pan in [(5.08, 0.09, -0.4), (5.88, 0.08, 0.4), (6.38, 0.08, -0.2), (8.92, 0.09, 0.3), (9.62, 0.09, -0.3), (11.75, 0.08, 0.2)]:
    place(reverb(whoosh(0.7, 2500, 500, 0.3), 1.5, 0.35), t - 0.2, g, pan)

# ---- risers into the two big flashes ----
place(reverb(whoosh(2.2, 200, 6000, 0.97), 1.5, 0.3), 12.71 - 2.15, 0.12)
place(reverb(whoosh(0.9, 400, 7000, 0.95), 1.2, 0.3), 14.62 - 0.85, 0.10)

# ---- soft impacts on the big moments ----
for t, g in [(4.25, 0.18), (7.54, 0.22), (12.71, 0.26), (14.62, 0.30)]:
    place(reverb(thump(), 2.8, 0.45), t, g)

# ---- glitch ticks during the flicker passages ----
flicker = [10.33, 10.54, 10.58, 10.71, 10.83, 10.88, 11.38, 13.04, 13.08, 13.42, 13.46, 13.75, 13.79, 13.92,
           14.0, 14.12, 14.17, 14.29, 14.33, 14.38, 14.58]
ticks(10.3, 14.6, flicker, 0.05)

# ---- "2027" title: a deep, slow bloom with a high air shimmer ----
place(reverb(thump(3.0, 50, 26), 4.0, 0.55), 15.92, 0.24)
shimmer = filt(noise(3.2), 'hp', 6000) * env(int(3.2 * SR), 0.05, 3.0, 1.5)
place(reverb(shimmer, 3.5, 0.7), 15.92, 0.035)

# ---- last card: a gentle air pass ----
place(reverb(whoosh(1.4, 1800, 300, 0.4), 2.5, 0.45), 17.12 - 0.3, 0.07)

# master: gentle fade at the very end, peak -3 dBFS
fade = np.interp(np.arange(N) / SR, [0, 0.05, DUR - 1.2, DUR], [0, 1, 1, 0])
mix *= fade[:, None]
mix *= 10 ** (-3 / 20) / (np.abs(mix).max() + 1e-9)
wavfile.write(out_path, SR, (mix * 32767).astype(np.int16))
print('wrote', out_path, f'{DUR:.2f}s')
