/**
 * THE SHOT LIBRARY - 112 procedural shots, the visual source library for every Reel.
 * Nothing here is stock footage: each entry is a generator + parameters, rendered by Remotion.
 * visual-board/clips.json is generated from this file (npm run board), so edit here.
 *
 * Music-reactive shots read song time, so the same shot placed at a different point in the song
 * behaves differently (lamps pass on the kick in the drops, slowly in the verses, etc.).
 */
import { C } from "../engine/palette";

export type Category =
  | "MOVEMENT"
  | "CITY_MOTION"
  | "NIGHTLIFE"
  | "FRIENDS"
  | "DANCING"
  | "TRANSIT"
  | "ROOFTOPS"
  | "WINDOWS_REFLECTIONS"
  | "SUN_BACKLIGHT"
  | "MOONLIGHT_SKY"
  | "RISK_CHOICE"
  | "YOUTH_FREEDOM"
  | "URBAN_DETAILS"
  | "RHYTHMIC"
  | "AFTER_NIGHT";

export type Energy = "low" | "mid" | "high";

export type ShotPreset = {
  id: string;
  title: string;
  gen: string;
  params: Record<string, unknown>;
  category: Category;
  description: string;
  emotion: string;
  lyric: string;
  sections: string[];
  energy: Energy;
  mood: string;
  reels: string[];
  reacts: string;
};

const s = (
  id: string,
  title: string,
  gen: string,
  params: Record<string, unknown>,
  category: Category,
  description: string,
  emotion: string,
  lyric: string,
  sections: string[],
  energy: Energy,
  mood: string,
  reels: string[],
  reacts: string,
): ShotPreset => ({ id, title, gen, params, category, description, emotion, lyric, sections, energy, mood, reels, reacts });

const LAMPS = "lamps pass at the track's travel rate: 1 per bar in the intro, 1 per beat (on the kick) in verses/drops, 8ths/16ths in the build rolls";

export const SHOTS: ShotPreset[] = [
  // ROAD ------------------------------------------------------------------
  s("S001", "The drive, moon on the left", "road", { lamps: "right" }, "MOVEMENT", "POV down an empty two-lane road at night. Sodium lamps on the right, a fixed moon top-left, a town glowing on the horizon.", "moving without a destination", "Moving my feet to the beat of a drum", ["verse1b", "drop1", "drop2"], "mid", "sodium orange / ink navy", ["story", "drop", "loop"], LAMPS),
  s("S002", "Rain on the road", "road", { lamps: "both", rain: 0.8, wet: 1, moon: false, fog: 0.8, stars: 0 }, "CITY_MOTION", "Same POV in heavy rain, lamps both sides, rain streaks lit only when a lamp is close.", "pushing through, not stopping", "Take a chance, rolling it twice", ["build1", "build2", "drop2"], "high", "wet amber / black", ["drop", "build"], LAMPS + "; rain brightens on each pass"),
  s("S003", "OUT / OF / SIGHT painted", "road", { words: ["OUT", "OF", "SIGHT"], wordGap: 2 }, "RISK_CHOICE", "Words painted on the asphalt approach and pass under the car, one every two lamps.", "the message is on the road ahead", "Out of sight, out of mind", ["build1", "build2"], "mid", "paint white / sodium", ["lyric", "tease"], LAMPS),
  s("S004", "TAKE / A / CHANCE painted", "road", { words: ["TAKE", "A", "CHANCE"], wordGap: 2, lamps: "left" }, "RISK_CHOICE", "Road markings spell the risk line, lamps on the left.", "commitment you drive over", "Take a chance, rolling it twice", ["build1", "build2"], "mid", "paint white / sodium", ["lyric", "build"], LAMPS),
  s("S005", "Following their taillights", "road", { tail: true, lamps: "right" }, "FRIENDS", "A car ahead, two red taillights drifting in the lane: friends in the other car.", "following someone into the night", "It's not where you been, it's about where you're goin", ["verse1a", "verse1b", "verse2"], "mid", "red tail / sodium", ["story"], LAMPS),
  s("S006", "Long left curve", "road", { curve: 0.7, lamps: "left", moonX: 0.75 }, "MOVEMENT", "The road bends away to the left so the lamp line sweeps across frame.", "not knowing what's round the bend", "It's not where you been...", ["verse1b", "verse2"], "mid", "sodium / navy", ["story", "build"], LAMPS),
  s("S007", "Open road, no lamps", "road", { lamps: "none", stars: 1, moonR: 60, fog: 0.2 }, "YOUTH_FREEDOM", "Unlit road under a full star field and a big moon. Only lane dashes give speed.", "nothing between you and the sky", "Shoot for the stars", ["breakdown", "verse2", "intro"], "low", "moon blue / black", ["lyric", "loop"], "dashes move with travel()"),
  s("S008", "Lamps switch off at dawn", "road", { sky: "dawn", lampsOffAt: 214, moon: false, stars: 0 }, "AFTER_NIGHT", "Blue-hour drive; the streetlamps go out one by one as the sky lightens.", "the night ending behind you", "Grooving till the bar kicks us out", ["outro"], "low", "dawn cyan / peach", ["endcard", "story"], "lamps off on staggered beats from lampsOffAt"),
  s("S009", "Cold LED road", "road", { lampColor: "#cfe0ff", sky: "night", moonX: 0.3 }, "MOVEMENT", "Same drive under white LED lamps: colder, more honest light.", "telling the truth", "I'm taking my time, telling the truth", ["verse1b", "verse2"], "mid", "cold white / navy", ["lyric"], LAMPS),
  s("S010", "Fog drive", "road", { fog: 1.6, moon: false, stars: 0, tail: true }, "MOVEMENT", "Thick fog: lamps appear late and bloom, taillights barely visible.", "not knowing where it ends", "Out of sight, out of mind", ["intro", "build1"], "low", "smoky amber", ["tease", "build"], LAMPS),
  s("S011", "MOVING / TO THE / MUSIC painted", "road", { words: ["MOVING", "TO THE", "MUSIC"], wordGap: 1, lamps: "both" }, "RHYTHMIC", "Lyric painted on the road, one phrase per lamp, both sides lit.", "the road is the song", "Moving to the music", ["build1", "build2"], "high", "sodium / paint", ["lyric", "drop"], LAMPS),
  s("S012", "Big moon over the road", "road", { horizon: 0.58, moonR: 74, moonX: 0.28, moonY: 0.2, lamps: "right" }, "MOONLIGHT_SKY", "Lower horizon, more sky, oversized moon that never moves while the lamps rush past.", "the one thing that stays", "I promise to say it in the moonlight", ["verse1b", "verse2"], "mid", "moon blue / sodium", ["loop", "lyric"], LAMPS + "; moon fixed"),
  // TUNNEL ----------------------------------------------------------------
  s("S013", "Tunnel, exit on the drop", "tunnel", { exitAt: 60 }, "MOVEMENT", "Inside a tunnel, ceiling fixtures streak past; an opening grows and the camera bursts out at exitAt.", "the build as a tunnel, the drop as the sky", "grooving till the bar kicks us out", ["build1", "build2"], "high", "sodium streaks / white burst", ["drop", "build"], "fixtures at 16ths of travel; exit flash at exitAt"),
  s("S014", "Cold tunnel", "tunnel", { color: "#d6e4ff", tint: 0.1 }, "TRANSIT", "LED-lit tunnel, cooler and harder.", "pressure before release", "Take a chance", ["build1", "build2"], "high", "cold white / black", ["build"], "fixtures at 16ths of travel"),
  s("S015", "Tunnel words", "tunnel", { words: ["TAKE A CHANCE", "ROLLING IT TWICE"] }, "RISK_CHOICE", "Wall panels carry the lyric as the tunnel streaks by.", "the dare written on the wall", "Take a chance, rolling it twice", ["build1", "build2"], "high", "sodium / paint", ["lyric", "build"], "panels every 4 travel units"),
  s("S016", "Endless tunnel", "tunnel", {}, "TRANSIT", "No exit, just the rhythm of lamps.", "momentum", "Moving to the music", ["drop1", "drop2"], "high", "sodium", ["drop", "loop"], "fixtures at 16ths of travel"),
  s("S017", "Tunnel into morning", "tunnel", { exitColor: C.dawnPeach, exitAt: 210 }, "AFTER_NIGHT", "Tunnel exit opens on a peach dawn instead of night.", "coming out the other side", "We rise and we fall", ["drop2", "outro"], "mid", "sodium / peach", ["endcard"], "exit at exitAt"),
  // TRAIN ------------------------------------------------------------------
  s("S018", "Train window, city and moon", "train", {}, "TRANSIT", "Tall carriage window; skyline, lit windows and streaked street lights slide past, masts cut through on each travel unit.", "going somewhere, together", "It's not where you been, it's about where you're goin", ["verse1a", "verse1b", "verse2"], "mid", "sodium / navy / glass", ["story", "lyric"], "masts pass once per travel unit (kick in drops)"),
  s("S019", "Rain on the train glass", "train", { rain: 0.9 }, "WINDOWS_REFLECTIONS", "Droplets and diagonal streaks on the glass over the moving city.", "looking back at the night", "If I took it alive...", ["verse1a", "breakdown"], "low", "wet amber / blue", ["lyric", "texture"], "masts on travel"),
  s("S020", "Wide window strip", "train", { frame: "wide" }, "TRANSIT", "Letterbox-like wide window band with dark carriage above and below: negative space for type.", "in transit, unsure", "Out of sight, out of mind", ["build1", "verse2"], "mid", "dark frame / city", ["lyric"], "masts on travel"),
  s("S021", "First train home", "train", { sky: "dawn", moon: false, windowColor: C.warmWhite }, "AFTER_NIGHT", "The same ride at blue hour, a few windows still on.", "the ride home", "Grooving till the bar kicks us out", ["outro", "breakdown"], "low", "dawn / pale", ["endcard", "story"], "masts on travel"),
  s("S022", "Tunnel blinks", "train", { blinks: [] }, "RHYTHMIC", "City through the window, blacked out for a beat whenever the train ducks under a bridge (set blinks to song times).", "the night flickering", "Moving to the music", ["drop1", "drop2"], "high", "black / sodium", ["drop"], "blackouts on chosen beats"),
  s("S023", "City stream, no frame", "train", { frame: "none", dir: -1 }, "CITY_MOTION", "Just the layered city streaming right-to-left, no carriage.", "the city as a blur of other people's nights", "Moving my feet...", ["drop1", "verse1b"], "mid", "sodium / ink", ["drop", "texture"], "layers scroll with travel"),
  // SKYLINE ----------------------------------------------------------------
  s("S024", "Rooftop, three of us", "skyline", { figures: 3 }, "ROOFTOPS", "City from a rooftop; three tiny silhouettes on the ledge against the glow.", "we were up there", "We rise and we fall, living forever young", ["verse2", "breakdown"], "low", "sodium haze / navy", ["lyric", "story"], "beacons blink on the kick"),
  s("S025", "City closing", "skyline", { mode: "closing", modeAt: 105 }, "AFTER_NIGHT", "From modeAt, a slice of windows goes dark on every beat.", "the night shutting down around you", "grooving till the bar kicks us out", ["breakdown", "outro"], "low", "fading amber", ["story"], "windows off per beat after modeAt"),
  s("S026", "City waking", "skyline", { mode: "waking", modeAt: 120 }, "ROOFTOPS", "Windows switch on across the city beat by beat.", "the night isn't over", "Shoot for the stars", ["verse2"], "mid", "amber rising", ["build"], "windows on per beat after modeAt"),
  s("S027", "City breathing with the bass", "skyline", { mode: "pulse" }, "RHYTHMIC", "A few windows swell with the bass envelope; beacons on the kick.", "the city hears it too", "Moving to the music", ["drop1", "drop2"], "mid", "amber / red beacons", ["drop", "loop"], "bass envelope + kick"),
  s("S028", "Train on the bridge", "skyline", { trainBridge: true, figures: 0 }, "TRANSIT", "A lit train slides across a bridge in front of the skyline.", "someone else's ride home", "It's out of sight, out of mind", ["verse1b", "breakdown"], "low", "warm windows / navy", ["texture", "story"], "beacons on kick"),
  s("S029", "Skyline at first light", "skyline", { sky: "dawn", moon: false, stars: 0, mode: "closing", modeAt: 0 }, "AFTER_NIGHT", "Pale sky, windows mostly dark.", "afterglow", "Grooving till the bar kicks us out", ["outro"], "low", "dawn peach / slate", ["endcard"], "remaining windows switch off per beat"),
  s("S030", "Skyline under a big moon", "skyline", { moonR: 90, moonY: 0.24, moonX: 0.3 }, "MOONLIGHT_SKY", "Oversized moon over the skyline, lots of sky for type.", "a promise over the city", "I promise to say it in the moonlight", ["verse1b", "verse2"], "low", "moon blue / amber", ["lyric", "loop"], "beacons on kick"),
  s("S031", "Windows up close", "skyline", { zoom: 1.7, parapet: false, moon: false }, "WINDOWS_REFLECTIONS", "Pushed into the towers: rows of lit and dark windows.", "every window is someone's night", "Out of sight, out of mind", ["build1", "verse2"], "mid", "amber grid", ["texture"], "beacons on kick"),
  // MOON ---------------------------------------------------------------------
  s("S032", "The moon, clouds crossing", "moon", {}, "MOONLIGHT_SKY", "Big centred moon, soft halo, thin clouds drifting across.", "truth, said quietly", "I promise to say it in the moonlight", ["verse1b", "breakdown", "verse2"], "low", "moon white / navy", ["lyric", "loop"], "halo breathes on the kick in drops"),
  s("S033", "Small high moon", "moon", { r: 54, y: 0.18, cloudAlpha: 0.25 }, "MOONLIGHT_SKY", "A small moon high in frame, the rest is empty night: negative space.", "alone with a thought", "If I took it alive", ["intro", "verse1b"], "low", "navy / white", ["lyric", "tease"], "halo on kick"),
  s("S034", "The moon follows (wires)", "moon", { variant: "follow", foreground: "wires", r: 70, y: 0.3 }, "MOONLIGHT_SKY", "Telegraph poles and wires race past, one per travel unit; the moon stays fixed.", "everything passes except this", "I promise to say it in the moonlight", ["verse1b", "verse2", "drop1"], "mid", "black wires / moon", ["loop", "story"], "poles pass on travel()"),
  s("S035", "The moon follows (trees)", "moon", { variant: "follow", foreground: "branches", r: 80, y: 0.32 }, "MOONLIGHT_SKY", "Out-of-focus branches whip past in front of a steady moon.", "leaving town", "It's not where you been...", ["verse1a", "verse2"], "mid", "soft black / moon", ["story"], "branches on travel()"),
  s("S036", "The moon follows (rooftops)", "moon", { variant: "follow", foreground: "roofs", r: 64, y: 0.24 }, "CITY_MOTION", "Rooftops stream along the bottom edge under a fixed moon.", "the city moving under you", "Moving to the music", ["drop1", "drop2"], "mid", "black / moon", ["drop"], "roofs on travel()"),
  s("S037", "Moon on black water", "moon", { variant: "water", y: 0.3, r: 92 }, "MOONLIGHT_SKY", "Moon over still water; the glitter path shivers with the hats.", "honest and calm", "I'm taking my time, telling the truth", ["verse1b", "breakdown", "verse2"], "low", "silver / black", ["lyric", "loop"], "glitter follows the hat envelope"),
  s("S038", "Moonrise", "moon", { rise: 1, r: 120, y: 0.45, warm: 1 }, "MOONLIGHT_SKY", "A warm low moon rising during the first seconds of the shot.", "the night beginning", "If I took it alive", ["intro"], "low", "warm moon / dusk", ["tease"], "halo on kick"),
  s("S039", "Moon, heavy cloud", "moon", { cloudAlpha: 0.75, cloudSpeed: 30, r: 130 }, "MOONLIGHT_SKY", "Faster, thicker clouds keep hiding and revealing the moon.", "what you almost said", "Out of sight, out of mind", ["build1", "build2"], "mid", "grey / white", ["build", "tease"], "cloud speed constant"),
  // STARS -----------------------------------------------------------------
  s("S040", "Star field", "stars", {}, "MOONLIGHT_SKY", "Dense, varied star field rotating slowly over dark hills and a far town.", "ambition, quiet", "Shoot for the stars", ["verse2", "breakdown"], "low", "white / navy", ["lyric", "loop"], "slow rotation"),
  s("S041", "Star trails", "stars", { variant: "trails" }, "YOUTH_FREEDOM", "Long-exposure circles; the arcs grow longer through the shot.", "the whole night in one frame", "living forever young", ["verse2", "outro"], "low", "silver arcs", ["lyric", "endcard"], "arc length grows with local time"),
  s("S042", "Stars arrive on the beat", "stars", { variant: "fill" }, "RHYTHMIC", "Sky starts empty and fills a notch on every beat from fillFrom.", "counting up to something", "Shoot for the stars", ["verse2", "drop2"], "mid", "white / navy", ["build"], "reveal per beat"),
  s("S043", "Shooting star", "stars", { shootAt: 126.5 }, "RISK_CHOICE", "A single shooting star crosses at shootAt (default: the silence after 'backs to the sun').", "the shot you take", "Shoot for the stars with our backs to the sun", ["verse2"], "low", "white streak", ["lyric", "reveal"], "streak at shootAt"),
  s("S044", "Stars at blue hour", "stars", { sky: "blue", hillLights: false }, "AFTER_NIGHT", "Fading stars in a lifting blue sky.", "it's getting light", "We rise and we fall", ["outro"], "low", "blue", ["endcard"], "slow rotation"),
  s("S045", "Stars, nobody around", "stars", { hillLights: false, rotate: 0.02 }, "MOONLIGHT_SKY", "Stars and black hills only.", "smallness, in a good way", "living forever young", ["breakdown"], "low", "black / white", ["texture"], "slow rotation"),
  // BACKLIGHT -------------------------------------------------------------
  s("S046", "Backs to the sun (three)", "backlight", { people: 3 }, "SUN_BACKLIGHT", "Low sun behind us; three long walking shadows run ahead down a warm road.", "together, facing forward", "Shoot for the stars with our backs to the sun", ["verse2"], "mid", "warm amber / dusk", ["lyric", "story"], "dust shimmer on kick"),
  s("S047", "Backs to the sun (two)", "backlight", { people: 2 }, "SUN_BACKLIGHT", "Two shadows side by side.", "the one who stayed", "We rise and we fall", ["verse2"], "low", "warm", ["lyric"], "dust on kick"),
  s("S048", "Backs to the sun (alone)", "backlight", { people: 1, warmth: 0.8 }, "SUN_BACKLIGHT", "One shadow on the road.", "going anyway", "It's about where you're goin", ["verse1a"], "low", "muted warm", ["lyric", "tease"], "dust on kick"),
  s("S049", "Sunrise behind the city", "backlight", { variant: "rise" }, "AFTER_NIGHT", "The sun coming up behind the skyline at the end of the night.", "afterglow", "We rise and we fall", ["outro"], "low", "peach / slate", ["endcard"], "slow sun lift"),
  s("S050", "Running into it", "backlight", { people: 4, walk: 2 }, "YOUTH_FREEDOM", "Four shadows, faster stride, the road rushing on.", "chasing something", "living forever young", ["drop2"], "high", "hot amber", ["drop"], "dust on kick"),
  // NIGHTLIFE -------------------------------------------------------------
  s("S051", "Bar, open late", "bar", {}, "NIGHTLIFE", "Brick front, rose neon OPEN LATE, steamed window with shapes dancing, open door spilling light on wet pavement.", "the place you don't want to leave", "Moving to the music", ["drop1", "drop2"], "high", "rose neon / amber", ["story"], "dancers move with kick + bass"),
  s("S052", "Bar, last call", "bar", { sign: "LAST CALL", closeAt: 105 }, "NIGHTLIFE", "At closeAt the neon dies and the inside lights drop beat by beat; the door goes dark.", "the bar kicks us out", "grooving till the bar kicks us out", ["drop1", "breakdown"], "mid", "rose -> black", ["story", "reveal"], "neon off + lights off per beat at closeAt"),
  s("S053", "Bar in the rain", "bar", { rain: 0.8, sign: "OPEN", signColor: C.sodium }, "NIGHTLIFE", "Same front in rain, amber sign.", "warmth from the outside", "Moving my feet...", ["verse1b"], "mid", "amber / wet black", ["story", "texture"], "dancers on kick"),
  s("S054", "Bar, serif sign", "bar", { sign: "moonlight", signFont: "serif", signColor: C.moon }, "NIGHTLIFE", "The bar is called moonlight; cold serif neon.", "the place the song is named after", "say it in the moonlight", ["verse2", "drop2"], "mid", "cold neon / amber", ["reveal", "endcard"], "dancers on kick"),
  s("S055", "Bar, nearly empty", "bar", { crowd: 2, door: 0, sign: "OPEN LATE" }, "AFTER_NIGHT", "Two shapes left inside, door shut.", "the last ones", "Oh, oh", ["breakdown"], "low", "dim rose", ["story"], "slow sway"),
  s("S056", "Bar, sign flickers on", "bar", { onAt: 120 }, "NIGHTLIFE", "Neon stutters on at onAt.", "here we go again", "Shoot for the stars", ["verse2"], "mid", "rose", ["reveal"], "neon on at onAt"),
  s("S057", "Frosted glass, warm", "frosted", {}, "DANCING", "Close on steamed glass: blurred bodies dancing behind it, arms up on the heavy bass bars.", "inside the moment", "Moving to the music, grooving", ["drop1", "drop2"], "high", "amber / rose", ["drop", "loop"], "bounce on kick, sway on beat, arms on bass bar"),
  s("S058", "Frosted glass, rose", "frosted", { hue: C.neonRose, hue2: "#7a5aff" }, "DANCING", "Same, cooler rose/violet light swapping every bar.", "late, louder", "grooving till the bar kicks us out", ["drop2"], "high", "rose / violet", ["drop"], "light swaps per bar"),
  s("S059", "Frosted crowd", "frosted", { count: 15, blur: 12 }, "DANCING", "Packed: fifteen shapes, heavier blur.", "everyone", "Moving to the music", ["drop1", "drop2"], "high", "amber", ["drop"], "kick + bass"),
  s("S060", "Frosted, lights out", "frosted", { closeAt: 105 }, "NIGHTLIFE", "Dancers behind glass until closeAt, then dark.", "kicked out", "grooving till the bar kicks us out", ["drop1", "breakdown"], "mid", "amber -> black", ["story"], "off at closeAt"),
  s("S061", "Neon: LAST CALL", "neon", { lines: ["LAST", "CALL"] }, "NIGHTLIFE", "Rose neon on brick, reflected in wet ground.", "the clock running out", "grooving till the bar kicks us out", ["drop1", "build1"], "mid", "rose", ["story", "tease"], "tube buzz"),
  s("S062", "Neon: OPEN -> CLOSED", "neon", { lines: ["OPEN"], swapTo: ["CLOSED"], swapAt: 60 }, "NIGHTLIFE", "The sign switches from OPEN to CLOSED at swapAt (default: the drop).", "the bar kicks us out", "grooving till the bar kicks us OUT", ["build1", "drop1"], "high", "rose", ["reveal", "drop"], "swap + stutter at swapAt"),
  s("S063", "Neon: OUT OF SIGHT", "neon", { lines: ["OUT OF SIGHT", "OUT OF MIND"], size: 104, color: C.moon }, "RISK_CHOICE", "The hook as a cold blue sign.", "forget it, keep moving", "Out of sight, out of mind", ["build1", "build2"], "mid", "ice blue", ["lyric"], "tube buzz"),
  s("S064", "Neon: moonlight", "neon", { lines: ["moonlight"], font: "serif", size: 210, color: C.moon, wall: "dark" }, "MOONLIGHT_SKY", "Song title in serif neon on a dark wall.", "identity", "say it in the moonlight", ["verse1b", "verse2", "drop2"], "mid", "moon blue", ["endcard", "reveal"], "tube buzz"),
  s("S065", "Neon: TRUTH", "neon", { lines: ["TRUTH"], size: 220, color: C.warmWhite, buzz: 0.6 }, "URBAN_DETAILS", "One word, buzzing like it might go out.", "honesty at 3am", "I'm taking my time, telling the truth", ["verse1b", "verse2"], "low", "warm white", ["lyric"], "heavy buzz"),
  s("S066", "Neon: forever young", "neon", { lines: ["forever", "young"], font: "serif", size: 170, color: C.neonRose }, "YOUTH_FREEDOM", "Serif rose neon.", "this age, once", "living forever young", ["verse2"], "mid", "rose", ["lyric"], "tube buzz"),
  s("S067", "Neon: AMISHAR", "neon", { lines: ["AMISHAR"], size: 150, color: C.sodium, wall: "dark" }, "URBAN_DETAILS", "Artist name as an amber sign.", "signature", "-", ["drop2", "outro"], "mid", "amber", ["endcard"], "tube buzz"),
  s("S068", "Neon: TAKE A CHANCE", "neon", { lines: ["TAKE A", "CHANCE"], color: C.green, size: 140 }, "RISK_CHOICE", "Green neon dare.", "go", "Take a chance", ["build1", "build2"], "mid", "green", ["lyric"], "tube buzz"),
  // STREET ------------------------------------------------------------------
  s("S069", "Three shadows walking", "shadows", {}, "FRIENDS", "Looking down at the pavement: three friends' shadows swing round and stretch as each lamp passes.", "the walk out", "Moving my feet to the beat of a drum", ["verse1a", "verse1b", "breakdown"], "mid", "sodium pools / concrete", ["story", "loop"], "lamps pass on travel()"),
  s("S070", "Shadows running", "shadows", { run: 1, people: 4 }, "YOUTH_FREEDOM", "Four shadows at a run, lamps faster.", "late for nothing", "living forever young", ["drop1", "drop2"], "high", "sodium", ["drop"], "lamps on travel()"),
  s("S071", "One shadow", "shadows", { people: 1 }, "MOVEMENT", "A single shadow under the lamps.", "on your own, still going", "I'm taking my time", ["verse1b", "breakdown"], "low", "sodium", ["lyric"], "lamps on travel()"),
  s("S072", "A crowd of shadows", "shadows", { people: 6, spacing: 0.8 }, "FRIENDS", "Six overlapping shadows, closer lamps.", "everyone spilling out", "grooving till the bar kicks us out", ["breakdown", "drop2"], "mid", "sodium", ["story"], "lamps on travel()"),
  s("S073", "Shadows under LED", "shadows", { lampColor: "#d6e4ff", tone: "#2a2c30" }, "MOVEMENT", "Cooler white light, harder shadows.", "sober moment", "telling the truth", ["verse2"], "low", "cold white", ["lyric"], "lamps on travel()"),
  s("S074", "Crosswalk in rain", "crosswalk", {}, "URBAN_DETAILS", "Top-down zebra crossing, wet, red signal glow, figures crossing as shadows; rain rings.", "crossing over", "Take a chance", ["build1", "verse1b"], "mid", "red / wet grey", ["story"], "rain rings constant"),
  s("S075", "Crosswalk, dry", "crosswalk", { rain: 0, signalColor: C.green }, "URBAN_DETAILS", "Dry crossing under green.", "go", "It's about where you're goin", ["verse1a"], "low", "green / grey", ["story"], "-"),
  s("S076", "Crosswalk crowd", "crosswalk", { people: 7 }, "FRIENDS", "Seven people crossing at once.", "a group with no plan", "Moving my feet", ["verse1a", "drop1"], "mid", "red / grey", ["story"], "-"),
  s("S077", "Walk signal countdown", "signal", { kind: "walk", goAt: 60, countFrom: 8 }, "RISK_CHOICE", "Rain-blurred pedestrian signal; the amber digits count down one per beat and it goes green on goAt.", "waiting to go", "grooving till the bar kicks us out", ["build1", "build2"], "high", "red -> green", ["build", "drop"], "count per beat to goAt"),
  s("S078", "Traffic light on the drop", "signal", { kind: "traffic", goAt: 60 }, "RISK_CHOICE", "Red holds through the build, green on goAt.", "permission", "Take a chance", ["build1", "build2"], "high", "red -> green", ["drop"], "switch at goAt"),
  s("S079", "Amber flashing at 4am", "signal", { kind: "traffic", flashAmber: true, rain: 0.3 }, "AFTER_NIGHT", "After-hours amber flashing on the beat.", "nobody's driving now", "Oh, oh", ["breakdown", "outro"], "low", "amber", ["texture", "loop"], "flash on every beat"),
  s("S080", "Walk, green", "signal", { kind: "walk", goAt: 0, rain: 0.2 }, "MOVEMENT", "The walk light is already green; it pulses on the kick.", "go now", "Moving my feet", ["verse1b", "drop1"], "mid", "green", ["texture"], "green glow on kick"),
  s("S081", "Red, dry night", "signal", { kind: "traffic", goAt: 9999, rain: 0 }, "RISK_CHOICE", "A red light that doesn't change.", "the choice to wait or not", "Take a chance", ["build1"], "mid", "red", ["tease"], "-"),
  // OBJECTS -----------------------------------------------------------------
  s("S082", "Dice, rolled twice", "dice", { throws: [48.75, 50.625], results: [[3, 5], [1, 1]] }, "RISK_CHOICE", "Two dice thrown on a bar counter on 'take a chance', thrown again on 'rolling it twice'.", "the chance itself", "Take a chance, rolling it twice", ["build1", "build2"], "mid", "warm wood / ivory", ["lyric", "tease"], "throws at song times"),
  s("S083", "Dice, one throw", "dice", { throws: [60], results: [[6, 6]] }, "RISK_CHOICE", "Single throw landing on the drop.", "all in", "Take a chance", ["drop1", "drop2"], "high", "warm", ["drop"], "throw at time"),
  s("S084", "Snake eyes", "dice", { throws: [153.75, 155.625], results: [[2, 4], [1, 1]] }, "RISK_CHOICE", "Second build's throws, snake eyes.", "lost, laughing", "rolling it twice", ["build2"], "mid", "warm", ["lyric"], "throws at times"),
  s("S085", "Dice in cold light", "dice", { tableLight: C.moon }, "RISK_CHOICE", "Same counter under a cold light.", "sober risk", "Take a chance", ["verse2"], "low", "cold", ["texture"], "throws at times"),
  s("S086", "Clock: 02:00 on the drop", "clock", { at: "02:00", songAt: 60, label: "" }, "URBAN_DETAILS", "LED clock; 01:59 becomes 02:00 exactly on the drop.", "closing time", "grooving till the bar kicks us out", ["build1", "drop1"], "mid", "ember", ["reveal", "drop"], "minute flips at songAt"),
  s("S087", "Clock: 04:44", "clock", { at: "04:44", songAt: 210, color: C.dawnCyan }, "AFTER_NIGHT", "Cold-blue clock at the end of the night.", "where did the night go", "-", ["outro"], "low", "cyan", ["endcard"], "colon on the beat"),
  s("S088", "Clock: 23:59", "clock", { at: "00:00", songAt: 15, color: C.warmWhite }, "URBAN_DETAILS", "Midnight arrives on the first vocal.", "the start", "Moving my feet to the beat of a drum", ["intro", "verse1a"], "low", "warm white", ["tease"], "flip at songAt"),
  s("S089", "Clock: LAST CALL", "clock", { at: "01:58", songAt: 52.5, label: "LAST CALL" }, "NIGHTLIFE", "Clock with a LAST CALL caption.", "running out", "Out of sight, out of mind", ["build1"], "mid", "ember", ["build"], "colon on the beat"),
  // LIGHT ---------------------------------------------------------------------
  s("S090", "Bokeh, sodium", "bokeh", { palette: "sodium" }, "WINDOWS_REFLECTIONS", "Defocused amber city lights drifting.", "memory", "If I took it alive", ["intro", "breakdown"], "low", "amber", ["texture", "lyric"], "discs brighten on kick"),
  s("S091", "Bokeh, mixed", "bokeh", {}, "CITY_MOTION", "Red, amber, white and blue discs.", "a busy night, out of focus", "Moving to the music", ["drop1", "verse1b"], "mid", "mixed", ["texture"], "kick"),
  s("S092", "Rack focus to sharp", "bokeh", { rackTo: 1, rackAt: 60 }, "CITY_MOTION", "Soft discs snap into sharp points at rackAt.", "clarity", "telling the truth", ["build1", "drop1"], "mid", "mixed", ["reveal"], "rack at rackAt"),
  s("S093", "Bokeh, cold", "bokeh", { palette: "cool" }, "MOONLIGHT_SKY", "Moon-blue discs.", "distance", "Out of sight, out of mind", ["verse2"], "low", "blue", ["texture"], "kick"),
  s("S094", "Bokeh, dawn", "bokeh", { palette: "dawn" }, "AFTER_NIGHT", "Peach and cyan discs on slate.", "afterglow", "-", ["outro"], "low", "peach / cyan", ["endcard"], "-"),
  s("S095", "Light trails, curve", "trails", {}, "CITY_MOTION", "Long-exposure lanes curving below an overpass; a pulse rides down the lanes on each kick.", "the city flowing", "Moving to the music", ["drop1", "drop2"], "high", "red / white", ["drop", "loop"], "lane pulse per kick"),
  s("S096", "Light trails, straight", "trails", { curve: 0 }, "CITY_MOTION", "Straight lanes, symmetrical.", "direction", "where you're goin", ["verse2"], "mid", "red / white", ["texture"], "kick"),
  s("S097", "Leaving (all red)", "trails", { red: 1 }, "MOVEMENT", "Only taillights: everyone leaving.", "out of sight", "Out of sight, out of mind", ["build2"], "mid", "red", ["lyric"], "kick"),
  s("S098", "Arriving (all white)", "trails", { red: 0 }, "CITY_MOTION", "Only headlights: everyone coming in.", "the night arriving", "Moving my feet", ["verse1b"], "mid", "white", ["texture"], "kick"),
  s("S099", "Facade, quiet", "facade", {}, "WINDOWS_REFLECTIONS", "Apartment block face-on, a few windows lit.", "other people's nights", "Out of sight, out of mind", ["intro", "verse1a"], "low", "amber / concrete", ["texture"], "-"),
  s("S100", "Facade, one window", "facade", { mode: "one", oneAt: 7.5 }, "WINDOWS_REFLECTIONS", "Dark block; one window switches on at oneAt: someone getting ready to go out.", "the start of a night", "Moving my feet...", ["intro"], "low", "dark / one amber", ["tease", "story"], "on at oneAt"),
  s("S101", "Facade as a sequencer", "facade", { mode: "sequencer" }, "RHYTHMIC", "Windows play the drop's real drum pattern: kick rows, clap rows, offbeat-hat rows.", "the city is the track", "Moving to the music", ["drop1", "drop2"], "high", "amber / white / blue", ["drop", "micro"], "16-step pattern, active only in drops"),
  s("S102", "Facade, one flat partying", "facade", { mode: "party" }, "DANCING", "A whole dark block and one window full of moving people.", "the party you can see from the street", "grooving", ["drop1", "drop2"], "mid", "rose window", ["story"], "silhouettes bounce on kick"),
  s("S103", "Facade, cold", "facade", { tone: "#121722" }, "AFTER_NIGHT", "Bluer concrete, fewer lights.", "late", "-", ["outro"], "low", "blue", ["texture"], "-"),
  s("S104", "Moon in a puddle", "puddle", {}, "WINDOWS_REFLECTIONS", "Looking down into a puddle holding the moon; rings on every kick.", "the sky at your feet", "say it in the moonlight", ["verse1b", "drop1"], "mid", "moon / asphalt", ["lyric", "loop"], "rings on kicks"),
  s("S105", "Neon in a puddle", "puddle", { holds: "neon", rings: "hat" }, "NIGHTLIFE", "A rose sign reflected and shivering on the offbeats.", "the bar from the street", "Moving to the music", ["drop1", "drop2"], "mid", "rose / black", ["texture"], "rings on offbeats"),
  s("S106", "Lamp in a puddle", "puddle", { holds: "lamp", rings: "beat" }, "URBAN_DETAILS", "Sodium lamp reflection, a ring on every beat.", "time passing", "Moving my feet to the beat", ["verse1a"], "low", "amber", ["texture"], "rings on beats"),
  s("S107", "Footstep in the puddle", "puddle", { step: 60, rings: "none" }, "MOVEMENT", "A foot lands in the moon at `step` (default: the drop) and the reflection shatters.", "the moment you go", "kicks us OUT", ["drop1", "drop2"], "high", "black / moon", ["drop", "reveal"], "splash at step"),
  s("S108", "Still puddle", "puddle", { rings: "none" }, "WINDOWS_REFLECTIONS", "Perfectly still reflection: holding breath.", "the second before", "-", ["build1", "breakdown"], "low", "moon", ["contrast", "tease"], "none"),
  // ARRANGEMENT -------------------------------------------------------------
  s("S109", "Arrangement, following", "arrangement", {}, "RHYTHMIC", "Stylised arrangement built from the measured structure; playhead locked to the audio.", "the inside of the track", "-", ["build1", "drop1", "build2"], "mid", "dark UI / warm clips", ["micro"], "playhead = audio"),
  s("S110", "Arrangement, zoomed on the drop", "arrangement", { zoomBars: 8 }, "RHYTHMIC", "Eight bars across the screen: you see the kick lane stop and restart.", "where the space is", "-", ["build1", "build2"], "mid", "dark UI", ["micro"], "playhead"),
  s("S111", "Whole song map", "arrangement", { zoomBars: 121, follow: false, centerBar: 61 }, "RHYTHMIC", "All 121 bars on one screen, playhead travelling.", "the shape of the night", "-", ["any"], "low", "dark UI", ["micro", "endcard"], "playhead"),
  s("S112", "Drop step grid", "arrangement", { mode: "steps" }, "RHYTHMIC", "The drop's 16-step drum grid lighting up step by step.", "how it hits", "-", ["drop1", "drop2"], "high", "dark UI / amber", ["micro", "loop"], "step = audio position"),
];

export const shotById = (id: string) => {
  const sh = SHOTS.find((x) => x.id === id);
  if (!sh) throw new Error(`Unknown shot ${id}`);
  return sh;
};
