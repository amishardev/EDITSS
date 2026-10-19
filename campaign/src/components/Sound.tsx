import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {clamp} from '../theme';

/**
 * Replaceable music layer. Each ad has its own arrangement of the original
 * IRA theme (scripts/compose.py), cut so its drops and stings land on the
 * ad's key frames. Point `track` at any other file in public/audio to re-score.
 */
export const Music: React.FC<{
  track: string; // e.g. "ad01" -> audio/theme-ad01.m4a
  duration: number; // frames
  volume?: number;
  fadeOut?: number;
}> = ({track, duration, volume = 0.5, fadeOut = 12}) => (
  <Audio
    src={staticFile(track.includes('/') ? track : `audio/theme-${track}.m4a`)}
    volume={(f) => volume * interpolate(f, [duration - fadeOut, duration], [1, 0], clamp)}
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
