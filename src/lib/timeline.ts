// Musical grid and keyframe helpers shared by every reel.

export const FPS = 24;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// MIZRAB runs at 128 BPM and the arrangement starts on a downbeat at 0:00.
export const BPM = 128;
export const BEAT = 60 / BPM; // 0.46875s
export const BAR = BEAT * 4; // 1.875s = 45 frames

// FL Studio playlist geometry in source pixels (1080x1920 screen recording).
export const LANE_TOP = 248;
export const LANE_H = 108;
export const LANE_X = 160; // left edge of clip area, after the track headers
export const laneCy = (track: number) => LANE_TOP + (track - 1) * LANE_H + LANE_H / 2;
export const lanesRect = (from: number, to: number, pad = 6): Rect => [
  LANE_X - pad,
  LANE_TOP + (from - 1) * LANE_H - pad,
  WIDTH - LANE_X + pad * 2,
  (to - from + 1) * LANE_H + pad * 2,
];

export type Rect = [x: number, y: number, w: number, h: number];
export type Ease = 'inOut' | 'out' | 'in' | 'linear';

export type Key = {at: number; cut?: boolean; ease?: Ease};

const curves: Record<Ease, (p: number) => number> = {
  linear: (p) => p,
  in: (p) => p * p * p,
  out: (p) => 1 - Math.pow(1 - p, 3),
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
};

// Interpolates the numeric fields of time-keyed objects. A key with `cut`
// is jumped to instead of eased into, which is how hard camera cuts work.
export function sample<T extends Key>(keys: T[], t: number, fields: (keyof T)[]): T {
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].at <= t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  if (!b || b.cut || t <= a.at) return a;
  const p = curves[b.ease ?? 'inOut'](Math.min(1, (t - a.at) / (b.at - a.at)));
  const out = {...a};
  for (const f of fields) {
    const va = a[f] as unknown;
    const vb = b[f] as unknown;
    if (typeof va === 'number' && typeof vb === 'number') {
      (out[f] as unknown) = va + (vb - va) * p;
    } else if (Array.isArray(va) && Array.isArray(vb)) {
      (out[f] as unknown) = va.map((v: number, k: number) => v + ((vb[k] as number) - v) * p);
    }
  }
  return out;
}

// Decaying envelope that peaks on every beat of the source track.
export function beatPulse(srcTime: number, sharpness = 7) {
  const phase = (srcTime / BEAT) % 1;
  return Math.exp(-phase * sharpness);
}

export const barNumber = (srcTime: number) => Math.floor(srcTime / BAR + 1e-6) + 1;
