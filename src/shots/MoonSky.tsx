/**
 * MOON - the one thing that doesn't move. Variants:
 *  "clouds"  big moon, clouds crossing it
 *  "follow"  wires / branches / rooftops race past in front, the moon stays put
 *  "water"   moon over black water with a glitter path that shivers on the hats
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, rgba } from "../engine/draw";
import { env, kick, travel } from "../engine/music";
import { mulberry32, noise1 } from "../engine/rng";
import { drawClouds, drawHorizonBand, drawMoon, drawSky, drawStars, SkyMood } from "./common";

export type MoonParams = {
  variant: "clouds" | "follow" | "water";
  sky: SkyMood;
  x: number;
  y: number;
  r: number;
  rise: number;
  cloudSpeed: number;
  cloudAlpha: number;
  stars: number;
  /** for "follow": what races past */
  foreground: "wires" | "branches" | "roofs";
  warm: number;
};

const DEF: MoonParams = {
  variant: "clouds",
  sky: "night",
  x: 0.5,
  y: 0.38,
  r: 150,
  rise: 0,
  cloudSpeed: 18,
  cloudAlpha: 0.42,
  stars: 0.5,
  foreground: "wires",
  warm: 0,
};

export const MoonSky: React.FC<{ p?: Partial<MoonParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      bloom={0.65}
      draw={(ctx, w, h) => {
        const horizon = P.variant === "water" ? h * 0.6 : h;
        drawSky(ctx, w, horizon, P.sky);
        drawStars(ctx, w, horizon * 0.95, T, { alpha: P.stars, seed: 2, density: 200 });
        const mx = w * P.x;
        const my = h * P.y + P.rise * Math.max(0, 6 - lt) * 14;
        drawMoon(ctx, mx, my, P.r, { warm: P.warm });
        drawClouds(ctx, w, my - P.r * 2, my + P.r * 2.2, T, {
          seed: 14,
          count: 6,
          speed: P.cloudSpeed,
          alpha: P.cloudAlpha,
          color: "#0c111c",
          lit: C.moon,
        });

        if (P.variant === "water") {
          // water body
          const g = ctx.createLinearGradient(0, horizon, 0, h);
          g.addColorStop(0, "#0b1322");
          g.addColorStop(1, "#020306");
          ctx.fillStyle = g;
          ctx.fillRect(0, horizon, w, h - horizon);
          drawHorizonBand(ctx, w, horizon + 1, 26, 31, "#04060a");
          // glitter path
          const r = mulberry32(3);
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const shiver = 0.6 + env("hat", T) * 0.8;
          for (let i = 0; i < 520; i++) {
            const v = Math.pow(r(), 1.6);
            const y = horizon + 6 + v * (h - horizon);
            const spread = 18 + v * 260;
            const x = mx + (r() - 0.5) * 2 * spread * (0.6 + 0.4 * noise1(i + T * 1.5, 4));
            const flick = Math.sin(T * (3 + r() * 6) + i) * 0.5 + 0.5;
            const a = (0.15 + flick * 0.6) * (1 - v * 0.6) * shiver * 0.5;
            const len = 6 + v * 46;
            ctx.fillStyle = rgba(C.moon, a);
            ctx.fillRect(x - len / 2, y, len, 1.5 + v * 3);
          }
          ctx.restore();
          glow(ctx, mx, horizon + 20, 300, C.moonDeep, 0.15);
        }

        if (P.variant === "follow") {
          const d = travel(T);
          if (P.foreground === "wires") {
            // utility poles + sagging wires, one pole per travel unit
            const unit = w * 1.3;
            const off = (d * unit) % unit;
            ctx.strokeStyle = "rgba(2,3,5,0.95)";
            for (let k = -1; k < 3; k++) {
              const x = w - off + k * unit - unit * 0.5;
              ctx.fillStyle = "#020305";
              ctx.fillRect(x - 16, h * 0.18, 32, h);
              ctx.fillRect(x - 120, h * 0.22, 240, 14);
              for (let j = 0; j < 3; j++) {
                ctx.lineWidth = 3;
                ctx.beginPath();
                const y0 = h * 0.225 + j * 6;
                ctx.moveTo(x - 110 + j * 110, y0);
                ctx.quadraticCurveTo(x + unit / 2, y0 + 140, x + unit - 110 + j * 110, y0);
                ctx.stroke();
              }
            }
          } else if (P.foreground === "branches") {
            const r = mulberry32(19);
            ctx.save();
            ctx.filter = "blur(6px)";
            ctx.fillStyle = "#020304";
            const off = (d * 900) % (w * 3);
            for (let i = 0; i < 14; i++) {
              const bx = ((r() * w * 3 - off) % (w * 3) + w * 3) % (w * 3) - w;
              const by = r() * h * 0.5;
              ctx.beginPath();
              ctx.ellipse(bx, by, 160 + r() * 260, 60 + r() * 140, r() * 3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          } else {
            const r = mulberry32(23);
            const off = (d * 700) % (w * 2);
            ctx.fillStyle = "#020305";
            for (let i = 0; i < 12; i++) {
              const bw = 120 + r() * 260;
              const bh = 200 + r() * 520;
              const bx = ((i * 220 - off) % (w * 2) + w * 2) % (w * 2) - 200;
              ctx.fillRect(bx, h - bh, bw, bh);
            }
          }
        }

        // the moon "hears" the kick in drops: a breath of halo
        glow(ctx, mx, my, P.r * 5, C.moon, 0.06 * kick(T, 0.15), 0.1);
        const lift = clamp(env("vocal", T)) * 0.05;
        ctx.fillStyle = rgba(C.moonDeep, lift);
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};
