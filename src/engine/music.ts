/**
 * Music-reactive signals. Every visual reaction reads from here so that
 * different instruments drive different behaviours:
 *   kick  -> small punch / cut          clap -> accent / direction
 *   bass  -> slow, deep camera weight   vocal -> type / storytelling
 *   build -> tension 0..1               drop / impact -> the big change
 */
import { BAR, BEAT, SONG, eventTimes, sectionAt } from "./song";

const ENV_FPS = SONG.fps;

export const env = (name: keyof typeof SONG.envelopes, T: number) => {
  const a = SONG.envelopes[name];
  const x = Math.max(0, T * ENV_FPS);
  const i = Math.floor(x);
  if (i >= a.length - 1) return a[a.length - 1] / 100;
  const f = x - i;
  return (a[i] * (1 - f) + a[i + 1] * f) / 100;
};

/** index of the last element <= T (sorted array), -1 if none */
export const lastIndex = (arr: number[], T: number) => {
  let lo = 0;
  let hi = arr.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= T + 1e-6) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
};

/** exponential decay since the most recent event in arr (1 at the event, -> 0) */
export const pulse = (arr: number[], T: number, decay = 0.12) => {
  const i = lastIndex(arr, T);
  if (i < 0) return 0;
  const d = T - arr[i];
  return d < decay * 7 ? Math.exp(-d / decay) : 0;
};

/** smooth attack before an event + decay after it (for anticipation) */
export const swell = (arr: number[], T: number, pre = 0.4, decay = 0.25) => {
  const i = lastIndex(arr, T);
  const next = arr[i + 1];
  const after = i >= 0 ? Math.exp(-(T - arr[i]) / decay) : 0;
  const before = next !== undefined && next - T < pre ? Math.pow(1 - (next - T) / pre, 2) : 0;
  return Math.max(after, before);
};

const KICKS = SONG.kicks;
const CLAPS = SONG.claps_drop;
const BASS_ACCENTS = SONG.bass_accent_bars;
const DROPS = eventTimes("drop");
const IMPACTS = [...eventTimes("impact"), ...eventTimes("impact_out"), ...DROPS].sort((a, b) => a - b);
const KICK_OUTS = eventTimes("kick_out");

export const kick = (T: number, decay = 0.09) => pulse(KICKS, T, decay);
export const clap = (T: number, decay = 0.08) => pulse(CLAPS, T, decay);
export const impact = (T: number, decay = 0.35) => pulse(IMPACTS, T, decay);
export const drop = (T: number, decay = 0.5) => pulse(DROPS, T, decay);
/** heavy bass bar (the Cm bar of each 4-bar phrase in the drops): slow 0..1 hump over the bar */
export const bassWeight = (T: number) => {
  const i = lastIndex(BASS_ACCENTS, T);
  if (i < 0) return 0;
  const d = (T - BASS_ACCENTS[i]) / BAR;
  return d >= 0 && d < 1 ? Math.sin(Math.PI * d) : 0;
};

export const beatPhase = (T: number) => ((T / BEAT) % 1 + 1) % 1;
export const barPhase = (T: number) => ((T / BAR) % 1 + 1) % 1;
export const beatIndex = (T: number) => Math.floor(T / BEAT + 1e-6);

export const inKickOut = (T: number) => {
  const i = lastIndex(KICK_OUTS, T);
  if (i < 0) return false;
  const k = lastIndex(KICKS, T);
  return k < 0 || KICKS[k] < KICK_OUTS[i];
};

/** 0..1 progress through a build section, eased so the last bars climb fastest */
export const tension = (T: number) => {
  const s = sectionAt(T);
  if (s.id !== "build1" && s.id !== "build2") return 0;
  const p = (T - s.start) / (s.end - s.start);
  return Math.pow(Math.min(1, Math.max(0, p)), 1.6);
};

export const energy = (T: number) => sectionAt(T).energy / 10;

/**
 * Passes-per-beat for things that move "with" the track (streetlights, tunnel lamps,
 * train poles). Changes only on bar lines, so phase stays locked to the grid.
 */
export const travelRate = (T: number) => {
  const b = Math.floor(T / BAR) + 1;
  if (b <= 8) return 0.25; // intro: one lamp per bar
  if (b <= 16) return 0.5;
  if (b <= 24) return 1;
  if (b <= 28) return 1;
  if (b <= 30) return 2; // 8th roll
  if (b <= 32) return 4; // 16th roll
  if (b <= 56) return 1; // drop: one per beat = on the kick
  if (b <= 64) return 0.25;
  if (b <= 80) return 1;
  if (b <= 84) return 1;
  if (b <= 86) return 2;
  if (b <= 88) return 4;
  if (b <= 112) return b === 104 || b === 112 ? 0.5 : 1;
  return 0.25;
};

/** integral of travelRate: continuous "distance" in lamp spacings. Integer = a lamp passes. */
export const travel = (T: number) => {
  let dist = 0;
  const full = Math.floor(T / BAR);
  // cache per bar boundary
  if (!travelCache.length) {
    let acc = 0;
    for (let b = 0; b < 140; b++) {
      travelCache.push(acc);
      acc += travelRate(b * BAR + 0.001) * 4;
    }
  }
  dist = travelCache[Math.min(full, travelCache.length - 1)];
  dist += travelRate(T) * ((T - full * BAR) / BEAT);
  return dist;
};
const travelCache: number[] = [];
