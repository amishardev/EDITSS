/**
 * LIGHT - the city reduced to light.
 *  Bokeh  : out-of-focus city lights; `focus` racks between soft discs and sharp points.
 *  Trails : long-exposure traffic from an overpass; a pulse runs down the lanes on each kick.
 *  Facade : an apartment block face-on. Modes: "quiet", "one" (a single window = someone home),
 *           "sequencer" (windows play the drop's real kick/clap/hat pattern), "party" (one flat dancing).
 *  Puddle : looking down into a puddle that holds the sky; rings on the beat.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime, useLocalTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, mix, rgba } from "../engine/draw";
import { BEAT, BAR } from "../engine/song";
import { beatIndex, clap, env, kick, pulse } from "../engine/music";
import { hash, mulberry32, noise1 } from "../engine/rng";
import { drawMoon } from "./common";
import { SONG } from "../engine/song";

export type BokehParams = { palette: "sodium" | "mixed" | "cool" | "dawn"; focus: number; rackTo: number | null; rackAt: number; count: number; drift: number };
const BK_DEF: BokehParams = { palette: "mixed", focus: 0, rackTo: null, rackAt: 0, count: 46, drift: 18 };
const PALS: Record<BokehParams["palette"], string[]> = {
  sodium: [C.sodium, C.sodiumDeep, C.warmWhite, C.ember],
  mixed: [C.sodium, C.tail, C.warmWhite, "#9fb6ff", C.neonRose],
  cool: [C.moon, "#9fb6ff", "#6f8fc9", C.warmWhite],
  dawn: [C.dawnPeach, C.dawnCyan, C.warmWhite, C.dawnRose],
};

export const Bokeh: React.FC<{ p?: Partial<BokehParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...BK_DEF, ...p };
  return (
    <Canvas
      bloom={0.4}
      draw={(ctx, w, h) => {
        ctx.fillStyle = P.palette === "dawn" ? "#141a26" : "#05060a";
        ctx.fillRect(0, 0, w, h);
        let focus = P.focus;
        if (P.rackTo !== null) focus = P.focus + (P.rackTo - P.focus) * clamp((T - P.rackAt) / 0.8);
        const r = mulberry32(21);
        const pal = PALS[P.palette];
        for (let i = 0; i < P.count; i++) {
          const x = r() * w + noise1(lt * 0.2, i) * P.drift * 3 - lt * P.drift * (0.3 + r());
          const y = r() * h;
          const col = pal[Math.floor(r() * pal.length)];
          const big = 30 + r() * 110;
          const rad = big * (1 - focus) + 4 * focus;
          const a = (0.12 + r() * 0.2) * (1 + kick(T, 0.15) * 0.25);
          const xx = ((x % (w + 300)) + w + 300) % (w + 300) - 150;
          if (focus < 0.7) {
            // disc with a slightly brighter rim, like a real lens
            const g = ctx.createRadialGradient(xx, y, rad * 0.2, xx, y, rad);
            g.addColorStop(0, rgba(col, a * 0.7));
            g.addColorStop(0.85, rgba(col, a));
            g.addColorStop(1, rgba(col, 0));
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(xx, y, rad, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          if (focus > 0.3) glow(ctx, xx, y, 20 + rad, col, a * 2 * focus, 0.1);
        }
      }}
    />
  );
};

export type TrailsParams = { curve: number; lanes: number; red: number; tone: string; pulse: boolean };
const TR_DEF: TrailsParams = { curve: 0.4, lanes: 6, red: 0.5, tone: "#07080c", pulse: true };

export const Trails: React.FC<{ p?: Partial<TrailsParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...TR_DEF, ...p };
  return (
    <Canvas
      bloom={0.7}
      draw={(ctx, w, h) => {
        ctx.fillStyle = P.tone;
        ctx.fillRect(0, 0, w, h);
        // ground / barriers
        ctx.fillStyle = "#0b0c10";
        ctx.fillRect(0, h * 0.2, w, h * 0.8);
        const lanePath = (i: number, s: number) => {
          // s 0..1 along the road (top = far)
          const spread = (i - (P.lanes - 1) / 2) * 70 * (0.3 + s * 1.4);
          const bend = Math.sin(s * Math.PI * 0.9) * P.curve * w * 0.5;
          return [w * 0.5 + spread + bend - P.curve * w * 0.25, h * 0.15 + s * h * 0.9] as const;
        };
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < P.lanes; i++) {
          const red = i < P.lanes * P.red;
          const col = red ? C.tail : C.warmWhite;
          for (let pass = 0; pass < 2; pass++) {
            ctx.strokeStyle = rgba(col, pass ? 0.9 : 0.18);
            ctx.lineWidth = pass ? 3 : 18;
            ctx.beginPath();
            for (let k = 0; k <= 60; k++) {
              const [x, y] = lanePath(i, k / 60);
              k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            }
            ctx.stroke();
          }
          // a bright pulse rides down the lane after each kick
          if (P.pulse) {
            const kp = kick(T, 0.25);
            const age = 1 - kp;
            const s = clamp(red ? 1 - age : age);
            const [x, y] = lanePath(i, s);
            glow(ctx, x, y, 90, col, kp * 0.7, 0.12);
          }
        }
        ctx.restore();
        // street lamps along the road
        for (let k = 0; k < 9; k++) {
          const [x, y] = lanePath(-1.5, k / 9);
          glow(ctx, x - 60, y, 50 + k * 10, C.sodium, 0.6, 0.1);
        }
      }}
    />
  );
};

export type FacadeParams = { mode: "quiet" | "one" | "sequencer" | "party"; oneAt: number; tone: string; cols: number; rows: number };
const FC_DEF: FacadeParams = { mode: "quiet", oneAt: 0, tone: "#1a1b22", cols: 6, rows: 11 };

/** real drum pattern of the drop: which 16ths have kick / clap / offbeat hat */
const STEP_KICK = [0, 4, 8, 12];
const STEP_CLAP = [4, 12];
const STEP_HAT = [2, 6, 10, 14];

export const Facade: React.FC<{ p?: Partial<FacadeParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...FC_DEF, ...p };
  return (
    <Canvas
      bloom={0.55}
      draw={(ctx, w, h) => {
        ctx.fillStyle = P.tone;
        ctx.fillRect(0, 0, w, h);
        // concrete texture
        const r = mulberry32(31);
        for (let i = 0; i < 900; i++) {
          ctx.fillStyle = rgba(r() > 0.5 ? "#ffffff" : "#000000", 0.02 + r() * 0.03);
          ctx.fillRect(r() * w, r() * h, 3, 3);
        }
        glow(ctx, w * 0.15, h * 1.05, w * 1.2, C.sodium, 0.22, 0.05);
        const mx = 90;
        const my = 70;
        const cw = (w - mx * 2) / P.cols;
        const rh = (h - my * 2) / P.rows;
        const step16 = Math.floor((((T % BAR) + BAR) % BAR) / (BEAT / 4));
        const sinceStep = ((T % (BEAT / 4)) + BEAT / 4) % (BEAT / 4);
        for (let ry = 0; ry < P.rows; ry++) {
          for (let cx = 0; cx < P.cols; cx++) {
            const id = ry * P.cols + cx;
            const x = mx + cx * cw + cw * 0.14;
            const y = my + ry * rh + rh * 0.16;
            const ww = cw * 0.72;
            const hh = rh * 0.6;
            let lit = 0;
            let col: string = hash(id, 2) > 0.6 ? C.warmWhite : C.sodium;
            if (P.mode === "quiet") lit = hash(id, 1) > 0.72 ? 0.5 + hash(id, 3) * 0.5 : 0;
            if (P.mode === "one") {
              const chosen = Math.floor(P.rows / 2) * P.cols + 2;
              lit = id === chosen && T >= P.oneAt ? 1 : hash(id, 1) > 0.94 ? 0.25 : 0;
            }
            if (P.mode === "party") {
              const chosen = 4 * P.cols + 3;
              lit = hash(id, 1) > 0.85 ? 0.4 : 0;
              if (id === chosen) {
                lit = 1;
                col = mix(C.neonRose, C.barGlow, (Math.sin(T * 2) + 1) / 2);
              }
            }
            if (P.mode === "sequencer") {
              // rows 0-2 hats, middle rows clap, low rows kick; 16 steps wrap over columns*rows bands
              const band = ry < 3 ? "hat" : ry < 7 ? "clap" : "kick";
              const stepOfWindow = (cx + (ry % 3) * P.cols) % 16;
              const pattern = band === "hat" ? STEP_HAT : band === "clap" ? STEP_CLAP : STEP_KICK;
              const isActive = pattern.includes(stepOfWindow) && stepOfWindow === step16;
              const decay = Math.exp(-sinceStep / 0.08);
              const base = hash(id, 1) > 0.8 ? 0.3 : 0;
              lit = isActive ? 0.4 + 0.6 * decay : base;
              col = band === "hat" ? C.moon : band === "clap" ? C.warmWhite : C.sodium;
              if (T < SONG.sections[4].start || T > SONG.sections[8].end) lit = base;
            }
            // frame
            ctx.fillStyle = "#050507";
            ctx.fillRect(x - 6, y - 6, ww + 12, hh + 12);
            if (lit > 0.01) {
              const g = ctx.createLinearGradient(0, y, 0, y + hh);
              g.addColorStop(0, rgba(col, 0.9 * lit));
              g.addColorStop(1, rgba(mix(col, "#000000", 0.4), 0.9 * lit));
              ctx.fillStyle = g;
              ctx.fillRect(x, y, ww, hh);
              // curtain
              ctx.fillStyle = rgba("#000000", 0.25);
              ctx.fillRect(x, y, ww * 0.18, hh);
              glow(ctx, x + ww / 2, y + hh / 2, ww * 1.1, col, 0.18 * lit);
              if (P.mode === "party" && lit === 1) {
                // silhouettes in the one window
                for (let k = 0; k < 3; k++) {
                  const bx = x + ww * (0.3 + k * 0.22) + Math.sin(T * 6.7 + k) * 6;
                  const by = y + hh * 0.55 - kick(T, 0.1) * 8;
                  ctx.fillStyle = "rgba(10,4,6,0.85)";
                  ctx.beginPath();
                  ctx.arc(bx, by - 26, 11, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.fillRect(bx - 14, by - 14, 28, 60);
                }
              }
            } else {
              const dg = ctx.createLinearGradient(0, y, 0, y + hh);
              dg.addColorStop(0, "#151a26");
              dg.addColorStop(1, "#0b0d14");
              ctx.fillStyle = dg;
              ctx.fillRect(x, y, ww, hh);
            }
            // sill
            ctx.fillStyle = "rgba(255,255,255,0.04)";
            ctx.fillRect(x - 8, y + hh + 6, ww + 16, 6);
          }
        }
        void clap;
        void beatIndex;
        void env;
        void pulse;
      }}
    />
  );
};

export type PuddleParams = { holds: "moon" | "neon" | "lamp"; color: string; rings: "beat" | "kick" | "hat" | "none"; step: number | null };
const PD_DEF: PuddleParams = { holds: "moon", color: C.neonRose, rings: "kick", step: null };

export const Puddle: React.FC<{ p?: Partial<PuddleParams> }> = ({ p }) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const P = { ...PD_DEF, ...p };
  return (
    <Canvas
      bloom={0.6}
      draw={(ctx, w, h) => {
        // asphalt
        ctx.fillStyle = "#0e0f12";
        ctx.fillRect(0, 0, w, h);
        const r = mulberry32(8);
        for (let i = 0; i < 2600; i++) {
          ctx.fillStyle = rgba(r() > 0.5 ? "#ffffff" : "#000000", 0.04 + r() * 0.06);
          ctx.fillRect(r() * w, r() * h, 2 + r() * 3, 2 + r() * 3);
        }
        // puddle shape
        ctx.save();
        ctx.beginPath();
        for (let k = 0; k <= 64; k++) {
          const a = (k / 64) * Math.PI * 2;
          const rad = 1 + (noise1(k * 0.35, 3) - 0.5) * 0.35;
          const x = w * 0.5 + Math.cos(a) * w * 0.44 * rad;
          const y = h * 0.5 + Math.sin(a) * h * 0.34 * rad;
          k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.closePath();
        ctx.clip();
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, "#0b1426");
        sky.addColorStop(1, "#05080f");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);
        // ripple offset (whole reflection wobbles slightly)
        const wob = Math.sin(lt * 2.1) * 3;
        if (P.holds === "moon") drawMoon(ctx, w * 0.56 + wob, h * 0.42, 110);
        if (P.holds === "neon") {
          glow(ctx, w * 0.5 + wob, h * 0.45, 420, P.color, 0.5, 0.15);
          ctx.strokeStyle = rgba(P.color, 0.8);
          ctx.lineWidth = 10;
          ctx.strokeRect(w * 0.3 + wob, h * 0.4, w * 0.4, 90);
        }
        if (P.holds === "lamp") glow(ctx, w * 0.45 + wob, h * 0.4, 380, C.sodium, 0.9, 0.12);
        // a few reflected stars
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = rgba("#ffffff", 0.3 + r() * 0.4);
          ctx.fillRect(r() * w, r() * h, 2, 2);
        }
        // rings
        const times = P.rings === "kick" ? SONG.kicks : P.rings === "hat" ? SONG.kicks.map((k) => k + BEAT / 2) : P.rings === "beat" ? Array.from({ length: 500 }, (_, i) => i * BEAT) : [];
        const recent = times.filter((t) => t <= T && T - t < 1.6).slice(-4);
        recent.forEach((t, i) => {
          const age = T - t;
          const x = w * (0.35 + hash(Math.round(t * 100), 1) * 0.3);
          const y = h * (0.35 + hash(Math.round(t * 100), 2) * 0.3);
          for (let k = 0; k < 3; k++) {
            const rad = age * (260 + k * 70);
            ctx.strokeStyle = rgba("#dfe7ff", 0.35 * (1 - age / 1.6) * (1 - k * 0.25));
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(x, y, rad, rad * 0.75, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          void i;
        });
        // a footstep lands in the puddle
        if (P.step !== null) {
          const age = T - P.step;
          if (age >= 0 && age < 1.5) {
            ctx.fillStyle = rgba("#000000", 0.9 * clamp(1 - age * 2));
            ctx.beginPath();
            ctx.ellipse(w * 0.5, h * 0.55, 150, 330, 0.1, 0, Math.PI * 2);
            ctx.fill();
            for (let k = 0; k < 5; k++) {
              ctx.strokeStyle = rgba("#e0e8ff", 0.5 * (1 - age / 1.5));
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.ellipse(w * 0.5, h * 0.55, 160 + age * (300 + k * 120), 340 + age * (300 + k * 120) * 0.8, 0.1, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
        // puddle rim highlight
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 4;
        ctx.stroke();
      }}
    />
  );
};
