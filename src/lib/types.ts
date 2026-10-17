import type {Key, Rect} from './timeline';

// Times on keys/captions are seconds into the reel, not into the source.

export type Segment = {src: number; dur: number};

export type Shot = Key & {cx: number; cy: number; z: number};

export type Light = Key & {rect: Rect; dim: number};

export type Grade = Key & {sat: number; con: number; bri: number; warm: number};

export type CaptionKind = 'hook' | 'line' | 'label' | 'title';
export type HookStyle = 'fade' | 'words' | 'type' | 'cut';

export type Caption = {
  from: number;
  to: number;
  text: string;
  kind: CaptionKind;
  style?: HookStyle;
  x?: number;
  y?: number;
  align?: 'left' | 'center';
  accent?: boolean;
};

export type Pane = {top: number; h: number; cx: number; cy: number; z: number; label: string};

export type ReelSpec = {
  id: string;
  segments: Segment[];
  shots: Shot[];
  lights?: Light[];
  grade: Grade[];
  captions: Caption[];
  pulse?: {from: number; to: number; amt: number}[];
  panes?: Pane[];
  letterbox?: number; // bar height in px
  counter?: {from: number; to: number};
  signature?: boolean;
};
