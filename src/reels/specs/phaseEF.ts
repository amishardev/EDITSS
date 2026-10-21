/** PHASE E - RELEASE PUSH and PHASE F - LONG-TAIL DISCOVERY. */
import { bar } from "../../engine/song";
import type { ReelSpec } from "../types";

const groove = { kick: 0.01, bass: 0.035, clap: 3, handheld: 1.2 };

export const R17: ReelSpec = {
  id: "R17",
  phase: "E",
  audioStart: bar(87),
  audioEnd: bar(93),
  concept: {
    name: "THE SIGN",
    core: "A dead neon tube that says 'moonlight' hangs in the dark through the roll. It stutters on exactly on the drop. Then the bar it belongs to, the city, and the name.",
    hook: "you'll know it when the sign comes on.",
    approach: "Title reveal on the strongest drop. The only Reel that spells out artist + title on screen.",
    lyricSection: "16th roll + 'grooving till the bar kicks us out' → drop 2 (2:41.25-2:52.5)",
    editing: "3.75 s hold on the unlit sign, flicker-on synced to 2:45.000, then 1-bar shots with groove reactivity, title lockup over the last bar.",
    transitions: "Flash on the drop, hard cuts after.",
    payoff: "The title literally lights up on the drop.",
    loop: "No, ends on the lockup.",
    caption: "moonlight. AMISHAR.",
    why: "Release day: the name and the feeling arrive in the same frame.",
  },
  shots: [
    { shot: "S064", from: bar(87), to: bar(90), params: { onAt: 165 }, cam: { zoom: [1.04, 1.12], tension: 0.03, drop: 0.06, kick: 0.006 } },
    { shot: "S054", from: bar(90), to: bar(91), cam: { ...groove } },
    { shot: "S036", from: bar(91), to: bar(92), cam: { ...groove, bass: 0.06 } },
    { shot: "S012", from: bar(92), to: bar(93), cam: { ...groove, zoom: [1.04, 1.0] } },
  ],
  texts: [
    { kind: "hook", text: "you'll know it when the sign comes on.", from: bar(87), to: 164.9, exit: "cut" },
    { kind: "title", from: bar(92), to: bar(93) + 0.5, pos: 0.3, size: 58 },
  ],
  overlays: [{ type: "flash", at: 165, strength: 0.55, color: "#dfe9ff" }],
};

export const R18: ReelSpec = {
  id: "R18",
  phase: "E",
  audioStart: bar(28),
  audioEnd: bar(36),
  concept: {
    name: "NINE SECONDS WITHOUT A KICK",
    core: "Micro-detail for people who make music. A stylised arrangement of the actual track shows the kick lane stopping at 0:50.63 and the roll going 8ths then 16ths; at 1:00.000 the drop's real step pattern plays, then the city's windows play it.",
    hook: "9.4 seconds with no kick. that's the whole trick.",
    approach: "Micro-detail / production, built from the measured arrangement, not a DAW screen recording.",
    lyricSection: "Build 1 into drop 1 (0:50.63-1:05.63)",
    editing: "The arrangement scrolls with the audio; mono labels mark each real event at its timestamp; cut to the step grid on the drop, then the facade sequencer.",
    transitions: "Hard cuts on bar 31 and the drop.",
    payoff: "The step grid lights up on 1:00.000.",
    loop: "No.",
    caption: "take the floor away before you drop the floor.",
    why: "Credibility with producers and DJs during release week; a different kind of shareable.",
  },
  shots: [
    { shot: "S110", from: bar(28), to: bar(31), cam: { zoom: [1.0, 1.0], handheld: 0.4 } },
    { shot: "S109", from: bar(31), to: bar(33), cam: { zoom: [1.0, 1.04], tension: 0.03, handheld: 0.4 } },
    { shot: "S112", from: bar(33), to: bar(34), cam: { zoom: [1.02, 1.02], kick: 0.01, drop: 0.04 } },
    { shot: "S101", from: bar(34), to: bar(36), cam: { ...groove } },
  ],
  texts: [
    { kind: "hook", text: "9.4 seconds with no kick. that's the whole trick.", from: bar(28), to: 54.2 },
    { kind: "label", text: "0:50.63  kick out", from: bar(28), to: bar(29) - 0.1, pos: 0.262 },
    { kind: "label", text: "0:52.50  roll in 8ths", from: bar(29), to: bar(31) - 0.1, pos: 0.262 },
    { kind: "label", text: "0:56.25  16ths", from: bar(31), to: bar(33) - 0.05, pos: 0.262 },
    { kind: "label", text: "1:00.000", from: bar(33), to: bar(34), pos: 0.262 },
  ],
};

export const R19: ReelSpec = {
  id: "R19",
  phase: "E",
  audioStart: bar(109),
  audioEnd: bar(121),
  concept: {
    name: "THE LONG WAY HOME",
    core: "The cinematic one. A long drive under the moon through the end of drop 2, a float through the last kick-out, then the final hit becomes morning: lamps switching off one by one, the sun behind the city, the name.",
    hook: "we took the long way home. on purpose.",
    approach: "Cinematic: long takes, rare and precise reactions (the last kick-out floats, the last hit turns the night into morning).",
    lyricSection: "End of drop 2 + final vocal (3:26.2) + outro (3:30-3:45)",
    editing: "7.5 s opening take with only a light kick response; no punch during the kick-out bar; the outro is three long shots and the title.",
    transitions: "Soft flash on 3:30.000, fades through the outro.",
    payoff: "The final hit of the song is the moment the night becomes morning.",
    loop: "No, ends on the lockup and silence.",
    caption: "the sky was getting light when we got home.",
    captions: [
      "the sky was getting light when we got home. nobody said a word.",
      "we took the long way home. on purpose.",
      "some nights end. this one just turned into morning.",
      "moonlight · AMISHAR  #progressivehouse #melodichouse #latenight #AMISHAR",
    ],
    why: "Release-week anchor: the whole emotional arc (movement → night → afterglow) in one Reel.",
  },
  shots: [
    { shot: "S012", from: bar(109), to: bar(112), cam: { zoom: [1.0, 1.08], kick: 0.005, handheld: 1 } },
    { shot: "S034", from: bar(112), to: bar(113), cam: { zoom: [1.04, 1.07], handheld: 0.8 } },
    { shot: "S008", from: bar(113), to: bar(117), params: { lampsOffAt: 212.5 }, cam: { zoom: [1.06, 1.0], handheld: 0.8 } },
    { shot: "S049", from: bar(117), to: bar(121), cam: { zoom: [1.0, 1.06], handheld: 0.5 }, in: { type: "fade", dur: 0.8 } },
  ],
  texts: [
    { kind: "hook", text: "we took the long way home. on purpose.", from: bar(109), to: 206.0 },
    { kind: "label", text: "4:52 AM", from: bar(113) + 0.4, to: bar(115) },
    { kind: "title", from: bar(119), to: bar(121) + 1, pos: 0.76, size: 56 },
  ],
  overlays: [{ type: "flash", at: 210, strength: 0.4, color: "#ffe9d2" }],
  fadeOut: 1.4,
};

export const R20: ReelSpec = {
  id: "R20",
  phase: "F",
  audioStart: bar(97),
  audioEnd: bar(101),
  concept: {
    name: "WATCH THE LAMPS",
    core: "One shot. A night drive where a streetlamp passes overhead exactly on every kick. Nothing else.",
    hook: "watch the lamps.",
    approach: "Satisfying-sync loop for discovery; one take, zero cuts.",
    lyricSection: "Drop 2, bars 97-100 (3:00.0-3:07.5)",
    editing: "No cuts. Kick = lamp pass + 1% punch; heavy Cm bar = slower deeper push.",
    transitions: "None.",
    payoff: "You notice the sync on the second loop.",
    loop: "Perfect: 4 bars of the loop, the last frame flows into the first.",
    caption: "128 bpm. one lamp per kick.",
    why: "Long-tail: the kind of Reel people rewatch and share without knowing the song yet.",
  },
  shots: [{ shot: "S001", from: bar(97), to: bar(101), params: { moonX: 0.28 }, cam: { zoom: [1.04, 1.04], kick: 0.01, bass: 0.03, handheld: 0.8 } }],
  texts: [
    { kind: "hook", text: "watch the lamps.", from: bar(97), to: 182.6 },
    { kind: "label", text: "128 BPM", from: bar(97), to: bar(101), pos: 0.8, opacity: 0.6 },
  ],
};

export const R21: ReelSpec = {
  id: "R21",
  phase: "F",
  audioStart: bar(72, 3),
  audioEnd: bar(81),
  concept: {
    name: "REWIND",
    core: "Reverse narrative. Start at sunrise and play the night backwards: the sun goes down, the lamps relight, the city's windows come back on, the bar's lights return, the dancers move in reverse, the walk goes backwards, and one window goes dark. The music keeps going forward over it.",
    hook: "start at the end.",
    approach: "Memory of a night; time runs backwards inside every shot while the song plays forward.",
    lyricSection: "Verse 2: 'If I took it alive... in the moonlight / I'm taking my time, telling the truth / 'cause only fools lie' (2:14.1-2:30.0)",
    editing: "Six shots, each a reversed piece of the night, with a mono clock label counting backwards.",
    transitions: "Dips between chapters.",
    payoff: "Ends where R01 started: one window, someone getting ready to go out.",
    loop: "Conceptually loops into R01.",
    caption: "how did we end up here? start at the end.",
    why: "Long-tail: rewards people who have already seen the campaign.",
  },
  shots: [
    { shot: "S049", from: bar(72, 3), to: bar(73, 4), warp: { speed: -1, shift: 8 }, cam: { zoom: [1.04, 1.0] } },
    { shot: "S008", from: bar(73, 4), to: bar(75, 2), params: { lampsOffAt: 216 }, warp: { speed: -1, shift: 219.5 - 135.9375 }, cam: { zoom: [1.02, 1.06] }, in: { type: "dip", dur: 0.3 } },
    { shot: "S025", from: bar(75, 2), to: bar(76, 4), params: { modeAt: 105 }, warp: { speed: -1, shift: 114 - 139.21875 }, cam: { zoom: [1.06, 1.02] }, in: { type: "dip", dur: 0.3 } },
    { shot: "S052", from: bar(76, 4), to: bar(78, 2), params: { closeAt: 105 }, warp: { speed: -1, shift: 107.4 - 142.03125 }, cam: { zoom: [1.02, 1.06] }, in: { type: "dip", dur: 0.3 } },
    { shot: "S057", from: bar(78, 2), to: bar(79, 4), warp: { speed: -1, shift: 100 - 145.3125 }, cam: { zoom: [1.06, 1.02] }, in: { type: "dip", dur: 0.3 } },
    { shot: "S100", from: bar(79, 4), to: bar(81), params: { oneAt: 3.0 }, warp: { speed: -1, shift: 4.6 - 148.59375 }, cam: { zoom: [1.0, 1.06] }, in: { type: "dip", dur: 0.3 } },
  ],
  texts: [
    { kind: "hook", text: "start at the end.", from: bar(72, 3), to: 137.0 },
    { kind: "label", text: "5:12 AM", from: bar(73, 4) + 0.2, to: bar(75, 2) - 0.1 },
    { kind: "label", text: "4:30 AM", from: bar(75, 2) + 0.2, to: bar(76, 4) - 0.1 },
    { kind: "label", text: "2:00 AM", from: bar(76, 4) + 0.2, to: bar(78, 2) - 0.1 },
    { kind: "label", text: "1:15 AM", from: bar(78, 2) + 0.2, to: bar(79, 4) - 0.1 },
    { kind: "label", text: "11:58 PM", from: bar(79, 4) + 0.2, to: bar(81) },
    { kind: "lyric", lyric: "V2L4", from: 142.06, to: 147.7, pos: "upper" },
  ],
  fadeOut: 0.6,
};

export const PHASE_E = [R17, R18, R19];
export const PHASE_F = [R20, R21];
