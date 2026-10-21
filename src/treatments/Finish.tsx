/**
 * The "film" layer that makes procedural frames feel photographed:
 * grain, vignette, a slight lift in the blacks, gate weave and an optional cinematic matte.
 */
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { mulberry32 } from "../engine/rng";

export const Grain: React.FC<{ amount?: number }> = ({ amount = 0.11 }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const gw = Math.round(width / 2);
  const gh = Math.round(height / 2);
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(gw, gh);
    const r = mulberry32(frame * 7919 + 13);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (r() + r() + r()) / 3; // soft gaussian-ish
      const g = Math.round(v * 255);
      d[i] = g;
      d[i + 1] = g;
      d[i + 2] = g;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [frame, gw, gh]);
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: amount, pointerEvents: "none" }}>
      <canvas ref={ref} width={gw} height={gh} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.55, color = "0,0,0" }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 70% at 50% 48%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

/** black matte bars; ratio = visible height / width (e.g. 1.0 square window, 0.42 = 2.39:1) */
export const Matte: React.FC<{ visible: number }> = ({ visible }) => {
  const { width, height } = useVideoConfig();
  const vis = Math.min(height, visible * width);
  const bar = Math.max(0, (height - vis) / 2);
  if (bar < 0.5) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: "#020203" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: bar, background: "#020203" }} />
    </AbsoluteFill>
  );
};

/** small, organic gate weave; wraps the picture (not the type) */
export const Weave: React.FC<{ amount?: number; children: React.ReactNode }> = ({ amount = 1, children }) => {
  const frame = useCurrentFrame();
  const r = mulberry32(frame * 31 + 5);
  const x = (r() - 0.5) * 1.2 * amount;
  const y = (r() - 0.5) * 1.6 * amount;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(1.004)` }}>{children}</AbsoluteFill>;
};
