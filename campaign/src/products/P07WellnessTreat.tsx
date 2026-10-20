import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {src} from '../assets';
import {Ira} from '../components/Ira';
import {Cues, Music} from '../components/Sound';
import {Reveal, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr, track} from '../theme';
import {Grade, Kicker, LOGO_WHITE, P, Pack, Particles, SHOP_URL, Shot, shotPoint, Title} from './kit';

/**
 * WELLNESS TREAT · hero gifting film (27s)
 * A thin gold line draws in darkness; raking light crosses the box's own gold
 * curve -> a candle-lit silhouette slowly brightens -> the box rises on a
 * glossy floor with its printed tagline -> the REAL opened box (photograph),
 * each actual item labelled with gold leader lines, including the branded
 * surprise -> the range converges into the box -> a warm gold hero frame with
 * the brand's own line "Health, Happiness, and a Little Surprise!".
 * Contents shown are only what the real photos show.
 */
export const P07_DURATION = 810;
const GOLD = '#D9AE5F';
const CHOC = '#2A1712';
const CREAM = '#F5EAD9';
const SIL = 96;
const RISE = 206;
const OPEN = 336;
const RANGE = 530;
const HERO = 650;

/** Gold curve drawn on, echoing the line on the box sleeve. */
const GoldLine: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 54], [0, 1], {...clamp, easing: ease.inOut});
  const o = interpolate(f, [80, SIL], [1, 0], clamp);
  const L = 2600;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o}}>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#8A6A2E" />
          <stop offset="0.5" stopColor="#F3D58E" />
          <stop offset="1" stopColor="#B8873A" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M -60 1560 C 260 1420, 420 1180, 520 960 S 760 420, 1140 300" stroke="url(#g)" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} filter="url(#glow)" />
    </svg>
  );
};

/** Raking light across a huge close-up of the real box front. */
const Raking: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, SIL], [-0.12, 1.25], {...clamp, easing: ease.inOut});
  const o = interpolate(f, [SIL - 12, SIL], [1, 0], clamp);
  const W = 3000;
  const H = (W * P.treat.h) / P.treat.w;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Img src={src(P.treat.file)} style={{position: 'absolute', left: 540 - W * 0.56, top: 960 - H * 0.47, width: W, height: H, opacity: 0.16, filter: 'brightness(0.7)', transform: `translateX(${(f - 22) * -0.9}px)`}} />
      <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `linear-gradient(105deg, transparent ${p * 100 - 28}%, black ${p * 100}%, transparent ${p * 100 + 28}%)`, maskImage: `linear-gradient(105deg, transparent ${p * 100 - 28}%, black ${p * 100}%, transparent ${p * 100 + 28}%)`}}>
        <Img src={src(P.treat.file)} style={{position: 'absolute', left: 540 - W * 0.56, top: 960 - H * 0.47, width: W, height: H, filter: 'brightness(0.9) contrast(1.05)', transform: `translateX(${(f - 22) * -0.9}px)`}} />
      </div>
    </AbsoluteFill>
  );
};

export const LABELS: {d: number; text: string; px: number; py: number; lx: number; ly: number; align: 'left' | 'right'}[] = [
  {d: 44, text: 'Digestion Tea', px: 235, py: 830, lx: 70, ly: 470, align: 'left'},
  {d: 60, text: 'High Protein Millet Granola', px: 420, py: 870, lx: 70, ly: 380, align: 'left'},
  {d: 76, text: 'Roasted Chana Jor Masala', px: 590, py: 870, lx: 1010, ly: 470, align: 'right'},
  {d: 92, text: 'Protein Bars', px: 190, py: 1060, lx: 70, ly: 1440, align: 'left'},
  {d: 110, text: '+ a little surprise', px: 600, py: 1050, lx: 1010, ly: 1440, align: 'right'},
];
/** Framing of the real opened-box photo (899x1599), shared with the festive gift film. */
export const OPEN_FX = 450;
export const OPEN_FY = 960;
export const openZoom = (f: number, open: number, end: number) => track(f, [[open, 1.24], [end, 1.36]], ease.soft);

const Label: React.FC<(typeof LABELS)[number] & {open: number; end: number; gold: string}> = ({d, text, px, py, lx, ly, align, open, end, gold}) => {
  const f = useCurrentFrame();
  const at = open + d;
  if (f < at) return null;
  const pt = shotPoint(899, 1599, OPEN_FX, OPEN_FY, openZoom(f, open, end), px, py);
  const p = interpolate(f, [at, at + 16], [0, 1], {...clamp, easing: ease.out});
  const o = interpolate(f, [end - 14, end], [1, 0], clamp);
  const ex = lx + (align === 'left' ? 30 : -30);
  const ey = ly + 34;
  const mx = ex + (pt.x - ex) * p;
  const my = ey + (pt.y - ey) * p;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <line x1={ex} y1={ey} x2={mx} y2={my} stroke={gold} strokeWidth={2.5} />
        <circle cx={pt.x} cy={pt.y} r={9 * p} fill={gold} />
        <circle cx={pt.x} cy={pt.y} r={9 + 18 * p} fill="none" stroke={gold} strokeWidth={1.5} opacity={1 - p * 0.6} />
      </svg>
      <div style={{position: 'absolute', left: align === 'left' ? lx : undefined, right: align === 'right' ? 1080 - lx : undefined, top: ly, padding: '14px 26px', borderRadius: 999, background: 'rgba(30,18,12,0.82)', border: `1.5px solid ${gold}`, color: CREAM, fontFamily: F.body, fontWeight: 500, fontSize: 32, whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
        {text}
      </div>
    </div>
  );
};

/** Gold leader-line labels naming each item visible in the real opened box. */
export const BoxLabels: React.FC<{open: number; end: number; gold?: string}> = ({open, end, gold = GOLD}) => (
  <>
    {LABELS.map((l, i) => (
      <Label key={i} {...l} open={open} end={end} gold={gold} />
    ))}
  </>
);

const RANGE_ITEMS: {k: 'tea' | 'granola' | 'chana' | 'seeds'; h?: number; w?: number; ax: number; ay: number; d: number}[] = [
  {k: 'tea', h: 400, ax: 230, ay: 760, d: 0},
  {k: 'granola', h: 420, ax: 840, ay: 760, d: 6},
  {k: 'chana', h: 520, ax: 250, ay: 1240, d: 12},
  {k: 'seeds', w: 520, ax: 810, ay: 1300, d: 18},
];

export const P07WellnessTreat: React.FC = () => {
  const f = useCurrentFrame();
  const rise = spr(f, RISE + 4, {damping: 22, stiffness: 50, mass: 1.4});
  const boxCy = interpolate(rise, [0, 1], [1500, 980]);
  const conv = prog(f, RANGE + 50, RANGE + 96, ease.inOut);
  const boxIn = spr(f, RANGE + 84, {damping: 14, stiffness: 120});
  const candle = interpolate(f, [SIL - 14, RISE - 20], [0.42, 1.0], {...clamp, easing: ease.inOut});

  return (
    <AbsoluteFill style={{background: '#070404'}}>
      <Music track="p07" duration={P07_DURATION} volume={0.55} />

      {/* A · gold line + raking light */}
      <Scene from={0} to={SIL + 2}>
        <Raking />
        <GoldLine />
        <Title text="A little something" at={40} out={SIL - 14} y={1390} size={76} weight={200} color={CREAM} />
        <Title text="for someone *special.*" at={62} out={SIL - 14} y={1480} size={76} weight={200} color={CREAM} accent={GOLD} />
      </Scene>

      {/* B · candle-lit silhouette */}
      <Scene from={SIL - 14} to={RISE + 6} fadeIn={16}>
        <Shot file="products/treat-scene-candle.jpg" iw={1024} ih={1536} fx={600} fy={[[SIL, 760], [RISE, 740]]} zoom={[[SIL, 1.4], [RISE, 1.12]]} filter={`brightness(${candle}) saturate(1.05)`} />
        <Grade warm={0.12} vignette={0.6} />
        <Particles kind="dust" at={SIL} dur={RISE - SIL + 6} n={40} seed={71} />
        <Title text="Thoughtful gifting." at={SIL + 14} out={SIL + 54} y={260} size={86} weight={200} color={CREAM} />
        <Title text={'Deliciously\n*different.*'} at={SIL + 60} out={RISE - 6} y={260} size={86} weight={200} color={CREAM} accent={GOLD} />
      </Scene>

      {/* C · the reveal on a glossy floor */}
      <Scene from={RISE} to={OPEN + 22}>
        <AbsoluteFill style={{background: `radial-gradient(900px 800px at 540px 900px, #5A3324 0%, ${CHOC} 55%, #120A07 100%)`}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 62.2%, rgba(0,0,0,0.65) 100%)'}} />
        <Particles kind="dust" at={RISE} dur={OPEN - RISE + 22} n={46} seed={72} />
        <Pack k="treat" cx={540} cy={boxCy} w={880} reflect={0.32 * rise} shadow={0.5} sheenAt={[RISE + 40, RISE + 100]} glow={`rgba(217,174,95,${0.22 * rise})`} />
        <Kicker text="Dietary Guide's" at={RISE + 30} out={OPEN - 6} y={300} color={GOLD} size={30} />
        <Title text="The Wellness Treat" at={RISE + 36} out={OPEN - 6} y={350} size={100} weight={300} color={CREAM} />
        <Title text="High Protein · Smart Nutrition · Energizing" at={RISE + 76} out={OPEN - 6} y={1560} size={38} weight={300} color={GOLD} font="'Poppins', sans-serif" tracking={0.03} stagger={2} />
      </Scene>

      {/* D · the real box, opened */}
      <Scene from={OPEN} to={RANGE + 6}>
        <Reveal at={OPEN} dur={24} from="top">
          <Shot file="products/treat-real-open.jpg" iw={899} ih={1599} fx={OPEN_FX} fy={OPEN_FY} zoom={[[OPEN, 1.24], [RANGE, 1.36]]} filter="brightness(1.03) saturate(1.05)" />
          <Grade warm={0.1} vignette={0.45} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,12,8,0.94) 0%, rgba(20,12,8,0.8) 15%, rgba(20,12,8,0) 27%, rgba(20,12,8,0) 80%, rgba(20,12,8,0.75) 100%)'}} />
        </Reveal>
        <Title text={'Curated *with care.*'} at={OPEN + 26} out={RANGE - 10} y={232} size={76} weight={300} color={CREAM} accent={GOLD} />
        <BoxLabels open={OPEN} end={RANGE} />
        <Title text="Shown: the actual box" at={OPEN + 120} out={RANGE - 10} y={1585} size={26} weight={400} color="rgba(245,234,217,0.7)" font="'Poppins', sans-serif" tracking={0.04} />
      </Scene>

      {/* E · the range converges into the box */}
      <Scene from={RANGE} to={HERO + 6}>
        <AbsoluteFill style={{background: `radial-gradient(900px 900px at 540px 1000px, #4A2A1E 0%, ${CHOC} 55%, #0F0806 100%)`}} />
        <Particles kind="dust" at={RANGE} dur={HERO - RANGE + 6} n={50} seed={73} />
        <Title text={'A curated collection of our\nfinest *functional snacks.*'} at={RANGE + 8} out={HERO - 8} y={250} size={60} weight={300} color={CREAM} accent={GOLD} lineHeight={1.2} stagger={2} />
        {RANGE_ITEMS.map((it, i) => {
          const s = spr(f, RANGE + 6 + it.d, {damping: 16, stiffness: 110});
          const x = interpolate(conv, [0, 1], [it.ax, 540]);
          const y = interpolate(conv, [0, 1], [it.ay, 1040]);
          const sc = interpolate(conv, [0, 1], [1, 0.25]);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, opacity: s * (1 - conv * 0.9), transform: `translateY(${(1 - s) * 200}px)`}}>
              <div style={{position: 'absolute', inset: 0, transformOrigin: `${x}px ${y}px`, transform: `scale(${sc})`}}>
                <Pack k={it.k} cx={x} cy={y + Math.sin((f + i * 20) / 30) * 8} h={it.h} w={it.w} shadow={0.4} rot={(i % 2 ? 1 : -1) * 4 * (1 - conv)} />
              </div>
            </div>
          );
        })}
        {f >= RANGE + 84 && <Pack k="treat" cx={540} cy={1040} w={interpolate(boxIn, [0, 1], [200, 820])} shadow={0.5} glow={`rgba(217,174,95,${0.3 * boxIn})`} sheenAt={[RANGE + 100]} />}
      </Scene>

      {/* F · gold hero frame */}
      <Scene from={HERO} to={P07_DURATION} fadeIn={14}>
        <Shot file="products/treat-scene-gold.jpg" iw={1024} ih={1536} fx={520} fy={[[HERO, 820], [P07_DURATION, 780]]} zoom={[[HERO, 1.3], [P07_DURATION, 1.12]]} filter="saturate(1.05)" />
        <Grade warm={0.14} vignette={0.5} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(30,18,12,0.8) 0%, rgba(30,18,12,0) 22%, rgba(30,18,12,0) 46%, rgba(30,18,12,0.88) 60%, rgba(30,18,12,0.92) 100%)'}} />
        <Particles kind="dust" at={HERO} dur={P07_DURATION - HERO} n={50} seed={74} />
        <div style={{position: 'absolute', left: 0, width: 1080, top: 250, display: 'flex', justifyContent: 'center', opacity: prog(f, HERO + 16, HERO + 40)}}>
          <Img src={src(LOGO_WHITE)} style={{width: 300, height: 144, filter: 'brightness(1.6)'}} />
        </div>
        <Title text={'Health, Happiness,\nand a *Little Surprise.*'} at={HERO + 30} y={1190} size={74} weight={300} color={CREAM} accent={GOLD} lineHeight={1.16} />
        <Title text="Meet The Wellness Treat by Dietary Guide." at={HERO + 60} y={1385} size={34} weight={400} color="rgba(245,234,217,0.85)" font="'Poppins', sans-serif" stagger={1} />
        <CTA at={HERO + 80} />
        <Ira x={905} y={1110} size={250} enter="pop" enterAt={HERO + 96} shadowColor="rgba(0,0,0,0.5)" />
      </Scene>

      <Cues
        cues={[
          [0, 'shimmer', 0.4],
          [22, 'whoosh', 0.2],
          [SIL, 'whoosh', 0.25],
          [SIL + 10, 'crackle', 0.15],
          [RISE - 30, 'riser', 0.25],
          [RISE + 4, 'impact', 0.4],
          [RISE + 40, 'shimmer', 0.35],
          [OPEN, 'lid', 0.6],
          ...LABELS.map((l) => [OPEN + l.d, 'tick', 0.3] as [number, 'tick', number]),
          [RANGE, 'whoosh', 0.3],
          [RANGE + 84, 'impact', 0.35],
          [RANGE + 100, 'shimmer', 0.3],
          [HERO, 'whoosh', 0.3],
          [HERO + 30, 'shimmer', 0.35],
          [HERO + 96, 'pop', 0.3],
        ]}
      />
    </AbsoluteFill>
  );
};

const CTA: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 15, stiffness: 140});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 1460, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s}}>
      <div style={{padding: '24px 56px', borderRadius: 999, background: `linear-gradient(90deg, #C99A4A, #F0D395, #C99A4A)`, color: '#2A1712', fontFamily: F.body, fontWeight: 600, fontSize: 38, transform: `scale(${0.75 + s * 0.25})`, boxShadow: '0 20px 40px rgba(0,0,0,0.35)'}}>Gift The Wellness Treat</div>
      <div style={{marginTop: 16, fontFamily: F.body, fontSize: 30, color: 'rgba(245,234,217,0.8)', letterSpacing: '0.02em'}}>{SHOP_URL}</div>
    </div>
  );
};
