/**
 * Virtual camera over a shot. Base move (zoom / pan / roll) + music-reactive layers.
 * Each musical element drives a different behaviour and every layer is opt-in per shot:
 *   kick    small scale punch       (keep 0.006-0.015)
 *   bass    slow heavy push on the Cm bar of each drop phrase
 *   clap    a few px of vertical accent
 *   drop    one big push that settles over ~0.6 s
 *   tension zoom creeping in through a build
 *   handheld organic drift so nothing is ever perfectly locked off
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { useLocalTime, useSongTime } from "../engine/clock";
import { bassWeight, clap, drop, impact, kick, tension } from "../engine/music";
import { drift } from "../engine/rng";

export type CamSpec = {
  zoom?: [number, number];
  pan?: [[number, number], [number, number]];
  rot?: [number, number];
  ease?: "linear" | "in" | "out" | "inOut";
  kick?: number;
  bass?: number;
  clap?: number;
  drop?: number;
  impact?: number;
  tension?: number;
  handheld?: number;
  /** motion blur strength on punches (px of CSS blur at full punch) */
  blur?: number;
};

const EASES = {
  linear: Easing.linear,
  in: Easing.in(Easing.cubic),
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
};

export const Camera: React.FC<{ cam?: CamSpec; dur: number; seed?: number; children: React.ReactNode }> = ({
  cam = {},
  dur,
  seed = 1,
  children,
}) => {
  const T = useSongTime();
  const lt = useLocalTime();
  const e = EASES[cam.ease ?? "inOut"];
  const k = Math.min(1, Math.max(0, lt / Math.max(0.01, dur)));
  const z0 = cam.zoom?.[0] ?? 1.02;
  const z1 = cam.zoom?.[1] ?? 1.02;
  let scale = interpolate(e(k), [0, 1], [z0, z1]);
  const p0 = cam.pan?.[0] ?? [0, 0];
  const p1 = cam.pan?.[1] ?? [0, 0];
  let x = interpolate(e(k), [0, 1], [p0[0], p1[0]]);
  let y = interpolate(e(k), [0, 1], [p0[1], p1[1]]);
  const r = interpolate(e(k), [0, 1], [cam.rot?.[0] ?? 0, cam.rot?.[1] ?? 0]);

  const kp = cam.kick ? kick(T, 0.085) * cam.kick : 0;
  const bp = cam.bass ? bassWeight(T) * cam.bass : 0;
  const dp = cam.drop ? drop(T, 0.45) * cam.drop : 0;
  const ip = cam.impact ? impact(T, 0.3) * cam.impact : 0;
  const tp = cam.tension ? tension(T) * cam.tension : 0;
  scale += kp + bp + dp + ip + tp;
  if (cam.clap) y += clap(T, 0.07) * cam.clap;
  const hh = cam.handheld ?? 1.5;
  x += drift(lt, seed) * hh * 4;
  y += drift(lt, seed + 50) * hh * 3;
  const blurPx = cam.blur ? (kp / Math.max(0.0001, cam.kick ?? 1) + dp / Math.max(0.0001, cam.drop ?? 1)) * cam.blur : 0;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${scale})`,
        filter: blurPx > 0.2 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
