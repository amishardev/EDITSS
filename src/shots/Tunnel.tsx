/**
 * TUNNEL - sodium fixtures streak past at 16ths of the travel rate; an opening grows at the
 * end and the camera bursts out at `exitAt` (put this on the drop).
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, lerp, mix, rgba, smooth } from "../engine/draw";
import { travel } from "../engine/music";
import { F } from "../engine/fonts";
import { textTexture } from "./common";

export type TunnelParams = {
  color: string;
  exitAt: number | null;
  exitColor: string;
  words: string[];
  tint: number;
  speed: number;
};

const DEF: TunnelParams = {
  color: C.sodium,
  exitAt: null,
  exitColor: "#9fb6d6",
  words: [],
  tint: 0.5,
  speed: 1,
};

const UNIT = 16; // metres per travel unit (one beat in the drops)
const FIX = 4; // fixture spacing
const HW = 5;
const CEIL = -4.2;
const FLOOR = 1.3;

export const Tunnel: React.FC<{ p?: Partial<TunnelParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      bloom={0.7}
      draw={(ctx, w, h) => {
        const cx = w * 0.5;
        const cy = h * 0.5;
        const f = w * 0.62;
        const camZ = travel(T) * UNIT * P.speed;
        const v = (travel(T + 1 / 60) - travel(T)) * UNIT * P.speed * 60; // m/s
        const blur = v / 60; // metres travelled during a 1/60 shutter
        // the opening never quite fills the frame before the exit, so the exit frame stays the biggest change
        const exitZ = P.exitAt !== null ? Math.max(T < P.exitAt ? 9 : 0, (P.exitAt - T) * Math.max(v, 20)) : 9999;
        const prj = (x: number, y: number, z: number) => {
          const s = f / Math.max(0.15, z);
          return [cx + x * s, cy + y * s] as const;
        };
        const far = Math.min(260, Math.max(1, exitZ));

        // shell
        ctx.fillStyle = "#050506";
        ctx.fillRect(0, 0, w, h);
        const quad = (pts: (readonly [number, number])[], fill: string | CanvasGradient) => {
          ctx.beginPath();
          pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
        };
        const zN = 0.3;
        const wallTone = mix("#1a1510", "#0c0d10", 1 - P.tint);
        const L0 = prj(-HW, CEIL, zN);
        const L1 = prj(-HW, FLOOR, zN);
        const R0 = prj(HW, CEIL, zN);
        const R1 = prj(HW, FLOOR, zN);
        const l0 = prj(-HW, CEIL, far);
        const l1 = prj(-HW, FLOOR, far);
        const r0 = prj(HW, CEIL, far);
        const r1 = prj(HW, FLOOR, far);
        const gL = ctx.createLinearGradient(0, 0, cx, 0);
        gL.addColorStop(0, "#060606");
        gL.addColorStop(1, wallTone);
        quad([L0, l0, l1, L1], gL);
        const gR = ctx.createLinearGradient(w, 0, cx, 0);
        gR.addColorStop(0, "#060606");
        gR.addColorStop(1, wallTone);
        quad([R0, r0, r1, R1], gR);
        const gC = ctx.createLinearGradient(0, 0, 0, cy);
        gC.addColorStop(0, "#030303");
        gC.addColorStop(1, mix(wallTone, "#000000", 0.3));
        quad([L0, R0, r0, l0], gC);
        const gF = ctx.createLinearGradient(0, h, 0, cy);
        gF.addColorStop(0, "#050505");
        gF.addColorStop(1, mix(wallTone, "#000000", 0.2));
        quad([L1, R1, r1, l1], gF);

        // end of tunnel: the opening
        if (P.exitAt !== null && exitZ < 400) {
          const o0 = prj(-HW, CEIL, Math.max(0.2, exitZ));
          const o1 = prj(HW, FLOOR, Math.max(0.2, exitZ));
          const near = clamp(1 - exitZ / 400);
          const g = ctx.createLinearGradient(0, o0[1], 0, o1[1]);
          g.addColorStop(0, mix("#0b1730", P.exitColor, near * 0.65));
          g.addColorStop(1, mix("#1b2a44", "#ffffff", near * 0.3));
          ctx.fillStyle = g;
          ctx.fillRect(o0[0], o0[1], o1[0] - o0[0], o1[1] - o0[1]);
          glow(ctx, (o0[0] + o1[0]) / 2, (o0[1] + o1[1]) / 2, (o1[0] - o0[0]) * 1.4, P.exitColor, 0.5 * near, 0.2);
        }

        // ribs every fixture, faint
        const off = camZ % FIX;
        for (let k = Math.floor(far / FIX); k >= 0; k--) {
          const z = k * FIX - off + FIX;
          if (z < zN || z > far) continue;
          const a = clamp(1 - z / far) * 0.25;
          const [ax, ay] = prj(-HW, CEIL, z);
          const [bx, by] = prj(HW, FLOOR, z);
          ctx.strokeStyle = rgba("#000000", a);
          ctx.lineWidth = Math.max(1, f / z * 0.08);
          ctx.strokeRect(ax, ay, bx - ax, by - ay);
        }

        // fixtures: two ceiling strips, streaked by speed
        for (let k = Math.floor(far / FIX); k >= -1; k--) {
          const z = k * FIX - off + FIX;
          if (z < 0.25 || z > far) continue;
          const fade = Math.pow(clamp(1 - z / far), 0.6);
          for (const sx of [-3.6, 3.6]) {
            const len = 1.1 + blur * 0.9;
            const [x0, y0] = prj(sx, CEIL + 0.15, z);
            const [x1, y1] = prj(sx, CEIL + 0.15, z + len);
            const s = f / z;
            ctx.save();
            ctx.globalCompositeOperation = "lighter";
            ctx.strokeStyle = rgba(mix(P.color, "#ffffff", 0.35), 0.95 * fade);
            ctx.lineCap = "round";
            ctx.lineWidth = Math.max(1.5, 0.22 * s);
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            ctx.restore();
            glow(ctx, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(12, 1.6 * s), P.color, 0.5 * fade, 0.08);
            // reflection on wall & floor
            const [wx, wy] = prj(sx > 0 ? HW : -HW, CEIL + 1.2, z);
            glow(ctx, wx, wy, Math.max(8, 2.2 * s), P.color, 0.18 * fade, 0.05);
            const [fx, fy] = prj(sx * 0.7, FLOOR, z + 2);
            glow(ctx, fx, fy, Math.max(6, 1.4 * s), P.color, 0.12 * fade, 0.05);
          }
        }

        // lane line
        for (let k = 0; k < 30; k++) {
          const z = k * 8 - (camZ % 8) + 1;
          if (z < zN || z > far) continue;
          const [ax, ay] = prj(-0.06, FLOOR, z);
          const [bx, by] = prj(-0.06, FLOOR, z + 3 + blur);
          ctx.strokeStyle = rgba("#d8d0bc", 0.5 * clamp(1 - z / far));
          ctx.lineWidth = Math.max(1, f / z * 0.12);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }

        // words on wall panels, one per 4 units
        if (P.words.length) {
          const span = UNIT * 4;
          for (let i = 0; i < P.words.length + 1; i++) {
            const idx = Math.floor(camZ / span) + i;
            const word = P.words[((idx % P.words.length) + P.words.length) % P.words.length];
            const z0 = idx * span - camZ + span * 0.5;
            if (z0 < 0.5 || z0 > far) continue;
            const tex = textTexture(word, `700 200px ${F.sans}`, "#e9e3d4");
            const cols = 60;
            const len = 14;
            ctx.save();
            ctx.globalAlpha = 0.7 * clamp(1 - z0 / far);
            for (let c = 0; c < cols; c++) {
              const za = z0 + (len * c) / cols;
              const zb = z0 + (len * (c + 1)) / cols;
              const [xa, ya] = prj(-HW + 0.02, -2.4, za);
              const [xb] = prj(-HW + 0.02, -2.4, zb);
              const [, yb] = prj(-HW + 0.02, -0.6, za);
              ctx.drawImage(tex, (c / cols) * tex.width, 0, tex.width / cols + 1, tex.height, Math.min(xa, xb), ya, Math.abs(xb - xa) + 1, yb - ya);
            }
            ctx.restore();
          }
        }

        // burst out at the exit
        if (P.exitAt !== null) {
          // no white before the exit: the burst happens on the exit frame itself
          const flash = T >= P.exitAt ? Math.exp(-(T - P.exitAt) / 0.12) : 0;
          if (flash > 0) {
            ctx.fillStyle = rgba(mix(P.exitColor, "#ffffff", 0.6), flash * 0.85);
            ctx.fillRect(0, 0, w, h);
          }
        }
        // speed vignette
        const sv = clamp(v / 200);
        const g = ctx.createRadialGradient(cx, cy, w * 0.2, cx, cy, w * 1.1);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, rgba("#000000", lerp(0.2, 0.6, sv)));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }}
    />
  );
};
