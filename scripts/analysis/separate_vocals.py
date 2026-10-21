"""Split the master into vocals / accompaniment with the Spleeter 2-stem ONNX model (sherpa-onnx)."""
import sys
import numpy as np
import soundfile as sf
import sherpa_onnx as so

wav, model_dir, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
cfg = so.OfflineSourceSeparationConfig(
    model=so.OfflineSourceSeparationModelConfig(
        spleeter=so.OfflineSourceSeparationSpleeterModelConfig(
            vocals=f"{model_dir}/vocals.fp16.onnx",
            accompaniment=f"{model_dir}/accompaniment.fp16.onnx",
        ),
        num_threads=4,
    )
)
sep = so.OfflineSourceSeparation(cfg)
x, sr = sf.read(wav, dtype="float32", always_2d=True)
out = sep.process(sr, np.ascontiguousarray(x.T))
names = ["vocals", "accompaniment"]
for i, stem in enumerate(out.stems):
    data = np.array(stem.data)
    sf.write(f"{out_dir}/{names[i]}.wav", data.T, out.sample_rate)
    print(names[i], data.shape, out.sample_rate)
