/**
 * ROAD - POV night drive. Sodium lamps pass at the track's travel rate, so in the drops a
 * lamp crosses overhead exactly on every kick, the 8th/16th rolls make the lamps flicker
 * faster, and the moon never moves: everything passes except the moon.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, glowEllipse, lerp, mix, rgba, smooth, streakV, streakWet } from "../engine/draw";
import { travel } from "../engine/music";
import { mulberry32, noise1 } from "../engine/rng";
import { F } from "../engine/fonts";
import { cityGlow, drawClouds, drawHorizonBand, drawMoon, drawOnGround, drawSky, drawStars, SkyMood, textTexture } from "./common";

export type RoadParams = {
  sky: SkyMood;
  moon: boolean;
  moonX: number;
  moonY: number;
  moonR: number;
  lamps: "both" | "left" | "right" | "none";
  lampColor: string;
  rain: number;
  fog: number;
  wet: number;
  words: string[];
  wordGap: number;
  tail: boolean;
  horizon: number;
  speed: number;
  rateCap: number;
  curve: number;
  /** song time from which lamps switch off one by one (morning) */
  lampsOffAt: number | null;
  stars: number;
  /** freeze travel (seconds of song time) for a held frame */
  holdAt: number | null;
  /** words painted on the road that sit `lead` metres ahead of the car at song time t (readable as they're sung) */
  wordsAt: { text: string; t: number; big?: boolean }[];
  lead: number;
};

const DEF: RoadParams = {
  sky: "night",
  moon: true,
  moonX: 0.3,
  moonY: 0.27,
  moonR: 46,
  lamps: "right",
  lampColor: C.sodium,
  rain: 0,
  fog: 0.5,
  wet: 0.6,
  words: [],
  wordGap: 3,
  tail: false,
  horizon: 0.47,
  speed: 1,
  rateCap: 4,
  curve: 0,
  lampsOffAt: null,
  stars: 0.6,
  holdAt: null,
  wordsAt: [],
  lead: 7,
};

const LAMP = 20; // metres between lamps
const DASH_P = 12;
const DASH_L = 4;
const CAM_H = 1.25;

export const Road: React.FC<{ p?: Partial<RoadParams> }> = ({ p }) => {
  const T0 = useSongTime();
  const P = { ...DEF, ...p };
  const T = P.holdAt ?? T0;
  return (
    <Canvas
      draw={(ctx, w, h) => {
        const cy = h * P.horizon;
        const cx = w * 0.5;
        const f = h * 0.55;
        const camZ = travel(T) * LAMP * P.speed;
        const curveAt = (z: number) => P.curve * z * z * 0.0011;
        const fogK = 0.004 + P.fog * 0.012;
        const fogA = (z: number) => Math.exp(-z * fogK);

        // sky
        drawSky(ctx, w, cy, P.sky);
        if (P.stars > 0) drawStars(ctx, w, cy * 0.85, T, { alpha: P.stars, seed: 11 });
        if (P.moon) drawMoon(ctx, w * P.moonX, h * P.moonY, P.moonR, { halo: 1 });
        drawClouds(ctx, w, cy * 0.25, cy * 0.75, T, { alpha: 0.5, count: 5, speed: 6 });
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, cy + 4);
        ctx.clip();
        cityGlow(ctx, w, cy, P.sky === "dawn" ? C.dawnPeach : C.sodiumDeep, P.sky === "dawn" ? 0.25 : 0.14);
        ctx.restore();
        drawHorizonBand(ctx, w, cy + 2, 46, 4, P.sky === "dawn" ? "#2a3044" : "#05070c");
        // distant town lights on the horizon
        const rr = mulberry32(5);
        ctx.save();
        for (let i = 0; i < 70; i++) {
          const x = rr() * w;
          const y = cy - 2 - rr() * 18;
          const a = 0.35 + rr() * 0.5;
          glow(ctx, x, y, 6 + rr() * 8, rr() > 0.3 ? C.sodium : C.warmWhite, a * 0.6 * (P.sky === "dawn" ? 0.4 : 1), 0.2);
        }
        ctx.restore();

        // road surface
        const zN = 0.9;
        const zF = 700;
        const xL = -5.4;
        const xR = 1.9;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const z = lerp(zN, zF, Math.pow(i / 60, 2.2));
          const s = f / z;
          const x = cx + (xL + curveAt(z)) * s;
          const y = cy + CAM_H * s;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        for (let i = 60; i >= 0; i--) {
          const z = lerp(zN, zF, Math.pow(i / 60, 2.2));
          const s = f / z;
          ctx.lineTo(cx + (xR + curveAt(z)) * s, cy + CAM_H * s);
        }
        ctx.closePath();
        const rg = ctx.createLinearGradient(0, cy, 0, h);
        rg.addColorStop(0, P.sky === "dawn" ? "#3a3c48" : "#1b1d24");
        rg.addColorStop(0.25, "#121319");
        rg.addColorStop(1, "#08090c");
        ctx.fillStyle = rg;
        ctx.fill();
        // asphalt grain: fixed to the road so it streams toward camera
        ctx.save();
        ctx.clip();
        const ar = mulberry32(21);
        for (let i = 0; i < 900; i++) {
          const ax = xL + ar() * (xR - xL);
          const az = ((ar() * 60 - (camZ % 60) + 60) % 60) + 1;
          const s = f / az;
          const a = 0.05 + ar() * 0.08;
          ctx.fillStyle = rgba(ar() > 0.5 ? "#ffffff" : "#000000", a * clamp(1.5 - az / 40));
          ctx.fillRect(cx + (ax + curveAt(az)) * s, cy + CAM_H * s, Math.max(1, 0.05 * s), Math.max(1, 0.012 * s));
        }
        // wet sheen toward the horizon
        const sh = ctx.createLinearGradient(0, cy, 0, cy + (h - cy) * 0.5);
        sh.addColorStop(0, rgba(P.sky === "dawn" ? C.dawnPeach : C.sodiumDeep, 0.12 * P.wet));
        sh.addColorStop(1, rgba(C.sodiumDeep, 0));
        ctx.fillStyle = sh;
        ctx.fillRect(0, cy, w, h - cy);
        ctx.restore();
        // ground beside road
        ctx.globalCompositeOperation = "destination-over";
        const gg = ctx.createLinearGradient(0, cy, 0, h);
        gg.addColorStop(0, P.sky === "dawn" ? "#262a35" : "#0b0c10");
        gg.addColorStop(0.2, P.sky === "dawn" ? "#1a1d26" : "#060709");
        gg.addColorStop(1, "#020203");
        ctx.fillStyle = gg;
        ctx.fillRect(0, cy, w, h - cy);
        ctx.globalCompositeOperation = "source-over";

        // lane paint
        const paint = (x0: number, x1: number, z0: number, z1: number, a: number, col = "#d9d4c6") => {
          z0 = Math.max(zN, z0);
          if (z1 <= z0) return;
          const s0 = f / z0;
          const s1 = f / z1;
          ctx.beginPath();
          ctx.moveTo(cx + (x0 + curveAt(z0)) * s0, cy + CAM_H * s0);
          ctx.lineTo(cx + (x1 + curveAt(z0)) * s0, cy + CAM_H * s0);
          ctx.lineTo(cx + (x1 + curveAt(z1)) * s1, cy + CAM_H * s1);
          ctx.lineTo(cx + (x0 + curveAt(z1)) * s1, cy + CAM_H * s1);
          ctx.closePath();
          ctx.fillStyle = rgba(col, a);
          ctx.fill();
        };
        const dashOff = camZ % DASH_P;
        for (let k = 0; k < 40; k++) {
          const z0 = k * DASH_P - dashOff;
          paint(-1.85, -1.73, z0, z0 + DASH_L, 0.55 * fogA(z0));
        }
        for (let k = 0; k < 30; k++) {
          const z0 = k * 25;
          paint(-5.2, -5.1, Math.max(zN, z0 - (camZ % 25)), z0 + 25 - (camZ % 25), 0.25 * fogA(z0));
          paint(1.62, 1.72, Math.max(zN, z0 - (camZ % 25)), z0 + 25 - (camZ % 25), 0.25 * fogA(z0));
        }

        // painted words on the asphalt, approaching and passing under the car
        if (P.words.length) {
          const span = P.wordGap * LAMP;
          const cycle = span * P.words.length;
          for (let i = 0; i < P.words.length; i++) {
            const zStart = ((i + 1) * span - (camZ % cycle) + cycle) % cycle;
            const tex = textTexture(P.words[i], `800 260px ${F.sans}`, "#e8e2d2");
            const len = 15;
            drawOnGround(ctx, tex, {
              zNear: zStart,
              zFar: zStart + len,
              xLeft: -1.55,
              xRight: 1.45,
              camH: CAM_H,
              focal: f,
              cx,
              cy,
              alpha: 0.62 * fogA(zStart),
              xAt: curveAt,
            });
          }
        }

        // words timed to the vocal
        for (const wd of P.wordsAt) {
          const zw = travel(wd.t) * LAMP * P.speed + P.lead - camZ;
          if (zw < -16 || zw > 260) continue;
          const tex = textTexture(wd.text, `800 260px ${F.sans}`, "#ece6d6");
          const big = wd.big ? 1.25 : 1;
          drawOnGround(ctx, tex, {
            zNear: zw,
            zFar: zw + 11 * big * big,
            xLeft: -1.6 * big,
            xRight: 1.5 * big,
            camH: CAM_H,
            focal: f,
            cx,
            cy,
            alpha: 0.7 * fogA(Math.max(0, zw)),
            xAt: curveAt,
          });
        }

        // taillights ahead
        if (P.tail) {
          const z = 38 + noise1(T * 0.2, 3) * 12;
          const s = f / z;
          const xx = cx + (0 + curveAt(z)) * s;
          const yy = cy + (CAM_H - 0.8) * s;
          [-0.75, 0.75].forEach((dx) => {
            glow(ctx, xx + dx * s, yy, 40 * (s / 28), C.tail, 0.85, 0.12);
            streakV(ctx, xx + dx * s, cy + CAM_H * s, 8 * (s / 28), 140 * (s / 28), C.tail, 0.25 * P.wet);
          });
        }

        // lamps
        let amb = 0;
        let topFlare = 0;
        let topX = 0;
        const sides = P.lamps === "both" ? [1, -1] : P.lamps === "left" ? [-1] : P.lamps === "right" ? [1] : [];
        const frac = ((camZ / LAMP) % 1 + 1) % 1;
        const baseIndex = Math.floor(camZ / LAMP);
        for (let k = 30; k >= -1; k--) {
          const z = k * LAMP - frac * LAMP + LAMP;
          const lampId = baseIndex + k + 1;
          let on = 1;
          if (P.lampsOffAt !== null) {
            const offT = P.lampsOffAt + (lampId % 9) * 0.47;
            on = 1 - smooth(offT, offT + 0.15, T);
          }
          if (on <= 0.01) continue;
          for (const side of sides) {
            const headX = side === 1 ? 1.2 : -4.8;
            const poleX = side === 1 ? 2.6 : -6.2;
            const fa = fogA(Math.max(0, z));
            if (z > 0.4) {
              const s = f / z;
              const hx = cx + (headX + curveAt(z)) * s;
              const hy = cy - (7.8 - CAM_H) * s;
              const gx = cx + (poleX + curveAt(z)) * s;
              const gy = cy + CAM_H * s;
              // pole + arm
              ctx.strokeStyle = rgba("#000000", 0.55 * fa);
              ctx.lineWidth = Math.max(1, 0.18 * s);
              ctx.beginPath();
              ctx.moveTo(gx, gy);
              ctx.lineTo(gx, hy);
              ctx.lineTo(hx, hy);
              ctx.stroke();
              // light pool + wet reflection
              const ys0 = cy + CAM_H * (f / Math.max(0.5, z - 5));
              const ys1 = cy + CAM_H * (f / (z + 5));
              glowEllipse(ctx, cx + (headX + curveAt(z)) * s, (ys0 + ys1) / 2, 7.5 * s, Math.max(2, (ys0 - ys1) * 0.7), P.lampColor, 0.3 * fa * on);
              streakWet(ctx, hx, gy, Math.min(90, Math.max(3, 0.9 * s)), Math.min(h - gy, (2 * CAM_H + 7.8) * s * 1.2), P.lampColor, 0.3 * P.wet * fa * on, T, lampId * 7 + side);
              // the lamp
              glow(ctx, hx, hy, Math.max(10, 3.2 * s), P.lampColor, 0.95 * fa * on, 0.1);
              glow(ctx, hx, hy, Math.max(18, 9 * s), P.lampColor, 0.18 * fa * on, 0.05);
            }
            // overhead pass
            const near = Math.exp(-(z * z) / (2 * 7 * 7));
            amb += near * on * (sides.length > 1 ? 0.6 : 1);
            if (z > -2 && z < 8) {
              const s = f / Math.max(0.6, z);
              topFlare = Math.max(topFlare, near * on);
              topX = clamp(cx + (headX + curveAt(z)) * s, -200, w + 200);
            }
          }
        }

        // rain lit by the nearest lamps
        if (P.rain > 0) {
          const r = mulberry32(99);
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const n = Math.round(380 * P.rain);
          for (let i = 0; i < n; i++) {
            const x = (r() - 0.5) * 14;
            const y0 = r() * 10 - 8;
            const zz = 1.2 + r() * 22;
            const fall = 9 + r() * 4;
            const y = ((y0 + T * fall + 8) % 10) - 8;
            const z = ((zz - (camZ % 23) + 23) % 23) + 1.2;
            const s = f / z;
            const sx = cx + x * s;
            const sy = cy + y * s;
            const len = Math.min(220, fall * 0.03 * s + 6);
            const a = (0.08 + amb * 0.35) * clamp(1.3 - z / 22);
            ctx.strokeStyle = rgba(P.lampColor === C.sodium ? C.warmWhite : "#dfe8ff", a);
            ctx.lineWidth = Math.max(1, 0.012 * s);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + x * 0.004 * s, sy + len);
            ctx.stroke();
          }
          ctx.restore();
        }

        // passing light wash + flare from the lamp leaving the top of frame
        if (amb > 0.001) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = rgba(P.lampColor, 0.07 * amb);
          ctx.fillRect(0, 0, w, h);
          ctx.restore();
          glow(ctx, topX, -40, 900, P.lampColor, 0.45 * topFlare, 0.04);
        }
        // morning lift
        if (P.sky === "dawn") {
          ctx.fillStyle = rgba(mix(C.dawnCyan, C.dawnPeach, 0.4), 0.06);
          ctx.fillRect(0, 0, w, h);
        }
      }}
    />
  );
};
