"""Verify rendered ads and build a contact sheet from the actual MP4 files.

Usage: python3 -I scripts/qa.py <out_dir>
Checks: resolution, fps, codecs, duration, near-black frames, loudness.
Writes <out_dir>/contact-sheet.jpg (or $SHEET) (6 frames per ad, read from the MP4s).
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

OUT = sys.argv[1]
ADS = sys.argv[2:] or ["ad-01-plate", "ad-02-label-scan", "ad-03-ask-ira", "ad-04-indian-food", "ad-05-small-habits", "ad-06-brand-intro", "ad-07-ira-hop", "ad-08-personal", "ad-09-metrics", "ad-10-story", "ad-11-genz-rate"]
POINTS = [0.05, 0.2, 0.4, 0.6, 0.8, 0.97]
TW, TH = 216, 384


def run(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    return r.stdout + r.stderr


def frame_at(path, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", path, "-frames:v", "1", "-vf", f"scale={TW}:{TH}",
                          "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return Image.frombytes("RGB", (TW, TH), raw)


sheet = Image.new("RGB", (TW * len(POINTS) + 170, (TH + 8) * len(ADS)), "white")
ok = True
for row, name in enumerate(ADS):
    path = os.path.join(OUT, name + ".mp4")
    if not os.path.exists(path):
        print(f"MISSING {path}"); ok = False; continue
    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path], capture_output=True, text=True).stdout)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    fps = v["r_frame_rate"]
    black = run("ffmpeg", "-v", "info", "-i", path, "-vf", "blackdetect=d=0.1:pix_th=0.06", "-an", "-f", "null", "-").count("black_start")
    loud = run("ffmpeg", "-i", path, "-af", "ebur128", "-vn", "-f", "null", "-")
    lufs = next((l.split("I:")[1].strip() for l in loud.splitlines()[::-1] if l.strip().startswith("I:")), "?")
    good = v["width"] == 1080 and v["height"] == 1920 and fps == "30/1" and v["codec_name"] == "h264" and v.get("pix_fmt") == "yuv420p" and a and a["codec_name"] == "aac" and 15 <= dur <= 25 and black == 0
    ok &= bool(good)
    print(f"{'OK ' if good else 'BAD'} {name}: {v['width']}x{v['height']} {fps}fps {v['codec_name']}/{v.get('pix_fmt')} "
          f"audio={a['codec_name'] if a else None} {dur:.2f}s frames={v.get('nb_frames')} black_segments={black} loudness={lufs} "
          f"size={os.path.getsize(path) / 1e6:.1f}MB")
    y = row * (TH + 8)
    ImageDraw.Draw(sheet).text((8, y + TH // 2), name, fill="black")
    for i, p in enumerate(POINTS):
        sheet.paste(frame_at(path, p * dur), (170 + i * TW, y))
sheet.save(os.path.join(OUT, os.environ.get("SHEET", "contact-sheet.jpg")), quality=88)
print("ALL OK" if ok else "PROBLEMS FOUND")
