"""Collect and prepare product-campaign assets into public/products/.

Usage: python3 -I prepare_products.py <dg-ads> <dgwebsiteimg> <brochure_img_dir> <out_dir>

Sources are never modified; prepared copies are written to <out_dir>.
- Packshots with transparency are copied as-is.
- The two protein-bar carton renders (white background) are cut out and
  cropped above their floor reflection.
- Mixed Seeds carton: the source render has a garbled net-weight line
  ("Net Weigi Seeds"). It is replaced with the identical "Net Weight: 40g"
  artwork from the Almond carton render (same layout, scale and font), which
  is what the real carton reads in the brochure photo. Nothing else is touched.
- Scene and real photos are copied as high-quality JPEGs.
"""
import os
import shutil
import sys

import cv2
import numpy as np
from PIL import Image

DGADS, WEB, BRO, OUT = sys.argv[1:5]
os.makedirs(OUT, exist_ok=True)


def save_jpg(src, name, max_side=None):
    im = Image.open(src).convert('RGB')
    if max_side and max(im.size) > max_side:
        im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(os.path.join(OUT, name), quality=93)


def carton_cutout(rgb):
    """Cut a carton from a white studio render; drop the floor reflection."""
    a = np.asarray(rgb).astype(np.int32)
    lum = a.mean(axis=2)
    # the carton's bottom edge is the darkest horizontal line near its base,
    # measured as the median across the carton width (print can't fool it)
    rowmed = np.median(lum[:, 250:1300], axis=1)
    bottom = 680 + int(np.argmin(rowmed[680:740]))
    fg = (a.min(axis=2) < 238).astype(np.uint8)
    fg[bottom + 1:] = 0
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    big = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    mask = (lab == big).astype(np.uint8)
    # fill holes (light print inside the carton) and soften the edge by 1px
    filled = mask.copy()
    ff = np.zeros((mask.shape[0] + 2, mask.shape[1] + 2), np.uint8)
    cv2.floodFill(filled, ff, (0, 0), 1)
    mask = mask | (1 - filled)
    alpha = cv2.GaussianBlur(mask.astype(np.float32), (3, 3), 0.7)
    ys, xs = np.where(mask)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    rgba = np.dstack([a.astype(np.uint8), (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
    return Image.fromarray(rgba, 'RGBA')


def fix_seeds_weight(seeds, almond):
    """Replace the garbled net-weight line on the Mixed Seeds render."""
    s = np.asarray(seeds).copy()
    al = np.asarray(almond)
    # 1) inpaint the garbled glyphs away
    gray = cv2.cvtColor(s, cv2.COLOR_RGB2GRAY)
    m = np.zeros(gray.shape, np.uint8)
    roi = gray[655:686, 225:410]
    m[655:686, 225:410] = (roi < 150).astype(np.uint8)
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    s = cv2.inpaint(s, m * 255, 4, cv2.INPAINT_TELEA)
    # 2) composite the clean almond artwork, same distance above the base edge
    patch = al[664:698, 226:430].astype(np.float32)
    lum = patch.mean(axis=2)
    alpha = np.clip((200 - lum) / 130, 0, 1)[..., None]
    ink = np.array([52, 52, 44], np.float32)
    dy, dx = -2, 2
    tgt = s[664 + dy:698 + dy, 226 + dx:430 + dx].astype(np.float32)
    s[664 + dy:698 + dy, 226 + dx:430 + dx] = (tgt * (1 - alpha) + ink * alpha).astype(np.uint8)
    return Image.fromarray(s)


# packshots (transparent originals, untouched)
PACK = {
    'pack-chana.png': (DGADS, 'ChatGPT Image Mar 6, 2026, 12_15_18 AM-Photoroom.png'),
    'pack-rajma.png': (DGADS, 'RAJMAJOR.png'),
    'pack-granola.png': (DGADS, 'WhatsApp Image 2026-03-01 at 12.14.15 AM-Photoroom.png'),
    'pack-tea.png': (DGADS, 'diegetiontea.png'),
    'pack-treat.png': (DGADS, '324t32t4erwt-removebg-preview.png'),
    'logo-dark.png': (DGADS, 'logo_transparet_dark.png'),
    'logo-white.png': (DGADS, 'logo_transparent_white.png'),
}
for name, (root, f) in PACK.items():
    shutil.copy(os.path.join(root, f), os.path.join(OUT, name))
# logos: crop the generous transparent padding so they can be sized precisely
for name in ('logo-dark.png', 'logo-white.png'):
    im = Image.open(os.path.join(OUT, name)).convert('RGBA')
    im.crop(im.split()[3].getbbox()).save(os.path.join(OUT, name), optimize=True)

seeds = Image.open(os.path.join(DGADS, ', 2026, 08_29_33 PM.png')).convert('RGB')
almond = Image.open(os.path.join(DGADS, '08_34_57 PM.png')).convert('RGB')
carton_cutout(fix_seeds_weight(seeds, almond)).save(os.path.join(OUT, 'pack-seeds.png'), optimize=True)
carton_cutout(almond).save(os.path.join(OUT, 'pack-almond.png'), optimize=True)

# real photos + brand scenes
JPG = {
    # The Wellness Treat
    'treat-real-open.jpg': (WEB, '234t34t.jpeg'),
    'treat-real-top.jpg': (WEB, 'ewrt34t32tafafdq3.jpeg'),
    'treat-real-closed.jpg': (WEB, 're.jpeg'),
    'treat-scene-gold.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_07_12 AM.png'),
    'treat-scene-candle.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_07_21 AM.png'),
    'treat-scene-marble.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_07_19 AM.png'),
    # Granola
    'granola-scene-kitchen.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_36_08 AM.png'),
    'granola-scene-scale.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_35_55 AM.png'),
    'granola-scene-bowl.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_35_58 AM.png'),
    'granola-scene-dusk.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_36_17 AM.png'),
    'granola-scene-sunlit.jpg': (BRO, 'im-001.png'),
    'granola-real.jpg': (WEB, '324t32t4erwt.jpeg'),
    # Chana / Rajma
    'chana-real-close.jpg': (WEB, 'WhatsApp Image 2026-02-24 at 8.01.37 PM.jpeg'),
    'chana-real-stand.jpg': (WEB, 'WhatsApp Image 2026-02-24 at 8ghjghj.01.38 PM.jpeg'),
    'jars-real-pair.jpg': (WEB, 'WhatsApp Image 2026-02-24 at 8.01.34 PM.jpeg'),
    'jars-real-pair2.jpg': (WEB, 'WhatsApp Image 2026-02-2oooo4 at 8.01.35 PM.jpeg'),
    'chana-scene-magnifier.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_42_06 AM.png'),
    'chana-scene-dark.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_42_11 AM.png'),
    'chana-scene-desk.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_42_19 AM.png'),
    'rajma-scene-ember.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_50_33 AM.png'),
    'rajma-scene-sparks.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_42_23 AM.png'),
    'rajma-scene-window.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_46_24 AM.png'),
    'rajma-scene-studio.jpg': (WEB, 'ChatGPT Image Mar 6, 2026, 01_46_19 AM.png'),
    # Bars / tea
    'bars-scene.jpg': (BRO, 'im-008.png'),
    'tea-scene.jpg': (BRO, 'im-009.png'),
    'tea-real.jpg': (WEB, 'ewrtewrtertewrterw.jpeg'),
    'marble.jpg': (BRO, 'im-000.png'),
}
for name, (root, f) in JPG.items():
    save_jpg(os.path.join(root, f), name)

for f in sorted(os.listdir(OUT)):
    im = Image.open(os.path.join(OUT, f))
    print(f'{f:28s} {im.size[0]}x{im.size[1]} {im.mode}')
