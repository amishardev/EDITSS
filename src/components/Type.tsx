import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FPS} from '../lib/timeline';
import type {Caption} from '../lib/types';

export const SANS = 'Inter, sans-serif';
export const MONO = 'JetBrains Mono, monospace';
export const ACCENT = '#E3B25B'; // brass, a nod to the mizrab (sitar plectrum)

const shadow = '0 2px 24px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Hook text in four entrances so no two reels open the same way.
const HookText: React.FC<{c: Caption; local: number}> = ({c, local}) => {
  const style = c.style ?? 'fade';
  if (style === 'type') {
    const chars = Math.floor(interpolate(local, [0, 0.9], [0, c.text.length], clamp));
    const caret = Math.floor(local * 2.5) % 2 === 0 || chars < c.text.length;
    return (
      <span>
        {c.text.slice(0, chars)}
        <span style={{opacity: caret ? 0.9 : 0, color: ACCENT, fontWeight: 300}}>|</span>
      </span>
    );
  }
  if (style === 'words') {
    const words = c.text.split(' ');
    return (
      <>
        {words.map((w, i) => {
          const start = i * 0.11;
          const o = interpolate(local, [start, start + 0.22], [0, 1], clamp);
          const y = interpolate(local, [start, start + 0.3], [18, 0], clamp);
          return (
            <span key={i} style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`}}>
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </>
    );
  }
  if (style === 'cut') return <span>{c.text}</span>;
  const o = interpolate(local, [0, 0.35], [0, 1], clamp);
  const blur = interpolate(local, [0, 0.35], [8, 0], clamp);
  return <span style={{opacity: o, filter: `blur(${blur}px)`, display: 'inline-block'}}>{c.text}</span>;
};

export const CaptionLayer: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <>
      {captions.map((c, i) => {
        if (t < c.from || t >= c.to) return null;
        const local = t - c.from;
        const out = interpolate(t, [c.to - 0.25, c.to], [1, 0], clamp);
        const align = c.align ?? 'center';
        const pos: React.CSSProperties = {
          position: 'absolute',
          top: c.y ?? 300,
          left: align === 'center' ? 90 : (c.x ?? 84),
          right: 90,
          textAlign: align,
          opacity: out,
          textShadow: shadow,
          color: '#F4F1EA',
        };
        if (c.kind === 'hook') {
          return (
            <div key={i} style={{...pos, fontFamily: SANS, fontWeight: 500, fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.02em'}}>
              <HookText c={c} local={local} />
            </div>
          );
        }
        if (c.kind === 'line') {
          const o = interpolate(local, [0, 0.4], [0, 1], clamp);
          return (
            <div key={i} style={{...pos, opacity: o * out, fontFamily: SANS, fontWeight: 300, fontSize: 50, lineHeight: 1.2, letterSpacing: '-0.01em'}}>
              {c.text}
            </div>
          );
        }
        if (c.kind === 'label') {
          const o = interpolate(local, [0, 0.2], [0, 1], clamp);
          const x = interpolate(local, [0, 0.35], [-10, 0], clamp);
          return (
            <div
              key={i}
              style={{
                ...pos,
                opacity: o * out,
                transform: `translateX(${x}px)`,
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: c.accent ? ACCENT : 'rgba(244,241,234,0.88)',
              }}
            >
              <span style={{display: 'inline-block', width: 10, height: 10, marginRight: 16, marginBottom: 3, background: ACCENT, borderRadius: 1}} />
              {c.text}
            </div>
          );
        }
        // title card
        const o = interpolate(local, [0, 0.6], [0, 1], clamp);
        const spread = interpolate(local, [0, 1.6], [0.55, 0.38], {...clamp, easing: (p) => 1 - Math.pow(1 - p, 3)});
        const [title, ...rest] = c.text.split('|');
        return (
          <div key={i} style={{...pos, top: c.y ?? 820, opacity: o * out, textAlign: 'center', left: 0, right: 0}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 104, letterSpacing: `${spread}em`, marginRight: `-${spread}em`}}>{title}</div>
            {rest.map((r, k) => (
              <div
                key={k}
                style={{
                  marginTop: k === 0 ? 30 : 14,
                  fontFamily: MONO,
                  fontSize: k === 0 ? 28 : 24,
                  letterSpacing: '0.32em',
                  marginRight: '-0.32em',
                  textTransform: 'uppercase',
                  color: k === 0 ? ACCENT : 'rgba(244,241,234,0.7)',
                }}
              >
                {r}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};
