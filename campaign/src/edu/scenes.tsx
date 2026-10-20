import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {emoteFile, SCREEN_H, src, UI} from '../assets';
import {Phone} from '../components/Phone';
import {clamp, ease, prog, spr} from '../theme';
import {Icon} from './icons';
import {Scene} from './types';

/* ------------------------------------------------------------------ tokens */

export const INK = '#0F1F1A';
export const INK2 = '#16302A';
export const PAPER = '#F3EEE4';
export const PAPER2 = '#E9E1D2';
export const TEXT_DARK = '#13241E';
export const TEXT_SOFT = '#5B6B63';
export const SERIF = "'Fraunces', Georgia, serif";
export const SERIF_I = "'FrauncesItalic', 'Fraunces', Georgia, serif";
export const SANS = "'Sora', 'Poppins', sans-serif";

export type Acc = {light: string; deep: string; tint: string};
export const ACCENTS: Record<string, Acc> = {
  turmeric: {light: '#F2B63C', deep: '#A86E0E', tint: '242,182,60'},
  tomato: {light: '#F0674E', deep: '#B9402B', tint: '240,103,78'},
  leaf: {light: '#5CC489', deep: '#1E7A4C', tint: '92,196,137'},
  berry: {light: '#E07AA6', deep: '#963B64', tint: '224,122,166'},
  sky: {light: '#6DB8E0', deep: '#2A6A8C', tint: '109,184,224'},
  amla: {light: '#B7D85A', deep: '#5F7F17', tint: '183,216,90'},
};

/** Scenes that sit on the dark ground; the rest sit on paper. */
export const isDark = (s: Scene) => s.type === 'hook' || s.type === 'myth' || s.type === 'cta' || (s.type === 'statement' && !!s.dark);

/* ------------------------------------------------------------------ text */

/** Words rise out of a soft blur one after another; *word* takes the accent in italic serif. */
export const Rich: React.FC<{text: string; at?: number; stagger?: number; size: number; color: string; accent: string; weight?: number; font?: string; lineHeight?: number; align?: 'center' | 'left'; tracking?: number}> = ({text, at = 0, stagger = 3, size, color, accent, weight = 400, font = SERIF, lineHeight = 1.06, align = 'center', tracking = -0.025}) => {
  const f = useCurrentFrame();
  let wi = 0;
  return (
    <div style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight, textAlign: align, letterSpacing: `${tracking}em`, textWrap: 'balance' as never}}>
      {text.split('\n').map((line, li) => (
        <div key={li}>
          {line.split(' ').map((w, i) => {
            const acc = w.startsWith('*');
            const clean = w.replace(/\*/g, '');
            const p = interpolate(f - at - wi++ * stagger, [0, 14], [0, 1], {...clamp, easing: ease.out});
            return (
              <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: p, transform: `translateY(${(1 - p) * 0.35 * size}px)`, filter: `blur(${(1 - p) * 10}px)`, fontFamily: acc ? SERIF_I : undefined, color: acc ? accent : undefined, fontWeight: acc ? Math.max(400, weight) : undefined}}>
                {clean}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Kicker: React.FC<{text: string; color: string; at?: number; y?: number}> = ({text, color, at = 0, y}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 16);
  return (
    <div style={{position: y !== undefined ? 'absolute' : 'relative', top: y, left: 0, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color, opacity: p}}>
      <span style={{display: 'inline-block', width: 40 * p, height: 2, background: color, verticalAlign: 'middle', marginRight: 16}} />
      {text}
      <span style={{display: 'inline-block', width: 40 * p, height: 2, background: color, verticalAlign: 'middle', marginLeft: 16}} />
    </div>
  );
};

/** Small source / context chip anchored near the bottom of the content area. */
const Note: React.FC<{text?: string; dark: boolean; at?: number}> = ({text, dark, at = 20}) => {
  const f = useCurrentFrame();
  if (!text) return null;
  const p = prog(f, at, at + 14);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 1268, display: 'flex', justifyContent: 'center', opacity: p}}>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 25, color: dark ? 'rgba(243,238,228,0.62)' : TEXT_SOFT, padding: '10px 22px', borderRadius: 999, border: `1.5px solid ${dark ? 'rgba(243,238,228,0.22)' : 'rgba(19,36,30,0.16)'}`, letterSpacing: '0.01em'}}>
        {text}
      </div>
    </div>
  );
};

const Count: React.FC<{value: number; decimals?: number; at: number; dur?: number}> = ({value, decimals = 0, at, dur = 26}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [at, at + dur], [0, value], {...clamp, easing: ease.out});
  return <>{v.toFixed(decimals)}</>;
};

/* ------------------------------------------------------------------ scenes */

const Hook: React.FC<{s: Extract<Scene, {type: 'hook'}>; a: Acc; n: number}> = ({s, a, n}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 16) * 8;
  const iconIn = spr(f, 4, {damping: 14, stiffness: 120});
  const ring = (f % 45) / 45;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1180, textAlign: 'center', fontFamily: SERIF_I, fontSize: 520, lineHeight: 1, color: `rgba(${a.tint},0.07)`, letterSpacing: '-0.06em', transform: `translateY(${(1 - prog(f, 0, 40)) * 60}px)`}}>
        {String(n).padStart(2, '0')}
      </div>
      {s.kicker && <Kicker text={s.kicker} color={a.light} y={330} />}
      <div style={{position: 'absolute', left: 70, width: 940, top: s.big ? 760 : 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
        {s.big && (
          <div style={{position: 'absolute', top: -390, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 300, fontSize: 330, lineHeight: 1, color: a.light, letterSpacing: '-0.05em', opacity: iconIn, transform: `scale(${0.85 + 0.15 * iconIn})`}}>
            {s.big}
          </div>
        )}
        <Rich text={s.lines.join('\n')} at={s.big ? 8 : 2} stagger={3} size={s.big ? 104 : 134} color="#F3EEE4" accent={a.light} weight={400} lineHeight={1.04} />
      </div>
      {s.icon && !s.big && (
        <div style={{position: 'absolute', left: 540 - 120, top: 1000 + bob, width: 240, height: 240, opacity: iconIn, transform: `scale(${0.6 + 0.4 * iconIn}) rotate(${(1 - iconIn) * -20}deg)`, color: a.light}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 120, border: `2px solid rgba(${a.tint},${0.5 * (1 - ring)})`, transform: `scale(${1 + ring * 0.5})`}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 120, background: `radial-gradient(circle, rgba(${a.tint},0.22), rgba(${a.tint},0.06) 70%)`, border: `1.5px solid rgba(${a.tint},0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name={s.icon} size={124} stroke={2.8} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Stat: React.FC<{s: Extract<Scene, {type: 'stat'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const ring = prog(f, 0, 30);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 300, top: 330, width: 600, height: 600, borderRadius: 300, border: `2px solid rgba(${a.tint},0.35)`, transform: `scale(${0.7 + 0.3 * ring})`, opacity: ring}} />
      <div style={{position: 'absolute', left: 540 - 250, top: 380, width: 500, height: 500, borderRadius: 250, background: `radial-gradient(circle, rgba(${a.tint},0.18), rgba(${a.tint},0) 70%)`}} />
      {s.icon && (
        <div style={{position: 'absolute', left: 540 - 36, top: 400, color: a.deep, opacity: prog(f, 6, 18)}}>
          <Icon name={s.icon} size={72} />
        </div>
      )}
      <div style={{position: 'absolute', left: 0, width: 1080, top: 480, textAlign: 'center', fontFamily: SERIF, fontWeight: 300, fontSize: 280, lineHeight: 1, color: TEXT_DARK, letterSpacing: '-0.05em'}}>
        {s.prefix && <span style={{fontSize: 140, marginRight: 8}}>{s.prefix}</span>}
        <Count value={s.value} decimals={s.decimals} at={4} />
        {s.unit && <span style={{fontFamily: SERIF_I, fontSize: 120, color: a.deep, marginLeft: 14}}>{s.unit}</span>}
      </div>
      <div style={{position: 'absolute', left: 110, width: 860, top: 830}}>
        <Rich text={s.label} at={14} stagger={2} size={52} color={TEXT_DARK} accent={a.deep} font={SANS} weight={500} lineHeight={1.25} tracking={-0.01} />
      </div>
      <Note text={s.note} dark={false} />
    </AbsoluteFill>
  );
};

const Bars: React.FC<{s: Extract<Scene, {type: 'bars'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const max = Math.max(...s.items.map((i) => i.value));
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 330}}>
          <Rich text={s.title} size={74} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <div style={{position: 'absolute', left: 90, width: 900, top: s.title ? 600 : 480, display: 'flex', flexDirection: 'column', gap: 46}}>
        {s.items.map((it, i) => {
          const p = interpolate(f, [8 + i * 10, 34 + i * 10], [0, 1], {...clamp, easing: ease.out});
          const w = (it.value / max) * 900 * p;
          return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', gap: 14, opacity: prog(f, 4 + i * 10, 14 + i * 10)}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: SANS}}>
                <span style={{fontWeight: 600, fontSize: 40, color: TEXT_DARK}}>{it.label}</span>
                <span style={{fontFamily: SERIF, fontWeight: 400, fontSize: 64, color: it.hi ? a.deep : TEXT_DARK}}>
                  {(it.value * p).toFixed(it.value % 1 ? 1 : 0)}
                  <span style={{fontSize: 34, marginLeft: 6, fontFamily: SANS}}>{it.unit}</span>
                </span>
              </div>
              <div style={{height: 34, borderRadius: 17, background: 'rgba(19,36,30,0.08)', overflow: 'hidden'}}>
                <div style={{width: w, height: 34, borderRadius: 17, background: it.hi ? `linear-gradient(90deg, ${a.deep}, ${a.light})` : 'rgba(19,36,30,0.35)'}} />
              </div>
            </div>
          );
        })}
      </div>
      <Note text={s.note} dark={false} at={30} />
    </AbsoluteFill>
  );
};

const Compare: React.FC<{s: Extract<Scene, {type: 'compare'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const card = (side: {label: string; value: string; sub?: string}, i: number) => {
    const p = spr(f, 6 + i * 8, {damping: 16, stiffness: 120});
    return (
      <div style={{flex: 1, minWidth: 0, padding: '46px 28px', borderRadius: 36, background: i ? `rgba(${a.tint},0.14)` : 'rgba(19,36,30,0.05)', border: `1.5px solid ${i ? `rgba(${a.tint},0.45)` : 'rgba(19,36,30,0.12)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: p, transform: `translateY(${(1 - p) * 80}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: TEXT_DARK, textAlign: 'center'}}>{side.label}</div>
        <div style={{fontFamily: SERIF, fontWeight: 300, fontSize: side.value.length > 6 ? 70 : side.value.length > 4 ? 96 : 120, lineHeight: 1, color: i ? a.deep : TEXT_DARK, letterSpacing: '-0.03em', textAlign: 'center'}}>{side.value}</div>
        {side.sub && <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: TEXT_SOFT, textAlign: 'center'}}>{side.sub}</div>}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 330}}>
          <Rich text={s.title} size={74} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <div style={{position: 'absolute', left: 70, width: 940, top: 600, display: 'flex', gap: 26, alignItems: 'stretch'}}>
        {card(s.left, 0)}
        {card(s.right, 1)}
      </div>
      <div style={{position: 'absolute', left: 540 - 44, top: 600 + 140, width: 88, height: 88, borderRadius: 44, background: PAPER, border: '1.5px solid rgba(19,36,30,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF_I, fontSize: 40, color: TEXT_DARK, opacity: prog(f, 14, 24)}}>vs</div>
      {s.verdict && (
        <div style={{position: 'absolute', left: 90, width: 900, top: 1040}}>
          <Rich text={s.verdict} at={26} stagger={2} size={50} color={TEXT_DARK} accent={a.deep} font={SANS} weight={500} lineHeight={1.25} tracking={-0.01} />
        </div>
      )}
      <Note text={s.note} dark={false} at={34} />
    </AbsoluteFill>
  );
};

const List: React.FC<{s: Extract<Scene, {type: 'list'}>; a: Acc; dur: number}> = ({s, a, dur}) => {
  const f = useCurrentFrame();
  const step = Math.max(10, Math.min(22, (dur - 30) / s.items.length));
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 320}}>
          <Rich text={s.title} size={72} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <div style={{position: 'absolute', left: 90, width: 900, top: s.title ? 560 : 420, display: 'flex', flexDirection: 'column', gap: 28}}>
        {s.items.map((it, i) => {
          const p = spr(f, 8 + i * step, {damping: 16, stiffness: 140});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '24px 30px', borderRadius: 30, background: 'rgba(255,255,255,0.55)', border: '1.5px solid rgba(19,36,30,0.08)', boxShadow: '0 18px 40px rgba(19,36,30,0.06)', opacity: p, transform: `translateX(${(1 - p) * -120}px)`}}>
              <div style={{width: 96, height: 96, flex: '0 0 96px', borderRadius: 48, background: `rgba(${a.tint},0.16)`, color: a.deep, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={it.icon} size={58} />
              </div>
              <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: TEXT_DARK, lineHeight: 1.2, minWidth: 0}}>{it.text}</div>
            </div>
          );
        })}
      </div>
      <Note text={s.note} dark={false} at={40} />
    </AbsoluteFill>
  );
};

const Myth: React.FC<{s: Extract<Scene, {type: 'myth'}>; a: Acc; dur: number}> = ({s, a, dur}) => {
  const f = useCurrentFrame();
  const flip = Math.round(dur * 0.42);
  const strike = prog(f, flip - 10, flip + 2, ease.inOut);
  const fact = spr(f, flip, {damping: 15, stiffness: 120});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 90, width: 900, top: 380}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.24em', color: '#F0674E', marginBottom: 20, opacity: prog(f, 0, 10)}}>MYTH</div>
        <div style={{position: 'relative', opacity: 1 - strike * 0.55}}>
          <Rich text={s.myth} size={76} color="#F3EEE4" accent="#F0674E" lineHeight={1.1} align="left" />
          <div style={{position: 'absolute', left: 0, top: '50%', height: 6, width: `${strike * 100}%`, background: '#F0674E', borderRadius: 3}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, width: 900, top: 820, opacity: fact, transform: `translateY(${(1 - fact) * 60}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.24em', color: a.light, marginBottom: 20}}>FACT</div>
        {f >= flip && <Rich text={s.fact} at={flip} stagger={2} size={64} color="#F3EEE4" accent={a.light} lineHeight={1.14} align="left" />}
      </div>
      <Note text={s.note} dark at={flip + 10} />
    </AbsoluteFill>
  );
};

const Cubes: React.FC<{s: Extract<Scene, {type: 'cubes'}>; a: Acc; dur: number}> = ({s, a, dur}) => {
  const f = useCurrentFrame();
  const cols = Math.min(6, s.count);
  const size = 112;
  const gap = 22;
  const rows = Math.ceil(s.count / cols);
  const gridW = cols * size + (cols - 1) * gap;
  const step = Math.max(3, Math.min(8, (dur * 0.5) / s.count));
  const shown = Math.min(s.count, Math.floor(f / step) + 1);
  const fill = s.kind === 'salt' ? '#FFFFFF' : s.kind === 'oil' ? a.light : '#FFFDF8';
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 300, textAlign: 'center', fontFamily: SERIF, fontWeight: 300, fontSize: 220, lineHeight: 1, color: TEXT_DARK, letterSpacing: '-0.05em'}}>
        {shown}
        <span style={{fontFamily: SERIF_I, fontSize: 80, color: a.deep, marginLeft: 16}}>{s.label}</span>
      </div>
      <div style={{position: 'absolute', left: 540 - gridW / 2, top: 600, width: gridW, height: rows * (size + gap), display: 'flex', flexWrap: 'wrap', gap, alignContent: 'flex-start'}}>
        {Array.from({length: s.count}).map((_, i) => {
          const at = i * step;
          const p = spr(f, at, {damping: 11, stiffness: 160});
          if (f < at) return <div key={i} style={{width: size, height: size}} />;
          return (
            <div key={i} style={{width: size, height: size, transform: `translateY(${(1 - p) * -220}px) rotate(${(1 - p) * (i % 2 ? 18 : -18)}deg)`, opacity: Math.min(1, p * 2)}}>
              <svg width={size} height={size} viewBox="0 0 100 100">
                <path d="M50 8 L90 28 L90 72 L50 92 L10 72 L10 28 Z" fill={fill} stroke={a.deep} strokeWidth={3} />
                <path d="M10 28 L50 48 L90 28 M50 48 L50 92" fill="none" stroke={a.deep} strokeWidth={3} strokeLinejoin="round" />
                <path d="M50 8 L90 28 L50 48 L10 28 Z" fill={`rgba(${a.tint},0.18)`} />
              </svg>
            </div>
          );
        })}
      </div>
      {s.sub && (
        <div style={{position: 'absolute', left: 90, width: 900, top: 600 + rows * (size + gap) + 50}}>
          <Rich text={s.sub} at={Math.min(dur - 30, s.count * step)} stagger={2} size={48} color={TEXT_DARK} accent={a.deep} font={SANS} weight={500} lineHeight={1.25} tracking={-0.01} />
        </div>
      )}
      <Note text={s.note} dark={false} at={30} />
    </AbsoluteFill>
  );
};

const Timeline: React.FC<{s: Extract<Scene, {type: 'timeline'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const n = s.steps.length;
  const xs = s.steps.map((_, i) => 160 + (i * 760) / (n - 1));
  const lineP = prog(f, 6, 40, ease.inOut);
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 330}}>
          <Rich text={s.title} size={74} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={xs[0]} y1={800} x2={xs[0] + (xs[n - 1] - xs[0]) * lineP} y2={800} stroke={a.deep} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
      </svg>
      {s.steps.map((st, i) => {
        const p = spr(f, 4 + i * 12, {damping: 14, stiffness: 140});
        return (
          <div key={i} style={{position: 'absolute', left: xs[i] - 90, top: 710, width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: p, transform: `scale(${0.6 + 0.4 * p})`}}>
            <div style={{width: 180, height: 180, borderRadius: 90, background: i % 2 ? `rgba(${a.tint},0.18)` : '#FFFFFF', border: `2px solid ${i % 2 ? a.deep : 'rgba(19,36,30,0.15)'}`, color: i % 2 ? a.deep : TEXT_DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 40px rgba(19,36,30,0.08)'}}>
              <Icon name={st.icon} size={92} />
            </div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: TEXT_DARK, textAlign: 'center', whiteSpace: 'nowrap'}}>{st.label}</div>
          </div>
        );
      })}
      {s.gaps.map((g, i) => {
        const p = prog(f, 20 + i * 10, 34 + i * 10);
        const x = (xs[i] + xs[i + 1]) / 2;
        return (
          <div key={i} style={{position: 'absolute', left: x - 160, top: 640, width: 320, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <span style={{fontFamily: SERIF_I, fontSize: 54, color: a.deep, background: PAPER, padding: '0 16px'}}>{g}</span>
          </div>
        );
      })}
      <Note text={s.note} dark={false} at={40} />
    </AbsoluteFill>
  );
};

const PALETTE_PLATE = ['#5CC489', '#F2B63C', '#E9C46A', '#F0674E', '#B7D85A', '#6DB8E0', '#E07AA6', '#A67C52'];

const Plate: React.FC<{s: Extract<Scene, {type: 'plate'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const R = 250;
  const cx = 540;
  const cy = 760;
  const total = s.parts.reduce((t, p) => t + p.share, 0);
  let acc = 0;
  const sweep = prog(f, 4, 44, ease.inOut);
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 290}}>
          <Rich text={s.title} size={68} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={cx} cy={cy} r={R + 34} fill="#FFFFFF" stroke="rgba(19,36,30,0.08)" strokeWidth={2} />
        {s.parts.map((p, i) => {
          const start = (acc / total) * Math.PI * 2 * sweep;
          acc += p.share;
          const end = (acc / total) * Math.PI * 2 * sweep;
          const large = end - start > Math.PI ? 1 : 0;
          const x0 = cx + R * Math.sin(start);
          const y0 = cy - R * Math.cos(start);
          const x1 = cx + R * Math.sin(end);
          const y1 = cy - R * Math.cos(end);
          if (end - start < 0.001) return null;
          return <path key={i} d={`M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill={PALETTE_PLATE[i % PALETTE_PLATE.length]} stroke="#FFFFFF" strokeWidth={6} />;
        })}
        <circle cx={cx} cy={cy} r={R * 0.48} fill="#FFFFFF" />
      </svg>
      {s.centre && (
        <div style={{position: 'absolute', left: cx - 120, top: cy - 50, width: 240, textAlign: 'center', fontFamily: SERIF, fontSize: 46, lineHeight: 1.05, color: TEXT_DARK, opacity: prog(f, 30, 44)}}>{s.centre}</div>
      )}
      <div style={{position: 'absolute', left: 70, width: 940, top: 1060, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 26, rowGap: 14}}>
        {s.parts.map((p, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: SANS, fontSize: 30, color: TEXT_DARK, opacity: prog(f, 20 + i * 4, 30 + i * 4)}}>
            <span style={{width: 22, height: 22, borderRadius: 11, background: PALETTE_PLATE[i % PALETTE_PLATE.length], flex: '0 0 22px'}} />
            <span style={{fontWeight: 600}}>{p.label}</span>
            <span style={{marginLeft: 'auto', color: TEXT_SOFT, fontWeight: 500}}>{p.value}</span>
          </div>
        ))}
      </div>
      <Note text={s.note} dark={false} at={40} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{s: Extract<Scene, {type: 'label'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const card = spr(f, 2, {damping: 18, stiffness: 110});
  let wi = 0;
  return (
    <AbsoluteFill>
      {s.title && (
        <div style={{position: 'absolute', left: 80, width: 920, top: 310}}>
          <Rich text={s.title} size={68} color={TEXT_DARK} accent={a.deep} lineHeight={1.1} />
        </div>
      )}
      <div style={{position: 'absolute', left: 110, width: 860, top: s.title ? 560 : 440, padding: '44px 46px', background: '#FFFEFA', borderRadius: 14, boxShadow: '0 30px 70px rgba(19,36,30,0.14), 0 2px 0 rgba(19,36,30,0.05)', border: '1.5px solid rgba(19,36,30,0.12)', transform: `translateY(${(1 - card) * 120}px) rotate(${(1 - card) * -4 - 1}deg)`, opacity: card}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: '0.14em', color: TEXT_DARK, borderBottom: '3px solid #13241E', paddingBottom: 14, marginBottom: 22}}>{s.heading}</div>
        <div style={{fontFamily: "'Poppins', sans-serif", fontSize: 38, lineHeight: 1.6, color: '#2A3832'}}>
          {s.words.map((w, i) => {
            const at = 14 + wi++ * 2;
            const hp = w.hi ? prog(f, 26 + i * 5, 40 + i * 5, ease.inOut) : 0;
            return (
              <span key={i} style={{opacity: prog(f, at, at + 8), position: 'relative', fontWeight: w.hi ? 700 : 400, color: w.hi ? TEXT_DARK : undefined, backgroundImage: w.hi ? `linear-gradient(transparent 58%, rgba(${a.tint},0.55) 58%)` : undefined, backgroundSize: `${hp * 100}% 100%`, backgroundRepeat: 'no-repeat', marginRight: 10}}>
                {w.t}
                {i < s.words.length - 1 && <span style={{fontWeight: 400, color: '#2A3832'}}>,</span>}
              </span>
            );
          })}
        </div>
        {s.footer && <div style={{marginTop: 24, paddingTop: 16, borderTop: '1.5px solid rgba(19,36,30,0.15)', fontFamily: SANS, fontSize: 30, color: TEXT_SOFT}}>{s.footer}</div>}
      </div>
      <Note text={s.note} dark={false} at={40} />
    </AbsoluteFill>
  );
};

const Statement: React.FC<{s: Extract<Scene, {type: 'statement'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const dark = !!s.dark;
  const ip = spr(f, 2, {damping: 14, stiffness: 120});
  return (
    <AbsoluteFill>
      {s.icon && (
        <div style={{position: 'absolute', left: 540 - 70, top: 360, color: dark ? a.light : a.deep, opacity: ip, transform: `scale(${0.6 + 0.4 * ip})`}}>
          <Icon name={s.icon} size={140} stroke={2.6} />
        </div>
      )}
      <div style={{position: 'absolute', left: 80, width: 920, top: s.icon ? 600 : 480}}>
        <Rich text={s.lines.join('\n')} at={4} size={92} color={dark ? '#F3EEE4' : TEXT_DARK} accent={dark ? a.light : a.deep} lineHeight={1.08} />
      </div>
      <Note text={s.note} dark={dark} at={30} />
    </AbsoluteFill>
  );
};

const SCREENS: Record<string, string> = {
  'meal-result': UI.mealResult,
  'label-result': UI.labelResult,
  chat: UI.chat,
  home: UI.home,
  streak: UI.streak,
  metrics: UI.metrics,
};

const Cta: React.FC<{s: Extract<Scene, {type: 'cta'}>; a: Acc}> = ({s, a}) => {
  const f = useCurrentFrame();
  const ph = spr(f, 2, {damping: 18, stiffness: 90});
  const ira = spr(f, 14, {damping: 11, stiffness: 140});
  const screen = SCREENS[s.screen];
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, width: 920, top: 250}}>
        <Rich text={s.line} at={0} stagger={2} size={74} color="#F3EEE4" accent={a.light} lineHeight={1.08} />
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - ph) * 500}px) rotate(${-6 + ph * 2}deg)`, transformOrigin: '540px 900px', opacity: ph}}>
        <Phone cx={470} cy={870} width={380} screen={screen} screenH={SCREEN_H[screen]} />
      </div>
      <Img src={src(emoteFile('phone'))} style={{position: 'absolute', left: 665, top: 740 + (1 - ira) * 120, width: 290, height: 290 * (657 / 350), opacity: ira, transform: `scale(${0.7 + 0.3 * ira})`, transformOrigin: '50% 100%', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))'}} />
      <div style={{position: 'absolute', left: 0, width: 1080, top: 1340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: prog(f, 18, 32), transform: `translateY(${(1 - prog(f, 18, 34)) * 30}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 36px', borderRadius: 999, background: a.light, color: INK, fontFamily: SANS, fontWeight: 700, fontSize: 38}}>
          Dietary Guide
          {s.sub && <span style={{fontWeight: 500, opacity: 0.8}}>· {s.sub}</span>}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: 'rgba(243,238,228,0.55)', letterSpacing: '0.04em'}}>Educational content, not medical advice</div>
      </div>
    </AbsoluteFill>
  );
};

/** Renders one scene with a soft enter and a quick exit. */
export const SceneView: React.FC<{s: Scene; accent: string; dur: number; n: number}> = ({s, accent, dur, n}) => {
  const f = useCurrentFrame();
  const a = ACCENTS[accent];
  const enter = prog(f, 0, 12);
  const exit = prog(f, dur - 8, dur, ease.in);
  const body = (() => {
    switch (s.type) {
      case 'hook': return <Hook s={s} a={a} n={n} />;
      case 'stat': return <Stat s={s} a={a} />;
      case 'bars': return <Bars s={s} a={a} />;
      case 'compare': return <Compare s={s} a={a} />;
      case 'list': return <List s={s} a={a} dur={dur} />;
      case 'myth': return <Myth s={s} a={a} dur={dur} />;
      case 'cubes': return <Cubes s={s} a={a} dur={dur} />;
      case 'timeline': return <Timeline s={s} a={a} />;
      case 'plate': return <Plate s={s} a={a} />;
      case 'label': return <Label s={s} a={a} />;
      case 'statement': return <Statement s={s} a={a} />;
      case 'cta': return <Cta s={s} a={a} />;
    }
  })();
  return (
    <AbsoluteFill style={{opacity: enter * (1 - exit), transform: `scale(${1 + (1 - enter) * 0.03 - exit * 0.02})`, filter: exit > 0 ? `blur(${exit * 8}px)` : undefined}}>
      {body}
    </AbsoluteFill>
  );
};
