import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ACCENT, MONO, SANS} from '../components/Type';

// Spotify Wrapped artist message. Picture only: rendered with --muted so the
// file has no audio stream at all (Spotify rejects messages containing music).
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const WrappedMessage: React.FC = () => {
  const f = useCurrentFrame();
  const line = (start: number) => ({
    opacity: interpolate(f, [start, start + 14], [0, 1], clamp),
    transform: `translateY(${interpolate(f, [start, start + 18], [16, 0], clamp)}px)`,
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#050506'}}>
      <OffthreadVideo
        src={staticFile('flrecording.mp4')}
        trimBefore={2 * 24}
        muted
        style={{width: 1080, height: 1920, transform: `scale(${1.15 + f * 0.0004})`, filter: 'blur(14px) brightness(0.35) saturate(0.6)'}}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.2), rgba(0,0,0,0.75))'}} />
      <div style={{position: 'absolute', left: 100, right: 100, top: 640, color: '#F4F1EA', fontFamily: SANS, textAlign: 'center'}}>
        <div style={{...line(6), fontWeight: 500, fontSize: 70, lineHeight: 1.15, letterSpacing: '-0.02em'}}>Thank you for being my top fans.</div>
        <div style={{...line(40), marginTop: 40, fontWeight: 300, fontSize: 54, lineHeight: 1.25}}>I'll work harder and bring you more music in 2027.</div>
        <div style={{...line(84), marginTop: 70, fontFamily: MONO, fontSize: 30, letterSpacing: '0.3em', color: ACCENT}}>YOURS, AMISHAR</div>
      </div>
    </AbsoluteFill>
  );
};
