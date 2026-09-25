# One Shape

A 14 s, 1440×1440, 60 fps seamless loop: one element morphs through 12 UI states over 7 bars at 120 BPM.

- `index.html`: the whole composition. `seek(t)` computes every style from `t`: no CSS transitions, no timers, no state between frames. Every animated value is a sum of closed-form spring step responses (one per target change), evaluated periodically, so `seek(0)` and `seek(14)` produce identical DOM.
- `render.js`: Playwright renderer. `beats` = one still per beat, `frames t1,t2,…` = specific times, `full` = 60 fps × 4 subframes (270° shutter) blended with ffmpeg `tmix`.
- `audio.py`: cuts the 7-bar section of `../assets/song.mp3` starting on the measured kick onset (64.336 s), crossfades the seam, and places synthesized UI sounds by their measured peaks, using the cue list exported from `sounds()` in the page.

```sh
npm i && . ./env.sh
node render.js beats && sheet beats           # contact sheet → out/beats.png (also writes out/sounds.json)
$FFMPEG -i ../assets/song.mp3 -ac 2 -ar 48000 -f f32le out/song48.f32 && python3 audio.py
node render.js full
cd out && $FFMPEG -f concat -safe 0 -i segs.txt -i audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart one-shape.mp4
```

Music: "Eco Technology" by Lexin Music.
