import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cues, Music} from '../components/Sound';
import {Grain, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {EndBlock, Kicker, Pack, Particles, Shot, Steam, Title, rand} from './kit';

/**
 * PRODUCT 06 · Digestion Tea · "The perfect post-meal ritual"
 * HOOK: a flickering storm of the day (meetings, deadlines, a heavy dinner)
 * -> it freezes and dissolves into calm -> DESIRE: a slow, steam-lit tea
 * moment -> REVEAL: the real carton glides in -> REASON: 7 tea bags, "Light
 * and gentle on the system" (printed on the pack) -> BRAND/CTA.
 * Positioned as a ritual, never a remedy (no medical claims).
 */
export const P06_DURATION = 600;
const INK = '#0C1214';
const CALM = '#F3EFE6';
const SAGE = '#5E7B52';
const DEEP = '#2F4A2C';
const CALM_AT = 52;
const REVEAL = 160;
const REASON = 330;
const END = 466;

const WORDS = ['Meetings.', 'Deadlines.', 'Traffic.', 'Notifications.', 'Heavy dinner.', 'Late night.', 'Emails.', 'Rush.'];

const Storm: React.FC = () => {
  const f = useCurrentFrame();
  const freeze = Math.min(f, 40);
  const blur = interpolate(f, [40, CALM_AT], [0, 30], clamp);
  const o = interpolate(f, [42, CALM_AT], [1, 0], clamp);
  return (
    <AbsoluteFill style={{filter: `blur(${blur}px)`, opacity: o}}>
      {Array.from({length: 9}).map((_, slot) => {
        const k = Math.floor((freeze + slot * 3) / 5);
        const r = (n: number) => rand(k * 97 + slot * 13 + n);
        const word = WORDS[Math.floor(r(1) * WORDS.length)];
        const size = 60 + r(2) * 120;
        return (
          <div key={slot} style={{position: 'absolute', left: 40 + r(3) * 640, top: 260 + slot * 150 + (r(4) - 0.5) * 60, fontFamily: F.display, fontWeight: r(5) > 0.5 ? 800 : 300, fontSize: size, color: slot % 4 === 0 ? '#D99A2B' : `rgba(255,255,255,${0.5 + r(6) * 0.5})`, letterSpacing: '-0.04em', transform: `rotate(${(r(7) - 0.5) * 8}deg)`, whiteSpace: 'nowrap'}}>
            {word}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const P06Tea: React.FC = () => {
  const f = useCurrentFrame();
  const calm = prog(f, 40, CALM_AT + 10, ease.inOut);
  const glide = spr(f, REVEAL + 4, {damping: 22, stiffness: 60});
  const toEnd = prog(f, END, END + 24, ease.inOut);
  const packH = interpolate(toEnd, [0, 1], [920, 640]);
  const packCy = interpolate(toEnd, [0, 1], [1010, 760]) + interpolate(glide, [0, 1], [80, 0]);
  const packCx = interpolate(glide, [0, 1], [700, 540]);
  const seven = interpolate(f, [REASON + 6, REASON + 26], [0, 1], {...clamp, easing: ease.out});

  return (
    <AbsoluteFill style={{background: INK}}>
      <Music track="p06" duration={P06_DURATION} volume={0.55} />

      {/* calm field fades up as the storm dissolves */}
      <AbsoluteFill style={{opacity: calm, background: `radial-gradient(1000px 1100px at 540px 820px, #FFFDF8, ${CALM} 55%, #E4EBDD 100%)`}} />

      <Scene from={0} to={CALM_AT + 4}>
        <Storm />
      </Scene>

      {/* DESIRE: slow down */}
      <Scene from={CALM_AT} to={REVEAL + 6}>
        <Title text={'Ab...\n*dheere.*'} at={CALM_AT + 8} out={REVEAL - 6} y={250} size={130} weight={200} color={DEEP} accent={SAGE} />
        <div style={{position: 'absolute', left: 540 - 280, top: 760, width: 560, height: 840, borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 80px rgba(47,74,44,0.22)', opacity: prog(f, CALM_AT + 20, CALM_AT + 40) * (1 - prog(f, REVEAL - 8, REVEAL + 4)), transform: `translateY(${(1 - prog(f, CALM_AT + 20, CALM_AT + 50)) * 60}px)`}}>
          <Shot file="products/tea-scene.jpg" iw={410} ih={615} fx={[[CALM_AT, 200], [REVEAL, 190]]} fy={[[CALM_AT, 330], [REVEAL, 300]]} zoom={[[CALM_AT, 1.0], [REVEAL, 1.12]]} w={560} h={840} />
        </div>
        <Steam x={540} y={800} at={CALM_AT + 30} w={420} h={520} opacity={0.55} />
      </Scene>

      {/* REVEAL */}
      <Scene from={REVEAL} to={P06_DURATION}>
        <Particles kind="dust" at={REVEAL} dur={P06_DURATION - REVEAL} n={26} seed={61} colors={['#C9D8B8', '#E8E2C8', '#B7C9A3']} />
        <Steam x={packCx + 40} y={packCy - packH * 0.42} at={REVEAL + 30} w={460} h={620} opacity={0.6} />
        <Pack k="tea" cx={packCx} cy={packCy} h={packH} sheenAt={[REVEAL + 50, END + 40]} shadow={0.25} style={{opacity: glide}} />
        <Kicker text="The perfect post-meal ritual" at={REVEAL + 30} out={REASON - 8} y={262} color={SAGE} size={30} />
        <Title text="Digestion Tea" at={REVEAL + 36} out={REASON - 8} y={310} size={104} weight={300} color={DEEP} />

        {/* REASON */}
        {f >= REASON && f < END + 6 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 210, textAlign: 'center', opacity: seven * (1 - prog(f, END - 6, END + 4))}}>
            <span style={{fontFamily: F.display, fontWeight: 200, fontSize: 260, color: DEEP, letterSpacing: '-0.06em', lineHeight: 1}}>7</span>
            <span style={{fontFamily: F.display, fontWeight: 300, fontSize: 64, color: DEEP, marginLeft: 18}}>tea bags</span>
          </div>
        )}
        <Title text={'"Light and gentle\non the system."'} at={REASON + 40} out={END - 6} y={1540} size={50} weight={300} color={DEEP} stagger={2} />

        {/* END */}
        <Title text={'Dinner ke baad,\n*apna* ritual.'} at={END + 14} y={232} size={88} weight={300} color={DEEP} accent={SAGE} />
        <EndBlock at={END + 30} y={1180} dark={false} product="Digestion Tea" line="7 tea bags · Net quantity 9g" />
      </Scene>

      <Grain opacity={0.04} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.4],
          ...Array.from({length: 8}).map((_, i) => [i * 5, 'tick', 0.3] as [number, 'tick', number]),
          [40, 'whoosh', 0.35],
          [CALM_AT, 'shimmer', 0.3],
          [CALM_AT + 30, 'steam', 0.4],
          [REVEAL, 'whoosh', 0.25],
          [REVEAL + 30, 'steam', 0.35],
          [REVEAL + 50, 'shimmer', 0.25],
          [REASON + 6, 'chime', 0.3],
          [END, 'whoosh', 0.25],
          [END + 30, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};
