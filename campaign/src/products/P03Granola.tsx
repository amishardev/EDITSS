import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Ira} from '../components/Ira';
import {Cues, Music} from '../components/Sound';
import {Grain, Scene} from '../components/Stage';
import {C, clamp, ease, F, prog, spr} from '../theme';
import {Chips, EndBlock, Grade, Pack, Particles, Shot, Title} from './kit';

/**
 * PRODUCT 03 · High Protein Millet Granola · "Subah, sorted."
 * HOOK: raking sunrise light across a granola bowl -> DESIRE: granola rains
 * into the bowl -> REVEAL: the pack glides onto morning marble, "21g /
 * Protein / Serving" (exact pack wording) -> REASON: pack chips + three ways
 * to have it (from the brand catalogue) -> BRAND/CTA. Warm, airy, morning.
 */
export const P03_DURATION = 600;
const RED = '#C9372C'; // the pack's "21g Protein / Serving" red
const GREEN = '#2F6B3A'; // the pack's claim band green
const REVEAL = 155;
const USES = 334;
const END = 466;

const Sunbeam: React.FC<{at: number; dur?: number}> = ({at, dur = 70}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [-0.3, 1.3], {...clamp, easing: ease.inOut});
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(118deg, rgba(255,236,190,0) ${p * 100 - 22}%, rgba(255,232,180,0.55) ${p * 100}%, rgba(255,236,190,0) ${p * 100 + 22}%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

const UseCard: React.FC<{i: number; file: string; iw: number; ih: number; fx: number; fy: number; zoom: number; label: string}> = ({i, file, iw, ih, fx, fy, zoom, label}) => {
  const f = useCurrentFrame();
  const s = spr(f, USES + 6 + i * 8, {damping: 15, stiffness: 120});
  const out = prog(f, END - 6, END + 8, ease.in);
  const x = 60 + i * 330;
  return (
    <div style={{position: 'absolute', left: x, top: 640, width: 300, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 260 + out * -60}px)`}}>
      <div style={{position: 'relative', width: 300, height: 600, borderRadius: 34, overflow: 'hidden', boxShadow: '0 30px 60px rgba(60,40,20,0.25)'}}>
        <Shot file={file} iw={iw} ih={ih} fx={fx} fy={fy} zoom={zoom} w={300} h={600} />
      </div>
      <div style={{marginTop: 24, textAlign: 'center', fontFamily: F.display, fontWeight: 600, fontSize: 38, color: C.ink, letterSpacing: '-0.02em'}}>{label}</div>
    </div>
  );
};

export const P03Granola: React.FC = () => {
  const f = useCurrentFrame();
  const glide = spr(f, REVEAL + 4, {damping: 18, stiffness: 80});
  const toUses = prog(f, USES - 10, USES + 10, ease.inOut);
  const toEnd = prog(f, END, END + 24, ease.inOut);
  const packCx = interpolate(glide, [0, 1], [1500, 540]);
  const packH = interpolate(toEnd, [0, 1], [880, 640]);
  const packCy = interpolate(toEnd, [0, 1], [1020, 760]);
  const stat = Math.round(interpolate(f, [REVEAL + 40, REVEAL + 70], [0, 21], {...clamp, easing: ease.out}));

  return (
    <AbsoluteFill style={{background: C.off}}>
      <Music track="p03" duration={P03_DURATION} volume={0.55} />

      {/* HOOK: sunrise across the bowl */}
      <Scene from={0} to={44}>
        <Shot file="products/granola-scene-sunlit.jpg" iw={878} ih={878} fx={[[0, 580], [44, 560]]} fy={[[0, 600], [44, 590]]} zoom={[[0, 2.15], [44, 1.85]]} filter="saturate(1.05)" />
        <Grade warm={0.12} vignette={0.35} />
        <Sunbeam at={-10} dur={56} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(60,35,15,0.55) 0%, rgba(60,35,15,0) 34%)'}} />
        <Title text="Subah," at={0} out={36} y={250} size={140} weight={300} color={C.off} stagger={0} shadow="0 6px 30px rgba(0,0,0,0.3)" />
        <Title text="*sorted.*" at={10} out={36} y={410} size={140} weight={300} color={C.off} accent="#FFE3A3" stagger={0} shadow="0 6px 30px rgba(0,0,0,0.3)" />
      </Scene>

      {/* DESIRE: granola rain */}
      <Scene from={40} to={REVEAL + 6}>
        <Shot file="products/granola-scene-bowl.jpg" iw={1024} ih={1536} fx={[[40, 720], [REVEAL, 700]]} fy={[[40, 1110], [REVEAL, 1080]]} zoom={[[40, 1.75], [REVEAL, 1.55]]} />
        <Grade warm={0.1} vignette={0.35} />
        <Particles kind="rain" at={46} dur={100} n={70} x={560} y={1180} spread={1} seed={31} />
        <Sunbeam at={60} dur={90} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(60,35,15,0.6) 0%, rgba(60,35,15,0) 30%)'}} />
        <Title text={'Desi *millet*\ncrunch.'} at={52} out={104} y={250} size={104} weight={300} color={C.off} accent="#FFE3A3" />
        <Title text={'No added\n*sugar.*'} at={108} out={REVEAL - 4} y={250} size={104} weight={300} color={C.off} accent="#FFE3A3" />
      </Scene>

      {/* REVEAL on morning marble */}
      <Scene from={REVEAL} to={P03_DURATION}>
        <Shot file="products/marble.jpg" iw={2189} ih={1460} fx={1094} fy={730} zoom={[[REVEAL, 1.1], [P03_DURATION, 1.2]]} filter="brightness(1.04)" />
        <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 700px 300px, rgba(255,232,180,0.55), rgba(255,255,255,0) 70%)'}} />
        <Sunbeam at={REVEAL + 10} dur={120} />
        <div style={{position: 'absolute', inset: 0, opacity: 1 - toUses + toEnd}}>
          <Pack k="granola" cx={packCx} cy={packCy} h={packH} rot={interpolate(glide, [0, 1], [8, 0])} sheenAt={[REVEAL + 46, END + 40]} shadow={0.32} />
        </div>
        {/* 21g / Protein / Serving, exactly as printed */}
        {f >= REVEAL + 38 && f < USES + 4 && (
          <div style={{position: 'absolute', left: 0, width: 1080, top: 210, textAlign: 'center', opacity: prog(f, REVEAL + 38, REVEAL + 50) * (1 - prog(f, USES - 8, USES + 2))}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 200, color: RED, letterSpacing: '-0.05em', lineHeight: 1}}>{stat}g</div>
            <div style={{fontFamily: F.display, fontWeight: 600, fontSize: 56, color: C.ink, marginTop: 6}}>Protein / Serving</div>
          </div>
        )}
        <Chips items={['No Added Sugar', 'Nutri Dense', 'Clean Label']} at={REVEAL + 84} out={USES - 6} y={1556} dark={false} accent={GREEN} />

        {/* three ways to have it */}
        <Title text={'Jaise chaho,\n*waise.*'} at={USES + 2} out={END - 8} y={250} size={100} weight={300} color={C.ink} accent={GREEN} />
        <UseCard i={0} file="products/granola-scene-sunlit.jpg" iw={878} ih={878} fx={560} fy={590} zoom={1.8} label="Dahi ke saath" />
        <UseCard i={1} file="products/granola-scene-bowl.jpg" iw={1024} ih={1536} fx={720} fy={1100} zoom={1.6} label="Doodh ke saath" />
        <UseCard i={2} file="products/granola-real.jpg" iw={899} ih={1599} fx={450} fy={800} zoom={1.15} label="Seedha box se" />

        {/* END */}
        <Title text={'Subah, *sorted.*'} at={END + 14} y={240} size={96} weight={300} color={C.ink} accent={GREEN} />
        <EndBlock at={END + 30} y={1190} dark={false} product="High Protein Millet Granola" line="21g Protein / Serving · Net weight 100gm" />
        <Ira x={850} y={1110} size={300} enter="pop" enterAt={END + 46} hops={[END + 84]} shadowColor="rgba(80,50,20,0.35)" />
      </Scene>

      <Grain opacity={0.04} vignette={0} />
      <Cues
        cues={[
          [0, 'shimmer', 0.35],
          [0, 'pop', 0.25],
          [40, 'whoosh', 0.3],
          [46, 'pour', 0.55],
          [96, 'pour', 0.4],
          [REVEAL - 8, 'riser', 0.25],
          [REVEAL + 6, 'whoosh', 0.4],
          [REVEAL + 40, 'chime', 0.35],
          [REVEAL + 84, 'tick', 0.3],
          [USES, 'swish', 0.35],
          [USES + 6, 'pop', 0.3],
          [USES + 14, 'pop', 0.3],
          [USES + 22, 'pop', 0.3],
          [END, 'whoosh', 0.3],
          [END + 46, 'pop', 0.4],
          [END + 30, 'shimmer', 0.25],
        ]}
      />
    </AbsoluteFill>
  );
};
