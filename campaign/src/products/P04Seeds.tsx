import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Cues, Music} from '../components/Sound';
import {Grain, Scene} from '../components/Stage';
import {clamp, ease, F, prog, spr} from '../theme';
import {EndBlock, Pack, Particles, Shot, Title} from './kit';

/**
 * PRODUCT 04 · Mixed Seed Protein Bar · "3 PM, handled."
 * HOOK: a ticking clock hits 3:00 PM while a battery drains -> DESIRE: the
 * usual options get struck out -> REVEAL: kraft paper tears open on the real
 * carton, seeds burst -> REASON: 10g plant protein, the real bar up close, the
 * four pack claims as editorial tiles while the battery refills -> BRAND/CTA.
 * Editorial, graphic, kraft + the pack's dark brown.
 */
export const P04_DURATION = 540;
const BROWN = '#4A2516';
const KRAFT = '#EFE2CC';
const KRAFT_DARK = '#E2CFB0';
const GREEN = '#2F7A3E';
const REVEAL = 112;
const TILES = 300;
const END = 424;

const Battery: React.FC<{x: number; y: number; level: number; scale?: number; color: string; blink?: boolean}> = ({x, y, level, scale = 1, color, blink}) => {
  const f = useCurrentFrame();
  const o = blink ? 0.45 + 0.55 * (Math.sin(f / 3) > 0 ? 1 : 0) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 220 * scale, height: 100 * scale, transform: `translateX(-50%)`, opacity: o}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 22 * scale, border: `${8 * scale}px solid ${BROWN}`}} />
      <div style={{position: 'absolute', right: -22 * scale, top: 30 * scale, width: 16 * scale, height: 40 * scale, borderRadius: 6 * scale, background: BROWN}} />
      <div style={{position: 'absolute', left: 16 * scale, top: 16 * scale, bottom: 16 * scale, width: `${(188 * scale - 0) * level}px`, maxWidth: 188 * scale, borderRadius: 10 * scale, background: color}} />
    </div>
  );
};

const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const t = f < 14 ? '2:58' : f < 28 ? '2:59' : '3:00';
  const kick = f >= 28 ? interpolate(f, [28, 34], [1.12, 1], {...clamp, easing: ease.out}) : 1;
  const o = interpolate(f, [40, 48], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: 560, textAlign: 'center', opacity: o}}>
      <span style={{display: 'inline-block', fontFamily: F.display, fontWeight: 800, fontSize: 270, color: BROWN, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', transform: `scale(${kick})`}}>{t}</span>
      <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 80, color: BROWN, marginLeft: 16}}>PM</span>
    </div>
  );
};

const Tear: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [REVEAL, REVEAL + 20], [0, 1], {...clamp, easing: ease.in});
  if (f < REVEAL || f > REVEAL + 22) return null;
  const jag = Array.from({length: 25}).map((_, i) => `${(i / 24) * 100}% ${50 + (i % 2 ? 2.2 : -2.2) + ((i * 37) % 5) * 0.4}%`).join(', ');
  const half = (top: boolean): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.018) 0 3px, rgba(255,255,255,0.02) 3px 7px), ${KRAFT}`,
    clipPath: top ? `polygon(0% 0%, 100% 0%, ${jag.split(', ').reverse().join(', ')})` : `polygon(${jag}, 100% 100%, 0% 100%)`,
    transform: `translateY(${(top ? -1 : 1) * p * 1100}px) rotate(${(top ? -1 : 1) * p * 4}deg)`,
    boxShadow: '0 0 40px rgba(0,0,0,0.2)',
  });
  return (
    <>
      <div style={half(true)} />
      <div style={half(false)} />
    </>
  );
};

const Tile: React.FC<{i: number; label: string}> = ({i, label}) => {
  const f = useCurrentFrame();
  const s = spr(f, TILES + 10 + i * 7, {damping: 14, stiffness: 150});
  const out = prog(f, END - 6, END + 6, ease.in);
  const x = 70 + (i % 2) * 480;
  const y = 1060 + Math.floor(i / 2) * 230;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 460, height: 210, borderRadius: 30, background: i === 0 ? BROWN : '#FFF8EC', border: `3px solid ${BROWN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20, boxSizing: 'border-box', fontFamily: F.display, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: i === 0 ? KRAFT : BROWN, letterSpacing: '-0.02em', opacity: s * (1 - out), transform: `scale(${0.8 + s * 0.2})`}}>
      {label}
    </div>
  );
};

export const P04Seeds: React.FC = () => {
  const f = useCurrentFrame();
  const drain = interpolate(f, [8, 44], [0.6, 0.08], clamp);
  const refill = interpolate(f, [TILES + 20, TILES + 60], [0.08, 1], {...clamp, easing: ease.out});
  const toTiles = prog(f, TILES - 8, TILES + 14, ease.inOut);
  const toEnd = prog(f, END, END + 22, ease.inOut);
  const cartonW = interpolate(toTiles, [0, 1], [980, 820]) + interpolate(toEnd, [0, 1], [0, 60]);
  const cartonCy = interpolate(toTiles, [0, 1], [860, 760]) + interpolate(toEnd, [0, 1], [0, 0]);
  const enter = spr(f, REVEAL + 6, {damping: 16, stiffness: 120});

  return (
    <AbsoluteFill style={{background: KRAFT}}>
      <Music track="p04" duration={P04_DURATION} volume={0.55} />
      {/* editorial grid paper */}
      <AbsoluteFill style={{backgroundImage: `linear-gradient(rgba(74,37,22,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(74,37,22,0.06) 2px, transparent 2px)`, backgroundSize: '90px 90px'}} />

      {/* HOOK + DESIRE */}
      <Scene from={0} to={REVEAL + 2}>
        <Clock />
        <Battery x={540} y={950} level={f < 60 ? drain : 0.08} color={drain < 0.25 ? '#C8402B' : BROWN} blink={f > 40} />
        <Title text="The 3 PM slump." at={30} out={46} y={1120} size={72} weight={600} color={BROWN} />
        {[
          {t: 'Biscuit?', at: 50, y: 300},
          {t: 'Namkeen?', at: 64, y: 470},
        ].map((w, i) => {
          const strike = interpolate(f, [w.at + 8, w.at + 14], [0, 1], {...clamp, easing: ease.out});
          if (f < w.at) return null;
          return (
            <div key={i} style={{position: 'absolute', left: 0, width: 1080, top: w.y, textAlign: 'center', opacity: interpolate(f, [w.at, w.at + 4], [0, 1], clamp) * (1 - strike * 0.55)}}>
              <span style={{position: 'relative', display: 'inline-block', fontFamily: F.display, fontWeight: 700, fontSize: 130, color: BROWN, letterSpacing: '-0.04em'}}>
                {w.t}
                <span style={{position: 'absolute', left: -12, top: '54%', height: 12, width: `${strike * 108}%`, background: '#C8402B', borderRadius: 6}} />
              </span>
            </div>
          );
        })}
        <Title text="Ya phir..." at={82} out={REVEAL - 4} y={1250} size={110} weight={300} color={BROWN} />
      </Scene>

      {/* REVEAL behind the tear */}
      <Scene from={REVEAL} to={P04_DURATION}>
        <AbsoluteFill style={{background: `radial-gradient(900px 700px at 540px 860px, #FFF6E6, ${KRAFT_DARK})`}} />
        <Particles kind="seeds" at={REVEAL + 16} dur={60} n={46} x={540} y={860} spread={1.3} seed={41} />
        <Pack k="seeds" cx={540} cy={cartonCy + (1 - enter) * 120} w={cartonW} rot={(1 - enter) * -6} sheenAt={[REVEAL + 44, END + 36]} shadow={0.3} style={{opacity: enter}} />
        {f < TILES + 4 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 230, textAlign: 'center', opacity: prog(f, REVEAL + 24, REVEAL + 36) * (1 - prog(f, TILES - 10, TILES))}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 210, color: BROWN, letterSpacing: '-0.05em', lineHeight: 1}}>10g</div>
            <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 58, color: BROWN, letterSpacing: '0.06em'}}>PLANT PROTEIN</div>
          </div>
        )}
        {/* the real bar, up close */}
        {f >= REVEAL + 70 && f < TILES + 4 && (
          <div style={{position: 'absolute', left: 70, top: 1150, width: 940, opacity: prog(f, REVEAL + 70, REVEAL + 86) * (1 - prog(f, TILES - 10, TILES)), transform: `translateY(${(1 - prog(f, REVEAL + 70, REVEAL + 90)) * 60}px)`}}>
            <div style={{position: 'relative', width: 940, height: 330, borderRadius: 34, overflow: 'hidden', border: `3px solid ${BROWN}`}}>
              <Shot file="products/bars-scene.jpg" iw={934} ih={607} fx={[[REVEAL + 70, 700], [TILES, 680]]} fy={450} zoom={[[REVEAL + 70, 2.0], [TILES, 2.2]]} w={940} h={330} />
            </div>
            <div style={{marginTop: 18, textAlign: 'center', fontFamily: F.display, fontWeight: 600, fontSize: 44, color: BROWN}}>Mixed seeds. Real crunch.</div>
          </div>
        )}

        {/* REASON tiles + refilled battery */}
        {f >= TILES - 2 && f < END + 8 && <Battery x={540} y={300} level={refill} scale={1.2} color={refill > 0.9 ? GREEN : BROWN} />}
        <Title text={'3 PM, *handled.*'} at={TILES + 40} out={END - 6} y={460} size={88} weight={300} color={BROWN} accent={GREEN} />
        {['10g Plant Protein', 'No Added Sugar', 'Vegan', 'Clean Label'].map((t, i) => (
          <Tile key={i} i={i} label={t} />
        ))}

        {/* END */}
        <Title text={'3 PM, *handled.*'} at={END + 10} y={260} size={96} weight={300} color={BROWN} accent={GREEN} />
        <EndBlock at={END + 26} y={1150} dark={false} product="Mixed Seed Protein Bar" line="10g plant protein · Net weight 40g" />
      </Scene>

      <Tear />
      <Grain opacity={0.05} vignette={0} />
      <Cues
        cues={[
          [0, 'clock', 0.7],
          [14, 'clock', 0.7],
          [28, 'clock', 0.8],
          [28, 'impact', 0.4],
          [50, 'pop', 0.3],
          [58, 'swish', 0.3],
          [64, 'pop', 0.3],
          [72, 'swish', 0.3],
          [REVEAL - 20, 'riser', 0.3],
          [REVEAL, 'crinkle', 0.8],
          [REVEAL + 16, 'impact', 0.45],
          [REVEAL + 44, 'shimmer', 0.25],
          [REVEAL + 70, 'whoosh', 0.3],
          [TILES, 'whoosh', 0.3],
          [TILES + 10, 'tick', 0.35],
          [TILES + 17, 'tick', 0.35],
          [TILES + 24, 'tick', 0.35],
          [TILES + 31, 'tick', 0.35],
          [TILES + 60, 'success', 0.4],
          [END, 'whoosh', 0.3],
          [END + 26, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};
