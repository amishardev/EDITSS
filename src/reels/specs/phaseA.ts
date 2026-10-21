/** PHASE A - CURIOSITY. No title, barely a name. Feelings first, song second. */
import { bar } from "../../engine/song";
import type { ReelSpec } from "../types";

export const R01: ReelSpec = {
  id: "R01",
  phase: "A",
  audioStart: 0,
  audioEnd: 21.5,
  concept: {
    name: "BEFORE",
    core: "The part of the night nobody films: a window switching on, a lamp in a puddle, the clock tipping into midnight, then three shadows heading out on the first sung line.",
    hook: "the part before the night starts.",
    approach: "Quiet setup. Uses the intro the way the record does: keys only, then the first vocal.",
    lyricSection: "Intro (0:00-0:15) + 'Moving my feet to the beat of a drum' (0:15.96)",
    editing: "Long holds (3.75-7.5 s), one cut per 2-4 bars, slow push-ins. Nothing reacts until the first vocal.",
    transitions: "Dip on the window, lamp-wipe into the shadows on the first vocal.",
    payoff: "The clock flips to 00:00 exactly when the percussion enters (0:15.00) and the walk starts on the first word.",
    loop: "No, it ends walking out of frame (fade).",
    caption: "the best nights start with nobody saying where we're going.",
    why: "First post. Sets the world (sodium, moon, shadows instead of faces) before anyone knows it's a song campaign.",
  },
  shots: [
    { shot: "S100", from: 0, to: 7.5, params: { oneAt: 3.75 }, cam: { zoom: [1.0, 1.08], handheld: 0.6 } },
    { shot: "S106", from: 7.5, to: 11.25, cam: { zoom: [1.1, 1.04], handheld: 0.8 }, in: { type: "dip", dur: 0.5 } },
    { shot: "S088", from: 11.25, to: bar(9, 3), params: { at: "00:00", songAt: 15 }, cam: { zoom: [1.0, 1.06] } },
    { shot: "S069", from: bar(9, 3), to: 21.5, cam: { zoom: [1.06, 1.0], handheld: 1.2 }, in: { type: "lampwipe", dur: 0.35 } },
  ],
  texts: [
    { kind: "hook", text: "the part before the night starts.", from: 0, to: 4.6 },
    { kind: "label", text: "11:58 PM", from: 7.5, to: 11.0 },
    { kind: "lyric", lyric: "V1L1", from: 15.96, to: 21.2 },
  ],
  fadeIn: 0.4,
  fadeOut: 1.2,
  grade: { contrast: 1.04, saturate: 0.92 },
};

export const R02: ReelSpec = {
  id: "R02",
  phase: "A",
  audioStart: bar(16, 3),
  audioEnd: bar(21),
  concept: {
    name: "THE MOON FOLLOWS",
    core: "Everything on the road rushes past: poles, wires, lamps. The moon doesn't move. It's the one witness to the night, the place you promise to tell the truth.",
    hook: "the moon still follows the car.",
    approach: "Visual loop built on a childhood observation; the kick entry at 0:30.00 starts the lamps.",
    lyricSection: "'If I took it alive, I promise to say it in the moonlight' (0:29.31-0:34.76) + breath",
    editing: "4 shots in 8.4 s. Lamps and poles pass exactly on the kick (travel rate locked to the grid). The moon shot has no reactivity at all.",
    transitions: "Hard cut on the kick entry (0:30.00), cut on the beat before 'moonlight' (0:33.75).",
    payoff: "'say it in the moonlight' lands on the only still image in the Reel.",
    loop: "Yes. Starts and ends on the same wires-and-moon shot, so the loop reads as one endless drive.",
    caption: "everything on the road moves. except the moon.",
    why: "Introduces the central visual idea (everything passes, the moon stays) in under 9 seconds.",
  },
  shots: [
    { shot: "S034", from: bar(16, 3), to: bar(17), cam: { zoom: [1.06, 1.04], handheld: 1 } },
    { shot: "S012", from: bar(17), to: bar(19), cam: { zoom: [1.02, 1.07], kick: 0.006, handheld: 1.2 } },
    { shot: "S032", from: bar(19), to: bar(20, 2), cam: { zoom: [1.0, 1.06], handheld: 0.3 } },
    { shot: "S034", from: bar(20, 2), to: bar(21), cam: { zoom: [1.04, 1.06], kick: 0.005, handheld: 1 } },
  ],
  texts: [
    { kind: "hook", text: "the moon still follows the car.", from: bar(16, 3), to: 33.4 },
    { kind: "lyric", lyric: "V1L3", words: [8, 13], from: 33.0, to: 35.4, pos: "lower" },
  ],
  grade: { contrast: 1.05, saturate: 0.95 },
};

export const R03: ReelSpec = {
  id: "R03",
  phase: "A",
  audioStart: bar(25, 4),
  audioEnd: bar(31, 2),
  concept: {
    name: "THE SECOND ROLL",
    core: "Decision, action, consequence. A red light that won't change, two dice thrown on the bar on 'take a chance', thrown again on 'rolling it twice', then a walk signal counting down one beat at a time.",
    hook: "the second roll is the one you remember.",
    approach: "Tease. Builds the whole pre-chorus and cuts out one beat after the light turns green, before the drop.",
    lyricSection: "'Out of sight, out of mind / Take a chance, rolling it twice / It's out of sight...' (0:46.6-0:55.4)",
    editing: "Cuts on the lyric: dice thrown on 'take a chance' (bar 27) and again exactly where the kick drops out (bar 28). The countdown digits tick on the 8th-roll beats: 8 beats, 8 numbers.",
    transitions: "Hard cuts only. Matte tightens through the build.",
    payoff: "Green light on 0:56.25 as the 16th roll starts, then black. No drop.",
    loop: "No. Deliberate cliffhanger.",
    caption: "we never left on the first try.",
    why: "Owns the 'take a chance, rolling it twice' line as an image (dice) without spending the drop.",
  },
  shots: [
    { shot: "S081", from: bar(25, 4), to: bar(27), cam: { zoom: [1.0, 1.06], handheld: 0.8 } },
    { shot: "S082", from: bar(27), to: bar(29), params: { throws: [bar(27), bar(28)], results: [[3, 5], [1, 1]] }, cam: { zoom: [1.04, 1.1], handheld: 1 } },
    { shot: "S077", from: bar(29), to: bar(31, 2), params: { goAt: bar(31), countFrom: 8 }, cam: { zoom: [1.02, 1.12], tension: 0.04, handheld: 0.8 } },
  ],
  texts: [
    { kind: "hook", text: "the second roll is the one you remember.", from: bar(25, 4), to: 48.6 },
    { kind: "lyric", lyric: "PC1L2", from: 48.73, to: 51.7, pos: "upper" },
  ],
  matte: [
    [bar(29), 1.78],
    [bar(31), 1.25],
    [bar(31, 1, 1), 1.78],
  ],
  grade: { contrast: 1.06 },
};

export const R04: ReelSpec = {
  id: "R04",
  phase: "A",
  audioStart: bar(81),
  audioEnd: bar(87),
  concept: {
    name: "OUT OF SIGHT",
    core: "'Out of sight, out of mind' as a visual rule: everything that leaves the frame stops existing. A train slides off the bridge, taillights leave, the moon goes behind cloud, the city switches off window by window, one shadow walks out of the lamp, and the frame closes to a slit.",
    hook: "out of sight. not out of mind.",
    approach: "Metaphor + tease. Second build, cut to black before the 16th roll.",
    lyricSection: "Build 2: 'Out of sight, out of mind / Take a chance... / It's out of sight, out of mind' (2:31.6-2:40.8)",
    editing: "One shot per bar, every shot ends with something leaving. From the kick-out (2:35.63) windows go dark on each beat.",
    transitions: "Matte closes from full frame to a slit over the last two bars; final cut to black on 2:41.25.",
    payoff: "Black, with the 16th roll just starting. The viewer has to go find the drop.",
    loop: "No.",
    caption: "some things you leave behind on purpose.",
    why: "Second tease, uses build 2 so build 1 stays fresh for the vocal-to-drop Reels.",
  },
  shots: [
    { shot: "S028", from: bar(81), to: bar(82), cam: { zoom: [1.04, 1.0] } },
    { shot: "S097", from: bar(82), to: bar(83), cam: { zoom: [1.0, 1.06] } },
    { shot: "S039", from: bar(83), to: bar(84), cam: { zoom: [1.0, 1.05], handheld: 0.5 } },
    { shot: "S025", from: bar(84), to: bar(85), params: { modeAt: bar(84) }, cam: { zoom: [1.0, 1.04] } },
    { shot: "S071", from: bar(85), to: bar(86), cam: { zoom: [1.05, 1.0] } },
    { shot: "S033", from: bar(86), to: bar(87), cam: { zoom: [1.0, 1.1], handheld: 0.3 } },
  ],
  texts: [
    { kind: "hook", text: "out of sight. not out of mind.", from: bar(81), to: 153.6 },
    { kind: "lyric", lyric: "PC2L3", from: 156.5, to: 160.6, pos: "upper" },
  ],
  matte: [
    [bar(85), 1.78],
    [bar(87) - 0.1, 0.05],
  ],
  fadeOut: 0.15,
};

export const PHASE_A = [R01, R02, R03, R04];
