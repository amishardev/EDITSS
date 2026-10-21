/**
 * Generates the human-readable board and Reel docs from the code (single source of truth).
 *   visual-board/clips.json, visual-board/categories/*.md, reels/reels.json, reels/CONCEPTS.md
 * usage: npx tsx scripts/export.ts
 */
import fs from "node:fs";
import path from "node:path";
import { SHOTS, type Category } from "../src/library/shots";
import { REELS, reelSlug } from "../src/reels";
import { SONG, FPS } from "../src/engine/song";

const tc = (t: number) => {
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
};
const barOf = (t: number) => {
  const b = t / SONG.bar + 1;
  const bar = Math.floor(b + 1e-6);
  const beat = Math.floor((b - bar) * 4 + 1e-6) + 1;
  return `bar ${bar}.${beat}`;
};

// ---- visual board -------------------------------------------------------
const CATS: Record<Category, string> = {
  MOVEMENT: "Movement / walking / driving",
  CITY_MOTION: "City motion",
  NIGHTLIFE: "Nightlife",
  FRIENDS: "Friends / group energy",
  DANCING: "Dancing",
  TRANSIT: "Travel / transit",
  ROOFTOPS: "Rooftops / height",
  WINDOWS_REFLECTIONS: "Night windows / reflections",
  SUN_BACKLIGHT: "Sun / backlight",
  MOONLIGHT_SKY: "Moonlight / night sky",
  RISK_CHOICE: "Risk / choice / moment",
  YOUTH_FREEDOM: "Youth / freedom",
  URBAN_DETAILS: "Urban details",
  RHYTHMIC: "Musical / rhythmic motion",
  AFTER_NIGHT: "After-night / dawn",
};

const usedIn = (id: string) => REELS.filter((r) => r.shots.some((s) => s.shot === id)).map((r) => r.id);

const clips = SHOTS.map((s) => ({
  id: s.id,
  title: s.title,
  source: "Procedural (Remotion generator, this repo)",
  generator: s.gen,
  code: `src/shots/ (generator "${s.gen}"), preset in src/library/shots.ts`,
  preview_composition: `Shot-${s.id}`,
  url: `still: visual-board/stills/${s.id}.jpg`,
  license: "Original work generated in this project. No third-party footage. Owned by AMISHAR.",
  category: s.category,
  visual_description: s.description,
  emotional_role: s.emotion,
  lyric_match: s.lyric,
  song_section_match: s.sections,
  energy: s.energy,
  color_mood: s.mood,
  useful_for_reel_types: s.reels,
  music_reactivity: s.reacts,
  params: s.params,
  used_in_reels: usedIn(s.id),
}));

fs.mkdirSync("visual-board/categories", { recursive: true });
fs.writeFileSync("visual-board/clips.json", JSON.stringify({ song: "MOONLIGHT - AMISHAR", count: clips.length, clips }, null, 2));

for (const [cat, label] of Object.entries(CATS)) {
  const list = clips.filter((c) => c.category === cat);
  const md = [
    `# ${label}`,
    "",
    `${list.length} shots. Preview any of them in Remotion Studio under **Shots / Shot-<ID>**.`,
    "",
    ...list.map((c) =>
      [
        `## ${c.id} - ${c.title}`,
        "",
        `![${c.id}](../stills/${c.id}.jpg)`,
        "",
        `- **What you see:** ${c.visual_description}`,
        `- **Emotional role:** ${c.emotional_role}`,
        `- **Lyric match:** ${c.lyric_match}`,
        `- **Sections:** ${c.song_section_match.join(", ")} · **Energy:** ${c.energy} · **Colour:** ${c.color_mood}`,
        `- **Reacts to music:** ${c.music_reactivity}`,
        `- **Good for:** ${c.useful_for_reel_types.join(", ")}${c.used_in_reels.length ? ` · **Used in:** ${c.used_in_reels.join(", ")}` : ""}`,
        `- **Generator:** \`${c.generator}\` \`${JSON.stringify(c.params)}\``,
        "",
      ].join("\n"),
    ),
  ].join("\n");
  fs.writeFileSync(path.join("visual-board/categories", `${cat.toLowerCase()}.md`), md);
}

// ---- reels ----------------------------------------------------------------
fs.mkdirSync("reels", { recursive: true });
const reels = REELS.map((r, i) => {
  const start = Math.round(r.audioStart * FPS) / FPS;
  return {
    number: i + 1,
    id: r.id,
    composition: reelSlug(r),
    phase: r.phase,
    ...r.concept,
    song_timestamp: `${tc(start)} - ${tc(r.audioEnd)} (${barOf(start)} to ${barOf(r.audioEnd)})`,
    duration_s: +(r.audioEnd - start).toFixed(2),
    clip_ids: [...new Set(r.shots.map((s) => s.shot))],
    shot_order: r.shots.map((s) => ({
      at: tc(s.from),
      reel_time: +(Math.max(0, s.from - start)).toFixed(2),
      shot: s.shot,
      title: SHOTS.find((x) => x.id === s.shot)?.title,
      len_s: +(s.to - s.from).toFixed(2),
      transition_in: s.in?.type ?? "cut",
      camera: s.cam ?? {},
      warp: s.warp ?? null,
    })),
    text: r.texts.map((t) => ({ kind: t.kind, text: t.text ?? (t.lyric ? SONG.lyrics.find((l) => l.id === t.lyric)?.text : "") , at: tc(t.from) })),
  };
});
fs.writeFileSync("reels/reels.json", JSON.stringify(reels, null, 2));

const PHASES: Record<string, string> = {
  A: "Phase A - Curiosity",
  B: "Phase B - Recognition",
  C: "Phase C - Song identity",
  D: "Phase D - Strongest musical moments",
  E: "Phase E - Release push",
  F: "Phase F - Long-tail discovery",
};

const lines: string[] = [
  "# MOONLIGHT - Reel concepts",
  "",
  "Generated from `src/reels/specs/*.ts` by `npx tsx scripts/export.ts`. Numbers are the posting order.",
  "Every Reel is rendered from the procedural shot library; every cut and reaction is placed on a measured musical event (see `analysis/SONG_ANALYSIS.md`).",
  "",
  "| # | Reel | Phase | Song time | Length | Approach |",
  "|---|---|---|---|---|---|",
  ...reels.map((r) => `| ${r.number} | **${r.name}** | ${r.phase} | ${r.song_timestamp} | ${r.duration_s}s | ${r.approach} |`),
  "",
];
let phase = "";
for (const r of reels) {
  if (r.phase !== phase) {
    phase = r.phase;
    lines.push(`---`, "", `## ${PHASES[phase]}`, "");
  }
  lines.push(
    `### ${r.number}. ${r.name}  \`${r.composition}\``,
    "",
    `![${r.id}](previews/${r.id}.jpg)`,
    "",
    `- **Core idea:** ${r.core}`,
    `- **Hook (first second):** "${r.hook}"`,
    `- **Song timestamp:** ${r.song_timestamp} · ${r.duration_s} s`,
    `- **Lyric section:** ${r.lyricSection}`,
    `- **Approach:** ${r.approach}`,
    `- **Clip IDs:** ${r.clip_ids.join(", ")}`,
    `- **Shot order:**`,
    ...r.shot_order.map((s) => `  - ${s.reel_time.toFixed(2)}s (${s.at}) **${s.shot}** ${s.title} · ${s.len_s}s · in: ${s.transition_in}${s.warp ? ` · time warp x${s.warp.speed}` : ""}`),
    `- **Editing style:** ${r.editing}`,
    `- **Text:** ${r.text.map((t) => `${t.kind} "${t.text}" @${t.at}`).join(" · ")}`,
    `- **Transitions:** ${r.transitions}`,
    `- **Payoff:** ${r.payoff}`,
    `- **Loop:** ${r.loop}`,
    `- **Caption:** ${r.caption}`,
    ...(r.captions ?? []).map((c) => `  - ${c}`),
    `- **Why it's in the campaign:** ${r.why}`,
    "",
  );
}
fs.writeFileSync("reels/CONCEPTS.md", lines.join("\n"));
console.log(`board: ${clips.length} clips, reels: ${reels.length}`);
