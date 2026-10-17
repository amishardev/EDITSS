import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FPS, HEIGHT, WIDTH, barNumber, beatPulse, sample} from '../lib/timeline';
import type {Grade, Light, Pane, ReelSpec, Shot} from '../lib/types';
import {Footage, Soundtrack, sourceTime} from './Footage';
import {ACCENT, CaptionLayer, MONO} from './Type';

// Places source point (cx, cy) at the centre of a vw x vh window at zoom z,
// clamped so the edge of the recording never shows.
const frameTransform = (cx: number, cy: number, z: number, vw: number, vh: number) => {
  const hw = vw / 2 / z;
  const hh = vh / 2 / z;
  const x = Math.min(Math.max(cx, hw), WIDTH - hw);
  const y = Math.min(Math.max(cy, hh), HEIGHT - hh);
  return {tx: vw / 2 - x * z, ty: vh / 2 - y * z};
};

const SHOT_FIELDS: (keyof Shot)[] = ['cx', 'cy', 'z'];
const LIGHT_FIELDS: (keyof Light)[] = ['rect', 'dim'];
const GRADE_FIELDS: (keyof Grade)[] = ['sat', 'con', 'bri', 'warm'];

const pulseAt = (spec: ReelSpec, t: number) => {
  const p = spec.pulse?.find((w) => t >= w.from && t < w.to);
  return p ? p.amt * beatPulse(sourceTime(spec.segments, t)) : 0;
};

// Selective highlight: everything outside the rect is pushed into shadow.
const Spotlight: React.FC<{light: Light}> = ({light}) => {
  const [x, y, w, h] = light.rect;
  if (light.dim <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 4,
        boxShadow: `0 0 0 3000px rgba(6,6,8,${light.dim})`,
        outline: `1px solid rgba(227,178,91,${0.55 * Math.min(1, light.dim * 1.5)})`,
      }}
    />
  );
};

const gradeFilter = (g: Grade) =>
  `saturate(${g.sat}) contrast(${g.con}) brightness(${g.bri}) sepia(${g.warm})`;

const Camera: React.FC<{spec: ReelSpec; t: number}> = ({spec, t}) => {
  const shot = sample(spec.shots, t, SHOT_FIELDS);
  const prev = sample(spec.shots, Math.max(0, t - 1 / FPS), SHOT_FIELDS);
  const z = shot.z * (1 + pulseAt(spec, t));
  const {tx, ty} = frameTransform(shot.cx, shot.cy, z, WIDTH, HEIGHT);
  const p = frameTransform(prev.cx, prev.cy, prev.z, WIDTH, HEIGHT);
  // Velocity-based blur, only on eased moves (a hard cut has no motion).
  const cut = spec.shots.some((s) => s.cut && Math.abs(s.at - t) < 1.01 / FPS);
  const speed = cut ? 0 : Math.hypot(tx - p.tx, ty - p.ty) + Math.abs(shot.z - prev.z) * 900;
  const blur = Math.min(3.5, speed * 0.045);
  const grade = sample(spec.grade, t, GRADE_FIELDS);
  const light = spec.lights ? sample(spec.lights, t, LIGHT_FIELDS) : null;
  return (
    <div
      style={{
        position: 'absolute',
        width: WIDTH,
        height: HEIGHT,
        transformOrigin: '0 0',
        transform: `translate(${tx}px, ${ty}px) scale(${z})`,
        filter: `${gradeFilter(grade)}${blur > 0.3 ? ` blur(${blur.toFixed(2)}px)` : ''}`,
      }}
    >
      <Footage segments={spec.segments} />
      {light ? <Spotlight light={light} /> : null}
    </div>
  );
};

// Stacked horizontal crops of the same moment, one instrument per pane.
const Panes: React.FC<{spec: ReelSpec; panes: Pane[]; t: number}> = ({spec, panes, t}) => {
  const grade = sample(spec.grade, t, GRADE_FIELDS);
  const kick = pulseAt(spec, t);
  return (
    <>
      {panes.map((p, i) => {
        const z = p.z * (1 + kick * (i === 1 ? 1 : 0.35));
        const {tx, ty} = frameTransform(p.cx, p.cy, z, WIDTH, p.h);
        const enter = interpolate(t, [0.15 + i * 0.12, 0.55 + i * 0.12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: p.top,
              width: WIDTH,
              height: p.h,
              overflow: 'hidden',
              opacity: enter,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: WIDTH,
                height: HEIGHT,
                transformOrigin: '0 0',
                transform: `translate(${tx}px, ${ty}px) scale(${z})`,
                filter: gradeFilter(grade),
              }}
            >
              <Footage segments={spec.segments} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 22,
                fontFamily: MONO,
                fontSize: 22,
                letterSpacing: '0.18em',
                color: i === 1 ? ACCENT : 'rgba(244,241,234,0.85)',
                background: 'rgba(8,8,10,0.72)',
                padding: '8px 14px',
                borderRadius: 3,
              }}
            >
              {p.label}
            </div>
          </div>
        );
      })}
    </>
  );
};

const BarCounter: React.FC<{spec: ReelSpec; t: number}> = ({spec, t}) => {
  const c = spec.counter;
  if (!c || t < c.from || t >= c.to) return null;
  const src = sourceTime(spec.segments, t);
  const o = interpolate(t, [c.from, c.from + 0.3, c.to - 0.3, c.to], [0, 1, 1, 0]);
  const beat = Math.floor((src / (60 / 128)) % 4) + 1;
  return (
    <div style={{position: 'absolute', left: 84, top: 1440, opacity: o, fontFamily: MONO, fontSize: 25, letterSpacing: '0.14em', color: 'rgba(244,241,234,0.8)', textShadow: '0 1px 12px rgba(0,0,0,0.9)'}}>
      BAR {String(barNumber(src)).padStart(3, '0')}
      <span style={{color: ACCENT}}>.{beat}</span>
      <span style={{opacity: 0.55}}>  ·  128 BPM</span>
    </div>
  );
};

export const Reel: React.FC<{spec: ReelSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Darken the top whenever text sits up there, not only during the hook.
  const topText = spec.captions.some((c) => c.kind !== 'title' && (c.y ?? 300) < 700 && t >= c.from - 0.1 && t < c.to + 0.3);
  return (
    <AbsoluteFill style={{backgroundColor: '#050506', overflow: 'hidden'}}>
      {spec.panes ? <Panes spec={spec} panes={spec.panes} t={t} /> : <Camera spec={spec} t={t} />}
      {/* Vignette + a soft top shade so the hook always sits on dark. */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(4,4,6,0.88) 0%, rgba(4,4,6,0.6) 22%, rgba(4,4,6,0) 38%)',
          opacity: topText ? 1 : 0.35,
        }}
      />
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(4,4,6,0.7) 0%, rgba(4,4,6,0) 30%)'}} />
      {spec.letterbox ? (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: spec.letterbox, background: '#000'}} />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: spec.letterbox, background: '#000'}} />
        </>
      ) : null}
      <BarCounter spec={spec} t={t} />
      {spec.signature ? (
        <div style={{position: 'absolute', left: 84, top: 1500, fontFamily: MONO, fontSize: 22, letterSpacing: '0.28em', color: 'rgba(244,241,234,0.55)'}}>
          AMISHAR <span style={{color: ACCENT}}>/</span> MIZRAB
        </div>
      ) : null}
      <CaptionLayer captions={spec.captions} />
      <Soundtrack segments={spec.segments} />
    </AbsoluteFill>
  );
};
