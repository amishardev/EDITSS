/** Small canvas toolkit. Light is drawn additively so overlapping lamps bloom like real lenses. */
type Ctx = CanvasRenderingContext2D;

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const rgba = (hex: string, a: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
};
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
};
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export const fillV = (ctx: Ctx, x: number, y: number, w: number, h: number, stops: [number, string][]) => {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
};

/** soft additive light: core + halo */
export const glow = (ctx: Ctx, x: number, y: number, r: number, color: string, a = 1, core = 0.12) => {
  if (r <= 0.5 || a <= 0.002) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba("#ffffff", a));
  g.addColorStop(core, rgba(color, a * 0.9));
  g.addColorStop(core * 2.5, rgba(color, a * 0.32));
  g.addColorStop(0.55, rgba(color, a * 0.08));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
};

/** elliptical glow (light pools on asphalt, reflections) */
export const glowEllipse = (ctx: Ctx, x: number, y: number, rx: number, ry: number, color: string, a = 1) => {
  if (rx < 1 || ry < 0.5 || a <= 0.002) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(0.4, rgba(color, a * 0.35));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
  ctx.restore();
};

/** vertical wet-road reflection streak under a light */
export const streakV = (ctx: Ctx, x: number, y: number, w: number, len: number, color: string, a = 1) => {
  if (a <= 0.002 || len < 1) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(0, y, 0, y + len);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(0.35, rgba(color, a * 0.4));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y + len / 2, w / 2, len / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

/** broken, shimmering reflection column on wet asphalt */
export const streakWet = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  len: number,
  color: string,
  a: number,
  T: number,
  seed = 0,
) => {
  if (a <= 0.003 || len < 2) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const step = Math.max(3, Math.min(7, len / 60));
  const rows = Math.floor(len / step);
  for (let i = 0; i < rows; i++) {
    const v = i / rows;
    const n1 = Math.sin(i * 1.7 + seed * 3.1 + T * 2.3) * 0.5 + 0.5;
    const n2 = Math.sin(i * 0.37 + seed + T * 0.9) * 0.5 + 0.5;
    const ww = w * (0.35 + 0.9 * n1) * (1 - v * 0.55);
    const aa = a * Math.pow(1 - v, 1.4) * (0.25 + 0.75 * n2);
    if (aa < 0.004) continue;
    ctx.fillStyle = rgba(color, aa);
    ctx.fillRect(x - ww / 2 + (n2 - 0.5) * w * 0.4, y + i * step, ww, step * 0.7);
  }
  ctx.restore();
};

/** cheap highlight bloom: isolate brights at low res, blur, add back */
let bloomCanvas: HTMLCanvasElement | null = null;
export const bloom = (ctx: Ctx, w: number, h: number, strength = 0.6, radius = 10) => {
  if (strength <= 0) return;
  const bw = Math.round(w / 4);
  const bh = Math.round(h / 4);
  if (!bloomCanvas) bloomCanvas = document.createElement("canvas");
  bloomCanvas.width = bw;
  bloomCanvas.height = bh;
  const b = bloomCanvas.getContext("2d")!;
  b.filter = "brightness(0.75) contrast(2.6)";
  b.drawImage(ctx.canvas, 0, 0, bw, bh);
  b.filter = "none";
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = strength;
  ctx.filter = `blur(${radius}px)`;
  ctx.drawImage(bloomCanvas, 0, 0, w, h);
  ctx.restore();
};

/** horizontal motion streak (light seen from a moving train / long exposure) */
export const streakH = (ctx: Ctx, x: number, y: number, len: number, thick: number, color: string, a = 1) => {
  if (a <= 0.002 || len < 1) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createLinearGradient(x - len / 2, 0, x + len / 2, 0);
  g.addColorStop(0, rgba(color, 0));
  g.addColorStop(0.5, rgba(color, a));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, len / 2, thick / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const poly = (ctx: Ctx, pts: [number, number][], fill: string) => {
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
};

/** atmospheric haze band */
export const haze = (ctx: Ctx, w: number, y: number, h: number, color: string, a: number) => {
  const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
  g.addColorStop(0, rgba(color, 0));
  g.addColorStop(0.5, rgba(color, a));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, y - h / 2, w, h);
};

/** 3D -> screen with a simple pinhole camera. z is distance in front of the camera. */
export const project = (x: number, y: number, z: number, focal: number, cx: number, cy: number) => {
  const s = focal / Math.max(0.01, z);
  return { x: cx + x * s, y: cy + y * s, s };
};
