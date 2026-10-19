"""Rasterize real Dietary Guide screens from the v2 design PDF.

Boxes are in 100dpi page pixels (detected from phone bezels / story cards).
Usage: python3 -I extract_screens.py <design.pdf> <out_dir>
"""
import subprocess, sys, os
import numpy as np
from PIL import Image

PDF, OUT = sys.argv[1], sys.argv[2]
DPI = 600
K = DPI / 100

# name: (x, y, w, h, kind) ; kind 'phone' -> strip bezel, 'card' -> keep as-is
BOXES = {
    "share-sheet":     (32, 82, 285, 601, "phone"),
    "story-editor":    (353, 82, 285, 601, "phone"),
    "meal-share":      (32, 1779, 285, 600, "phone"),
    "welcome":         (32, 3882, 285, 601, "phone"),
    "goal":            (32, 5200, 285, 601, "phone"),
    "diet":            (353, 5200, 285, 601, "phone"),
    "home":            (32, 8504, 285, 737, "phone"),
    "scanner-food":    (353, 8504, 285, 600, "phone"),
    "scanner-label":   (32, 9302, 285, 600, "phone"),
    "meal-result":     (353, 9302, 285, 695, "phone"),
    "label-result":    (32, 10058, 285, 737, "phone"),
    "chat":            (353, 10058, 285, 601, "phone"),
    "streak":          (32, 11800, 285, 600, "phone"),
    "story-meal":      (39, 751, 250, 445, "card"),
    "story-gym":       (339, 751, 250, 445, "card"),
    "story-30":        (39, 1271, 250, 445, "card"),
    "story-thali":     (39, 2448, 250, 445, "card"),
    "ms-7":            (39, 2963, 125, 222, "card"),
    "ms-30":           (175, 2963, 125, 222, "card"),
    "ms-100":          (311, 2963, 125, 222, "card"),
    "ms-365":          (447, 2963, 125, 222, "card"),
}

os.makedirs(OUT, exist_ok=True)
for name, (x, y, w, h, kind) in BOXES.items():
    tmp = os.path.join(OUT, f"_{name}")
    subprocess.run(["pdftoppm", "-r", str(DPI), "-png", "-singlefile",
                    "-x", str(int(x * K)), "-y", str(int(y * K)),
                    "-W", str(int(w * K)), "-H", str(int(h * K)), PDF, tmp], check=True)
    im = Image.open(tmp + ".png").convert("RGB")
    os.remove(tmp + ".png")
    if kind == "phone":
        a = np.asarray(im).astype(int).max(axis=2)
        H, W = a.shape
        row, col = a[H // 2], a[:, W // 2]
        l = next(i for i in range(W) if row[i] > 45 and row[i + 3] > 45)
        r = W - next(i for i in range(W) if row[W - 1 - i] > 45 and row[W - 4 - i] > 45)
        t = next(i for i in range(H) if col[i] > 45 and col[i + 3] > 45)
        b = H - next(i for i in range(H) if col[H - 1 - i] > 45 and col[H - 4 - i] > 45)
        im = im.crop((l, t, r, b))
    im.save(os.path.join(OUT, f"{name}.png"), optimize=True)
    print(name, im.size)
