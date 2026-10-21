/**
 * OBJECTS - small things that carry big lines.
 *  Dice  : "take a chance, rolling it twice". Real 3D (CSS) dice thrown on a bar counter.
 *          Throw times are song times, so a roll can land on a downbeat or on the drop.
 *  Clock : LED clock on a dark wall; the night's time is mapped to the song (02:00 can land on the drop).
 */
import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import { Canvas } from "../engine/Canvas";
import { useSongTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, rgba } from "../engine/draw";
import { kick } from "../engine/music";
import { mulberry32 } from "../engine/rng";
import { F } from "../engine/fonts";

const PIPS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.27, 0.27], [0.73, 0.73]],
  3: [[0.27, 0.27], [0.5, 0.5], [0.73, 0.73]],
  4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]],
  5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
  6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]],
};

// rotations that put each face toward the camera (front face = 1)
const FACE_ROT: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, -90],
  3: [-90, 0],
  4: [90, 0],
  5: [0, 90],
  6: [0, 180],
};

const Face: React.FC<{ n: number; size: number; transform: string; light: number }> = ({ n, size, transform, light }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      transform,
      borderRadius: size * 0.16,
      background: `radial-gradient(circle at 30% 25%, #fbf7ef, #e2d9c8 70%, #c9bda8)`,
      boxShadow: `inset 0 0 ${size * 0.12}px rgba(0,0,0,0.25)`,
      filter: `brightness(${light})`,
      backfaceVisibility: "hidden",
    }}
  >
    {PIPS[n].map(([x, y], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x * size - size * 0.08,
          top: y * size - size * 0.08,
          width: size * 0.16,
          height: size * 0.16,
          borderRadius: "50%",
          background: n === 1 ? "#a3201c" : "#1b1714",
          boxShadow: "inset 0 2px 3px rgba(0,0,0,0.6)",
        }}
      />
    ))}
  </div>
);

const Die: React.FC<{ size: number; rx: number; ry: number; rz: number; x: number; y: number; z: number }> = ({ size, rx, ry, rz, x, y, z }) => {
  const hs = size / 2;
  const faces: [number, string, number][] = [
    [1, `translateZ(${hs}px)`, 1.05],
    [6, `rotateY(180deg) translateZ(${hs}px)`, 0.7],
    [2, `rotateY(90deg) translateZ(${hs}px)`, 0.85],
    [5, `rotateY(-90deg) translateZ(${hs}px)`, 0.8],
    [3, `rotateX(90deg) translateZ(${hs}px)`, 0.95],
    [4, `rotateX(-90deg) translateZ(${hs}px)`, 0.6],
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: x - hs,
        top: y - hs,
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      }}
    >
      {faces.map(([n, t, l]) => (
        <Face key={n} n={n} size={size} transform={t} light={l} />
      ))}
    </div>
  );
};

export type DiceParams = {
  throws: number[];
  /** final faces per throw: [die A, die B] */
  results: [number, number][];
  tableLight: string;
};
const DICE_DEF: DiceParams = { throws: [49, 51.5], results: [[3, 5], [1, 1]], tableLight: C.sodium };

const dieState = (T: number, throwAt: number, from: [number, number], face: number, seed: number) => {
  const r = mulberry32(seed);
  const dur = 1.1;
  const k = clamp((T - throwAt) / dur);
  const e = Easing.out(Easing.cubic)(k);
  const spins = 2 + Math.floor(r() * 2);
  const [fx, fy] = FACE_ROT[face];
  const rx = interpolate(e, [0, 1], [fx + 360 * spins + r() * 90, fx]);
  const ry = interpolate(e, [0, 1], [fy - 360 * (spins - 1) - r() * 90, fy]);
  const rz = interpolate(e, [0, 1], [r() * 180, (r() - 0.5) * 24]);
  const x = interpolate(e, [0, 1], [from[0], from[0] + 380 + r() * 60]);
  const bounce = Math.abs(Math.sin(k * Math.PI * 3)) * (1 - k) * 260;
  const y = from[1] - bounce;
  return { rx, ry, rz, x, y, k, bounce };
};

export const Dice: React.FC<{ p?: Partial<DiceParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...DICE_DEF, ...p };
  // which throw is active
  let idx = -1;
  P.throws.forEach((t, i) => {
    if (T >= t - 0.001) idx = i;
  });
  const throwAt = idx >= 0 ? P.throws[idx] : P.throws[0];
  const res = idx >= 0 ? P.results[idx] : P.results[0];
  const before = idx < 0;
  const a = dieState(before ? throwAt : T, throwAt, [200, 1130], res[0], idx * 10 + 1);
  const b = dieState(before ? throwAt : T, throwAt, [330, 1210], res[1], idx * 10 + 2);
  const size = 170;
  return (
    <AbsoluteFill style={{ background: "#070504" }}>
      <Canvas
        bloom={0.5}
        draw={(ctx, w, h) => {
          const top = h * 0.5;
          const g = ctx.createLinearGradient(0, top, 0, h);
          g.addColorStop(0, "#1b120c");
          g.addColorStop(1, "#0a0705");
          ctx.fillStyle = g;
          ctx.fillRect(0, top, w, h - top);
          // wood grain
          const r = mulberry32(3);
          for (let i = 0; i < 70; i++) {
            const y = top + Math.pow(r(), 1.5) * (h - top);
            ctx.strokeStyle = rgba(r() > 0.5 ? "#3a2416" : "#000000", 0.25);
            ctx.lineWidth = 1 + r() * 3;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(w * 0.3, y + r() * 10, w * 0.6, y - r() * 10, w, y + r() * 6);
            ctx.stroke();
          }
          glow(ctx, w * 0.45, h * 0.62, w * 0.9, P.tableLight, 0.35 + kick(T, 0.2) * 0.1, 0.05);
          // back bar bokeh
          for (let i = 0; i < 18; i++) {
            ctx.fillStyle = rgba(r() > 0.5 ? C.barGlow : C.warmWhite, 0.08 + r() * 0.1);
            ctx.beginPath();
            ctx.arc(r() * w, top * (0.3 + r() * 0.6), 40 + r() * 90, 0, Math.PI * 2);
            ctx.fill();
          }
          // contact shadows
          for (const d of [a, b]) {
            const s = clamp(1 - d.bounce / 300);
            ctx.save();
            ctx.filter = "blur(14px)";
            ctx.fillStyle = rgba("#000000", 0.6 * s);
            ctx.beginPath();
            ctx.ellipse(d.x + 30, d.y + size * 0.5 + d.bounce, size * 0.6, size * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }}
      />
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 30%" }}>
        <Die size={size} {...a} z={0} />
        <Die size={size} {...b} z={-60} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export type ClockParams = {
  /** clock reads `at` (HH:MM) when the song is at `songAt`; minutes advance `rate` per song second */
  at: string;
  songAt: number;
  rate: number;
  color: string;
  label: string;
};
const CLOCK_DEF: ClockParams = { at: "02:00", songAt: 60, rate: 1 / 600, color: C.ember, label: "" };

export const Clock: React.FC<{ p?: Partial<ClockParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...CLOCK_DEF, ...p };
  const [hh, mm] = P.at.split(":").map(Number);
  const mins = Math.floor(hh * 60 + mm + (T - P.songAt) * P.rate * 60 + 1e-6);
  const m = ((mins % 1440) + 1440) % 1440;
  const text = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const colon = (T % 0.9375) < 0.47;
  return (
    <Canvas
      bloom={0.8}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#08080a";
        ctx.fillRect(0, 0, w, h);
        glow(ctx, w / 2, h * 0.45, w, P.color, 0.15);
        ctx.save();
        ctx.font = `500 230px ${F.mono}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = rgba(P.color, 0.08);
        ctx.fillText("88:88", w / 2, h * 0.45);
        ctx.shadowColor = P.color;
        ctx.shadowBlur = 40;
        ctx.fillStyle = rgba(P.color, 0.95);
        ctx.fillText(colon ? text : text.replace(":", " "), w / 2, h * 0.45);
        ctx.restore();
        if (P.label) {
          ctx.font = `500 34px ${F.mono}`;
          ctx.textAlign = "center";
          ctx.fillStyle = rgba(P.color, 0.6);
          ctx.fillText(P.label, w / 2, h * 0.45 + 190);
        }
      }}
    />
  );
};
