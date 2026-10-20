import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cues, Music} from '../components/Sound';
import {Grain, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {EndBlock, Kicker, Pack, Particles, Shot, Title} from './kit';

/**
 * PRODUCT 05 · Almond Protein Bar · "Almonds, front and centre."
 * HOOK: a spotlight finds almonds in darkness -> DESIRE: floating macro lenses
 * (almonds, the bar, the wrapper) drift in depth -> REVEAL: the real carton
 * rises from behind a glossy black horizon, with reflection -> REASON: 10g
 * plant protein in a 40g bar, no added sugar, vegan, clean label (pack) ->
 * BRAND/CTA. Slow, luxurious, jewellery-commercial lighting.
 */
export const P05_DURATION = 540;
const NOIR = '#0E0907';
const CREAM = '#F3E6D3';
const RED = '#E0532F'; // the pack's red-orange stripe
const REVEAL = 150;
const STAT = 300;
const END = 420;
const HORIZON = 1130;

const Spotlight: React.FC = () => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 34], [0, 640], {...clamp, easing: ease.out});
  const out = interpolate(f, [44, 56], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', inset: 0, WebkitMaskImage: `radial-gradient(circle ${r}px at 540px 820px, black 55%, transparent 100%)`, maskImage: `radial-gradient(circle ${r}px at 540px 820px, black 55%, transparent 100%)`}}>
        <Shot file="products/bars-scene.jpg" iw={934} ih={607} fx={[[0, 830], [56, 810]]} fy={[[0, 400], [56, 390]]} zoom={[[0, 3.6], [56, 3.1]]} filter="saturate(1.1) contrast(1.06)" />
      </div>
    </AbsoluteFill>
  );
};

const Lens: React.FC<{at: number; x: number; y: number; d: number; depth: number; fx: number; fy: number; zoom: number}> = ({at, x, y, d, depth, fx, fy, zoom}) => {
  const f = useCurrentFrame();
  const s = spr(f, at, {damping: 18, stiffness: 70});
  const drift = (f - at) * (0.6 + depth * 0.8);
  const o = interpolate(f, [REVEAL - 14, REVEAL], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2 - drift, width: d, height: d, borderRadius: '50%', overflow: 'hidden', opacity: s * o, transform: `scale(${0.7 + s * 0.3})`, filter: `blur(${(1 - depth) * 3}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,240,220,0.18)'}}>
      <Shot file="products/bars-scene.jpg" iw={934} ih={607} fx={fx} fy={fy} zoom={zoom} w={d} h={d} />
    </div>
  );
};

export const P05Almond: React.FC = () => {
  const f = useCurrentFrame();
  const rise = spr(f, REVEAL + 6, {damping: 24, stiffness: 45, mass: 1.5});
  const toStat = prog(f, STAT - 10, STAT + 16, ease.inOut);
  const toEnd = prog(f, END, END + 24, ease.inOut);
  const w = interpolate(toStat, [0, 1], [940, 760]) + interpolate(toEnd, [0, 1], [0, 60]);
  const cy = HORIZON - 190 + interpolate(rise, [0, 1], [420, 0]) + interpolate(toStat, [0, 1], [0, 100]) + interpolate(toEnd, [0, 1], [0, -200]);
  const push = 1 + (f - REVEAL) * 0.0002;
  const big = Math.round(interpolate(f, [STAT + 6, STAT + 34], [0, 10], {...clamp, easing: ease.out}));

  return (
    <AbsoluteFill style={{background: NOIR}}>
      <Music track="p05" duration={P05_DURATION} volume={0.55} />

      <Scene from={0} to={58}>
        <Spotlight />
        <Title text="Real almonds." at={18} out={46} y={1380} size={112} weight={200} color={CREAM} tracking={-0.02} />
      </Scene>

      <Scene from={48} to={REVEAL + 2}>
        <AbsoluteFill style={{background: `radial-gradient(900px 1200px at 540px 900px, #2A1A12, ${NOIR})`}} />
        <Lens at={52} x={330} y={760} d={520} depth={1} fx={830} fy={400} zoom={2.8} />
        <Lens at={62} x={790} y={1060} d={420} depth={0.75} fx={240} fy={370} zoom={3.0} />
        <Lens at={72} x={420} y={1360} d={340} depth={0.5} fx={470} fy={250} zoom={2.2} />
        <Title text={'Almonds, front\nand *centre.*'} at={60} out={REVEAL - 12} y={250} size={92} weight={200} color={CREAM} accent={RED} />
      </Scene>

      {/* REVEAL on glossy black */}
      <Scene from={REVEAL} to={P05_DURATION}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, #1A110C 0%, #120B08 ${(HORIZON / 1920) * 100}%, #070404 ${(HORIZON / 1920) * 100 + 0.2}%, #0B0706 100%)`}} />
        <AbsoluteFill style={{background: `radial-gradient(700px 300px at 540px ${HORIZON}px, rgba(224,83,47,0.28), rgba(0,0,0,0) 70%)`}} />
        <Particles kind="dust" at={REVEAL} dur={P05_DURATION - REVEAL} n={34} seed={51} colors={['#E8C9A0', '#F3E6D3', '#C9A27A']} />
        <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: `540px ${HORIZON}px`}}>
          {/* clip so the carton rises from behind the horizon */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: HORIZON + 4, overflow: 'hidden'}}>
            <Pack k="almond" cx={540} cy={cy} w={w} sheenAt={[REVEAL + 70, STAT + 40, END + 40]} shadow={0} />
          </div>
          {/* reflection */}
          <div style={{position: 'absolute', left: 0, top: HORIZON + 4, width: 1080, height: 700, overflow: 'hidden', opacity: 0.28 * rise * (1 - toEnd)}}>
            <div style={{position: 'absolute', inset: 0, transform: `scaleY(-1)`, transformOrigin: `540px 0px`}}>
              <Pack k="almond" cx={540} cy={cy - HORIZON + 4} w={w} shadow={0} />
            </div>
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,7,6,0) 0%, #0B0706 55%)'}} />
          </div>
        </div>
        <Kicker text="10g plant protein" at={REVEAL + 40} out={STAT - 10} y={262} color={RED} size={32} />
        <Title text="Almond Protein Bar" at={REVEAL + 46} out={STAT - 10} y={310} size={90} weight={300} color={CREAM} />

        {/* REASON: thin numerals */}
        {f >= STAT && f < END + 8 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 200, textAlign: 'center', opacity: prog(f, STAT, STAT + 14) * (1 - prog(f, END - 6, END + 6))}}>
            <div style={{fontFamily: F.display, fontWeight: 200, fontSize: 300, color: CREAM, letterSpacing: '-0.06em', lineHeight: 1}}>
              {big}
              <span style={{fontSize: 150}}>g</span>
            </div>
            <div style={{fontFamily: F.display, fontWeight: 300, fontSize: 56, color: CREAM, marginTop: -6}}>plant protein</div>
            <div style={{fontFamily: F.body, fontWeight: 400, fontSize: 32, color: 'rgba(243,230,211,0.7)', marginTop: 10, letterSpacing: '0.04em'}}>in every 40g bar</div>
          </div>
        )}
        <Title text="No added sugar · Vegan · Clean label" at={STAT + 40} out={END - 6} y={1560} size={40} weight={300} color={CREAM} font="'Poppins', sans-serif" tracking={0.01} stagger={2} />

        {/* END */}
        <Title text={'Almonds, front\nand *centre.*'} at={END + 14} y={232} size={84} weight={200} color={CREAM} accent={RED} />
        <EndBlock at={END + 30} y={1200} product="Almond Protein Bar" line="10g plant protein · Net weight 40g" />
      </Scene>

      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          [0, 'shimmer', 0.35],
          [2, 'impact', 0.3],
          [48, 'whoosh', 0.3],
          [52, 'pop', 0.2],
          [62, 'pop', 0.2],
          [72, 'pop', 0.2],
          [REVEAL - 26, 'riser', 0.25],
          [REVEAL + 6, 'lid', 0.35],
          [REVEAL + 70, 'shimmer', 0.3],
          [STAT, 'whoosh', 0.3],
          [STAT + 34, 'chime', 0.3],
          [END, 'whoosh', 0.3],
          [END + 30, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};

