// Render many stills with one bundle + one browser.
// usage: node scripts/stills.mjs <jobs.json> <outDir> [scale]
// jobs.json: [{ "name": "x", "comp": "Gen", "props": {...}, "frame": 0 }, ...]
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [jobsFile, outDir, scaleArg] = process.argv.slice(2);
const jobs = JSON.parse(fs.readFileSync(jobsFile, "utf8"));
const scale = Number(scaleArg ?? 0.5);
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", {
  browserExecutable: process.env.REMOTION_BROWSER ?? null,
});

for (const job of jobs) {
  const comp = await selectComposition({ serveUrl, id: job.comp ?? "Gen", inputProps: job.props, puppeteerInstance: browser });
  const props = { ...comp.defaultProps, ...job.props };
  const out = path.join(outDir, `${job.name}.png`);
  await renderStill({
    composition: comp,
    serveUrl,
    output: out,
    frame: job.frame ?? 0,
    inputProps: props,
    scale,
    puppeteerInstance: browser,
    overwrite: true,
  });
  console.log("still", out);
}
await browser.close({ silent: true });
