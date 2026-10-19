import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PHOTO, SCREEN_H, UI} from '../assets';
import {EndCard} from '../components/Brand';
import {Ira} from '../components/Ira';
import {Phone} from '../components/Phone';
import {Cues, Music} from '../components/Sound';
import {Bg, FocusCrop, Grain, Reveal, Scene, ScreenCrop} from '../components/Stage';
import {Count, Headline, Sub} from '../components/Text';
import {BEAT, C, clamp, ease, F, prog, spr, track} from '../theme';

/**
 * AD 04 · "Apna khana. Better awareness."
 * Beat-cut strip montage of real Indian meals -> three-strip collage with IRA
 * -> the real Home screen + Today's nutrition rings -> IRA's insight ->
 * "Snap. Log. Samjho." on stabs -> brand. Music: theme-ad04 (tabla-led groove).
 */
export const AD04_DURATION = 570;

type Crop = {file: string; iw: number; ih: number; fx: number; fy: number; zoom: number};
const FOOD: Record<string, Crop> = {
  roti: {file: PHOTO.rotiPaneer, iw: 1080, ih: 1917, fx: 330, fy: 820, zoom: 1.45},
  paneer: {file: PHOTO.rotiPaneer, iw: 1080, ih: 1917, fx: 860, fy: 1480, zoom: 1.9},
  sabzi: {file: PHOTO.rotiPaneer, iw: 1080, ih: 1917, fx: 900, fy: 470, zoom: 1.9},
  thali: {file: PHOTO.iraThali, iw: 1080, ih: 1350, fx: 600, fy: 860, zoom: 1.8},
  rajma: {file: PHOTO.iraDalChawal, iw: 1080, ih: 1350, fx: 700, fy: 930, zoom: 1.55},
};

const CUTS: {at: number; crop: Crop; word: string}[] = [
  {at: -14, crop: FOOD.roti, word: 'Roti.'},
  {at: Math.round(BEAT * 2), crop: FOOD.paneer, word: 'Paneer.'},
  {at: Math.round(BEAT * 4), crop: FOOD.thali, word: 'Thali.'},
  {at: Math.round(BEAT * 6), crop: FOOD.rajma, word: 'Rajma-chawal.'},
];

/** Photo arriving as three vertical strips, staggered (the ad's signature cut). */
const StripCut: React.FC<{at: number; crop: Crop; dir?: 1 | -1}> = ({at, crop, dir = 1}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const p = interpolate(f, [at + i * 2, at + i * 2 + 9], [0, 1], {...clamp, easing: ease.out});
        const off = (1 - p) * 1920 * (i % 2 === 0 ? dir : -dir);
        return (
          <div key={i} style={{position: 'absolute', left: i * 360, top: 0, width: 360, height: 1920, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: -i * 360, top: off}}>
              <FocusCrop {...crop} w={1080} h={1920} zoom={crop.zoom * (1 + (f - at) * 0.002)} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const RINGS = [
  {label: 'Protein', v: 34, of: '147g', pct: 23, color: '#16A34A'},
  {label: 'Calories', v: 895, of: '2,356', pct: 38, color: '#D99A2B'},
  {label: 'Carbs', v: 154, of: '265g', pct: 58, color: '#6C7FD8'},
  {label: 'Fat', v: 19, of: '79g', pct: 24, color: '#C2649A'},
];

const RingCard: React.FC<{i: number; at: number; out: number}> = ({i, at, out}) => {
  const f = useCurrentFrame();
  const r = RINGS[i];
  const s = spr(f, at, {damping: 14, stiffness: 140});
  const fill = interpolate(f, [at + 4, at + 30], [0, r.pct / 100], {...clamp, easing: ease.out});
  const o = interpolate(f, [out, out + 10], [1, 0], clamp);
  const R = 52;
  const L = 2 * Math.PI * R;
  return (
    <div
      style={{
        position: 'absolute',
        left: 620,
        top: 560 + i * 196,
        width: 400,
        height: 176,
        borderRadius: 36,
        background: '#fff',
        border: `3px solid ${C.border}`,
        boxShadow: '0 20px 40px rgba(15,23,42,0.10)',
        fontFamily: F.body,
        opacity: o * interpolate(f, [at, at + 5], [0, 1], clamp),
        transform: `translateX(${interpolate(s, [0, 1], [240, 0])}px)`,
      }}
    >
      <div style={{position: 'absolute', left: 34, top: 30, fontSize: 34, fontWeight: 600, color: C.ink}}>{r.label}</div>
      <div style={{position: 'absolute', left: 34, top: 86, fontSize: 44, fontWeight: 600, color: C.ink}}>
        <Count to={r.v} at={at + 4} dur={26} />
        <span style={{fontSize: 30, fontWeight: 400, color: C.sub}}> / {r.of}</span>
      </div>
      <svg width={130} height={130} style={{position: 'absolute', right: 26, top: 23}}>
        <circle cx={65} cy={65} r={R} fill="none" stroke={`${r.color}22`} strokeWidth={12} />
        <circle cx={65} cy={65} r={R} fill="none" stroke={r.color} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${L * fill} ${L}`} transform="rotate(-90 65 65)" />
        <text x={65} y={74} textAnchor="middle" fontFamily="Poppins" fontWeight={600} fontSize={26} fill={C.ink}>
          {Math.round(fill * 100)}%
        </text>
      </svg>
    </div>
  );
};

export const Ad04IndianFood: React.FC = () => {
  const f = useCurrentFrame();
  const collage = prog(f, 112, 124, ease.out);
  const stripsOut = prog(f, 204, 220, ease.in);
  const phoneIn = spr(f, 212, {damping: 17, stiffness: 100});
  const lift = spr(f, 334, {damping: 15, stiffness: 120}) * (1 - prog(f, 410, 422, ease.in));
  const SNAP = [420, 420 + Math.round(BEAT * 1), 420 + Math.round(BEAT * 2)];
  const snapIdx = SNAP.filter((s) => f >= s).length - 1;

  return (
    <AbsoluteFill style={{background: C.tealDark}}>
      <Music track="ad04" duration={AD04_DURATION} />

      {/* A · beat cuts */}
      <Scene from={0} to={124}>
        {CUTS.map((c, i) => (
          <StripCut key={i} at={c.at} crop={c.crop} dir={i % 2 === 0 ? 1 : -1} />
        ))}
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,38,41,0.75) 0%, rgba(14,38,41,0) 26%, rgba(14,38,41,0) 55%, rgba(14,38,41,0.82) 100%)'}} />
        <Sub text="Tumhara roz ka khana" at={0} y={276} size={46} color="rgba(255,255,255,0.92)" weight={600} />
        {CUTS.map((c, i) => (
          <Headline key={i} lines={[c.word]} at={Math.max(0, c.at + 3)} out={(CUTS[i + 1]?.at ?? 112) - 6} exitDur={5} y={1250} size={c.word.length > 8 ? 118 : 150} color={C.white} mode="pop" stagger={0} shadow="0 8px 40px rgba(0,0,0,0.4)" />
        ))}
      </Scene>

      {/* B · three-strip collage */}
      <Scene from={112} to={222}>
        {[FOOD.roti, FOOD.paneer, FOOD.sabzi].map((c, i) => {
          const pan = Math.sin((f - 112) / 30 + i) * 30;
          const outY = stripsOut * 1920 * (i % 2 === 0 ? -1 : 1);
          return (
            <div key={i} style={{position: 'absolute', left: i * 360 + 4, top: 0, width: 352, height: 1920, overflow: 'hidden', transform: `translateY(${(1 - collage) * (i % 2 ? 1920 : -1920) + outY}px)`}}>
              <div style={{position: 'absolute', left: -i * 360 + pan, top: 0}}>
                <FocusCrop {...c} w={1080} h={1920} zoom={c.zoom * 1.1} />
              </div>
            </div>
          );
        })}
        <AbsoluteFill style={{background: `rgba(14,38,41,${0.45 * (1 - stripsOut)})`}} />
        <div style={{position: 'absolute', left: 0, width: 1080, top: 620, height: 420, background: `linear-gradient(180deg, rgba(23,58,62,0) 0%, rgba(23,58,62,0.82) 22%, rgba(23,58,62,0.82) 78%, rgba(23,58,62,0) 100%)`, opacity: 1 - stripsOut}} />
        <Headline lines={['Apna khana.']} at={118} out={198} y={680} size={128} color={C.white} />
        <Headline lines={['Apna *routine.*']} at={150} out={198} y={840} size={112} color={C.white} accent="#4ADE80" />
      </Scene>

      {/* C · real Home screen + today's nutrition */}
      <Scene from={204} to={480}>
        <AbsoluteFill style={{opacity: prog(f, 204, 216)}}>
          <Bg kind="warm" glow={[400, 1000]} />
        </AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, perspective: 2400}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${interpolate(phoneIn, [0, 1], [-800, 0])}px) rotateY(${interpolate(phoneIn, [0, 1], [30, 12])}deg)`, transformOrigin: '320px 1100px'}}>
            <Phone cx={320} cy={1110} width={500} screen={UI.home} screenH={SCREEN_H[UI.home]} scroll={track(f, [[240, 0], [320, 560]])} />
          </div>
        </div>
        {RINGS.map((_, i) => (
          <RingCard key={i} i={i} at={244 + i * 7} out={330} />
        ))}
        <Headline lines={['Roz ka hisaab,', '*bina* guilt.']} at={220} out={328} y={218} size={70} color={C.ink} />

        {/* IRA's insight lifts out of Home */}
        <AbsoluteFill style={{background: `rgba(14,38,41,${0.86 * lift})`}} />
        {lift > 0.001 && (
          <div style={{position: 'absolute', left: 60, top: 720, transform: `translateY(${(1 - lift) * 300}px) scale(${0.6 + lift * 0.4})`, opacity: lift, filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.35))'}}>
            <ScreenCrop screen={UI.home} screenH={SCREEN_H[UI.home]} rect={{x: 60, y: 1640, w: 1506, h: 610}} width={960} radius={44} style={{position: 'relative'}} />
          </div>
        )}
        <Headline lines={['Protein kam?', '*Pata* chal jaata hai.']} at={340} out={408} y={290} size={76} color={C.white} accent="#4ADE80" />
        <Sub text="Supportive nudges, not judgement." at={356} out={408} y={1180} size={36} color="rgba(255,255,255,0.8)" />

        <Ira x={830} y={1730} size={330} enter="drop" enterAt={126} hops={[260, 344]} tilt={[[154, -7], [168, 7], [182, -5], [196, 0]]} moveX={[[126, 540], [212, 540], [232, 830]]} moveY={[[126, 1720], [212, 1720], [232, 1730]]} scaleKeys={[[126, 1.55], [212, 1.55], [232, 1]]} exitAt={414} exit="down" />
      </Scene>

      {/* E · Snap. Log. Samjho. */}
      <Scene from={418} to={474}>
        {[FOOD.paneer, FOOD.sabzi, FOOD.thali].map((c, i) =>
          snapIdx === i ? (
            <AbsoluteFill key={i}>
              <FocusCrop {...c} w={1080} h={1920} zoom={c.zoom * (1.05 + (f - SNAP[i]) * 0.004)} />
              <AbsoluteFill style={{background: 'rgba(14,38,41,0.55)'}} />
            </AbsoluteFill>
          ) : null,
        )}
        {['Snap.', 'Log.', '*Samjho.*'].map((w, i) => (
          <Headline key={i} lines={[w]} at={SNAP[i]} out={i < 2 ? SNAP[i + 1] - 5 : 466} exitDur={4} y={830} size={190} color={C.white} accent="#4ADE80" mode="pop" stagger={0} />
        ))}
      </Scene>

      <Scene from={470} to={AD04_DURATION}>
        <Reveal at={470} dur={14} from="left">
          <EndCard at={472} bg="teal" tagline={['Apna khana.', '*Better* awareness.']} iraEnter="rise" iraHop={512} />
        </Reveal>
      </Scene>

      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          ...CUTS.slice(1).map((c) => [c.at, 'swish', 0.45] as [number, 'swish', number]),
          [0, 'impact', 0.6],
          [112, 'whoosh', 0.45],
          [126, 'pop', 0.5],
          [204, 'whoosh', 0.45],
          [244, 'tick', 0.35],
          [251, 'tick', 0.35],
          [258, 'tick', 0.35],
          [265, 'tick', 0.35],
          [334, 'chime', 0.35],
          [410, 'swish', 0.35],
          ...SNAP.map((s) => [s, 'impact', 0.5] as [number, 'impact', number]),
          [470, 'whoosh', 0.45],
          [512, 'sparkle', 0.4],
        ]}
      />
    </AbsoluteFill>
  );
};
