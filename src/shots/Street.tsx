/**
 * STREET - the walk. People are shadows; lamps are rhythm.
 *  Shadows   : a group's shadows on the pavement swing round as each lamp passes (lamps pass with travel()).
 *  Crosswalk : top-down zebra crossing on wet asphalt; figures cross as shadows.
 *  Signal    : a pedestrian / traffic signal in the rain; counts down on the beat or changes on the drop.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, glowEllipse, mix, rgba, smooth } from "../engine/draw";
import { beatIndex, kick, travel } from "../engine/music";
import { mulberry32, noise1 } from "../engine/rng";
import { F } from "../engine/fonts";

type Ctx = CanvasRenderingContext2D;

/** a soft human shadow on the ground, rooted at (x,y), pointing along angle `ang` */
const groundShadow = (ctx: Ctx, x: number, y: number, ang: number, len: number, width: number, phase: number, a: number, blur = 6) => {
  if (a < 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.filter = `blur(${blur}px)`;
  ctx.fillStyle = rgba("#000000", a);
  const sw = Math.sin(phase) * width * 0.3;
  ctx.beginPath();
  ctx.moveTo(0, -width * 0.12 - sw);
  ctx.lineTo(len * 0.46, -width * 0.2);
  ctx.lineTo(len * 0.46, width * 0.2);
  ctx.lineTo(0, width * 0.12 + sw);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(len * 0.42, -width * 0.36);
  ctx.lineTo(len * 0.84, -width * 0.3);
  ctx.lineTo(len * 0.84, width * 0.3);
  ctx.lineTo(len * 0.42, width * 0.36);
  ctx.closePath();
  ctx.fill();
  // arms swing
  ctx.lineWidth = width * 0.12;
  ctx.strokeStyle = rgba("#000000", a);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(len * 0.78, -width * 0.34);
  ctx.lineTo(len * 0.5, -width * 0.42 + sw * 0.6);
  ctx.moveTo(len * 0.78, width * 0.34);
  ctx.lineTo(len * 0.5, width * 0.42 - sw * 0.6);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(len * 0.92, 0, len * 0.075, width * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const pavement = (ctx: Ctx, w: number, h: number, scroll: number, tone: string) => {
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, w, h);
  const slab = 260;
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 3;
  const off = scroll % slab;
  for (let y = -slab + off; y < h + slab; y += slab) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  for (let x = 40; x < w; x += slab) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  const r = mulberry32(4);
  for (let i = 0; i < 1400; i++) {
    const x = r() * w;
    const y = ((r() * (h + 400) + scroll) % (h + 400)) - 200;
    ctx.fillStyle = rgba(r() > 0.5 ? "#ffffff" : "#000000", 0.03 + r() * 0.05);
    ctx.fillRect(x, y, 2 + r() * 3, 2 + r() * 3);
  }
};

export type ShadowsParams = { people: number; lampColor: string; run: number; spacing: number; tone: string; wet: number };
const SH_DEF: ShadowsParams = { people: 3, lampColor: C.sodium, run: 0, spacing: 1, tone: "#4a3f33", wet: 0.3 };

export const Shadows: React.FC<{ p?: Partial<ShadowsParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...SH_DEF, ...p };
  return (
    <Canvas
      bloom={0.45}
      draw={(ctx, w, h) => {
        // we look down at the pavement; the group walks "up" the frame, lamps pass every travel unit
        const unitPx = 1500 * P.spacing;
        const d = travel(T) * unitPx;
        pavement(ctx, w, h, d, P.tone);
        // lamp positions in screen space (off-frame left, scrolling down = we walk up)
        const lamps: { x: number; y: number }[] = [];
        for (let k = -2; k < 3; k++) {
          lamps.push({ x: -160, y: ((d % unitPx) + k * unitPx) });
        }
        // light pools
        for (const L of lamps) glowEllipse(ctx, L.x + 300, L.y, 1000, 760, P.lampColor, 0.38);
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(0, 0, w, h);
        for (const L of lamps) glowEllipse(ctx, L.x + 300, L.y, 800, 600, P.lampColor, 0.25);
        const phase = lt * (P.run ? 9 : 5.2);
        for (let i = 0; i < P.people; i++) {
          const fx = w * (0.32 + i * 0.17) + noise1(lt * 0.3, i) * 30;
          const fy = h * (0.52 + (i % 2) * 0.06) + Math.sin(phase + i) * 4;
          for (const L of lamps) {
            const dx = fx - L.x;
            const dy = fy - L.y;
            const dist = Math.hypot(dx, dy);
            const a = clamp(1.3 - dist / 1500) * 0.85;
            const len = clamp(dist * 0.42, 150, 760);
            groundShadow(ctx, fx, fy, Math.atan2(dy, dx), len, 120, phase + i * 1.3, a);
          }
          // feet contact
          glowEllipse(ctx, fx, fy, 40, 18, "#000000", 0);
        }
        // wet sheen
        ctx.fillStyle = rgba(P.lampColor, 0.04 * P.wet);
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};

export type CrosswalkParams = { people: number; rain: number; signalColor: string; tone: string };
const CW_DEF: CrosswalkParams = { people: 4, rain: 0.4, signalColor: C.tail, tone: "#16171b" };

export const Crosswalk: React.FC<{ p?: Partial<CrosswalkParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...CW_DEF, ...p };
  return (
    <Canvas
      bloom={0.5}
      draw={(ctx, w, h) => {
        ctx.fillStyle = P.tone;
        ctx.fillRect(0, 0, w, h);
        const r = mulberry32(6);
        for (let i = 0; i < 2000; i++) {
          ctx.fillStyle = rgba(r() > 0.5 ? "#ffffff" : "#000000", 0.03 + r() * 0.05);
          ctx.fillRect(r() * w, r() * h, 2 + r() * 2, 2 + r() * 2);
        }
        // stripes (top-down), slightly rotated
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(-0.12);
        for (let i = -6; i <= 6; i++) {
          const y = i * 150;
          ctx.fillStyle = rgba("#cfc9bb", 0.5);
          ctx.fillRect(-w * 0.42, y - 45, w * 0.84, 90);
          // worn paint
          const rr = mulberry32(i + 40);
          for (let j = 0; j < 26; j++) {
            ctx.fillStyle = rgba(P.tone, 0.22);
            ctx.beginPath();
            ctx.ellipse(-w * 0.42 + rr() * w * 0.84, y - 45 + rr() * 90, 10 + rr() * 40, 4 + rr() * 10, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
        // signal glow spilling in from top
        glow(ctx, w * 0.95, -60, 900, P.signalColor, 0.32);
        glow(ctx, -80, h * 0.8, 900, C.sodium, 0.22);
        // walkers crossing left->right, heads/shoulders from above + long shadows
        for (let i = 0; i < P.people; i++) {
          const speed = 120 + i * 18;
          const x = ((lt * speed + i * 330) % (w + 500)) - 250;
          const y = h * (0.25 + i * 0.16);
          const ph = lt * 5 + i;
          ctx.save();
          ctx.filter = "blur(4px)";
          // shadow from the sodium lamp bottom-left
          ctx.translate(x, y);
          ctx.rotate(-0.9);
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.beginPath();
          ctx.ellipse(110, 0, 120, 26 + Math.sin(ph) * 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.filter = "blur(1.5px)";
          ctx.fillStyle = "#08080a";
          ctx.beginPath();
          ctx.ellipse(x, y, 44, 30, 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#050505";
          ctx.beginPath();
          ctx.arc(x + 4, y, 17, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // rain rings
        if (P.rain > 0) {
          const rr = mulberry32(10);
          for (let i = 0; i < 60 * P.rain; i++) {
            const t0 = rr() * 2;
            const age = ((T + t0) % 2) / 2;
            const x = rr() * w;
            const y = rr() * h;
            ctx.strokeStyle = rgba("#e6e2da", 0.25 * (1 - age));
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(x, y, age * 40, age * 30, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }}
    />
  );
};

export type SignalParams = {
  kind: "walk" | "traffic";
  /** walk: count down on beats ending at `goAt`; traffic: red until goAt then green */
  goAt: number;
  countFrom: number;
  flashAmber: boolean;
  rain: number;
};
const SG_DEF: SignalParams = { kind: "walk", goAt: 60, countFrom: 8, flashAmber: false, rain: 0.6 };

const sevenSeg = (ctx: Ctx, digit: string, x: number, y: number, s: number, color: string, a: number) => {
  const segs: Record<string, number[]> = {
    "0": [0, 1, 2, 3, 4, 5],
    "1": [1, 2],
    "2": [0, 1, 6, 4, 3],
    "3": [0, 1, 6, 2, 3],
    "4": [5, 6, 1, 2],
    "5": [0, 5, 6, 2, 3],
    "6": [0, 5, 4, 3, 2, 6],
    "7": [0, 1, 2],
    "8": [0, 1, 2, 3, 4, 5, 6],
    "9": [0, 1, 2, 3, 5, 6],
  };
  const on = new Set(segs[digit] ?? []);
  const L = s;
  const t = s * 0.18;
  const pos: [number, number, boolean][] = [
    [x, y, true],
    [x + L, y, false],
    [x + L, y + L, false],
    [x, y + 2 * L, true],
    [x, y + L, false],
    [x, y, false],
    [x, y + L, true],
  ];
  pos.forEach(([px, py, hz], i) => {
    const lit = on.has(i);
    ctx.fillStyle = rgba(lit ? color : "#2a1a14", lit ? a : 0.25);
    if (hz) ctx.fillRect(px + t * 0.6, py - t / 2, L - t * 1.2, t);
    else ctx.fillRect(px - t / 2, py + t * 0.6, t, L - t * 1.2);
  });
  if (a > 0.05) glow(ctx, x + L / 2, y + L, L * 2.2, color, 0.18 * a);
};

export const Signal: React.FC<{ p?: Partial<SignalParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...SG_DEF, ...p };
  return (
    <Canvas
      bloom={0.75}
      draw={(ctx, w, h) => {
        // rainy bokeh background
        ctx.fillStyle = "#06070a";
        ctx.fillRect(0, 0, w, h);
        const r = mulberry32(13);
        for (let i = 0; i < 26; i++) {
          const col = r() > 0.6 ? C.sodium : r() > 0.4 ? C.tail : "#9fb6ff";
          const x = r() * w;
          const y = r() * h;
          const rad = 60 + r() * 160;
          ctx.fillStyle = rgba(col, 0.06 + r() * 0.1);
          ctx.beginPath();
          ctx.arc(x + noise1(T * 0.2, i) * 30, y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        // housing
        const hx = w * 0.18;
        const hy = h * 0.2;
        const hw = w * 0.64;
        const hh = h * 0.52;
        ctx.fillStyle = "#0b0b0c";
        ctx.fillRect(hx, hy, hw, hh);
        ctx.strokeStyle = "#1a1a1c";
        ctx.lineWidth = 6;
        ctx.strokeRect(hx, hy, hw, hh);
        const go = T >= P.goAt;
        if (P.kind === "walk") {
          // upper lens: hand / walker in a muted icon-free form - just colour + count
          const cyl = hy + hh * 0.3;
          const cyl2 = hy + hh * 0.72;
          const amberBlink = P.flashAmber ? (Math.floor(T / 0.46875) % 2 === 0 ? 1 : 0.1) : 1;
          const redA = go ? 0.08 : 0.95 * amberBlink;
          const greenA = go ? 0.95 : 0.06;
          ctx.fillStyle = "#050505";
          ctx.beginPath();
          ctx.arc(w / 2, cyl, hw * 0.32, 0, Math.PI * 2);
          ctx.arc(w / 2, cyl2, hw * 0.32, 0, Math.PI * 2);
          ctx.fill();
          glow(ctx, w / 2, cyl, hw * 0.6, P.flashAmber ? C.amber : C.tail, redA * 0.8, 0.25);
          glow(ctx, w / 2, cyl2, hw * 0.6, C.green, greenA * 0.8, 0.25);
          // countdown digits beside, one per beat
          if (!go) {
            const beatsLeft = beatIndex(P.goAt) - beatIndex(T);
            if (beatsLeft <= P.countFrom && beatsLeft > 0) {
              const s = String(beatsLeft).padStart(2, "0");
              const k = 1 - (T % 0.46875) / 0.46875;
              sevenSeg(ctx, s[0], w * 0.32, hy + hh + 90, 90, C.amber, 0.5 + 0.5 * k);
              sevenSeg(ctx, s[1], w * 0.32 + 150, hy + hh + 90, 90, C.amber, 0.5 + 0.5 * k);
            }
          } else {
            const k = kick(T, 0.2);
            glow(ctx, w / 2, cyl2, hw * 1.4, C.green, 0.25 * k);
          }
        } else {
          const ys = [hy + hh * 0.2, hy + hh * 0.5, hy + hh * 0.8];
          const amber = P.flashAmber && Math.floor(T / 0.46875) % 2 === 0;
          const states = P.flashAmber ? [0.05, amber ? 0.95 : 0.06, 0.05] : go ? [0.05, 0.05, 0.95] : [0.95, 0.05, 0.05];
          const cols = [C.tail, C.amber, C.green];
          ys.forEach((y, i) => {
            ctx.fillStyle = "#040404";
            ctx.beginPath();
            ctx.arc(w / 2, y, hw * 0.2, 0, Math.PI * 2);
            ctx.fill();
            glow(ctx, w / 2, y, hw * 0.45, cols[i], states[i] * 0.85, 0.3);
          });
        }
        // rain streaks in front, lit by the signal
        const lit = go ? C.green : P.flashAmber ? C.amber : C.tail;
        const rr = mulberry32(4);
        for (let i = 0; i < 260 * P.rain; i++) {
          const x = rr() * w;
          const y = (rr() * h + T * (1100 + rr() * 500)) % h;
          ctx.strokeStyle = rgba(mix("#cfd6e0", lit, 0.4), 0.16);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - 3, y + 38);
          ctx.stroke();
        }
        void smooth;
        void F;
      }}
    />
  );
};
