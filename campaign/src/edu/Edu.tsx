import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Music, Sfx} from '../components/Sound';
import {Grain} from '../components/Stage';
import {clamp, ease, prog, spr} from '../theme';
import {ACCENTS, INK, INK2, isDark, PAPER, PAPER2, SANS, SceneView, SERIF_I, TEXT_DARK} from './scenes';
import {Timing, Topic} from './types';

export const LEAD = 4; // frames before the first word
export const PAD = 10; // breathing room after each spoken segment

/** Segment start frames from the voice timing. */
export const layout = (t: Timing) => {
  const starts: number[] = [];
  let at = LEAD;
  t.segs.forEach((d) => {
    starts.push(at);
    at += d;
  });
  return starts;
};

const Backdrop: React.FC<{topic: Topic; starts: number[]; timing: Timing}> = ({topic, starts, timing}) => {
  const f = useCurrentFrame();
  const a = ACCENTS[topic.accent];
  // darkness follows the scene types, crossfading over 10 frames at each cut
  const keys: [number, number][] = [];
  topic.segs.forEach((s, i) => {
    const d = isDark(s.scene) ? 1 : 0;
    keys.push([starts[i] - (i ? 5 : 0), d]);
    keys.push([starts[i] + timing.segs[i] - 5, d]);
  });
  let dark = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f >= keys[i - 1][0] && f <= keys[i][0]) {
      dark = interpolate(f, [keys[i - 1][0], keys[i][0]], [keys[i - 1][1], keys[i][1]], {...clamp, easing: ease.inOut});
      break;
    }
    if (f > keys[i][0]) dark = keys[i][1];
  }
  const b1x = 540 + Math.sin(f / 70) * 260;
  const b1y = 520 + Math.cos(f / 90) * 160;
  const b2x = 540 + Math.cos(f / 80) * 300;
  const b2y = 1400 + Math.sin(f / 60) * 140;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${PAPER} 0%, ${PAPER2} 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(700px 700px at ${b1x}px ${b1y}px, rgba(${a.tint},0.16), rgba(${a.tint},0) 70%), radial-gradient(600px 600px at ${b2x}px ${b2y}px, rgba(${a.tint},0.10), rgba(${a.tint},0) 70%)`}} />
      <AbsoluteFill style={{opacity: dark}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${INK2} 0%, ${INK} 60%, #0A1612 100%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(760px 760px at ${b1x}px ${b1y}px, rgba(${a.tint},0.22), rgba(${a.tint},0) 70%), radial-gradient(600px 600px at ${b2x}px ${b2y}px, rgba(${a.tint},0.12), rgba(${a.tint},0) 70%)`}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Darkness at a frame, for picking chrome colours. */
const darkAt = (topic: Topic, starts: number[], f: number) => {
  let i = 0;
  while (i + 1 < starts.length && f >= starts[i + 1]) i++;
  return isDark(topic.segs[i].scene);
};

const Header: React.FC<{topic: Topic; starts: number[]; total: number}> = ({topic, starts, total}) => {
  const f = useCurrentFrame();
  const dark = darkAt(topic, starts, f);
  const a = ACCENTS[topic.accent];
  const col = dark ? 'rgba(243,238,228,0.8)' : 'rgba(19,36,30,0.7)';
  const p = interpolate(f, [0, total], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: 80, right: 80, top: 128, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: col, opacity: prog(f, 0, 10)}}>
        <span>DIETARY GUIDE</span>
        <span style={{fontWeight: 500}}>
          FOOD FACT <span style={{fontFamily: SERIF_I, fontWeight: 400, fontSize: 30, letterSpacing: 0, color: dark ? a.light : a.deep}}>No.{String(topic.n).padStart(2, '0')}</span>
        </span>
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 176, height: 4, borderRadius: 2, background: dark ? 'rgba(243,238,228,0.14)' : 'rgba(19,36,30,0.1)'}}>
        <div style={{width: `${p * 100}%`, height: 4, borderRadius: 2, background: dark ? a.light : a.deep}} />
      </div>
    </>
  );
};

/** Splits a caption into short phrases. */
const chunks = (cap: string) => {
  const words = cap.split(/\s+/).filter(Boolean);
  const out: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  words.forEach((w) => {
    const l = w.replace(/\*/g, '').length;
    const joiner = /^[=+→×<>]$/.test(cur[cur.length - 1] ?? '');
    if (cur.length && !joiner && (len + l > 20 || cur.length >= 4)) {
      out.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(w);
    len += l + 1;
    if (/[.?!,]$/.test(w) && len > 10) {
      out.push(cur);
      cur = [];
      len = 0;
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

const Captions: React.FC<{topic: Topic; starts: number[]; timing: Timing}> = ({topic, starts, timing}) => {
  const f = useCurrentFrame();
  const a = ACCENTS[topic.accent];
  let i = 0;
  while (i + 1 < starts.length && f >= starts[i + 1]) i++;
  const seg = topic.segs[i];
  if (seg.scene.type === 'cta') return null;
  const local = f - starts[i];
  const voice = timing.voice?.[i] ?? timing.segs[i] - PAD;
  const cs = chunks(seg.cap);
  const weights = cs.map((c) => c.join(' ').length + 6);
  const sum = weights.reduce((x, y) => x + y, 0);
  let acc = 0;
  let k = cs.length - 1;
  for (let j = 0; j < cs.length; j++) {
    const end = ((acc + weights[j]) / sum) * voice;
    if (local < end) {
      k = j;
      break;
    }
    acc += weights[j];
  }
  const kStart = (weights.slice(0, k).reduce((x, y) => x + y, 0) / sum) * voice;
  const pop = spr(local, kStart, {damping: 14, stiffness: 220});
  const dark = isDark(seg.scene);
  if (local > voice + 6) return null;
  return (
    <div style={{position: 'absolute', left: 70, width: 940, top: 1415, display: 'flex', justifyContent: 'center'}}>
      <div style={{padding: '16px 30px', borderRadius: 22, background: dark ? 'rgba(10,22,18,0.55)' : 'rgba(255,255,255,0.72)', border: dark ? '1px solid rgba(243,238,228,0.12)' : '1px solid rgba(19,36,30,0.08)', fontFamily: SANS, fontWeight: 600, fontSize: 50, lineHeight: 1.2, color: dark ? '#F8F4EC' : TEXT_DARK, textAlign: 'center', transform: `scale(${0.92 + 0.08 * pop}) translateY(${(1 - pop) * 10}px)`, boxShadow: '0 12px 30px rgba(0,0,0,0.08)'}}>
        {cs[k].map((w, j) => {
          const acc2 = w.includes('*');
          return (
            <span key={j} style={{color: acc2 ? (dark ? a.light : a.deep) : undefined, marginRight: j < cs[k].length - 1 ? '0.28em' : 0}}>
              {w.replace(/\*/g, '')}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Edu: React.FC<{topic: Topic; timing: Timing}> = ({topic, timing}) => {
  const starts = layout(timing);
  const total = timing.total;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Backdrop topic={topic} starts={starts} timing={timing} />
      {topic.segs.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={timing.segs[i] + (i === topic.segs.length - 1 ? 30 : 0)} layout="none">
          <SceneView s={s.scene} accent={topic.accent} n={topic.n} dur={timing.segs[i] + (i === topic.segs.length - 1 ? 30 : 0)} />
        </Sequence>
      ))}
      <Header topic={topic} starts={starts} total={total} />
      <Captions topic={topic} starts={starts} timing={timing} />
      <Grain opacity={0.045} vignette={0.12} />

      {/* sound */}
      <Music track={`edu${topic.n % 2 ? 1 : 2}`} duration={total} volume={0.13} fadeOut={20} />
      {topic.segs.map((_, i) => (
        <Sequence key={`vo${i}`} from={starts[i]} layout="none">
          <Audio src={staticFile(`edu/vo/${topic.slug}/${i}.wav`)} volume={1} />
        </Sequence>
      ))}
      <Sfx at={0} name="impact" volume={0.22} />
      {starts.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} at={s - 4} name="whoosh" volume={0.1} />
      ))}
      <Sfx at={starts[starts.length - 1] + 14} name="chime" volume={0.18} />
    </AbsoluteFill>
  );
};
