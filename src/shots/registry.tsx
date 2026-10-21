import React from "react";
import { Road } from "./Road";
import { Tunnel } from "./Tunnel";
import { TrainWindow } from "./TrainWindow";
import { Skyline } from "./Skyline";
import { MoonSky } from "./MoonSky";
import { Stars } from "./Stars";
import { Backlight } from "./Backlight";
import { BarFront, Frosted, Neon } from "./Nightlife";
import { Crosswalk, Shadows, Signal } from "./Street";
import { Clock, Dice } from "./Objects";
import { Bokeh, Facade, Puddle, Trails } from "./Light";
import { Arrangement } from "./Arrangement";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GENERATORS: Record<string, React.FC<{ p?: any }>> = {
  road: Road,
  tunnel: Tunnel,
  train: TrainWindow,
  skyline: Skyline,
  moon: MoonSky,
  stars: Stars,
  backlight: Backlight,
  bar: BarFront,
  frosted: Frosted,
  neon: Neon,
  shadows: Shadows,
  crosswalk: Crosswalk,
  signal: Signal,
  dice: Dice,
  clock: Clock,
  bokeh: Bokeh,
  trails: Trails,
  facade: Facade,
  puddle: Puddle,
  arrangement: Arrangement,
};
