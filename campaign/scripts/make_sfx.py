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
# ---- product campaign ----------------------------------------------------

def bursts(d, count, dur_each, lo, hi, decay, seed_amp=1.0, spread=None):
    out = np.zeros(int(SR * d))
    for i in range(count):
        o = int(rng.uniform(0, (spread or d) - dur_each) * SR)
        n = int(dur_each * SR)
        b = lowpass(rng.standard_normal(n), hi) - lowpass(rng.standard_normal(n), lo) * 0.3
        out[o:o + n] += b * env(n, 0.0005, decay) * rng.uniform(0.4, 1.0) * seed_amp
    return out

# crunch: a dense cluster of short bright fractures plus a low body knock
d = 0.42
c = bursts(d, 26, 0.05, 300, 6500, 0.012, spread=0.16)
x = t(d)
c += 0.5 * np.sin(2*np.pi*np.cumsum(180*np.exp(-x*20)+70)/SR) * env(len(x), .001, .03)
save("crunch", c, 0.8)

# crackle: sparse ember pops over a soft roar
d = 2.0
cr = bursts(d, 40, 0.01, 1000, 7000, 0.002)
cr += 0.08 * lowpass(rng.standard_normal(int(SR*d)), 500)
save("crackle", cr * np.sin(np.pi*t(d)/d)**0.5, 0.45)

# pour: granola falling into a bowl, many tiny ticks thinning out
d = 1.6
po = np.zeros(int(SR*d))
for i in range(260):
    tt = rng.uniform(0, d) ** 1.4 / d ** 0.4
    o = int(min(tt, d - 0.02) * SR); n = int(0.012 * SR)
    f0 = rng.uniform(1500, 4500)
    po[o:o+n] += np.sin(2*np.pi*f0*t(0.012)) * env(n, 0.0003, 0.002) * rng.uniform(0.2, 1)
save("pour", po * np.minimum(1, (d - t(d)) * 2.5), 0.45)

# crinkle: wrapper tear
d = 0.7
ck = bursts(d, 70, 0.02, 2500, 9000, 0.004)
save("crinkle", ck * np.sin(np.pi*t(d)/d)**0.4, 0.5)

# steam: soft breathy hiss swell
d = 2.4; x = t(d)
st_ = lowpass(rng.standard_normal(len(x)), 2600) - lowpass(rng.standard_normal(len(x)), 600)
save("steam", st_ * np.sin(np.pi*x/d)**1.5, 0.3)

# lid: cardboard lid sliding off, then a soft settle thump
d = 1.0; x = t(d)
lid = lowpass(rng.standard_normal(len(x)), 900 + 600*np.sin(np.pi*x/0.7).clip(0)) * np.sin(np.pi*np.clip(x/0.7, 0, 1))
th = np.zeros(len(x)); o = int(0.72*SR); xx = x[:len(x)-o]
th[o:] = np.sin(2*np.pi*np.cumsum(90*np.exp(-xx*15)+45)/SR) * env(len(xx), .002, .08)
save("lid", lid * 0.6 + th, 0.6)

# shimmer: long airy gold glint (high bell cluster with slow attack)
d = 2.4; x = t(d); sh = np.zeros(len(x))
for i, f0 in enumerate([2093, 2637, 3136, 3951, 4186, 5274]):
    sh += np.sin(2*np.pi*f0*x + i) * np.minimum(x/0.5, 1) * np.exp(-x/0.9) * (0.6 + 0.4*np.sin(2*np.pi*(3+i)*x))
save("shimmer", sh, 0.3)

# clock: mechanical tick
x = t(0.06)
save("clock", (np.sin(2*np.pi*3200*x) * env(len(x), .0002, .004) + 0.6*lowpass(rng.standard_normal(len(x)), 5000) * env(len(x), .0002, .002)), 0.4)

# ---- Dussehra --------------------------------------------------------------

# arrow: a tight airy swish with a falling doppler whistle, then a dull thunk
d = 0.6; x = t(d)
sw = lowpass(rng.standard_normal(len(x)), 3000 + 3000*np.exp(-x*8)) * np.exp(-((x-0.14)/0.09)**2)
wh = np.sin(2*np.pi*np.cumsum(2600*np.exp(-x*4)+700)/SR) * np.exp(-((x-0.14)/0.07)**2) * 0.25
th = np.zeros(len(x)); o = int(0.3*SR); xx = x[:len(x)-o]
th[o:] = np.sin(2*np.pi*np.cumsum(160*np.exp(-xx*25)+60)/SR) * env(len(xx), .001, .05) + 0.4*lowpass(rng.standard_normal(len(xx)), 1500) * env(len(xx), .0005, .01)
save("arrow", sw + wh + th, 0.7)

# firework: rising launch whistle, a bang, then a long sparkle crackle
d = 2.6; x = t(d)
fw = np.zeros(len(x))
li = x < 0.55
fw[li] = 0.3 * np.sin(2*np.pi*np.cumsum(900 + 1800*x[li])/SR) * (x[li]/0.55)
o = int(0.58*SR); xx = x[:len(x)-o]
fw[o:] += lowpass(rng.standard_normal(len(xx)), 1200*np.exp(-xx*6)+80) * env(len(xx), .001, .25) * 1.4
cr = bursts(d - 0.6, 90, 0.008, 2000, 9000, 0.0015) * np.exp(-np.arange(int(SR*(d-0.6)))/SR/0.8)
fw[int(0.6*SR):int(0.6*SR)+len(cr)] += cr * 0.8
save("firework", fw, 0.75)

# fire: an ignition whoomp swelling into a roar
d = 2.2; x = t(d)
roar = lowpass(rng.standard_normal(len(x)), 300 + 1600*np.clip(x/0.35, 0, 1)) * np.minimum(x/0.12, 1) * np.exp(-x/1.4)
roar += 0.6*np.sin(2*np.pi*np.cumsum(55+40*np.exp(-x*6))/SR) * env(len(x), .02, .4)
roar += bursts(d, 30, 0.01, 1200, 7000, 0.002) * 0.6
save("fire", roar, 0.75)

# match: scratch then a soft flare
d = 0.9; x = t(d)
mt = bursts(0.2, 40, 0.006, 3000, 9000, 0.002, spread=0.18)
mt = np.concatenate([mt, np.zeros(len(x)-len(mt))])
mt += lowpass(rng.standard_normal(len(x)), 900) * np.clip((x-0.15)/0.08, 0, 1) * np.exp(-(x-0.15).clip(0)/0.3) * 0.7
save("match", mt, 0.55)

print("ok")
