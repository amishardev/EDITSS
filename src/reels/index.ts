import { PHASE_A } from "./specs/phaseA";
import { PHASE_B } from "./specs/phaseB";
import { PHASE_C } from "./specs/phaseC";
import { PHASE_D } from "./specs/phaseD";
import { PHASE_E, PHASE_F } from "./specs/phaseEF";
import type { ReelSpec } from "./types";

/** All Reels in posting order. */
export const REELS: ReelSpec[] = [...PHASE_A, ...PHASE_B, ...PHASE_C, ...PHASE_D, ...PHASE_E, ...PHASE_F];

export const reelSlug = (r: ReelSpec) =>
  `${r.id}-${r.concept.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
