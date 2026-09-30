// Scene lengths in beats (100 BPM). Storyboard times snapped to the nearest beat,
// so every cut lands on the beat. Total 84 beats = 50.4s = 1512 frames.

import {beats} from './theme';

export const sceneBeats = {
  s1: 7, //  0.0–4.2s  navy, headline 1
  s2: 5, //  4.2–7.2s  navy, headline 2
  s3: 5, //  7.2–10.2s logo
  s4: 8, // 10.2–15.0s dashboard
  s5: 10, // 15.0–21.0s request
  s6: 8, // 21.0–25.8s checking → eligible
  s7: 9, // 25.8–31.2s documents
  s8: 8, // 31.2–36.0s tracking → offer
  s9: 10, // 36.0–42.0s payout
  s10: 7, // 42.0–46.2s repayments
  s11: 7, // 46.2–50.4s end card
} as const;

export type SceneId = keyof typeof sceneBeats;

export const sceneFrames = Object.fromEntries(
  Object.entries(sceneBeats).map(([id, n]) => [id, beats(n)]),
) as Record<SceneId, number>;

export const totalFrames = Object.values(sceneFrames).reduce((a, b) => a + b, 0);

// Drop a ~100 BPM track at public/music.mp3, then flip this on.
export const MUSIC_ENABLED = false;
