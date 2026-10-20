import React from 'react';

/**
 * Line icons for the education series, drawn on a 64x64 grid with round
 * strokes. They take the current colour, so a scene tints them with its accent.
 */
export type IconName =
  | 'bowl' | 'cup' | 'glass' | 'leaf' | 'egg' | 'salt' | 'cube' | 'clock' | 'moon' | 'walk'
  | 'drop' | 'oil' | 'bread' | 'tag' | 'heart' | 'check' | 'cross' | 'lemon' | 'grain' | 'flame'
  | 'scale' | 'spoon' | 'plate' | 'milk' | 'sparkle' | 'bolt' | 'sun' | 'bar' | 'jar' | 'pill'
  | 'gut' | 'sweet' | 'chart' | 'fork';

const P: Record<IconName, React.ReactNode> = {
  bowl: (<><path d="M8 30h48c0 13-10.7 22-24 22S8 43 8 30z" /><path d="M20 30c1-6 6-10 12-10s11 4 12 10" /><path d="M22 52h20" /></>),
  cup: (<><path d="M12 22h32v16c0 9-7 16-16 16s-16-7-16-16V22z" /><path d="M44 27h4a6 6 0 0 1 0 12h-4" /><path d="M20 8c-2 3 2 5 0 8M28 8c-2 3 2 5 0 8M36 8c-2 3 2 5 0 8" /></>),
  glass: (<><path d="M16 8h32l-4 48H20L16 8z" /><path d="M18 24h28" /><path d="M24 34c3 2 7 2 10 0" /></>),
  leaf: (<><path d="M12 52C12 26 28 12 54 10c-2 26-16 42-42 42z" /><path d="M12 52L36 28" /></>),
  egg: (<><path d="M32 6c10 0 18 16 18 28a18 18 0 0 1-36 0C14 22 22 6 32 6z" /><path d="M24 36a8 8 0 0 0 8 8" /></>),
  salt: (<><path d="M22 24h20l4 32H18l4-32z" /><path d="M24 24c0-8 3-14 8-14s8 6 8 14" /><circle cx="28" cy="16" r="1.4" /><circle cx="34" cy="14" r="1.4" /><circle cx="32" cy="19" r="1.4" /></>),
  cube: (<><path d="M32 8l20 11v24L32 54 12 43V19L32 8z" /><path d="M12 19l20 11 20-11M32 30v24" /></>),
  clock: (<><circle cx="32" cy="32" r="24" /><path d="M32 18v14l10 6" /></>),
  moon: (<><path d="M44 42A20 20 0 0 1 26 12a22 22 0 1 0 26 26 20 20 0 0 1-8 4z" /><path d="M48 12v6M45 15h6" /></>),
  walk: (<><circle cx="36" cy="10" r="5" /><path d="M34 18l-6 16 8 8v14M28 34l-8 22M30 22l-10 6v8M36 26l8 8 8-2" /></>),
  drop: (<><path d="M32 6C24 18 14 28 14 40a18 18 0 0 0 36 0C50 28 40 18 32 6z" /><path d="M24 42a8 8 0 0 0 8 8" /></>),
  oil: (<><path d="M24 6h16v8l6 6v34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V20l6-6V6z" /><path d="M18 30h28" /><path d="M32 36c-3 4-5 6-5 9a5 5 0 0 0 10 0c0-3-2-5-5-9z" /></>),
  bread: (<><path d="M10 26c0-8 10-14 22-14s22 6 22 14c0 4-3 6-6 6v20H16V32c-3 0-6-2-6-6z" /><path d="M26 40h12" /></>),
  tag: (<><path d="M8 32V10h22l26 26-20 20L8 32z" /><circle cx="20" cy="20" r="4" /><path d="M28 36l8 8M32 32l8 8" /></>),
  heart: (<><path d="M32 54S8 40 8 22a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 18-24 32-24 32z" /><path d="M16 30h8l4-6 6 12 4-6h10" /></>),
  check: (<><circle cx="32" cy="32" r="24" /><path d="M20 33l8 8 16-18" /></>),
  cross: (<><circle cx="32" cy="32" r="24" /><path d="M22 22l20 20M42 22L22 42" /></>),
  lemon: (<><ellipse cx="32" cy="34" rx="22" ry="17" /><path d="M32 17v34M14 34h36M19 22l26 24M45 22L19 46" /><path d="M50 18l6-6" /></>),
  grain: (<><path d="M32 58V20" /><path d="M32 22c-6-2-9-8-8-14 6 1 9 7 8 14zM32 22c6-2 9-8 8-14-6 1-9 7-8 14z" /><path d="M32 36c-7-2-11-8-10-15 7 1 11 8 10 15zM32 36c7-2 11-8 10-15-7 1-11 8-10 15z" /><path d="M32 50c-7-2-11-8-10-15 7 1 11 8 10 15zM32 50c7-2 11-8 10-15-7 1-11 8-10 15z" /></>),
  flame: (<><path d="M32 58c-11 0-18-8-18-18 0-12 12-18 12-32 8 6 10 14 8 20 4-2 6-6 6-10 6 6 10 12 10 22 0 10-7 18-18 18z" /><path d="M32 58c-5 0-8-4-8-8 0-6 8-10 8-16 4 6 8 10 8 16 0 4-3 8-8 8z" /></>),
  scale: (<><path d="M12 50h40M32 50V14M20 14h24" /><path d="M20 14l-8 18h16l-8-18zM44 14l-8 18h16l-8-18z" /></>),
  spoon: (<><ellipse cx="32" cy="18" rx="10" ry="13" /><path d="M32 31v27" /></>),
  plate: (<><circle cx="32" cy="32" r="24" /><circle cx="32" cy="32" r="15" /><path d="M6 14v16M10 14v8M2 14v8M6 30v26M58 10c-4 4-4 16 0 20v26" /></>),
  milk: (<><path d="M22 6h20v8l6 10v32H16V24l6-10V6z" /><path d="M16 30h32" /><path d="M22 14h20" /></>),
  sparkle: (<><path d="M32 8l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15z" /><path d="M50 44l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" /></>),
  bolt: (<><path d="M36 6L14 36h16l-4 22 24-32H34l2-20z" /></>),
  sun: (<><circle cx="32" cy="32" r="11" /><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6" /></>),
  bar: (<><rect x="8" y="22" width="48" height="20" rx="6" /><path d="M18 22v20M46 22v20M24 30h16M24 35h10" /></>),
  jar: (<><path d="M20 8h24v8H20z" /><path d="M18 16h28l2 8v28a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V24l2-8z" /><path d="M16 32h32" /></>),
  pill: (<><rect x="8" y="22" width="48" height="20" rx="10" transform="rotate(-35 32 32)" /><path d="M26 23l12 17" /></>),
  gut: (<><path d="M22 10v8c-8 0-12 6-12 12s4 10 10 10h8c4 0 6 3 6 6s-2 6-6 6h-4" /><path d="M42 10v8c8 0 12 6 12 12 0 8-6 12-14 12" /><path d="M24 30h16" /></>),
  sweet: (<><path d="M16 26l16-14 16 14v26H16V26z" /><path d="M16 36h32" /><circle cx="26" cy="44" r="2" /><circle cx="38" cy="44" r="2" /><circle cx="32" cy="28" r="2" /></>),
  chart: (<><path d="M10 54h44M10 54V10" /><rect x="16" y="34" width="8" height="20" /><rect x="30" y="24" width="8" height="30" /><rect x="44" y="14" width="8" height="40" /></>),
  fork: (<><path d="M20 8v14a6 6 0 0 0 12 0V8M26 8v48" /><path d="M44 8c-6 4-6 18 0 22v26" /></>),
};

export const Icon: React.FC<{name: IconName; size?: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({name, size = 96, color = 'currentColor', stroke = 3.2, style}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {P[name]}
  </svg>
);
