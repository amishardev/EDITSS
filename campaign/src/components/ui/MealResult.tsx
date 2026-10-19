import React from 'react';
import {Img, interpolate, useCurrentFrame} from 'remotion';
import {src} from '../../assets';
import {C, clamp, ease, F, spr} from '../../theme';
import {Count} from '../Text';
import {Bolt, Chevron, Insta, Pencil} from './Icons';

/**
 * Native rebuild of the real "Meal result" screen (design ref 3o), in the
 * screen's own 1626px source coordinates. Layout, colours and copy follow the
 * design; the values come from the design's own data for this photo
 * (story overlay 4c / macro ring: Paneer bhurji + 2 roti, 420 kcal, 25g
 * protein, 48g carbs, 14g fat, score 82).
 */
export type MealData = {
  photo: string;
  mealTime: string;
  title: [string, string];
  score: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  logLabel: string;
};

export const PANEER_ROTI: MealData = {
  photo: 'photos/roti-paneer.jpg',
  mealTime: 'Lunch',
  title: ['Paneer bhurji', '+ 2 roti'],
  score: 82,
  kcal: 420,
  protein: 25,
  carbs: 48,
  fat: 14,
  logLabel: 'Log lunch',
};

export const TILE_RECTS = {
  cal: {x: 80, y: 2210, w: 712, h: 320},
  prot: {x: 830, y: 2210, w: 712, h: 320},
  carb: {x: 80, y: 2580, w: 712, h: 320},
  fat: {x: 830, y: 2580, w: 712, h: 320},
  score: {x: 80, y: 1770, w: 1466, h: 390},
  log: {x: 560, y: 3010, w: 986, h: 230},
};

const Tile: React.FC<{label: string; value: number; unit: string; bg: string; rect: {x: number; y: number; w: number; h: number}; at: number}> = ({
  label, value, unit, bg, rect, at,
}) => {
  const f = useCurrentFrame();
  const s = spr(f, at, {damping: 14, stiffness: 150});
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: 56,
        background: bg,
        padding: '58px 56px',
        boxSizing: 'border-box',
        fontFamily: F.body,
        opacity: interpolate(f, [at, at + 5], [0, 1], clamp),
        transform: `translateY(${interpolate(s, [0, 1], [90, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{fontSize: 50, color: C.ink, fontWeight: 500}}>{label}</span>
        <Pencil size={46} color={C.sub} />
      </div>
      <div style={{marginTop: 34, display: 'flex', alignItems: 'baseline', gap: 18}}>
        <span style={{fontSize: 96, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em'}}>
          <Count to={value} at={at + 2} dur={24} />
        </span>
        <span style={{fontSize: 48, color: C.sub}}>{unit}</span>
      </div>
    </div>
  );
};

export const MealResult: React.FC<{data: MealData; sheetAt: number; tilesAt: number; logPressAt?: number}> = ({data, sheetAt, tilesAt, logPressAt}) => {
  const f = useCurrentFrame();
  const sheet = spr(f, sheetAt, {damping: 18, stiffness: 120});
  const sheetY = interpolate(sheet, [0, 1], [1700, 0]);
  const scoreS = spr(f, sheetAt + 8, {damping: 16, stiffness: 130});
  const bar = interpolate(f, [sheetAt + 12, sheetAt + 40], [0, data.score / 100], {...clamp, easing: ease.out});
  const press = logPressAt !== undefined ? interpolate(f, [logPressAt - 4, logPressAt, logPressAt + 6], [1, 0.94, 1], clamp) : 1;

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1626, height: 3500, background: '#fff', fontFamily: F.body}}>
      <Img src={src(data.photo)} style={{position: 'absolute', left: 0, top: -140, width: 1626, height: 1626 * (1920 / 1080) * 0.82, objectFit: 'cover'}} />
      {/* status bar + nav, as in the design */}
      <div style={{position: 'absolute', left: 140, top: 62, fontSize: 56, fontWeight: 600, color: '#fff'}}>9:41</div>
      <div style={{position: 'absolute', left: 70, top: 200, width: 130, height: 130, borderRadius: 65, background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)'}} />
      <div style={{position: 'absolute', right: 70, top: 200, width: 130, height: 130, borderRadius: 65, background: 'rgba(255,255,255,0.28)'}} />

      <div style={{position: 'absolute', left: 0, top: 1180, width: 1626, height: 2400, transform: `translateY(${sheetY}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: '#fff', borderRadius: '80px 80px 0 0'}} />
        <div style={{position: 'absolute', left: 80, top: 80, height: 120, padding: '0 48px', borderRadius: 60, border: `3px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, fontSize: 48, color: C.ink, fontWeight: 500}}>
          {data.mealTime}
          <Chevron size={44} color={C.ink} />
        </div>
        <div style={{position: 'absolute', left: 80, top: 250, fontSize: 86, lineHeight: 1.1, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em'}}>
          {data.title[0]}
          <br />
          {data.title[1]}
        </div>
        <div style={{position: 'absolute', right: 80, top: 280, width: 440, height: 170, borderRadius: 85, background: C.off, border: `3px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: 62, color: C.ink}}>
          <span style={{color: C.sub}}>−</span>
          <span style={{fontWeight: 600}}>1</span>
          <span style={{color: C.sub}}>+</span>
        </div>
      </div>

      {/* health score card */}
      <div
        style={{
          position: 'absolute',
          left: TILE_RECTS.score.x,
          top: TILE_RECTS.score.y,
          width: TILE_RECTS.score.w,
          height: TILE_RECTS.score.h,
          borderRadius: 64,
          background: C.teal,
          transform: `translateY(${sheetY + interpolate(scoreS, [0, 1], [60, 0])}px)`,
          opacity: interpolate(f, [sheetAt + 8, sheetAt + 14], [0, 1], clamp),
        }}
      >
        <div style={{position: 'absolute', left: 74, top: 74, width: 136, height: 136, borderRadius: 36, background: 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Bolt size={70} color="#4ADE80" />
        </div>
        <div style={{position: 'absolute', left: 260, top: 84, fontSize: 46, color: 'rgba(255,255,255,0.72)'}}>Health score</div>
        <div style={{position: 'absolute', right: 74, top: 56, color: '#fff', display: 'flex', alignItems: 'baseline'}}>
          <span style={{fontSize: 128, fontWeight: 600, letterSpacing: '-0.03em'}}>
            <Count to={data.score} at={sheetAt + 12} dur={28} />
          </span>
          <span style={{fontSize: 58, opacity: 0.75}}>/100</span>
        </div>
        <div style={{position: 'absolute', left: 74, right: 74, bottom: 66, height: 26, borderRadius: 13, background: '#375559'}}>
          <div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 13, background: `linear-gradient(90deg, #F59E0B, ${C.scoreBar})`}} />
        </div>
      </div>

      <div style={{position: 'absolute', inset: 0, transform: `translateY(${sheetY}px)`}}>
        <Tile label="Calories" value={data.kcal} unit="kcal" bg={C.tileCal} rect={TILE_RECTS.cal} at={tilesAt} />
        <Tile label="Protein" value={data.protein} unit="g" bg={C.tileProt} rect={TILE_RECTS.prot} at={tilesAt + 5} />
        <Tile label="Carbs" value={data.carbs} unit="g" bg={C.tileCarb} rect={TILE_RECTS.carb} at={tilesAt + 10} />
        <Tile label="Fat" value={data.fat} unit="g" bg={C.tileFat} rect={TILE_RECTS.fat} at={tilesAt + 15} />

        <div style={{position: 'absolute', left: 80, top: 3010, width: 440, height: 230, borderRadius: 64, background: C.off, border: `3px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, fontSize: 56, fontWeight: 600, color: C.ink}}>
          <Insta size={58} color={C.ink} />
          Share
        </div>
        <div
          style={{
            position: 'absolute',
            left: TILE_RECTS.log.x,
            top: TILE_RECTS.log.y,
            width: TILE_RECTS.log.w,
            height: TILE_RECTS.log.h,
            borderRadius: 64,
            background: C.teal,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 58,
            fontWeight: 600,
            transform: `scale(${press})`,
          }}
        >
          {data.logLabel}
        </div>
        <div style={{position: 'absolute', left: 0, width: 1626, top: 3300, textAlign: 'center', fontSize: 40, color: C.sub}}>
          AI estimate. Tap any value to correct it.
        </div>
      </div>
    </div>
  );
};
