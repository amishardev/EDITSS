import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {clamp, FPS} from '../theme';

/**
 * Replaceable music layer. Every ad points at a section of the MIZRAB track
 * (128 BPM). Swap MUSIC_FILE or the `start` seconds to re-score an ad.
 */
export const MUSIC_FILE = 'audio/mizrab.m4a';

export const Music: React.FC<{
  start: number; // seconds into the track
  duration: number; // frames
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({start, duration, volume = 0.6, fadeIn = 4, fadeOut = 40}) => (
  <Audio
    src={staticFile(MUSIC_FILE)}
    startFrom={Math.round(start * FPS)}
    volume={(f) =>
      volume *
      interpolate(f, [0, fadeIn, duration - fadeOut, duration], [0, 1, 1, 0], clamp)
    }
  />
);

export type SfxName =
  | 'tap'
  | 'tick'
  | 'whoosh'
  | 'swish'
  | 'pop'
  | 'chime'
  | 'success'
  | 'scan'
  | 'impact'
  | 'riser'
  | 'sparkle';

const SFX_LEN: Record<SfxName, number> = {
  tap: 4, tick: 3, whoosh: 18, swish: 10, pop: 8, chime: 44,
  success: 20, scan: 50, impact: 22, riser: 38, sparkle: 28,
};

/** One-shot sound cue on a frame. */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({
  at,
  name,
  volume = 0.6,
}) => (
  <Sequence from={Math.round(at)} durationInFrames={SFX_LEN[name] + 4} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/** Cue list helper: [[frame, name, volume?], ...] */
export const Cues: React.FC<{cues: [number, SfxName, number?][]}> = ({cues}) => (
  <>
    {cues.map(([at, name, v], i) => (
      <Sfx key={i} at={at} name={name} volume={v} />
    ))}
  </>
);
