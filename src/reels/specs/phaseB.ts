/** PHASE B - RECOGNITION. The lyrics start to feel familiar; the voice becomes the hook. */
import { bar } from "../../engine/song";
import type { ReelSpec } from "../types";

export const R05: ReelSpec = {
  id: "R05",
  phase: "B",
  audioStart: bar(13),
  audioEnd: bar(17, 3),
  concept: {
    name: "NO DESTINATION",
    core: "A ride with no stated end: train window, trees whipping past the moon, a friend's taillights ahead. The line does the talking. The kick arrives under 'alive' and we're suddenly on the open road.",
    hook: "no plan was the plan.",
    approach: "Lyric-led, verse 1. Ends one beat into the kick entry as a tease of the groove.",
    lyricSection: "'It's not where you been, it's about where you're goin' (0:23.41-0:28.64) + 'If I took it alive' pickup",
    editing: "Cuts on 2-bar phrases; masts and branches pass at the verse travel rate (2 per bar), so motion speeds up the moment the kick comes in.",
    transitions: "Cut, cut, hard cut on 0:30.00.",
    payoff: "The road and its lamps start pumping on the kick entry.",
    loop: "Loosely: ends moving forward, starts moving forward.",
    caption: "it's not where you been.",
    why: "Makes the most quotable verse line recognisable on its own.",
  },
  shots: [
    { shot: "S018", from: bar(13), to: bar(15), cam: { zoom: [1.02, 1.06], handheld: 1 } },
    { shot: "S035", from: bar(15), to: bar(16), cam: { zoom: [1.06, 1.02] } },
    { shot: "S005", from: bar(16), to: bar(17), cam: { zoom: [1.0, 1.05], handheld: 1.2 } },
    { shot: "S001", from: bar(17), to: bar(17, 3), cam: { zoom: [1.08, 1.05], kick: 0.012, impact: 0.04 } },
  ],
  texts: [
    { kind: "hook", text: "no plan was the plan.", from: bar(13), to: 23.3 },
    { kind: "lyric", lyric: "V1L2", words: [0, 5], from: 23.41, to: 25.3 },
    { kind: "lyric", lyric: "V1L2", words: [5, 11], from: 25.07, to: 29.0 },
  ],
  grade: { contrast: 1.04 },
};

export const R06: ReelSpec = {
  id: "R06",
  phase: "B",
  audioStart: bar(20, 3),
  audioEnd: bar(25, 4),
  concept: {
    name: "3AM HONESTY",
    core: "The truth lines, set against the calmest images in the library: moonlight on black water, a buzzing neon word, the moon in a puddle that ripples on each kick, a cold white road.",
    hook: "everything sounds more honest after midnight.",
    approach: "Lyric-focused, intimate. The C-minor side of the song.",
    lyricSection: "'I'm taking my time, telling the truth / 'Cause only fools lie, fools lie' (0:37.06-0:46.2)",
    editing: "Long first shot (4.7 s). The TRUTH sign buzzes on the line. Puddle rings land on the verse kicks.",
    transitions: "Fade into TRUTH, cuts after.",
    payoff: "'fools lie' over the cold road: the warm palette drops away.",
    loop: "No.",
    caption: "only fools lie.",
    why: "Gives the song an emotional voice, not just a drop.",
  },
  shots: [
    { shot: "S037", from: bar(20, 3), to: bar(23), cam: { zoom: [1.0, 1.08], handheld: 0.4 } },
    { shot: "S065", from: bar(23), to: bar(23, 4), cam: { zoom: [1.1, 1.04] }, in: { type: "fade", dur: 0.3 } },
    { shot: "S104", from: bar(23, 4), to: bar(24, 4), cam: { zoom: [1.02, 1.06], kick: 0.005 } },
    { shot: "S009", from: bar(24, 4), to: bar(25, 4), cam: { zoom: [1.04, 1.06], kick: 0.006 } },
  ],
  texts: [
    { kind: "hook", text: "everything sounds more honest after midnight.", from: bar(20, 3), to: 39.8 },
    { kind: "lyric", lyric: "V1L4", from: 37.06, to: 42.6, pos: "lower" },
    { kind: "lyric", lyric: "V1L5", from: 42.8, to: 46.4, pos: "lower" },
  ],
  grade: { contrast: 1.05, saturate: 0.9 },
};

export const R07: ReelSpec = {
  id: "R07",
  phase: "B",
  audioStart: bar(59, 4) - 0.047,
  audioEnd: bar(65, 2),
  concept: {
    name: "THE WALK HOME",
    core: "Everyone spills out, the night goes quiet, and for two seconds there's no music under anything. Then the kick comes back.",
    hook: "walking home slower than we need to.",
    approach: "Quiet → payoff. The breakdown is the most intimate part of the record; this Reel lives inside it.",
    lyricSection: "Breakdown: 'Grooving till the bar kicks us out / Oh, oh, oh' (1:50.7-1:58.9) + near silence + kick return (2:00.00)",
    editing: "Three slow shots, then a held, totally still puddle in the near-silence (1:58.1-2:00), then the open road on the returning kick.",
    transitions: "Fades between the slow shots, matte closes in the silence and snaps open on the kick.",
    payoff: "The kick at 2:00.00 opens the frame and the road starts moving.",
    loop: "No.",
    caption: "nobody said it but nobody wanted to go home yet.",
    why: "Recognition through feeling: the breakdown vocal is the most human moment in the track.",
  },
  shots: [
    { shot: "S072", from: bar(59, 4) - 0.047, to: 115.2, cam: { zoom: [1.0, 1.05], handheld: 0.8 } },
    { shot: "S037", from: 115.2, to: bar(64), cam: { zoom: [1.04, 1.1], handheld: 0.4 }, in: { type: "fade", dur: 0.5 } },
    { shot: "S108", from: bar(64), to: bar(65), cam: { zoom: [1.06, 1.06], handheld: 0 }, warp: { speed: 0 } },
    { shot: "S007", from: bar(65), to: bar(65, 2), cam: { zoom: [1.08, 1.04], impact: 0.05 } },
  ],
  texts: [
    { kind: "hook", text: "walking home slower than we need to.", from: bar(59, 4), to: 113.6 },
    { kind: "lyric", lyric: "BRL4", from: 110.67, to: 115.0 },
  ],
  matte: [
    [bar(64), 1.78],
    [bar(65) - 0.05, 1.0],
    [bar(65), 1.78],
  ],
  fadeIn: 0.3,
};

export const R08: ReelSpec = {
  id: "R08",
  phase: "B",
  audioStart: bar(65),
  audioEnd: bar(73),
  concept: {
    name: "WE RISE AND WE FALL",
    core: "The bridge lyric, sung once in the whole song, gets the most cinematic treatment: our three shadows running ahead with the sun behind us, a shooting star across the 2-second gap after 'sun', the rooftop, the lyric becoming a neon sign, then just stars.",
    hook: "for the ones who stayed out with you.",
    approach: "Lyric-focused emotional peak. Longest takes in the campaign.",
    lyricSection: "'Shoot for the stars with our backs to the sun / We rise and we fall, living forever young' (2:00.79-2:14.03)",
    editing: "5.6 s opening take. The shooting star is placed in the vocal gap (2:05.7-2:08.0) so the silence has an event. The camera rises on 'we rise'.",
    transitions: "Fade into the stars, cut on 'we rise', cut into the neon on 'forever young'.",
    payoff: "'forever young' appears as a sign in the world instead of a caption.",
    loop: "No, ends on open sky.",
    caption: "we rise and we fall. say it while it's still true.",
    why: "This is the line people will quote. It should feel like a memory, not an ad.",
  },
  shots: [
    { shot: "S046", from: bar(65), to: bar(68), cam: { zoom: [1.0, 1.12], kick: 0.004, handheld: 1 } },
    { shot: "S043", from: bar(68), to: bar(69), params: { shootAt: 126.4 }, cam: { zoom: [1.0, 1.04], handheld: 0.4 }, in: { type: "fade", dur: 0.25 } },
    { shot: "S024", from: bar(69), to: bar(71), cam: { zoom: [1.04, 1.1], pan: [[0, 90], [0, -20]], kick: 0.004 } },
    { shot: "S066", from: bar(71), to: bar(72), cam: { zoom: [1.08, 1.02] } },
    { shot: "S040", from: bar(72), to: bar(73), cam: { zoom: [1.0, 1.05], handheld: 0.5 } },
  ],
  texts: [
    { kind: "hook", text: "for the ones who stayed out with you.", from: bar(65), to: 123.5 },
    { kind: "lyric", lyric: "V2L1", from: 120.79, to: 125.74, pos: "lower" },
    { kind: "lyric", lyric: "V2L2", words: [0, 5], from: 127.99, to: bar(71) - 0.05, pos: "lower", exit: "cut" },
  ],
  grade: { contrast: 1.03, saturate: 0.96 },
};

export const PHASE_B = [R05, R06, R07, R08];
