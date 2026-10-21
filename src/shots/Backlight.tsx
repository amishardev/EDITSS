/**
 * BACKLIGHT - "our backs to the sun". The sun is behind the camera, so the group's long
 * shadows run ahead of us down the road toward the horizon. Or (variant "rise") the first
 * sun comes up behind the city at the end of the night.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, haze, lerp, mix, rgba } from "../engine/draw";
import { kick } from "../engine/music";
import { mulberry32 } from "../engine/rng";
import { drawHorizonBand, drawSky, drawSkyline, makeSkyline, projectedShadow } from "./common";

export type BacklightParams = {
  variant: "shadows" | "rise";
  people: number;
  walk: number;
  sunUp: number;
  dust: number;
  warmth: number;
};

const DEF: BacklightParams = {
  variant: "shadows",
  people: 3,
  walk: 1,
  sunUp: 0.5,
  dust: 0.6,
  warmth: 1,
};

const city = makeSkyline(71, 1300, 120, 520, 40, 150);

export const Backlight: React.FC<{ p?: Partial<BacklightParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      bloom={0.75}
      draw={(ctx, w, h) => {
        if (P.variant === "rise") {
          const hz = h * 0.62;
          drawSky(ctx, w, hz + 20, "dawn");
          const sy = hz - P.sunUp * 180 - lt * 6;
          glow(ctx, w * 0.5, sy, 1300, "#f0a77a", 0.32, 0.05);
          glow(ctx, w * 0.5, sy, 150, "#fff0d8", 0.85, 0.2);
          haze(ctx, w, hz - 40, 420, C.dawnPeach, 0.35);
          drawSkyline(ctx, city, hz + 140, { color: "#0e1019", win: 6, litChance: 0.08, windowColor: C.warmWhite, offsetX: -100 - lt * 4 });
          ctx.fillStyle = "#0b0c14";
          ctx.fillRect(0, hz + 138, w, h);
          // light catches the tops of buildings
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = rgba(C.dawnPeach, 0.06);
          ctx.fillRect(0, 0, w, hz + 140);
          ctx.restore();
          return;
        }
        // shadows variant: low warm sun behind the camera, our shadows run ahead to the horizon
        const hz = h * 0.36;
        drawSky(ctx, w, hz + 2, "dusk");
        haze(ctx, w, hz, 360, "#f0b07a", 0.35 * P.warmth);
        drawHorizonBand(ctx, w, hz + 2, 50, 5, "#3a2a28");
        const cx = w * 0.5;
        const f = h * 0.62;
        const CH = 1.7;
        const prj = (x: number, z: number) => [cx + (x * f) / z, hz + (CH * f) / z] as const;
        const camZ = lt * 1.4 * P.walk;
        // verges and road
        ctx.fillStyle = "#3f2c22";
        ctx.fillRect(0, hz, w, h - hz);
        const road = (xa: number, xb: number, fill: string | CanvasGradient) => {
          const [a0x, a0y] = prj(xa, 0.6);
          const [b0x] = prj(xb, 0.6);
          const [a1x, a1y] = prj(xa, 400);
          const [b1x] = prj(xb, 400);
          ctx.beginPath();
          ctx.moveTo(a0x, a0y);
          ctx.lineTo(b0x, a0y);
          ctx.lineTo(b1x, a1y);
          ctx.lineTo(a1x, a1y);
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        };
        const g = ctx.createLinearGradient(0, hz, 0, h);
        g.addColorStop(0, mix("#6a4c3e", "#3a2c28", 1 - P.warmth));
        g.addColorStop(0.5, "#8a5f44");
        g.addColorStop(1, "#a8734c");
        road(-3.2, 3.2, g);
        // centre dashes moving toward the horizon as we walk
        for (let k = 0; k < 30; k++) {
          const z = k * 6 - (camZ % 6) + 0.8;
          const [x0, y0] = prj(-0.06, z);
          const [x1, y1] = prj(0.06, z + 2.5);
          ctx.fillStyle = rgba("#f3e2c0", 0.5 * Math.min(1, 40 / z));
          ctx.fillRect(Math.min(x0, x1), y1, Math.max(1, Math.abs(x1 - x0) + 2), y0 - y1);
        }
        // the group's shadows, parallel, pointing to the vanishing point
        const L = 7.5;
        for (let i = 0; i < P.people; i++) {
          const xs = (i - (P.people - 1) / 2) * 1.1 + Math.sin(lt * 0.6 + i) * 0.05;
          const stride = lt * 4.6 * P.walk + i * 1.7;
          projectedShadow(ctx, prj, xs, 1.0 + Math.sin(stride) * 0.03, -0.04 * xs, 1, L, stride, 0.72, 4, "#1e1209");
        }
        // dust in the sunbeam, kicks give it a shimmer
        const dr = mulberry32(44);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 160 * P.dust; i++) {
          const x = (dr() * w + lt * (8 + dr() * 20)) % w;
          const y = (dr() * h + lt * (4 + dr() * 6)) % h;
          const s = 1 + dr() * 3;
          ctx.fillStyle = rgba("#ffe2b5", (0.08 + dr() * 0.25) * (1 + kick(T, 0.2) * 0.6));
          ctx.fillRect(x, y, s, s);
        }
        ctx.restore();
        // warm wash from behind
        const wash = ctx.createLinearGradient(0, h, 0, 0);
        wash.addColorStop(0, rgba("#ffb070", 0.25 * P.warmth));
        wash.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);
        glow(ctx, w * 0.5, h * 1.1, w * 1.2, "#ffc27a", 0.25 * P.warmth, 0.05);
        ctx.fillStyle = rgba("#000000", clamp(0.1 - P.warmth * 0.1));
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};
