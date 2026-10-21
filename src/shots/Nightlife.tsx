/**
 * NIGHTLIFE - the bar, from the outside and through the glass. People only ever appear as
 * blurred shapes behind frosted glass, moving with the kick and the bass.
 *  BarFront : brick front, neon sign, steamed window, door spill, wet pavement. `closeAt` turns it off.
 *  Frosted  : close on the steamed glass, the dancing shapes fill the frame.
 *  Neon     : a sign as the whole shot, tube flicker, reflection in the wet ground.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, mix, rgba, smooth, streakWet } from "../engine/draw";
import { bassWeight, beatIndex, beatPhase, env, kick } from "../engine/music";
import { hash, mulberry32, noise1 } from "../engine/rng";
import { F } from "../engine/fonts";

type Ctx = CanvasRenderingContext2D;

let dancerCanvas: HTMLCanvasElement | null = null;

/** blurred dancing shapes rendered at low res (cheap, and the blur hides that they're simple) */
const drawDancers = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  T: number,
  opts: { count: number; seed: number; energy: number; blur: number; color?: string; alpha?: number },
) => {
  const { count, seed, energy, blur, color = "#120806", alpha = 0.85 } = opts;
  const q = 4;
  const cw = Math.max(8, Math.round(w / q));
  const ch = Math.max(8, Math.round(h / q));
  if (!dancerCanvas) dancerCanvas = document.createElement("canvas");
  dancerCanvas.width = cw;
  dancerCanvas.height = ch;
  const d = dancerCanvas.getContext("2d")!;
  d.clearRect(0, 0, cw, ch);
  d.fillStyle = color;
  const r = mulberry32(seed);
  const ph = beatPhase(T);
  const k = kick(T, 0.12);
  const bw = bassWeight(T);
  for (let i = 0; i < count; i++) {
    const depth = 0.55 + r() * 0.6;
    const px = r() * cw;
    const off = r() * Math.PI * 2;
    const style = r();
    const sway = Math.sin((ph + (style > 0.5 ? 0 : 0.5)) * Math.PI * 2 + off * 0.2) * 5 * energy * depth;
    const bounce = -k * 3.2 * energy * depth - bw * 2 * energy;
    const sc = depth * ch * 0.009;
    const bx = px + sway + noise1(T * 0.4, i + seed) * 6;
    const by = ch * (0.55 + (1 - depth) * 0.25) + bounce;
    // head
    d.beginPath();
    d.ellipse(bx, by - 34 * sc, 6.5 * sc, 8 * sc, 0, 0, Math.PI * 2);
    d.fill();
    // torso
    d.beginPath();
    d.moveTo(bx - 13 * sc, by - 22 * sc);
    d.quadraticCurveTo(bx, by - 28 * sc, bx + 13 * sc, by - 22 * sc);
    d.lineTo(bx + 10 * sc, by + 30 * sc);
    d.lineTo(bx - 10 * sc, by + 30 * sc);
    d.closePath();
    d.fill();
    d.fillRect(bx - 11 * sc, by + 28 * sc, 22 * sc, ch);
    // arms: some go up on the heavy bass bars
    const up = style > 0.6 ? clamp(energy * (0.3 + bw)) : 0;
    d.lineWidth = 5 * sc;
    d.lineCap = "round";
    d.strokeStyle = color;
    for (const side of [-1, 1]) {
      d.beginPath();
      d.moveTo(bx + side * 11 * sc, by - 18 * sc);
      const ax = bx + side * (16 - up * 6) * sc;
      const ay = by + (12 - up * 70) * sc + Math.sin(ph * Math.PI * 2 + side) * 4 * sc * energy;
      d.lineTo(ax, ay);
      d.stroke();
    }
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = `blur(${blur}px)`;
  ctx.drawImage(dancerCanvas, x, y, w, h);
  ctx.restore();
};

/** steamed glass: droplets and a few running streaks */
const drawCondensation = (ctx: Ctx, x: number, y: number, w: number, h: number, T: number, seed: number, light: string) => {
  const r = mulberry32(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < (w * h) / 2600; i++) {
    const dx = x + r() * w;
    const dy = y + r() * h;
    const s = 1 + Math.pow(r(), 3) * 7;
    ctx.fillStyle = rgba(light, 0.05 + r() * 0.12);
    ctx.beginPath();
    ctx.arc(dx, dy, s, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 9; i++) {
    const sx = x + r() * w;
    const start = r() * 20;
    const prog = ((T - start) * (6 + r() * 10)) % (h * 1.4);
    ctx.strokeStyle = rgba(light, 0.1);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, y + r() * h * 0.3);
    ctx.lineTo(sx + Math.sin(i) * 6, y + Math.max(0, prog));
    ctx.stroke();
  }
  ctx.restore();
};

const neonText = (ctx: Ctx, text: string, x: number, y: number, size: number, color: string, on: number, font = "sans") => {
  if (on <= 0.01) {
    // dead tube still visible
    ctx.save();
    ctx.font = font === "serif" ? `italic 400 ${size}px ${F.serif}` : `600 ${size}px ${F.sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = rgba(mix(color, "#333333", 0.7), 0.35);
    ctx.lineWidth = size * 0.04;
    ctx.strokeText(text, x, y);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.font = font === "serif" ? `italic 400 ${size}px ${F.serif}` : `600 ${size}px ${F.sans}`;
  (ctx as unknown as { letterSpacing: string }).letterSpacing = font === "serif" ? "0px" : `${size * 0.06}px`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = rgba(color, 0.9 * on);
  ctx.shadowBlur = size * 0.6;
  ctx.strokeStyle = rgba(color, 0.55 * on);
  ctx.lineWidth = size * 0.09;
  ctx.strokeText(text, x, y);
  ctx.shadowBlur = size * 0.18;
  ctx.strokeStyle = rgba(mix(color, "#ffffff", 0.55), 0.95 * on);
  ctx.lineWidth = size * 0.035;
  ctx.strokeText(text, x, y);
  ctx.restore();
  glow(ctx, x, y, size * 3.2, color, 0.18 * on, 0.1);
};

/** neon state: buzzing, plus switch-off/on events */
const neonOn = (T: number, offAt: number | null, onAt: number | null, buzz: number) => {
  let v = 1;
  if (onAt !== null) {
    if (T < onAt) v = 0;
    else {
      const d = T - onAt;
      v = d < 0.06 ? 1 : d < 0.12 ? 0.1 : d < 0.18 ? 1 : d < 0.24 ? 0.2 : 1;
    }
  }
  if (offAt !== null && T >= offAt) {
    const d = T - offAt;
    v = d < 0.08 ? 0.15 : d < 0.16 ? 1 : d < 0.22 ? 0 : d < 0.28 ? 0.6 : 0;
  }
  if (buzz > 0) v *= 1 - buzz * (noise1(T * 22, 3) > 0.82 ? 0.7 : 0);
  return v;
};

const brick = (ctx: Ctx, w: number, h: number, light: (x: number, y: number) => number) => {
  ctx.fillStyle = "#120c0a";
  ctx.fillRect(0, 0, w, h);
  const bw = 120;
  const bh = 44;
  for (let row = 0; row < h / bh + 1; row++) {
    for (let col = -1; col < w / bw + 1; col++) {
      const x = col * bw + (row % 2) * (bw / 2);
      const y = row * bh;
      const l = light(x + bw / 2, y + bh / 2);
      const n = hash(row * 31 + col);
      ctx.fillStyle = mix("#1a110d", "#3a2016", clamp(l * 0.9 + n * 0.12));
      ctx.fillRect(x + 3, y + 3, bw - 6, bh - 6);
    }
  }
};

export type BarParams = {
  sign: string;
  signColor: string;
  signFont: "sans" | "serif";
  closeAt: number | null;
  onAt: number | null;
  crowd: number;
  door: number;
  rain: number;
};
const BAR_DEF: BarParams = {
  sign: "OPEN LATE",
  signColor: C.neonRose,
  signFont: "sans",
  closeAt: null,
  onAt: null,
  crowd: 7,
  door: 1,
  rain: 0,
};

export const BarFront: React.FC<{ p?: Partial<BarParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...BAR_DEF, ...p };
  return (
    <Canvas
      bloom={0.6}
      draw={(ctx, w, h) => {
        const on = neonOn(T, P.closeAt, P.onAt, 0.25);
        // interior light drops in two steps on the beats after closing
        const steps = P.closeAt !== null && T >= P.closeAt ? Math.min(3, beatIndex(T) - beatIndex(P.closeAt)) : 0;
        const inside = P.closeAt !== null && T >= P.closeAt ? [1, 0.55, 0.2, 0.04][steps] : 1;
        const winX = w * 0.08;
        const winY = h * 0.36;
        const winW = w * 0.56;
        const winH = h * 0.32;
        const doorX = w * 0.7;
        const doorW = w * 0.22;
        const doorY = h * 0.34;
        const doorH = h * 0.4;
        const signY = h * 0.27;
        brick(ctx, w, h * 0.76, (x, y) => {
          const dw = Math.hypot((x - (winX + winW / 2)) / winW, (y - (winY + winH / 2)) / winH);
          const ds = Math.hypot((x - w * 0.36) / (w * 0.5), (y - signY) / 160);
          return clamp(1 - dw * 0.7) * 0.6 * inside + clamp(1 - ds) * 0.5 * on;
        });
        // window
        const wg = ctx.createLinearGradient(0, winY, 0, winY + winH);
        wg.addColorStop(0, mix("#1a0d08", "#ffb36b", 0.85 * inside));
        wg.addColorStop(1, mix("#120806", "#e07a4a", 0.8 * inside));
        ctx.fillStyle = wg;
        ctx.fillRect(winX, winY, winW, winH);
        if (inside > 0.1) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(winX, winY, winW, winH);
          ctx.clip();
          glow(ctx, winX + winW * 0.3, winY + winH * 0.2, winW * 0.5, "#ff6a8a", 0.25 * inside * (0.6 + env("pad", T) * 0.6));
          drawDancers(ctx, winX - 40, winY + winH * 0.15, winW + 80, winH * 0.95, T, {
            count: Math.round(P.crowd * inside),
            seed: 5,
            energy: 1,
            blur: 11,
            alpha: 0.8 * inside,
          });
          ctx.restore();
          drawCondensation(ctx, winX, winY, winW, winH, T, 9, "#ffe0c0");
        }
        ctx.strokeStyle = "#060404";
        ctx.lineWidth = 16;
        ctx.strokeRect(winX, winY, winW, winH);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(winX + winW / 2, winY);
        ctx.lineTo(winX + winW / 2, winY + winH);
        ctx.stroke();
        // door
        ctx.fillStyle = "#070505";
        ctx.fillRect(doorX, doorY, doorW, doorH);
        const open = P.door * inside;
        if (open > 0.02) {
          const og = ctx.createLinearGradient(doorX, 0, doorX + doorW, 0);
          og.addColorStop(0, rgba("#ffcf9a", 0.9 * open));
          og.addColorStop(1, rgba("#ff9a5a", 0.6 * open));
          ctx.fillStyle = og;
          ctx.fillRect(doorX + doorW * (1 - open * 0.6), doorY + 6, doorW * open * 0.6 - 6, doorH - 6);
        }
        // sign
        neonText(ctx, P.sign, w * 0.4, signY, P.signFont === "serif" ? 150 : 112, P.signColor, on, P.signFont);
        // pavement + reflections
        const py = h * 0.76;
        const pg = ctx.createLinearGradient(0, py, 0, h);
        pg.addColorStop(0, "#0d0a0a");
        pg.addColorStop(1, "#050404");
        ctx.fillStyle = pg;
        ctx.fillRect(0, py, w, h - py);
        ctx.fillStyle = "#1a1412";
        ctx.fillRect(0, py, w, 10);
        streakWet(ctx, winX + winW * 0.3, py + 12, 160, h - py, "#ff9a5a", 0.35 * inside, T, 1);
        streakWet(ctx, winX + winW * 0.7, py + 12, 160, h - py, "#ff9a5a", 0.3 * inside, T, 2);
        streakWet(ctx, w * 0.36, py + 12, 220, h - py, P.signColor, 0.35 * on, T, 3);
        streakWet(ctx, doorX + doorW * 0.6, py + 12, 90, h - py, "#ffcf9a", 0.4 * open, T, 4);
        if (P.rain > 0) {
          const r = mulberry32(3);
          for (let i = 0; i < 200 * P.rain; i++) {
            const x = r() * w;
            const y = (r() * h + T * (900 + r() * 400)) % h;
            ctx.strokeStyle = rgba("#e8d8c8", 0.12);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 2, y + 30);
            ctx.stroke();
          }
        }
      }}
    />
  );
};

export type FrostedParams = { count: number; hue: string; hue2: string; energy: number; blur: number; closeAt: number | null };
const FROST_DEF: FrostedParams = { count: 9, hue: "#ff9a5a", hue2: "#ff5a7a", energy: 1, blur: 9, closeAt: null };

export const Frosted: React.FC<{ p?: Partial<FrostedParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...FROST_DEF, ...p };
  return (
    <Canvas
      bloom={0.5}
      draw={(ctx, w, h) => {
        const off = P.closeAt !== null ? 1 - smooth(P.closeAt, P.closeAt + 0.3, T) : 1;
        const bar = Math.floor(T / 1.875);
        const swap = bar % 2 === 0;
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, mix("#0a0605", swap ? P.hue : P.hue2, 0.9 * off));
        g.addColorStop(0.6, mix("#0a0605", "#ffd2a0", 0.7 * off));
        g.addColorStop(1, mix("#050303", swap ? P.hue2 : P.hue, 0.8 * off));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        glow(ctx, w * 0.3 + Math.sin(lt * 0.5) * 120, h * 0.25, w * 0.8, "#fff0d8", 0.25 * off * (0.6 + kick(T, 0.15) * 0.5));
        drawDancers(ctx, -100, h * 0.12, w + 200, h * 0.95, T, {
          count: Math.round(P.count * off),
          seed: 17,
          energy: P.energy,
          blur: P.blur,
          alpha: 0.88,
        });
        drawCondensation(ctx, 0, 0, w, h, T, 21, "#fff2e0");
        ctx.fillStyle = rgba("#fff6ea", 0.05);
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};

export type NeonParams = {
  lines: string[];
  color: string;
  font: "sans" | "serif";
  size: number;
  offAt: number | null;
  onAt: number | null;
  buzz: number;
  y: number;
  /** swap to this text after `swapAt` (e.g. OPEN -> CLOSED) */
  swapTo: string[] | null;
  swapAt: number;
  wall: "brick" | "dark";
};
const NEON_DEF: NeonParams = {
  lines: ["LAST CALL"],
  color: C.neonRose,
  font: "sans",
  size: 150,
  offAt: null,
  onAt: null,
  buzz: 0.3,
  y: 0.42,
  swapTo: null,
  swapAt: 0,
  wall: "brick",
};

export const Neon: React.FC<{ p?: Partial<NeonParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...NEON_DEF, ...p };
  return (
    <Canvas
      bloom={0.7}
      draw={(ctx, w, h) => {
        const lines = P.swapTo && T >= P.swapAt ? P.swapTo : P.lines;
        let on = neonOn(T, P.offAt, P.onAt, P.buzz);
        if (P.swapTo) {
          // the sign changes its word: a short dead stutter right on swapAt
          const d = T - P.swapAt;
          if (d >= 0 && d < 0.3) on *= d < 0.07 ? 0 : d < 0.13 ? 0.7 : d < 0.19 ? 0 : 1;
        }
        const cy = h * P.y;
        const ground = h * 0.72;
        if (P.wall === "brick") {
          brick(ctx, w, ground, (x, y) => clamp(1 - Math.hypot((x - w / 2) / (w * 0.6), (y - cy) / 320)) * on);
        } else {
          ctx.fillStyle = "#07070a";
          ctx.fillRect(0, 0, w, ground);
          glow(ctx, w / 2, cy, w * 0.9, P.color, 0.12 * on);
        }
        lines.forEach((l, i) => {
          const y = cy + (i - (lines.length - 1) / 2) * P.size * 1.15;
          neonText(ctx, l, w / 2, y, P.size, P.color, on, P.font);
        });
        // wet ground with the mirrored sign
        const pg = ctx.createLinearGradient(0, ground, 0, h);
        pg.addColorStop(0, "#0c0b0d");
        pg.addColorStop(1, "#030304");
        ctx.fillStyle = pg;
        ctx.fillRect(0, ground, w, h - ground);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, ground, w, h - ground);
        ctx.clip();
        ctx.translate(0, ground * 2 - 40);
        ctx.scale(1, -1);
        ctx.globalAlpha = 0.35;
        ctx.filter = "blur(10px)";
        lines.forEach((l, i) => {
          const y = cy + (i - (lines.length - 1) / 2) * P.size * 1.15;
          neonText(ctx, l, w / 2, y, P.size, P.color, on, P.font);
        });
        ctx.restore();
        streakWet(ctx, w / 2, ground + 10, w * 0.5, h - ground, P.color, 0.22 * on, T, 7);
      }}
    />
  );
};
