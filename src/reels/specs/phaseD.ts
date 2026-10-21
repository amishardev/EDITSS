/**
 * PHASE D - STRONGEST MUSICAL MOMENTS. Every drop Reel uses a different reactive approach:
 *   R12 rhythm-driven · R13 groove/dancing · R14 impact-driven · R15 contrast · R16 phrase montage
 */
import { bar } from "../../engine/song";
import type { ReelSpec, ShotUse } from "../types";

const groove = { kick: 0.01, bass: 0.035, clap: 3, handheld: 1.2 };

export const R12: ReelSpec = {
  id: "R12",
  phase: "D",
  audioStart: bar(37),
  audioEnd: bar(45),
  concept: {
    name: "THE CITY PLAYS ALONG",
    core: "Rhythm-driven. The city performs the drop: apartment windows play the real kick/clap/hat pattern, beacons blink on the kick, light pulses ride the highway lanes, bodies bounce behind glass.",
    hook: "even the windows know this one.",
    approach: "Rhythm-driven drop edit, cut on claps (beats 2 and 4) and phrase lines, never on every beat.",
    lyricSection: "Drop 1, bars 37-44 (1:07.5-1:22.5), vocal chops at 1:07.7 and 1:09.2",
    editing: "Phrase 1: two 2-beat cuts, then 1-bar shots; the heavy Cm bar (bar 39) gets the longest, deepest-pushing shot. Phrase 2 mirrors it, and the last bar accelerates to one shot per beat as a fill into the loop point.",
    transitions: "Hard cuts only, on claps and bar lines.",
    payoff: "Bar 44: four one-beat shots, then it loops back to the windows.",
    loop: "Yes, bar 37 to bar 45 is 8 full bars of the same loop; the audio and the first shot line up.",
    caption: "the whole city's on the same beat tonight.",
    why: "Shows the groove itself; no lyric needed, high replay value.",
  },
  shots: [
    { shot: "S101", from: bar(37), to: bar(37, 3), cam: { ...groove, zoom: [1.02, 1.04] } },
    { shot: "S027", from: bar(37, 3), to: bar(38), cam: { ...groove, zoom: [1.04, 1.07] } },
    { shot: "S095", from: bar(38), to: bar(39), cam: { ...groove, zoom: [1.02, 1.05] } },
    { shot: "S057", from: bar(39), to: bar(40), cam: { ...groove, bass: 0.06, zoom: [1.02, 1.08] } },
    { shot: "S034", from: bar(40), to: bar(41), cam: { ...groove, zoom: [1.04, 1.04] } },
    { shot: "S023", from: bar(41), to: bar(42), cam: { ...groove, zoom: [1.02, 1.05] } },
    { shot: "S105", from: bar(42), to: bar(42, 3), cam: { ...groove, zoom: [1.04, 1.06] } },
    { shot: "S102", from: bar(42, 3), to: bar(43), cam: { ...groove, zoom: [1.02, 1.05] } },
    { shot: "S036", from: bar(43), to: bar(44), cam: { ...groove, bass: 0.06, zoom: [1.02, 1.08] } },
    { shot: "S101", from: bar(44), to: bar(44, 2), cam: { ...groove, zoom: [1.06, 1.06] } },
    { shot: "S095", from: bar(44, 2), to: bar(44, 3), cam: { ...groove, zoom: [1.06, 1.06] } },
    { shot: "S027", from: bar(44, 3), to: bar(44, 4), cam: { ...groove, zoom: [1.06, 1.06] } },
    { shot: "S057", from: bar(44, 4), to: bar(45), cam: { ...groove, zoom: [1.06, 1.06] } },
  ],
  texts: [{ kind: "hook", text: "even the windows know this one.", from: bar(37), to: 71.0 }],
};

export const R13: ReelSpec = {
  id: "R13",
  phase: "D",
  audioStart: bar(45),
  audioEnd: bar(53),
  concept: {
    name: "BEHIND THE GLASS",
    core: "Dancing without faces. We stay on the street side of the window: shapes behind steamed glass bounce on the kick and throw their arms up on the heavy bass bar, a single flat in a dark block is the only party in town.",
    hook: "you could see the party from the street.",
    approach: "Groove-follow. Longer shots that let the dancing play; the bass bars decide where the cuts go.",
    lyricSection: "Drop 1, bars 45-52 (1:22.5-1:37.5), vocal chops 1:24.6 and 1:28.0-1:31.3",
    editing: "2-bar opening take, cuts on bar lines, the bass-accent bars (47, 51) get the shots with arms up and the deepest camera push.",
    transitions: "Cuts; one fade between the two frosted shots.",
    payoff: "Bar 51: the crowd shot with every arm up on the heaviest bass of the phrase.",
    loop: "Yes, 8 bars from a phrase start.",
    caption: "we were the window you could see from the street.",
    why: "The nightlife/dance pillar without stock dancers or DJ hands.",
  },
  shots: [
    { shot: "S057", from: bar(45), to: bar(47), cam: { ...groove, zoom: [1.02, 1.07] } },
    { shot: "S102", from: bar(47), to: bar(48), cam: { ...groove, bass: 0.05, zoom: [1.0, 1.04] } },
    { shot: "S058", from: bar(48), to: bar(49), cam: { ...groove, zoom: [1.04, 1.08] } },
    { shot: "S051", from: bar(49), to: bar(50), cam: { ...groove, zoom: [1.02, 1.05] } },
    { shot: "S059", from: bar(50), to: bar(52), cam: { ...groove, bass: 0.06, zoom: [1.04, 1.1] } },
    { shot: "S105", from: bar(52), to: bar(52, 3), cam: { ...groove } },
    { shot: "S057", from: bar(52, 3), to: bar(53), cam: { ...groove, zoom: [1.08, 1.06] }, in: { type: "fade", dur: 0.2 } },
  ],
  texts: [{ kind: "hook", text: "you could see the party from the street.", from: bar(45), to: 86.0 }],
};

export const R14: ReelSpec = {
  id: "R14",
  phase: "D",
  audioStart: bar(85),
  audioEnd: bar(91),
  concept: {
    name: "EXIT",
    core: "Impact-driven. One tunnel, one exit. The fixtures accelerate with the 8th and 16th rolls, the frame tightens, and the opening at the end grows until we burst out into the night on the drop.",
    hook: "the exit is the best part.",
    approach: "Build-and-release with as few cuts as possible: the drop is the only cut that matters.",
    lyricSection: "Build 2 into drop 2: 'moving to the music, grooving till the bar kicks us out' (2:40.96-2:45.85)",
    editing: "A 7.5 s single take through the build, then one 3.75 s shot of the drop. The only reactive moves are tension (zoom creep) in the build and a single big push on the drop.",
    transitions: "Matte closes through the build and snaps open with an exposure flash on 2:45.000.",
    payoff: "Burst out of the tunnel exactly on 'OUT'.",
    loop: "No.",
    caption: "some nights you hear the exit before you see it.",
    captions: [
      "some nights you hear the exit before you see it.",
      "2:45. that's where it opens up.",
      "the tunnel was the build. the exit was the drop.",
      "moonlight · AMISHAR  #progressivehouse #melodichouse #latenight #AMISHAR",
    ],
    why: "The cleanest possible drop moment for the strongest drop.",
  },
  shots: [
    { shot: "S013", from: bar(85), to: bar(89), params: { exitAt: 165 }, cam: { zoom: [1.0, 1.08], tension: 0.08, handheld: 1 } },
    { shot: "S012", from: bar(89), to: bar(91), cam: { zoom: [1.1, 1.03], drop: 0.08, kick: 0.012, bass: 0.03, blur: 2.5 } },
  ],
  texts: [
    { kind: "hook", text: "the exit is the best part.", from: bar(85), to: 160.5 },
    { kind: "lyric", lyric: "PC2L5", from: 162.95, to: 164.98, pos: "upper", exit: "cut" },
  ],
  overlays: [{ type: "flash", at: 165, strength: 0.6, dur: 0.4 }],
  matte: [
    [bar(85), 1.78],
    [bar(89) - 0.02, 1.0],
    [bar(89), 1.78],
  ],
};

export const R15: ReelSpec = {
  id: "R15",
  phase: "D",
  audioStart: bar(101),
  audioEnd: bar(107),
  concept: {
    name: "STILL",
    core: "Contrast. Drop 2 is playing at full power and the picture refuses to move: a still puddle holding the moon, no camera, no reaction. When the kick drops out (3:13.1) the frame closes to a slit. When it slams back (3:15.000) a foot lands in the moon and everything moves at once.",
    hook: "nothing moved until it did.",
    approach: "Extremely restrained opening → sudden reaction, built on the kick-out bar that only exists in drop 2.",
    lyricSection: "Drop 2, bars 101-106 (3:07.5-3:18.75), kick-out bar 104",
    editing: "5.6 s frozen frame, 1 bar of slit, then four fast shots (one beat, then 1-2 bars) in the slam.",
    transitions: "Matte to slit in the kick-out bar, flash + full open on the slam.",
    payoff: "The moon reflection shatters on 3:15.000.",
    loop: "No.",
    caption: "wait for it.",
    why: "Different from every other drop Reel because the visuals ignore the music on purpose until the one moment they can't.",
  },
  shots: [
    { shot: "S108", from: bar(101), to: bar(104), warp: { speed: 0 }, cam: { zoom: [1.06, 1.06], handheld: 0 }, grade: { saturate: 0.6 } },
    { shot: "S033", from: bar(104), to: bar(105), cam: { zoom: [1.0, 1.18], handheld: 0.2 } },
    { shot: "S107", from: bar(105), to: bar(105, 2), params: { step: 195 }, cam: { zoom: [1.12, 1.04], impact: 0.1, blur: 3 } },
    { shot: "S070", from: bar(105, 2), to: bar(106), cam: { ...groove, zoom: [1.06, 1.04] } },
    { shot: "S095", from: bar(106), to: bar(106, 3), cam: { ...groove } },
    { shot: "S002", from: bar(106, 3), to: bar(107), cam: { ...groove, zoom: [1.04, 1.06] } },
  ],
  texts: [{ kind: "hook", text: "nothing moved until it did.", from: bar(101), to: 192.9 }],
  overlays: [{ type: "flash", at: 195, strength: 0.65 }],
  matte: [
    [bar(104), 1.78],
    [bar(104, 3), 0.12],
    [bar(105) - 0.02, 0.06],
    [bar(105), 1.78],
  ],
};

// R16: phrase montage on drop 2's middle; the heavy bars carry the biggest images
const montage: ShotUse[] = [
  { shot: "S070", from: bar(93), to: bar(94), cam: { ...groove } },
  { shot: "S050", from: bar(94), to: bar(95), cam: { ...groove } },
  { shot: "S024", from: bar(95), to: bar(96), cam: { ...groove, bass: 0.07, zoom: [1.0, 1.06] } },
  { shot: "S076", from: bar(96), to: bar(97), cam: { ...groove } },
  { shot: "S058", from: bar(97), to: bar(98), cam: { ...groove } },
  { shot: "S066", from: bar(98), to: bar(99), cam: { ...groove, zoom: [1.06, 1.02] } },
  { shot: "S041", from: bar(99), to: bar(100), cam: { ...groove, bass: 0.07, zoom: [1.0, 1.06] } },
  { shot: "S007", from: bar(100), to: bar(100, 3), cam: { ...groove } },
  { shot: "S070", from: bar(100, 3), to: bar(100, 4), cam: { ...groove } },
  { shot: "S095", from: bar(100, 4), to: bar(101), cam: { ...groove } },
];

export const R16: ReelSpec = {
  id: "R16",
  phase: "D",
  audioStart: bar(93),
  audioEnd: bar(101),
  concept: {
    name: "THE SUMMER NOBODY SLEPT",
    core: "A youth montage without models or fake freedom: running shadows, four shadows racing the sun, the rooftop, a crowd on the crossing, glass full of dancers, 'forever young' as a neon sign, star trails, the open road.",
    hook: "the summer nobody slept.",
    approach: "Phrase montage: one image per bar, faster only at the end of the 8-bar phrase.",
    lyricSection: "Drop 2, bars 93-100 (2:52.5-3:07.5)",
    editing: "Bar-length shots; the heavy Cm bars (95, 99) hold the two widest, most emotional images (rooftop, star trails) with the deepest push; bar 100 splits into beats as a fill.",
    transitions: "Hard cuts on bar lines.",
    payoff: "'forever young' neon on bar 98, star trails on the heaviest bass of the phrase.",
    loop: "Yes, 8 bars of the same loop.",
    caption: "we were young and up all night and it felt like it would last.",
    why: "Youth/freedom pillar, built from the library instead of stock 'freedom' footage.",
  },
  shots: montage,
  texts: [{ kind: "hook", text: "the summer nobody slept.", from: bar(93), to: 176.0 }],
};

export const PHASE_D = [R12, R13, R14, R15, R16];
