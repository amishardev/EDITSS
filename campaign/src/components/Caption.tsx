import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, clamp, ease, F, spr} from '../theme';

/**
 * Creator-style caption: each line in its own white box, slightly tilted,
 * the way people type text over short-form video. *word* gets a green
 * highlight block.
 */
export const TokCaption: React.FC<{
  lines: string[];
  at: number;
  out?: number;
  cx?: number;
  y: number;
  size?: number;
  rotate?: number;
  dark?: boolean;
  stagger?: number;
}> = ({lines, at, out, cx = 540, y, size = 64, rotate = -2, dark = false, stagger = 4}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = out !== undefined ? interpolate(f, [out, out + 6], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.12, transform: `translateX(${cx - 540}px) rotate(${rotate}deg)`, opacity: o}}>
      {lines.map((line, i) => {
        const t0 = at + i * stagger;
        const s = spr(f, t0, {damping: 12, stiffness: 240, mass: 0.6});
        if (f < t0) return null;
        return (
          <div
            key={i}
            style={{
              padding: `${size * 0.16}px ${size * 0.34}px`,
              borderRadius: size * 0.22,
              background: dark ? C.ink : C.white,
              color: dark ? C.white : C.ink,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: size,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              whiteSpace: 'nowrap',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
            }}
          >
            {line.split(' ').map((w, j, arr) => {
              const hi = w.startsWith('*');
              return (
                <React.Fragment key={j}>
                  <span style={hi ? {background: C.leaf, color: C.white, borderRadius: size * 0.12, padding: `0 ${size * 0.14}px`} : undefined}>{w.replace(/\*/g, '')}</span>
                  {j < arr.length - 1 ? ' ' : ''}
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Small label sticker ("plate #1"), top-left, in the creator idiom. */
export const Sticker: React.FC<{text: string; at: number; out?: number; x?: number; y?: number; bg?: string; color?: string}> = ({text, at, out, x = 70, y = 270, bg = C.haldi, color = C.ink}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 11, stiffness: 220});
  const o = out !== undefined ? interpolate(f, [out, out + 6], [1, 0], clamp) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '12px 26px', borderRadius: 999, background: bg, color, fontFamily: F.display, fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em', transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-14, -4])}deg)`, opacity: o, boxShadow: '0 10px 24px rgba(0,0,0,0.25)'}}>
      {text}
    </div>
  );
};

/** Big rating card used by the Gen Z ad (values are the app's own results). */
export const RatingCard: React.FC<{at: number; out?: number; score: number; verdict?: string; meal: string; detail: string; y?: number}> = ({at, out, score, verdict, meal, detail, y = 640}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 11, stiffness: 200});
  const o = out !== undefined ? interpolate(f, [out, out + 6], [1, 0], clamp) : 1;
  const v = Math.round(interpolate(f, [at, at + 16], [0, score], {...clamp, easing: ease.out}));
  const bar = interpolate(f, [at + 4, at + 22], [0, score / 100], {...clamp, easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 110, top: y, width: 860, borderRadius: 54, background: 'rgba(14,38,41,0.92)', border: '3px solid rgba(255,255,255,0.12)', padding: '44px 52px 48px', boxSizing: 'border-box', color: '#fff', fontFamily: F.body, transform: `scale(${interpolate(s, [0, 1], [0.5, 1])}) rotate(${interpolate(s, [0, 1], [8, 0])}deg)`, opacity: o, boxShadow: '0 40px 80px rgba(0,0,0,0.45)'}}>
      <div style={{fontSize: 32, opacity: 0.7}}>Health score</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
        <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 230, letterSpacing: '-0.06em', lineHeight: 1}}>{v}</span>
        <span style={{fontSize: 62, opacity: 0.6}}>/100</span>
      </div>
      {verdict && <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 46, marginTop: 4}}>{verdict}</div>}
      <div style={{height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.15)', margin: '26px 0 24px'}}>
        <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 9, background: `linear-gradient(90deg, #F59E0B, ${C.scoreBar})`}} />
      </div>
      <div style={{fontSize: 38, fontWeight: 600}}>{meal}</div>
      <div style={{fontSize: 30, opacity: 0.7, marginTop: 6}}>{detail}</div>
    </div>
  );
};
