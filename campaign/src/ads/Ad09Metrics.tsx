import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {BRAND, SCREEN_H, src, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music, SfxName} from '../components/Sound';
import {Bg, Grain, Reveal, Scene, ScreenCrop, Spot} from '../components/Stage';
import {Headline} from '../components/Text';
import {Check} from '../components/ui/Icons';
import {C, clamp, ease, F, prog, spr, track} from '../theme';

/**
 * AD 09 · "Numbers ka confusion?" (Metrics)
 * A cloud of jargon around a thinking IRA gets sucked into the real Metrics
 * screen. BMR, TDEE and Target are lifted out and decoded into plain
 * Hinglish, then IRA's four real recommendations tick off one by one.
 * Music: theme-ad09, thoughtful kalimba into a light groove.
 */
export const AD09_DURATION = 600;

const JARGON: {w: string; x: number; y: number; s: number; r: number}[] = [
  {w: 'BMR', x: 150, y: 640, s: 96, r: -8},
  {w: 'TDEE', x: 720, y: 600, s: 104, r: 6},
  {w: 'kcal/day', x: 90, y: 880, s: 58, r: 4},
  {w: 'macros', x: 760, y: 860, s: 64, r: -5},
  {w: 'maintenance?', x: 560, y: 1060, s: 52, r: 3},
  {w: 'target?', x: 120, y: 1100, s: 60, r: -4},
  {w: 'deficit?', x: 760, y: 1220, s: 56, r: 7},
];

const P = {cx: 540, cy: 1320, width: 520};
const DECODE = [
  {at: 150, rect: {x: 30, y: 1150, w: 540, h: 320}, term: 'BMR', plain: 'Aaram karte hue bhi body jitni energy use karti hai.'},
  {at: 212, rect: {x: 556, y: 1150, w: 540, h: 320}, term: 'TDEE', plain: 'Poore din ka total energy kharcha.'},
  {at: 274, rect: {x: 1080, y: 1150, w: 520, h: 320}, term: 'Target', plain: 'Tumhara roz ka calorie goal.'},
];
const TIPS = ["Keep logging every meal. It's working.", 'Add 30 minutes of walking most days', 'Aim for 2.5–3 litres of water', 'Sleep 7–8 hours to curb late cravings'];
const TIP_AT = [372, 392, 412, 432];

/** Text that resolves from scrambled glyphs, left to right. */
const Decode: React.FC<{text: string; at: number; dur?: number}> = ({text, at, dur = 22}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], clamp);
  const glyphs = 'abcdefghkmnoprstuvxyz0123456789';
  const shown = Math.floor(p * text.length);
  return (
    <span>
      {text.split('').map((ch, i) => {
        if (i < shown || ch === ' ') return ch;
        if (f < at) return '';
        return glyphs[(i * 7 + Math.floor(f / 2) * 13) % glyphs.length];
      })}
    </span>
  );
};

export const Ad09Metrics: React.FC = () => {
  const f = useCurrentFrame();
  const suck = prog(f, 70, 92, ease.in);
  const phoneIn = spr(f, 84, {damping: 16, stiffness: 100});
  const phoneOut = prog(f, 352, 368, ease.in);
  const scroll = track(f, [[326, 0], [346, 1500]]);
  const card = spr(f, 356, {damping: 15, stiffness: 120}) * (1 - prog(f, 460, 474, ease.in));

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="ad09" duration={AD09_DURATION} volume={0.55} />
      <Bg kind="warm" glow={[540, 1000]} />

      {/* hook: jargon cloud */}
      <Scene from={0} to={96}>
        {JARGON.map((j, i) => {
          const s = spr(f, i * 2 - 4, {damping: 12, stiffness: 180});
          const drift = Math.sin((f + i * 20) / 18) * 10;
          const tx = (P.cx - j.x - 100) * suck;
          const ty = (P.cy - j.y) * suck;
          return (
            <div key={i} style={{position: 'absolute', left: j.x, top: j.y, fontFamily: F.display, fontWeight: 800, fontSize: j.s, color: i % 3 === 0 ? C.teal : i % 3 === 1 ? C.sub : C.haldi, letterSpacing: '-0.03em', opacity: s * (1 - suck), transform: `translate(${tx}px, ${ty + drift}px) rotate(${j.r + drift * 0.3}deg) scale(${s * (1 - suck * 0.8)})`}}>
              {j.w}
            </div>
          );
        })}
        <Headline lines={['Numbers ka', '*confusion?*']} at={0} out={78} y={260} size={92} color={C.ink} accent={C.haldi} />
      </Scene>

      {/* real Metrics screen */}
      <Scene from={84} to={372}>
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${interpolate(phoneIn, [0, 1], [1400, 0]) + phoneOut * 1500}px)`}}>
          <Phone {...P} scroll={scroll} screen={UI.metrics} screenH={SCREEN_H[UI.metrics]}>
            {DECODE.map((d, i) => (
              <Spot key={i} at={d.at} out={d.at + 58} x={d.rect.x + 10} y={d.rect.y + 10} w={d.rect.w - 20} h={d.rect.h - 20} radius={50} stroke={14} />
            ))}
            <Spot at={340} out={360} x={40} y={2330} w={1546} h={560} radius={50} stroke={14} />
          </Phone>
        </div>
        {DECODE.map((d, i) => {
          if (f < d.at || f > d.at + 62) return null;
          const s = spr(f, d.at, {damping: 14, stiffness: 150});
          const o = interpolate(f, [d.at + 52, d.at + 60], [1, 0], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: 60, top: 268, width: 960, height: 400, borderRadius: 44, background: '#fff', boxShadow: '0 30px 60px rgba(15,23,42,0.16)', opacity: o, transform: `translateY(${interpolate(s, [0, 1], [120, 0])}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`}}>
              <ScreenCrop screen={UI.metrics} screenH={SCREEN_H[UI.metrics]} rect={d.rect} width={380} radius={30} style={{left: 34, top: 34, border: `5px solid ${C.leaf}`}} />
              <div style={{position: 'absolute', left: 452, top: 54, right: 40, fontFamily: F.display, fontWeight: 800, fontSize: 64, color: C.ink, letterSpacing: '-0.03em'}}>{d.term}</div>
              <div style={{position: 'absolute', left: 452, top: 148, right: 40, fontFamily: F.body, fontWeight: 600, fontSize: 40, lineHeight: 1.3, color: C.deep}}>
                <Decode text={d.plain} at={d.at + 8} />
              </div>
            </div>
          );
        })}
      </Scene>

      {/* IRA's real recommendations */}
      <Scene from={350} to={480}>
        <AbsoluteFill style={{background: `rgba(220,252,231,${0.9 * card})`}} />
        <Headline lines={['Aur IRA ki', '*simple* tips.']} at={360} out={462} y={250} size={84} color={C.ink} />
        {card > 0.001 && (
          <div style={{position: 'absolute', left: 60, top: 560, width: 960, borderRadius: 48, background: '#fff', padding: '46px 50px 30px', boxSizing: 'border-box', boxShadow: '0 40px 80px rgba(15,23,42,0.18)', fontFamily: F.body, transform: `translateY(${(1 - card) * 400}px) scale(${0.85 + card * 0.15})`, opacity: card}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 44, fontWeight: 600, color: C.ink}}>
              <Img src={src(BRAND.iraAvatar)} style={{width: 64, height: 64}} />
              Ira recommends
            </div>
            {TIPS.map((t, i) => {
              const s = spr(f, TIP_AT[i], {damping: 10, stiffness: 240});
              const on = f >= TIP_AT[i];
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '24px 0', borderTop: i ? `2px solid ${C.border}` : undefined, marginTop: i ? 0 : 22, opacity: interpolate(f, [TIP_AT[i] - 10, TIP_AT[i]], [0.35, 1], clamp)}}>
                  <div style={{width: 64, height: 64, flex: 'none', borderRadius: 32, background: on ? C.leaf : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? 0.7 + 0.3 * s : 1})`}}>
                    {on && <Check size={40} color="#fff" stroke={3.4} />}
                  </div>
                  <div style={{fontSize: 38, color: C.ink, lineHeight: 1.25}}>{t}</div>
                </div>
              );
            })}
          </div>
        )}
      </Scene>

      <Ira
        x={540}
        y={1640}
        size={640}
        enter="rise"
        enterAt={-4}
        emote={[[-4, 'thinking'], [70, 'present'], [150, 'thinking'], [212, 'surprised'], [274, 'present'], [356, 'thumbsup']]}
        hops={[84, 212, ...TIP_AT]}
        tilt={[[0, 0], [20, -6], [60, -6], [70, 0]]}
        moveX={[[80, 540], [104, 150]]}
        moveY={[[80, 1640], [104, 1740]]}
        scaleKeys={[[80, 1], [104, 0.48]]}
        exitAt={466}
        exit="left"
      />

      <Scene from={472} to={AD09_DURATION}>
        <Reveal at={472} dur={16} from="circle" cx={540} cy={1000}>
          <EndCard at={476} bg="green" tagline={['Numbers samjho,', '*bina* stress.']} iraEnter="pop" iraHop={520} note="Estimates, not a medical assessment." emote={[[476, 'celebrate'], [530, 'thumbsup']]} />
        </Reveal>
      </Scene>

      <Grain opacity={0.045} vignette={0} />
      <Cues
        cues={[
          ...JARGON.map((_, i) => [Math.max(0, i * 2 - 4), 'tick', 0.3] as [number, SfxName, number]),
          [2, 'pop', 0.4],
          [70, 'whoosh', 0.5],
          [84, 'swish', 0.35],
          ...DECODE.flatMap((d) => [[d.at, 'pop', 0.35], [d.at + 8, 'scan', 0.25], [d.at + 30, 'chime', 0.25]] as [number, SfxName, number][]),
          [340, 'swish', 0.3],
          [356, 'whoosh', 0.4],
          ...TIP_AT.map((t) => [t, 'tick', 0.45] as [number, SfxName, number]),
          [472, 'whoosh', 0.45],
          [476, 'pop', 0.45],
          [520, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};
