import {staticFile} from 'remotion';

/** Real Dietary Guide screens, rasterised from the v2 design file at 600dpi. */
export const UI = {
  welcome: 'ui/welcome.png',
  home: 'ui/home.png',
  scannerFood: 'ui/scanner-food.png',
  scannerLabel: 'ui/scanner-label.png',
  mealResult: 'ui/meal-result.png',
  labelResult: 'ui/label-result.png',
  chat: 'ui/chat.png',
  streak: 'ui/streak.png',
  goal: 'ui/goal.png',
  diet: 'ui/diet.png',
  shareSheet: 'ui/share-sheet.png',
  mealShare: 'ui/meal-share.png',
  storyMeal: 'ui/story-meal.png',
  storyGym: 'ui/story-gym.png',
  story30: 'ui/story-30.png',
  storyThali: 'ui/story-thali.png',
  ms7: 'ui/ms-7.png',
  ms30: 'ui/ms-30.png',
  ms100: 'ui/ms-100.png',
  ms365: 'ui/ms-365.png',
  storyEditor: 'ui/story-editor.png',
  age: 'ui/age.png',
  planMuscle: 'ui/plan-muscle.png',
  planMaintain: 'ui/plan-maintain.png',
  metrics: 'ui/metrics.png',
  profile: 'ui/profile.png',
  darkWelcome: 'ui/dark-welcome.png',
  darkHome: 'ui/dark-home.png',
  darkMeal: 'ui/dark-meal.png',
  darkStreak: 'ui/dark-streak.png',
} as const;

/** Source pixel heights of each phone screen (all are 1626px wide). */
export const SCREEN_H: Record<string, number> = {
  [UI.welcome]: 3487,
  [UI.home]: 4380,
  [UI.scannerFood]: 3484,
  [UI.scannerLabel]: 3484,
  [UI.mealResult]: 4002,
  [UI.labelResult]: 4335,
  [UI.chat]: 3518,
  [UI.streak]: 3518,
  [UI.goal]: 3563,
  [UI.diet]: 3563,
  [UI.shareSheet]: 3517,
  [UI.mealShare]: 3518,
  [UI.storyEditor]: 3486,
  [UI.age]: 3518,
  [UI.planMuscle]: 3565,
  [UI.planMaintain]: 3565,
  [UI.metrics]: 4917,
  [UI.profile]: 5209,
  [UI.darkWelcome]: 3473,
  [UI.darkHome]: 3473,
  [UI.darkMeal]: 4035,
  [UI.darkStreak]: 3473,
};

export const PHOTO = {
  rotiPaneer: 'photos/roti-paneer.jpg',
  rotiPaneerWide: 'photos/roti-paneer-wide.jpg',
  pancakes: 'photos/pancakes.jpg',
  labelPack: 'photos/label-pack.jpg',
  labelHand: 'photos/label-hand.jpg',
  iraThali: 'photos/ira-thali.jpg',
  iraDumbbell: 'photos/ira-dumbbell.jpg',
  iraJump: 'photos/ira-jump.jpg',
  iraDalChawal: 'photos/ira-dal-chawal.jpg',
} as const;

export const BRAND = {
  logo: 'brand/logo.png',
  logoLight: 'brand/logo-light.png',
  iraAvatar: 'brand/ira-avatar.png',
};

export const IRA = 'ira/ira.png';
export const STICKER = {
  flame: 'ira/sticker-flame.png',
  wave: 'ira/sticker-wave.png',
  medal: 'ira/sticker-medal.png',
  trophy: 'ira/sticker-trophy.png',
  crown: 'ira/sticker-crown.png',
};

/** IRA expression sheet (generated from the IRA reference), cut by scripts/extract_emotes.py. */
export const EMOTES = ['wave', 'thinking', 'celebrate', 'thumbsup', 'surprised', 'present', 'phone', 'eating', 'shrug'] as const;
export type Emote = (typeof EMOTES)[number];
export const EMOTE_SIZE: Record<Emote, [number, number]> = {
  wave: [401, 672],
  thinking: [398, 668],
  celebrate: [450, 650],
  thumbsup: [351, 647],
  surprised: [356, 649],
  present: [435, 662],
  phone: [350, 657],
  eating: [344, 659],
  shrug: [432, 658],
};
export const emoteFile = (e: Emote) => `ira/emote-${e}.png`;

export const src = (p: string) => staticFile(p);
