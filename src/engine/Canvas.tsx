import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { bloom as applyBloom } from "./draw";

export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/** Full-frame canvas redrawn synchronously every frame. */
export const Canvas: React.FC<{ draw: DrawFn; style?: React.CSSProperties; bloom?: number }> = ({
  draw,
  style,
  bloom = 0.55,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { width, height } = useVideoConfig();
  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";
    ctx.clearRect(0, 0, width, height);
    draw(ctx, width, height);
    applyBloom(ctx, width, height, bloom);
  });
  return (
    <AbsoluteFill style={style}>
      <canvas ref={ref} width={width} height={height} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
