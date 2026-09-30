// Fundora style card. Every visual decision in the film reads from here.
// Colors are solid fills only: fade with element opacity, never with alpha colors.

import {Easing} from 'remotion';

export const color = {
  primary: '#036BDD',
  deepBlue: '#034894',
  lightBlue: '#EBF3FC',
  navy: '#071A31', // Blue/950, dark stage
  darkCard: '#0A2748',
  ink: '#13171D',
  body: '#4B5362',
  muted: '#6C7381',
  border: '#E4E7EC',
  surface: '#F6F7F9', // light stage
  white: '#FFFFFF',
  success: '#14A35B',
  warning: '#EF9A0B',
  error: '#E3383C',
  violet: '#7457F0',
  teal: '#13A6BD',
} as const;

export type ColorName = keyof typeof color;

// Geist only, weights 400/500/600. Nothing 700+.
export const font = {
  family: 'Geist',
  file: 'fonts/Geist-Variable.woff2',
  weight: {regular: 400, medium: 500, semibold: 600},
} as const;

export const type = {
  // Headlines: 600, -2% tracking, max 7 words on screen.
  headline: {
    fontFamily: font.family,
    fontWeight: font.weight.semibold,
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
    fontSize: 96,
  },
  // Captions: 500, 40–48px at 1080p.
  caption: {
    fontFamily: font.family,
    fontWeight: font.weight.medium,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
    fontSize: 44,
  },
  small: {
    fontFamily: font.family,
    fontWeight: font.weight.regular,
    lineHeight: 1.4,
    fontSize: 28,
  },
  // Counting numbers must not jitter.
  tabular: {fontVariantNumeric: 'tabular-nums'},
} as const;

export const headlineMaxWords = 7;

export const radius = {
  card: 12,
  button: 12,
  stage: 24, // container that holds a screenshot
  pill: 9999,
} as const;

// One soft shadow, solid color, faded via the element that casts it.
export const shadow = {
  stageOnNavy: '0 40px 80px -20px #030C18',
  stageOnSurface: '0 40px 80px -24px #C9CFD8',
} as const;

export const motion = {
  // Calm, never bouncy.
  spring: {damping: 200, stiffness: 100, mass: 1},
  ease: Easing.bezier(0.22, 1, 0.36, 1),
  pushIn: {from: 1, to: 1.08},
  transitionFrames: 9, // masked slide or crossfade, 8–10 frames
  checkStaggerMs: 150,
} as const;

export const video = {
  fps: 30,
  main: {width: 1920, height: 1080},
  social: {width: 1080, height: 1350},
} as const;

export type Format = 'main' | 'social';

// ~100 BPM track: one beat = 0.6s = 18 frames, one bar = 2.4s = 72 frames.
export const bpm = 100;
export const beatFrames = Math.round((60 / bpm) * video.fps);
export const barFrames = beatFrames * 4;
export const beats = (n: number) => n * beatFrames;
export const msToFrames = (ms: number) => Math.round((ms / 1000) * video.fps);
