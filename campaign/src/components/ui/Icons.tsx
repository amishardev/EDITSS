import React from 'react';

type P = {size: number; color: string; stroke?: number};

export const Bolt: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

export const Pencil: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 3.5l4 4L8 20H4v-4L16.5 3.5z" />
  </svg>
);

export const Check: React.FC<P> = ({size, color, stroke = 2.6}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Chevron: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const Insta: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
  </svg>
);

/** Flame used by the app's streak strip: filled = logged, outline = missed. */
export const Flame: React.FC<{size: number; color: string; filled?: boolean; stroke?: number}> = ({size, color, filled = true, stroke = 1.6}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.5c.6 3-1.2 4.6-2.6 6.2C8 10.3 6.5 12 6.5 14.6 6.5 18.2 9 21 12 21s5.5-2.6 5.5-6.1c0-2.4-1.1-3.9-2.2-5.2-.3 1.3-1 2.2-1.9 2.6.4-3.4-.3-6.6-1.4-8.8z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </svg>
);

export const Camera: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinejoin="round">
    <path d="M4 8h3l2-2.5h6L17 8h3v11H4z" />
    <circle cx="12" cy="13" r="3.6" />
  </svg>
);

export const Sparkle: React.FC<P> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </svg>
);
