"""Compose the original "IRA theme" and render one arrangement per ad.

Everything is synthesised here (no samples, no third-party music), so the
score is free to use anywhere. 128 BPM in D major: I-vi-IV-V (D Bm G A),
tabla bols, a sitar-like Karplus-Strong pluck, a kalimba hook, bass, pad.

Usage: python3 -I compose.py <out_dir>    -> <out_dir>/theme-ad0X.wav
Arrangements are in beats (1 beat = 14.0625 frames at 30 fps); hits, stings
and melody notes can also be placed on exact video frames.
"""
import os
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
BPM = 128
BEAT = 60 / BPM
FPS = 30
rng = np.random.default_rng(11)

def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def fr(frame):
    return frame / FPS

def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1.0) * np.exp(-t / d)

def lp(x, cutoff):
    k = 1 - np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([k], [1, -(1 - k)], x)

def hp(x, cutoff):
    return x - lp(x, cutoff)

def bp(x, lo, hi):
    return lp(hp(x, lo), hi)

# ---------------------------------------------------------------- instruments

def kalimba(f, dur=1.2, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * f * t) * env_ad(n, 0.002, 0.38)
    tine = 0.32 * np.sin(2 * np.pi * f * 5.4 * t) * env_ad(n, 0.001, 0.035)
    oct_ = 0.18 * np.sin(2 * np.pi * f * 2 * t) * env_ad(n, 0.002, 0.18)
    return vel * (body + tine + oct_)

def bell(f, dur=1.6, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    return vel * (np.sin(2 * np.pi * f * t) * env_ad(n, 0.002, 0.6)
                  + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * env_ad(n, 0.001, 0.25)
                  + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * env_ad(n, 0.001, 0.08))

def pluck(f, dur=1.4, vel=1.0, bright=0.6):
    """Karplus-Strong string with a little jawari-style buzz."""
    n = int(dur * SR)
    N = max(2, int(round(SR / f - 0.5)))
    exc = np.zeros(n)
    burst = rng.uniform(-1, 1, N)
    exc[:N] = lp(burst, 2000 + 9000 * bright)
    a = np.zeros(N + 2); a[0] = 1; a[N] = -0.4985; a[N + 1] = -0.4985
    y = lfilter([1.0], a, exc)
    buzz = np.tanh(y * 2.2) * 0.35
    return vel * (y + buzz) * env_ad(n, 0.001, dur * 0.6)

def pad_chord(notes, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.12, 0.0, 0.11):
            f = midi(m + det)
            s += 2 * ((t * f) % 1.0) - 1  # saw
    s = lp(lp(s, 1400), 1800)
    a = np.minimum(t / 0.35, 1.0) * np.minimum((dur - t) / 0.4, 1.0)
    return vel * s / (len(notes) * 3) * np.clip(a, 0, 1)

def piano(f, dur=2.0, vel=1.0):
    """Additive piano-like voice: stretched partials, faster decay up high, hammer."""
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 8):
        fk = f * k * (1 + 0.0004 * k * k)
        if fk > 12000:
            break
        s += (1 / k ** 1.25) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (0.9 + 0.55 * k))
    hammer = lp(rng.standard_normal(n), 3000) * env_ad(n, 0.0005, 0.006) * 0.15
    return vel * (s + hammer) * np.minimum(t / 0.004, 1)


def sub(f, dur=1.2, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    return vel * np.sin(2 * np.pi * f * t) * env_ad(n, 0.02, dur * 0.4)


def bass(f, dur=0.45, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return vel * s * env_ad(n, 0.004, dur * 0.55)

def kick(vel=1.0):
    n = int(0.42 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(n, 0.001, 0.16)
    click = rng.standard_normal(n) * env_ad(n, 0.0005, 0.003) * 0.3
    return vel * (s + click)

def clap(vel=1.0):
    n = int(0.3 * SR)
    nz = bp(rng.standard_normal(n), 900, 4200)
    e = np.zeros(n)
    for o in (0, 0.011, 0.022):
        i = int(o * SR); e[i:] += env_ad(n - i, 0.0005, 0.012)
    e += 0.5 * np.concatenate([np.zeros(int(0.022 * SR)), env_ad(n - int(0.022 * SR), 0.001, 0.07)])
    return vel * nz * e

def shaker(vel=1.0):
    n = int(0.06 * SR)
    return vel * hp(rng.standard_normal(n), 6000) * env_ad(n, 0.004, 0.018)

def tabla(bol, vel=1.0):
    n = int(0.6 * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    if bol in ('na', 'dha'):
        f = 590
        out += 0.8 * (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.02 * t) + 0.25 * np.sin(2 * np.pi * f * 3.01 * t)) * env_ad(n, 0.001, 0.1)
        out += 0.4 * bp(rng.standard_normal(n), 2000, 6000) * env_ad(n, 0.0005, 0.006)
    if bol == 'tin':
        f = 760
        out += 0.6 * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.9 * t)) * env_ad(n, 0.001, 0.09)
    if bol in ('ge', 'dha'):
        f = 92 + 60 * (1 - np.exp(-t * 9))  # the baya's pitch bend
        out += 1.1 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(n, 0.003, 0.22)
    return vel * out


def dhol(hit, vel=1.0):
    """Dhol: 'ge' is the deep dagga head (pitch drop), 'ti' the thin tilli slap."""
    n = int(0.5 * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    if hit == 'ge':
        f = 62 + 70 * np.exp(-t * 22)
        out += 1.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(n, 0.002, 0.2)
        out += 0.35 * lp(rng.standard_normal(n), 900) * env_ad(n, 0.0005, 0.02)
    else:
        out += 0.55 * (np.sin(2 * np.pi * 410 * t) + 0.6 * np.sin(2 * np.pi * 1130 * t)) * env_ad(n, 0.0005, 0.035)
        out += 0.5 * bp(rng.standard_normal(n), 1800, 7000) * env_ad(n, 0.0003, 0.012)
    return vel * out

def shehnai(f, dur=0.5, vel=1.0):
    """Nasal double-reed lead: bright harmonic stack, formant band, slow vibrato and a scoop into the note."""
    n = int(dur * SR); t = np.arange(n) / SR
    scoop = 1 - 0.03 * np.exp(-t * 30)
    vib = 1 + 0.008 * np.sin(2 * np.pi * 5.6 * t) * np.clip(t / 0.15, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * scoop * vib) / SR
    x = sum((1 / k) * np.sin(k * ph) for k in range(1, 12))
    x = bp(x, 700, 3600) + 0.3 * x
    return vel * 0.35 * x * env_ad(n, 0.03, dur * 0.9) * np.clip((dur - t) / 0.04, 0, 1)

def drone(root, dur, vel=1.0):
    """Tanpura-ish drone: root + fifth + octave, with a buzzy jawari shimmer."""
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for m, g in [(0, 1.0), (7, 0.6), (12, 0.7), (-12, 0.5)]:
        fq = midi(root + m)
        ph = 2 * np.pi * fq * t
        out += g * (np.sin(ph) + 0.4 * np.sin(2 * ph) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * t + m)) + 0.2 * np.sin(3 * ph))
    a = np.clip(t / 0.6, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    return vel * 0.12 * out * a

def noise_riser(dur, vel=1.0):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    chunks = 24
    out = np.zeros(n)
    for c in range(chunks):
        a, b = c * n // chunks, (c + 1) * n // chunks
        cut = 300 + 7000 * ((c + 1) / chunks) ** 2
        out[a:b] = lp(x[a:b], cut)
    t = np.arange(n) / n
    tone = 0.25 * np.sin(2 * np.pi * np.cumsum(300 + 900 * t ** 2) / SR)
    return vel * (out + tone) * t ** 2

def cymbal(dur=2.4, vel=1.0):
    n = int(dur * SR)
    return vel * hp(rng.standard_normal(n), 5000) * env_ad(n, 0.002, 0.6) * 0.5

# ---------------------------------------------------------------- music data

CHORDS = [  # (pad notes, bass root, pluck chord tones)
    ([62, 66, 69], 38, [62, 66, 69, 74]),   # D
    ([59, 62, 66], 35, [59, 62, 66, 71]),   # Bm
    ([55, 59, 62], 43, [55, 59, 62, 67]),   # G
    ([57, 61, 64], 45, [57, 61, 64, 69]),   # A
]
CHORDS_MINOR = [  # Bm G D A
    ([59, 62, 66], 35, [59, 62, 66, 71]),
    ([55, 59, 62], 43, [55, 59, 62, 67]),
    ([62, 66, 69], 38, [62, 66, 69, 74]),
    ([57, 61, 64], 45, [57, 61, 64, 69]),
]
HOOK = [  # kalimba hook, 8th notes per bar (None = rest)
    [81, None, 78, 81, 83, None, 81, 78],
    [76, None, 74, 76, 78, None, None, None],
    [81, None, 78, 81, 83, None, 86, 83],
    [81, None, 78, None, 76, None, 74, None],
]
SITAR = [62, 66, 69, 71, 69, 66, 64, 66]
TABLA16 = {0: 'dha', 2: 'na', 3: 'na', 4: 'tin', 6: 'na', 8: 'dha', 10: 'ge', 11: 'na', 12: 'tin', 14: 'na', 15: 'na'}
DHOL16 = {0: 'ge', 2: 'ti', 3: 'ge', 4: 'ti', 6: 'ge', 7: 'ti', 8: 'ge', 10: 'ti', 11: 'ge', 12: 'ti', 14: 'ti', 15: 'ti'}
# shehnai phrase per bar (16ths -> (midi, length in 16ths)); D major pentatonic, festive
SHEHNAI = [
    {0: (74, 3), 3: (76, 1), 4: (78, 4), 8: (81, 2), 10: (78, 2), 12: (76, 4)},
    {0: (74, 2), 2: (76, 2), 4: (78, 2), 6: (76, 2), 8: (74, 6), 14: (71, 2)},
    {0: (78, 3), 3: (81, 1), 4: (83, 4), 8: (81, 2), 10: (78, 2), 12: (81, 4)},
    {0: (78, 2), 2: (76, 2), 4: (74, 4), 8: (76, 2), 10: (74, 6)},
]
TABLA_LIGHT = {0: 'dha', 3: 'na', 6: 'na', 8: 'ge', 11: 'na', 14: 'tin'}

# layers per section kind
KINDS = {
    'calm':    {'pad': .55, 'arp': .5},
    'curious': {'pad': .3, 'sitar': .55, 'shaker': .35, 'tabla_light': .5},
    'intro':   {'pad': .35, 'sitar': .6, 'shaker': .45, 'tabla_light': .7, 'bass': .5},
    'light':   {'pad': .45, 'hook': .55, 'shaker': .45, 'tabla': .65, 'bass': .7, 'clap': .35},
    'groove':  {'pad': .4, 'hook': .7, 'shaker': .55, 'tabla': .75, 'bass': .85, 'clap': .6, 'kick': .9, 'pluck': .45},
    'drop':    {'pad': .45, 'hook': .8, 'bell': .35, 'shaker': .6, 'tabla': .8, 'bass': .95, 'clap': .7, 'kick': 1.0, 'pluck': .5},
    'build':   {'pad': .35, 'shaker': .5, 'roll': .8, 'bass': .5, 'sitar': .45},
    'outro':   {'pad': .5, 'hook': .45, 'shaker': .25, 'tabla_light': .35},
    'stop':    {},
    # premium product-film moods
    'luxe':    {'pad': .55, 'piano_slow': .55, 'sub': .6, 'bell_sparse': .3},
    'luxe_pulse': {'pad': .5, 'piano_arp': .45, 'sub': .7, 'kick_soft': .55, 'shaker': .25, 'bell_sparse': .25},
    'velvet':  {'pad': .45, 'piano_arp': .5, 'sub': .6, 'kick_soft': .6, 'clap': .25, 'shaker': .3},
    'zen':     {'pad': .6, 'piano_slow': .45, 'bell_sparse': .35},
    'morning': {'pad': .35, 'piano_arp': .6, 'shaker': .4, 'clap': .3, 'bass': .55, 'kick_soft': .5},
    'spice':   {'pad': .3, 'sitar': .55, 'tabla': .85, 'shaker': .6, 'bass': .9, 'clap': .6, 'kick': .95, 'pluck': .4},
    'ember':   {'pad': .5, 'sitar': .45, 'tabla_light': .7, 'bass': .8, 'kick_soft': .7, 'sub': .5},
    'tick':    {'tick16': .5, 'bass': .8, 'kick': .85, 'clap': .45, 'pluck': .5, 'pad': .3},
    'calm_tick': {'tick16': .45, 'pad': .3, 'sub': .4},
    # education series: a calm, steady bed that sits under a voice
    'edu_bed': {'pad': .45, 'piano_arp': .32, 'sub': .45, 'kick_soft': .35, 'shaker': .14},
    'edu_intro': {'pad': .5, 'piano_slow': .35, 'sub': .35, 'bell_sparse': .2},
    # festive (Dussehra) moods
    'diya':    {'drone': .7, 'pad': .35, 'bell_sparse': .35},
    'mela':    {'drone': .4, 'shehnai': .6, 'tabla_light': .6, 'shaker': .3, 'pad': .25},
    'fest':    {'pad': .3, 'shehnai': .75, 'dhol': .9, 'bass': .85, 'clap': .55, 'shaker': .5, 'kick': .8},
    'fest_build': {'drone': .4, 'dhol_roll': .9, 'bass': .5, 'pad': .3},
}

# ---------------------------------------------------------------- arrangements
# sections: (start_beat, kind). Extras in frames: stings, stabs, notes, risers.
ARR = {
    'ad01': dict(frames=600, sections=[(0, 'intro'), (8, 'drop'), (33, 'stop'), (34, 'outro')],
                 risers=[(76, 112)], stings=[478], stabs=[]),
    'ad02': dict(frames=570, sections=[(0, 'curious'), (11, 'groove'), (33, 'stop'), (33, 'outro')],
                 risers=[(118, 155)], stings=[464], stabs=[]),
    'ad03': dict(frames=600, sections=[(0, 'calm'), (8, 'light'), (31.5, 'stop'), (34, 'outro')],
                 risers=[(446, 476)], stings=[478], stabs=[]),
    'ad04': dict(frames=570, sections=[(0, 'intro'), (8, 'drop'), (29.75, 'stop'), (34, 'outro')],
                 risers=[], stings=[472], stabs=[420, 434, 448]),
    'ad05': dict(frames=600, sections=[(0, 'calm'), (14, 'light'), (24, 'groove'), (36, 'stop'), (36.1, 'outro')],
                 risers=[(470, 506)], stings=[508], stabs=[]),
    'ad06': dict(frames=600, sections=[(0, 'build'), (8, 'drop'), (30, 'stop'), (30.2, 'outro')],
                 risers=[(60, 112), (390, 424)], stings=[424], stabs=[]),
    # hero ad: every IRA landing plays a note of the hook
    'ad07': dict(frames=660, sections=[(0, 'curious'), (4, 'intro'), (8, 'drop'), (21, 'light'), (30, 'groove'), (34, 'build'), (38, 'stop'), (38.05, 'outro')],
                 risers=[(486, 534)], stings=[534], stabs=[],
                 notes=[(140.6, 74), (168.75, 78), (196.9, 81), (225, 83), (253.1, 86), (281.25, 90),
                        (337.5, 81), (421.9, 81), (435.9, 83), (450, 86), (464.1, 88)]),
    'ad08': dict(frames=600, sections=[(0, 'curious'), (4, 'light'), (8, 'groove'), (33.1, 'stop'), (34, 'outro')],
                 risers=[(440, 474)], stings=[478], stabs=[0]),
    'ad09': dict(frames=600, sections=[(0, 'calm'), (6, 'light'), (25, 'groove'), (33.5, 'stop'), (34, 'outro')],
                 risers=[(446, 476)], stings=[476], stabs=[],
                 notes=[(372, 81), (392, 83), (412, 86), (432, 88)]),
    'ad10': dict(frames=570, sections=[(0, 'intro'), (2, 'groove'), (20, 'drop'), (29.9, 'build'), (32.4, 'stop'), (32.6, 'outro')],
                 risers=[], stings=[458], stabs=[]),
    'ad11': dict(frames=600, sections=[(0, 'intro'), (2, 'drop'), (26, 'groove'), (36.3, 'stop'), (36.4, 'outro')],
                 risers=[(330, 364)], stings=[513], stabs=[56, 168, 280]),
    # ---- product films ----
    'p01': dict(frames=540, transpose=2, sections=[(0, 'intro'), (2, 'spice'), (21.3, 'build'), (24, 'spice'), (37.4, 'stop'), (37.5, 'outro')],
                risers=[(126, 155)], stings=[155, 440], stabs=[0]),
    'p02': dict(frames=540, minor=True, sections=[(0, 'curious'), (3.4, 'ember'), (37.5, 'stop'), (37.6, 'outro')],
                risers=[(146, 176)], stings=[176, 464], stabs=[30]),
    'p03': dict(frames=600, sections=[(0, 'zen'), (2.8, 'morning'), (41.5, 'stop'), (41.6, 'outro')],
                risers=[(127, 155)], stings=[155, 496], stabs=[]),
    'p04': dict(frames=540, transpose=-2, sections=[(0, 'calm_tick'), (8, 'tick'), (37.4, 'stop'), (37.5, 'outro')],
                risers=[(84, 112)], stings=[112, 450], stabs=[]),
    'p05': dict(frames=540, minor=True, transpose=-3, sections=[(0, 'luxe'), (10.67, 'velvet'), (37.4, 'stop'), (37.5, 'outro')],
                risers=[(124, 156)], stings=[156, 450], stabs=[]),
    'p06': dict(frames=600, sections=[(0, 'tick'), (3.7, 'zen'), (11.4, 'luxe'), (42.2, 'stop'), (42.3, 'outro')],
                risers=[], stings=[], stabs=[], notes=[(52, 86), (160, 86), (336, 81), (496, 86)]),
    'p07': dict(frames=810, transpose=-2, sections=[(0, 'luxe'), (14.6, 'luxe_pulse'), (23.9, 'velvet'), (37.7, 'luxe_pulse'), (46.2, 'luxe'), (57.0, 'stop'), (57.1, 'outro')],
                risers=[(176, 206), (610, 650)], stings=[206, 650], stabs=[],
                notes=[(380, 81), (396, 83), (412, 86), (428, 88), (446, 90)]),
    # ---- education series beds (long; each video fades out where it ends) ----
    'edu1': dict(frames=1800, sections=[(0, 'edu_intro'), (4, 'edu_bed'), (112, 'stop')], risers=[], stings=[], stabs=[]),
    'edu2': dict(frames=1800, minor=True, transpose=-2, sections=[(0, 'edu_intro'), (4, 'edu_bed'), (112, 'stop')], risers=[], stings=[], stabs=[]),
    # ---- Dussehra ----
    # app film: mela -> dhol build as IRA arrives -> full fest; every arrow hit rings a note; sting on the burn
    'd01': dict(frames=660, sections=[(0, 'mela'), (13.5, 'fest_build'), (16.8, 'fest'), (37.75, 'stop'), (37.85, 'fest'), (41.9, 'outro')],
                risers=[(500, 532)], stings=[532], stabs=[0, 236],
                notes=[(276, 74), (338, 78), (400, 81), (462, 86), (506, 86), (512, 88), (518, 90)]),
    # gift film: tanpura + diya, mela as the stage is dressed, fest on the reveal, mela for IRA's gift, fest to close
    'd02': dict(frames=750, sections=[(0, 'diya'), (5.7, 'mela'), (14.65, 'fest'), (35.55, 'mela'), (44.1, 'fest'), (52.6, 'stop')],
                risers=[(176, 206), (590, 620)], stings=[206, 620], stabs=[],
                notes=[(374, 74), (390, 76), (406, 78), (422, 81), (440, 83)]),
}

# ---------------------------------------------------------------- render

def add(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]; i = 0
    tail = min(len(x), int(0.008 * SR))
    if tail > 1:
        # every note ends at zero: no clicks when its buffer stops
        x = x.copy(); x[-tail:] *= np.linspace(1, 0, tail)
    j = min(len(buf), i + len(x))
    buf[i:j] += gain * x[: j - i]

def reverb(x, mix=1.0):
    combs = [(1687, .80), (1601, .79), (2053, .78), (2251, .77)]
    y = np.zeros_like(x)
    for d, g in combs:
        a = np.zeros(d + 1); a[0] = 1; a[d] = -g
        y += lfilter([1.0], a, x)
    for d, g in [(556, .6), (441, .6)]:
        b = np.zeros(d + 1); b[0] = -g; b[d] = 1
        a = np.zeros(d + 1); a[0] = 1; a[d] = -g
        y = lfilter(b, a, y)
    return lp(y * 0.18, 6000) * mix

def render(name, spec):
    dur = spec['frames'] / FPS
    n = int((dur + 0.1) * SR)
    dry = np.zeros(n); wet = np.zeros(n); side = np.zeros(n)
    sections = spec['sections']
    total_beats = dur / BEAT

    def kind_at(beat):
        k = 'stop'
        for s, kk in sections:
            if beat >= s:
                k = kk
        return k

    for step in range(int(total_beats * 4) + 1):
        beat = step / 4
        t = beat * BEAT
        k = kind_at(beat)
        L = KINDS[k]
        bar = int(beat // 4)
        s16 = step % 16
        prog_chords = CHORDS_MINOR if spec.get('minor') else CHORDS
        tr = spec.get('transpose', 0)
        c0 = prog_chords[bar % 4]
        chord = ([m + tr for m in c0[0]], c0[1] + tr, [m + tr for m in c0[2]])
        if 'pad' in L and s16 == 0:
            stop_b = next((s for s, kk in sections if s > beat), total_beats)
            span = min(4, stop_b - beat) * BEAT
            if span > 0.2:
                x = pad_chord(chord[0], span + 0.3, L['pad']); add(dry, x, t, .5); add(wet, x, t, .5)
        if 'drone' in L and s16 == 0 and bar % 2 == 0:
            stop_b = next((s for s, kk in sections if s > beat), total_beats)
            span = min(8, stop_b - beat) * BEAT
            if span > 0.3:
                x = drone(50 + tr, span + 0.2, L['drone']); add(dry, x, t, .5); add(wet, x, t, .35)
        if 'dhol' in L and s16 in DHOL16:
            hit = DHOL16[s16]
            x = dhol(hit, L['dhol'] * (1 if s16 % 4 == 0 else .75)); add(dry, x, t, .5 if hit == 'ge' else .35); add(wet, x, t, .1)
        if 'dhol_roll' in L:
            nxt = next((s for s, kk in sections if s > beat), total_beats)
            prog_ = 1 - min(1, (nxt - beat) / 8)
            dens = 1 if prog_ > 0.5 else (2 if prog_ > 0.25 else 4)
            if s16 % dens == 0:
                x = dhol('ge' if s16 % 4 == 0 else 'ti', L['dhol_roll'] * (0.5 + 0.5 * prog_)); add(dry, x, t, .45)
        if 'shehnai' in L and s16 in SHEHNAI[bar % 4]:
            m, ln = SHEHNAI[bar % 4][s16]
            x = shehnai(midi(m + tr), ln * BEAT / 4 + 0.05, L['shehnai']); add(dry, x, t, .5); add(wet, x, t, .35)
        if 'piano_slow' in L and s16 in (0, 8):
            for j, m in enumerate(chord[2][:3] if s16 == 0 else chord[2][1:]):
                x = piano(midi(m + 12), 3.0, L['piano_slow'] * (0.8 if j else 1)); add(dry, x, t + j * 0.045, .22); add(wet, x, t + j * 0.045, .35)
        if 'piano_arp' in L and s16 % 2 == 0:
            m = chord[2][(s16 // 2) % 4] + 12 + (12 if (s16 // 2) % 8 >= 4 else 0)
            x = piano(midi(m), 1.6, L['piano_arp'] * (1 if s16 % 4 == 0 else .7)); add(dry, x, t, .2); add(wet, x, t, .3)
        if 'sub' in L and s16 == 0:
            add(dry, sub(midi(chord[1] - 12 if chord[1] > 40 else chord[1]), BEAT * 3.5, L['sub']), t, .5)
        if 'bell_sparse' in L and s16 == 6 and bar % 2 == 1:
            x = bell(midi(chord[2][2] + 24), 2.0, L['bell_sparse']); add(dry, x, t, .1); add(wet, x, t, .3)
        if 'kick_soft' in L and s16 in (0, 8):
            add(dry, kick(L['kick_soft'] * .7), t, .6); add(side, np.linspace(.6, 0, int(.18 * SR)), t)
        if 'tick16' in L:
            add(dry, tabla('tin', L['tick16'] * (1 if s16 % 4 == 0 else .45)) * 0.6, t, .3)
        if 'kick' in L and s16 in (0, 10):
            add(dry, kick(L['kick']), t, .9); add(side, np.ones(int(.18 * SR)) * np.linspace(1, 0, int(.18 * SR)), t)
        if 'clap' in L and s16 in (4, 12):
            x = clap(L['clap']); add(dry, x, t, .5); add(wet, x, t, .25)
        if 'shaker' in L:
            acc = 1.0 if s16 % 2 else 0.55
            add(dry, shaker(L['shaker'] * acc), t + rng.uniform(0, .004), .35)
        if 'tabla' in L and s16 in TABLA16:
            x = tabla(TABLA16[s16], L['tabla'] * (1 if s16 % 4 == 0 else .75)); add(dry, x, t, .45); add(wet, x, t, .12)
        if 'tabla_light' in L and s16 in TABLA_LIGHT:
            x = tabla(TABLA_LIGHT[s16], L['tabla_light']); add(dry, x, t, .4); add(wet, x, t, .15)
        if 'bass' in L and s16 in (0, 6, 8, 14):
            root = chord[1] + (7 if s16 == 14 else 0)
            add(dry, bass(midi(root), .42 if s16 != 6 else .25, L['bass']), t, .45)
        if 'pluck' in L and s16 in (2, 6, 10, 14):
            m = chord[2][(s16 // 4) % 4]
            x = pluck(midi(m + 12), .6, L['pluck'], .5); add(dry, x, t, .22); add(wet, x, t, .2)
        if 'sitar' in L and s16 % 2 == 0:
            m = SITAR[(s16 // 2) % 8] + spec.get('transpose', 0)
            x = pluck(midi(m), 1.0, L['sitar'] * (1 if s16 % 8 == 0 else .7), .8); add(dry, x, t, .3); add(wet, x, t, .25)
        if 'hook' in L and s16 % 2 == 0:
            m = HOOK[bar % 4][s16 // 2]
            if m:
                m += spec.get('transpose', 0)
                x = kalimba(midi(m), 1.0, L['hook']); add(dry, x, t, .3); add(wet, x, t, .3)
                if 'bell' in L:
                    x = bell(midi(m + 12), 1.0, L['bell']); add(dry, x, t, .12); add(wet, x, t, .2)
        if 'arp' in L and s16 % 4 == 0:
            m = chord[2][(s16 // 4) % 4] + 24
            x = kalimba(midi(m), 1.4, L['arp'] * .8); add(dry, x, t, .25); add(wet, x, t, .4)
        if 'roll' in L:
            # tabla roll that gets denser toward the next section
            nxt = next((s for s, kk in sections if s > beat), total_beats)
            prog_ = 1 - min(1, (nxt - beat) / 8)
            dens = 1 if prog_ > 0.5 else (2 if prog_ > 0.25 else 4)
            if s16 % dens == 0:
                bol = 'na' if s16 % 4 else 'dha'
                x = tabla(bol, L['roll'] * (0.5 + 0.5 * prog_)); add(dry, x, t, .45); add(wet, x, t, .12)

    for a, b in spec.get('risers', []):
        x = noise_riser(fr(b - a)); add(dry, x, fr(a), .35); add(wet, x, fr(a), .2)
        # snare-like tabla fill on the last beat
        for i in range(8):
            add(dry, tabla('na', .4 + i * .08), fr(b) - BEAT + i * BEAT / 8, .35)
    for s in spec.get('stings', []):
        t = fr(s)
        add(dry, kick(1.0), t, .9); add(side, np.linspace(1, 0, int(.3 * SR)), t)
        x = pad_chord([50, 62, 66, 69, 74], 3.2, 1.0); add(dry, x, t, .55); add(wet, x, t, .6)
        for i, m in enumerate([74, 78, 81, 86, 90]):
            x = kalimba(midi(m), 1.6, .8); add(dry, x, t + i * 0.06, .28); add(wet, x, t + i * 0.06, .4)
        x = bell(midi(86), 2.4, .7); add(dry, x, t, .2); add(wet, x, t, .4)
        x = cymbal(2.6, .8); add(dry, x, t, .3); add(wet, x, t, .3)
        add(dry, bass(midi(38), 1.6, 1.0), t, .6)
    for s in spec.get('stabs', []):
        t = fr(s)
        add(dry, kick(1.0), t, .9); add(side, np.linspace(1, 0, int(.2 * SR)), t)
        x = pad_chord([62, 66, 69, 74], .5, 1.2) * env_ad(int(.8 * SR), .001, .12)[: int(.5 * SR)]
        add(dry, x, t, .7); add(wet, x, t, .4)
        add(dry, tabla('dha', 1.0), t, .5)
    for frm, m in spec.get('notes', []):
        t = fr(frm)
        x = kalimba(midi(m), 1.4, 1.1); add(dry, x, t, .42); add(wet, x, t, .45)
        x = bell(midi(m + 12), 1.2, .6); add(dry, x, t, .14); add(wet, x, t, .25)

    duck = 1 - 0.45 * np.clip(lp(side, 30), 0, 1)
    mix = dry * duck + reverb(wet) * duck
    mix = hp(mix, 28)
    mix = mix / (np.max(np.abs(mix)) + 1e-9)
    mix = np.tanh(mix * 1.6) / np.tanh(1.6) * 0.89
    fade = int(0.6 * SR)
    end = int(dur * SR)
    mix = mix[:end]
    mix[-fade:] *= np.linspace(1, 0, fade) ** 2
    st = np.stack([mix, mix], 1)
    # gentle stereo width from the reverb's decorrelated copy
    st[:, 1] = mix * 0.92 + np.roll(mix, 37) * 0.08
    return st

def save(path, st):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())

if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    only = sys.argv[2:] or list(ARR)
    for name in only:
        save(os.path.join(out, f'theme-{name}.wav'), render(name, ARR[name]))
        print('wrote', name)
