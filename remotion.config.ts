import fs from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// Cloud sandboxes cannot reach Remotion's Chrome download host, so use the
// preinstalled Playwright headless shell when it exists (override with
// REMOTION_BROWSER_EXECUTABLE).
const localShell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = process.env.REMOTION_BROWSER_EXECUTABLE ?? (fs.existsSync(localShell) ? localShell : null);
if (browser) Config.setBrowserExecutable(browser);
