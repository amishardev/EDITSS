/**
 * Turns a ReelSpec into a finished 9:16 Reel. Shots are cut on song-time boundaries, so a cut
 * written as bar(33) lands on the drop frame no matter where the Reel starts in the song.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SongClock, TimeWarp, useSongTime } from "../engine/clock";
import { AUDIO_FILE, FPS } from "../engine/song";
import { shotById } from "../library/shots";
import { Camera } from "../motion/Camera";
import { entryStyle, exitStyle, TransitionOverlay } from "../motion/Transitions";
import { GENERATORS } from "../shots/registry";
import { Grain, Matte, Vignette, Weave } from "../treatments/Finish";
import { TextLayer } from "../type/Type";
import type { Grade, ReelSpec, ShotUse } from "./types";

export const snapStart = (t: number) => Math.round(t * FPS) / FPS;
export const reelFrames = (spec: ReelSpec) => Math.round((spec.audioEnd - snapStart(spec.audioStart)) * FPS);

const gradeFilter = (g?: Grade) =>
  g
    ? `contrast(${g.contrast ?? 1}) saturate(${g.saturate ?? 1}) brightness(${g.brightness ?? 1})${g.hue ? ` hue-rotate(${g.hue}deg)` : ""}`
    : undefined;

const ShotFrame: React.FC<{ use: ShotUse; next?: ShotUse; index: number }> = ({ use, next, index }) => {
  const T = useSongTime();
  const preset = shotById(use.shot);
  const G = GENERATORS[preset.gen];
  const params = { ...preset.params, ...(use.params ?? {}) };
  const inner = <G p={params} />;
  const warped = use.warp ? (
    <TimeWarp speed={use.warp.speed} anchor={use.warp.anchor ?? use.from} shift={use.warp.shift ?? 0} dur={use.to - use.from}>
      {inner}
    </TimeWarp>
  ) : (
    inner
  );
  const ent = entryStyle(use.in, T, use.from);
  const ex = next ? exitStyle(next.in, T, next.from) : {};
  return (
    <AbsoluteFill
      style={{
        ...ent,
        ...ex,
        opacity: (ent.opacity as number | undefined ?? 1) * (ex.opacity as number | undefined ?? 1),
        filter: [ent.filter, ex.filter, gradeFilter(use.grade)].filter(Boolean).join(" ") || undefined,
      }}
    >
      <Camera cam={use.cam} dur={use.to - use.from} seed={index * 7 + 3}>
        {warped}
      </Camera>
    </AbsoluteFill>
  );
};

const MatteLayer: React.FC<{ keys: [number, number][] }> = ({ keys }) => {
  const T = useSongTime();
  const ts = keys.map((k) => k[0]);
  const vs = keys.map((k) => k[1]);
  const v = keys.length === 1 ? vs[0] : interpolate(T, ts, vs, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <Matte visible={v} />;
};

const TintLayer: React.FC<{ g?: Grade }> = ({ g }) =>
  g?.tint ? <AbsoluteFill style={{ background: g.tint, opacity: g.tintAmount ?? 0.12, mixBlendMode: "soft-light" }} /> : null;

const FadeLayer: React.FC<{ total: number; fadeIn: number; fadeOut: number }> = ({ total, fadeIn, fadeOut }) => {
  const f = useCurrentFrame();
  const a = Math.max(
    fadeIn > 0 ? 1 - Math.min(1, f / (fadeIn * FPS)) : 0,
    fadeOut > 0 ? 1 - Math.min(1, (total - f) / (fadeOut * FPS)) : 0,
  );
  return a > 0 ? <AbsoluteFill style={{ background: "#000", opacity: a }} /> : null;
};

export const Reel: React.FC<{ spec: ReelSpec }> = ({ spec }) => {
  const start = snapStart(spec.audioStart);
  const total = reelFrames(spec);
  const fadeIn = spec.fadeIn ?? 0;
  const fadeOut = spec.fadeOut ?? 0;
  return (
    <AbsoluteFill style={{ background: "#030304" }}>
      <Audio
        src={staticFile(AUDIO_FILE)}
        trimBefore={Math.round(start * FPS)}
        volume={(f) =>
          Math.min(
            1,
            fadeIn > 0 ? f / (fadeIn * FPS) : Math.min(1, f / 2),
            fadeOut > 0 ? (total - f) / (fadeOut * FPS) : Math.min(1, (total - f) / 2),
          )
        }
      />
      <SongClock audioStart={start}>
        <Weave amount={0.8}>
          <AbsoluteFill style={{ filter: gradeFilter(spec.grade) }}>
            {spec.shots.map((use, i) => {
              const next = spec.shots[i + 1];
              const overlap = next?.in && next.in.type === "fade" ? next.in.dur ?? 0.3 : 0;
              const from = Math.max(0, Math.round((use.from - start) * FPS));
              const to = Math.min(total, Math.round((use.to + overlap - start) * FPS));
              if (to <= from) return null;
              return (
                <Sequence key={i} from={from} durationInFrames={to - from} layout="none">
                  <ShotFrame use={use} next={next} index={i} />
                </Sequence>
              );
            })}
            <TintLayer g={spec.grade} />
          </AbsoluteFill>
        </Weave>
        {spec.shots.map((use, i) =>
          use.in && use.in.type !== "cut" ? <TransitionOverlay key={`t${i}`} t={use.in} at={use.from} /> : null,
        )}
        {(spec.overlays ?? []).map((o, i) => (
          <TransitionOverlay key={`o${i}`} t={o} at={o.at} />
        ))}
        {spec.matte ? <MatteLayer keys={spec.matte} /> : null}
        <Vignette strength={spec.vignette ?? 0.5} />
        {spec.texts.map((t, i) => (
          <TextLayer key={`x${i}`} t={t} />
        ))}
        <Grain amount={spec.grain ?? 0.1} />
        <FadeLayer total={total} fadeIn={fadeIn} fadeOut={fadeOut} />
      </SongClock>
    </AbsoluteFill>
  );
};
