import json, sys
from faster_whisper import WhisperModel
src, model_name, out = sys.argv[1], sys.argv[2], sys.argv[3]
m = WhisperModel(model_name, device="cpu", compute_type="int8", cpu_threads=4)
segs, info = m.transcribe(src, language="en", word_timestamps=True, vad_filter=False,
                          beam_size=5, condition_on_previous_text=False,
                          initial_prompt="Moving my feet to the beat of a drum. If I took it alive, I promise to say it in the moonlight. Out of sight, out of mind.")
words = []
for s in segs:
    print("%.2f-%.2f %s" % (s.start, s.end, s.text), flush=True)
    for w in s.words:
        words.append({"w": w.word.strip(), "s": w.start, "e": w.end, "p": w.probability})
json.dump(words, open(out, "w"), indent=0)
