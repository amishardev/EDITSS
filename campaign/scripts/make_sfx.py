"""Synthesize the campaign's UI sound effects (original, no third-party samples).

Usage: python3 -I make_sfx.py <out_dir>
"""
import sys, os, wave
import numpy as np

SR = 48000
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def t(d):
    return np.arange(int(SR * d)) / SR

def env(n, a=0.002, d=0.1):
    x = np.arange(n) / SR
    return np.minimum(x / a, 1) * np.exp(-x / d)

def lowpass(x, cutoff):
    # one-pole, cutoff may be an array (sweeps)
    c = np.broadcast_to(cutoff, x.shape)
    k = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s += k[i] * (x[i] - s); y[i] = s
    return y

def save(name, x, gain=0.8):
    x = x / (np.abs(x).max() + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

# soft UI tap: short pitched body + tiny click
x = t(0.09)
save("tap", np.sin(2*np.pi*1650*x) * env(len(x), .001, .018) + 0.4*np.sin(2*np.pi*420*x) * env(len(x), .001, .03), 0.55)

# typing tick (chat)
x = t(0.04)
save("tick", np.sin(2*np.pi*2400*x) * env(len(x), .0005, .006) + 0.2*rng.standard_normal(len(x)) * env(len(x), .0005, .003), 0.35)

# whoosh: noise through a rising/falling lowpass sweep
d = 0.55; x = t(d); n = rng.standard_normal(len(x))
sweep = 300 + 5200 * np.sin(np.pi * x / d) ** 2
w = lowpass(n, sweep) * np.sin(np.pi * x / d) ** 1.5
save("whoosh", w, 0.6)

# quick swish (shorter, brighter) for fast cuts
d = 0.28; x = t(d); n = rng.standard_normal(len(x))
w = lowpass(n, 1200 + 7000 * (x / d)) * np.sin(np.pi * x / d) ** 2
save("swish", w, 0.5)

# IRA pop: bubbly pitch drop
x = t(0.22); f = 900 * np.exp(-x * 14) + 380
save("pop", np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(x), .002, .07), 0.6)

# reveal chime: two soft bell partials (major sixth)
x = t(1.4)
bell = sum(a*np.sin(2*np.pi*f*x) * env(len(x), .003, dd) for f, a, dd in
           [(1046.5, 1, .5), (1760, .55, .35), (2093, .25, .22), (523.25, .4, .7)])
save("chime", bell, 0.5)

# success / log: rising two-note
x = t(0.6); half = len(x)//2
a = np.sin(2*np.pi*784*x) * env(len(x), .002, .12)
b = np.zeros_like(x); xb = x[:len(x)-int(.09*SR)]
b[int(.09*SR):] = np.sin(2*np.pi*1175*xb) * env(len(xb), .002, .25)
save("success", a*0.7 + b, 0.55)

# scan: filtered sweep with shimmer
d = 1.6; x = t(d)
f = 600 + 900 * (x / d)
tone = np.sin(2*np.pi*np.cumsum(f)/SR) * (0.6 + 0.4*np.sin(2*np.pi*14*x))
hiss = lowpass(rng.standard_normal(len(x)), 4000) * 0.25
save("scan", (tone*0.5 + hiss) * np.sin(np.pi * x / d) ** 0.7, 0.4)

# soft impact: sub thump + body
x = t(0.7); f = 110*np.exp(-x*9) + 42
thump = np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(x), .002, .22)
save("impact", thump + 0.15*lowpass(rng.standard_normal(len(x)), 900)*env(len(x), .001, .04), 0.85)

# riser into reveals
d = 1.2; x = t(d)
r = lowpass(rng.standard_normal(len(x)), 400 + 6000*(x/d)**2) * (x/d)**2
save("riser", r, 0.5)

# sparkle: tiny high bell cluster for milestones / logo
x = t(0.9); sp = np.zeros_like(x)
for i, f in enumerate([2637, 3136, 3951, 4699]):
    o = int(i*0.06*SR); xs = x[:len(x)-o]
    sp[o:] += np.sin(2*np.pi*f*xs) * env(len(xs), .001, .15)
save("sparkle", sp, 0.35)
print("ok")
