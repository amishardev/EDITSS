/** Shared world pieces: skies, the moon, clouds, skylines, ground text. */
import { C } from "../engine/palette";
import { clamp, fillV, glow, haze, lerp, rgba } from "../engine/draw";
import { hash, mulberry32, noise1 } from "../engine/rng";

type Ctx = CanvasRenderingContext2D;

export type SkyMood = "night" | "city" | "dusk" | "dawn" | "blue";

const SKIES: Record<SkyMood, [number, string][]> = {
  night: [
    [0, "#03050b"],
    [0.55, "#08101f"],
    [1, "#16233b"],
  ],
  city: [
    [0, "#04060c"],
    [0.5, "#0d1424"],
    [0.85, "#2a2433"],
    [1, "#4a3428"],
  ],
  dusk: [
    [0, "#0b1226"],
    [0.5, "#2a3558"],
    [0.82, "#7a5a6a"],
    [1, "#d08a64"],
  ],
  dawn: [
    [0, "#1b2b48"],
    [0.45, "#4c6688"],
    [0.8, "#b9a2a4"],
    [1, "#f2c29a"],
  ],
  blue: [
    [0, "#0c1a33"],
    [0.6, "#21395c"],
    [1, "#3d5f86"],
  ],
};

export const drawSky = (ctx: Ctx, w: number, horizonY: number, mood: SkyMood) => {
  fillV(ctx, 0, 0, w, horizonY + 2, SKIES[mood]);
};

/** sparse, varied stars with gentle twinkle. density ~ stars per megapixel */
export const drawStars = (
  ctx: Ctx,
  w: number,
  hMax: number,
  T: number,
  opts: { density?: number; seed?: number; alpha?: number; rotate?: number; reveal?: number } = {},
) => {
  const { density = 160, seed = 7, alpha = 1, rotate = 0, reveal = 1 } = opts;
  const n = Math.round((density * w * hMax) / 1e6);
  const r = mulberry32(seed);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const cx = w * 0.5;
  const cy = -hMax * 0.6;
  for (let i = 0; i < n; i++) {
    let x = r() * w * 1.6 - w * 0.3;
    let y = r() * hMax;
    const mag = Math.pow(r(), 3.2);
    const order = r();
    if (order > reveal) continue;
    if (rotate) {
      const dx = x - cx;
      const dy = y - cy;
      const a = rotate;
      x = cx + dx * Math.cos(a) - dy * Math.sin(a);
      y = cy + dx * Math.sin(a) + dy * Math.cos(a);
    }
    if (x < -4 || x > w + 4 || y < -4 || y > hMax) continue;
    const tw = 0.75 + 0.25 * Math.sin(T * (1.3 + r() * 2.5) + i);
    const fade = clamp(1 - y / hMax) * 0.6 + 0.4;
    const a = (0.25 + mag * 0.75) * tw * alpha * fade;
    const tint = r() > 0.8 ? "#ffe2c0" : r() > 0.5 ? "#d4e2ff" : "#ffffff";
    ctx.fillStyle = rgba(tint, a);
    const s = 0.9 + mag * 2.1;
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
    if (mag > 0.55) glow(ctx, x, y, 10 + mag * 16, tint, a * 0.35, 0.08);
  }
  ctx.restore();
};

/** The moon: soft disc, faint maria, wide halo. phase 0 = full. */
export const drawMoon = (
  ctx: Ctx,
  x: number,
  y: number,
  r: number,
  opts: { halo?: number; alpha?: number; warm?: number } = {},
) => {
  const { halo = 1, alpha = 1, warm = 0 } = opts;
  const tint = warm > 0 ? "#f6e4c8" : C.moon;
  glow(ctx, x, y, r * 9 * halo, C.moonDeep, 0.16 * alpha * halo, 0.05);
  glow(ctx, x, y, r * 3.2 * halo, tint, 0.22 * alpha * halo, 0.15);
  ctx.save();
  ctx.globalAlpha = alpha;
  const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
  g.addColorStop(0, "#fbfdff");
  g.addColorStop(0.7, "#e4ecf6");
  g.addColorStop(1, "#c4d2e4");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  // maria
  ctx.globalAlpha = alpha * 0.16;
  ctx.fillStyle = "#6f7f99";
  const spots: [number, number, number][] = [
    [-0.28, -0.22, 0.26],
    [0.12, -0.3, 0.18],
    [0.22, 0.05, 0.22],
    [-0.1, 0.18, 0.16],
    [-0.38, 0.12, 0.12],
  ];
  ctx.filter = `blur(${Math.max(1, r * 0.06)}px)`;
  for (const [dx, dy, rr] of spots) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, rr * r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

/** drifting soft clouds; lit from the moon side */
export const drawClouds = (
  ctx: Ctx,
  w: number,
  yTop: number,
  yBot: number,
  T: number,
  opts: { seed?: number; count?: number; speed?: number; color?: string; alpha?: number; lit?: string } = {},
) => {
  const { seed = 3, count = 7, speed = 8, color = "#0d1320", alpha = 0.6, lit = C.moonDeep } = opts;
  const r = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const baseX = r() * (w + 900) - 450;
    const y = lerp(yTop, yBot, r());
    const sc = 0.6 + r() * 1.2;
    const sp = speed * (0.5 + r());
    const x = ((baseX + T * sp) % (w + 900)) - 450;
    for (let j = 0; j < 6; j++) {
      const ox = (r() - 0.5) * 420 * sc;
      const oy = (r() - 0.5) * 60 * sc;
      const rr = (80 + r() * 140) * sc;
      const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rr);
      g.addColorStop(0, rgba(color, alpha * 0.55));
      g.addColorStop(0.6, rgba(color, alpha * 0.22));
      g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - rr, y + oy - rr, rr * 2, rr * 2);
      if (j === 0) {
        const g2 = ctx.createRadialGradient(x + ox, y + oy - rr * 0.3, 0, x + ox, y + oy - rr * 0.3, rr * 0.8);
        g2.addColorStop(0, rgba(lit, alpha * 0.12));
        g2.addColorStop(1, rgba(lit, 0));
        ctx.fillStyle = g2;
        ctx.fillRect(x + ox - rr, y + oy - rr * 1.1, rr * 2, rr * 1.6);
      }
    }
  }
  ctx.restore();
};

export type Building = { x: number; w: number; h: number; seed: number };

export const makeSkyline = (seed: number, width: number, minH: number, maxH: number, minW = 40, maxW = 160) => {
  const r = mulberry32(seed);
  const out: Building[] = [];
  let x = -60;
  while (x < width + 60) {
    const bw = minW + r() * (maxW - minW);
    const tall = r() > 0.85 ? 1.5 : 1;
    out.push({ x, w: bw, h: (minH + Math.pow(r(), 1.7) * (maxH - minH)) * tall, seed: Math.floor(r() * 1e6) });
    x += bw + (r() > 0.7 ? r() * 18 : 0);
  }
  return out;
};

/**
 * Silhouetted skyline with lit windows.
 * litFn(buildingIndex, windowIndex) -> 0..1 lets callers switch windows on/off musically.
 */
export const drawSkyline = (
  ctx: Ctx,
  bs: Building[],
  baseY: number,
  opts: {
    color?: string;
    windowColor?: string;
    windowAlt?: string;
    litChance?: number;
    win?: number;
    alpha?: number;
    offsetX?: number;
    litFn?: (bi: number, wi: number, base: number) => number;
    beacon?: number;
  } = {},
) => {
  const {
    color = "#06080e",
    windowColor = C.sodium,
    windowAlt = C.warmWhite,
    litChance = 0.22,
    win = 7,
    alpha = 1,
    offsetX = 0,
    litFn,
    beacon = 0,
  } = opts;
  ctx.save();
  ctx.globalAlpha = alpha;
  bs.forEach((b, bi) => {
    const x = b.x + offsetX;
    const rr = mulberry32(b.seed);
    ctx.fillStyle = color;
    ctx.fillRect(x, baseY - b.h, b.w + 1, b.h + 4);
    // setback crown on tall towers, antenna on some
    const crown = b.h > 380 && rr() > 0.4;
    if (crown) ctx.fillRect(x + b.w * 0.2, baseY - b.h - b.h * 0.06, b.w * 0.6, b.h * 0.06 + 2);
    if (rr() > 0.75) ctx.fillRect(x + b.w * (0.3 + rr() * 0.4), baseY - b.h - 30 - rr() * 60, 3, 90);
    // faint rim light on one edge
    ctx.fillStyle = rgba("#9fb3d6", 0.05 * alpha);
    ctx.fillRect(x + b.w - 2, baseY - b.h, 2, b.h);
    const ww = win * (0.75 + rr() * 0.6);
    const cols = Math.max(1, Math.floor((b.w - ww) / (ww * 2.2)));
    const rows = Math.max(1, Math.floor((b.h - ww * 2) / (ww * 2.6)));
    const gx = (b.w - cols * ww * 2.2) / 2 + ww * 0.6;
    const office = rr() > 0.82;
    const density = litChance * (0.4 + rr() * 1.4);
    let wi = 0;
    for (let ry = 0; ry < rows; ry++) {
      const floorLit = office && rr() > 0.55;
      for (let cx = 0; cx < cols; cx++) {
        const base = floorLit ? 0.55 : rr() < density ? 0.45 + rr() * 0.55 : 0;
        const alt = rr() > 0.7;
        const v = litFn ? litFn(bi, wi, base) : base;
        wi++;
        if (v <= 0.01) continue;
        const wx = x + gx + cx * ww * 2.2;
        const wy = baseY - b.h + ww * 1.4 + ry * ww * 2.6;
        ctx.fillStyle = rgba(floorLit ? "#cfe0ff" : alt ? windowAlt : windowColor, v * 0.85);
        ctx.fillRect(wx, wy, ww, ww * 1.3);
      }
    }
    if (beacon > 0 && b.h > 300) {
      glow(ctx, x + b.w / 2, baseY - b.h - 6, 26, C.tail, beacon * 0.9, 0.12);
    }
  });
  ctx.restore();
};

const textCache = new Map<string, HTMLCanvasElement>();
/** text rendered once to an offscreen canvas (for perspective slicing / reuse) */
export const textTexture = (text: string, font: string, color = "#ffffff", pad = 20) => {
  const key = `${text}|${font}|${color}`;
  const hit = textCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  const m = c.getContext("2d")!;
  m.font = font;
  const tw = Math.ceil(m.measureText(text).width) + pad * 2;
  const size = parseInt(font.match(/(\d+)px/)?.[1] ?? "100", 10);
  c.width = tw;
  c.height = Math.ceil(size * 1.25) + pad * 2;
  const m2 = c.getContext("2d")!;
  m2.font = font;
  m2.fillStyle = color;
  m2.textBaseline = "middle";
  m2.fillText(text, pad, c.height / 2);
  textCache.set(key, c);
  return c;
};

/** draw a texture lying flat on the ground plane between depths zFar..zNear (pinhole camera) */
export const drawOnGround = (
  ctx: Ctx,
  tex: HTMLCanvasElement,
  opts: {
    zNear: number;
    zFar: number;
    xLeft: number;
    xRight: number;
    camH: number;
    focal: number;
    cx: number;
    cy: number;
    alpha?: number;
    slices?: number;
    xAt?: (z: number) => number;
  },
) => {
  const { zNear, zFar, xLeft, xRight, camH, focal, cx, cy, alpha = 1, xAt = () => 0 } = opts;
  if (zFar <= 0.5) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingQuality = "high";
  const zn = Math.max(0.6, zNear);
  // one slice per ~2 screen pixels keeps the perspective smooth
  const span = camH * focal * (1 / Math.max(zn, 0.6) - 1 / zFar);
  const slices = Math.max(16, Math.min(400, Math.round(span / 2)));
  for (let i = 0; i < slices; i++) {
    // texture row 0 = top of word = far end
    const v0 = i / slices;
    const v1 = (i + 1) / slices;
    const z0 = lerp(zFar, zNear, v0);
    const z1 = lerp(zFar, zNear, v1);
    if (z1 < zn) continue;
    const s0 = focal / z0;
    const s1 = focal / z1;
    const y0 = cy + camH * s0;
    const y1 = cy + camH * s1;
    const zm = (z0 + z1) / 2;
    const sm = focal / zm;
    const off = xAt(zm);
    const xl = cx + (xLeft + off) * sm;
    const xr = cx + (xRight + off) * sm;
    ctx.drawImage(tex, 0, v0 * tex.height, tex.width, (v1 - v0) * tex.height + 1, xl, y0, xr - xl, y1 - y0 + 1);
  }
  ctx.restore();
};

/** low hills / treeline band at the horizon */
export const drawHorizonBand = (ctx: Ctx, w: number, y: number, h: number, seed: number, color: string, rough = 1) => {
  ctx.beginPath();
  ctx.moveTo(0, y + 4);
  for (let x = 0; x <= w; x += 12) {
    const n = noise1(x / 160, seed) * 0.7 + noise1(x / 40, seed + 1) * 0.3 * rough;
    ctx.lineTo(x, y - n * h);
  }
  ctx.lineTo(w, y + 4);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

export const cityGlow = (ctx: Ctx, w: number, y: number, color: string, a: number) => {
  haze(ctx, w, y, 520, color, a);
};

export { hash };
