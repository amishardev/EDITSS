import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {SCREEN_H, src, UI} from '../assets';
import {Logo} from '../components/Brand';
import {Bubble, Dots} from '../components/Bubble';
import {Ira} from '../components/Ira';
import {Phone, phonePoint} from '../components/Phone';
import {Cues, Music} from '../components/Sound';
import {Bg, Grain, Scene, ScreenCrop, Spot, Tap} from '../components/Stage';
import {Headline, Pill, Sub} from '../components/Text';
import {C, clamp, ease, lerp, prog, spr} from '../theme';

/**
 * AD 03 · "Nutrition ka doubt? IRA se pooch."
 * IRA in a clean studio asks the hook -> the user's real question floats in ->
 * it lands in the real IRA chat, revealed message by message -> the suggested
 * dinner card lifts out -> Add to dinner -> follow-up chips -> back to IRA.
 * Music: MIZRAB breakdown from 101.27s (calm, conversational).
 */
export const AD03_DURATION = 600;

const CHAT_H = SCREEN_H[UI.chat];
type R = {x: number; y: number; w: number; h: number};
// regions of the real chat screen (source px)
const REG: Record<'user' | 'reply' | 'card' | 'report' | 'chips', R> = {
  user: {x: 250, y: 930, w: 1376, h: 290},
  reply: {x: 40, y: 1250, w: 1360, h: 415},
  card: {x: 40, y: 1680, w: 1360, h: 810},
  report: {x: 40, y: 2540, w: 700, h: 120},
  chips: {x: 40, y: 2700, w: 1560, h: 390},
};
const REVEAL = {user: 142, reply: 184, card: 200, report: 210, chips: 392};

/** A piece of the real screen that slides into place over a blanked area. */
const Piece: React.FC<{r: R; at: number}> = ({r, at}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = spr(f, at, {damping: 15, stiffness: 150});
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, overflow: 'hidden', opacity: interpolate(f, [at, at + 5], [0, 1], clamp), transform: `translateY(${interpolate(s, [0, 1], [70, 0])}px)`}}>
      <Img src={src(UI.chat)} style={{position: 'absolute', left: -r.x, top: -r.y, width: 1626, height: CHAT_H}} />
    </div>
  );
};

const P = {cx: 540, cy: 1110, width: 620};
const LIFT = 236;
const LAND = 316;

export const Ad03AskIra: React.FC = () => {
  const f = useCurrentFrame();
  const phoneIn = spr(f, 112, {damping: 17, stiffness: 100});
  const phoneOut = prog(f, 440, 466, ease.in);
  const phoneY = interpolate(phoneIn, [0, 1], [1500, 0]) + phoneOut * 1600;

  // lifted dinner card (real crop of the chat screen)
  const up = spr(f, LIFT, {damping: 15, stiffness: 110});
  const down = prog(f, LAND, LAND + 14, ease.inOut);
  const t = up * (1 - down);
  const a = phonePoint({...P}, REG.card.x, REG.card.y);
  const b = phonePoint({...P}, REG.card.x + REG.card.w, REG.card.y + REG.card.h);
  const big = {x: 70, y: 470, w: 940};
  const lx = lerp(a.x, big.x, t);
  const ly = lerp(a.y, big.y, t);
  const lw = lerp(b.x - a.x, big.w, t);
  const end = f >= 444;

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music start={101.27} duration={AD03_DURATION} volume={0.62} />
      <Bg kind="warm" glow={[540, 1000]} />
      <AbsoluteFill style={{opacity: prog(f, 444, 470)}}>
        <Bg kind="green" glow={[540, 760]} />
      </AbsoluteFill>
      {/* soft studio light */}
      <AbsoluteFill style={{background: 'radial-gradient(500px 900px at 540px -100px, rgba(255,255,255,0.9), rgba(255,255,255,0))'}} />

      {/* A · hook bubbles */}
      <Bubble at={0} out={60} x={80} y={270} lines={['Nutrition ka', 'doubt?']} size={84} typing={9} />
      <Bubble at={28} out={60} x={500} y={500} lines={['IRA se *pooch.*']} kind="brand" tail="left" size={72} />

      {/* B · the question */}
      <Bubble at={66} out={124} x={1010} y={330} align="right" tail="right" kind="user" font="'Poppins', sans-serif" weight={500} lines={['What should I have', 'for dinner? Something', 'quick.']} size={60} />
      <Bubble at={84} out={118} x={600} y={720} lines={['']} size={44} typing={100} />

      {/* C · real chat */}
      <Scene from={112} to={470}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${phoneY}px)`}}>
          <Phone {...P} screen={UI.chat} screenH={CHAT_H}>
            {Object.entries(REG).map(([k, r]) => (
              <div key={k} style={{position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, background: '#fff'}} />
            ))}
            <Piece r={REG.user} at={REVEAL.user} />
            {f >= 154 && f < REVEAL.reply && (
              <div style={{position: 'absolute', left: 60, top: 1270, padding: '50px 60px', borderRadius: 60, background: C.off}}>
                <Dots f={f} size={70} color={C.sub} />
              </div>
            )}
            <Piece r={REG.reply} at={REVEAL.reply} />
            {f < LIFT + 4 || f > LAND + 10 ? <Piece r={REG.card} at={REVEAL.card} /> : null}
            <Piece r={REG.report} at={REVEAL.report} />
            <Piece r={REG.chips} at={REVEAL.chips} />
            <Tap at={340} x={636} y={2345} r={220} color="rgba(22,163,74,0.9)" />
            <Spot at={412} out={440} x={30} y={3160} w={1566} h={240} radius={120} stroke={14} />
          </Phone>
        </div>
        <AbsoluteFill style={{background: `rgba(250,248,245,${0.88 * t})`}} />
        {t > 0.001 && (
          <div style={{position: 'absolute', left: lx, top: ly, filter: `drop-shadow(0 40px 60px rgba(15,23,42,${0.3 * t}))`}}>
            <ScreenCrop screen={UI.chat} screenH={CHAT_H} rect={REG.card} width={lw} radius={lerp(14, 44, t)} style={{position: 'relative', background: '#fff'}} />
          </div>
        )}
        <Headline lines={['Seedha *sawaal.*']} at={136} out={196} y={232} size={68} color={C.ink} />
        <Headline lines={['Jawab, tere *khane*', 'ke hisaab se.']} at={200} out={330} y={214} size={64} color={C.ink} />
        <Sub text="Veg? Kal training? Sab dhyaan mein." at={LIFT + 16} out={LAND - 6} y={1060} size={34} />
        <Headline lines={['Ek tap. *Dinner* sorted.']} at={336} out={384} y={232} size={64} color={C.ink} />
        <Headline lines={['Kuch bhi pooch,', '*khane* ke baare mein.']} at={388} out={440} y={204} size={62} color={C.ink} />
      </Scene>

      {/* D · back to IRA */}
      <Ira
        x={540}
        y={1420}
        size={660}
        enter="rise"
        enterAt={0}
        hops={[30, 186, 342, 480]}
        tilt={[[66, 0], [80, -8], [104, -8], [116, 0]]}
        moveX={[[112, 540], [140, 150], [440, 150], [468, 540]]}
        moveY={[[112, 1420], [140, 1730], [440, 1730], [468, 1000]]}
        scaleKeys={[[112, 1], [140, 0.47], [440, 0.47], [468, 0.83]]}
      />
      {end && (
        <>
          <Bubble at={474} x={600} y={260} lines={['Ask *IRA.*']} size={78} tail="left" />
          <Logo at={486} cx={540} y={1048} width={440} />
          <Headline lines={['Your *nutrition* companion.']} at={498} y={1272} size={56} weight={700} color={C.ink} stagger={2} />
          <Pill text="Try Dietary Guide" at={510} cx={540} y={1410} size={46} pad={[30, 64]} />
          <Sub text="Food guidance, not medical advice." at={520} y={1572} size={28} weight={400} />
        </>
      )}

      <Grain opacity={0.04} vignette={0} />
      <Cues
        cues={[
          [0, 'pop', 0.5],
          [9, 'tick', 0.4],
          [28, 'pop', 0.45],
          [60, 'swish', 0.35],
          [66, 'tick', 0.4],
          [84, 'tick', 0.25],
          [112, 'whoosh', 0.45],
          [REVEAL.user, 'tick', 0.45],
          [REVEAL.reply, 'pop', 0.4],
          [REVEAL.card, 'chime', 0.35],
          [LIFT, 'whoosh', 0.4],
          [LAND, 'swish', 0.35],
          [340, 'tap', 0.8],
          [342, 'success', 0.5],
          [REVEAL.chips, 'tick', 0.4],
          [REVEAL.chips + 5, 'tick', 0.35],
          [REVEAL.chips + 10, 'tick', 0.3],
          [440, 'whoosh', 0.45],
          [474, 'pop', 0.5],
          [486, 'chime', 0.35],
        ]}
      />
    </AbsoluteFill>
  );
};
