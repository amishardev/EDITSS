import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SCREEN_H, UI} from '../assets';
import {Logo} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Flash, Grain, Scene, Tap} from '../components/Stage';
import {Pill} from '../components/Text';
import {C, clamp, ease, F, prog, spr, track} from '../theme';
import {Title} from '../products/kit';
import {Arrow, Effigy, effigyPoint, Embers, FEST, Firework, headCenter, NightSky, Petals, Toran} from './kit';

/**
 * DUSSEHRA · App film · "Is Dussehra, 10 sar jalao."
 * HOOK: a ten-headed paper effigy rises against a fireworks sky -> DESIRE:
 * each head is named after an everyday food habit -> REVEAL: IRA brings the
 * arrows, the real app features -> REASON: Label scan, Meal scan, Ask IRA and
 * Streaks each take out a head; a volley takes the rest -> the effigy burns:
 * "Burai par acchai ki jeet. Plate par bhi." -> CTA. Symbols only, no deity.
 */
export const D01_DURATION = 660;
const INTRO = 66;
const ARMS = 190;
const BEATS = 236;
const BEAT_LEN = 62;
const VOLLEY = 484;
const BURN = 532;
const END = 590;

export const HABITS = [
  'Late-night noodles',
  'Kal se pakka',
  'Extra cheeni',
  'Label? Kaun padhe',
  'Breakfast skip',
  'Paani kam',
  'Calorie guesswork',
  'Mood eating',
  'Bina soche snacking',
  'Fried everything',
];

const FEATURES: {screen: string; name: string; head: number}[] = [
  {screen: UI.labelResult, name: 'Label scan', head: 3},
  {screen: UI.mealResult, name: 'Meal scan', head: 6},
  {screen: UI.chat, name: 'Ask IRA', head: 8},
  {screen: UI.streak, name: 'Streaks', head: 1},
];
const VOLLEY_HEADS = [0, 2, 4, 5, 7, 9];

const hitFrame = (k: number) => BEATS + k * BEAT_LEN + 40;
const HITS: (number | undefined)[] = Array.from({length: 10}).map((_, i) => {
  const k = FEATURES.findIndex((ft) => ft.head === i);
  if (k >= 0) return hitFrame(k);
  const v = VOLLEY_HEADS.indexOf(i);
  return VOLLEY + 22 + v * 3;
});

/** Where the effigy sits over time: hook -> list close-up -> battle layout -> burn. */
const effigyAt = (f: number) => {
  const scale = track(f, [[0, 0.92], [INTRO, 0.98], [ARMS, 0.98], [BEATS - 6, 0.6], [BURN - 10, 0.6], [BURN + 20, 0.78]]);
  const top = track(f, [[0, 760], [26, 560], [INTRO, 520], [ARMS, 520], [BEATS - 6, 470], [BURN - 10, 470], [BURN + 20, 520]]);
  return {cx: 540, top, scale};
};

const PHONE = {cx: 300, cy: 1330, width: 330};
const BOW = {x: 300, y: 1000};

const HabitList: React.FC = () => {
  const f = useCurrentFrame();
  const out = prog(f, ARMS - 8, ARMS + 6, ease.in);
  if (f < 80 || out >= 1) return null;
  return (
    <div style={{position: 'absolute', left: 70, top: 800, width: 940, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 24, rowGap: 18, opacity: 1 - out}}>
      {HABITS.map((h, i) => {
        // appear in column order so the numbers read 1-5 down the left, 6-10 down the right
        const at = 84 + i * 9;
        const s = spr(f, at, {damping: 14, stiffness: 160});
        const col = i < 5 ? 0 : 1;
        const row = i % 5;
        return (
          <div key={i} style={{gridColumn: col + 1, gridRow: row + 1, display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderRadius: 22, background: 'rgba(20,6,10,0.82)', border: '1.5px solid rgba(255,176,32,0.55)', opacity: s, transform: `translateX(${(1 - s) * (col ? 60 : -60)}px)`}}>
            <div style={{width: 46, height: 46, flex: '0 0 46px', borderRadius: 23, background: FEST.marigold, color: FEST.deep, fontFamily: F.body, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={{fontFamily: F.body, fontWeight: 500, fontSize: 32, color: FEST.cream, whiteSpace: 'nowrap'}}>{h}</div>
          </div>
        );
      })}
    </div>
  );
};

const FeatureBeat: React.FC<{k: number}> = ({k}) => {
  const f = useCurrentFrame();
  const B = BEATS + k * BEAT_LEN;
  const ft = FEATURES[k];
  if (f < B - 2 || f > B + BEAT_LEN + 4) return null;
  const s = spr(f, B, {damping: 16, stiffness: 140});
  const o = 1 - prog(f, B + BEAT_LEN - 8, B + BEAT_LEN, ease.in);
  const strike = interpolate(f, [hitFrame(k) + 2, hitFrame(k) + 14], [0, 1], {...clamp, easing: ease.out});
  return (
    <div style={{position: 'absolute', left: 520, top: 1110, width: 500, opacity: s * o, transform: `translateX(${(1 - s) * 80}px)`}}>
      <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 28, letterSpacing: '0.18em', color: FEST.marigold}}>TEER {k + 1}</div>
      <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 76, color: FEST.cream, letterSpacing: '-0.03em', lineHeight: 1.05, marginTop: 6}}>{ft.name}</div>
      <div style={{position: 'relative', display: 'inline-block', marginTop: 26, fontFamily: F.body, fontWeight: 500, fontSize: 36, color: `rgba(255,243,222,${1 - strike * 0.45})`}}>
        {HABITS[ft.head]}
        <div style={{position: 'absolute', left: -4, top: '52%', height: 5, width: `calc(${strike * 100}% + 8px)`, background: '#FF5A2A', borderRadius: 3}} />
      </div>
    </div>
  );
};

export const D01App: React.FC = () => {
  const f = useCurrentFrame();
  const eff = effigyAt(f);
  const phoneIn = spr(f, BEATS - 14, {damping: 18, stiffness: 120});
  const phoneOut = prog(f, BURN - 6, BURN + 8, ease.in);
  const screenK = Math.max(0, Math.min(3, Math.floor((f - BEATS) / BEAT_LEN)));
  const dimBody = prog(f, 80, 100) * (1 - prog(f, ARMS - 4, ARMS + 10)) + prog(f, BEATS - 10, BEATS + 4) * 0.5 * (1 - prog(f, BURN - 10, BURN));
  const endBg = prog(f, END - 6, END + 14, ease.inOut);

  const headTarget = (i: number) => {
    const c = headCenter(i);
    return effigyPoint(eff.cx, eff.top, eff.scale, c.x, c.y);
  };

  return (
    <AbsoluteFill style={{background: FEST.night}}>
      <Music track="d01" duration={D01_DURATION} volume={0.6} />
      <NightSky glow={0.4 + prog(f, BURN, BURN + 30) * 0.6} />

      {/* distant shells all the way through */}
      <Firework at={10} x={200} y={360} r={170} seed={1} />
      <Firework at={30} x={860} y={300} r={200} color="#7FE0FF" color2="#FFD24A" seed={2} />
      <Firework at={150} x={900} y={260} r={150} color="#FF7AB6" seed={3} />
      <Firework at={BURN + 4} x={220} y={330} r={280} seed={4} />
      <Firework at={BURN + 14} x={850} y={280} r={300} color="#7FE0FF" color2="#FFD24A" seed={5} />
      <Firework at={BURN + 28} x={540} y={200} r={320} color="#FFE37A" color2="#FF5DA2" seed={6} />

      <Scene from={0} to={END + 16}>
        <Effigy cx={eff.cx} top={eff.top} scale={eff.scale} hits={HITS} burnAt={BURN} bodyDim={dimBody} badges={HABITS.map((_, i) => 84 + i * 9)} />
        {f >= BURN && <Embers x={540} y={1500} w={700} at={BURN} n={60} seed={8} rise={1200} />}
      </Scene>

      {/* HOOK */}
      <Title text="Is Dussehra," at={4} out={INTRO - 6} y={210} size={80} weight={300} color={FEST.cream} />
      <Title text="*10 sar* jalao." at={14} out={INTRO - 6} y={310} size={124} weight={800} color={FEST.cream} accent={FEST.marigold} tracking={-0.04} />

      {/* DESIRE: meet the ten heads */}
      <Title text={'Milo apne andar ke\n*Ravan* se.'} at={INTRO + 4} out={ARMS - 8} y={210} size={80} weight={300} color={FEST.cream} accent={FEST.marigold} lineHeight={1.1} />
      <HabitList />

      {/* REVEAL: IRA brings the arrows */}
      <Title text={'Aur ye rahe\ntumhare *teer.*'} at={ARMS} out={BEATS + 4} y={210} size={84} weight={300} color={FEST.cream} accent={FEST.marigold} lineHeight={1.1} />
      <Ira x={900} y={1780} size={380} enter="right" enterAt={ARMS + 4} exitAt={BURN - 6} exit="right" emote={[[ARMS + 4, 'surprised'], [ARMS + 24, 'phone'], [VOLLEY, 'thumbsup']]} shadowColor="rgba(0,0,0,0.5)" />

      {/* REASON: each feature is an arrow */}
      {f >= BEATS - 16 && phoneOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - phoneOut, transform: `translateY(${(1 - phoneIn) * 900}px)`}}>
          <Phone cx={PHONE.cx} cy={PHONE.cy} width={PHONE.width} screen={FEATURES[screenK].screen} screenH={SCREEN_H[FEATURES[screenK].screen]} />
        </div>
      )}
      {FEATURES.map((ft, k) => {
        const B = BEATS + k * BEAT_LEN;
        const tgt = headTarget(ft.head);
        return (
          <React.Fragment key={k}>
            {k > 0 && <Flash at={B} dur={6} peak={0.25} color="#FFE7B0" />}
            <Tap at={B + 18} x={PHONE.cx} y={PHONE.cy + 120} />
            <Arrow at={hitFrame(k) - 14} dur={14} x0={BOW.x} y0={BOW.y} x1={tgt.x} y1={tgt.y} />
            <FeatureBeat k={k} />
          </React.Fragment>
        );
      })}
      <Title text={'Baaki 6?\n*Ek saath.*'} at={VOLLEY} out={BURN - 8} y={1120} x={520} width={500} align="left" size={84} weight={700} color={FEST.cream} accent={FEST.marigold} lineHeight={1.05} />
      {VOLLEY_HEADS.map((h, v) => {
        const tgt = headTarget(h);
        const at = VOLLEY + 22 + v * 3 - 14;
        return <Arrow key={h} at={at} dur={14} x0={BOW.x + (v - 2.5) * 30} y0={BOW.y} x1={tgt.x} y1={tgt.y} len={120} />;
      })}

      {/* CLIMAX */}
      <Flash at={BURN} dur={14} peak={0.6} color="#FFD9A0" />
      <Title text="Burai par acchai ki jeet." at={BURN + 10} out={END - 8} y={220} size={70} weight={300} color={FEST.cream} shadow="0 4px 24px rgba(0,0,0,0.6)" />
      <Title text="*Plate par bhi.*" at={BURN + 24} out={END - 8} y={310} size={110} weight={800} color={FEST.cream} accent={FEST.marigold} tracking={-0.04} shadow="0 4px 24px rgba(0,0,0,0.6)" />

      {/* END */}
      {endBg > 0 && (
        <AbsoluteFill style={{opacity: endBg}}>
          <AbsoluteFill style={{background: `radial-gradient(900px 900px at 540px 760px, #7A1A24 0%, ${FEST.maroon} 45%, ${FEST.deep} 100%)`}} />
          <Petals at={END} n={34} seed={9} dur={80} />
        </AbsoluteFill>
      )}
      <Firework at={END + 20} x={220} y={520} r={200} seed={7} launch={false} />
      <Firework at={END + 32} x={860} y={480} r={220} color="#7FE0FF" color2="#FFD24A" seed={8} launch={false} />
      <Toran at={END + 2} />
      <Ira x={540} y={1020} size={520} enter="pop" enterAt={END + 8} hops={[END + 40]} emote="celebrate" shadowColor="rgba(0,0,0,0.45)" />
      <Logo at={END + 18} cx={540} y={1060} width={400} white />
      {f >= END + 28 && (
        <div style={{position: 'absolute', left: 0, width: 1080, top: 1290, textAlign: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 60, color: FEST.marigold, opacity: prog(f, END + 28, END + 40), transform: `translateY(${(1 - prog(f, END + 28, END + 44)) * 24}px)`}}>
          शुभ विजयादशमी
        </div>
      )}
      <Pill text="Try Dietary Guide" at={END + 40} cx={540} y={1420} bg={C.leaf} size={44} pad={[28, 60]} />

      <Grain opacity={0.05} vignette={0.25} />
      <Cues
        cues={[
          [0, 'impact', 0.5],
          [14, 'firework', 0.35],
          [26, 'whoosh', 0.3],
          [34, 'firework', 0.3],
          ...HABITS.map((_, i) => [84 + i * 9, 'pop', 0.22] as [number, SfxName, number]),
          [ARMS + 4, 'whoosh', 0.4],
          [BEATS - 14, 'swish', 0.4],
          ...FEATURES.flatMap((_, k) => [
            [BEATS + k * BEAT_LEN + 18, 'tap', 0.4],
            [hitFrame(k) - 14, 'arrow', 0.55],
            [hitFrame(k), 'fire', 0.45],
          ] as [number, SfxName, number][]),
          [VOLLEY + 8, 'arrow', 0.5],
          [VOLLEY + 12, 'arrow', 0.45],
          [VOLLEY + 22, 'fire', 0.45],
          [VOLLEY + 30, 'fire', 0.4],
          [BURN, 'fire', 0.7],
          [BURN + 4, 'firework', 0.5],
          [BURN + 14, 'firework', 0.45],
          [BURN + 28, 'firework', 0.45],
          [END, 'whoosh', 0.35],
          [END + 8, 'pop', 0.4],
          [END + 20, 'firework', 0.25],
          [END + 40, 'success', 0.35],
        ]}
      />
    </AbsoluteFill>
  );
};
