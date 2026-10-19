import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {PHOTO, SCREEN_H, src, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music} from '../components/Sound';
import {Bg, Grain, Photo, Reveal, ScanBeam, Scene, ScreenCrop, Spot, Tap} from '../components/Stage';
import {Headline} from '../components/Text';
import {C, clamp, ease, prog, spr, track} from '../theme';

/**
 * AD 02 · "Packet ke peeche kya hai?"
 * Label close-up -> IRA notices -> scan-line wipe into the real label scanner
 * -> scan -> real Label result -> a lens pulls out each part of the result
 * (what it is, score + flags, IRA's swap) -> Add to snacks -> brand.
 * Music: MIZRAB from 125.64s (end of the breakdown into the second build).
 */
export const AD02_DURATION = 570;

const RESULT = 150;
const LABEL_H = SCREEN_H[UI.labelResult];

const LENS = [
  {at: 196, out: 268, kicker: ['Seedha *label* se.'], rect: {x: 30, y: 1190, w: 1566, h: 400}},
  {at: 272, out: 346, kicker: ['Score aur *flags*, saaf.'], rect: {x: 30, y: 1620, w: 1566, h: 610}},
  {at: 350, out: 424, kicker: ['Aur IRA ka *smart swap.*'], rect: {x: 30, y: 2790, w: 1566, h: 470}},
];

const Lens: React.FC<{at: number; out: number; rect: {x: number; y: number; w: number; h: number}}> = ({at, out, rect}) => {
  const f = useCurrentFrame();
  if (f < at - 2 || f > out + 12) return null;
  const s = spr(f, at, {damping: 15, stiffness: 140});
  const o = interpolate(f, [out, out + 10], [1, 0], clamp);
  const width = 960;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 345,
        width,
        transformOrigin: '50% 100%',
        transform: `translateY(${interpolate(s, [0, 1], [180, 0])}px) scale(${interpolate(s, [0, 1], [0.55, 1])})`,
        opacity: Math.min(o, interpolate(f, [at, at + 6], [0, 1], clamp)),
        filter: 'drop-shadow(0 30px 50px rgba(15,23,42,0.22))',
      }}
    >
      <div style={{position: 'relative', borderRadius: 40, background: '#fff', border: `6px solid ${C.leaf}`, overflow: 'hidden'}}>
        <ScreenCrop screen={UI.labelResult} screenH={LABEL_H} rect={rect} width={width - 12} radius={34} style={{position: 'relative'}} />
      </div>
    </div>
  );
};

export const Ad02LabelScan: React.FC = () => {
  const f = useCurrentFrame();
  const move = prog(f, 178, 200, ease.inOut);
  const P = {
    cx: 540,
    cy: interpolate(move, [0, 1], [1050, 1330]),
    width: interpolate(move, [0, 1], [640, 520]),
    scroll: track(f, [[424, 0], [446, 835]]),
  };
  const sheet = spr(f, RESULT, {damping: 18, stiffness: 110});
  const lensIdx = LENS.findIndex((l) => f >= l.at && f < l.out + 4);

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music start={125.64} duration={AD02_DURATION} volume={0.6} />

      {/* A · the label */}
      <Scene from={0} to={80}>
        <Photo file={PHOTO.labelPack} z={[[0, 1.32], [80, 1.22]]} y={[[0, 330], [80, 290]]} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,38,41,0.92) 0%, rgba(14,38,41,0.55) 30%, rgba(14,38,41,0) 52%, rgba(14,38,41,0.25) 100%)'}} />
        <Headline lines={['Packet ke', 'peeche', '*kya hai?*']} at={1} out={58} y={270} size={124} color={C.white} accent="#FFC960" />
        <Spot at={30} out={60} x={140} y={712} w={850} h={130} radius={30} color="#4ADE80" />
        <Ira x={230} y={1760} size={560} enter="left" enterAt={12} tilt={[[24, 0], [34, 9], [50, 9], [60, -4]]} exitAt={60} exit="left" />
      </Scene>

      {/* B..D · product */}
      <Scene from={56} to={460}>
        <Reveal at={56} dur={22} from="top">
          <Bg kind="green" glow={[540, 900]} />
          <Phone
            {...P}
            screen={UI.scannerLabel}
            screenH={3484}
            glass={
              <>
                <Tap at={84} x={625} y={2720} r={170} />
                <Tap at={102} x={815} y={3155} r={210} />
                <ScanBeam at={106} dur={44} x={0} y0={250} y1={2560} w={1626} loops={2} />
              </>
            }
          >
            {f >= RESULT && (
              <Img src={src(UI.labelResult)} style={{position: 'absolute', left: 0, top: 0, width: 1626, height: LABEL_H, transform: `translateY(${interpolate(sheet, [0, 1], [3500, 0])}px)`}} />
            )}
            {lensIdx >= 0 && (
              <Spot at={LENS[lensIdx].at} out={LENS[lensIdx].out} x={LENS[lensIdx].rect.x + 20} y={LENS[lensIdx].rect.y} w={LENS[lensIdx].rect.w - 40} h={LENS[lensIdx].rect.h} radius={60} stroke={14} />
            )}
            <Tap at={452} x={810} y={3970} r={240} />
          </Phone>
          {/* the wipe edge */}
          <div style={{position: 'absolute', left: 0, width: 1080, top: interpolate(f, [56, 78], [0, 1920], {...clamp, easing: ease.inOut}) - 6, height: 12, background: '#B9F6CF', boxShadow: `0 0 40px 12px ${C.leaf}`, opacity: f < 79 ? 1 : 0}} />
        </Reveal>

        <Headline lines={['Bas *label* scan karo.']} at={82} out={140} y={226} size={66} color={C.ink} />
        {LENS.map((l, i) => (
          <React.Fragment key={i}>
            <Headline lines={l.kicker} at={l.at} out={l.out} y={236} size={62} color={C.ink} accent={C.deep} />
            <Lens at={l.at + 4} out={l.out} rect={l.rect} />
          </React.Fragment>
        ))}
        <Headline lines={['Ek tap. *Snacks* mein add.']} at={430} out={456} y={236} size={60} color={C.ink} />

        <Ira x={900} y={1700} size={330} enter="right" enterAt={RESULT + 10} hops={[272, 350, 454]} tilt={[[170, 0], [190, -6], [270, -6], [290, 0]]} exitAt={456} exit="right" />
      </Scene>

      <Scene from={456} to={AD02_DURATION}>
        <Reveal at={456} dur={16} from="bottom">
          <EndCard at={460} bg="green" tagline={['Label padhna,', 'ab *aasaan.*']} iraEnter="right" iraHop={500} note="Read from the label. Check the pack if something looks off." />
        </Reveal>
      </Scene>

      <Grain opacity={0.045} vignette={0} />
      <Cues
        cues={[
          [0, 'impact', 0.65],
          [2, 'swish', 0.4],
          [14, 'whoosh', 0.35],
          [30, 'pop', 0.45],
          [56, 'scan', 0.4],
          [84, 'tap', 0.7],
          [102, 'tap', 0.8],
          [106, 'scan', 0.45],
          [118, 'riser', 0.3],
          [RESULT, 'impact', 0.6],
          [RESULT + 4, 'chime', 0.4],
          [200, 'pop', 0.35],
          [272, 'swish', 0.4],
          [276, 'tick', 0.4],
          [350, 'swish', 0.4],
          [354, 'pop', 0.4],
          [424, 'whoosh', 0.3],
          [452, 'tap', 0.8],
          [454, 'success', 0.5],
          [458, 'whoosh', 0.45],
          [462, 'pop', 0.45],
          [500, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};

