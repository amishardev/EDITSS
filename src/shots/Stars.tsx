/**
 * STARS - "shoot for the stars". Long-exposure trails, a field that fills in on the beat,
 * a shooting star that can be placed on a musical event.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, rgba, smooth } from "../engine/draw";
import { beatIndex } from "../engine/music";
import { mulberry32 } from "../engine/rng";
import { drawHorizonBand, drawSky, drawStars, SkyMood } from "./common";

export type StarsParams = {
  variant: "field" | "trails" | "fill";
  sky: SkyMood;
  shootAt: number | null;
  shootFrom: [number, number];
  shootTo: [number, number];
  horizon: number;
  /** "fill": reveal from this song time, one notch per beat */
  fillFrom: number;
  rotate: number;
  glowColor: string;
  hillLights: boolean;
};

const DEF: StarsParams = {
  variant: "field",
  sky: "night",
  shootAt: null,
  shootFrom: [0.2, 0.15],
  shootTo: [0.8, 0.45],
  horizon: 0.82,
  fillFrom: 0,
  rotate: 0.012,
  glowColor: C.sodiumDeep,
  hillLights: true,
};

export const Stars: React.FC<{ p?: Partial<StarsParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      bloom={0.5}
      draw={(ctx, w, h) => {
        const hz = h * P.horizon;
        drawSky(ctx, w, hz, P.sky);
        // milky band
        ctx.save();
        ctx.translate(w * 0.5, h * 0.35);
        ctx.rotate(-0.6);
        const mg = ctx.createLinearGradient(0, -260, 0, 260);
        mg.addColorStop(0, "rgba(0,0,0,0)");
        mg.addColorStop(0.5, rgba("#8ea3c8", 0.09));
        mg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mg;
        ctx.fillRect(-w * 1.5, -260, w * 3, 520);
        ctx.restore();

        if (P.variant === "trails") {
          // circumpolar arcs; length grows through the shot
          const r = mulberry32(31);
          const pcx = w * 0.62;
          const pcy = h * 0.1;
          const arc = 0.15 + lt * 0.05;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          for (let i = 0; i < 700; i++) {
            const rad = 40 + Math.pow(r(), 0.8) * h * 1.1;
            const a0 = r() * Math.PI * 2;
            const mag = Math.pow(r(), 2.5);
            const tint = r() > 0.8 ? "#ffd9b0" : r() > 0.5 ? "#c9d8ff" : "#ffffff";
            ctx.strokeStyle = rgba(tint, 0.15 + mag * 0.6);
            ctx.lineWidth = 0.8 + mag * 1.8;
            ctx.beginPath();
            ctx.arc(pcx, pcy, rad, a0, a0 + arc);
            ctx.stroke();
          }
          ctx.restore();
        } else {
          const reveal =
            P.variant === "fill" ? clamp((beatIndex(T) - beatIndex(P.fillFrom) + 1) / 32, 0.02, 1) : 1;
          drawStars(ctx, w, hz, T, { density: 520, seed: 5, rotate: lt * P.rotate, reveal });
        }

        // shooting star
        if (P.shootAt !== null) {
          const k = (T - P.shootAt) / 0.7;
          if (k > -0.05 && k < 1.6) {
            const kk = clamp(k);
            const [x0, y0] = [P.shootFrom[0] * w, P.shootFrom[1] * h];
            const [x1, y1] = [P.shootTo[0] * w, P.shootTo[1] * h];
            const hx = x0 + (x1 - x0) * kk;
            const hy = y0 + (y1 - y0) * kk;
            const tail = 0.35;
            const tx = x0 + (x1 - x0) * Math.max(0, kk - tail);
            const ty = y0 + (y1 - y0) * Math.max(0, kk - tail);
            const fade = 1 - smooth(1, 1.6, k);
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            const g = ctx.createLinearGradient(tx, ty, hx, hy);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(1, rgba("#ffffff", 0.9 * fade));
            ctx.strokeStyle = g;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(hx, hy);
            ctx.stroke();
            ctx.restore();
            glow(ctx, hx, hy, 60, "#e8f0ff", 0.8 * fade);
          }
        }

        // horizon: dark hills, a warm town glow, a few far lights
        const hg = ctx.createLinearGradient(0, hz - 300, 0, hz);
        hg.addColorStop(0, "rgba(0,0,0,0)");
        hg.addColorStop(1, rgba(P.glowColor, 0.22));
        ctx.fillStyle = hg;
        ctx.fillRect(0, hz - 300, w, 300);
        drawHorizonBand(ctx, w, hz, 90, 17, "#030407");
        ctx.fillStyle = "#030407";
        ctx.fillRect(0, hz, w, h - hz);
        if (P.hillLights) {
          const r = mulberry32(12);
          for (let i = 0; i < 22; i++) glow(ctx, r() * w, hz - r() * 30, 8 + r() * 10, C.sodium, 0.4 + r() * 0.4, 0.2);
        }
      }}
    />
  );
};
