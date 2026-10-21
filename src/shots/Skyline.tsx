/**
 * SKYLINE - the city from a rooftop. Windows can follow the music:
 *  "static"   quiet city
 *  "closing"  windows go dark one by one on each beat after `modeAt` (the bar kicks us out)
 *  "waking"   windows come on after `modeAt` (back into the night / or morning)
 *  "pulse"    a few windows breathe with the bass
 * Aircraft beacons blink on the kick.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, haze, rgba } from "../engine/draw";
import { env, kick, beatIndex } from "../engine/music";
import { hash } from "../engine/rng";
import { drawClouds, drawMoon, drawSky, drawSkyline, drawStars, makeSkyline, SkyMood } from "./common";

export type SkylineParams = {
  sky: SkyMood;
  moon: boolean;
  moonX: number;
  moonY: number;
  moonR: number;
  mode: "static" | "closing" | "waking" | "pulse";
  modeAt: number;
  parapet: boolean;
  drift: number;
  beacons: boolean;
  trainBridge: boolean;
  zoom: number;
  horizon: number;
  stars: number;
  figures: number;
};

const DEF: SkylineParams = {
  sky: "city",
  moon: true,
  moonX: 0.7,
  moonY: 0.2,
  moonR: 42,
  mode: "static",
  modeAt: 0,
  parapet: true,
  drift: 14,
  beacons: true,
  trainBridge: false,
  zoom: 1,
  horizon: 0.66,
  stars: 0.4,
  figures: 0,
};

const back = makeSkyline(11, 1500, 160, 520, 40, 140);
const front = makeSkyline(12, 1500, 260, 860, 70, 210);

export const Skyline: React.FC<{ p?: Partial<SkylineParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      draw={(ctx, w, h) => {
        const hz = h * P.horizon;
        drawSky(ctx, w, hz + 10, P.sky);
        if (P.stars) drawStars(ctx, w, hz * 0.7, T, { alpha: P.stars, seed: 9 });
        if (P.moon) drawMoon(ctx, w * P.moonX, h * P.moonY, P.moonR);
        drawClouds(ctx, w, h * 0.1, h * 0.4, T, { alpha: 0.45, count: 4, speed: 5, seed: 8 });
        ctx.save();
        ctx.translate(w / 2, hz);
        ctx.scale(P.zoom, P.zoom);
        ctx.translate(-w / 2, -hz);
        const dx = -lt * P.drift;
        const beatsSince = Math.max(0, beatIndex(T) - beatIndex(P.modeAt));
        const litFn = (layer: number) => (bi: number, wi: number, base: number) => {
          const id = hash(bi * 977 + wi * 13 + layer * 7);
          if (P.mode === "closing" && T >= P.modeAt) {
            // each beat a slice of the city goes dark
            return id < beatsSince * 0.035 ? 0 : base;
          }
          if (P.mode === "waking") {
            const on = T >= P.modeAt && id < beatsSince * 0.03 + 0.05 ? 0.8 : 0;
            return Math.max(base * 0.25, on);
          }
          if (P.mode === "pulse") {
            return id > 0.92 ? base * (0.4 + env("bass", T) * 0.8) : base;
          }
          return base;
        };
        drawSkyline(ctx, back, hz - 40, { offsetX: dx * 0.4 - 200, color: "#0b0f1a", win: 5, litChance: 0.2, alpha: 0.95, litFn: litFn(1) });
        haze(ctx, w, hz - 60, 320, P.sky === "dawn" ? C.dawnPeach : C.sodiumDeep, 0.16);
        drawSkyline(ctx, front, hz + 200, {
          offsetX: dx - 220,
          color: "#06070b",
          win: 8,
          litChance: 0.26,
          litFn: litFn(2),
          beacon: P.beacons ? 0.25 + kick(T, 0.12) * 0.75 : 0,
        });
        // train on a bridge, a long lit streak sliding across
        if (P.trainBridge) {
          const y = hz + 120;
          ctx.fillStyle = "#040507";
          ctx.fillRect(0, y + 10, w, 14);
          const x = ((lt * 260) % (w + 1400)) - 900;
          for (let i = 0; i < 9; i++) {
            const cx = x + i * 82;
            ctx.fillStyle = "#0a0a0c";
            ctx.fillRect(cx, y - 18, 78, 28);
            ctx.fillStyle = rgba(C.warmWhite, 0.85);
            for (let j = 0; j < 4; j++) ctx.fillRect(cx + 8 + j * 18, y - 12, 10, 9);
          }
          glow(ctx, x + 380, y - 6, 420, C.warmWhite, 0.12, 0.1);
        }
        ctx.restore();
        // the rooftop we stand on
        if (P.parapet) {
          const py = h * 0.86;
          const g = ctx.createLinearGradient(0, py, 0, h);
          g.addColorStop(0, "#0d0d10");
          g.addColorStop(1, "#040405");
          ctx.fillStyle = g;
          ctx.fillRect(0, py, w, h - py);
          ctx.fillStyle = rgba(C.sodium, 0.08);
          ctx.fillRect(0, py, w, 3);
          // friends sitting on the ledge, tiny silhouettes against the glow
          for (let i = 0; i < P.figures; i++) {
            const fx = w * (0.3 + i * 0.13) + Math.sin(lt * 0.6 + i) * 2;
            const fy = py;
            ctx.fillStyle = "#030304";
            ctx.beginPath();
            ctx.arc(fx, fy - 74, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(fx - 24, fy);
            ctx.quadraticCurveTo(fx - 24, fy - 58, fx, fy - 60);
            ctx.quadraticCurveTo(fx + 24, fy - 58, fx + 24, fy);
            ctx.fill();
          }
        }
        // overall exposure breathes very slightly with the pad
        const breathe = clamp(env("pad", T) * 0.06);
        ctx.fillStyle = rgba(C.sodium, breathe * 0.2);
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};
