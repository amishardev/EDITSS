import {continueRender, delayRender, staticFile} from 'remotion';

const FONTS: [family: string, file: string, weight: string][] = [
  ['Sora', 'fonts/sora-latin-400-normal.woff2', '400'],
  ['Sora', 'fonts/sora-latin-600-normal.woff2', '600'],
  ['Sora', 'fonts/sora-latin-700-normal.woff2', '700'],
  ['Sora', 'fonts/sora-latin-800-normal.woff2', '800'],
  ['Poppins', 'fonts/poppins-latin-400-normal.woff2', '400'],
  ['Poppins', 'fonts/poppins-latin-500-normal.woff2', '500'],
  ['Poppins', 'fonts/poppins-latin-600-normal.woff2', '600'],
  ['Poppins', 'fonts/poppins-latin-700-normal.woff2', '700'],
];

let loaded = false;

/** Loads Sora + Poppins from /public so renders never depend on the network. */
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading brand fonts');
  Promise.all(
    FONTS.map(([family, file, weight]) =>
      new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight})
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
