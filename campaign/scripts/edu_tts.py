"""Voice for the education series, one file per segment so scenes follow the voice.

Usage:
  python3 -I scripts/edu_tts.py <kokoro_dir> [slug ...] [--voice hf_alpha] [--speed 1.05]

Engine: Kokoro-82M (Apache-2.0, runs locally, Hindi female voices hf_alpha / hf_beta).
To switch to ElevenLabs later, drop per-segment files with the same names into
public/edu/vo/<slug>/<i>.wav and re-run with --timings-only.

Writes public/edu/vo/<slug>/<i>.wav and src/edu/timings.json (frames at 30 fps).
"""
import json, math, os, sys
import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
PAD = 10  # matches PAD in src/edu/Edu.tsx
TAIL = 30  # extra hold on the CTA

args = sys.argv[1:]
voice = 'hf_alpha'
speed = 1.05
timings_only = False
if '--voice' in args:
    i = args.index('--voice'); voice = args[i + 1]; del args[i:i + 2]
if '--speed' in args:
    i = args.index('--speed'); speed = float(args[i + 1]); del args[i:i + 2]
if '--timings-only' in args:
    args.remove('--timings-only'); timings_only = True
kdir = args[0]
only = set(args[1:])

topics = json.load(open(os.path.join(ROOT, 'src/edu/topics.json')))
tpath = os.path.join(ROOT, 'src/edu/timings.json')
timings = json.load(open(tpath)) if os.path.exists(tpath) else {}

def trim(x, sr, thr=0.008):
    """Cut leading/trailing near-silence, keeping a few ms of air."""
    a = np.abs(x)
    idx = np.where(a > thr)[0]
    if not len(idx):
        return x
    s = max(0, idx[0] - int(0.03 * sr))
    e = min(len(x), idx[-1] + int(0.08 * sr))
    return x[s:e]

if not timings_only:
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(kdir, 'kokoro-v1.0.onnx'), os.path.join(kdir, 'voices-v1.0.bin'))

for t in topics:
    if only and t['slug'] not in only:
        continue
    d = os.path.join(ROOT, 'public/edu/vo', t['slug'])
    os.makedirs(d, exist_ok=True)
    segs, voice_frames = [], []
    for i, s in enumerate(t['segs']):
        p = os.path.join(d, f'{i}.wav')
        if not timings_only:
            audio, sr = k.create(s['vo'], voice=voice, speed=speed, lang='hi')
            audio = trim(np.asarray(audio, dtype=np.float32), sr)
            # gentle fades so cuts never click
            n = int(0.012 * sr)
            audio[:n] *= np.linspace(0, 1, n)
            audio[-n:] *= np.linspace(1, 0, n)
            sf.write(p, audio, sr, subtype='PCM_16')
        info = sf.info(p)
        vf = math.ceil(info.duration * FPS)
        voice_frames.append(vf)
        segs.append(vf + PAD)
    total = 4 + sum(segs) + TAIL
    timings[t['slug']] = dict(segs=segs, voice=voice_frames, total=total)
    print(f"{t['n']:02d} {t['slug']:24s} {total / FPS:5.1f}s  segs={[round(v / FPS, 1) for v in voice_frames]}")

json.dump(timings, open(tpath, 'w'), indent=1)
