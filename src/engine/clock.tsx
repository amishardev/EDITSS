import React, { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/** T = song time. ls / lo remap the shot-local clock (for freezes and reversed shots). */
type Clock = { T: number; audioStart: number; ls: number; lo: number };
const ClockCtx = createContext<Clock>({ T: 0, audioStart: 0, ls: 1, lo: 0 });

/** Wrap a reel at the top level (outside any <Sequence>) so every shot can read absolute song time. */
export const SongClock: React.FC<{ audioStart: number; children: React.ReactNode }> = ({ audioStart, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <ClockCtx.Provider value={{ T: audioStart + frame / fps, audioStart, ls: 1, lo: 0 }}>{children}</ClockCtx.Provider>;
};

/**
 * Remap song time for everything inside: speed 0 = freeze frame, 0.5 = half speed,
 * -1 = the world runs backwards while the music plays forward. `dur` lets the shot-local
 * clock run backwards too (it starts at dur and counts down).
 */
export const TimeWarp: React.FC<{ speed: number; anchor: number; shift?: number; dur?: number; children: React.ReactNode }> = ({
  speed,
  anchor,
  shift = 0,
  dur = 0,
  children,
}) => {
  const c = useContext(ClockCtx);
  return (
    <ClockCtx.Provider value={{ ...c, T: anchor + (c.T - anchor) * speed + shift, ls: speed, lo: speed < 0 ? dur : 0 }}>
      {children}
    </ClockCtx.Provider>
  );
};

/** Absolute song time in seconds. */
export const useSongTime = () => useContext(ClockCtx).T;

/** Seconds since the enclosing <Sequence> started (respecting TimeWarp). */
export const useLocalTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useContext(ClockCtx);
  return c.lo + (frame / fps) * c.ls;
};
