/** Deterministic randomness: every frame must render identically on every worker. */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const hash = (n: number, seed = 0) => {
  let x = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

/** smooth 1D value noise in 0..1 */
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u;
};

/** signed handheld-style drift, roughly -1..1 */
export const drift = (t: number, seed = 0, speed = 0.35) =>
  (noise1(t * speed, seed) - 0.5) * 1.4 + (noise1(t * speed * 2.7, seed + 9) - 0.5) * 0.6;
