import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {src} from '../assets';
import {Ira} from '../components/Ira';
import {Cues, Music} from '../components/Sound';
import {Reveal, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {Grade, Kicker, LOGO_WHITE, Pack, SHOP_URL, Shot, Title, rand} from '../products/kit';
import {BoxLabels, OPEN_FX, OPEN_FY} from '../products/P07WellnessTreat';
import {Diya, FEST, Firework, Petals, Rangoli, Toran} from './kit';

/**
 * DUSSEHRA · The Wellness Treat · "Is Dussehra, gift karo kuch alag."
 * HOOK: a match lights one diya in the dark -> DESIRE: a marigold toran drops,
 * a row of diyas lights, a rangoli is drawn on the floor -> REVEAL: the real
 * box rises onto the rangoli under falling petals -> REASON: the actual opened
 * box with every item labelled -> IRA presents it -> CTA: Gift The Wellness Treat.
 * Contents are only what the real photos show; no prices or offers.
 */
export const D02_DURATION = 750;
const LIGHT = 8;
const DESIRE = 80;
const REVEAL = 206;
const OPEN = 330;
const GIFT = 500;
const END = 620;

const ROW = [140, 340, 540, 740, 940];

/** Warm maroon backdrop with slow bokeh. */
const Backdrop: React.FC<{glow: number}> = ({glow}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: glow}}>
      <AbsoluteFill style={{background: `radial-gradient(1000px 1100px at 540px 1100px, #7A1A24 0%, ${FEST.maroon} 40%, ${FEST.deep} 85%)`}} />
      {Array.from({length: 18}).map((_, i) => {
        const r = (k: number) => rand(i * 23 + k);
        const d = 40 + r(1) * 110;
        const x = r(2) * 1080 + Math.sin(f / (60 + r(3) * 40) + i) * 20;
        const y = 300 + r(4) * 1300 - f * (0.1 + r(5) * 0.2);
        return <div key={i} style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,${170 + Math.floor(r(6) * 60)},90,0.35), rgba(255,170,90,0) 70%)`, opacity: 0.4 + 0.4 * Math.sin(f / 20 + i)}} />;
      })}
    </AbsoluteFill>
  );
};

const GoldCta: React.FC<{at: number; y: number}> = ({at, y}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 13, stiffness: 160});
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: s}}>
      <div style={{padding: '24px 56px', borderRadius: 999, background: 'linear-gradient(90deg, #C99A4A, #F0D395, #C99A4A)', color: '#2A1712', fontFamily: F.body, fontWeight: 600, fontSize: 40, transform: `scale(${0.75 + s * 0.25})`, boxShadow: '0 20px 40px rgba(0,0,0,0.35)'}}>Gift The Wellness Treat</div>
      <div style={{marginTop: 22, fontFamily: F.body, fontWeight: 400, fontSize: 30, color: 'rgba(255,243,222,0.8)', letterSpacing: '0.02em'}}>{SHOP_URL}</div>
    </div>
  );
};

export const D02Treat: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, LIGHT, 56], [0.3, 0.38, 1], {...clamp, easing: ease.inOut});
  // the first diya: big and centred, then it settles into the row
  const settle = prog(f, DESIRE - 6, DESIRE + 22, ease.inOut);
  const d0x = 540;
  const d0y = interpolate(settle, [0, 1], [1080, 1660]);
  const d0s = interpolate(settle, [0, 1], [320, 150]);
  const rise = spr(f, REVEAL + 4, {damping: 20, stiffness: 60, mass: 1.3});
  const toEnd = prog(f, END, END + 26, ease.inOut);
  const boxCy = interpolate(rise, [0, 1], [1500, 1090]) + interpolate(toEnd, [0, 1], [0, -330]);
  const boxW = interpolate(toEnd, [0, 1], [820, 600]);
  const showStage = f < OPEN + 24 || f >= GIFT - 10;

  return (
    <AbsoluteFill style={{background: '#050203'}}>
      <Music track="d02" duration={D02_DURATION} volume={0.6} />
      <Backdrop glow={glow} />

      {/* the festive stage: rangoli, diyas, box (hidden while the real photo is up) */}
      {showStage && (
        <>
          {f < END + 8 && (
            <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(f, END - 4, END + 8)}}>
              <Rangoli x={540} y={f < GIFT ? 1300 : 1330} r={430} at={DESIRE + 18} dur={80} />
            </div>
          )}
          {ROW.map((x, i) =>
            i === 2 ? null : (
              <div key={i} style={{position: 'absolute', inset: 0, opacity: prog(f, DESIRE - 4, DESIRE + 10)}}>
                <Diya x={x} y={1660} size={150} litAt={DESIRE + 12 + [0, 8, 0, 16, 24][i]} seed={i + 2} />
              </div>
            ),
          )}
          <Diya x={d0x} y={d0y} size={d0s} litAt={LIGHT} seed={1} />
          {f >= REVEAL && f < OPEN + 24 && (
            <Pack k="treat" cx={540} cy={boxCy} w={boxW} shadow={0.5} glow={`rgba(255,176,32,${0.35 * rise})`} sheenAt={[REVEAL + 50]} style={{opacity: rise}} />
          )}
        </>
      )}

      {/* HOOK */}
      <Title text="Is Dussehra," at={34} out={DESIRE - 4} y={320} size={84} weight={300} color={FEST.cream} />
      <Title text={'gift karo\n*kuch alag.*'} at={44} out={DESIRE - 4} y={420} size={110} weight={700} color={FEST.cream} accent={FEST.marigold} lineHeight={1.05} tracking={-0.03} />

      {/* DESIRE */}
      <Title text="Mithai ke saath," at={DESIRE + 22} out={REVEAL - 8} y={330} size={84} weight={300} color={FEST.cream} />
      <Title text={'thoda *care*\nbhi.'} at={DESIRE + 34} out={REVEAL - 8} y={430} size={110} weight={700} color={FEST.cream} accent={FEST.marigold} lineHeight={1.05} tracking={-0.03} />

      {/* REVEAL */}
      <Petals at={REVEAL} n={46} seed={12} dur={OPEN - REVEAL + 24} />
      <Kicker text="Dietary Guide's" at={REVEAL + 30} out={OPEN - 8} y={300} color={FEST.marigold} size={30} />
      <Title text="The Wellness Treat" at={REVEAL + 36} out={OPEN - 8} y={350} size={100} weight={300} color={FEST.cream} />
      <Title text="High Protein · Smart Nutrition · Energizing" at={REVEAL + 70} out={OPEN - 8} y={1480} size={36} weight={400} color={FEST.gold} font="'Poppins', sans-serif" tracking={0.03} stagger={2} shadow="0 2px 12px rgba(0,0,0,0.6)" />

      {/* REASON: the actual box, opened */}
      <Scene from={OPEN} to={GIFT + 6}>
        <Reveal at={OPEN} dur={24} from="top">
          <Shot file="products/treat-real-open.jpg" iw={899} ih={1599} fx={OPEN_FX} fy={OPEN_FY} zoom={[[OPEN, 1.24], [GIFT, 1.36]]} filter="brightness(1.03) saturate(1.08)" />
          <Grade warm={0.16} vignette={0.45} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(42,7,16,0.97) 0%, rgba(42,7,16,0.93) 21%, rgba(42,7,16,0) 31%, rgba(42,7,16,0) 80%, rgba(42,7,16,0.8) 100%)'}} />
        </Reveal>
        <Title text={'Andar? *Pyaar,*\nsnack-size mein.'} at={OPEN + 22} out={GIFT - 10} y={238} size={60} weight={300} color={FEST.cream} accent={FEST.marigold} lineHeight={1.12} />
        <BoxLabels open={OPEN} end={GIFT} gold={FEST.marigold} />
        <Title text="Shown: the actual box" at={OPEN + 120} out={GIFT - 10} y={1585} size={26} weight={400} color="rgba(255,243,222,0.7)" font="'Poppins', sans-serif" tracking={0.04} />
      </Scene>

      {/* GIFT: IRA presents it */}
      <Scene from={GIFT - 6} to={END + 10} fadeIn={12}>
        <Petals at={GIFT} n={30} seed={13} dur={END - GIFT + 10} />
        <Ira x={540} y={1520} size={760} enter="rise" enterAt={GIFT + 2} emote="present" shadowColor="rgba(0,0,0,0.5)" />
        <Title text="Apno ke liye," at={GIFT + 16} out={END - 4} y={300} size={84} weight={300} color={FEST.cream} />
        <Title text="*is Dussehra.*" at={GIFT + 26} out={END - 4} y={400} size={110} weight={700} color={FEST.cream} accent={FEST.marigold} tracking={-0.03} />
      </Scene>
      <Firework at={GIFT + 30} x={200} y={620} r={180} seed={21} />
      <Firework at={GIFT + 50} x={880} y={560} r={200} color="#7FE0FF" color2="#FFD24A" seed={22} />

      {/* END */}
      <Scene from={END} to={D02_DURATION} fadeIn={14}>
        <Firework at={END + 10} x={230} y={560} r={220} seed={23} launch={false} />
        <Firework at={END + 30} x={860} y={520} r={240} color="#FF7AB6" color2="#FFD24A" seed={24} launch={false} />
        <div style={{position: 'absolute', left: 0, width: 1080, top: 290, display: 'flex', justifyContent: 'center', opacity: prog(f, END + 10, END + 30)}}>
          <Img src={src(LOGO_WHITE)} style={{width: 277, height: 133, filter: 'brightness(1.6)'}} />
        </div>
        <Pack k="treat" cx={540} cy={760} w={600} shadow={0.5} glow="rgba(255,176,32,0.35)" sheenAt={[END + 40]} style={{opacity: prog(f, END + 4, END + 20), transform: `translateY(${(1 - spr(f, END + 4, {damping: 18, stiffness: 90})) * 80}px)`}} />
        {f >= END + 26 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 1050, textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 60, color: FEST.marigold, opacity: prog(f, END + 26, END + 40), transform: `translateY(${(1 - prog(f, END + 26, END + 42)) * 24}px)`}}>
            शुभ विजयादशमी
          </div>
        )}
        <Title text="Health, Happiness, and a *Little Surprise.*" at={END + 36} y={1150} size={36} weight={400} color={FEST.cream} accent={FEST.marigold} font="'Poppins', sans-serif" stagger={1} />
        <GoldCta at={END + 50} y={1250} />
        <Ira x={900} y={1590} size={300} enter="pop" enterAt={END + 60} emote="present" hops={[END + 92]} shadowColor="rgba(0,0,0,0.45)" />
      </Scene>

      {/* the toran stays up from the moment it drops */}
      <Toran at={DESIRE + 4} />

      <Cues
        cues={[
          [2, 'match', 0.6],
          [LIGHT, 'fire', 0.18],
          [34, 'shimmer', 0.3],
          [DESIRE + 4, 'whoosh', 0.35],
          [DESIRE + 12, 'match', 0.3],
          [DESIRE + 20, 'match', 0.25],
          [DESIRE + 28, 'match', 0.25],
          [DESIRE + 18, 'sparkle', 0.3],
          [REVEAL + 4, 'impact', 0.4],
          [REVEAL + 50, 'shimmer', 0.35],
          [OPEN, 'lid', 0.6],
          [OPEN + 44, 'tick', 0.3],
          [OPEN + 60, 'tick', 0.3],
          [OPEN + 76, 'tick', 0.3],
          [OPEN + 92, 'tick', 0.3],
          [OPEN + 110, 'tick', 0.3],
          [GIFT, 'whoosh', 0.35],
          [GIFT + 2, 'pop', 0.35],
          [GIFT + 30, 'firework', 0.3],
          [GIFT + 50, 'firework', 0.3],
          [END, 'whoosh', 0.3],
          [END + 10, 'firework', 0.3],
          [END + 30, 'firework', 0.3],
          [END + 40, 'shimmer', 0.3],
          [END + 60, 'pop', 0.35],
        ]}
      />
    </AbsoluteFill>
  );
};
