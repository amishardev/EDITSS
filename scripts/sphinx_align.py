import sys, re, json, numpy as np, soundfile as sf
from pocketsphinx import Decoder
wav, t0, t1, first, last = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
lines = open("analysis/lyrics_source.txt").read().strip().split("\n")[first:last]
def norm(w):
    w = w.lower().replace("'cause", "cause").replace("goin", "going")
    return re.sub(r"[^a-z']", "", w)
words = [norm(w) for l in lines for w in l.split()]
y, sr = sf.read(wav); seg = y[int(t0*sr):int(t1*sr)]
pcm = (seg * 32767).astype(np.int16).tobytes()
d = Decoder(samprate=16000, bestpath=False, dict="analysis/_lyrics.dict")
d.set_align_text(" ".join(words))
d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
out = []
for w in d.seg():
    if w.word in ("<s>", "</s>", "<sil>") or w.word.startswith("[") or w.word.startswith("+"): continue
    out.append({"w": re.sub(r"\(\d+\)$", "", w.word), "s": round(t0 + w.start_frame / 100, 3), "e": round(t0 + (w.end_frame + 1) / 100, 3)})
print(len(words), "expected", len(out), "aligned")
for o in out: print("%7.2f %7.2f %s" % (o["s"], o["e"], o["w"]))
json.dump(out, open(sys.argv[6], "w"))
