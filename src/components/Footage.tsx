import React from 'react';
import {Audio, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {FPS} from '../lib/timeline';
import type {Segment} from '../lib/types';

export const SOURCE = staticFile('flrecording.mp4');

const segFrames = (segments: Segment[]) => {
  let start = 0;
  return segments.map((s) => {
    const from = start;
    const frames = Math.round(s.dur * FPS);
    start += frames;
    return {...s, from, frames, trim: Math.round(s.src * FPS)};
  });
};

// Maps reel time to source time so beat-synced effects follow the real music.
export const sourceTime = (segments: Segment[], t: number) => {
  let start = 0;
  for (const s of segments) {
    if (t < start + s.dur) return s.src + (t - start);
    start += s.dur;
  }
  const last = segments[segments.length - 1];
  return last.src + last.dur;
};

// Picture only. Every segment is a straight, untouched slice of the recording.
export const Footage: React.FC<{segments: Segment[]; style?: React.CSSProperties}> = ({
  segments,
  style,
}) => (
  <>
    {segFrames(segments).map((s) => (
      <Sequence key={s.from} from={s.from} durationInFrames={s.frames} layout="none">
        <OffthreadVideo
          src={SOURCE}
          trimBefore={s.trim}
          muted
          style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, ...style}}
        />
      </Sequence>
    ))}
  </>
);

// Sound from the same slices, with short fades so joins never click.
export const Soundtrack: React.FC<{segments: Segment[]}> = ({segments}) => {
  const segs = segFrames(segments);
  return (
    <>
      {segs.map((s, i) => {
        const fadeIn = i === 0 ? 2 : 3;
        const fadeOut = i === segs.length - 1 ? 14 : 3;
        return (
          <Sequence key={s.from} from={s.from} durationInFrames={s.frames} layout="none">
            <Audio
              src={SOURCE}
              trimBefore={s.trim}
              volume={(f) =>
                interpolate(f, [0, fadeIn, s.frames - fadeOut, s.frames], [0, 1, 1, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              }
            />
          </Sequence>
        );
      })}
    </>
  );
};
