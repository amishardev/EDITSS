/**
 * Transitions are motivated by the world: a passing lamp wipes the frame, an exposure blooms on
 * an impact, the moon becomes an iris. Hard cuts remain the default.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { useSongTime } from "../engine/clock";
import { clamp, smooth } from "../engine/draw";
import { C } from "../engine/palette";

export type TransitionIn =
  | { type: "cut" }
  | { type: "fade"; dur?: number }
  | { type: "dip"; dur?: number; color?: string }
  | { type: "lampwipe"; dur?: number; color?: string; dir?: 1 | -1 }
  | { type: "flash"; dur?: number; color?: string; strength?: number }
  | { type: "iris"; dur?: number; x?: number; y?: number }
  | { type: "whip"; dur?: number; dir?: 1 | -1 }
  | { type: "slit"; dur?: number };

/** how a shot's picture should be shaped while it enters (opacity / clip / offset) */
export const entryStyle = (t: TransitionIn | undefined, T: number, from: number): React.CSSProperties => {
  if (!t || t.type === "cut") return {};
  const d = "dur" in t && t.dur ? t.dur : 0.3;
  const k = clamp((T - from) / d);
  if (t.type === "fade") return { opacity: smooth(0, 1, k) };
  if (t.type === "dip") return { opacity: smooth(0.5, 1, k) };
  if (t.type === "iris") {
    const r = 150 * Math.pow(k, 1.4);
    return k < 1 ? { clipPath: `circle(${r}% at ${(t.x ?? 0.5) * 100}% ${(t.y ?? 0.4) * 100}%)` } : {};
  }
  if (t.type === "slit") {
    const half = 50 * Math.pow(k, 0.8);
    return k < 1 ? { clipPath: `inset(${50 - half}% 0 ${50 - half}% 0)` } : {};
  }
  if (t.type === "whip") {
    const dir = t.dir ?? 1;
    const off = (1 - Math.pow(k, 0.5)) * 300 * dir;
    return k < 1 ? { transform: `translateX(${off}px)`, filter: `blur(${(1 - k) * 18}px)` } : {};
  }
  return {};
};

/** style for the outgoing shot just before the next one's transition */
export const exitStyle = (next: TransitionIn | undefined, T: number, nextFrom: number): React.CSSProperties => {
  if (!next) return {};
  const d = "dur" in next && next.dur ? next.dur : 0.3;
  if (next.type === "dip") {
    const k = clamp((T - (nextFrom - d / 2)) / (d / 2));
    return { opacity: 1 - smooth(0, 1, k) };
  }
  if (next.type === "whip") {
    const k = clamp((T - (nextFrom - 0.12)) / 0.12);
    const dir = next.dir ?? 1;
    return k > 0 ? { transform: `translateX(${-k * 300 * dir}px)`, filter: `blur(${k * 18}px)` } : {};
  }
  return {};
};

/** overlays that sit above the picture around a cut */
export const TransitionOverlay: React.FC<{ t: TransitionIn; at: number }> = ({ t, at }) => {
  const T = useSongTime();
  if (t.type === "lampwipe") {
    const d = t.dur ?? 0.28;
    const k = (T - (at - d / 2)) / d;
    if (k < 0 || k > 1) return null;
    const dir = t.dir ?? 1;
    const pos = dir > 0 ? -30 + k * 160 : 130 - k * 160;
    const col = t.color ?? C.sodium;
    return (
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background: `linear-gradient(${dir > 0 ? 100 : 280}deg, transparent ${pos - 30}%, ${col}55 ${pos - 12}%, #fff6e8ee ${pos}%, ${col}55 ${pos + 12}%, transparent ${pos + 30}%)`,
          filter: "blur(18px)",
        }}
      />
    );
  }
  if (t.type === "flash") {
    const d = t.dur ?? 0.45;
    const k = (T - at) / d;
    if (k < -0.06 || k > 1) return null;
    const a = k < 0 ? (1 + k / 0.06) * 0.5 : Math.exp(-k * 4) * (t.strength ?? 0.8);
    return <AbsoluteFill style={{ background: t.color ?? "#fff3e2", opacity: a, mixBlendMode: "screen" }} />;
  }
  if (t.type === "dip") {
    const d = t.dur ?? 0.4;
    const k = 1 - Math.abs(T - at) / (d / 2);
    if (k <= 0) return null;
    return <AbsoluteFill style={{ background: t.color ?? "#000", opacity: smooth(0, 1, k) }} />;
  }
  return null;
};
