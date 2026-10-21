import data from "../../analysis/moonlight.analysis.json";

export type Section = {
  id: string;
  label: string;
  bars: [number, number];
  energy: number;
  desc: string;
  start: number;
  end: number;
};
export type Lyric = { id: string; text: string; start: number; end: number; section: string };
export type SongEvent = { t: number; type: string; weight: number; note: string };
type EnvName = "rms" | "kick" | "bass" | "clap" | "hat" | "pad" | "vocal";

type SongData = {
  title: string;
  artist: string;
  bpm: number;
  beat: number;
  bar: number;
  duration: number;
  fps: number;
  sections: Section[];
  lyrics: Lyric[];
  events: SongEvent[];
  bass_accent_bars: number[];
  kicks: number[];
  claps_drop: number[];
  envelopes: Record<EnvName, number[]>;
};

export const SONG = data as unknown as SongData;
export const SONG_TITLE = "MOONLIGHT";
export const ARTIST = "AMISHAR";
export const AUDIO_FILE = "audio/moonlight.mp3";

export const FPS = 30;
export const BEAT = SONG.beat; // 0.46875 s
export const BAR = SONG.bar; // 1.875 s

/** Song time (s) of bar n (1-based), beat b (1-based), plus extra 16ths. */
export const bar = (n: number, beat = 1, sixteenth = 0) =>
  (n - 1) * BAR + (beat - 1) * BEAT + (sixteenth * BEAT) / 4;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

export const lyric = (id: string): Lyric => {
  const l = SONG.lyrics.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown lyric ${id}`);
  return l;
};

export const section = (id: string): Section => {
  const s = SONG.sections.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown section ${id}`);
  return s;
};

export const sectionAt = (T: number): Section =>
  SONG.sections.find((s) => T >= s.start && T < s.end) ?? SONG.sections[SONG.sections.length - 1];

export const eventTimes = (type: string) => SONG.events.filter((e) => e.type === type).map((e) => e.t);
