"""Pull embedded photos, stickers and the logo out of the design PDF.

Usage: python3 -I extract_images.py <pdfimages_dir> <ira_png> <public_dir>
<pdfimages_dir> is the output of `pdfimages -png design.pdf im`.
Photos are upscaled with Lanczos + light unsharp (source tops out at 900px).
"""
import os, sys, shutil
from PIL import Image, ImageFilter

SRC, IRA, PUB = sys.argv[1:4]

def load(n, alpha=None):
    im = Image.open(os.path.join(SRC, f"im-{n}.png")).convert("RGB")
    if alpha:
        im.putalpha(Image.open(os.path.join(SRC, f"im-{alpha}.png")).convert("L"))
    return im

def up(im, target_w):
    if im.width >= target_w:
        return im
    h = round(im.height * target_w / im.width)
    im = im.resize((target_w, h), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))

PHOTOS = {  # name: (index, upscale width)
    "roti-paneer": ("001", 1080),      # roti + paneer masala + sabzi (scanner/story photo)
    "roti-paneer-wide": ("000", 1472),
    "pancakes": ("430", 1260),
    "label-pack": ("432", 1080),       # nutrition facts on a chips pack
    "label-hand": ("436", 1494),
    "ira-thali": ("402", 1080),        # welcome screen hero render
    "ira-dumbbell": ("443", 1080),     # profile hero render
    "ira-jump": ("448", 1080),         # streak celebration render
    "ira-dal-chawal": ("451", 1080),   # dark welcome render
}
STICKERS = {  # story sticker poses used by the Share-to-Story overlay
    "flame": ("152", "153"), "wave": ("199", "200"), "medal": ("209", "210"),
    "trophy": ("365", "366"), "crown": ("375", "376"),
}

os.makedirs(f"{PUB}/photos", exist_ok=True)
os.makedirs(f"{PUB}/ira", exist_ok=True)
os.makedirs(f"{PUB}/brand", exist_ok=True)
for name, (n, w) in PHOTOS.items():
    up(load(n), w).save(f"{PUB}/photos/{name}.jpg", quality=93)
for name, (n, a) in STICKERS.items():
    load(n, a).save(f"{PUB}/ira/sticker-{name}.png", optimize=True)
load("403", "404").save(f"{PUB}/brand/logo.png", optimize=True)
load("452", "453").save(f"{PUB}/brand/logo-light.png", optimize=True)
load("471", "472").save(f"{PUB}/brand/ira-avatar.png", optimize=True)
Image.open(IRA).convert("RGBA").save(f"{PUB}/ira/ira.png", optimize=True)
print("ok")
