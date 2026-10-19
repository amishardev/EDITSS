"""Tile JPEG stills into a labelled contact sheet. Usage: sheet.py <dir> <out.png> [cols]"""
import sys, glob, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(os.path.join(d, 'f*.jpg')))
tw, th = 270, 480
rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + 22)), 'white')
for i, f in enumerate(fs):
    im = Image.open(f).resize((tw, th))
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    S.paste(im, (x, y))
    ImageDraw.Draw(S).text((x + 4, y + th + 4), os.path.basename(f)[1:-4], fill='black')
S.save(out)
