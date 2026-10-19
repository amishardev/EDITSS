// Render selected frames of a composition into out/stills/<id>/ for QA.
// Usage: node scripts/stills.mjs <CompositionId> <frame,frame,...> [bundleDir]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, framesArg, prebuilt] = process.argv.slice(2);
const frames = framesArg.split(',').map(Number);
const serveUrl = prebuilt ?? (await bundle({entryPoint: path.resolve('src/index.ts')}));
const browser = await openBrowser('chrome', {browserExecutable: process.env.REMOTION_BROWSER ?? null});
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, browserExecutable: process.env.REMOTION_BROWSER ?? null});
const dir = path.resolve('out/stills', id);
fs.mkdirSync(dir, {recursive: true});
for (const frame of frames) {
  await renderStill({composition, serveUrl, frame, browserExecutable: process.env.REMOTION_BROWSER ?? null, output: path.join(dir, `f${String(frame).padStart(4, '0')}.jpg`), imageFormat: 'jpeg', jpegQuality: 85, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log('stills ->', dir);
