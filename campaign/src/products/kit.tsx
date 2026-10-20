import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {src} from '../assets';
import {C, clamp, ease, F, spr, track} from '../theme';

/** Product assets prepared by scripts/prepare_products.py (sizes in px). */
export const P = {
  chana: {file: 'products/pack-chana.png', w: 452, h: 1010},
  rajma: {file: 'products/pack-rajma.png', w: 305, h: 757},
  granola: {file: 'products/pack-granola.png', w: 494, h: 684},
  tea: {file: 'products/pack-tea.png', w: 614, h: 819},
  seeds: {file: 'products/pack-seeds.png', w: 1261, h: 488},
  almond: {file: 'products/pack-almond.png', w: 1260, h: 481},
  treat: {file: 'products/pack-treat.png', w: 758, h: 589},
} as const;
export type PackKey = keyof typeof P;

export const LOGO_DARK = 'products/logo-dark.png';
export const LOGO_WHITE = 'products/logo-white.png';
export const SHOP_URL = 'dietaryguide.in/products';

/** Small deterministic PRNG so every render matches. */
export const rand = (seed: number) => {
  let t = (seed * 2654435761) >>> 0;
  t += 0x6d2b79f5;
  let r = Math.imul(t ^ (t >>> 15), t | 1);
  r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

/**
 * A real packshot. Uniform scale only (proportions are never changed). Optional
 * contact shadow, glossy floor reflection and a light sweep masked to the
 * pack's own alpha so the highlight only touches the packaging.
 */
export const Pack: React.FC<{
  k: PackKey;
  cx: number;
  cy: number;
  h?: number;
  w?: number;
  rot?: number;
  sheenAt?: number[];
  shadow?: number;
  reflect?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({k, cx, cy, h, w, rot = 0, sheenAt = [], shadow = 0.35, reflect = 0, glow, style}) => {
  const f = useCurrentFrame();
  const p = P[k];
  const H = h ?? (w ? (w * p.h) / p.w : 800);
  const W = (H * p.w) / p.h;
  const maskUrl = `url(${src(p.file)})`;
  return (
    <div style={{position: 'absolute', left: cx - W / 2, top: cy - H / 2, width: W, height: H, transform: `rotate(${rot}deg)`, ...style}}>
      {glow && <div style={{position: 'absolute', left: -W * 0.6, top: -H * 0.3, width: W * 2.2, height: H * 1.6, background: `radial-gradient(closest-side, ${glow}, rgba(0,0,0,0))`}} />}
      {shadow > 0 && (
        <div style={{position: 'absolute', left: W * 0.05, top: H * 0.955, width: W * 0.9, height: Math.max(18, W * 0.09), borderRadius: '50%', background: `radial-gradient(closest-side, rgba(0,0,0,${shadow}), rgba(0,0,0,0))`, filter: 'blur(4px)'}} />
      )}
      {reflect > 0 && (
        <Img src={src(p.file)} style={{position: 'absolute', left: 0, top: H, width: W, height: H, transform: 'scaleY(-1)', opacity: reflect, WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0) 45%)', maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0) 45%)'}} />
      )}
      <Img src={src(p.file)} style={{position: 'absolute', inset: 0, width: W, height: H}} />
      {sheenAt.map((at, i) => {
        const t = interpolate(f, [at, at + 30], [-0.5, 1.5], {...clamp, easing: ease.inOut});
        if (f < at || f > at + 30) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: maskUrl,
              WebkitMaskSize: '100% 100%',
              maskImage: maskUrl,
              maskSize: '100% 100%',
              background: `linear-gradient(115deg, rgba(255,255,255,0) ${t * 100 - 14}%, rgba(255,250,235,0.55) ${t * 100}%, rgba(255,255,255,0) ${t * 100 + 14}%)`,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </div>
  );
};

/** Photo crop with keyframed zoom/pan around an image point (Ken Burns). */
export const Shot: React.FC<{
  file: string;
  iw: number;
  ih: number;
  fx: [number, number][] | number;
  fy: [number, number][] | number;
  zoom: [number, number][] | number;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  filter?: string;
  radius?: number;
  style?: React.CSSProperties;
}> = ({file, iw, ih, fx, fy, zoom, w = 1080, h = 1920, x = 0, y = 0, filter, radius = 0, style}) => {
  const f = useCurrentFrame();
  const v = (k: [number, number][] | number) => (typeof k === 'number' ? k : track(f, k, ease.soft));
  const sc = Math.max(w / iw, h / ih) * v(zoom);
  const dw = iw * sc;
  const dh = ih * sc;
  const left = Math.min(0, Math.max(w - dw, w / 2 - v(fx) * sc));
  const top = Math.min(0, Math.max(h - dh, h / 2 - v(fy) * sc));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: radius, ...style}}>
      <Img src={src(file)} style={{position: 'absolute', left, top, width: dw, height: dh, filter}} />
    </div>
  );
};

/** Canvas position of an image point inside a static Shot (for leader lines). */
export const shotPoint = (iw: number, ih: number, fx: number, fy: number, zoom: number, px: number, py: number, w = 1080, h = 1920) => {
  const sc = Math.max(w / iw, h / ih) * zoom;
  const left = Math.min(0, Math.max(w - iw * sc, w / 2 - fx * sc));
  const top = Math.min(0, Math.max(h - ih * sc, h / 2 - fy * sc));
  return {x: left + px * sc, y: top + py * sc};
};

type ParticleKind = 'crumbs' | 'embers' | 'dust' | 'seeds' | 'granola' | 'almonds' | 'rain';

/** Deterministic particle field. Bursts from (x, y) or drifts over the frame. */
export const Particles: React.FC<{
  kind: ParticleKind;
  at: number;
  dur?: number;
  n?: number;
  x?: number;
  y?: number;
  spread?: number;
  seed?: number;
  colors?: string[];
}> = ({kind, at, dur = 60, n = 40, x = 540, y = 960, spread = 1, seed = 1, colors}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const pal = colors ?? {
    crumbs: ['#C9772E', '#E9A04A', '#8A4A1C', '#D99A2B'],
    embers: ['#FFB347', '#FF7A2F', '#FFD27A'],
    dust: ['#F4D58D', '#FFE9B8', '#D99A2B'],
    seeds: ['#6E8B3D', '#A7B66A', '#D8C9A1', '#3F2A1C'],
    granola: ['#C88E4A', '#E2B270', '#8B5A2B', '#6E2A2A'],
    almonds: ['#A0652F', '#C27C3E', '#7A4520'],
    rain: ['#C88E4A', '#E2B270', '#8B5A2B', '#7A2E2E', '#D9B98A'],
  }[kind];
  const fade = interpolate(t, [0, 4, dur - 12, dur], [0, 1, 1, 0], clamp);
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const r1 = rand(seed * 1000 + i);
        const r2 = rand(seed * 2000 + i);
        const r3 = rand(seed * 3000 + i);
        const col = pal[i % pal.length];
        let px = x;
        let py = y;
        let size = 6;
        let rot = r3 * 360 + t * (r1 - 0.5) * 20;
        let op = fade;
        let shape: React.CSSProperties = {};
        if (kind === 'crumbs' || kind === 'seeds' || kind === 'almonds' || kind === 'granola') {
          // burst outward, then gravity
          const ang = r1 * Math.PI * 2;
          const v = (6 + r2 * 18) * spread;
          px = x + Math.cos(ang) * v * t;
          py = y + Math.sin(ang) * v * t * 0.7 - 8 * t + 0.55 * t * t;
          size = kind === 'crumbs' ? 6 + r3 * 16 : kind === 'seeds' ? 14 + r3 * 10 : kind === 'almonds' ? 26 + r3 * 18 : 10 + r3 * 14;
          shape = kind === 'seeds' ? {borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', width: size * 0.55, height: size}
            : kind === 'almonds' ? {borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%', width: size * 0.6, height: size}
            : {borderRadius: `${30 + r2 * 40}% ${50 - r1 * 30}% ${40 + r3 * 30}% ${50}%`, width: size, height: size * (0.6 + r2 * 0.5)};
        } else if (kind === 'rain') {
          // clusters falling from above the frame into a target point (x, y)
          const delay = r1 * dur * 0.6;
          const tt = t - delay;
          if (tt < 0) return null;
          px = x + (r2 - 0.5) * 380 * spread + Math.sin(tt / 6 + i) * 4;
          py = -80 + tt * (14 + r3 * 6) + 0.35 * tt * tt;
          if (py > y + r3 * 60) return null;
          size = 12 + r3 * 18;
          rot = r1 * 360 + tt * (r2 - 0.5) * 30;
          shape = {borderRadius: `${30 + r2 * 40}% ${50 - r1 * 30}% ${40 + r3 * 30}% 45%`, width: size, height: size * (0.6 + r2 * 0.5), boxShadow: 'inset -2px -3px 4px rgba(0,0,0,0.25)'};
        } else if (kind === 'embers') {
          px = x + (r1 - 0.5) * 900 * spread + Math.sin((t + i * 7) / 9) * 18;
          py = y - t * (4 + r2 * 9) + r3 * 300;
          size = 3 + r3 * 7;
          op = fade * (0.5 + 0.5 * Math.sin((t + i * 13) / 3)) * interpolate(py, [y - 900, y], [0, 1], clamp);
          shape = {borderRadius: '50%', width: size, height: size, boxShadow: `0 0 ${size * 2.5}px ${col}`};
        } else {
          px = (r1 * 1180 - 50) + Math.sin((t + i * 11) / 40) * 30;
          py = (r2 * 2000 - 40) - t * (0.4 + r3 * 0.9);
          size = 2 + r3 * 5;
          op = fade * (0.25 + 0.6 * Math.abs(Math.sin((t + i * 17) / 25)));
          shape = {borderRadius: '50%', width: size, height: size, boxShadow: `0 0 ${size * 3}px ${col}`};
        }
        return <div key={i} style={{position: 'absolute', left: px, top: py, background: col, opacity: op, transform: `rotate(${rot}deg)`, ...shape}} />;
      })}
    </>
  );
};

/** Soft rising steam wisps (SVG), for the tea film. */
export const Steam: React.FC<{x: number; y: number; at: number; w?: number; h?: number; opacity?: number}> = ({x, y, at, w = 360, h = 700, opacity = 0.5}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  const o = interpolate(t, [0, 30], [0, opacity], clamp);
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x - w / 2, top: y - h, opacity: o, filter: 'blur(9px)'}}>
      {[0, 1, 2].map((i) => {
        const ph = t / 26 + i * 2.1;
        const xo = w / 2 + (i - 1) * 50;
        const d = `M ${xo} ${h} C ${xo + Math.sin(ph) * 70} ${h * 0.7}, ${xo - Math.sin(ph + 1) * 80} ${h * 0.45}, ${xo + Math.sin(ph + 2) * 60} ${h * 0.1}`;
        return <path key={i} d={d} stroke="rgba(255,255,255,0.9)" strokeWidth={26 - i * 6} fill="none" strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Premium headline: words fade/rise with tracking; supports weight mixing. */
export const Title: React.FC<{
  text: string;
  at: number;
  out?: number;
  y: number;
  x?: number;
  width?: number;
  size?: number;
  weight?: number;
  color?: string;
  accent?: string;
  align?: 'left' | 'center' | 'right';
  tracking?: number;
  lineHeight?: number;
  stagger?: number;
  font?: string;
  upper?: boolean;
  shadow?: string;
}> = ({text, at, out, y, x = 70, width = 940, size = 90, weight = 300, color = C.off, accent = C.haldi, align = 'center', tracking = -0.02, lineHeight = 1.08, stagger = 3, font = F.display, upper = false, shadow}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  const o = out !== undefined ? interpolate(f, [out, out + 12], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  let wi = 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, fontFamily: font, fontSize: size, fontWeight: weight, color, letterSpacing: `${tracking}em`, lineHeight, opacity: o, textTransform: upper ? 'uppercase' : undefined, textShadow: shadow}}>
      {text.split('\n').map((line, li) => (
        <div key={li}>
          {line.split(' ').map((raw, i, arr) => {
            const idx = wi++;
            const t0 = at + idx * stagger;
            const p = interpolate(f, [t0, t0 + 16], [0, 1], {...clamp, easing: ease.out});
            const hi = raw.startsWith('*');
            return (
              <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, transform: `translateY(${(1 - p) * size * 0.35}px)`, filter: `blur(${(1 - p) * 8}px)`, color: hi ? accent : undefined, fontWeight: hi ? Math.min(800, weight + 400) : undefined}}>
                {raw.replace(/\*/g, '')}
                {i < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small letter-spaced kicker line. */
export const Kicker: React.FC<{text: string; at: number; out?: number; y: number; color?: string; size?: number}> = ({text, at, out, y, color = C.haldi, size = 30}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 20], [0, 1], {...clamp, easing: ease.out});
  const o = out !== undefined ? interpolate(f, [out, out + 10], [1, 0], clamp) : 1;
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: size, letterSpacing: `${0.1 + (1 - p) * 0.3}em`, color, opacity: p * o, textTransform: 'uppercase'}}>
      {text}
    </div>
  );
};

/** Verified claim chips (exact pack wording), staggered. */
export const Chips: React.FC<{items: string[]; at: number; out?: number; y: number; dark?: boolean; accent?: string; size?: number; vertical?: boolean; x?: number}> = ({items, at, out, y, dark = true, accent = C.haldi, size = 34, vertical = false, x}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = out !== undefined ? interpolate(f, [out, out + 10], [1, 0], clamp) : 1;
  return (
    <div style={{position: 'absolute', left: x ?? 0, width: x !== undefined ? undefined : 1080, top: y, display: 'flex', flexDirection: vertical ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: vertical ? 'flex-start' : 'center', gap: vertical ? 22 : 16, opacity: o, padding: vertical ? 0 : '0 60px', boxSizing: 'border-box'}}>
      {items.map((t, i) => {
        const s = spr(f, at + i * 6, {damping: 15, stiffness: 160});
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: `${size * 0.36}px ${size * 0.7}px`, borderRadius: 999, border: `2px solid ${dark ? 'rgba(255,255,255,0.28)' : 'rgba(15,23,42,0.18)'}`, background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.65)', color: dark ? C.off : C.ink, fontFamily: F.body, fontWeight: 500, fontSize: size, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, backdropFilter: 'blur(6px)'}}>
            <span style={{width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: accent, flex: 'none'}} />
            {t}
          </div>
        );
      })}
    </div>
  );
};

/** Brand + CTA end block (logo, product line, CTA, url). */
export const EndBlock: React.FC<{at: number; y: number; dark?: boolean; product: string; line?: string; cta?: string}> = ({at, y, dark = true, product, line, cta = 'Explore the collection'}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 16, stiffness: 120});
  const p2 = interpolate(f, [at + 10, at + 30], [0, 1], {...clamp, easing: ease.out});
  const p3 = spr(f, at + 22, {damping: 14, stiffness: 150});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Img src={src(dark ? LOGO_WHITE : LOGO_DARK)} style={{width: 300, height: dark ? 144 : 143, marginBottom: 26, opacity: s, transform: `scale(${0.85 + s * 0.15})`, filter: dark ? 'brightness(1.55)' : undefined}} />
      <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 46, color: dark ? C.off : C.ink, letterSpacing: '-0.01em', opacity: p2, textAlign: 'center'}}>{product}</div>
      {line && <div style={{fontFamily: F.body, fontWeight: 400, fontSize: 32, color: dark ? 'rgba(250,248,245,0.75)' : C.sub, marginTop: 8, opacity: p2, textAlign: 'center'}}>{line}</div>}
      <div style={{marginTop: 30, padding: '24px 54px', borderRadius: 999, background: dark ? C.off : C.teal, color: dark ? C.ink : C.off, fontFamily: F.body, fontWeight: 600, fontSize: 38, transform: `scale(${0.7 + p3 * 0.3})`, opacity: p3, boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>{cta}</div>
      <div style={{marginTop: 18, fontFamily: F.body, fontSize: 30, color: dark ? 'rgba(250,248,245,0.7)' : C.sub, opacity: p3, letterSpacing: '0.02em'}}>{SHOP_URL}</div>
    </div>
  );
};

/** Colour grade + vignette + light grain for a filmic finish. */
export const Grade: React.FC<{warm?: number; vignette?: number; tint?: string}> = ({warm = 0.08, vignette = 0.45, tint = '255,170,90'}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: `rgba(${tint},${warm})`, mixBlendMode: 'soft-light'}} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 70% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,${vignette}) 100%)`}} />
  </AbsoluteFill>
);

/** Fullscreen colour/gradient field. */
export const Field: React.FC<{bg: string}> = ({bg}) => <AbsoluteFill style={{background: bg}} />;
