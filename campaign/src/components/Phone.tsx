import React from 'react';
import {Img} from 'remotion';
import {src} from '../assets';

/** All screens share the design file's 1626px source width. */
export const SRC_W = 1626;
export const VIEW_H = 3500;

export type PhoneGeom = {cx: number; cy: number; width: number; scroll?: number};

const geom = (width: number) => {
  const b = width * 0.03;
  const sw = width - 2 * b;
  const s = sw / SRC_W;
  const sh = VIEW_H * s;
  return {b, sw, s, sh, h: sh + 2 * b};
};

export const phoneHeight = (width: number) => geom(width).h;

/** Canvas position of a point given in screen source pixels. */
export const phonePoint = (p: PhoneGeom, sx: number, sy: number) => {
  const g = geom(p.width);
  return {
    x: p.cx - p.width / 2 + g.b + sx * g.s,
    y: p.cy - g.h / 2 + g.b + (sy - (p.scroll ?? 0)) * g.s,
  };
};

export type PhoneProps = PhoneGeom & {
  screen?: string;
  /** source height of the screen image (full-scroll screens are taller) */
  screenH?: number;
  screenBg?: string;
  /** overlays positioned in screen source pixels (scroll with the screen) */
  children?: React.ReactNode;
  /** overlays fixed to the glass, not scrolled (e.g. scan line, flash) */
  glass?: React.ReactNode;
  style?: React.CSSProperties;
  shadow?: boolean;
};

/**
 * A clean modern handset. The bezel is drawn natively; the screen is either
 * a real rasterised Dietary Guide screen or a native rebuild passed as children.
 */
export const Phone: React.FC<PhoneProps> = ({
  cx,
  cy,
  width,
  scroll = 0,
  screen,
  screenH = VIEW_H,
  screenBg = '#FFFFFF',
  children,
  glass,
  style,
  shadow = true,
}) => {
  const g = geom(width);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - width / 2,
        top: cy - g.h / 2,
        width,
        height: g.h,
        borderRadius: width * 0.155,
        background: 'linear-gradient(145deg, #2B3138 0%, #0B0F14 38%, #11161C 70%, #2A3036 100%)',
        boxShadow: shadow
          ? `0 ${width * 0.06}px ${width * 0.16}px rgba(15,23,42,0.32), 0 ${width * 0.015}px ${
              width * 0.04
            }px rgba(15,23,42,0.22), inset 0 0 0 ${Math.max(1.5, width * 0.0025)}px rgba(255,255,255,0.14)`
          : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: g.b,
          top: g.b,
          width: g.sw,
          height: g.sh,
          borderRadius: width * 0.128,
          overflow: 'hidden',
          background: screenBg,
          // forces clipping of scaled children on all engines
          isolation: 'isolate',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: SRC_W,
            height: screenH,
            transformOrigin: '0 0',
            transform: `scale(${g.s}) translateY(${-scroll}px)`,
          }}
        >
          {screen && (
            <Img src={src(screen)} style={{position: 'absolute', left: 0, top: 0, width: SRC_W, height: screenH}} />
          )}
          {children}
        </div>
        {glass && (
          <div style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: SRC_W, height: VIEW_H, transformOrigin: '0 0', transform: `scale(${g.s})`}}>
              {glass}
            </div>
          </div>
        )}
        {/* soft glass reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};
