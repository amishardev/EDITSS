"""Cut the 3x3 IRA emote sheet into nine transparent PNGs.

Usage: python3 -I extract_emotes.py <sheet.png|webp> <out_dir>
Uses the sheet's own alpha when it has one (dropping faint haze); otherwise
the background is near-white pixels connected to the border (so the white
eye highlights inside IRA stay opaque). Each character is the largest blob
between valley cuts near the grid lines, cropped to its bounding box.
"""
import os
import sys

import cv2
import numpy as np
from PIL import Image

NAMES = ['wave', 'thinking', 'celebrate', 'thumbsup', 'surprised', 'present', 'phone', 'eating', 'shrug']

sheet, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
src_im = Image.open(sheet)
rgba_src = np.asarray(src_im.convert('RGBA'))
rgb = rgba_src[..., :3]
H, W = rgb.shape[:2]

if src_im.mode == 'RGBA' and rgba_src[..., 3].min() < 250:
    # the sheet already has transparency: trust it, but drop the faint haze
    src_alpha = rgba_src[..., 3]
    fg = (src_alpha >= 128).astype(np.uint8)
else:
    # flat white background: near-white pixels connected to the border
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    white = ((rgb.min(axis=2) > 225) & (hsv[..., 1] < 30)).astype(np.uint8)
    n, lab = cv2.connectedComponents(white, connectivity=4)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = (~np.isin(lab, list(border))).astype(np.uint8)
    src_alpha = cv2.GaussianBlur((fg * 255).astype(np.uint8), (3, 3), 0.8)
fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
alpha_full = src_alpha

# Cell edges are not the exact thirds: neighbours can overlap by a few pixels
# (a toe meets an ear tip). Each boundary moves to the "valley", the line
# near the grid line with the fewest character pixels, measured only across
# the span of the cells it separates.
M = 90

def valley(profile, centre):
    lo, hi = max(1, centre - M), min(len(profile) - 1, centre + M)
    return lo + int(np.argmin(profile[lo:hi]))

for i, name in enumerate(NAMES):
    r, c = divmod(i, 3)
    gx0, gx1 = c * W // 3, (c + 1) * W // 3
    gy0, gy1 = r * H // 3, (r + 1) * H // 3
    cols = fg[:, gx0:gx1].sum(axis=1)
    rows = fg[gy0:gy1, :].sum(axis=0)
    y0 = 0 if r == 0 else valley(cols, gy0)
    y1 = H if r == 2 else valley(cols, gy1)
    x0 = 0 if c == 0 else valley(rows, gx0)
    x1 = W if c == 2 else valley(rows, gx1)
    win = fg[y0:y1, x0:x1]
    k, cl, stats, _ = cv2.connectedComponentsWithStats(win, connectivity=8)
    best = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    keep = (cl == best).astype(np.uint8)
    ys, xs = np.where(keep)
    pad = 6
    by0, by1 = max(0, ys.min() - pad), min(win.shape[0], ys.max() + pad + 1)
    bx0, bx1 = max(0, xs.min() - pad), min(win.shape[1], xs.max() + pad + 1)
    a = alpha_full[y0:y1, x0:x1].copy()
    a[~cv2.dilate(keep, np.ones((5, 5), np.uint8)).astype(bool)] = 0
    a[a < 40] = 0
    rgba = np.dstack([rgb[y0:y1, x0:x1], a])[by0:by1, bx0:bx1]
    Image.fromarray(rgba, 'RGBA').save(os.path.join(out, f'emote-{name}.png'), optimize=True)
    print(name, rgba.shape[1], 'x', rgba.shape[0], f'cut y {y0}-{y1}')
