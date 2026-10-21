import "./engine/fonts";
import React from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { SongClock } from "./engine/clock";
import { FPS, section } from "./engine/song";
import { SHOTS } from "./library/shots";
import { REELS, reelSlug } from "./reels";
import { Reel, reelFrames } from "./reels/ReelRenderer";
import { Camera } from "./motion/Camera";
import { GENERATORS } from "./shots/registry";
import { Grain, Vignette } from "./treatments/Finish";

/** Preview any library shot (or raw generator) at any point of the song. */
type ShotProps = { shot?: string; gen?: string; params?: Record<string, unknown>; start: number };
const ShotPreview: React.FC<ShotProps> = ({ shot, gen, params = {}, start }) => {
  const preset = shot ? SHOTS.find((s) => s.id === shot) : undefined;
  const G = GENERATORS[preset?.gen ?? gen ?? "road"];
  return (
    <SongClock audioStart={start}>
      <AbsoluteFill style={{ background: "#000" }}>
        <Camera cam={{ zoom: [1.02, 1.02], handheld: 1 }} dur={6}>
          <G p={{ ...(preset?.params ?? {}), ...params }} />
        </Camera>
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </SongClock>
  );
};

/** where to preview a shot: inside its first matching section, past the first bars */
export const previewStart = (sectionId: string) => {
  try {
    const s = section(sectionId);
    return s.start + Math.min(6, (s.end - s.start) / 3);
  } catch {
    return 70;
  }
};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Reels">
      {REELS.map((r) => (
        <Composition
          key={r.id}
          id={reelSlug(r)}
          component={Reel}
          durationInFrames={reelFrames(r)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ spec: r }}
        />
      ))}
    </Folder>
    <Folder name="Shots">
      {SHOTS.map((s) => (
        <Composition
          key={s.id}
          id={`Shot-${s.id}`}
          component={ShotPreview}
          durationInFrames={6 * FPS}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ shot: s.id, start: previewStart(s.sections[0]) } as ShotProps}
        />
      ))}
    </Folder>
    <Composition
      id="Gen"
      component={ShotPreview}
      durationInFrames={300}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{ gen: "road", params: {}, start: 55 } as ShotProps}
    />
  </>
);
