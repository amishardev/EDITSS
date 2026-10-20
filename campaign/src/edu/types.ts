import {IconName} from './icons';

export type Accent = 'turmeric' | 'tomato' | 'leaf' | 'berry' | 'sky' | 'amla';

export type Scene =
  | {type: 'hook'; kicker?: string; lines: string[]; big?: string; icon?: IconName}
  | {type: 'stat'; value: number; decimals?: number; prefix?: string; unit?: string; label: string; note?: string; icon?: IconName}
  | {type: 'bars'; title?: string; items: {label: string; value: number; unit?: string; hi?: boolean}[]; note?: string}
  | {type: 'compare'; title?: string; left: {label: string; value: string; sub?: string}; right: {label: string; value: string; sub?: string}; verdict?: string; note?: string}
  | {type: 'list'; title?: string; items: {icon: IconName; text: string}[]; note?: string}
  | {type: 'myth'; myth: string; fact: string; note?: string}
  | {type: 'cubes'; count: number; label: string; sub?: string; note?: string; kind?: 'sugar' | 'salt' | 'oil'}
  | {type: 'timeline'; title?: string; steps: {icon: IconName; label: string}[]; gaps: string[]; note?: string}
  | {type: 'plate'; title?: string; parts: {label: string; value: string; share: number}[]; centre?: string; note?: string}
  | {type: 'label'; title?: string; heading: string; words: {t: string; hi?: boolean}[]; footer?: string; note?: string}
  | {type: 'statement'; lines: string[]; icon?: IconName; note?: string; dark?: boolean}
  | {type: 'cta'; line: string; sub?: string; screen: 'meal-result' | 'label-result' | 'chat' | 'home' | 'streak' | 'metrics'};

export type Seg = {vo: string; cap: string; scene: Scene};

export type Topic = {
  n: number;
  slug: string;
  title: string;
  accent: Accent;
  segs: Seg[];
  sources: string[];
  caption?: string;
};

export type Timing = {segs: number[]; voice?: number[]; total: number};
