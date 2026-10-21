/**
 * MOONLIGHT palette. Warm = people and places (sodium lamps, bars, windows).
 * Cool = the moon, the truth, distance. Everything sits on ink, never pure black.
 */
export const C = {
  ink: "#05070d",
  night: "#0a1120",
  navy: "#101c33",
  dusk: "#1d2c4a",
  asphalt: "#121419",
  sodium: "#ffa04a",
  sodiumDeep: "#d8611c",
  ember: "#ff7a3a",
  warmWhite: "#ffe6c4",
  paper: "#f3ead9",
  moon: "#c9dcf2",
  moonDeep: "#7f9cc4",
  tail: "#ff3a2c",
  green: "#6bffb0",
  amber: "#ffb43a",
  dawnPeach: "#f3b58e",
  dawnRose: "#c98a8f",
  dawnCyan: "#86b7cc",
  dawnSky: "#3e5d7e",
  neonRose: "#ff5a7a",
  barGlow: "#ff8f5a",
} as const;

export type PaletteKey = keyof typeof C;
