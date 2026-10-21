/**
 * Typography system.
 *  hook   lowercase grotesk, small, upper third. Reads like a thought, not an ad.
 *  lyric  Instrument Serif italic, word by word on the sung timing.
 *  word   one huge wide-cut word landing on a musical hit (drop, kick, clap).
 *  label  mono caps: times, bar numbers, places. Documentary, quiet.
 *  title  AMISHAR + moonlight lockup.
 * All placements stay inside the Reels safe area (no text under the top bar, the caption or the buttons).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { useSongTime } from "../engine/clock";
import { clamp, smooth } from "../engine/draw";
import { F } from "../engine/fonts";
import { env } from "../engine/music";
import { C } from "../engine/palette";
import { ARTIST, SONG_TITLE, lyric as getLyric } from "../engine/song";

export type TextUse = {
  kind: "hook" | "lyric" | "label" | "title" | "word";
  text?: string;
  lyric?: string;
  from: number;
  to: number;
  pos?: "top" | "upper" | "center" | "lower" | "bottom" | number;
  style?: "sans" | "serif" | "wide" | "mono";
  size?: number;
  color?: string;
  reveal?: "fade" | "words" | "type" | "rise" | "hits" | "track";
  hits?: number[];
  align?: "left" | "center";
  exit?: "fade" | "cut" | "blur";
  /** lyric only: show a sub-range of the line's words */
  words?: [number, number];
  opacity?: number;
};

const POS = { top: 0.13, upper: 0.2, center: 0.47, lower: 0.64, bottom: 0.74 };

/** release date line shown under the title lockup */
export const RELEASE_LABEL = "coming 23 oct 2026";

const syllables = (w: string) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, "").match(/[aeiouy]+/g) ?? []).length);

/** estimated per-word onset times across a sung line, weighted by syllables */
export const wordTimes = (text: string, start: number, end: number) => {
  const ws = text.split(/\s+/).filter(Boolean);
  const weights = ws.map(syllables);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = (end - start) * 0.92;
  let acc = 0;
  return ws.map((w, i) => {
    const t = start + (acc / total) * span;
    acc += weights[i];
    return { w, t };
  });
};

const fontFor = (style: TextUse["style"], size: number): React.CSSProperties => {
  if (style === "serif") return { fontFamily: F.serif, fontStyle: "italic", fontWeight: 400, fontSize: size, letterSpacing: "-0.01em", lineHeight: 1.04 };
  if (style === "wide")
    return { fontFamily: F.sans, fontWeight: 760, fontStretch: "125%", fontSize: size, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 0.95 };
  if (style === "mono") return { fontFamily: F.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.3 };
  return { fontFamily: F.sans, fontWeight: 480, fontStretch: "92%", fontSize: size, letterSpacing: "-0.005em", lineHeight: 1.15 };
};

export const TextLayer: React.FC<{ t: TextUse }> = ({ t }) => {
  const T = useSongTime();
  if (T < t.from - 0.001 || T > t.to + 0.4) return null;
  const kind = t.kind;
  const style = t.style ?? (kind === "lyric" ? "serif" : kind === "label" ? "mono" : kind === "word" ? "wide" : "sans");
  const size = t.size ?? (kind === "hook" ? 54 : kind === "lyric" ? 88 : kind === "label" ? 34 : kind === "word" ? 150 : 60);
  const color = t.color ?? (kind === "label" ? "rgba(243,234,217,0.85)" : C.paper);
  const posY = typeof t.pos === "number" ? t.pos : POS[t.pos ?? (kind === "hook" ? "top" : kind === "lyric" ? "lower" : kind === "label" ? "bottom" : "center")];
  const exitK = t.exit === "cut" ? (T > t.to ? 0 : 1) : 1 - smooth(t.to, t.to + (t.exit === "blur" ? 0.35 : 0.25), T);
  if (exitK <= 0) return null;
  const blurOut = t.exit === "blur" ? (1 - exitK) * 10 : 0;

  if (kind === "title") {
    const k = smooth(t.from, t.from + 0.6, T);
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exitK * (t.opacity ?? 1) }}>
        <div style={{ position: "absolute", top: `${posY * 100}%`, transform: "translateY(-50%)", textAlign: "center" }}>
          <div
            style={{
              ...fontFor("wide", t.size ?? 64),
              color,
              letterSpacing: `${0.3 + (1 - k) * 0.25}em`,
              opacity: k,
              filter: `blur(${(1 - k) * 8}px)`,
              textShadow: "0 0 30px rgba(0,0,0,0.5)",
              paddingLeft: "0.3em",
            }}
          >
            {t.text ?? ARTIST}
          </div>
          <div
            style={{
              ...fontFor("serif", (t.size ?? 64) * 1.25),
              color: C.moon,
              marginTop: 14,
              opacity: smooth(t.from + 0.35, t.from + 1.0, T),
            }}
          >
            {SONG_TITLE.toLowerCase()}
          </div>
          <div
            style={{
              ...fontFor("mono", 26),
              color: "rgba(243,234,217,0.8)",
              marginTop: 22,
              letterSpacing: "0.22em",
              opacity: smooth(t.from + 1.2, t.from + 1.7, T),
            }}
          >
            {RELEASE_LABEL}
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  let words: { w: string; t: number }[];
  if (t.lyric) {
    const L = getLyric(t.lyric);
    words = wordTimes(t.text ?? L.text, L.start, L.end);
    if (t.words) words = words.slice(t.words[0], t.words[1]);
  } else {
    const ws = (t.text ?? "").split(/\s+/).filter(Boolean);
    if (t.reveal === "hits" && t.hits) words = ws.map((w, i) => ({ w, t: t.hits![Math.min(i, t.hits!.length - 1)] }));
    else if (t.reveal === "words") words = wordTimes(t.text ?? "", t.from, Math.min(t.to, t.from + ws.length * 0.32));
    else words = ws.map((w) => ({ w, t: t.from }));
  }
  const reveal = t.reveal ?? (kind === "lyric" ? "words" : kind === "word" ? "hits" : kind === "hook" ? "rise" : "fade");
  const vocalGlow = kind === "lyric" ? clamp(env("vocal", T)) : 0;
  const k = smooth(t.from, t.from + 0.45, T);
  const rise = reveal === "rise" ? (1 - k) * 18 : 0;
  const tracking = reveal === "track" ? `${(1 - k) * 0.4}em` : undefined;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 120,
          top: `${posY * 100}%`,
          transform: `translateY(calc(-50% + ${rise}px))`,
          textAlign: t.align ?? "center",
          color,
          opacity: exitK * (t.opacity ?? 1) * (reveal === "rise" || reveal === "fade" || reveal === "track" ? k : 1),
          filter: blurOut > 0 || reveal === "rise" ? `blur(${blurOut + (reveal === "rise" ? (1 - k) * 6 : 0)}px)` : undefined,
          textShadow: `0 0 ${18 + vocalGlow * 22}px rgba(0,0,0,0.55)${vocalGlow > 0 ? `, 0 0 ${vocalGlow * 30}px rgba(201,220,242,${vocalGlow * 0.25})` : ""}`,
          letterSpacing: tracking,
          ...fontFor(style, size),
          ...(tracking ? { letterSpacing: tracking } : {}),
        }}
      >
        {words.map(({ w, t: wt }, i) => {
          let o = 1;
          let blur = 0;
          let y = 0;
          if (reveal === "words" || reveal === "hits") {
            const wk = smooth(wt - 0.02, wt + (reveal === "hits" ? 0.06 : 0.22), T);
            o = wk;
            blur = (1 - wk) * 8;
            y = (1 - wk) * 10;
          }
          if (reveal === "type") {
            o = T >= wt + i * 0.045 ? 1 : 0;
          }
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: o,
                filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
                transform: y ? `translateY(${y}px)` : undefined,
                marginRight: style === "wide" ? "0.32em" : "0.24em",
                whiteSpace: "pre",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
