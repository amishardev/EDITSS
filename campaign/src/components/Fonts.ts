import {continueRender, delayRender, staticFile} from 'remotion';

const DEVA = 'U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF';

const FONTS: [family: string, file: string, weight: string, range?: string][] = [
  ['Sora', 'fonts/sora-latin-200-normal.woff2', '200'],
  ['Sora', 'fonts/sora-latin-300-normal.woff2', '300'],
  ['Sora', 'fonts/sora-latin-400-normal.woff2', '400'],
  ['Sora', 'fonts/sora-latin-600-normal.woff2', '600'],
  ['Sora', 'fonts/sora-latin-700-normal.woff2', '700'],
  ['Sora', 'fonts/sora-latin-800-normal.woff2', '800'],
  ['Poppins', 'fonts/poppins-latin-400-normal.woff2', '400'],
  ['Poppins', 'fonts/poppins-latin-500-normal.woff2', '500'],
  ['Poppins', 'fonts/poppins-latin-600-normal.woff2', '600'],
  ['Poppins', 'fonts/poppins-latin-700-normal.woff2', '700'],
  // Fraunces: the editorial serif for the education series
  ['Fraunces', 'fonts/fraunces-latin-300-normal.woff2', '300'],
  ['Fraunces', 'fonts/fraunces-latin-400-normal.woff2', '400'],
  ['Fraunces', 'fonts/fraunces-latin-600-normal.woff2', '600'],
  ['FrauncesItalic', 'fonts/fraunces-latin-400-italic.woff2', '400'],
  ['FrauncesItalic', 'fonts/fraunces-latin-600-italic.woff2', '600'],
  // Devanagari glyphs for the festive films (same family, so Hindi falls in naturally)
  ['Poppins', 'fonts/poppins-devanagari-300-normal.woff2', '300', DEVA],
  ['Poppins', 'fonts/poppins-devanagari-500-normal.woff2', '500', DEVA],
  ['Poppins', 'fonts/poppins-devanagari-600-normal.woff2', '600', DEVA],
];

let loaded = false;

/** Loads Sora + Poppins from /public so renders never depend on the network. */
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading brand fonts');
  Promise.all(
    FONTS.map(([family, file, weight, range]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, range ? {weight, unicodeRange: range} : {weight})
        .load()
        .then((ff) => document.fonts.add(ff)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
