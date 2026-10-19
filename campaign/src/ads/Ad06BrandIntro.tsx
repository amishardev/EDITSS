import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PHOTO, SCREEN_H, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Camera, Flash, FocusCrop, Grain, Reveal, Scene, Spot} from '../components/Stage';
import {Headline} from '../components/Text';
import {BEAT, C, clamp, ease, F, spr} from '../theme';

/**
 * AD 06 · "Meet IRA. Your nutrition companion."
 * Face-first IRA reveal -> beat cuts naming real features -> drop: phone
 * slams in on the real meal result, macros fly out -> whip pans through the
 * real label result and IRA chat -> three-phone fan -> logo.
 * Music: theme-ad06, a tabla-roll build whose drop lands on frame 112.
 */
export const AD06_DURATION = 600;
const DROP = 112;
const b = (n: number) => Math.round(n * BEAT);

const CUTS = [
  {at: 56, crop: {file: PHOTO.rotiPaneer, iw: 1080, ih: 1917, fx: 540, fy: 960, zoom: 1.15}, word: 'Scan food.'},
  {at: 56 + b(1), crop: {file: PHOTO.labelPack, iw: 1080, ih: 1767, fx: 600, fy: 600, zoom: 1.3}, word: 'Scan label.'},
  {at: 56 + b(2), crop: {file: PHOTO.iraThali, iw: 1080, ih: 1350, fx: 560, fy: 520, zoom: 1.15}, word: 'Ask IRA.'},
  {at: 56 + b(3), crop: {file: PHOTO.iraJump, iw: 1080, ih: 1919, fx: 540, fy: 900, zoom: 1.05}, word: 'Build streaks.'},
];

const SEGS = [
  {from: DROP, to: 200, screen: UI.mealResult},
  {from: 196, to: 268, screen: UI.labelResult},
  {from: 264, to: 336, screen: UI.chat},
];

const MACROS = [
  {at: DROP + 8, text: '615', unit: 'kcal', x: 50, y: 560, bg: C.tileCal},
  {at: DROP + 8 + b(1), text: '12g', unit: 'protein', x: 640, y: 760, bg: C.tileProt},
  {at: DROP + 8 + b(2), text: '93g', unit: 'carbs', x: 50, y: 1240, bg: C.tileCarb},
  {at: DROP + 8 + b(3), text: '22g', unit: 'fat', x: 700, y: 1440, bg: C.tileFat},
];

const MacroChip: React.FC<(typeof MACROS)[number]> = ({at, text, unit, x, y, bg}) => {
  const f = useCurrentFrame();
  if (f < at || f > 204) return null;
  const s = spr(f, at, {damping: 11, stiffness: 190});
  const o = interpolate(f, [192, 202], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '22px 36px', borderRadius: 36, background: bg, boxShadow: '0 24px 50px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'baseline', gap: 12, transform: `scale(${s}) rotate(${(1 - s) * -12}deg)`, opacity: o}}>
      <span style={{fontFamily: F.display, fontWeight: 800, fontSize: 84, letterSpacing: '-0.04em', color: C.ink}}>{text}</span>
      <span style={{fontFamily: F.body, fontWeight: 500, fontSize: 36, color: C.sub}}>{unit}</span>
    </div>
  );
};

export const Ad06BrandIntro: React.FC = () => {
  const f = useCurrentFrame();
  const fanOut = interpolate(f, [414, 428], [0, 1], {...clamp, easing: ease.in});

  return (
    <AbsoluteFill style={{background: '#071416'}}>
      <Music track="ad06" duration={AD06_DURATION} />

      {/* A+B · face-first reveal */}
      <Scene from={0} to={60}>
        <Bg kind="ink" glow={[540, 900]} />
        <Camera z={[[0, 3.1], [24, 1]]} y={[[0, 820], [24, 960]]}>
          <Ira x={540} y={1250} size={680} enter="none" hops={[b(3)]} exitAt={50} exit="shrink" shadowColor="rgba(0,0,0,0.5)" />
        </Camera>
        <Headline lines={['Meet *IRA.*']} at={16} out={50} y={1290} size={156} color={C.white} accent="#4ADE80" mode="pop" stagger={5} />
        <Headline lines={['Your nutrition', '*companion.*']} at={28} out={50} y={1480} size={62} weight={700} color="rgba(255,255,255,0.92)" accent="#4ADE80" stagger={3} />
      </Scene>

      {/* C · beat cuts */}
      <Scene from={56} to={DROP}>
        {CUTS.map((c, i) => {
          const next = CUTS[i + 1]?.at ?? DROP;
          if (f < c.at || f >= next) return null;
          return (
            <AbsoluteFill key={i}>
              <FocusCrop {...c.crop} w={1080} h={1920} zoom={c.crop.zoom * (1.06 + (f - c.at) * 0.006)} />
              <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(7,20,22,0.35), rgba(7,20,22,0.8))'}} />
            </AbsoluteFill>
          );
        })}
        {CUTS.map((c, i) => (
          <Headline key={i} lines={[c.word]} at={c.at} out={(CUTS[i + 1]?.at ?? DROP) - 4} exitDur={4} y={860} size={c.word.length > 11 ? 120 : 140} color={C.white} mode="pop" stagger={0} shadow="0 10px 40px rgba(0,0,0,0.5)" />
        ))}
      </Scene>

      {/* D..F · drop: real screens, whip pans */}
      <Scene from={DROP} to={340}>
        <Bg kind="teal" glow={[540, 1100]} />
        {SEGS.map((s, i) => {
          if (f < s.from || f >= s.to) return null;
          const enter = i === 0 ? spr(f, s.from, {damping: 13, stiffness: 150}) : interpolate(f, [s.from, s.from + 8], [0, 1], {...clamp, easing: ease.out});
          const leave = interpolate(f, [s.to - 8, s.to], [0, 1], {...clamp, easing: ease.in});
          const x = i === 0 ? 0 : (1 - enter) * 1300;
          const xo = leave * -1300;
          const blur = (i === 0 ? 0 : (1 - enter) * 30) + leave * 30;
          const scale = i === 0 ? interpolate(enter, [0, 1], [1.6, 1]) : 1;
          const rot = i === 0 ? interpolate(enter, [0, 1], [-8, 0]) : 0;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${x + xo}px) scale(${scale}) rotate(${rot}deg)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined, transformOrigin: '540px 1100px'}}>
              <Phone cx={540} cy={1110} width={600} screen={s.screen} screenH={SCREEN_H[s.screen]}>
                {i === 1 && <Spot at={210} out={260} x={40} y={1630} w={1546} h={400} radius={60} stroke={16} />}
                {i === 2 && <Spot at={280} out={330} x={50} y={1690} w={1340} h={790} radius={60} stroke={16} />}
              </Phone>
            </div>
          );
        })}
        {MACROS.map((m, i) => (
          <MacroChip key={i} {...m} />
        ))}
        <Flash at={DROP} dur={8} peak={0.7} />
        <Headline lines={['Snap. *Know.*']} at={DROP + 2} out={190} y={214} size={92} color={C.white} accent="#4ADE80" mode="pop" stagger={6} />
        <Headline lines={['Packet bhi *scan.*']} at={204} out={260} y={214} size={84} color={C.white} accent="#4ADE80" />
        <Headline lines={['IRA se *pooch.*']} at={272} out={330} y={214} size={84} color={C.white} accent="#4ADE80" />
      </Scene>

      {/* G · three-phone fan */}
      <Scene from={334} to={440}>
        <Bg kind="teal" glow={[540, 1000]} />
        {[
          {screen: UI.streak, cx: 250, rot: -11, at: 338, w: 430},
          {screen: UI.scannerFood, cx: 830, rot: 11, at: 338 + b(1), w: 430},
          {screen: UI.home, cx: 540, rot: 0, at: 338 + b(2), w: 500},
        ].map((p, i) => {
          if (f < p.at) return null;
          const s = spr(f, p.at, {damping: 14, stiffness: 140});
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateY(${interpolate(s, [0, 1], [1300, 0]) - fanOut * 1700}px) rotate(${p.rot * s}deg)`, transformOrigin: `${p.cx}px 1700px`}}>
              <Phone cx={p.cx} cy={1130} width={p.w} screen={p.screen} screenH={SCREEN_H[p.screen]} />
            </div>
          );
        })}
        <Headline lines={['Sab kuch,', '*ek* jagah.']} at={342} out={412} y={214} size={84} color={C.white} accent="#4ADE80" />
      </Scene>

      <Scene from={420} to={AD06_DURATION}>
        <Reveal at={420} dur={16} from="circle" cx={540} cy={720}>
          <EndCard at={424} bg="teal" tagline={['Meet IRA.', 'Your *nutrition* companion.']} iraEnter="drop" iraHop={468} burst iraSize={600} />
        </Reveal>
      </Scene>

      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.75],
          [2, 'whoosh', 0.45],
          [16, 'pop', 0.5],
          [b(3), 'pop', 0.35],
          ...CUTS.map((c) => [c.at, 'swish', 0.5] as [number, SfxName, number]),
          [74, 'riser', 0.45],
          [DROP, 'impact', 0.85],
          ...MACROS.map((m) => [m.at, 'pop', 0.45] as [number, SfxName, number]),
          [192, 'whoosh', 0.5],
          [210, 'chime', 0.3],
          [260, 'whoosh', 0.5],
          [280, 'tick', 0.4],
          ...[338, 338 + b(1), 338 + b(2)].map((a) => [a, 'swish', 0.4] as [number, SfxName, number]),
          [414, 'whoosh', 0.5],
          [424, 'impact', 0.55],
          [468, 'sparkle', 0.45],
        ]}
      />
    </AbsoluteFill>
  );
};
