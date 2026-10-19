import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {SCREEN_H, src, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Grain, Reveal, Scene, Sheen, Spot} from '../components/Stage';
import {Headline, Sub} from '../components/Text';
import {Flame} from '../components/ui/Icons';
import {BEAT, C, clamp, ease, prog, spr} from '../theme';

/**
 * AD 05 · "Small habits count."
 * One flame = one logged day (the app's own streak strip: filled = logged,
 * outline = missed). The strip fills, a missed day is shrugged off, then the
 * real streak screen, the real milestone story designs, and a warm close.
 * Music: MIZRAB intro from 0s (gentle, building).
 */
export const AD05_DURATION = 600;

const SLOTS = 14;
const MISSED = [3, 8];
const fillAt = (i: number) => 100 + i * 5;
const SLOT = 62;
const GAP = 4;
const STRIP_X = 540 - (SLOTS * (SLOT + GAP) - GAP) / 2;
const STRIP_Y = 610;

const MILESTONES = [
  {img: UI.ms7, x: 200, rot: -9},
  {img: UI.ms30, x: 425, rot: -3},
  {img: UI.ms100, x: 655, rot: 3},
  {img: UI.ms365, x: 880, rot: 9},
];
const MS_AT = (i: number) => 336 + Math.round(i * BEAT);

export const Ad05SmallHabits: React.FC = () => {
  const f = useCurrentFrame();
  const ignite = spr(f, -8, {damping: 9, stiffness: 120});
  const toSlot = prog(f, 92, 106, ease.inOut);
  const bigX = interpolate(toSlot, [0, 1], [540, STRIP_X + SLOT / 2]);
  const bigY = interpolate(toSlot, [0, 1], [640, STRIP_Y + SLOT / 2]);
  const bigSize = interpolate(toSlot, [0, 1], [230, SLOT]);
  const glow = 0.5 + 0.5 * Math.sin(f / 8);
  const phoneIn = spr(f, 200, {damping: 17, stiffness: 100});
  const phoneOut = prog(f, 326, 344, ease.in);
  const story = spr(f, 452, {damping: 16, stiffness: 110});

  return (
    <AbsoluteFill style={{background: C.tealDark}}>
      <Music start={0.02} duration={AD05_DURATION} volume={0.66} fadeIn={2} />

      {/* A+B · flame metaphor */}
      <Scene from={0} to={214}>
        <Bg kind="ink" glow={[540, 700]} />
        <AbsoluteFill style={{background: `radial-gradient(420px 420px at ${bigX}px ${bigY}px, rgba(217,154,43,${0.28 * ignite * (1 - toSlot * 0.7) * (0.8 + 0.2 * glow)}), rgba(217,154,43,0))`}} />
        {f < 100 && (
          <div style={{position: 'absolute', left: bigX - bigSize / 2, top: bigY - bigSize / 2, transform: `scale(${ignite})`, filter: `drop-shadow(0 0 ${30 + glow * 20}px rgba(217,154,43,0.8))`}}>
            <Flame size={bigSize} color={C.haldi} />
          </div>
        )}
        <Headline lines={['Ek din.', 'Ek meal.', '*Ek flame.*']} at={1} out={88} y={900} size={116} color={C.white} accent="#F4B740" stagger={10} />

        {f >= 96 &&
          Array.from({length: SLOTS}).map((_, i) => {
            const missed = MISSED.includes(i);
            const at = fillAt(i);
            const s = spr(f, at, {damping: 10, stiffness: 220});
            const lit = f >= at;
            const o = interpolate(f, [96 + i * 1.5, 100 + i * 1.5], [0, 1], clamp);
            return (
              <div key={i} style={{position: 'absolute', left: STRIP_X + i * (SLOT + GAP), top: STRIP_Y, width: SLOT, height: SLOT, opacity: o * (1 - prog(f, 200, 212)), transform: `scale(${lit && !missed ? 0.8 + 0.2 * s : 1})`}}>
                <Flame size={SLOT} color={lit && !missed ? C.haldi : 'rgba(255,255,255,0.38)'} filled={lit && !missed} stroke={1.4} />
              </div>
            );
          })}
        <Sub text="Filled = logged · outline = missed" at={128} out={200} y={STRIP_Y + 96} size={30} color="rgba(255,255,255,0.6)" weight={400} />
        <Headline lines={['Ek din miss hua?']} at={132} out={200} y={880} size={86} color={C.white} />
        <Headline lines={['*Chalta hai.* Kal phir.']} at={158} out={200} y={1000} size={86} color={C.white} accent="#4ADE80" />
        <Ira x={540} y={1890} size={600} enter="peek" enterAt={50} hops={[164]} tilt={[[60, 0], [72, -6], [96, -6], [110, 0]]} exitAt={192} exit="down" shadow={false} />
      </Scene>

      {/* C · real streak screen */}
      <Scene from={196} to={348}>
        <AbsoluteFill style={{opacity: prog(f, 196, 210)}}>
          <Bg kind="warm" glow={[540, 1100]} />
        </AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${interpolate(phoneIn, [0, 1], [1400, 0]) + phoneOut * 1500}px)`}}>
          <Phone cx={540} cy={1130} width={620} screen={UI.streak} screenH={SCREEN_H[UI.streak]}>
            <Spot at={252} out={318} x={40} y={2700} w={1546} h={280} radius={50} stroke={14} />
          </Phone>
          <Sheen at={218} />
        </div>
        <Headline lines={['Chhoti aadatein.', '*Badi* awareness.']} at={208} out={326} y={210} size={72} color={C.ink} />
      </Scene>

      {/* D · real milestone story designs */}
      <Scene from={330} to={512}>
        <Bg kind="teal" glow={[540, 1000]} />
        {MILESTONES.map((m, i) => {
          const at = MS_AT(i);
          if (f < at) return null;
          const s = spr(f, at, {damping: 13, stiffness: 130});
          const gather = prog(f, 440, 458, ease.inOut);
          const w = 300;
          const h = w * (1332 / 750);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: m.x - w / 2,
                top: 1060 - h / 2,
                width: w,
                height: h,
                borderRadius: 26,
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                opacity: 1 - gather,
                transform: `translateY(${interpolate(s, [0, 1], [900, 0]) + gather * 40}px) translateX(${gather * (540 - m.x)}px) rotate(${interpolate(s, [0, 1], [m.rot * 3, m.rot])}deg)`,
              }}
            >
              <Img src={src(m.img)} style={{width: w, height: h}} />
            </div>
          );
        })}
        <Headline lines={['Har milestone,', '*apni* pace pe.']} at={340} out={446} y={226} size={76} color={C.white} accent="#F4B740" />
        <Sub text="Day 7 · Day 30 · Day 100 · Day 365" at={392} out={446} y={1430} size={36} color="rgba(255,255,255,0.75)" weight={500} />

        {/* E · the 30-day story design */}
        {f >= 452 && (
          <div style={{position: 'absolute', left: 540 - 270, top: 980 - 480, width: 540, height: 961, borderRadius: 40, overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.45)', transform: `scale(${interpolate(story, [0, 1], [0.5, 1])}) rotate(${interpolate(story, [0, 1], [-6, 0])}deg)`, opacity: interpolate(f, [452, 458], [0, 1], clamp)}}>
            <Img src={src(UI.story30)} style={{width: 540, height: 961}} />
            <Sheen at={462} />
          </div>
        )}
        <Headline lines={['Share karo, *proudly.*']} at={456} out={506} y={226} size={70} color={C.white} accent="#F4B740" />
      </Scene>

      <Scene from={506} to={AD05_DURATION}>
        <Reveal at={506} dur={16} from="circle" cx={540} cy={980}>
          <EndCard at={508} bg="warm" tagline={['Small habits', '*count.*']} iraEnter="rise" iraHop={548} />
        </Reveal>
      </Scene>

      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          [0, 'sparkle', 0.5],
          [1, 'impact', 0.35],
          [52, 'pop', 0.4],
          [92, 'swish', 0.35],
          ...Array.from({length: SLOTS})
            .map((_, i) => i)
            .filter((i) => !MISSED.includes(i))
            .map((i) => [fillAt(i), 'tick', 0.3] as [number, SfxName, number]),
          [164, 'pop', 0.4],
          [200, 'whoosh', 0.4],
          [252, 'chime', 0.35],
          [326, 'whoosh', 0.4],
          ...MILESTONES.map((_, i) => [MS_AT(i), 'sparkle', 0.35] as [number, SfxName, number]),
          [452, 'whoosh', 0.35],
          [506, 'whoosh', 0.4],
          [548, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};
