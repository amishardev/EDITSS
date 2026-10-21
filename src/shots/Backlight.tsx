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
import { drawHorizonBand, drawSky, drawSkyline, makeSkyline } from "./common";

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

/** one long shadow on the ground, foreshortened toward the vanishing point */
const shadow = (ctx: CanvasRenderingContext2D, footX: number, footY: number, vpX: number, vpY: number, len: number, phase: number, alpha: number) => {
  const dx = vpX - footX;
  const dy = vpY - footY;
  const ang = Math.atan2(dy, dx);
  ctx.save();
  ctx.translate(footX, footY);
  ctx.rotate(ang);
  ctx.filter = "blur(5px)";
  ctx.fillStyle = rgba("#1a0f08", alpha);
  const width = 170;
  // perspective taper: the shadow narrows as it runs away from us
  const wAt = (u: number) => width * (1 - 0.6 * (u / len));
  const sw = Math.sin(phase) * 0.12;
  ctx.beginPath();
  // two legs
  for (const side of [-1, 1]) {
    const lift = side * sw;
    ctx.moveTo(0, side * wAt(0) * 0.08);
    ctx.lineTo(len * 0.47, side * wAt(len * 0.47) * (0.06 + lift));
    ctx.lineTo(len * 0.47, side * wAt(len * 0.47) * (0.3 + lift));
    ctx.lineTo(0, side * wAt(0) * 0.2);
    ctx.closePath();
  }
  ctx.fill();
  // torso + shoulders
  ctx.beginPath();
  ctx.moveTo(len * 0.45, -wAt(len * 0.45) * 0.34);
  ctx.lineTo(len * 0.8, -wAt(len * 0.8) * 0.5);
  ctx.quadraticCurveTo(len * 0.86, 0, len * 0.8, wAt(len * 0.8) * 0.5);
  ctx.lineTo(len * 0.45, wAt(len * 0.45) * 0.34);
  ctx.closePath();
  ctx.fill();
  // head
  ctx.beginPath();
  ctx.ellipse(len * 0.91, 0, len * 0.055, wAt(len * 0.91) * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

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
        // shadows variant: low warm sun behind camera
        const hz = h * 0.38;
        drawSky(ctx, w, hz + 2, "dusk");
        haze(ctx, w, hz, 360, "#f0b07a", 0.35 * P.warmth);
        drawHorizonBand(ctx, w, hz + 2, 50, 5, "#3a2a28");
        // road receding
        const vpX = w * 0.5;
        const g = ctx.createLinearGradient(0, hz, 0, h);
        g.addColorStop(0, mix("#5a4038", "#3a2c28", 1 - P.warmth));
        g.addColorStop(0.45, "#7e5640");
        g.addColorStop(1, "#a8734c");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(vpX - 12, hz);
        ctx.lineTo(vpX + 12, hz);
        ctx.lineTo(w * 1.3, h);
        ctx.lineTo(-w * 0.3, h);
        ctx.closePath();
        ctx.fill();
        // verges
        ctx.fillStyle = "#4a3426";
        ctx.beginPath();
        ctx.moveTo(0, hz);
        ctx.lineTo(vpX - 12, hz);
        ctx.lineTo(-w * 0.3, h);
        ctx.lineTo(0, h);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w, hz);
        ctx.lineTo(vpX + 12, hz);
        ctx.lineTo(w * 1.3, h);
        ctx.lineTo(w, h);
        ctx.fill();
        // centre dashes drifting toward the horizon (we walk forward)
        const r = mulberry32(2);
        for (let k = 0; k < 14; k++) {
          const v = ((k / 14 + lt * 0.05 * P.walk) % 1);
          const y0 = lerp(h, hz, Math.pow(v, 0.35));
          const y1 = lerp(h, hz, Math.pow(Math.min(1, v + 0.025), 0.35));
          const ww = lerp(14, 1, Math.pow(v, 0.35));
          ctx.fillStyle = rgba("#f3e2c0", 0.55);
          ctx.fillRect(vpX - ww / 2, y1, ww, y0 - y1);
        }
        // the group's shadows
        for (let i = 0; i < P.people; i++) {
          const spread = (i - (P.people - 1) / 2) * 190;
          const bob = Math.sin(lt * 4.2 * P.walk + i * 1.7);
          const footX = vpX + spread + Math.sin(lt * 0.7 + i) * 6;
          const footY = h * 1.02;
          const len = (h - hz) * (0.66 + i * 0.03) + bob * 6;
          shadow(ctx, footX, footY, vpX + spread * 0.05, hz + 30, len, lt * 4.2 * P.walk + i * 1.7, 0.78);
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
