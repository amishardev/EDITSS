import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { continueRender, delayRender } from "remotion";

export const F = {
  sans: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif",
  serif: "'Instrument Serif', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// Canvas text needs the faces loaded before the first draw.
if (typeof document !== "undefined") {
  const handle = delayRender("Loading fonts");
  Promise.all([
    document.fonts.load(`700 40px 'Archivo Variable'`),
    document.fonts.load(`300 40px 'Archivo Variable'`),
    document.fonts.load(`400 40px 'Instrument Serif'`),
    document.fonts.load(`italic 400 40px 'Instrument Serif'`),
    document.fonts.load(`400 40px 'JetBrains Mono'`),
    document.fonts.load(`500 40px 'JetBrains Mono'`),
  ])
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
