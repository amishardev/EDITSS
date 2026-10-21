"""Find sung phrases in the vocal stem and transcribe each with Whisper (sherpa-onnx) to align lyric lines."""
import sys, json
import numpy as np
import soundfile as sf
import librosa
import sherpa_onnx as so

voc_path, wdir, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
y, sr = sf.read(voc_path, dtype="float32", always_2d=True)
y = y.mean(axis=1)
y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
hop = 800  # 50 ms
rms = librosa.feature.rms(y=y16, frame_length=1600, hop_length=hop)[0]
db = 20 * np.log10(rms + 1e-9)
db_s = np.convolve(db, np.ones(3) / 3, mode="same")
thr = np.percentile(db_s, 95) - 22
act = db_s > thr
t = np.arange(len(act)) * hop / 16000

segs, start = [], None
for i, a in enumerate(act):
    if a and start is None:
        start = i
    if not a and start is not None:
        segs.append([t[start], t[i]]); start = None
if start is not None:
    segs.append([t[start], t[-1]])
merged = []
for s in segs:
    if merged and s[0] - merged[-1][1] < 0.45:
        merged[-1][1] = s[1]
    else:
        merged.append(list(s))
merged = [s for s in merged if s[1] - s[0] > 0.3]

rec = so.OfflineRecognizer.from_whisper(
    encoder=f"{wdir}/small.en-encoder.int8.onnx",
    decoder=f"{wdir}/small.en-decoder.int8.onnx",
    tokens=f"{wdir}/small.en-tokens.txt",
    language="en", task="transcribe", num_threads=4,
)
res = []
for a, b in merged:
    s0, s1 = max(0, int((a - 0.25) * 16000)), int((b + 0.25) * 16000)
    st = rec.create_stream()
    st.accept_waveform(16000, y16[s0:s1])
    rec.decode_stream(st)
    txt = st.result.text.strip()
    peak = float(db_s[(t >= a) & (t <= b)].max())
    res.append({"start": round(a, 2), "end": round(b, 2), "peak_db": round(peak, 1), "text": txt})
    print(f"{a:7.2f}-{b:7.2f} ({b-a:5.2f}s) pk={peak:6.1f}  {txt}")
json.dump({"threshold_db": float(thr), "phrases": res}, open(out_json, "w"), indent=1)
