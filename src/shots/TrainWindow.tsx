/**
 * TRAIN WINDOW - the city streams sideways past a tall carriage window.
 * Near catenary masts pass once per travel unit (on the kick in the drops); far layers drift slowly.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, rgba, streakH } from "../engine/draw";
import { travel } from "../engine/music";
import { mulberry32 } from "../engine/rng";
import { drawMoon, drawSky, drawSkyline, drawStars, makeSkyline, SkyMood } from "./common";

export type TrainParams = {
  sky: SkyMood;
  moon: boolean;
  rain: number;
  dir: 1 | -1;
  speed: number;
  /** song times of short dark-tunnel blinks */
  blinks: number[];
  windowColor: string;
  interior: number;
  frame: "tall" | "wide" | "none";
};

const DEF: TrainParams = {
  sky: "city",
  moon: true,
  rain: 0,
  dir: 1,
  speed: 1,
  blinks: [],
  windowColor: C.sodium,
  interior: 0.6,
  frame: "tall",
};

const far = makeSkyline(41, 4200, 120, 420, 50, 170);
const mid = makeSkyline(42, 4200, 200, 700, 80, 220);

export const TrainWindow: React.FC<{ p?: Partial<TrainParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      draw={(ctx, w, h) => {
        const d = travel(T) * P.speed;
        const vx = (travel(T + 1 / 60) - travel(T)) * P.speed * 60; // units / s
        const hz = h * 0.62;
        drawSky(ctx, w, hz + 300, P.sky);
        drawStars(ctx, w, hz * 0.6, T, { alpha: P.sky === "dawn" ? 0.1 : 0.5, seed: 4 });
        if (P.moon) drawMoon(ctx, w * 0.72, h * 0.2, 38);
        // far skyline: slow
        const farOff = -((d * 40 * P.dir) % 4000);
        drawSkyline(ctx, far, hz, { offsetX: farOff, color: "#0a0d16", win: 5, litChance: 0.18, alpha: 0.9 });
        drawSkyline(ctx, far, hz, { offsetX: farOff + 4000 * (P.dir > 0 ? 1 : -1), color: "#0a0d16", win: 5, litChance: 0.18, alpha: 0.9 });
        // haze between layers
        const hg = ctx.createLinearGradient(0, hz - 260, 0, hz + 40);
        hg.addColorStop(0, "rgba(0,0,0,0)");
        hg.addColorStop(1, rgba(P.sky === "dawn" ? C.dawnPeach : C.sodiumDeep, 0.18));
        ctx.fillStyle = hg;
        ctx.fillRect(0, hz - 260, w, 300);
        // mid buildings: faster, streaked windows
        const midOff = -((d * 180 * P.dir) % 4000);
        drawSkyline(ctx, mid, hz + 220, { offsetX: midOff, color: "#07080c", win: 9, litChance: 0.3, windowColor: P.windowColor });
        drawSkyline(ctx, mid, hz + 220, { offsetX: midOff + 4000 * (P.dir > 0 ? 1 : -1), color: "#07080c", win: 9, litChance: 0.3, windowColor: P.windowColor });
        // street lights below, streaked
        const r = mulberry32(8);
        for (let i = 0; i < 26; i++) {
          const base = r() * 3000;
          const x = ((base - d * 520 * P.dir) % 3000 + 3000) % 3000 - 600;
          const y = hz + 250 + r() * 160;
          const col = r() > 0.75 ? C.tail : r() > 0.4 ? C.sodium : C.warmWhite;
          streakH(ctx, x, y, 30 + vx * 120, 6 + r() * 6, col, 0.7);
          glow(ctx, x, y, 30, col, 0.25);
        }
        // ground
        const gg = ctx.createLinearGradient(0, hz + 220, 0, h);
        gg.addColorStop(0, "#07080b");
        gg.addColorStop(1, "#020203");
        ctx.fillStyle = gg;
        ctx.fillRect(0, hz + 420, w, h);
        // catenary masts, one per travel unit, motion-blurred
        const unitPx = 1400;
        const mx0 = -((d * unitPx * P.dir) % unitPx);
        for (let k = -1; k < 3; k++) {
          const x = mx0 + k * unitPx + w * 0.5;
          const blur = Math.min(600, vx * unitPx / 60);
          ctx.fillStyle = rgba("#000000", clamp(0.9 - blur / 900));
          ctx.fillRect(x - 22 - blur / 2, 0, 44 + blur, h);
        }
        // overhead wire
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.12);
        ctx.lineTo(w, h * 0.115);
        ctx.stroke();

        // rain on glass
        if (P.rain > 0) {
          const rr = mulberry32(77);
          ctx.save();
          for (let i = 0; i < 260 * P.rain; i++) {
            const x0 = rr() * w;
            const y0 = rr() * h;
            const sp = 40 + rr() * 120;
            const y = (y0 + T * sp) % h;
            const x = (x0 - T * sp * 0.8 * P.dir * vx + w * 10) % w;
            const s = 2 + rr() * 5;
            ctx.fillStyle = rgba("#cfd8e8", 0.12 + rr() * 0.15);
            ctx.beginPath();
            ctx.ellipse(x, y, s * 0.7, s, 0, 0, Math.PI * 2);
            ctx.fill();
            if (rr() > 0.85) glow(ctx, x, y, s * 3, C.sodium, 0.2);
          }
          ctx.restore();
        }
        // tunnel blinks
        for (const b of P.blinks) {
          const k = clamp(1 - Math.abs(T - b) / 0.18);
          if (k > 0) {
            ctx.fillStyle = rgba("#000000", k * 0.95);
            ctx.fillRect(0, 0, w, h);
          }
        }
        // glass reflections of the carriage lights
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = rgba("#ffe7c7", 0.035 * P.interior);
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 4; i++) {
          glow(ctx, w * (0.15 + i * 0.25), h * 0.08, 140, "#fff1db", 0.12 * P.interior, 0.15);
        }
        ctx.restore();

        // carriage frame
        if (P.frame !== "none") {
          const ix = P.frame === "tall" ? w * 0.1 : w * 0.04;
          const iy = P.frame === "tall" ? h * 0.1 : h * 0.3;
          const iw = w - ix * 2;
          const ih = P.frame === "tall" ? h * 0.72 : h * 0.36;
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, w, h);
          const rad = 60;
          ctx.moveTo(ix + rad, iy);
          ctx.arcTo(ix, iy, ix, iy + rad, rad);
          ctx.arcTo(ix, iy + ih, ix + rad, iy + ih, rad);
          ctx.arcTo(ix + iw, iy + ih, ix + iw, iy + ih - rad, rad);
          ctx.arcTo(ix + iw, iy, ix + iw - rad, iy, rad);
          ctx.closePath();
          const fg = ctx.createLinearGradient(0, 0, 0, h);
          fg.addColorStop(0, "#14120f");
          fg.addColorStop(0.5, "#0d0c0b");
          fg.addColorStop(1, "#070706");
          ctx.fillStyle = fg;
          ctx.fill("evenodd");
          ctx.restore();
          // rubber seal highlight
          ctx.strokeStyle = rgba(C.warmWhite, 0.08);
          ctx.lineWidth = 3;
          ctx.strokeRect(ix + 2, iy + 2, iw - 4, ih - 4);
          // grab pole
          if (P.frame === "tall") {
            const g = ctx.createLinearGradient(w * 0.86, 0, w * 0.9, 0);
            g.addColorStop(0, "#151515");
            g.addColorStop(0.5, rgba(C.warmWhite, 0.3));
            g.addColorStop(1, "#0b0b0b");
            ctx.fillStyle = g;
            ctx.fillRect(w * 0.86, 0, w * 0.035, h);
          }
        }
      }}
    />
  );
};
