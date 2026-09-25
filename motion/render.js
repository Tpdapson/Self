// node render.js beats|full|frames t1,t2,...
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const FF = process.env.FFMPEG;
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const mode = process.argv[2] || 'beats';

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1440 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  const ok = await page.evaluate(() => window.ready);
  if (!ok) throw new Error('Geist did not load');
  return page;
}
const shot = async (page, t) => { await page.evaluate(t => seek(t), t); return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1440, height: 1440 } }); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files', '--font-render-hinting=none', '--disable-lcd-text'] });
  if (mode === 'beats' || mode === 'frames') {
    const page = await openPage(browser);
    const ts = mode === 'beats' ? [...Array(28)].map((_, i) => i * 0.5 + 0.3) : process.argv[3].split(',').map(Number);
    const dir = path.join(OUT, mode); fs.mkdirSync(dir, { recursive: true });
    for (const [i, t] of ts.entries()) fs.writeFileSync(path.join(dir, `${String(i).padStart(2, '0')}_${t.toFixed(3)}.png`), await shot(page, t));
    fs.writeFileSync(path.join(OUT, 'sounds.json'), JSON.stringify(await page.evaluate(() => sounds()), null, 1));
  } else {
    // 60 fps, 4 subframes per frame over a 270° shutter, blended by ffmpeg tmix
    const FPS = 60, SUB = 4, SHUT = 0.75, N = 14 * FPS, WORKERS = 4;
    const per = Math.ceil(N / WORKERS);
    await Promise.all([...Array(WORKERS)].map(async (_, w) => {
      const page = await openPage(browser);
      const a = w * per, b = Math.min(N, a + per);
      const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-',
        '-vf', `tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))',setpts=N/${FPS}/TB`, '-r', String(FPS),
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', path.join(OUT, `seg${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise(r => ff.on('close', r));
      for (let n = a; n < b; n++) {
        for (let j = 0; j < SUB; j++) {
          const t = (n + ((j + 0.5) / SUB - 0.5) * SHUT) / FPS;
          const buf = await shot(page, t);
          if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        }
        if (w === 0 && n % 30 === 0) console.log(`frame ${n}/${b}`);
      }
      ff.stdin.end(); await done;
    }));
    fs.writeFileSync(path.join(OUT, 'segs.txt'), [...Array(WORKERS)].map((_, w) => `file 'seg${w}.mp4'`).join('\n'));
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
