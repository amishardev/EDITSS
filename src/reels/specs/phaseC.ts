/** PHASE C - SONG IDENTITY. The hook line, the drop, the title and the bar story arrive together. */
import { bar } from "../../engine/song";
import type { ReelSpec } from "../types";

export const R09: ReelSpec = {
  id: "R09",
  phase: "C",
  audioStart: bar(25),
  audioEnd: bar(35),
  concept: {
    name: "WRITTEN ON THE ROAD",
    core: "The pre-chorus is painted on the asphalt, each word arriving under the car as it's sung. The build becomes a tunnel; 'kicks us OUT' bursts out of it and the word OUT passes under the wheels on the drop.",
    hook: "the signs were on the road the whole time.",
    approach: "Vocal-to-drop. The words are the environment, not captions.",
    lyricSection: "Build 1 + drop 1: 'Out of sight... take a chance, rolling it twice... moving to the music, grooving till the bar kicks us OUT' (0:46.6-1:01.4)",
    editing: "Road words timed to the vocal (SIGHT, MIND, CHANCE, TWICE, SIGHT, MIND). Kick drops out at 0:50.63 and the road goes to fog. 8th roll: lamps double. 16th roll: tunnel. Drop: exit flash, lamp on every kick, small punch on each one.",
    transitions: "Cut into fog on the kick-out, lamp-wipe into the 8ths, tunnel exit flash on 1:00.000.",
    payoff: "OUT painted on the road passes under the camera in the first beat of the drop.",
    loop: "No.",
    caption: "out of sight, out of mind. it was written on the road the whole way.",
    why: "The clearest statement of what the song is: movement, risk, the hook line and the drop in one shot language.",
  },
  shots: [
    {
      shot: "S001",
      from: bar(25),
      to: bar(28),
      params: { wordsAt: [{ text: "SIGHT", t: 47.25 }, { text: "MIND", t: 48.3 }, { text: "CHANCE", t: 49.5 }], lead: 6 },
      cam: { zoom: [1.02, 1.06], kick: 0.006 },
    },
    { shot: "S010", from: bar(28), to: bar(29), params: { wordsAt: [{ text: "TWICE", t: 51.3 }], lead: 5 }, cam: { zoom: [1.04, 1.08], handheld: 1.4 } },
    {
      shot: "S011",
      from: bar(29),
      to: bar(31),
      params: { words: [], wordsAt: [{ text: "SIGHT", t: 52.8 }, { text: "MIND", t: 54.6 }], lead: 7 },
      cam: { zoom: [1.04, 1.1], tension: 0.05 },
      in: { type: "lampwipe" },
    },
    { shot: "S013", from: bar(31), to: bar(33), params: { exitAt: 60 }, cam: { zoom: [1.04, 1.12], tension: 0.05 } },
    {
      shot: "S011",
      from: bar(33),
      to: bar(35),
      params: { words: [], wordsAt: [{ text: "OUT", t: 60.12, big: true }], lead: 6 },
      cam: { zoom: [1.12, 1.04], kick: 0.012, drop: 0.06, blur: 2 },
    },
  ],
  texts: [
    { kind: "hook", text: "the signs were on the road the whole time.", from: bar(25), to: 48.4 },
    { kind: "lyric", lyric: "PC1L4", from: 55.97, to: 57.9, pos: "upper" },
    { kind: "lyric", lyric: "PC1L5", from: 57.92, to: 60.0, pos: "upper", exit: "cut" },
  ],
  overlays: [{ type: "flash", at: 60, strength: 0.55, dur: 0.35 }],
  matte: [
    [bar(31), 1.78],
    [bar(33) - 0.02, 1.2],
    [bar(33), 1.78],
  ],
};

export const R10: ReelSpec = {
  id: "R10",
  phase: "C",
  audioStart: bar(29),
  audioEnd: bar(35),
  concept: {
    name: "1:59",
    core: "Closing time as a countdown. The clock sits on 01:59 through the build, LAST CALL buzzes, the sign still says OPEN... and the minute flips to 02:00 on the drop. The bar kicks us out, literally on 'out', and we're on the road.",
    hook: "1:59. nobody's going home.",
    approach: "Vocal-to-drop story. The drop is a time, not an effect.",
    lyricSection: "8th/16th build + 'grooving till the bar kicks us out' → drop 1 (0:52.5-1:03.75)",
    editing: "Cuts accelerate with the roll: 3.75 s, 1.9 s, 0.94 s, then one-beat shots across the drop (clock flip, CLOSED, road).",
    transitions: "Matte closes during the build; exposure flash on the flip.",
    payoff: "01:59 → 02:00 exactly on 1:00.000, then the road with a lamp on every kick.",
    loop: "No, ends hard on the bar line.",
    caption: "closing time was never the end of it.",
    why: "Gives the drop a story the audience remembers ('the 2am song').",
  },
  shots: [
    { shot: "S089", from: bar(29), to: bar(31), params: { at: "02:00", songAt: 60, label: "LAST CALL" }, cam: { zoom: [1.0, 1.08], tension: 0.05 } },
    { shot: "S061", from: bar(31), to: bar(32), cam: { zoom: [1.04, 1.1] } },
    { shot: "S062", from: bar(32), to: bar(32, 4), params: { swapAt: 60.47 }, cam: { zoom: [1.06, 1.12] } },
    { shot: "S086", from: bar(32, 4), to: bar(33, 2), cam: { zoom: [1.25, 1.3], drop: 0.06 } },
    { shot: "S062", from: bar(33, 2), to: bar(33, 3), params: { swapAt: 60.47 }, cam: { zoom: [1.1, 1.1], kick: 0.015 } },
    { shot: "S001", from: bar(33, 3), to: bar(35), cam: { zoom: [1.06, 1.04], kick: 0.012, bass: 0.02 } },
  ],
  texts: [
    { kind: "hook", text: "1:59. nobody's going home.", from: bar(29), to: 56.1 },
    { kind: "lyric", lyric: "PC1L5", from: 57.92, to: 59.95, pos: "upper", exit: "cut" },
  ],
  overlays: [{ type: "flash", at: 60, strength: 0.6 }],
  matte: [
    [bar(29), 1.78],
    [bar(33) - 0.02, 1.15],
    [bar(33), 1.78],
  ],
};

export const R11: ReelSpec = {
  id: "R11",
  phase: "C",
  audioStart: bar(53),
  audioEnd: bar(60),
  concept: {
    name: "WHEN THE LIGHTS COME ON",
    core: "Inside the drop we only ever see the party through steamed glass. On the last kick of drop 1 (1:45.00) the neon dies and the lights go out in steps, one per beat. Then it's just our shadows on the pavement and the 'oh, oh'.",
    hook: "when the lights come on.",
    approach: "Story: nightlife → kicked out → walking. The end of drop 1 into the breakdown.",
    lyricSection: "End of drop 1 + 'grooving till the bar kicks us out / Oh, oh' (1:40.9-1:50.5)",
    editing: "Groove cuts in the drop (2 bars, then 1 bar), the closing plays as one take so you watch the lights go beat by beat, then a slow walk.",
    transitions: "Cuts in the drop, hard cut on 1:45.000, lamp-wipe into the walk.",
    payoff: "The sign stutters out on the exact frame the kick stops.",
    loop: "No, fades out walking.",
    caption: "the bar kicked us out. the night didn't.",
    why: "Makes the lyric's image (the bar kicking us out) the brand story of the song.",
  },
  shots: [
    { shot: "S057", from: bar(53), to: bar(55), cam: { zoom: [1.02, 1.06], kick: 0.008, bass: 0.03 } },
    { shot: "S051", from: bar(55), to: bar(56), cam: { zoom: [1.04, 1.06], kick: 0.008 } },
    { shot: "S059", from: bar(56), to: bar(56, 3), cam: { zoom: [1.06, 1.12], kick: 0.01 } },
    { shot: "S061", from: bar(56, 3), to: bar(57), cam: { zoom: [1.1, 1.14], kick: 0.01 } },
    { shot: "S052", from: bar(57), to: bar(58), params: { closeAt: 105 }, cam: { zoom: [1.06, 1.02], impact: 0.03 } },
    { shot: "S069", from: bar(58), to: bar(60), cam: { zoom: [1.04, 1.0], handheld: 1 }, in: { type: "lampwipe", dur: 0.4 } },
  ],
  texts: [
    { kind: "hook", text: "when the lights come on.", from: bar(53), to: 100.8 },
    { kind: "lyric", lyric: "BRL2", from: 102.94, to: 106.3, pos: "upper" },
  ],
  fadeOut: 1,
};

export const PHASE_C = [R09, R10, R11];
