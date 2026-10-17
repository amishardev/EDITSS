import React from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Reel} from './components/Reel';
import {FPS, HEIGHT, WIDTH} from './lib/timeline';
import {reels} from './reels';
import type {ReelSpec} from './lib/types';

const fonts: [string, string, string][] = [
  ['Inter', 'inter-latin-300-normal.woff2', '300'],
  ['Inter', 'inter-latin-500-normal.woff2', '500'],
  ['Inter', 'inter-latin-700-normal.woff2', '700'],
  ['JetBrains Mono', 'jetbrains-mono-latin-400-normal.woff2', '400'],
  ['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', '500'],
];
const handle = delayRender('Loading fonts');
Promise.all(fonts.map(([family, file, weight]) => loadFont({family, url: staticFile(`fonts/${file}`), weight}))).then(() =>
  continueRender(handle),
);

const ReelComp: React.FC<{spec: ReelSpec}> = ({spec}) => <Reel spec={spec} />;

export const Root: React.FC = () => (
  <>
    {reels.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.id}
        component={ReelComp}
        defaultProps={{spec}}
        durationInFrames={Math.round(spec.segments.reduce((a, s) => a + s.dur, 0) * FPS)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
