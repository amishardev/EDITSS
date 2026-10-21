/**
 * ARRANGEMENT - inside the track. A stylised arrangement view built from the measured
 * structure of the song (not a screenshot of any DAW): lanes, clips and a playhead that is
 * exactly where the audio is. "steps" mode shows the drop's 16-step drum grid playing.
 */
import React from "react";
import { Canvas } from "../engine/Canvas";
import { useSongTime } from "../engine/clock";
import { C } from "../engine/palette";
import { clamp, glow, rgba } from "../engine/draw";
import { BAR, BEAT, SONG } from "../engine/song";
import { env, kick } from "../engine/music";
import { F } from "../engine/fonts";

export type ArrangementParams = { mode: "lanes" | "steps"; zoomBars: number; follow: boolean; centerBar: number };
const DEF: ArrangementParams = { mode: "lanes", zoomBars: 24, follow: true, centerBar: 33 };

// which bars each lane plays (from the analysis)
const LANES: { name: string; color: string; bars: [number, number][] }[] = [
  { name: "KEYS", color: "#d7b98a", bars: [[1, 121]] },
  { name: "VOX", color: "#c9dcf2", bars: [[9, 32], [37, 38], [46, 49], [54, 64], [65, 88], [101, 102], [110, 113]] },
  { name: "PERC", color: "#9aa7b8", bars: [[9, 16], [113, 121]] },
  { name: "KICK", color: "#ffa04a", bars: [[17, 28], [33, 57], [65, 84], [89, 103], [105, 111], [113, 113]] },
  { name: "SUB", color: "#ff7a3a", bars: [[17, 31], [33, 56], [65, 87], [89, 112]] },
  { name: "CLAP", color: "#ffe6c4", bars: [[25, 32], [33, 56], [81, 88], [89, 112]] },
  { name: "HATS", color: "#86b7cc", bars: [[33, 56], [89, 112]] },
  { name: "FX", color: "#ff5a7a", bars: [[8, 8], [29, 32], [56, 57], [85, 88], [104, 104], [112, 113]] },
];

export const Arrangement: React.FC<{ p?: Partial<ArrangementParams> }> = ({ p }) => {
  const T = useSongTime();
  const P = { ...DEF, ...p };
  return (
    <Canvas
      bloom={0.35}
      draw={(ctx, w, h) => {
        ctx.fillStyle = "#0b0c10";
        ctx.fillRect(0, 0, w, h);
        const barNow = T / BAR + 1;
        if (P.mode === "lanes") {
          const top = h * 0.33;
          const laneH = 130;
          const left = 150;
          const pxPerBar = (w - left - 40) / P.zoomBars;
          const viewStart = P.follow ? barNow - P.zoomBars * 0.35 : P.centerBar - P.zoomBars / 2;
          const xOf = (bar: number) => left + (bar - viewStart) * pxPerBar;
          // bar ruler
          ctx.font = `400 28px ${F.mono}`;
          ctx.textAlign = "left";
          for (let b = Math.floor(viewStart); b < viewStart + P.zoomBars + 1; b++) {
            const x = xOf(b);
            if (x < left) continue;
            ctx.fillStyle = rgba("#ffffff", b % 4 === 1 ? 0.12 : 0.05);
            ctx.fillRect(x, top - 30, 1, LANES.length * laneH + 30);
            if (b % 4 === 1) {
              ctx.fillStyle = rgba("#ffffff", 0.35);
              ctx.fillText(String(b), x + 6, top - 40);
            }
          }
          // section names
          SONG.sections.forEach((s) => {
            const x0 = Math.max(left + 4, xOf(s.bars[0]) + 6);
            const x1 = Math.min(w - 10, xOf(s.bars[1] + 1) - 6);
            if (x1 - x0 < 60) return;
            ctx.font = `500 28px ${F.mono}`;
            let label = s.label.toUpperCase();
            while (label.length > 3 && ctx.measureText(label).width > x1 - x0) label = label.slice(0, -2);
            if (label !== s.label.toUpperCase()) label = label.trimEnd() + ".";
            ctx.fillStyle = rgba(C.warmWhite, 0.55);
            ctx.fillText(label, x0, top - 80);
          });
          LANES.forEach((lane, i) => {
            const y = top + i * laneH;
            ctx.fillStyle = rgba("#ffffff", 0.03);
            ctx.fillRect(left, y, w - left, laneH - 10);
            ctx.fillStyle = rgba(lane.color, 0.8);
            ctx.font = `500 28px ${F.mono}`;
            ctx.fillText(lane.name, 24, y + laneH / 2);
            lane.bars.forEach(([a, b]) => {
              const x0 = Math.max(left, xOf(a));
              const x1 = Math.min(w, xOf(b + 1));
              if (x1 <= x0) return;
              const playing = barNow >= a && barNow < b + 1;
              ctx.fillStyle = rgba(lane.color, playing ? 0.55 : 0.22);
              ctx.fillRect(x0 + 2, y + 6, x1 - x0 - 4, laneH - 22);
              // little waveform hatching
              ctx.fillStyle = rgba("#000000", 0.25);
              for (let xx = x0 + 6; xx < x1 - 6; xx += lane.name === "KICK" ? pxPerBar / 4 : 9) {
                const hh = lane.name === "KICK" ? laneH * 0.5 : (laneH - 34) * (0.3 + 0.5 * Math.abs(Math.sin(xx * 0.13)));
                ctx.fillRect(xx, y + 6 + (laneH - 22 - hh) / 2, 3, hh);
              }
            });
          });
          // playhead
          const px = xOf(barNow);
          ctx.fillStyle = rgba(C.warmWhite, 0.9);
          ctx.fillRect(px - 1.5, top - 60, 3, LANES.length * laneH + 60);
          glow(ctx, px, top + (LANES.length * laneH) / 2, 300, C.sodium, 0.08 + kick(T, 0.12) * 0.12);
          // time readout
          const m = Math.floor(T / 60);
          const s = (T % 60).toFixed(2).padStart(5, "0");
          ctx.font = `500 64px ${F.mono}`;
          ctx.fillStyle = rgba(C.warmWhite, 0.85);
          ctx.fillText(`${m}:${s}`, 24, h * 0.205);
          ctx.font = `400 32px ${F.mono}`;
          ctx.fillStyle = rgba(C.warmWhite, 0.45);
          ctx.fillText(`BAR ${Math.floor(barNow)}  ·  128 BPM  ·  C MINOR`, 24, h * 0.205 + 54);
        } else {
          // steps: the drop's real 16-step pattern
          const rows: { name: string; steps: number[]; color: string }[] = [
            { name: "KICK", steps: [0, 4, 8, 12], color: C.sodium },
            { name: "SUB", steps: [1, 5, 9, 13], color: C.ember },
            { name: "CLAP", steps: [4, 12], color: C.warmWhite },
            { name: "OPEN HAT", steps: [2, 6, 10, 14], color: C.dawnCyan },
            { name: "TOP LOOP", steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], color: "#7d8aa0" },
          ];
          const step = Math.floor((((T % BAR) + BAR) % BAR) / (BEAT / 4));
          const cell = (w - 120) / 16;
          const top = h * 0.32;
          rows.forEach((row, i) => {
            const y = top + i * (cell + 60);
            ctx.font = `500 34px ${F.mono}`;
            ctx.fillStyle = rgba(row.color, 0.8);
            ctx.textAlign = "left";
            ctx.fillText(row.name, 60, y - 18);
            for (let s = 0; s < 16; s++) {
              const x = 60 + s * cell;
              const on = row.steps.includes(s);
              const now = s === step;
              ctx.fillStyle = on ? rgba(row.color, now ? 1 : 0.5) : rgba("#ffffff", s % 4 === 0 ? 0.09 : 0.05);
              ctx.fillRect(x + 4, y, cell - 8, cell);
              if (on && now) glow(ctx, x + cell / 2, y + cell / 2, cell * 2, row.color, 0.4);
            }
          });
          ctx.fillStyle = rgba(C.warmWhite, 0.06 + env("rms", T) * 0.1);
          ctx.fillRect(60 + step * cell, top - 50, cell, rows.length * (cell + 60) + 30);
        }
        void clamp;
      }}
    />
  );
};
