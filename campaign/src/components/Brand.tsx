import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {BRAND, src} from '../assets';
import {C, clamp, ease, F, spr} from '../theme';
import {Bg, Grain} from './Stage';
import {Emote} from '../assets';
import {Ira, IraEnter} from './Ira';
import {Headline, Pill, Sub} from './Text';

/** The real Dietary Guide wordmark (from the design file), wiped in left to right. */
export const Logo: React.FC<{at: number; cx: number; y: number; width: number; white?: boolean; wipe?: boolean}> = ({at, cx, y, width, white, wipe = true}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 18], [0, 1], {...clamp, easing: ease.inOut});
  const s = spr(f, at, {damping: 16, stiffness: 120});
  const h = width * (304 / 618);
  return (
    <div style={{position: 'absolute', left: cx - width / 2, top: y, width, height: h, clipPath: wipe ? `inset(0 ${(1 - p) * 100}% 0 0)` : undefined, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`, opacity: wipe ? 1 : p}}>
      <Img src={src(BRAND.logo)} style={{width, height: h, filter: white ? 'brightness(0) invert(1)' : undefined}} />
    </div>
  );
};

export type EndCardProps = {
  at: number;
  bg?: 'warm' | 'teal' | 'green' | 'ink';
  tagline: string[];
  cta?: string;
  note?: string;
  iraEnter?: IraEnter;
  iraHop?: number;
  iraSize?: number;
  /** green rings bursting from IRA's landing */
  burst?: boolean;
  emote?: Emote | [number, Emote][];
};

/**
 * Closing brand frame. Each ad passes its own background, entrance and line,
 * so endings share a system without being identical.
 */
export const EndCard: React.FC<EndCardProps> = ({
  at,
  bg = 'warm',
  tagline,
  cta = 'Try Dietary Guide',
  note,
  iraEnter = 'pop',
  iraHop,
  iraSize = 560,
  burst,
  emote,
}) => {
  const dark = bg === 'teal' || bg === 'ink';
  return (
    <AbsoluteFill>
      <Bg kind={bg} glow={[540, 700]} />
      {burst && <Burst at={at + 12} cx={540} cy={900} />}
      <Ira x={540} y={930} size={iraSize} enter={iraEnter} enterAt={at} hops={iraHop ? [iraHop] : []} shadowColor={dark ? 'rgba(0,0,0,0.45)' : undefined} emote={emote} />
      <Logo at={at + 10} cx={540} y={968} width={470} white={dark} />
      <Headline lines={tagline} at={at + 22} y={1222} size={66} weight={700} color={dark ? C.white : C.ink} accent={dark ? '#4ADE80' : C.leaf} lineHeight={1.12} stagger={2} />
      <Pill text={cta} at={at + 38} cx={540} y={1430} bg={dark ? C.leaf : C.teal} size={46} pad={[30, 64]} />
      {note && <Sub text={note} at={at + 46} y={1576} size={28} color={dark ? 'rgba(255,255,255,0.6)' : C.sub} weight={400} />}
      <Grain opacity={0.04} vignette={dark ? 0.3 : 0.08} />
    </AbsoluteFill>
  );
};

/** Concentric rings expanding from a point, for the biggest landing moment. */
const Burst: React.FC<{at: number; cx: number; cy: number}> = ({at, cx, cy}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <>
      {[0, 6, 12].map((d, i) => {
        const p = interpolate(f, [at + d, at + d + 40], [0, 1], {...clamp, easing: ease.out});
        const r = 80 + p * 900;
        return (
          <div key={i} style={{position: 'absolute', left: cx - r, top: cy - r * 0.32, width: r * 2, height: r * 0.64, borderRadius: '50%', border: `${6 - i * 1.5}px solid rgba(74,222,128,${0.55 * (1 - p)})`}} />
        );
      })}
    </>
  );
};
