import React from 'react';
import {Img, interpolate, useCurrentFrame} from 'remotion';
import {Emote, EMOTE_SIZE, emoteFile, IRA, src} from '../assets';
import {clamp, ease, spr, track} from '../theme';

export type IraEnter = 'pop' | 'rise' | 'drop' | 'left' | 'right' | 'peek' | 'none';

export type IraProps = {
  /** feet anchor: bottom-center of the character, in canvas px */
  x: number;
  y: number;
  /** rendered height in px (source is square, feet touch the bottom edge) */
  size: number;
  enter?: IraEnter;
  enterAt?: number;
  exitAt?: number;
  exit?: 'shrink' | 'down' | 'left' | 'right' | 'fade';
  /** frames of small celebratory hops (with anticipation dip) */
  hops?: number[];
  /** rotation keyframes in degrees, e.g. a curious head tilt */
  tilt?: [number, number][];
  /** position keyframes (canvas px) for moving between marks */
  moveX?: [number, number][];
  moveY?: [number, number][];
  scaleKeys?: [number, number][];
  idle?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  /** expression from the emote sheet, or a timeline [[frame, emote], ...] */
  emote?: Emote | [number, Emote][];
  style?: React.CSSProperties;
};

/**
 * IRA, animated purely with transforms on the supplied transparent PNG.
 * Scale is always uniform so the face and ears are never distorted.
 */
export const Ira: React.FC<IraProps> = ({
  x,
  y,
  size,
  enter = 'pop',
  enterAt = 0,
  exitAt,
  exit = 'shrink',
  hops = [],
  tilt,
  moveX,
  moveY,
  scaleKeys,
  idle = true,
  shadow = true,
  shadowColor = 'rgba(15,23,42,0.28)',
  emote,
  style,
}) => {
  const f = useCurrentFrame();
  if (f < enterAt - 1) return null;

  const s = enter === 'none' ? 1 : spr(f, enterAt, {damping: 11, stiffness: 120, mass: 0.9});
  let tx = 0;
  let ty = 0;
  let sc = 1;
  let rot = 0;
  let op = 1;

  switch (enter) {
    case 'pop':
      sc = interpolate(s, [0, 1], [0.2, 1]);
      ty = interpolate(s, [0, 1], [size * 0.15, 0]);
      op = interpolate(f - enterAt, [0, 4], [0, 1], clamp);
      break;
    case 'rise':
      ty = interpolate(s, [0, 1], [size * 1.1, 0]);
      break;
    case 'drop':
      ty = interpolate(s, [0, 1], [-size * 1.6, 0]);
      break;
    case 'left':
      tx = interpolate(s, [0, 1], [-size * 1.4, 0]);
      rot = interpolate(s, [0, 1], [-14, 0]);
      break;
    case 'right':
      tx = interpolate(s, [0, 1], [size * 1.4, 0]);
      rot = interpolate(s, [0, 1], [14, 0]);
      break;
    case 'peek': {
      // rises only partway first, pauses, then pops up fully
      const p1 = spr(f, enterAt, {damping: 14, stiffness: 160});
      const p2 = spr(f, enterAt + 16, {damping: 10, stiffness: 140});
      ty = interpolate(p1, [0, 1], [size, size * 0.55]) - interpolate(p2, [0, 1], [0, size * 0.55]);
      break;
    }
  }

  // hops: 5-frame anticipation dip, then a lift and spring settle
  let hopY = 0;
  let hopR = 0;
  for (const h of hops) {
    const dip = interpolate(f, [h - 5, h, h + 1], [0, size * 0.025, 0], clamp);
    const up = f >= h ? spr(f, h, {damping: 9, stiffness: 180, mass: 0.6}) : 0;
    const lift = f >= h ? Math.sin(Math.min(1, (f - h) / 14) * Math.PI) * size * 0.11 : 0;
    hopY += dip - lift * (1 - up * 0.15);
    hopR += f >= h ? Math.sin(Math.min(1, (f - h) / 14) * Math.PI) * 3 : 0;
  }

  const idleY = idle ? Math.sin((f - enterAt) / 22) * size * 0.008 : 0;
  const idleR = idle ? Math.sin((f - enterAt) / 37) * 0.8 : 0;
  const tiltR = tilt ? track(f, tilt, ease.inOut) : 0;
  const mx = moveX ? track(f, moveX, ease.inOut) : x;
  const my = moveY ? track(f, moveY, ease.inOut) : y;
  const ks = scaleKeys ? track(f, scaleKeys, ease.inOut) : 1;

  if (exitAt !== undefined && f >= exitAt) {
    const e = interpolate(f, [exitAt, exitAt + 12], [0, 1], {...clamp, easing: ease.in});
    if (exit === 'shrink') sc *= 1 - e;
    if (exit === 'down') ty += e * size * 1.3;
    if (exit === 'left') tx -= e * 1400;
    if (exit === 'right') tx += e * 1400;
    op *= exit === 'fade' ? 1 - e : 1;
  }

  // expression changes get a small pop (uniform scale, never a stretch)
  let face: Emote | undefined;
  let swapAt = -999;
  if (typeof emote === 'string') face = emote;
  else if (emote) {
    for (const [at, e] of emote) if (f >= at) [face, swapAt] = [e, at];
  }
  const pop = swapAt > enterAt + 2 ? interpolate(spr(f, swapAt, {damping: 9, stiffness: 260}), [0, 1], [0.86, 1]) : 1;
  const total = sc * ks * pop;
  const air = Math.max(0, -(hopY + idleY)) / size;

  return (
    <div
      style={{
        position: 'absolute',
        left: mx - size / 2,
        top: my - size,
        width: size,
        height: size,
        opacity: op,
        ...style,
      }}
    >
      {shadow && (
        <div
          style={{
            position: 'absolute',
            left: size * 0.22,
            bottom: -size * 0.02,
            width: size * 0.56,
            height: size * 0.06,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${shadowColor} 0%, rgba(0,0,0,0) 70%)`,
            transform: `translateX(${tx}px) scale(${total * (1 - air * 2.5)})`,
            opacity: interpolate(ty, [0, size * 0.5], [1, 0], clamp),
          }}
        />
      )}
      <Img
        src={src(face ? emoteFile(face) : IRA)}
        style={{
          position: 'absolute',
          left: face ? (size - (size * 0.98 * EMOTE_SIZE[face][0]) / EMOTE_SIZE[face][1]) / 2 : 0,
          top: face ? size * 0.02 : 0,
          width: face ? (size * 0.98 * EMOTE_SIZE[face][0]) / EMOTE_SIZE[face][1] : size,
          height: face ? size * 0.98 : size,
          transformOrigin: '50% 100%',
          transform: `translate(${tx}px, ${ty + hopY + idleY}px) rotate(${
            rot + hopR + idleR + tiltR
          }deg) scale(${total})`,
          filter: 'drop-shadow(0 18px 30px rgba(15,23,42,0.18))',
        }}
      />
    </div>
  );
};
