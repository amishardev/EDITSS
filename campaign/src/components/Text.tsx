import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, clamp, ease, F, spr} from '../theme';

type Mode = 'rise' | 'pop' | 'slide' | 'type';

export type HeadlineProps = {
  /** lines of text; wrap a word in *asterisks* to accent it */
  lines: string[];
  at: number;
  out?: number;
  x?: number;
  y: number;
  width?: number;
  size?: number;
  color?: string;
  accent?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  font?: string;
  stagger?: number;
  mode?: Mode;
  lineHeight?: number;
  letterSpacing?: number;
  shadow?: string;
  exitDur?: number;
  style?: React.CSSProperties;
};

/** Kinetic headline: each word rises out of a mask, one beat apart. */
export const Headline: React.FC<HeadlineProps> = ({
  lines,
  at,
  out,
  x = 70,
  y,
  width = 940,
  size = 104,
  color = C.ink,
  accent = C.leaf,
  align = 'center',
  weight = 800,
  font = F.display,
  stagger = 3,
  mode = 'rise',
  lineHeight = 1.06,
  letterSpacing = -0.035,
  shadow,
  exitDur = 12,
  style,
}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  if (out !== undefined && f > out + exitDur + 2) return null;
  let wi = 0;
  const exitP = out !== undefined ? interpolate(f, [out, out + exitDur], [0, 1], {...clamp, easing: ease.in}) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        color,
        textShadow: shadow,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{overflow: mode === 'rise' ? 'hidden' : 'visible', paddingBottom: size * 0.08, marginBottom: -size * 0.08}}>
          {line.split(' ').map((raw, i) => {
            const idx = wi++;
            const isAccent = raw.startsWith('*');
            const word = raw.replace(/\*/g, '');
            const t0 = at + idx * stagger;
            const s = spr(f, t0, {damping: 15, stiffness: 170, mass: 0.7});
            let transform = '';
            let opacity = 1;
            if (mode === 'rise') {
              transform = `translateY(${interpolate(s, [0, 1], [105, 0])}%)`;
            } else if (mode === 'pop') {
              transform = `scale(${interpolate(s, [0, 1], [0.4, 1])})`;
              opacity = interpolate(f, [t0, t0 + 4], [0, 1], clamp);
            } else if (mode === 'slide') {
              transform = `translateX(${interpolate(s, [0, 1], [-60, 0])}px)`;
              opacity = interpolate(f, [t0, t0 + 6], [0, 1], clamp);
            } else {
              opacity = f >= t0 ? 1 : 0;
            }
            const exitY = exitP * -110;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  color: isAccent ? accent : undefined,
                  transform: `${transform} translateY(${exitY}%)`,
                  opacity: opacity * (1 - exitP * (mode === 'rise' ? 0 : 1)),
                }}
              >
                {word}
                {i < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small supporting line in Poppins that fades up. */
export const Sub: React.FC<{
  text: string;
  at: number;
  out?: number;
  y: number;
  x?: number;
  width?: number;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  style?: React.CSSProperties;
}> = ({text, at, out, y, x = 70, width = 940, size = 40, color = C.sub, align = 'center', weight = 500, style}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: ease.out});
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  if (f < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: F.body,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.35,
        color,
        opacity: p * o,
        transform: `translateY(${(1 - p) * 24}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Rounded pill label, used for kickers and the CTA. */
export const Pill: React.FC<{
  text: string;
  at: number;
  out?: number;
  cx: number;
  y: number;
  bg?: string;
  color?: string;
  size?: number;
  icon?: React.ReactNode;
  pad?: [number, number];
  weight?: number;
  shadow?: boolean;
  font?: string;
}> = ({text, at, out, cx, y, bg = C.teal, color = C.white, size = 40, icon, pad = [26, 52], weight = 600, shadow = true, font = F.body}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 13, stiffness: 160});
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, display: 'flex', justifyContent: 'center', transform: `translateX(${cx - 540}px)`}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: size * 0.4,
          padding: `${pad[0]}px ${pad[1]}px`,
          borderRadius: 999,
          background: bg,
          color,
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          letterSpacing: '-0.01em',
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
          opacity: o * interpolate(f, [at, at + 5], [0, 1], clamp),
          boxShadow: shadow ? '0 18px 40px rgba(15,23,42,0.22)' : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        {text}
      </div>
    </div>
  );
};

/** Counts up a number with tabular figures. */
export const Count: React.FC<{from?: number; to: number; at: number; dur?: number; format?: (n: number) => string}> = ({
  from = 0,
  to,
  at,
  dur = 22,
  format = (n) => Math.round(n).toLocaleString('en-IN'),
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [from, to], {...clamp, easing: ease.out});
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{format(v)}</span>;
};
