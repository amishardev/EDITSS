// Render Reels with one bundle.
// usage: node scripts/render.mjs [R01 R09 ...]   (no args = all Reels)
// env:   REMOTION_BROWSER=/path/to/chrome-headless-shell  (optional)
//        CONCURRENCY=4  OUT=out/reels  SCALE=1
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const wanted = process.argv.slice(2).map((s) => s.toUpperCase());
const outDir = process.env.OUT ?? "out/reels";
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const comps = (await getCompositions(serveUrl, { browserExecutable })).filter((c) => /^R\d\d-/.test(c.id));

for (const comp of comps) {
  if (wanted.length && !wanted.some((w) => comp.id.startsWith(w))) continue;
  const out = path.join(outDir, `${comp.id}.mp4`);
  const t0 = Date.now();
  await renderMedia({
    composition: comp,
    serveUrl,
    codec: "h264",
    outputLocation: out,
    inputProps: comp.defaultProps,
    browserExecutable,
    timeoutInMilliseconds: 60000,
    concurrency: Number(process.env.CONCURRENCY ?? 4),
    scale: Number(process.env.SCALE ?? 1),
    crf: 18,
    audioBitrate: "320k",
    imageFormat: "jpeg",
    jpegQuality: 92,
  });
  console.log(`rendered ${out} (${comp.durationInFrames} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
