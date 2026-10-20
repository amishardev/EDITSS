import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Emote, PHOTO, SCREEN_H, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {RatingCard, Sticker, TokCaption} from '../components/Caption';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Flash, FocusCrop, Grain, Reveal, ScanBeam, Scene, Tap} from '../components/Stage';
import {BEAT, C, clamp, ease, prog, spr} from '../theme';

/**
 * AD 11 · Gen Z · "POV: IRA rates your plate"
 * Creator-format captions, dark mode, beat cuts. Three real plates get the
 * app's real health scores (82, 38 "Fine now and then", 62 "Okay as a
 * treat") with IRA reacting in emotes, then dark mode, the streak flex and
 * Share to Story. Supportive, never food-shaming.
 * Music: theme-ad11, straight into the groove with a stab on each score.
 */
export const AD11_DURATION = 600;

const b = (n: number) => Math.round(n * BEAT);
const ROUND = b(8); // 112 frames

type Round = {
  at: number;
  crop: {file: string; iw: number; ih: number; fx: number; fy: number; zoom: number};
  tag: string;
  score: number;
  verdict?: string;
  meal: string;
  detail: string;
  caption: string[];
  note?: string;
  emote: Emote;
};

const ROUNDS: Round[] = [
  {
    at: b(2),
    crop: {file: PHOTO.rotiPaneer, iw: 1080, ih: 1917, fx: 560, fy: 960, zoom: 1.1},
    tag: 'plate #1',
    score: 82,
    meal: 'Paneer bhurji + 2 roti',
    detail: '420 kcal · 25g protein',
    caption: ['25g protein?', '*Ate.*'],
    emote: 'thumbsup',
  },
  {
    at: b(2) + ROUND,
    crop: {file: PHOTO.labelPack, iw: 1080, ih: 1767, fx: 560, fy: 700, zoom: 1.15},
    tag: 'plate #2 (ok, packet)',
    score: 38,
    verdict: 'Fine now and then',
    meal: 'Salted potato chips',
    detail: 'High sodium · Palm oil · Low protein',
    caption: ['chalta hai. bas', '*bowl* mein daal,', 'packet se nahi.'],
    emote: 'shrug',
  },
  {
    at: b(2) + ROUND * 2,
    crop: {file: PHOTO.pancakes, iw: 1260, ih: 1540, fx: 630, fy: 700, zoom: 1.05},
    tag: 'plate #3',
    score: 62,
    verdict: 'Okay as a treat',
    meal: 'Pancakes with blueberries & syrup',
    detail: '615 kcal · 12g protein',
    caption: ['treat day?', '*valid.*'],
    note: 'IRA tip: aadha syrup +|ek katori dahi = 8g protein',
    emote: 'eating',
  },
];

const DARK = ROUNDS[2].at + ROUND; // 364
const STREAK = DARK + b(3.5);
const POST = DARK + b(7);
const END = POST + b(3.5);

const RoundScene: React.FC<{r: Round}> = ({r}) => {
  const f = useCurrentFrame();
  const t = f - r.at;
  const enter = interpolate(t, [0, 7], [-1080, 0], {...clamp, easing: ease.out});
  const zoom = 1 + t * 0.0015;
  return (
    <Scene from={r.at} to={r.at + ROUND}>
      <AbsoluteFill style={{transform: `translateX(${enter}px)`}}>
        <FocusCrop {...r.crop} zoom={r.crop.zoom * zoom} w={1080} h={1920} />
        <AbsoluteFill style={{background: `rgba(7,20,22,${interpolate(t, [24, 32], [0.15, 0.55], clamp)})`}} />
      </AbsoluteFill>
      <ScanBeam at={r.at + 12} dur={16} x={0} y0={0} y1={1920} w={1080} />
      <Sticker text={r.tag} at={r.at + 4} y={262} />
      <RatingCard at={r.at + b(2)} score={r.score} verdict={r.verdict} meal={r.meal} detail={r.detail} y={r.verdict ? 470 : 520} />
      <Ira x={850} y={1720} size={480} enter="right" enterAt={r.at + b(2) + 10} emote={r.emote} hops={[r.at + b(4)]} shadow={false} exitAt={r.at + ROUND - 8} exit="right" />
      <TokCaption lines={r.caption} at={r.at + b(3)} cx={380} y={1170} size={60} rotate={-3} />
      {r.note && <TokCaption lines={r.note.split('|')} at={r.at + b(5)} cx={370} y={1420} size={34} rotate={-3} dark stagger={2} />}
    </Scene>
  );
};

export const Ad11GenZRate: React.FC = () => {
  const f = useCurrentFrame();
  const dk = spr(f, DARK, {damping: 15, stiffness: 120});
  const st = spr(f, STREAK, {damping: 15, stiffness: 130});
  const po = spr(f, POST, {damping: 15, stiffness: 130});

  return (
    <AbsoluteFill style={{background: '#071416'}}>
      <Music track="ad11" duration={AD11_DURATION} volume={0.55} />

      {/* hook */}
      <Scene from={0} to={ROUNDS[0].at + 8}>
        <Bg kind="ink" glow={[540, 1100]} />
        <TokCaption lines={['POV:', 'IRA rates your plate']} at={0} y={330} size={84} rotate={-3} stagger={3} />
        <Ira x={540} y={1640} size={760} enter="rise" enterAt={-6} emote="phone" shadow={false} />
        <Flash at={ROUNDS[0].at - 2} dur={8} peak={0.9} />
      </Scene>

      {ROUNDS.map((r, i) => (
        <RoundScene key={i} r={r} />
      ))}

      {/* dark mode + streak flex */}
      <Scene from={DARK} to={POST + 6}>
        <Bg kind="ink" glow={[540, 1000]} />
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - dk) * 1500}px)`, opacity: 1 - prog(f, STREAK - 4, STREAK + 8)}}>
          <div style={{position: 'absolute', inset: 0, transform: 'rotate(-7deg)', transformOrigin: '300px 1150px'}}>
            <Phone cx={300} cy={1150} width={470} screen={UI.darkHome} screenH={SCREEN_H[UI.darkHome]} screenBg="#0B0F12" />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: 'rotate(7deg)', transformOrigin: '780px 1110px'}}>
            <Phone cx={780} cy={1110} width={470} screen={UI.darkMeal} screenH={SCREEN_H[UI.darkMeal]} screenBg="#0B0F12" />
          </div>
        </div>
        <TokCaption lines={["it's giving", '*dark mode*']} at={DARK + 6} out={STREAK - 4} y={300} size={74} rotate={-2} />
        {f >= STREAK - 2 && (
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - st) * 1500 + (f >= POST ? (f - POST) * 140 : 0)}px) scale(${0.9 + st * 0.1})`}}>
            <Phone cx={540} cy={1130} width={560} screen={UI.darkStreak} screenH={SCREEN_H[UI.darkStreak]} screenBg="#0B0F12" />
          </div>
        )}
        <TokCaption lines={['12-day streak =', '*main character*', 'energy']} at={STREAK + 6} out={POST - 4} y={250} size={64} rotate={2} />
      </Scene>

      {/* post it */}
      <Scene from={POST} to={END + 4}>
        <AbsoluteFill style={{opacity: interpolate(f, [POST, POST + 6], [0, 1], clamp)}}>
          <Bg kind="ink" glow={[540, 900]} />
        </AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - po) * 1500}px)`}}>
          <Phone cx={540} cy={1130} width={600} screen={UI.storyEditor} screenH={SCREEN_H[UI.storyEditor]} screenBg="#0B0F12" glass={<Tap at={POST + b(2)} x={1044} y={3234} r={230} />} />
        </div>
        <TokCaption lines={['post it.', '*obviously.*']} at={POST + 6} y={270} size={76} rotate={-3} />
      </Scene>

      <Ira x={190} y={1730} size={420} enter="left" enterAt={DARK + 14} emote={[[DARK + 14, 'surprised'], [STREAK + 6, 'celebrate'], [POST + 4, 'phone']]} hops={[STREAK + 8, POST + b(2) + 2]} shadow={false} exitAt={END - 6} exit="left" />

      <Scene from={END} to={AD11_DURATION}>
        <Reveal at={END} dur={12} from="circle" cx={540} cy={900}>
          <EndCard at={END + 2} bg="ink" tagline={['Rate. Samjho.', '*Post.*']} iraEnter="drop" iraHop={END + 40} emote={[[END + 2, 'celebrate'], [END + 50, 'thumbsup']]} />
        </Reveal>
      </Scene>

      <Grain opacity={0.06} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.6],
          [3, 'pop', 0.45],
          [ROUNDS[0].at - 2, 'tap', 0.9],
          ...ROUNDS.flatMap((r) => [
            [r.at, 'swish', 0.45],
            [r.at + 4, 'pop', 0.35],
            [r.at + 12, 'scan', 0.3],
            [r.at + b(2) + 10, 'whoosh', 0.3],
            [r.at + b(3), 'tick', 0.4],
          ] as [number, SfxName, number][]),
          [DARK, 'whoosh', 0.45],
          [DARK + 14, 'pop', 0.4],
          [STREAK, 'swish', 0.45],
          [STREAK + 8, 'sparkle', 0.4],
          [POST, 'whoosh', 0.45],
          [POST + b(2), 'tap', 0.85],
          [POST + b(2) + 2, 'success', 0.5],
          [END, 'whoosh', 0.45],
          [END + 40, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};

