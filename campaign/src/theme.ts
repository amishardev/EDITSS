import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Platform-safe area: the app's own story guidance keeps key content out of
// the top 250px and bottom 300px of a 1080x1920 frame.
export const SAFE = {top: 250, bottom: H - 300, left: 70, right: W - 70};

export const C = {
  leaf: '#16A34A',
  deep: '#15803D',
  teal: '#173A3E',
  tealDark: '#0E2629',
  haldi: '#D99A2B',
  soft: '#DCFCE7',
  off: '#FAF8F5',
  ink: '#0F172A',
  sub: '#475569',
  border: '#ECE8E2',
  white: '#FFFFFF',
  // tile tints sampled from the real meal-result screen
  tileCal: '#FBF1DE',
  tileProt: '#DCFCE7',
  tileCarb: '#ECEFFC',
  tileFat: '#FBEDF4',
  scoreBar: '#FACB15',
};

export const F = {
  display: "'Sora', sans-serif",
  body: "'Poppins', sans-serif",
};

/** Music: 128 BPM, so one beat is 14.0625 frames and one bar 56.25. */
export const BEAT = (60 / 128) * FPS;
export const BAR = BEAT * 4;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0..1 eased progress between two frames. */
export const prog = (f: number, a: number, b: number, e = ease.out) =>
  interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/** Piecewise keyframe track: [[frame, value], ...] with eased segments. */
export const track = (f: number, keys: [number, number][], e = ease.inOut) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (f <= f1) return interpolate(f, [f0, f1], [v0, v1], {...clamp, easing: e});
  }
  return keys[keys.length - 1][1];
};

/** Spring that starts at `at`. */
export const spr = (
  f: number,
  at: number,
  cfg: {damping?: number; stiffness?: number; mass?: number} = {},
) =>
  spring({
    frame: f - at,
    fps: FPS,
    config: {damping: cfg.damping ?? 16, stiffness: cfg.stiffness ?? 140, mass: cfg.mass ?? 0.8},
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Visible window between two frames with short fades. */
export const windowOpacity = (f: number, a: number, b: number, fade = 8) =>
  interpolate(f, [a, a + fade, b - fade, b], [0, 1, 1, 0], clamp);
