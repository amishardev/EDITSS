import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease, spr} from '../theme';
import {rand} from '../products/kit';

/**
 * Dussehra kit: everything is drawn in code (no stock art). Symbols only:
 * marigolds, diyas, rangoli, fireworks and a stylised paper effigy. No deity
 * is depicted.
 */
export const FEST = {
  night: '#0B0A1F',
  dusk: '#2B0F2E',
  maroon: '#5A0F1C',
  deep: '#2A0710',
  marigold: '#FFB020',
  saffron: '#FF7A00',
  gold: '#E7C27D',
  cream: '#FFF3DE',
};

/* ------------------------------------------------------------ sky */

export const NightSky: React.FC<{glow?: number}> = ({glow = 0.5}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${FEST.night} 0%, #1A0E2C 40%, ${FEST.dusk} 70%, #4A1418 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(900px 600px at 540px 1900px, rgba(255,122,0,${0.45 * glow}), rgba(255,122,0,0) 70%)`}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 70}).map((_, i) => {
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (14 + rand(i * 7) * 20) + i));
          return <circle key={i} cx={rand(i * 3 + 1) * 1080} cy={rand(i * 5 + 2) * 1100} r={0.8 + rand(i * 11) * 1.8} fill="#FFF6E0" opacity={tw * (0.3 + rand(i) * 0.6)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ flames */

const tongue = (w: number, h: number) =>
  `M ${-w / 2} 0 C ${-w / 2} ${-h * 0.42}, ${-w * 0.12} ${-h * 0.58}, 0 ${-h} C ${w * 0.12} ${-h * 0.58}, ${w / 2} ${-h * 0.42}, ${w / 2} 0 Q 0 ${h * 0.14}, ${-w / 2} 0 Z`;

/** A living fire: layered flickering tongues, base-anchored at (x, y). */
export const Flames: React.FC<{x: number; y: number; w: number; h: number; at: number; seed?: number; grow?: number; out?: number}> = ({x, y, w, h, at, seed = 1, grow = 12, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const g = interpolate(f, [at, at + grow], [0.2, 1], {...clamp, easing: ease.out});
  const o = out !== undefined ? interpolate(f, [out, out + 16], [1, 0], clamp) : 1;
  if (o <= 0) return null;
  const n = Math.max(7, Math.round(w / 55));
  const id = `fl${seed}`;
  const tongues = Array.from({length: n}).map((_, i) => {
    const r = (k: number) => rand(seed * 31 + i * 7 + k);
    const tx = (i / (n - 1) - 0.5) * w * 0.7;
    const th = h * (0.45 + 0.55 * (1 - Math.abs(i / (n - 1) - 0.5) * 1.4)) * (0.78 + 0.22 * Math.sin(f * (0.45 + r(1) * 0.3) + r(2) * 6));
    const tw = w * (0.32 + r(3) * 0.12);
    const sway = Math.sin(f * 0.21 + r(4) * 5) * w * 0.04;
    return {tx: tx + sway, th: th * g, tw};
  });
  return (
    <svg width={w * 2} height={h * 1.6} style={{position: 'absolute', left: x - w, top: y - h * 1.4, overflow: 'visible', opacity: o, mixBlendMode: 'screen', WebkitMaskImage: 'linear-gradient(to top, transparent 9%, black 20%)', maskImage: 'linear-gradient(to top, transparent 9%, black 20%)'}}>
      <defs>
        <linearGradient id={`${id}o`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FF4D00" />
          <stop offset="0.6" stopColor="#FF2A00" stopOpacity="0.8" />
          <stop offset="1" stopColor="#B00000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FFC233" />
          <stop offset="0.7" stopColor="#FF8A00" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}i`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#FFFBE0" />
          <stop offset="1" stopColor="#FFE07A" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}b`}>
          <feGaussianBlur stdDeviation={Math.max(2, w * 0.03)} />
        </filter>
      </defs>
      <g transform={`translate(${w} ${h * 1.4})`}>
        <ellipse cx={0} cy={-h * 0.3} rx={w * 0.8} ry={h * 0.7} fill="rgba(255,120,0,0.18)" filter={`url(#${id}b)`} />
        {tongues.map((t, i) => (
          <path key={`o${i}`} d={tongue(t.tw * 1.25, t.th * 1.15)} transform={`translate(${t.tx} 0)`} fill={`url(#${id}o)`} filter={`url(#${id}b)`} />
        ))}
        {tongues.map((t, i) => (
          <path key={`m${i}`} d={tongue(t.tw, t.th * 0.85)} transform={`translate(${t.tx * 0.9} 0)`} fill={`url(#${id}m)`} />
        ))}
        {tongues.filter((_, i) => i % 2 === 1).map((t, i) => (
          <path key={`i${i}`} d={tongue(t.tw * 0.55, t.th * 0.5)} transform={`translate(${t.tx * 0.7} 0)`} fill={`url(#${id}i)`} />
        ))}
      </g>
    </svg>
  );
};

/** Rising embers from a burning area. */
export const Embers: React.FC<{x: number; y: number; w: number; at: number; n?: number; seed?: number; rise?: number}> = ({x, y, w, at, n = 30, seed = 3, rise = 700}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const r = (k: number) => rand(seed * 53 + i * 13 + k);
        const life = 50 + r(1) * 50;
        const tt = (t + r(2) * life) % life;
        const p = tt / life;
        const ex = x + (r(3) - 0.5) * w + Math.sin(tt * 0.12 + r(4) * 6) * 18;
        const ey = y - p * rise * (0.5 + r(5) * 0.5);
        return <circle key={i} cx={ex} cy={ey} r={1.5 + r(6) * 3} fill={r(7) > 0.5 ? '#FFB020' : '#FF6A00'} opacity={(1 - p) * 0.9} />;
      })}
    </svg>
  );
};

/* ------------------------------------------------------------ fireworks */

/** A firework shell: a launch streak, then a burst of trailing sparks that sag with gravity. */
export const Firework: React.FC<{at: number; x: number; y: number; r?: number; color?: string; color2?: string; n?: number; seed?: number; launch?: boolean}> = ({at, x, y, r = 260, color = '#FFC94D', color2 = '#FF5DA2', n = 46, seed = 1, launch = true}) => {
  const f = useCurrentFrame();
  const L = 16;
  const t = f - at;
  if (t < -L || t > 64) return null;
  if (t < 0) {
    if (!launch) return null;
    const p = (t + L) / L;
    const ly = 1920 - (1920 - y) * ease.out(p);
    return (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={x} y1={ly + 60} x2={x} y2={ly} stroke="#FFE3A0" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        <circle cx={x} cy={ly} r={4} fill="#FFF6D8" />
      </svg>
    );
  }
  const pos = (i: number, tt: number) => {
    const a = (i / n) * Math.PI * 2 + rand(seed * 17 + i) * 0.2;
    const v = r * (0.75 + rand(seed * 29 + i) * 0.25);
    const d = v * (1 - Math.exp(-tt / 9));
    return [x + Math.cos(a) * d, y + Math.sin(a) * d + 0.05 * tt * tt] as const;
  };
  const fade = interpolate(t, [20, 62], [1, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
      <circle cx={x} cy={y} r={interpolate(t, [0, 8], [10, r * 0.7], clamp)} fill={color} opacity={interpolate(t, [0, 10], [0.35, 0], clamp)} />
      {Array.from({length: n}).map((_, i) => {
        const [x1, y1] = pos(i, t);
        const [x0, y0] = pos(i, Math.max(0, t - 5));
        const c = i % 3 === 0 ? color2 : color;
        const tw = t > 30 ? 0.5 + 0.5 * Math.sin(t * 1.3 + i) : 1;
        return (
          <g key={i} opacity={fade * tw}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={c} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
            <circle cx={x1} cy={y1} r={3.4} fill="#FFF8E6" />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------ marigolds */

export const MarigoldDefs: React.FC<{id?: string}> = ({id = 'mg'}) => (
  <defs>
    <radialGradient id={id}>
      <stop offset="0" stopColor="#FFD24A" />
      <stop offset="0.6" stopColor="#FFA21A" />
      <stop offset="1" stopColor="#E86A00" />
    </radialGradient>
    <radialGradient id={`${id}y`}>
      <stop offset="0" stopColor="#FFE680" />
      <stop offset="0.6" stopColor="#FFC93A" />
      <stop offset="1" stopColor="#E9A400" />
    </radialGradient>
    <linearGradient id={`${id}leaf`} x1="0" x2="1">
      <stop offset="0" stopColor="#2F7A2A" />
      <stop offset="1" stopColor="#5DAA3B" />
    </linearGradient>
  </defs>
);

/** One ruffled marigold head. */
export const Marigold: React.FC<{x: number; y: number; r: number; yellow?: boolean; id?: string}> = ({x, y, r, yellow, id = 'mg'}) => {
  const fill = `url(#${id}${yellow ? 'y' : ''})`;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({length: 9}).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * r * 0.62} cy={Math.sin(a) * r * 0.62} r={r * 0.48} fill={fill} />;
      })}
      <circle r={r * 0.7} fill={fill} />
      <circle r={r * 0.2} fill="rgba(160,70,0,0.55)" />
    </g>
  );
};

/** Hanging marigold toran across the top of the frame, dropping in on a spring and swaying. */
export const Toran: React.FC<{at: number; y?: number; dark?: boolean}> = ({at, y = 0, dark = true}) => {
  const f = useCurrentFrame();
  if (f < at - 1) return null;
  const s = spr(f, at, {damping: 12, stiffness: 90});
  const drop = interpolate(s, [0, 1], [-340, 0]);
  const strands = 12;
  return (
    <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: y + drop, overflow: 'visible', filter: dark ? 'drop-shadow(0 10px 14px rgba(0,0,0,0.45))' : 'drop-shadow(0 8px 10px rgba(80,30,0,0.25))'}}>
      <MarigoldDefs id="tor" />
      {/* the cord and the swag of flowers along it */}
      <path d="M -20 30 Q 540 70 1100 30" stroke="#7A2E14" strokeWidth={5} fill="none" />
      {Array.from({length: 30}).map((_, i) => {
        const u = i / 29;
        const x = -20 + u * 1120;
        const yy = 30 + 4 * 40 * u * (1 - u) * 1;
        return <Marigold key={i} id="tor" x={x} y={yy + 6} r={20} yellow={i % 3 === 1} />;
      })}
      {/* mango leaves */}
      {Array.from({length: 15}).map((_, i) => {
        const x = 36 + i * 72;
        const u = (x + 20) / 1120;
        const yy = 30 + 160 * u * (1 - u) + 20;
        const sw = Math.sin(f / 18 + i) * 4;
        return <path key={i} d="M 0 0 C -16 30, -12 70, 0 96 C 12 70, 16 30, 0 0 Z" transform={`translate(${x} ${yy}) rotate(${sw})`} fill="url(#torleaf)" stroke="#1F5A1C" strokeWidth={1.5} />;
      })}
      {/* hanging strands */}
      {Array.from({length: strands}).map((_, i) => {
        const x = 45 + i * (990 / (strands - 1));
        const u = (x + 20) / 1120;
        const top = 30 + 160 * u * (1 - u) + 20;
        const len = 3 + (i % 3 === 1 ? 3 : i % 2 ? 1 : 2);
        const sw = Math.sin(f / 22 + i * 0.8) * 3 + (1 - s) * 10 * Math.sin(i);
        return (
          <g key={i} transform={`translate(${x} ${top}) rotate(${sw})`}>
            <line x1={0} y1={0} x2={0} y2={len * 34} stroke="#7A2E14" strokeWidth={2} />
            {Array.from({length: len}).map((__, j) => (
              <Marigold key={j} id="tor" x={0} y={18 + j * 34} r={16} yellow={(i + j) % 2 === 0} />
            ))}
            <path d="M 0 0 L -7 16 L 7 16 Z" transform={`translate(0 ${len * 34 + 6})`} fill="#C9372C" />
          </g>
        );
      })}
    </svg>
  );
};

/** Falling marigold petals. */
export const Petals: React.FC<{at: number; n?: number; seed?: number; dur?: number}> = ({at, n = 40, seed = 5, dur = 400}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const r = (k: number) => rand(seed * 71 + i * 19 + k);
        const speed = 3 + r(1) * 4;
        const y = -60 + ((t + r(2) * 600) * speed) % 2050;
        const x = r(3) * 1080 + Math.sin((t + r(4) * 100) / (20 + r(5) * 20)) * 50;
        const rot = (t * (2 + r(6) * 5) + r(7) * 360) % 360;
        const sx = Math.abs(Math.cos((t + r(8) * 50) / 9));
        return <ellipse key={i} cx={0} cy={0} rx={9 + r(9) * 6} ry={5 + r(10) * 3} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.3 + 0.7 * sx} 1)`} fill={r(11) > 0.4 ? '#FF9F1C' : '#FFC93A'} opacity={0.9} />;
      })}
    </svg>
  );
};

/* ------------------------------------------------------------ diya */

/** A clay diya. (x, y) is the bowl's centre; it lights at `litAt`. */
export const Diya: React.FC<{x: number; y: number; size?: number; litAt: number; seed?: number}> = ({x, y, size = 160, litAt, seed = 1}) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [litAt, litAt + 10], [0, 1], {...clamp, easing: ease.out});
  const fl = 0.88 + 0.12 * Math.sin(f * 0.9 + seed) + 0.05 * Math.sin(f * 2.3 + seed * 3);
  const w = size;
  const h = size * 0.42;
  const fh = size * 0.42 * lit * fl;
  const id = `diya${seed}`;
  return (
    <div style={{position: 'absolute', left: x - w, top: y - w, width: w * 2, height: w * 2, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: w - w * 1.1, top: w - w * 1.15, width: w * 2.2, height: w * 2.2, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,170,60,${0.42 * lit}) 0%, rgba(255,120,30,${0.16 * lit}) 40%, rgba(255,120,30,0) 70%)`}} />
      <svg width={w * 2} height={w * 2} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C8643A" />
            <stop offset="1" stopColor="#6E2611" />
          </linearGradient>
          <linearGradient id={`${id}f`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFF7D6" />
            <stop offset="0.35" stopColor="#FFC233" />
            <stop offset="1" stopColor="#FF5A00" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g transform={`translate(${w} ${w})`}>
          {/* bowl with a pinched spout on the right */}
          <path d={`M ${-w / 2} ${-h * 0.15} Q ${-w * 0.45} ${h * 0.75}, 0 ${h * 0.8} Q ${w * 0.4} ${h * 0.75}, ${w * 0.5} ${-h * 0.05} L ${w * 0.62} ${-h * 0.32} L ${w * 0.32} ${-h * 0.22} Z`} fill={`url(#${id}c)`} />
          <ellipse cx={0} cy={-h * 0.18} rx={w * 0.5} ry={h * 0.2} fill="#5A1E0C" />
          <ellipse cx={0} cy={-h * 0.2} rx={w * 0.42} ry={h * 0.13} fill="#E0A52F" opacity={0.85} />
          {Array.from({length: 7}).map((_, i) => (
            <circle key={i} cx={-w * 0.33 + i * w * 0.11} cy={h * 0.25 + Math.sin((i / 6) * Math.PI) * h * 0.18} r={w * 0.018} fill="#F2C46A" />
          ))}
          {/* wick + flame */}
          <line x1={w * 0.42} y1={-h * 0.24} x2={w * 0.47} y2={-h * 0.4} stroke="#2A1208" strokeWidth={3} />
          {lit > 0 && <path d={tongue(w * 0.16, fh)} transform={`translate(${w * 0.47} ${-h * 0.38}) rotate(${Math.sin(f * 0.3 + seed) * 4})`} fill={`url(#${id}f)`} />}
        </g>
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------ rangoli */

/** Concentric rangoli, ring by ring, as if being drawn on the floor. */
export const Rangoli: React.FC<{x: number; y: number; r: number; at: number; dur?: number; tilt?: number}> = ({x, y, r, at, dur = 70, tilt = 0.42}) => {
  const f = useCurrentFrame();
  const rings = [
    {k: 8, rr: 0.18, c: '#FFC93A', pw: 0.1, pl: 0.16},
    {k: 12, rr: 0.36, c: '#D6336C', pw: 0.09, pl: 0.2},
    {k: 16, rr: 0.56, c: '#FF7A00', pw: 0.08, pl: 0.2},
    {k: 24, rr: 0.76, c: '#0FA3B1', pw: 0.06, pl: 0.17},
    {k: 32, rr: 0.93, c: '#FFF3DE', pw: 0.035, pl: 0.1},
  ];
  return (
    <svg width={r * 2.4} height={r * 2.4} style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, transform: `scaleY(${tilt})`, overflow: 'visible'}}>
      <g transform={`translate(${r * 1.2} ${r * 1.2})`}>
        <circle r={r * 1.02} fill="rgba(255,240,220,0.06)" stroke="rgba(255,230,190,0.5)" strokeWidth={3} strokeDasharray="4 10" opacity={interpolate(f, [at, at + 12], [0, 1], clamp)} />
        {rings.map((g, ri) => {
          const p = interpolate(f, [at + (ri * dur) / rings.length, at + ((ri + 1) * dur) / rings.length], [0, 1], clamp);
          const shown = Math.floor(p * g.k);
          return (
            <g key={ri}>
              {Array.from({length: shown}).map((_, i) => {
                const a = (i / g.k) * 360;
                return <ellipse key={i} cx={0} cy={-g.rr * r} rx={g.pw * r} ry={g.pl * r * 0.5} transform={`rotate(${a})`} fill={g.c} opacity={0.92} />;
              })}
              {p >= 1 && Array.from({length: g.k}).map((_, i) => {
                const a = ((i + 0.5) / g.k) * Math.PI * 2;
                return <circle key={`d${i}`} cx={Math.sin(a) * g.rr * r} cy={-Math.cos(a) * g.rr * r} r={r * 0.012} fill="#FFF8E6" />;
              })}
            </g>
          );
        })}
        <circle r={r * 0.07 * interpolate(f, [at, at + 10], [0, 1], clamp)} fill="#FFF3DE" />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------ arrow */

/** A golden arrow flying from (x0,y0) to (x1,y1) between `at` and `at + dur`, with a light trail. */
export const Arrow: React.FC<{at: number; dur?: number; x0: number; y0: number; x1: number; y1: number; len?: number}> = ({at, dur = 14, x0, y0, x1, y1, len = 150}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur + 1) return null;
  const p = ease.in(Math.min(1, (f - at) / dur));
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const tp = Math.max(0, p - 0.35);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <line x1={x0 + (x1 - x0) * tp} y1={y0 + (y1 - y0) * tp} x2={x} y2={y} stroke="rgba(255,214,120,0.55)" strokeWidth={10} strokeLinecap="round" style={{filter: 'blur(4px)'}} />
      <g transform={`translate(${x} ${y}) rotate(${ang})`}>
        <line x1={-len} y1={0} x2={0} y2={0} stroke="#F3D58E" strokeWidth={5} />
        <path d="M 0 0 L -26 -11 L -20 0 L -26 11 Z" fill="#FFF1C2" />
        <path d={`M ${-len} 0 L ${-len - 18} -12 L ${-len + 14} 0 L ${-len - 18} 12 Z`} fill="#E0532F" />
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------ effigy */

/** Local effigy box: 1000 wide, heads along the top (y 0..170), body below. */
export const EFFIGY_W = 1000;
export const headCenter = (i: number) => ({x: 50 + i * 100, y: 112});

const HEAD_HUES = ['#F2B66D', '#F0A95C', '#F4BE78', '#EFA04F', '#F2B66D', '#F4C27E', '#EFA04F', '#F2B66D', '#F0A95C', '#F4BE78'];

const Head: React.FC<{i: number; hitAt?: number}> = ({i, hitAt}) => {
  const f = useCurrentFrame();
  const {x} = headCenter(i);
  const hit = hitAt !== undefined && f >= hitAt;
  const t = hit ? f - (hitAt as number) : 0;
  const flash = hit ? interpolate(t, [0, 3, 10], [0, 1, 0], clamp) : 0;
  const char = hit ? interpolate(t, [2, 30], [0, 1], clamp) : 0;
  const jolt = hit ? Math.sin(t * 2.2) * 6 * Math.exp(-t / 6) : 0;
  const big = i === 4 || i === 5;
  const sc = big ? 1.12 : 1;
  const skin = HEAD_HUES[i];
  return (
    <g transform={`translate(${x} 0) scale(${sc}) translate(0 ${big ? -10 : 0}) rotate(${jolt} 0 110)`} style={{filter: `brightness(${1 - char * 0.75}) saturate(${1 - char * 0.6})`}}>
      {/* crown */}
      <path d="M -42 58 L -40 22 L -24 36 L -12 4 L 0 30 L 12 4 L 24 36 L 40 22 L 42 58 Z" fill="#E7B53C" stroke="#8A5A10" strokeWidth={2} />
      <circle cx={0} cy={42} r={6} fill="#C9372C" />
      <rect x={-44} y={54} width={88} height={10} rx={3} fill="#C9372C" />
      {/* face */}
      <ellipse cx={0} cy={112} rx={42} ry={56} fill={skin} stroke="#8A4A1C" strokeWidth={2} />
      {/* brows + eyes */}
      <path d="M -30 92 L -8 100 M 30 92 L 8 100" stroke="#1A0E08" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={-16} cy={106} rx={7} ry={5} fill="#FFFFFF" />
      <ellipse cx={16} cy={106} rx={7} ry={5} fill="#FFFFFF" />
      <circle cx={-15} cy={106} r={3} fill="#1A0E08" />
      <circle cx={15} cy={106} r={3} fill="#1A0E08" />
      {/* tilak */}
      <path d="M 0 70 L -4 88 L 4 88 Z" fill="#C9372C" />
      {/* curled moustache */}
      <path d="M 0 132 C -14 124, -30 126, -34 140 C -36 150, -26 152, -24 144 C -20 136, -10 136, 0 140 C 10 136, 20 136, 24 144 C 26 152, 36 150, 34 140 C 30 126, 14 124, 0 132 Z" fill="#1A0E08" />
      <path d="M -10 152 Q 0 158 10 152" stroke="#7A1E10" strokeWidth={3} fill="none" />
      {flash > 0 && <ellipse cx={0} cy={100} rx={56} ry={78} fill="#FFF3C4" opacity={flash} />}
    </g>
  );
};

/** The paper effigy: ten heads (each can be hit), a decorated body, and a whole-body burn. */
export const Effigy: React.FC<{cx: number; top: number; scale: number; hits?: (number | undefined)[]; burnAt?: number; bodyDim?: number; badges?: number[]}> = ({cx, top, scale, hits = [], burnAt, bodyDim = 0, badges = []}) => {
  const f = useCurrentFrame();
  const burn = burnAt !== undefined ? interpolate(f, [burnAt, burnAt + 50], [0, 1], clamp) : 0;
  return (
    <div style={{position: 'absolute', left: cx - (EFFIGY_W * scale) / 2, top, width: EFFIGY_W, height: 1500, transform: `scale(${scale})`, transformOrigin: '0 0'}}>
      <svg width={EFFIGY_W} height={1500} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="eff-body" x1="0" x2="1">
            <stop offset="0" stopColor="#8E1620" />
            <stop offset="0.5" stopColor="#C42A2F" />
            <stop offset="1" stopColor="#8E1620" />
          </linearGradient>
          <linearGradient id="eff-skirt" x1="0" x2="1">
            <stop offset="0" stopColor="#1F5A3A" />
            <stop offset="0.5" stopColor="#2E7D4F" />
            <stop offset="1" stopColor="#1F5A3A" />
          </linearGradient>
          <linearGradient id="eff-char" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#120806" />
            <stop offset="1" stopColor="#120806" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g style={{filter: `brightness(${1 - bodyDim * 0.6 - burn * 0.55})`}}>
          {/* arms */}
          <rect x={250} y={250} width={70} height={430} rx={34} fill="#A81E26" transform="rotate(12 285 250)" />
          <rect x={680} y={250} width={70} height={430} rx={34} fill="#A81E26" transform="rotate(-12 715 250)" />
          {/* torso */}
          <path d="M 330 200 L 670 200 L 720 820 L 280 820 Z" fill="url(#eff-body)" stroke="#5A0F14" strokeWidth={3} />
          {Array.from({length: 5}).map((_, i) => (
            <line key={i} x1={380 + i * 60} y1={210} x2={360 + i * 70} y2={810} stroke="#E7B53C" strokeWidth={4} opacity={0.75} />
          ))}
          {Array.from({length: 6}).map((_, i) => (
            <path key={`d${i}`} d={`M 500 ${280 + i * 90} l 26 30 l -26 30 l -26 -30 Z`} fill="#E7B53C" opacity={0.9} />
          ))}
          <rect x={290} y={790} width={420} height={36} fill="#E7B53C" />
          {/* skirt */}
          <path d="M 280 826 L 720 826 L 820 1460 L 180 1460 Z" fill="url(#eff-skirt)" stroke="#123A24" strokeWidth={3} />
          {Array.from({length: 7}).map((_, i) => (
            <line key={`s${i}`} x1={330 + i * 57} y1={830} x2={240 + i * 87} y2={1450} stroke="#E7B53C" strokeWidth={3} opacity={0.6} />
          ))}
          <rect x={176} y={1400} width={648} height={40} fill="#E7B53C" />
          {/* shoulders bar that carries the heads */}
          <rect x={20} y={160} width={960} height={44} rx={22} fill="#7A1620" stroke="#E7B53C" strokeWidth={3} />
        </g>
        {burn > 0 && <rect x={170} y={1460 - 1300 * burn} width={660} height={1300 * burn} fill="url(#eff-char)" opacity={0.7} />}
        {Array.from({length: 10}).map((_, i) => (
          <Head key={i} i={i} hitAt={hits[i]} />
        ))}
      </svg>
      {/* per-head fires */}
      {Array.from({length: 10}).map((_, i) => {
        const h = hits[i];
        if (h === undefined) return null;
        const {x} = headCenter(i);
        return <Flames key={i} x={x} y={150} w={110} h={150} at={h + 2} seed={i + 11} />;
      })}
      {/* number badges for the habit list */}
      {badges.map((at, i) => {
        if (f < at) return null;
        const s = spr(f, at, {damping: 12, stiffness: 180});
        const gone = hits[i] !== undefined && f >= (hits[i] as number);
        if (gone) return null;
        const {x} = headCenter(i);
        return (
          <div key={`b${i}`} style={{position: 'absolute', left: x - 26, top: -64, width: 52, height: 52, borderRadius: 26, background: FEST.marigold, color: '#2A0710', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, boxShadow: '0 6px 14px rgba(0,0,0,0.4)'}}>
            {i + 1}
          </div>
        );
      })}
      {/* whole-body burn */}
      {burnAt !== undefined && (
        <>
          <Flames x={500} y={1560} w={820} h={1150} at={burnAt} seed={91} grow={34} />
          <Flames x={500} y={1050} w={560} h={640} at={burnAt + 14} seed={93} grow={24} />
          <Flames x={500} y={300} w={1040} h={420} at={burnAt + 24} seed={95} grow={20} />
        </>
      )}
    </div>
  );
};

/** Map a local effigy point to canvas coordinates. */
export const effigyPoint = (cx: number, top: number, scale: number, lx: number, ly: number) => ({
  x: cx - (EFFIGY_W * scale) / 2 + lx * scale,
  y: top + ly * scale,
});
