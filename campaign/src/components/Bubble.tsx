import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, clamp, ease, F, spr} from '../theme';

type Kind = 'ira' | 'user' | 'brand';

const STYLE: Record<Kind, {bg: string; color: string; border?: string}> = {
  ira: {bg: C.white, color: C.ink, border: C.border},
  user: {bg: C.ink, color: C.white},
  brand: {bg: C.leaf, color: C.white},
};

/** Chat-style speech bubble. Optional typing dots before the text lands. */
export const Bubble: React.FC<{
  at: number;
  out?: number;
  x: number;
  y: number;
  maxW?: number;
  lines: string[];
  kind?: Kind;
  tail?: 'left' | 'right' | 'none';
  size?: number;
  typing?: number;
  font?: string;
  weight?: number;
  align?: 'left' | 'right';
}> = ({at, out, x, y, maxW = 900, lines, kind = 'ira', tail = 'left', size = 64, typing = 0, font = F.display, weight = 700, align = 'left'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const st = STYLE[kind];
  const s = spr(f, at, {damping: 13, stiffness: 170});
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  const exitY = out !== undefined ? interpolate(f, [out, out + 10], [0, -40], {...clamp, easing: ease.in}) : 0;
  const showText = f >= at + typing;
  const r = size * 0.62;
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'left' ? x : undefined,
        right: align === 'right' ? 1080 - x : undefined,
        top: y,
        maxWidth: maxW,
        transformOrigin: tail === 'right' ? '100% 100%' : '0% 100%',
        transform: `translateY(${exitY}px) scale(${interpolate(s, [0, 1], [0.5, 1])})`,
        opacity: o * interpolate(f, [at, at + 4], [0, 1], clamp),
      }}
    >
      <div
        style={{
          padding: `${size * 0.42}px ${size * 0.6}px`,
          borderRadius: r,
          borderBottomLeftRadius: tail === 'left' ? size * 0.14 : r,
          borderBottomRightRadius: tail === 'right' ? size * 0.14 : r,
          background: st.bg,
          color: st.color,
          border: st.border ? `3px solid ${st.border}` : undefined,
          boxShadow: '0 24px 50px rgba(15,23,42,0.16)',
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.18,
          letterSpacing: font === F.display ? '-0.025em' : '-0.005em',
          whiteSpace: 'nowrap',
        }}
      >
        {showText ? (
          lines.map((l, i) => (
            <div key={i}>
              {l.split(' ').map((w, j) => (
                <span key={j} style={{color: w.startsWith('*') ? (kind === 'ira' ? C.leaf : '#BBF7D0') : undefined}}>
                  {w.replace(/\*/g, '')}
                  {j < l.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>
          ))
        ) : (
          <Dots f={f - at} size={size} color={kind === 'ira' ? C.sub : C.white} />
        )}
      </div>
    </div>
  );
};

export const Dots: React.FC<{f: number; size: number; color: string}> = ({f, size, color}) => (
  <div style={{display: 'flex', gap: size * 0.22, height: size * 1.18, alignItems: 'center'}}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: size * 0.26,
          height: size * 0.26,
          borderRadius: '50%',
          background: color,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - i * 3) / 3)),
          transform: `translateY(${-Math.max(0, Math.sin((f - i * 3) / 3)) * size * 0.1}px)`,
        }}
      />
    ))}
  </div>
);
