import type { CamSpec } from "../motion/Camera";
import type { TransitionIn } from "../motion/Transitions";
import type { TextUse } from "../type/Type";

export type Grade = {
  contrast?: number;
  saturate?: number;
  brightness?: number;
  hue?: number;
  tint?: string;
  tintAmount?: number;
};

export type ShotUse = {
  /** library id, e.g. "S012" (see src/library/shots.ts) */
  shot: string;
  /** song seconds */
  from: number;
  to: number;
  params?: Record<string, unknown>;
  cam?: CamSpec;
  in?: TransitionIn;
  /** time remap inside the shot: speed 0 = hold, <1 = slow, -1 = reverse */
  warp?: { speed: number; anchor?: number; shift?: number };
  grade?: Grade;
};

export type Phase = "A" | "B" | "C" | "D" | "E" | "F";

export type ReelConcept = {
  name: string;
  core: string;
  hook: string;
  approach: string;
  lyricSection: string;
  editing: string;
  transitions: string;
  payoff: string;
  loop: string;
  caption: string;
  why: string;
};

export type ReelSpec = {
  id: string;
  phase: Phase;
  /** song seconds; start is snapped to the frame grid */
  audioStart: number;
  audioEnd: number;
  shots: ShotUse[];
  texts: TextUse[];
  overlays?: (TransitionIn & { at: number })[];
  /** cinematic matte keyframes: [song time, visible height / width]; 1.78 = full 9:16 */
  matte?: [number, number][];
  grade?: Grade;
  grain?: number;
  vignette?: number;
  fadeIn?: number;
  fadeOut?: number;
  concept: ReelConcept;
};
