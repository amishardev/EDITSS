"""Contact strip per rendered Reel -> reels/previews/<ID>.jpg (6 frames, one per shot where possible)."""
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
reels = json.load(open(os.path.join(ROOT, "reels/reels.json")))
os.makedirs(os.path.join(ROOT, "reels/previews"), exist_ok=True)
for r in reels:
    src = os.path.join(ROOT, "out/reels", f"{r['composition']}.mp4")
    if not os.path.exists(src):
        continue
    total = int(r["duration_s"] * FPS)
    # middle of each shot, then pad with evenly spaced frames
    picks = []
    order = r["shot_order"]
    for i, s in enumerate(order):
        a = round(s["reel_time"] * FPS)
        b = round(order[i + 1]["reel_time"] * FPS) if i + 1 < len(order) else total
        picks.append((a + b) // 2)
    picks = sorted(set(picks))
    while len(picks) < 6:
        picks = sorted(set(picks + [int(total * (k + 0.5) / 6) for k in range(6)]))[:6]
    if len(picks) > 6:
        step = len(picks) / 6
        picks = [picks[int(k * step)] for k in range(6)]
    sel = "+".join(f"eq(n\\,{p})" for p in picks)
    out = os.path.join(ROOT, "reels/previews", f"{r['id']}.jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"select='{sel}',scale=240:-1,tile=6x1", "-frames:v", "1", "-q:v", "4", out], check=True)
    print(out)
