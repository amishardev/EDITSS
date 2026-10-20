import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SCREEN_H, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Grain, Reveal, Scene, Spot, Tap} from '../components/Stage';
import {Headline, Pill, Sub} from '../components/Text';
import {C, clamp, ease, F, prog, spr, track} from '../theme';

/**
 * AD 08 · "Sirf tumhare liye" (personalised onboarding)
 * Photocopied generic diet charts slam in; IRA sweeps them away. Then a
 * swipe carousel through the real onboarding (goal, how you eat, age) that
 * lands on the real "Your plan is ready" screen.
 * Music: theme-ad08, light and friendly; groove from the carousel.
 */
export const AD08_DURATION = 600;

type Page = {screen: string; kicker: string; title: string[]; from: number; spots: {at: number; out: number; r: [number, number, number, number]}[]};

const PAGES: Page[] = [
  {
    screen: UI.goal, kicker: '1 · Goal', title: ['Tumhara *goal.*'], from: 112,
    spots: [
      {at: 122, out: 138, r: [90, 1030, 1440, 340]},
      {at: 140, out: 156, r: [90, 1420, 1440, 340]},
      {at: 158, out: 174, r: [90, 1860, 1440, 470]},
      {at: 176, out: 190, r: [90, 2390, 1440, 340]},
    ],
  },
  {screen: UI.diet, kicker: '2 · Khana', title: ['Tumhara *khana.*'], from: 200, spots: [{at: 212, out: 278, r: [90, 1030, 690, 760]}]},
  {screen: UI.age, kicker: '3 · Body', title: ['Tumhari *body.*'], from: 288, spots: [{at: 300, out: 366, r: [20, 940, 1586, 560]}]},
  {screen: UI.planMaintain, kicker: 'Plan ready', title: ['Tumhara *plan.*'], from: 376, spots: [{at: 396, out: 462, r: [40, 2090, 1546, 320]}]},
];
const SWIPES = [196, 284, 372];

const Chart: React.FC<{at: number; rot: number; dx: number; dy: number; outAt: number}> = ({at, rot, dx, dy, outAt}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 12, stiffness: 260, mass: 0.7});
  const out = prog(f, outAt, outAt + 12, ease.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - 270 + dx,
        top: 560 + dy,
        width: 540,
        height: 700,
        borderRadius: 18,
        background: '#F4F2EE',
        boxShadow: '0 30px 60px rgba(15,23,42,0.22)',
        padding: 46,
        boxSizing: 'border-box',
        fontFamily: F.body,
        transform: `translateX(${-out * 1300}px) rotate(${rot - out * 25}deg) scale(${interpolate(s, [0, 1], [1.6, 1])})`,
        opacity: interpolate(f, [at, at + 3], [0, 1], clamp),
        filter: 'grayscale(1)',
      }}
    >
      <div style={{fontSize: 40, fontWeight: 700, color: '#6B7280'}}>Diet chart</div>
      <div style={{fontSize: 26, color: '#9CA3AF', marginTop: 4}}>Same for everyone</div>
      {[0.9, 0.7, 0.8, 0.6, 0.85, 0.5, 0.75, 0.65].map((w, i) => (
        <div key={i} style={{height: 18, width: `${w * 100}%`, borderRadius: 9, background: '#D6D3CE', marginTop: i % 2 ? 18 : 34}} />
      ))}
      <div style={{position: 'absolute', right: 34, bottom: 44, padding: '10px 22px', border: '5px solid #B8B3AB', borderRadius: 12, color: '#B8B3AB', fontWeight: 800, fontSize: 30, transform: 'rotate(-12deg)'}}>COPY</div>
    </div>
  );
};

export const Ad08Personal: React.FC = () => {
  const f = useCurrentFrame();
  // carousel position: page index as a float, eased on each swipe
  const idx = track(f, [[0, 0], ...SWIPES.flatMap((s, i) => [[s, i], [s + 14, i + 1]] as [number, number][])]);
  const enter = spr(f, 98, {damping: 16, stiffness: 110});
  const leave = prog(f, 466, 480, ease.in);
  const page = Math.min(3, Math.round(idx));

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="ad08" duration={AD08_DURATION} volume={0.55} />
      <Bg kind="warm" glow={[540, 1000]} />

      {/* hook: everyone gets the same photocopy */}
      <Scene from={0} to={70}>
        <Chart at={0} rot={-7} dx={-40} dy={30} outAt={44} />
        <Chart at={5} rot={5} dx={30} dy={0} outAt={48} />
        <Chart at={10} rot={-2} dx={0} dy={50} outAt={52} />
        <Headline lines={['Sabke liye *ek hi*', 'diet chart?']} at={0} out={50} y={250} size={78} color={C.ink} accent={C.haldi} />
      </Scene>
      <Headline lines={['Na.', '*Tumhare* hisaab se.']} at={58} out={104} y={360} size={92} color={C.ink} />

      {/* carousel of the real onboarding */}
      <Scene from={96} to={486}>
        {PAGES.map((p, i) => {
          const d = i - idx;
          if (Math.abs(d) > 1.6) return null;
          const cx = 540 + d * 690 + interpolate(enter, [0, 1], [1200, 0]) - leave * 1400;
          const sc = 1 - Math.min(1, Math.abs(d)) * 0.16;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transformOrigin: `${cx}px 1110px`, transform: `scale(${sc})`, opacity: 1 - Math.min(1, Math.abs(d)) * 0.45}}>
              <Phone cx={cx} cy={1110} width={560} screen={p.screen} screenH={SCREEN_H[p.screen]}>
                {p.spots.map((s, j) => (
                  <Spot key={j} at={s.at} out={s.out} x={s.r[0]} y={s.r[1]} w={s.r[2]} h={s.r[3]} radius={56} stroke={14} />
                ))}
                {SWIPES[i] && <Tap at={SWIPES[i] - 6} x={813} y={3130} r={220} color="rgba(255,255,255,0.95)" />}
              </Phone>
            </div>
          );
        })}
        {PAGES.map((p, i) => (
          <React.Fragment key={i}>
            <Pill text={p.kicker} at={p.from + 2} out={(SWIPES[i] ?? 466) - 2} cx={540} y={236} size={32} pad={[14, 34]} bg={i === 3 ? C.leaf : C.teal} shadow={false} />
            <Headline lines={p.title} at={p.from + 4} out={(SWIPES[i] ?? 466) - 4} y={318} size={88} color={C.ink} />
          </React.Fragment>
        ))}
        {/* progress dots, like the app's step bar */}
        <div style={{position: 'absolute', left: 0, width: 1080, top: 1730, display: 'flex', justifyContent: 'center', gap: 14, opacity: enter * (1 - leave)}}>
          {PAGES.map((_, i) => (
            <div key={i} style={{width: i === page ? 54 : 16, height: 16, borderRadius: 8, background: i <= page ? C.teal : C.border}} />
          ))}
        </div>
        <Sub text="Estimate only, not medical advice." at={400} out={466} y={432} size={30} weight={500} />
      </Scene>

      <Ira
        x={540}
        y={1830}
        size={640}
        enter="peek"
        enterAt={8}
        emote={[[8, 'surprised'], [38, 'present'], [112, 'thinking'], [200, 'eating'], [288, 'thumbsup'], [376, 'celebrate']]}
        hops={[40, 212, 300, 392]}
        moveX={[[84, 540], [108, 160]]}
        moveY={[[84, 1830], [108, 1720]]}
        scaleKeys={[[84, 1], [108, 0.5]]}
        exitAt={470}
        exit="left"
      />

      <Scene from={474} to={AD08_DURATION}>
        <Reveal at={474} dur={16} from="right">
          <EndCard at={478} bg="warm" tagline={['Plan ho toh', '*apne* hisaab ka.']} iraEnter="pop" iraHop={514} emote={[[478, 'celebrate'], [528, 'wave']]} />
        </Reveal>
      </Scene>

      <Grain opacity={0.045} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.5],
          [5, 'impact', 0.4],
          [10, 'impact', 0.45],
          [10, 'pop', 0.4],
          [40, 'pop', 0.4],
          [44, 'whoosh', 0.5],
          [58, 'swish', 0.35],
          [98, 'whoosh', 0.4],
          ...PAGES[0].spots.map((s) => [s.at, 'tick', 0.35] as [number, SfxName, number]),
          ...SWIPES.flatMap((s) => [[s - 6, 'tap', 0.7], [s, 'swish', 0.4]] as [number, SfxName, number][]),
          [212, 'pop', 0.3],
          [300, 'tick', 0.35],
          [396, 'chime', 0.4],
          [466, 'whoosh', 0.45],
          [478, 'pop', 0.45],
          [514, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};
