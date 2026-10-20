import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Ira} from '../components/Ira';
import {Cues, Music} from '../components/Sound';
import {Flash, Grain, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {Chips, EndBlock, Field, Grade, Kicker, Pack, Particles, Shot, Title} from './kit';

/**
 * PRODUCT 01 · Roasted Chana Jor Masala · "Chai-time crunch"
 * HOOK: real macro of the roasted chana + "CRUNCH." -> DESIRE: 6 PM, chai,
 * a chatpata craving (beat cuts) -> REVEAL: the real jar spins in through a
 * crumb burst -> REASON: 100% Roasted, Vegan, Clean Label, 140g (pack) ->
 * BRAND/CTA. Pack orange leads; energetic, beat-cut pacing.
 */
export const P01_DURATION = 540;
const ORANGE = '#F07A2A';
const ESPRESSO = '#1B0F0A';
const REVEAL = 155;
const REASON = 300;
const END = 404;

const Crunch: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 5], [1.18, 1], {...clamp, easing: ease.out});
  const shake = f < 10 ? Math.sin(f * 2.4) * (10 - f) * 1.4 : 0;
  const o = interpolate(f, [26, 32], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 760, textAlign: 'center', fontFamily: F.display, fontWeight: 800, fontSize: 172, letterSpacing: '-0.05em', color: ORANGE, transform: `translateX(${shake}px) scale(${s})`, opacity: o, textShadow: '0 20px 60px rgba(0,0,0,0.6)'}}>
      CRUNCH.
    </div>
  );
};

export const P01Chana: React.FC = () => {
  const f = useCurrentFrame();
  const inS = spr(f, REVEAL, {damping: 13, stiffness: 90});
  const toSide = prog(f, REASON, REASON + 22, ease.inOut);
  const toEnd = prog(f, END, END + 24, ease.inOut);
  const jarCx = interpolate(toSide, [0, 1], [540, 320]) + interpolate(toEnd, [0, 1], [0, 220]);
  const jarH = interpolate(toSide, [0, 1], [1060, 880]) + interpolate(toEnd, [0, 1], [0, -230]);
  const jarCy = interpolate(toSide, [0, 1], [1000, 1010]) + interpolate(toEnd, [0, 1], [0, -230]);
  const pct = Math.round(interpolate(f, [REASON + 12, REASON + 40], [0, 100], {...clamp, easing: ease.out}));

  return (
    <AbsoluteFill style={{background: ESPRESSO}}>
      <Music track="p01" duration={P01_DURATION} volume={0.55} />

      {/* HOOK: the real thing, up close */}
      <Scene from={0} to={32}>
        <Shot file="products/chana-scene-magnifier.jpg" iw={1024} ih={1024} fx={[[0, 730], [32, 700]]} fy={[[0, 470], [32, 450]]} zoom={[[0, 2.25], [32, 1.95]]} filter="saturate(1.1) contrast(1.05)" />
        <Grade warm={0.12} vignette={0.6} />
        <Particles kind="crumbs" at={1} dur={40} n={46} x={540} y={940} spread={1.2} seed={3} />
        <Crunch />
      </Scene>

      {/* DESIRE: 6 PM, chai, a craving */}
      <Scene from={30} to={74}>
        <Shot file="products/chana-scene-dark.jpg" iw={1024} ih={1536} fx={350} fy={[[30, 600], [74, 680]]} zoom={[[30, 1.12], [74, 1.24]]} />
        <Grade warm={0.1} vignette={0.55} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.8) 0%, rgba(20,10,5,0) 34%)'}} />
        <Title text={'Shaam ke\n*6 baje.*'} at={33} out={66} y={250} size={104} weight={300} accent={ORANGE} />
      </Scene>
      <Scene from={72} to={116}>
        <Shot file="products/chana-scene-desk.jpg" iw={1536} ih={1024} fx={[[72, 560], [116, 610]]} fy={500} zoom={[[72, 1.02], [116, 1.12]]} />
        <Grade warm={0.08} vignette={0.5} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(20,10,5,0.85) 0%, rgba(20,10,5,0) 38%)'}} />
        <Title text={'Chai ke saath,\n*kuch chatpata?*'} at={75} out={108} y={1360} size={92} weight={300} accent={ORANGE} />
      </Scene>
      <Scene from={114} to={REVEAL + 2}>
        <Shot file="products/chana-real-stand.jpg" iw={1200} ih={1600} fx={600} fy={[[114, 760], [REVEAL, 700]]} zoom={[[114, 1.05], [REVEAL, 1.3]]} />
        <Grade warm={0.1} vignette={0.5} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.8) 0%, rgba(20,10,5,0) 30%)'}} />
        <Title text={'Asli *roasted*\nchana.'} at={117} out={146} y={250} size={92} weight={300} accent={ORANGE} />
      </Scene>
      <Flash at={REVEAL - 2} dur={10} color="#FFE2C4" peak={0.9} />

      {/* REVEAL + REASON + END on the hero set */}
      <Scene from={REVEAL} to={P01_DURATION}>
        <Field bg={`radial-gradient(900px 1100px at ${jarCx}px 1000px, rgba(240,122,42,0.45) 0%, rgba(240,122,42,0) 60%), radial-gradient(1400px 900px at 540px 1900px, rgba(217,154,43,0.25), rgba(0,0,0,0) 70%), ${ESPRESSO}`} />
        <Particles kind="dust" at={REVEAL} dur={P01_DURATION - REVEAL} n={40} seed={9} colors={['#F4B46B', '#FFD9A8', '#D99A2B']} />
        <Particles kind="crumbs" at={REVEAL + 14} dur={46} n={60} x={540} y={980} spread={1.4} seed={5} />
        <Pack
          k="chana"
          cx={jarCx}
          cy={jarCy + interpolate(inS, [0, 1], [1300, 0])}
          h={jarH}
          rot={interpolate(inS, [0, 1], [-16, 0]) + Math.sin((f - REVEAL) / 40) * 0.8}
          sheenAt={[REVEAL + 40, REASON + 30, END + 40]}
          shadow={0.55}
          glow="rgba(240,122,42,0.25)"
        />
        <Kicker text="Roasted" at={REVEAL + 18} out={REASON - 8} y={252} color={ORANGE} size={34} />
        <Title text="Chana Jor Masala" at={REVEAL + 22} out={REASON - 8} y={300} size={96} weight={700} tracking={-0.03} />
        <Chips items={['100% Roasted', 'Vegan', 'Clean Label']} at={REVEAL + 70} out={REASON - 6} y={1556} accent={ORANGE} />

        {/* REASON */}
        {f >= REASON && f < END + 10 && (
          <div style={{position: 'absolute', left: 560, top: 560, width: 480, opacity: interpolate(f, [END - 4, END + 8], [1, 0], clamp)}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 168, color: ORANGE, letterSpacing: '-0.05em', lineHeight: 1, opacity: prog(f, REASON + 8, REASON + 20)}}>{pct}%</div>
            <Title text="ROASTED" at={REASON + 20} x={0} width={480} y={190} size={66} weight={600} align="left" tracking={0.04} />
            <Title text="not fried." at={REASON + 34} x={0} width={480} y={280} size={66} weight={300} align="left" color="rgba(250,248,245,0.8)" />
          </div>
        )}
        <Chips items={['Vegan', 'Clean Label', 'Net weight 140g']} at={REASON + 48} out={END - 4} y={1060} x={590} vertical accent={ORANGE} size={36} />

        {/* END */}
        <Title text={'Chai ka *chatpata*\npartner.'} at={END + 14} y={232} size={84} weight={300} accent={ORANGE} />
        <EndBlock at={END + 36} y={1180} product="Roasted Chana Jor Masala" line="Net weight 140g" />
        <Ira x={845} y={1095} size={300} enter="pop" enterAt={END + 50} hops={[END + 90]} tilt={[[END + 50, 0], [END + 70, -6]]} shadowColor="rgba(0,0,0,0.5)" />
      </Scene>

      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          [0, 'crunch', 0.9],
          [0, 'impact', 0.5],
          [7, 'crunch', 0.6],
          [30, 'swish', 0.35],
          [72, 'swish', 0.35],
          [114, 'whoosh', 0.35],
          [REVEAL - 2, 'impact', 0.6],
          [REVEAL + 14, 'crunch', 0.8],
          [REVEAL + 18, 'crunch', 0.5],
          [REVEAL + 40, 'shimmer', 0.3],
          [REASON, 'whoosh', 0.35],
          [REASON + 12, 'riser', 0.25],
          [REASON + 40, 'pop', 0.35],
          [END, 'whoosh', 0.35],
          [END + 50, 'pop', 0.4],
          [END + 36, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};

