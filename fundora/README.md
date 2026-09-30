# Fundora launch film

Remotion (TypeScript) project for the 50s Fundora launch film: 1920×1080 main cut and a 1080×1350 social cut.

- `src/theme.ts`: style card tokens (colors, Geist type, radii, shadow, motion, beat grid)
- `src/copy.ts`: every on-screen word; edit here without touching animation code
- `src/timeline.ts`: scene lengths in beats at 100 BPM (1 beat = 18 frames, 84 beats = 50.4s)
- `public/screens/`: 2× PNG exports from Figma (`dashboard.png`, `request.png`, …)
- `public/music.mp3`: drop the ~100 BPM track here, then set `MUSIC_ENABLED` in `timeline.ts`

```sh
npm i
npm run studio                        # preview
npx remotion still StyleCard out/stylecard.png
```

In a container with a preinstalled Chromium, set `REMOTION_BROWSER` to its headless shell path to skip the download.
