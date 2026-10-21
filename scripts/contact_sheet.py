"""Turn rendered shot stills (PNG) into visual-board/stills/*.jpg and visual-board/contact-sheet.jpg."""
import glob, json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1]
clips = {c["id"]: c for c in json.load(open(os.path.join(ROOT, "visual-board/clips.json")))["clips"]}
os.makedirs(os.path.join(ROOT, "visual-board/stills"), exist_ok=True)
thumbs = []
for f in sorted(glob.glob(os.path.join(src, "S*.png"))):
    sid = os.path.basename(f)[:-4]
    im = Image.open(f).convert("RGB")
    im.resize((360, 640)).save(os.path.join(ROOT, "visual-board/stills", f"{sid}.jpg"), quality=82)
    thumbs.append((sid, im.resize((180, 320))))
cols = 14
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * 180, rows * 346), (8, 8, 10))
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype(os.path.join(ROOT, "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff"), 14)
except Exception:
    font = ImageFont.load_default()
for i, (sid, t) in enumerate(thumbs):
    x, y = (i % cols) * 180, (i // cols) * 346
    sheet.paste(t, (x, y))
    d.text((x + 6, y + 324), f"{sid} {clips[sid]['title'][:20]}", fill=(220, 210, 190), font=font)
sheet.save(os.path.join(ROOT, "visual-board/contact-sheet.jpg"), quality=85)
print(len(thumbs), "stills")
