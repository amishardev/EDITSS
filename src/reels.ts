import {BAR, WIDTH, laneCy as L, lanesRect as lanes} from './lib/timeline';
import type {Ease, Rect} from './lib/timeline';
import type {Grade, Light, ReelSpec, Shot} from './lib/types';

// Section map of the recording (seconds, 128 BPM, 1 bar = 1.875s):
//   0.0   intro, live sitar on track 2 ("SITAR 1 PLAYED")
//   7.5   impact hit, drums enter
//  37.5   build 1: piano, sitar chops (SIT_D) on track 7, risers
//  67.5   DROP 1: KSHMR stab, MIDI patterns 2-8, kick on track 14
//  97.5   breakdown: "sitar sample" on track 4, ambience vocal
// 112.5   impact hit inside the breakdown
// 127.5   re-entry: piano, lead enhancer, Sylenth volume automation
// 142.5   build 2: sitar chops return
// 157.5   DROP 2: double kick (tracks 6/7), bass on 11 + 13
// 202.5   outro: live sitar back on track 3, reverb mix automation

const shot = (at: number, cx: number, cy: number, z: number, o: {cut?: boolean; ease?: Ease} = {}): Shot => ({at, cx, cy, z, ...o});
const light = (at: number, rect: Rect, dim: number, o: {cut?: boolean; ease?: Ease} = {}): Light => ({at, rect, dim, ...o});
const grade = (at: number, sat: number, con: number, bri: number, warm = 0, o: {cut?: boolean; ease?: Ease} = {}): Grade => ({at, sat, con, bri, warm, ...o});

const FULL: Rect = [0, 0, WIDTH, 1920];
const CX = 620; // centre of the clip area, right of the track headers

export const reels: ReelSpec[] = [
  // 01 - build 1 into DROP 1. Slow tense push on the risers, then the frame opens.
  {
    id: 'MIZRAB-REEL-01',
    segments: [{src: 60, dur: 15}],
    shots: [
      shot(0, CX, L(11.5), 1.7),
      shot(7.45, 720, L(11.5), 2.35, {ease: 'in'}),
      shot(7.5, 540, 960, 1.14, {cut: true}),
      shot(8.0, 540, 960, 1.0, {ease: 'out'}),
      shot(9.375, CX, L(14), 1.85, {cut: true}),
      shot(11.2, 700, L(14), 1.95, {ease: 'linear'}),
      shot(11.25, CX, L(4), 1.85, {cut: true}),
      shot(13.1, 700, L(4), 1.95, {ease: 'linear'}),
      shot(13.125, 540, 960, 1.0, {cut: true}),
      shot(15, 540, 960, 1.05, {ease: 'linear'}),
    ],
    grade: [grade(0, 0.7, 1.05, 0.82), grade(7.45, 0.6, 1.08, 0.78, 0, {ease: 'linear'}), grade(7.5, 1.0, 1.12, 1.0, 0, {cut: true})],
    pulse: [{from: 7.5, to: 15, amt: 0.018}],
    captions: [
      {kind: 'hook', style: 'words', text: 'listen to what happens here.', from: 0.08, to: 3.4},
      {kind: 'label', text: 'risers · tracks 9-14', from: 3.8, to: 7.2, align: 'left', y: 1440},
      {kind: 'label', text: 'bar 37 · drop', from: 7.5, to: 9.3, align: 'left', y: 1440, accent: true},
      {kind: 'label', text: 'kick · track 14', from: 9.375, to: 11.2, align: 'left', y: 1440},
      {kind: 'label', text: 'midi · patterns 5-8', from: 11.25, to: 13.1, align: 'left', y: 1440},
    ],
    signature: true,
  },

  // 02 - the live sitar intro. Tight lateral track along the waveform, warm.
  {
    id: 'MIZRAB-REEL-02',
    segments: [{src: 0, dur: 15}],
    shots: [
      shot(0, 330, L(2), 2.4),
      shot(7.3, 820, L(2), 2.55, {ease: 'linear'}),
      shot(10.6, 560, 900, 1.15),
      shot(15, 540, 940, 1.07, {ease: 'linear'}),
    ],
    lights: [light(0, lanes(2, 2), 0.55), light(7.3, lanes(2, 2), 0.55), light(9.8, lanes(1, 16, 0), 0)],
    grade: [grade(0, 0.85, 1.06, 0.92, 0.16)],
    captions: [
      {kind: 'hook', style: 'type', text: "the sitar wasn't supposed to sound like this.", from: 0.04, to: 3.6},
      {kind: 'label', text: 'track 02 · sitar 1 played', from: 4.0, to: 7.3, align: 'left', y: 1440, accent: true},
      {kind: 'line', text: 'then everything else had to fit around it.', from: 10.4, to: 14.6, y: 300},
    ],
    signature: true,
  },

  // 03 - breakdown. Desaturated, intimate, sitar sample lane only, until the hit.
  {
    id: 'MIZRAB-REEL-03',
    segments: [{src: 99.375, dur: 16.875}],
    shots: [
      shot(0, CX, L(4), 2.0),
      shot(13.08, 720, L(4), 2.7, {ease: 'linear'}),
      shot(13.125, 540, 960, 1.1, {cut: true}),
      shot(13.6, 540, 960, 1.0, {ease: 'out'}),
      shot(16.875, 540, 960, 1.04, {ease: 'linear'}),
    ],
    lights: [light(0, lanes(4, 4), 0.62), light(13.08, lanes(4, 4), 0.7), light(13.125, FULL, 0, {cut: true})],
    grade: [grade(0, 0.3, 1.04, 0.8, 0.12), grade(13.08, 0.25, 1.06, 0.75, 0.12), grade(13.125, 1.0, 1.1, 1.0, 0, {cut: true})],
    captions: [
      {kind: 'hook', style: 'fade', text: 'i almost deleted this part.', from: 0.05, to: 3.8},
      {kind: 'line', text: 'a sitar sample, sitting alone on track 4.', from: 4.4, to: 8.8, y: 300},
      {kind: 'line', text: 'glad i kept it.', from: 13.2, to: 16.5, y: 300},
    ],
  },

  // 04 - DROP 2 told as layers: a spotlight opens one lane at a time, every 2 bars.
  {
    id: 'MIZRAB-REEL-04',
    segments: [{src: 157.5, dur: 15}],
    shots: [shot(0, 540, 960, 1.0), shot(15, 560, 960, 1.07, {ease: 'linear'})],
    lights: [
      light(0, lanes(2, 2), 0.9),
      light(3.75, lanes(2, 2), 0.9),
      light(4.2, lanes(2, 5), 0.86, {ease: 'out'}),
      light(7.5, lanes(2, 5), 0.86),
      light(7.95, lanes(2, 10), 0.8, {ease: 'out'}),
      light(11.25, lanes(2, 10), 0.8),
      light(11.8, lanes(1, 16, 0), 0, {ease: 'out'}),
    ],
    grade: [grade(0, 0.9, 1.1, 0.95)],
    pulse: [{from: 0, to: 15, amt: 0.01}],
    captions: [
      {kind: 'hook', style: 'words', text: 'this started with one tiny melody.', from: 0.06, to: 3.5},
      {kind: 'label', text: '1 lane · pattern 2', from: 0.4, to: 3.75, align: 'left', y: 1440},
      {kind: 'label', text: '4 lanes', from: 3.75, to: 7.5, align: 'left', y: 1440},
      {kind: 'label', text: '9 lanes', from: 7.5, to: 11.25, align: 'left', y: 1440},
      {kind: 'label', text: 'all 16 tracks', from: 11.25, to: 14.8, align: 'left', y: 1440, accent: true},
    ],
  },

  // 05 - re-entry at bar 69, cut on every bar like a mix engineer soloing tracks.
  {
    id: 'MIZRAB-REEL-05',
    segments: [{src: 125.625, dur: 15}],
    shots: [
      shot(0, 540, 960, 1.0),
      shot(1.85, 540, 960, 1.04, {ease: 'linear'}),
      shot(BAR, 540, 960, 1.12, {cut: true}),
      shot(BAR + 0.4, 540, 960, 1.0, {ease: 'out'}),
      shot(BAR * 2, 700, L(1), 2.2, {cut: true}),
      shot(BAR * 3 - 0.05, 560, L(1), 2.25, {ease: 'linear'}),
      shot(BAR * 3, 560, L(10), 2.1, {cut: true}),
      shot(BAR * 4 - 0.05, 720, L(10), 2.15, {ease: 'linear'}),
      shot(BAR * 4, 560, L(14), 2.3, {cut: true}),
      shot(BAR * 5 - 0.05, 700, L(14), 2.35, {ease: 'linear'}),
      shot(BAR * 5, 520, L(6), 2.4, {cut: true}),
      shot(BAR * 6 - 0.05, 640, L(6), 2.45, {ease: 'linear'}),
      shot(BAR * 6, CX, L(2.5), 2.0, {cut: true}),
      shot(BAR * 7 - 0.05, 700, L(2.5), 2.05, {ease: 'linear'}),
      shot(BAR * 7, CX, L(10), 1.6, {cut: true}),
      shot(BAR * 7.5, CX, L(14), 1.9, {cut: true}),
      shot(BAR * 8 - 0.05, CX, L(14), 1.95, {ease: 'linear'}),
    ],
    grade: [grade(0, 0.85, 1.14, 0.96)],
    pulse: [{from: BAR, to: 15, amt: 0.014}],
    counter: {from: BAR, to: 15},
    captions: [
      {kind: 'hook', style: 'cut', text: 'bar 69. everything comes back.', from: 0.0, to: BAR},
      {kind: 'label', text: 'piano', from: BAR * 2, to: BAR * 3, align: 'left', y: 300},
      {kind: 'label', text: 'lead enhancer', from: BAR * 3, to: BAR * 4, align: 'left', y: 300},
      {kind: 'label', text: 'kick', from: BAR * 4, to: BAR * 5, align: 'left', y: 300},
      {kind: 'label', text: 'sylenth volume automation', from: BAR * 5, to: BAR * 6, align: 'left', y: 300, accent: true},
      {kind: 'label', text: 'midi', from: BAR * 6, to: BAR * 7, align: 'left', y: 300},
    ],
  },

  // 06 - the moment the intro turns into the build. Black and white until bar 21.
  {
    id: 'MIZRAB-REEL-06',
    segments: [{src: 33.75, dur: 15}],
    shots: [
      shot(0, 540, 960, 1.0),
      shot(3.7, 540, 960, 1.04, {ease: 'linear'}),
      shot(3.75, 540, 960, 1.12, {cut: true}),
      shot(4.2, 540, 960, 1.0, {ease: 'out'}),
      shot(14.9, 700, L(9), 1.65),
    ],
    grade: [grade(0, 0, 1.08, 0.66), grade(3.72, 0, 1.08, 0.66), grade(4.3, 1.0, 1.1, 1.0, 0, {ease: 'out'})],
    captions: [
      {kind: 'hook', style: 'fade', text: 'this is where MIZRAB changed.', from: 0.05, to: 3.75, y: 860},
      {kind: 'label', text: 'bar 21', from: 3.8, to: 6.5, align: 'left', y: 300, accent: true},
      {kind: 'line', text: 'sitar chops. piano. two risers.', from: 6.8, to: 11.5, y: 300},
    ],
    signature: true,
  },

  // 07 - DROP 2 split into three instrument panes. Cool, clinical, technical.
  {
    id: 'MIZRAB-REEL-07',
    segments: [{src: 172.5, dur: 15}],
    shots: [shot(0, 540, 960, 1)],
    panes: [
      {top: 540, h: 360, cx: 640, cy: L(11), z: 2.0, label: 'BASS · TRACK 11'},
      {top: 930, h: 360, cx: 640, cy: L(6.5), z: 1.75, label: 'KICK · TRACKS 6-7'},
      {top: 1320, h: 360, cx: 640, cy: L(9), z: 2.0, label: 'LEAD · TRACK 9'},
    ],
    grade: [grade(0, 0.75, 1.15, 0.98)],
    pulse: [{from: 0, to: 15, amt: 0.03}],
    captions: [
      {kind: 'hook', style: 'type', text: 'watch the bass, not the drums.', from: 0.04, to: 4.2, y: 270},
      {kind: 'line', text: 'same notes. three jobs.', from: 7.5, to: 11.25, y: 290},
    ],
  },

  // 08 - outro. The live sitar returns, reverb automation takes it away. End card.
  {
    id: 'MIZRAB-REEL-08',
    segments: [{src: 200.625, dur: 17.8}],
    shots: [
      shot(0, 540, 960, 1.0),
      shot(1.85, 540, 960, 1.03, {ease: 'linear'}),
      shot(BAR, 700, L(3), 2.1, {cut: true}),
      shot(6.5, 640, L(3), 2.15, {ease: 'linear'}),
      shot(9.6, 720, L(12.5), 1.9),
      shot(13.9, 780, L(12.5), 2.0, {ease: 'linear'}),
      shot(15.2, 540, 960, 1.0),
    ],
    lights: [
      light(0, FULL, 0),
      light(BAR, lanes(3, 3), 0.55, {cut: true}),
      light(6.5, lanes(3, 3), 0.55),
      light(9.6, lanes(11, 14), 0.55),
      light(13.9, lanes(11, 14), 0.55),
      light(14.6, FULL, 0),
    ],
    grade: [grade(0, 0.8, 1.08, 0.95, 0.1), grade(14.2, 0.6, 1.08, 0.9, 0.14), grade(15.2, 0.4, 1.0, 0.28, 0.14)],
    captions: [
      {kind: 'hook', style: 'fade', text: 'how MIZRAB says goodbye.', from: 0.05, to: 3.4},
      {kind: 'label', text: 'track 03 · sitar 1 played, again', from: 3.6, to: 7.2, align: 'left', y: 1440, accent: true},
      {kind: 'label', text: 'reverb mix · automation', from: 9.8, to: 13.9, align: 'left', y: 1440},
      {kind: 'title', text: 'MIZRAB|AMISHAR|out now', from: 15.0, to: 17.8},
    ],
  },

  // 09 - DROP 1 as a film: letterbox, one continuous drift, no cuts, then darkness.
  {
    id: 'MIZRAB-REEL-09',
    segments: [{src: 82.5, dur: 16.875}],
    shots: [
      shot(0, 380, 700, 1.35),
      shot(14.95, 760, 1300, 1.62, {ease: 'linear'}),
      shot(15, 540, 960, 1.0, {cut: true}),
    ],
    grade: [grade(0, 0.7, 1.18, 0.92, 0.08), grade(14.95, 0.7, 1.18, 0.92, 0.08), grade(15, 0.3, 1.1, 0.22, 0.1, {cut: true})],
    letterbox: 250,
    pulse: [{from: 0, to: 15, amt: 0.008}],
    captions: [
      {kind: 'hook', style: 'cut', text: 'no vocals. no lyrics. just this.', from: 0.0, to: 3.2, y: 300},
      {kind: 'title', text: 'MIZRAB|AMISHAR', from: 15.1, to: 16.875},
    ],
  },

  // 10 - one sitar, four sections of the song, cut bar-accurately back to back.
  {
    id: 'MIZRAB-REEL-10',
    segments: [
      {src: 3.75, dur: BAR * 2},
      {src: 45, dur: BAR * 2},
      {src: 101.25, dur: BAR * 2},
      {src: 187.5, dur: BAR * 2},
    ],
    shots: [
      shot(0, CX, L(2), 2.3),
      shot(3.7, 780, L(2), 2.45, {ease: 'linear'}),
      shot(3.75, CX, L(7), 2.2, {cut: true}),
      shot(7.45, 780, L(7), 2.35, {ease: 'linear'}),
      shot(7.5, CX, L(4), 2.2, {cut: true}),
      shot(11.2, 780, L(4), 2.35, {ease: 'linear'}),
      shot(11.25, 540, 960, 1.14, {cut: true}),
      shot(11.7, 540, 960, 1.0, {ease: 'out'}),
      shot(15, 540, 960, 1.04, {ease: 'linear'}),
    ],
    lights: [
      light(0, lanes(2, 2), 0.5),
      light(3.75, lanes(7, 7), 0.5, {cut: true}),
      light(7.5, lanes(4, 4), 0.5, {cut: true}),
      light(11.25, FULL, 0, {cut: true}),
    ],
    grade: [grade(0, 0.85, 1.1, 0.95, 0.1), grade(11.2, 0.85, 1.1, 0.95, 0.1), grade(11.25, 1.0, 1.14, 1.0, 0, {cut: true})],
    pulse: [{from: 11.25, to: 15, amt: 0.02}],
    captions: [
      {kind: 'hook', style: 'words', text: 'one sitar. four lives.', from: 0.06, to: 3.4},
      {kind: 'label', text: '01  played', from: 0.6, to: 3.75, align: 'left', y: 1440},
      {kind: 'label', text: '02  chopped', from: 3.75, to: 7.5, align: 'left', y: 1440},
      {kind: 'label', text: '03  sampled', from: 7.5, to: 11.25, align: 'left', y: 1440},
      {kind: 'label', text: '04  dropped', from: 11.25, to: 14.8, align: 'left', y: 1440, accent: true},
    ],
    signature: true,
  },
];
