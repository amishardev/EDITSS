import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {src} from '../assets';
import {C, clamp, ease, track} from '../theme';

/**
 * Camera: keyframed push-ins on everything inside. (x, y) is the canvas point
 * shown at frame centre, z the zoom. z=1, x=540, y=960 is identity.
 */
export const Camera: React.FC<{
  z?: [number, number][];
  x?: [number, number][];
  y?: [number, number][];
  r?: [number, number][];
  children: React.ReactNode;
}> = ({z, x, y, r, children}) => {
  const f = useCurrentFrame();
  const zz = z ? track(f, z, ease.inOut) : 1;
  const xx = x ? track(f, x, ease.inOut) : 540;
  const yy = y ? track(f, y, ease.inOut) : 960;
  const rr = r ? track(f, r, ease.inOut) : 0;
  return (
    <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(540px, 960px) rotate(${rr}deg) scale(${zz}) translate(${-xx}px, ${-yy}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

/** Film grain + vignette to keep flat colour fields from feeling digital. */
export const Grain: React.FC<{opacity?: number; vignette?: number}> = ({opacity = 0.05, vignette = 0.25}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="1080" height="1920" style={{position: 'absolute', opacity, mixBlendMode: 'overlay'}}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter={`url(#g${seed})`} />
      </svg>
      {vignette > 0 && (
        <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`}} />
      )}
    </AbsoluteFill>
  );
};

/** Brand backgrounds: warm studio, deep teal, soft green. */
export const Bg: React.FC<{kind: 'warm' | 'teal' | 'green' | 'ink'; glow?: [number, number]}> = ({kind, glow = [540, 820]}) => {
  const [gx, gy] = glow;
  const map = {
    warm: `radial-gradient(900px 900px at ${gx}px ${gy}px, rgba(220,252,231,0.85) 0%, rgba(220,252,231,0) 70%), radial-gradient(700px 600px at 900px 1700px, rgba(217,154,43,0.10) 0%, rgba(217,154,43,0) 70%), ${C.off}`,
    teal: `radial-gradient(1000px 1000px at ${gx}px ${gy}px, rgba(22,163,74,0.30) 0%, rgba(22,163,74,0) 65%), linear-gradient(180deg, #1C474C 0%, ${C.teal} 45%, ${C.tealDark} 100%)`,
    green: `radial-gradient(900px 900px at ${gx}px ${gy}px, #FFFFFF 0%, rgba(255,255,255,0) 70%), linear-gradient(180deg, ${C.soft} 0%, #C9F5D8 100%)`,
    ink: `radial-gradient(900px 900px at ${gx}px ${gy}px, rgba(23,58,62,0.9) 0%, rgba(23,58,62,0) 70%), #071416`,
  };
  return <AbsoluteFill style={{background: map[kind]}} />;
};

/** Full-bleed photo with a slow Ken Burns move and optional grading. */
export const Photo: React.FC<{
  file: string;
  z?: [number, number][];
  x?: [number, number][];
  y?: [number, number][];
  blur?: number;
  darken?: number;
  style?: React.CSSProperties;
}> = ({file, z = [[0, 1]], x = [[0, 0]], y = [[0, 0]], blur = 0, darken = 0, style}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img
        src={src(file)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${track(f, x, ease.soft)}px, ${track(f, y, ease.soft)}px) scale(${track(f, z, ease.soft)})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      {darken > 0 && <AbsoluteFill style={{background: `rgba(7,20,22,${darken})`}} />}
    </AbsoluteFill>
  );
};

/** Quick white/brand flash for shutter moments and cuts. */
export const Flash: React.FC<{at: number; dur?: number; color?: string; peak?: number}> = ({at, dur = 10, color = '#FFFFFF', peak = 0.9}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + dur], [0, peak, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

/** Expanding tap ripple, drawn in whatever coordinate space it is placed in. */
export const Tap: React.FC<{at: number; x: number; y: number; r?: number; color?: string}> = ({at, x, y, r = 120, color = 'rgba(255,255,255,0.9)'}) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > at + 22) return null;
  const press = interpolate(f, [at - 6, at, at + 4], [0, 1, 0.9], clamp);
  const ring = interpolate(f, [at, at + 20], [0, 1], {...clamp, easing: ease.out});
  return (
    <>
      <div style={{position: 'absolute', left: x - r * 0.45, top: y - r * 0.45, width: r * 0.9, height: r * 0.9, borderRadius: '50%', background: color, opacity: press * (1 - ring) * 0.55, transform: `scale(${0.7 + press * 0.3})`}} />
      <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${r * 0.06}px solid ${color}`, opacity: (1 - ring) * (f >= at ? 1 : 0), transform: `scale(${0.3 + ring * 0.7})`}} />
    </>
  );
};

/** Soft spotlight ring that draws attention to a rectangle (any coord space). */
export const Spot: React.FC<{at: number; out?: number; x: number; y: number; w: number; h: number; radius?: number; color?: string; stroke?: number}> = ({
  at, out, x, y, w, h, radius = 40, color = C.leaf, stroke = 10,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + 12], [0, 1], {...clamp, easing: ease.out});
  const o = out !== undefined ? interpolate(f, [out, out + 8], [1, 0], clamp) : 1;
  const pad = interpolate(p, [0, 1], [60, 18]);
  const pulse = 1 + Math.sin((f - at) / 6) * 0.004;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - pad,
        top: y - pad,
        width: w + pad * 2,
        height: h + pad * 2,
        borderRadius: radius + pad * 0.5,
        border: `${stroke}px solid ${color}`,
        boxShadow: `0 0 0 ${stroke * 2.4}px ${color}33, 0 0 60px ${color}66`,
        opacity: p * o,
        transform: `scale(${pulse})`,
      }}
    />
  );
};

/** Horizontal scan beam sweeping a region (coords of its container). */
export const ScanBeam: React.FC<{at: number; dur: number; x: number; y0: number; y1: number; w: number; color?: string; loops?: number}> = ({
  at, dur, x, y0, y1, w, color = C.leaf, loops = 1,
}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const t = ((f - at) / dur) * loops;
  const phase = t % 1;
  const dir = Math.floor(t) % 2 === 0 ? phase : 1 - phase;
  const yy = y0 + (y1 - y0) * ease.inOut(dir);
  const o = interpolate(f, [at, at + 5, at + dur - 5, at + dur], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y0, width: w, height: y1 - y0, opacity: o, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: yy - y0 - 220, width: w, height: 220, background: `linear-gradient(180deg, ${color}00 0%, ${color}55 100%)`}} />
      <div style={{position: 'absolute', left: 0, top: yy - y0 - 6, width: w, height: 12, borderRadius: 6, background: '#B9F6CF', boxShadow: `0 0 30px 8px ${color}, 0 0 80px 20px ${color}88`}} />
    </div>
  );
};

/** Moving soft light sweep for premium surfaces. */
export const Sheen: React.FC<{at: number; dur?: number; angle?: number}> = ({at, dur = 26, angle = 115}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [-0.4, 1.4], {...clamp, easing: ease.inOut});
  if (f < at || f > at + dur) return null;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, rgba(255,255,255,0) ${p * 100 - 12}%, rgba(255,255,255,0.35) ${p * 100}%, rgba(255,255,255,0) ${p * 100 + 12}%)`,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Wipe-reveal wrapper (clip-path) for masked transitions. */
export const Reveal: React.FC<{at: number; dur?: number; from?: 'bottom' | 'top' | 'left' | 'right' | 'circle'; cx?: number; cy?: number; children: React.ReactNode}> = ({
  at, dur = 16, from = 'bottom', cx = 540, cy = 960, children,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: ease.inOut});
  const clip = {
    bottom: `inset(${(1 - p) * 100}% 0 0 0)`,
    top: `inset(0 0 ${(1 - p) * 100}% 0)`,
    left: `inset(0 ${(1 - p) * 100}% 0 0)`,
    right: `inset(0 0 0 ${(1 - p) * 100}%)`,
    circle: `circle(${p * 2300}px at ${cx}px ${cy}px)`,
  }[from];
  return <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>;
};

/** Fade/visibility gate for a scene between two frames. */
export const Scene: React.FC<{from: number; to: number; fadeIn?: number; fadeOut?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  from, to, fadeIn = 0, fadeOut = 0, children, style,
}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const o = Math.min(
    fadeIn ? interpolate(f, [from, from + fadeIn], [0, 1], clamp) : 1,
    fadeOut ? interpolate(f, [to - fadeOut, to], [1, 0], clamp) : 1,
  );
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};

/**
 * Crop of a photo into a box, keeping image point (fx, fy) centred and the box
 * always covered. iw/ih are the image's pixel size.
 */
export const FocusCrop: React.FC<{
  file: string;
  iw: number;
  ih: number;
  fx: number;
  fy: number;
  zoom?: number;
  w: number;
  h: number;
  drift?: [number, number];
  style?: React.CSSProperties;
}> = ({file, iw, ih, fx, fy, zoom = 1, w, h, drift = [0, 0], style}) => {
  const sc = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * sc;
  const dh = ih * sc;
  const left = Math.min(0, Math.max(w - dw, w / 2 - fx * sc + drift[0]));
  const top = Math.min(0, Math.max(h - dh, h / 2 - fy * sc + drift[1]));
  return (
    <div style={{position: 'absolute', overflow: 'hidden', width: w, height: h, ...style}}>
      <Img src={src(file)} style={{position: 'absolute', left, top, width: dw, height: dh}} />
    </div>
  );
};

/** Clipped window onto a region of a real screen image, scaled up (a "lens"). */
export const ScreenCrop: React.FC<{
  screen: string;
  screenH: number;
  rect: {x: number; y: number; w: number; h: number};
  width: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({screen, screenH, rect, width, radius = 36, style}) => {
  const k = width / rect.w;
  return (
    <div style={{position: 'absolute', width, height: rect.h * k, overflow: 'hidden', borderRadius: radius, ...style}}>
      <Img src={src(screen)} style={{position: 'absolute', left: -rect.x * k, top: -rect.y * k, width: 1626 * k, height: screenH * k}} />
    </div>
  );
};
