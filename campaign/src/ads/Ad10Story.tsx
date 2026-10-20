import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {BRAND, PHOTO, SCREEN_H, src, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Flash, Grain, Reveal, Scene, Sheen, Spot, Tap} from '../components/Stage';
import {Headline, Pill} from '../components/Text';
import {BEAT, C, clamp, ease, F, prog, spr} from '../theme';

/**
 * AD 10 · "Khana bhi. Flex bhi." (Share to Story)
 * The ad is itself framed as a story: segment bars and a header across the
 * top. IRA snaps the meal, it becomes the real meal story, then the real
 * story editor (auto text colour, IRA sticker, toggles), the real story
 * styles flipping on the beat, and Share.
 * Music: theme-ad10, upbeat; drops when the styles start flipping.
 */
export const AD10_DURATION = 570;

const SEGS: [number, number][] = [[0, 130], [130, 280], [280, 420], [420, 456]];
const b = (n: number) => Math.round(n * BEAT);

const STYLES = [
  {img: UI.storyThali, label: 'Just the meal', w: 1500, h: 2670},
  {img: UI.storyMeal, label: 'Meal', w: 1500, h: 2670},
  {img: UI.story30, label: 'Milestone · Day 30', w: 1500, h: 2670},
  {img: UI.ms100, label: 'Day 100', w: 750, h: 1332},
  {img: UI.ms365, label: 'Day 365', w: 750, h: 1332},
];
const FLIP0 = 284;
const FLIP = b(2);

const EDIT_SPOTS = [
  {at: 150, out: 192, r: [440, 250, 740, 200], title: ['Text colour? *Auto.*']},
  {at: 196, out: 236, r: [840, 760, 450, 680], title: ['IRA sticker. *Cute*, na?']},
  {at: 240, out: 276, r: [60, 2650, 1560, 210], title: ['Jo dikhana hai, *wahi.*']},
];

/** Story chrome: segment bars + a small header, in the story idiom. */
const StoryChrome: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - prog(f, 452, 460);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 252, opacity: o}}>
      <div style={{display: 'flex', gap: 10}}>
        {SEGS.map(([a, z], i) => (
          <div key={i} style={{flex: 1, height: 7, borderRadius: 4, background: 'rgba(15,23,42,0.18)', overflow: 'hidden'}}>
            <div style={{width: `${interpolate(f, [a, z], [0, 100], clamp)}%`, height: '100%', background: C.ink}} />
          </div>
        ))}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 22, fontFamily: F.body, fontSize: 32, fontWeight: 600, color: C.ink}}>
        <Img src={src(BRAND.iraAvatar)} style={{width: 58, height: 58}} />
        Dietary Guide
        <span style={{fontWeight: 400, color: C.sub}}>· abhi</span>
      </div>
    </div>
  );
};

export const Ad10Story: React.FC = () => {
  const f = useCurrentFrame();
  const shot = spr(f, 30, {damping: 14, stiffness: 140});
  const toStory = prog(f, 62, 76, ease.inOut);
  const ed = spr(f, 130, {damping: 16, stiffness: 120});
  const edOut = prog(f, 276, 288, ease.in);
  const ed2 = spr(f, 420, {damping: 16, stiffness: 140});

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="ad10" duration={AD10_DURATION} volume={0.55} />
      <Bg kind="green" glow={[540, 900]} />

      {/* 1 · snap -> story */}
      <Scene from={0} to={140}>
        <Headline lines={['Khana ready?']} at={0} out={24} y={380} size={96} color={C.ink} mode="pop" stagger={0} />
        <Flash at={28} dur={8} peak={0.9} />
        {f >= 30 && (
          <div
            style={{
              position: 'absolute',
              left: 540 - 270,
              top: 990 - 480,
              width: 540,
              height: 961,
              borderRadius: 34,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 40px 80px rgba(15,23,42,0.3)',
              transform: `translateY(${interpolate(shot, [0, 1], [500, 0]) + prog(f, 126, 140, ease.in) * -1400}px) scale(${interpolate(shot, [0, 1], [0.3, 1])}) rotate(${interpolate(shot, [0, 1], [-14, -3]) * (1 - toStory)}deg)`,
            }}
          >
            <Img src={src(PHOTO.rotiPaneer)} style={{position: 'absolute', inset: 0, width: 540, height: 961, objectFit: 'cover', opacity: 1 - toStory}} />
            <Img src={src(UI.storyMeal)} style={{position: 'absolute', inset: 0, width: 540, height: 961, opacity: toStory}} />
            <Sheen at={76} />
          </div>
        )}
        <Headline lines={['Khana bhi.']} at={70} out={124} y={380} size={96} color={C.ink} />
        <Headline lines={['*Flex* bhi.']} at={88} out={124} y={1530} size={110} color={C.ink} />
      </Scene>

      {/* 2 · the real story editor */}
      <Scene from={128} to={290}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${interpolate(ed, [0, 1], [1400, 0]) + edOut * 1500}px)`}}>
          <Phone cx={540} cy={1180} width={600} screen={UI.storyEditor} screenH={SCREEN_H[UI.storyEditor]} screenBg="#0B0F12">
            {EDIT_SPOTS.map((s, i) => (
              <Spot key={i} at={s.at} out={s.out} x={s.r[0]} y={s.r[1]} w={s.r[2]} h={s.r[3]} radius={60} stroke={14} color="#4ADE80" />
            ))}
          </Phone>
        </div>
        {EDIT_SPOTS.map((s, i) => (
          <Headline key={i} lines={s.title} at={s.at} out={s.out - 2} y={372} size={64} color={C.ink} />
        ))}
      </Scene>

      {/* 3 · story styles flip on the beat */}
      <Scene from={280} to={424}>
        <div style={{position: 'absolute', inset: 0, perspective: 2200}}>
          {STYLES.map((st, i) => {
            const a = FLIP0 + i * FLIP;
            const z = a + FLIP;
            if (f < a - 1 || f >= z + (i === STYLES.length - 1 ? 30 : 0)) return null;
            const inP = interpolate(f, [a, a + 8], [90, 0], {...clamp, easing: ease.out});
            const outP = i === STYLES.length - 1 ? 0 : interpolate(f, [z - 6, z], [0, -90], {...clamp, easing: ease.in});
            const h = 900;
            const w = h * (st.w / st.h);
            return (
              <div key={i} style={{position: 'absolute', left: 540 - w / 2, top: 1000 - h / 2, width: w, height: h, borderRadius: 36, overflow: 'hidden', boxShadow: '0 40px 80px rgba(15,23,42,0.3)', transform: `rotateY(${inP + outP}deg)`}}>
                <Img src={src(st.img)} style={{width: w, height: h}} />
              </div>
            );
          })}
        </div>
        {STYLES.map((st, i) => (
          <Pill key={i} text={st.label} at={FLIP0 + i * FLIP + 4} out={FLIP0 + (i + 1) * FLIP - 3 + (i === STYLES.length - 1 ? 26 : 0)} cx={540} y={1482} size={36} pad={[16, 40]} bg={C.ink} />
        ))}
        <Headline lines={['Har mood ka *style.*']} at={286} out={414} y={372} size={70} color={C.ink} />
      </Scene>

      {/* 4 · share */}
      <Scene from={418} to={462}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${interpolate(ed2, [0, 1], [1400, 0])}px)`}}>
          <Phone cx={540} cy={1180} width={600} screen={UI.storyEditor} screenH={SCREEN_H[UI.storyEditor]} screenBg="#0B0F12" glass={<Tap at={440} x={1044} y={3234} r={240} />} />
        </div>
      </Scene>

      <StoryChrome />

      <Ira
        x={540}
        y={1760}
        size={720}
        enter="rise"
        enterAt={-6}
        emote={[[-6, 'phone'], [62, 'celebrate'], [128, 'present'], [196, 'surprised'], [240, 'thumbsup'], [284, 'celebrate'], [420, 'phone']]}
        hops={[64, 196, FLIP0 + FLIP * 2, FLIP0 + FLIP * 4, 442]}
        moveX={[[56, 540], [76, 880], [416, 880], [430, 190]]}
        moveY={[[56, 1760], [76, 1760]]}
        scaleKeys={[[56, 1], [76, 0.46]]}
        exitAt={452}
        exit="down"
        shadow={false}
      />

      <Scene from={454} to={AD10_DURATION}>
        <Reveal at={454} dur={14} from="top">
          <EndCard at={458} bg="warm" tagline={['Plate se story tak,', '*ek tap.*']} iraEnter="drop" iraHop={500} emote={[[458, 'phone'], [508, 'celebrate']]} />
        </Reveal>
      </Scene>

      <Grain opacity={0.045} vignette={0} />
      <Cues
        cues={[
          [0, 'pop', 0.45],
          [26, 'tap', 0.9],
          [28, 'impact', 0.5],
          [30, 'whoosh', 0.35],
          [62, 'chime', 0.35],
          [70, 'swish', 0.3],
          [128, 'whoosh', 0.45],
          ...EDIT_SPOTS.map((s) => [s.at, 'tick', 0.4] as [number, SfxName, number]),
          ...STYLES.map((_, i) => [FLIP0 + i * FLIP, 'swish', 0.45] as [number, SfxName, number]),
          [418, 'whoosh', 0.4],
          [440, 'tap', 0.85],
          [442, 'success', 0.5],
          [454, 'whoosh', 0.4],
          [500, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};
