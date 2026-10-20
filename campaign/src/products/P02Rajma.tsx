import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cues, Music} from '../components/Sound';
import {Grain, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {Chips, EndBlock, Field, Grade, Kicker, Pack, Particles, Shot, Title} from './kit';

/**
 * PRODUCT 02 · Roasted Rajma Jor Masala · "Rajma, ab snack bhi"
 * HOOK: a typographic food-flip (Rajma ~~chawal~~ crunch.) -> DESIRE: ember
 * close-ups, one word per beat -> real rajma in the real jar -> REVEAL: the jar
 * rises slowly through embers and under-light -> REASON: roasted not fried,
 * pack chips -> BRAND/CTA. Plum + ember; slow, heavy, warm.
 */
export const P02_DURATION = 540;
const EMBER = '#FF8A3D';
const PLUM = '#24090F';
const CREAM = '#F6E7D2';
const REVEAL = 176;
const REASON = 330;
const END = 430;

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [16, 26], [0, 1], {...clamp, easing: ease.inOut});
  const drop = interpolate(f, [26, 40], [0, 1], {...clamp, easing: ease.in});
  const pop = spr(f, 30, {damping: 10, stiffness: 200});
  const out = interpolate(f, [44, 50], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: out}}>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 560, textAlign: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 200, color: CREAM, letterSpacing: '-0.05em', opacity: interpolate(f, [0, 3], [0, 1], clamp)}}>Rajma</div>
      <div style={{position: 'absolute', left: 0, width: 1080, top: 800, textAlign: 'center', opacity: interpolate(f, [6, 10], [0, 1], clamp) * (1 - drop * 0.75), transform: `translateY(${drop * 60}px) rotate(${drop * -4}deg)`}}>
        <span style={{position: 'relative', display: 'inline-block', fontFamily: F.display, fontWeight: 300, fontSize: 150, color: 'rgba(246,231,210,0.85)', letterSpacing: '-0.03em'}}>
          chawal
          <span style={{position: 'absolute', left: -10, top: '52%', height: 12, borderRadius: 6, width: `${strike * 105}%`, background: EMBER, boxShadow: `0 0 24px ${EMBER}, 0 0 60px ${EMBER}`}} />
        </span>
      </div>
      {f >= 30 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 1020, textAlign: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 180, color: EMBER, letterSpacing: '-0.05em', transform: `scale(${0.5 + pop * 0.5})`, textShadow: `0 0 40px rgba(255,138,61,0.5)`}}>crunch.</div>
      )}
    </div>
  );
};

export const P02Rajma: React.FC = () => {
  const f = useCurrentFrame();
  const rise = spr(f, REVEAL, {damping: 22, stiffness: 50, mass: 1.4});
  const endP = prog(f, END, END + 26, ease.inOut);
  const jarH = interpolate(endP, [0, 1], [1000, 700]);
  const jarCy = interpolate(rise, [0, 1], [1700, 1000]) + interpolate(endP, [0, 1], [0, -230]);
  const lift = Math.sin((f - REVEAL) / 45) * 6;

  return (
    <AbsoluteFill style={{background: PLUM}}>
      <Music track="p02" duration={P02_DURATION} volume={0.55} />

      {/* HOOK */}
      <Scene from={0} to={52}>
        <Field bg={`radial-gradient(900px 900px at 540px 1300px, rgba(255,138,61,0.22), rgba(0,0,0,0) 70%), ${PLUM}`} />
        <Particles kind="embers" at={-30} dur={90} n={44} x={540} y={1950} seed={21} />
        <Hook />
      </Scene>

      {/* DESIRE: ember close-ups, one word per beat */}
      <Scene from={48} to={132}>
        <Shot file="products/rajma-scene-ember.jpg" iw={1024} ih={1024} fx={[[48, 560], [132, 520]]} fy={[[48, 560], [132, 500]]} zoom={[[48, 1.75], [132, 1.3]]} />
        <Grade warm={0.12} vignette={0.6} tint="255,120,60" />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(36,9,15,0.85) 0%, rgba(36,9,15,0) 36%)'}} />
        <Title text="Roasted." at={54} out={74} y={1380} size={130} weight={700} color={CREAM} stagger={0} />
        <Title text="Crunchy." at={80} out={98} y={1380} size={130} weight={700} color={CREAM} stagger={0} />
        <Title text="*Chatpata.*" at={104} out={124} y={1380} size={130} weight={300} accent={EMBER} stagger={0} />
      </Scene>

      {/* the real thing: roasted rajma in the real jar */}
      <Scene from={128} to={REVEAL + 4}>
        <Shot file="products/jars-real-pair.jpg" iw={1200} ih={1600} fx={[[128, 820], [REVEAL, 800]]} fy={[[128, 560], [REVEAL, 620]]} zoom={[[128, 2.1], [REVEAL, 1.75]]} filter="saturate(1.1)" />
        <Grade warm={0.1} vignette={0.6} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(36,9,15,0.85) 0%, rgba(36,9,15,0) 32%)'}} />
        <Title text={'Asli rajma,\n*roasted.*'} at={132} out={166} y={250} size={96} weight={300} color={CREAM} accent={EMBER} />
      </Scene>

      {/* REVEAL -> REASON -> END */}
      <Scene from={REVEAL} to={P02_DURATION}>
        <Field bg={`radial-gradient(1000px 900px at 540px 1950px, rgba(255,138,61,${0.45 * rise}), rgba(0,0,0,0) 70%), radial-gradient(700px 900px at 540px 900px, rgba(120,30,40,0.55), rgba(0,0,0,0) 70%), ${PLUM}`} />
        <Particles kind="embers" at={REVEAL - 20} dur={P02_DURATION - REVEAL + 20} n={60} x={540} y={2000} spread={1.1} seed={22} />
        <Pack k="rajma" cx={540} cy={jarCy + lift} h={jarH} rot={interpolate(rise, [0, 1], [5, 0])} sheenAt={[REVEAL + 60, END + 40]} shadow={0.5} glow={`rgba(255,138,61,${0.18 * rise})`} />
        <Kicker text="Roasted" at={REVEAL + 30} out={REASON - 8} y={252} color={EMBER} size={34} />
        <Title text="Rajma Jor Masala" at={REVEAL + 36} out={REASON - 8} y={300} size={96} weight={700} color={CREAM} tracking={-0.03} />
        <Title text={'Roasted,\n*not fried.*'} at={REASON} out={END - 6} y={250} size={110} weight={300} color={CREAM} accent={EMBER} />
        <Chips items={['100% Roasted', 'Vegan', 'Clean Label', 'Net weight 125g']} at={REASON + 22} out={END - 4} y={1540} accent={EMBER} />
        <Title text={'Rajma, ab\n*snack* bhi.'} at={END + 16} y={232} size={88} weight={300} color={CREAM} accent={EMBER} />
        <EndBlock at={END + 34} y={1180} product="Roasted Rajma Jor Masala" line="Net weight 125g" />
      </Scene>

      <Grain opacity={0.055} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.6],
          [6, 'swish', 0.3],
          [16, 'whoosh', 0.35],
          [30, 'crunch', 0.8],
          [30, 'impact', 0.5],
          [10, 'crackle', 0.35],
          [48, 'whoosh', 0.3],
          [54, 'tick', 0.35],
          [80, 'tick', 0.35],
          [104, 'crunch', 0.5],
          [128, 'swish', 0.3],
          [REVEAL - 30, 'riser', 0.3],
          [REVEAL, 'impact', 0.55],
          [REVEAL + 4, 'crackle', 0.4],
          [REVEAL + 60, 'shimmer', 0.3],
          [REASON, 'whoosh', 0.3],
          [END, 'whoosh', 0.3],
          [END + 34, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};
