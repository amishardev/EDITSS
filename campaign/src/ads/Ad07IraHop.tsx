import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {IRA, PHOTO, SCREEN_H, src, UI} from '../assets';
import {Logo} from '../components/Brand';
import {Bubble} from '../components/Bubble';
import {Phone, phonePoint} from '../components/Phone';
import {Cues, Music} from '../components/Sound';
import {Bg, Camera, Flash, Grain, Photo, Scene, ScreenCrop, Tap} from '../components/Stage';
import {Count, Headline, Pill, Sub} from '../components/Text';
import {Flame} from '../components/ui/Icons';
import {C, clamp, ease, F, lerp, prog, spr} from '../theme';

/**
 * AD 07 · "IRA ki Hop" (hero)
 * IRA as a tiny platformer hero. It peeks over a plate, falls onto the
 * scanner's shutter (that's what takes the photo), hops up the macro tiles
 * like stairs, rides the real chat card, hops along the week's streak and
 * super-jumps onto the logo. Every landing plays the next note of the
 * theme (the notes are composed into theme-ad07 at these exact frames).
 */
export const AD07_DURATION = 660;

// ------------------------------------------------------------ hop engine
type Pt = {x: number; y: number; size: number};
type Hop = {t0: number; t1: number; to: Pt; arc?: number; mode?: 'arc' | 'fall' | 'rise' | 'instant'};

const START: Pt = {x: 540, y: 1900, size: 600};

const LAND = {
  shutter: 112,
  cal: 140.6,
  prot: 168.75,
  carb: 196.9,
  fat: 225,
  score: 253.1,
  cheer: 281.25,
  card: 337.5,
  mon: 421.9,
  tue: 435.9,
  wed: 450,
  thu: 464.1,
  logo: 534,
};

const P = {cx: 540, cy: 1000, width: 620};
const SHUTTER = phonePoint(P, 815, 3155);

const PLAT = {
  cal: {x: 80, y: 1330, label: 'Calories', value: 420, unit: 'kcal', bg: C.tileCal},
  prot: {x: 580, y: 1110, label: 'Protein', value: 25, unit: 'g', bg: C.tileProt},
  carb: {x: 80, y: 890, label: 'Carbs', value: 48, unit: 'g', bg: C.tileCarb},
  fat: {x: 580, y: 670, label: 'Fat', value: 14, unit: 'g', bg: C.tileFat},
} as const;
const PW = 420;
const SCORE = {x: 170, y: 430, w: 740, h: 196};
const CARD_Y = 900;
const TILE = {size: 118, gap: 14, y: 1180};
const tileX = (i: number) => 540 - (7 * TILE.size + 6 * TILE.gap) / 2 + i * (TILE.size + TILE.gap) + TILE.size / 2;
const top = (k: keyof typeof PLAT): Pt => ({x: PLAT[k].x + PW / 2, y: PLAT[k].y, size: 190});

const HOPS: Hop[] = [
  {t0: 4, t1: 14, to: {x: 540, y: 1760, size: 600}, mode: 'rise'},
  {t0: 60, t1: 74, to: {x: 540, y: -340, size: 600}, mode: 'rise'},
  {t0: 90, t1: 90, to: {x: SHUTTER.x, y: -300, size: 220}, mode: 'instant'},
  {t0: 98, t1: LAND.shutter, to: {x: SHUTTER.x, y: SHUTTER.y - 18, size: 220}, mode: 'fall'},
  {t0: 128, t1: LAND.cal, to: top('cal'), arc: 170},
  {t0: 156, t1: LAND.prot, to: top('prot'), arc: 150},
  {t0: 184, t1: LAND.carb, to: top('carb'), arc: 150},
  {t0: 212, t1: LAND.fat, to: top('fat'), arc: 150},
  {t0: 240, t1: LAND.score, to: {x: 540, y: SCORE.y, size: 190}, arc: 140},
  {t0: 270, t1: LAND.cheer, to: {x: 540, y: SCORE.y, size: 190}, arc: 120},
  {t0: 300, t1: 314, to: {x: 540, y: -360, size: 190}, mode: 'rise'},
  {t0: 318, t1: 318, to: {x: 540, y: -320, size: 260}, mode: 'instant'},
  {t0: 326, t1: LAND.card, to: {x: 540, y: CARD_Y, size: 260}, mode: 'fall'},
  {t0: 410, t1: LAND.mon, to: {x: tileX(0), y: TILE.y, size: 170}, arc: 130},
  {t0: 427, t1: LAND.tue, to: {x: tileX(1), y: TILE.y, size: 170}, arc: 90},
  {t0: 441, t1: LAND.wed, to: {x: tileX(2), y: TILE.y, size: 170}, arc: 90},
  {t0: 455, t1: LAND.thu, to: {x: tileX(3), y: TILE.y, size: 170}, arc: 90},
  {t0: 494, t1: LAND.logo, to: {x: 540, y: 1012, size: 470}, arc: 620},
  {t0: 590, t1: 604, to: {x: 540, y: 1012, size: 470}, arc: 70},
];

const cardBob = (f: number) => (f >= LAND.card ? Math.sin((f - LAND.card) / 13) * 9 : 0);

/** Where IRA is on frame f: position, size, lean, and whether airborne. */
const iraAt = (f: number) => {
  let cur = START;
  for (const h of HOPS) {
    if (f < h.t0 - 6) break;
    const from = cur;
    if (f < h.t0) {
      // anticipation: a small crouch before take-off
      const d = Math.sin(((f - (h.t0 - 6)) / 6) * Math.PI) * from.size * 0.03;
      return {...from, y: from.y + d, rot: 0, air: 0};
    }
    if (h.mode === 'instant' || f >= h.t1) {
      cur = h.to;
      continue;
    }
    const p = (f - h.t0) / (h.t1 - h.t0);
    const yp = h.mode === 'fall' ? p * p : h.mode === 'rise' ? 1 - (1 - p) * (1 - p) : p;
    const x = lerp(from.x, h.to.x, ease.inOut(p) * 0.4 + p * 0.6);
    const y = lerp(from.y, h.to.y, yp) - (h.arc ?? 0) * 4 * p * (1 - p);
    const size = lerp(from.size, h.to.size, ease.inOut(p));
    const dir = Math.sign(h.to.x - from.x);
    return {x, y, size, rot: dir * 9 * Math.sin(p * Math.PI), air: 1};
  }
  // landing settle: a quick dip after touching down
  const last = [...HOPS].reverse().find((h) => f >= h.t1 && h.mode !== 'instant' && h.mode !== 'rise');
  let settle = 0;
  if (last && f - last.t1 < 10) settle = Math.sin(((f - last.t1) / 10) * Math.PI) * cur.size * 0.025;
  const bob = f >= LAND.card && f < 410 ? cardBob(f) : 0;
  return {...cur, y: cur.y + settle + bob, rot: 0, air: 0};
};

const IraHopper: React.FC = () => {
  const f = useCurrentFrame();
  const s = iraAt(f);
  if (s.y - s.size > 1960 || s.y < -10) return null;
  const idle = s.air ? 0 : Math.sin(f / 9) * 0.6;
  return (
    <>
      {!s.air && (
        <div style={{position: 'absolute', left: s.x - s.size * 0.26, top: s.y - s.size * 0.03, width: s.size * 0.52, height: s.size * 0.06, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(15,23,42,0.32), rgba(15,23,42,0) 70%)'}} />
      )}
      <Img
        src={src(IRA)}
        style={{
          position: 'absolute',
          left: s.x - s.size / 2,
          top: s.y - s.size,
          width: s.size,
          height: s.size,
          transformOrigin: '50% 100%',
          transform: `rotate(${s.rot + idle}deg)`,
          filter: 'drop-shadow(0 14px 22px rgba(15,23,42,0.22))',
        }}
      />
    </>
  );
};

// ------------------------------------------------------------ set pieces

/** How much a surface dips when IRA lands on it. */
const dip = (f: number, at: number, amt = 16) => (f >= at && f < at + 10 ? Math.sin(((f - at) / 10) * Math.PI) * amt : 0);

const Platform: React.FC<{k: keyof typeof PLAT; at: number; land: number; out: number}> = ({k, at, land, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = PLAT[k];
  const s = spr(f, at, {damping: 13, stiffness: 230});
  const o = prog(f, out, out + 14, ease.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: PW,
        height: 196,
        borderRadius: 40,
        background: p.bg,
        boxShadow: '0 22px 40px rgba(15,23,42,0.14), inset 0 -6px 0 rgba(15,23,42,0.05)',
        padding: '30px 38px',
        boxSizing: 'border-box',
        fontFamily: F.body,
        transform: `translateY(${interpolate(s, [0, 1], [-1100, 0]) + dip(f, land) + o * 1400}px)`,
      }}
    >
      <div style={{fontSize: 34, fontWeight: 500, color: C.ink}}>{p.label}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6}}>
        <span style={{fontFamily: F.display, fontSize: 86, fontWeight: 700, letterSpacing: '-0.04em', color: C.ink, opacity: f >= land ? 1 : 0.18}}>
          {f >= land ? <Count to={p.value} at={land} dur={14} /> : '--'}
        </span>
        <span style={{fontSize: 36, color: C.sub}}>{p.unit}</span>
      </div>
    </div>
  );
};

const ScoreCard: React.FC<{at: number; out: number}> = ({at, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 13, stiffness: 230});
  const o = prog(f, out, out + 14, ease.in);
  const bar = interpolate(f, [LAND.score, LAND.score + 20], [0, 0.82], {...clamp, easing: ease.out});
  return (
    <div
      style={{
        position: 'absolute',
        left: SCORE.x,
        top: SCORE.y,
        width: SCORE.w,
        height: SCORE.h,
        borderRadius: 44,
        background: C.teal,
        color: '#fff',
        fontFamily: F.body,
        boxShadow: '0 26px 50px rgba(15,23,42,0.25)',
        transform: `translateY(${interpolate(s, [0, 1], [-1100, 0]) + dip(f, LAND.score) + dip(f, LAND.cheer, 10) + o * 1600}px)`,
      }}
    >
      <div style={{position: 'absolute', left: 40, top: 38, fontSize: 30, opacity: 0.72}}>Health score</div>
      <div style={{position: 'absolute', left: 40, top: 78, fontFamily: F.display, fontSize: 36, fontWeight: 600}}>Paneer bhurji + 2 roti</div>
      <div style={{position: 'absolute', right: 40, top: 24, display: 'flex', alignItems: 'baseline'}}>
        <span style={{fontFamily: F.display, fontSize: 104, fontWeight: 700, letterSpacing: '-0.04em'}}>{f >= LAND.score ? <Count to={82} at={LAND.score} dur={18} /> : '--'}</span>
        <span style={{fontSize: 38, opacity: 0.7}}>/100</span>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 34, height: 16, borderRadius: 8, background: '#375559'}}>
        <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 8, background: `linear-gradient(90deg, #F59E0B, ${C.scoreBar})`}} />
      </div>
    </div>
  );
};

/** Leaf confetti (the logo's leaf colours), seeded so every render matches. */
const Leaves: React.FC<{at: number; x: number; y: number; n?: number; spread?: number}> = ({at, x, y, n = 18, spread = 1}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 50) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + (i % 3) * 0.3;
        const v = (9 + ((i * 37) % 7)) * spread;
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t * 0.8 - 12 * t + 0.45 * t * t;
        const col = [C.leaf, '#4ADE80', C.deep, C.haldi][i % 4];
        return (
          <div key={i} style={{position: 'absolute', left: px, top: py, width: 22, height: 12, borderRadius: '50% 0', background: col, opacity: interpolate(t, [36, 50], [1, 0], clamp), transform: `rotate(${a * 57 + t * (i % 2 ? 14 : -14)}deg)`}} />
        );
      })}
    </>
  );
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LAND = [LAND.mon, LAND.tue, LAND.wed, LAND.thu];

const WeekTiles: React.FC<{at: number; out: number}> = ({at, out}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = prog(f, out, out + 14, ease.in);
  return (
    <>
      {DAYS.map((d, i) => {
        const s = spr(f, at + i * 2, {damping: 13, stiffness: 160});
        const land = DAY_LAND[i];
        const lit = land !== undefined && f >= land;
        const today = i === 3;
        const pop = lit ? spr(f, land, {damping: 9, stiffness: 260}) : 0;
        return (
          <div key={d} style={{position: 'absolute', left: tileX(i) - TILE.size / 2, top: TILE.y, width: TILE.size, transform: `translateY(${interpolate(s, [0, 1], [600, 0]) + (land ? dip(f, land, 12) : 0) + o * 900}px)`, opacity: s}}>
            <div
              style={{
                width: TILE.size,
                height: TILE.size,
                borderRadius: 30,
                background: lit ? (today ? C.teal : C.soft) : '#fff',
                border: lit ? 'none' : `4px dashed ${C.border}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: lit ? '0 14px 30px rgba(15,23,42,0.14)' : undefined,
              }}
            >
              {lit && (
                <div style={{transform: `scale(${0.4 + pop * 0.6})`}}>
                  <Flame size={58} color={today ? '#F4B740' : C.leaf} />
                </div>
              )}
            </div>
            <div style={{textAlign: 'center', marginTop: 14, fontFamily: F.body, fontSize: 28, fontWeight: today ? 700 : 500, color: today ? C.ink : C.sub}}>{d}</div>
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------ the ad

export const Ad07IraHop: React.FC = () => {
  const f = useCurrentFrame();
  const phoneOut = prog(f, 114, 128, ease.in);
  const cardIn = spr(f, 318, {damping: 14, stiffness: 90});
  const cardOut = prog(f, 412, 428, ease.in);
  const cardW = 860;
  const logoDip = dip(f, LAND.logo, 22);

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="ad07" duration={AD07_DURATION} volume={0.55} />
      <Bg kind="warm" glow={[540, 900]} />
      <AbsoluteFill style={{opacity: prog(f, 480, 520)}}>
        <Bg kind="green" glow={[540, 900]} />
      </AbsoluteFill>

      {/* 1 · the plate, and the scanner it turns into */}
      <Scene from={0} to={150}>
        <Camera z={[[56, 1.7], [98, 1]]} y={[[56, 1000], [98, 960]]}>
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${phoneOut * 2100}px)`, opacity: 1 - phoneOut * 0.6}}>
            <Phone {...P} screen={UI.scannerFood} screenH={3484} glass={<Tap at={LAND.shutter} x={815} y={3155} r={230} />} />
          </div>
        </Camera>
        <AbsoluteFill style={{opacity: interpolate(f, [56, 70], [1, 0], clamp)}}>
          <Photo file={PHOTO.rotiPaneer} z={[[0, 1.18], [56, 1.08], [70, 0.82]]} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,20,22,0.45) 0%, rgba(7,20,22,0) 40%)'}} />
        </AbsoluteFill>
        <Bubble at={8} out={54} x={600} y={1050} lines={['Psst!']} size={70} tail="left" />
        <Bubble at={24} out={54} x={90} y={300} lines={['Plate mein', 'kya hai?']} size={96} typing={6} />
        <Headline lines={['Chalo, *dekhte* hain!']} at={94} out={124} y={222} size={74} color={C.ink} />
        <Flash at={LAND.shutter + 1} dur={8} peak={0.75} />
      </Scene>

      {/* 2 · macro staircase */}
      <Scene from={112} to={330}>
        <ScoreCard at={136} out={296} />
        <Platform k="cal" at={124} land={LAND.cal} out={300} />
        <Platform k="prot" at={127} land={LAND.prot} out={303} />
        <Platform k="carb" at={130} land={LAND.carb} out={306} />
        <Platform k="fat" at={133} land={LAND.fat} out={309} />
        <Sub text="AI estimate. Tap any value to correct it." at={150} out={292} y={634} size={24} weight={400} />
        <Headline lines={['Ek snap. *Poora* hisaab.']} at={146} out={292} y={1552} size={62} color={C.ink} />
        <Leaves at={LAND.score} x={540} y={420} />
        <Leaves at={LAND.cheer} x={540} y={360} n={12} spread={0.8} />
      </Scene>

      {/* 3 · riding the real chat card */}
      <Scene from={300} to={432}>
        <Bubble at={312} out={404} x={1000} y={300} align="right" tail="right" kind="user" font="'Poppins', sans-serif" weight={500} lines={['What should I have', 'for dinner? Something', 'quick.']} size={52} />
        <div style={{position: 'absolute', left: 540 - cardW / 2, top: CARD_Y, transform: `translateY(${interpolate(cardIn, [0, 1], [1200, 0]) + cardBob(f) + dip(f, LAND.card, 20) + cardOut * 1300}px)`, filter: 'drop-shadow(0 40px 60px rgba(15,23,42,0.22))'}}>
          <ScreenCrop screen={UI.chat} screenH={SCREEN_H[UI.chat]} rect={{x: 40, y: 1680, w: 1360, h: 810}} width={cardW} radius={44} style={{position: 'relative', background: '#fff'}} />
          <Tap at={384} x={377} y={420} r={130} color="rgba(22,163,74,0.9)" />
        </div>
        <Headline lines={['IRA se *pooch.*']} at={346} out={404} y={1470} size={88} color={C.ink} />
      </Scene>

      {/* 4 · one hop a day */}
      <Scene from={404} to={520}>
        <WeekTiles at={404} out={496} />
        <Headline lines={['Har din,', '*ek hop.*']} at={416} out={488} y={700} size={104} color={C.ink} lineHeight={1.0} />
        <Sub text="Small habits count." at={470} out={490} y={1400} size={40} color={C.sub} />
      </Scene>

      {/* 5 · super jump onto the logo */}
      <Scene from={500} to={AD07_DURATION}>
        <Burst at={LAND.logo} />
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${logoDip}px)`}}>
          <Logo at={512} cx={540} y={1004} width={600} />
        </div>
        <Leaves at={LAND.logo} x={540} y={980} n={24} spread={1.3} />
        <Headline lines={['Hop. Snap. *Know.*']} at={548} y={1318} size={86} color={C.ink} stagger={5} />
        <Sub text="Snap your plate. Know what you're eating." at={562} y={1426} size={36} color={C.sub} />
        <Pill text="Try Dietary Guide" at={574} cx={540} y={1490} size={44} pad={[26, 60]} />
      </Scene>

      <IraHopper />
      <Grain opacity={0.04} vignette={0} />

      <Cues
        cues={[
          [0, 'pop', 0.4],
          [8, 'pop', 0.5],
          [24, 'tick', 0.35],
          [60, 'whoosh', 0.45],
          [98, 'swish', 0.35],
          [LAND.shutter, 'tap', 0.9],
          [LAND.shutter + 1, 'impact', 0.6],
          [114, 'whoosh', 0.35],
          [128, 'swish', 0.25],
          [LAND.score, 'sparkle', 0.4],
          [300, 'whoosh', 0.35],
          [312, 'tick', 0.4],
          [LAND.card, 'pop', 0.35],
          [384, 'tap', 0.7],
          [386, 'success', 0.4],
          [412, 'swish', 0.3],
          [494, 'whoosh', 0.45],
          [LAND.logo, 'impact', 0.6],
          [LAND.logo + 2, 'sparkle', 0.45],
          [604, 'pop', 0.35],
        ]}
      />
    </AbsoluteFill>
  );
};

const Burst: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <>
      {[0, 6, 12].map((d, i) => {
        const p = interpolate(f, [at + d, at + d + 40], [0, 1], {...clamp, easing: ease.out});
        const r = 100 + p * 850;
        return <div key={i} style={{position: 'absolute', left: 540 - r, top: 1010 - r * 0.3, width: r * 2, height: r * 0.6, borderRadius: '50%', border: `${7 - i * 2}px solid rgba(22,163,74,${0.5 * (1 - p)})`}} />;
      })}
    </>
  );
};
