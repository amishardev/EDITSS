import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {PHOTO, src, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone, phonePoint} from '../components/Phone';
import {Cues, Music} from '../components/Sound';
import {Bg, Camera, Flash, Grain, Photo, Reveal, ScanBeam, Scene, Tap} from '../components/Stage';
import {Headline, Sub} from '../components/Text';
import {Check} from '../components/ui/Icons';
import {MealResult, PANEER_ROTI, TILE_RECTS} from '../components/ui/MealResult';
import {C, clamp, ease, F, lerp, prog, spr} from '../theme';

/**
 * AD 01 · "Bhai, plate mein hai kya?"
 * Food close-up -> it becomes the AI Scanner viewfinder -> shutter -> result
 * sheet with macros -> macros lift out full-screen -> Log lunch -> story card
 * -> brand. Music: theme-ad01, the drop lands on the result (f112).
 */
export const AD01_DURATION = 600;

const P = {cx: 540, cy: 1030, width: 640};
const DROP = 112;
const LIFT = 158; // tiles lift out of the phone
const LAND = 276; // tiles return

type R = {x: number; y: number; w: number; h: number};
const toCanvas = (r: R): R => {
  const a = phonePoint(P, r.x, r.y);
  const b = phonePoint(P, r.x + r.w, r.y + r.h);
  return {x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y};
};
const mix = (a: R, b: R, t: number): R => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t)});

const BIG: Record<'score' | 'cal' | 'prot' | 'carb' | 'fat', R> = {
  score: {x: 70, y: 470, w: 940, h: 230},
  cal: {x: 70, y: 730, w: 455, h: 240},
  prot: {x: 555, y: 730, w: 455, h: 240},
  carb: {x: 70, y: 1000, w: 455, h: 240},
  fat: {x: 555, y: 1000, w: 455, h: 240},
};

const LiftTile: React.FC<{k: 'cal' | 'prot' | 'carb' | 'fat'; label: string; value: string; unit: string; bg: string; delay: number}> = ({k, label, value, unit, bg, delay}) => {
  const f = useCurrentFrame();
  const up = spr(f, LIFT + delay, {damping: 15, stiffness: 110});
  const down = prog(f, LAND + delay * 0.5, LAND + 14 + delay * 0.5, ease.inOut);
  const t = up * (1 - down);
  if (t <= 0.001) return null;
  const r = mix(toCanvas(TILE_RECTS[k]), BIG[k], t);
  const sc = r.w / BIG[k].w;
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: BIG[k].w, height: BIG[k].h, transformOrigin: '0 0', transform: `scale(${sc})`, borderRadius: 40, background: bg, boxShadow: `0 30px 60px rgba(0,0,0,${0.3 * t})`, padding: '36px 40px', boxSizing: 'border-box', fontFamily: F.body}}>
      <div style={{fontSize: 36, fontWeight: 500, color: C.ink}}>{label}</div>
      <div style={{marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 12}}>
        <span style={{fontFamily: F.display, fontSize: 104, fontWeight: 700, letterSpacing: '-0.04em', color: C.ink}}>{value}</span>
        <span style={{fontSize: 40, color: C.sub}}>{unit}</span>
      </div>
    </div>
  );
};

const LiftScore: React.FC = () => {
  const f = useCurrentFrame();
  const up = spr(f, LIFT - 4, {damping: 15, stiffness: 110});
  const down = prog(f, LAND, LAND + 14, ease.inOut);
  const t = up * (1 - down);
  if (t <= 0.001) return null;
  const r = mix(toCanvas(TILE_RECTS.score), BIG.score, t);
  const sc = r.w / BIG.score.w;
  return (
    <div style={{position: 'absolute', left: r.x, top: r.y, width: BIG.score.w, height: BIG.score.h, transformOrigin: '0 0', transform: `scale(${sc})`, borderRadius: 44, background: C.teal, boxShadow: `0 0 0 3px rgba(255,255,255,${0.12 * t}), 0 30px 60px rgba(0,0,0,${0.35 * t})`, fontFamily: F.body, color: '#fff'}}>
      <div style={{position: 'absolute', left: 44, top: 48, fontSize: 34, opacity: 0.72}}>Health score</div>
      <div style={{position: 'absolute', left: 44, top: 92, fontFamily: F.display, fontSize: 40, fontWeight: 600}}>Paneer bhurji + 2 roti</div>
      <div style={{position: 'absolute', right: 44, top: 30, display: 'flex', alignItems: 'baseline'}}>
        <span style={{fontFamily: F.display, fontSize: 120, fontWeight: 700, letterSpacing: '-0.04em'}}>82</span>
        <span style={{fontSize: 44, opacity: 0.7}}>/100</span>
      </div>
      <div style={{position: 'absolute', left: 44, right: 44, bottom: 40, height: 18, borderRadius: 9, background: '#375559'}}>
        <div style={{width: '82%', height: '100%', borderRadius: 9, background: `linear-gradient(90deg, #F59E0B, ${C.scoreBar})`}} />
      </div>
    </div>
  );
};

/** Motion-graphic confirmation (outside the UI) after tapping Log lunch. */
const CheckBurst: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 34) return null;
  const s = spr(f, at, {damping: 10, stiffness: 200});
  const o = interpolate(f, [at + 24, at + 34], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, background: C.leaf, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, opacity: o, boxShadow: '0 16px 40px rgba(22,163,74,0.45)'}}>
      <Check size={72} color="#fff" stroke={3.2} />
    </div>
  );
};

export const Ad01Plate: React.FC = () => {
  const f = useCurrentFrame();
  const result = f >= DROP;
  const dim = interpolate(f, [LIFT - 6, LIFT + 10, LAND, LAND + 16], [0, 1, 1, 0], clamp);
  // phone exits left as the story card arrives
  const storyT = spr(f, 352, {damping: 17, stiffness: 100});
  const phoneShift = interpolate(storyT, [0, 1], [0, -250]);
  const phoneRot = interpolate(storyT, [0, 1], [0, -7]);
  const phoneScale = interpolate(storyT, [0, 1], [1, 0.84]);
  const pressAt = 318;

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="ad01" duration={AD01_DURATION} />

      {/* A · food hook */}
      <Scene from={0} to={66}>
        <Photo file={PHOTO.rotiPaneer} z={[[0, 1.22], [66, 1.08]]} y={[[0, -20], [66, 10]]} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,20,22,0.78) 0%, rgba(7,20,22,0.2) 34%, rgba(7,20,22,0) 55%, rgba(7,20,22,0.35) 100%)'}} />
        <Headline lines={['Bhai,', 'plate mein', 'hai *kya?*']} at={1} out={50} y={270} size={132} color={C.white} accent="#FFC960" stagger={3} shadow="0 6px 30px rgba(0,0,0,0.35)" />
        <Ira x={790} y={1790} size={640} enter="peek" enterAt={14} exitAt={50} exit="down" tilt={[[30, 0], [40, -9], [52, -9]]} />
      </Scene>

      {/* B..F · product */}
      <Scene from={50} to={480}>
        <Bg kind="warm" glow={[540, 900]} />
        <Camera
          z={[[50, 1.66], [98, 1]]}
          y={[[50, 1030], [98, 960]]}
        >
          <div style={{position: 'absolute', inset: 0, transformOrigin: `${P.cx}px ${P.cy}px`, transform: `translateX(${phoneShift}px) rotate(${phoneRot}deg) scale(${phoneScale})`}}>
            <Phone
              {...P}
              screen={result ? undefined : UI.scannerFood}
              screenH={3484}
              glass={
                <>
                  <ScanBeam at={100} dur={14} x={0} y0={260} y1={2600} w={1626} />
                  <Tap at={96} x={815} y={3155} r={210} />
                </>
              }
            >
              {result && <MealResult data={PANEER_ROTI} sheetAt={DROP} tilesAt={DROP + 12} logPressAt={pressAt} />}
              {result && <Tap at={pressAt} x={1053} y={3125} r={240} color="rgba(255,255,255,0.95)" />}
            </Phone>
          </div>
          <Flash at={98} dur={9} peak={0.85} />
        </Camera>
        {/* photo-to-viewfinder crossfade */}
        <AbsoluteFill style={{opacity: interpolate(f, [50, 60], [1, 0], clamp), filter: `blur(${interpolate(f, [50, 60], [0, 14], clamp)}px)`}}>
          <Photo file={PHOTO.rotiPaneer} z={[[50, 1.08], [60, 0.8]]} />
        </AbsoluteFill>

        <Headline lines={['Bas ek *photo.*']} at={86} out={106} y={200} size={78} weight={800} color={C.ink} />

        {/* macros lift out of the phone */}
        <AbsoluteFill style={{background: `rgba(14,38,41,${0.9 * dim})`}} />
        <LiftScore />
        <LiftTile k="cal" label="Calories" value="420" unit="kcal" bg={C.tileCal} delay={0} />
        <LiftTile k="prot" label="Protein" value="25" unit="g" bg={C.tileProt} delay={4} />
        <LiftTile k="carb" label="Carbs" value="48" unit="g" bg={C.tileCarb} delay={8} />
        <LiftTile k="fat" label="Fat" value="14" unit="g" bg={C.tileFat} delay={12} />
        <Headline lines={['Ek photo.', 'Poora *breakdown.*']} at={LIFT + 8} out={LAND - 8} y={246} size={84} color={C.white} accent="#4ADE80" />
        <Sub text="AI estimate. Tap any value to correct it." at={LIFT + 30} out={LAND - 8} y={1272} size={34} color="rgba(255,255,255,0.75)" />

        <Ira x={150} y={1690} size={360} enter="left" enterAt={80} hops={[DROP + 14, LIFT + 30, pressAt + 4]} tilt={[[84, 7], [112, 0]]} exitAt={346} exit="left" />
        <CheckBurst at={pressAt + 2} x={phonePoint(P, 1053, 3125).x} y={phonePoint(P, 1053, 3125).y - 150} />

        <Headline lines={['Ek tap. *Logged.*']} at={304} out={348} y={226} size={76} color={C.ink} />

        {/* story card: Share to Story uses the same meal */}
        {f >= 344 && (
          <div
            style={{
              position: 'absolute',
              left: 600 - 250,
              top: 1010 - 445,
              width: 500,
              height: 890,
              borderRadius: 44,
              overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(15,23,42,0.35)',
              transform: `translateX(${interpolate(storyT, [0, 1], [900, 190])}px) rotate(${interpolate(storyT, [0, 1], [18, 5])}deg)`,
            }}
          >
            <Img src={src(UI.storyMeal)} style={{width: 500, height: 890}} />
          </div>
        )}
        <Headline lines={['Log karo.', '*Share* karo.']} at={364} out={466} y={210} size={88} color={C.ink} />
      </Scene>

      {/* G · brand */}
      <Scene from={470} to={AD01_DURATION}>
        <Reveal at={470} dur={18} from="circle" cx={540} cy={760}>
          <EndCard at={476} bg="warm" tagline={['Snap your plate.', "Know what you're *eating.*"]} iraEnter="drop" iraHop={520} />
        </Reveal>
      </Scene>

      <Grain opacity={0.045} vignette={0} />

      <Cues
        cues={[
          [0, 'impact', 0.7],
          [2, 'swish', 0.4],
          [16, 'pop', 0.55],
          [48, 'whoosh', 0.5],
          [80, 'pop', 0.4],
          [76, 'riser', 0.35],
          [96, 'tap', 0.8],
          [98, 'scan', 0.45],
          [DROP, 'impact', 0.75],
          [DROP + 12, 'chime', 0.4],
          [DROP + 14, 'tick', 0.4],
          [DROP + 19, 'tick', 0.4],
          [DROP + 24, 'tick', 0.4],
          [DROP + 29, 'tick', 0.4],
          [LIFT, 'whoosh', 0.45],
          [LIFT + 30, 'pop', 0.35],
          [LAND, 'swish', 0.4],
          [pressAt, 'tap', 0.8],
          [pressAt + 2, 'success', 0.55],
          [350, 'whoosh', 0.5],
          [468, 'whoosh', 0.5],
          [478, 'pop', 0.5],
          [520, 'sparkle', 0.45],
        ]}
      />
    </AbsoluteFill>
  );
};
