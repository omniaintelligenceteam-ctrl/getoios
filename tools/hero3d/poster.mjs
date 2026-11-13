// The hero's still: one finished frame of the live scene, drawn by the scene itself on the real GPU.
// Usage: node tools/hero3d/poster.mjs <site root URL, for example http://127.0.0.1:3417> <work dir>
// It writes <work dir>/still.png and prints where each room's label stands (as parts of the picture),
// for the --x and --y values in public/jarvis/index.html. Then:
//   magick still.png -quality 88 public/jarvis/hero3d/still-1470.webp
//   magick still.png -resize 735x -quality 86 public/jarvis/hero3d/still-735.webp
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [root, work] = process.argv.slice(2);
const W = 1470, H = 1336;   // 1.1 to 1, twice the stage at 1440
const html = `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400..700&display=swap" rel="stylesheet">
<body style="margin:0;font-family:'Host Grotesk'"><div id="stage" style="width:${W / 2}px;height:${H / 2}px"></div>
<script type="module">
import { mount } from '/jarvis/hero3d/hero3d.js';
await document.fonts.load('600 40px "Host Grotesk"');
const scene = await mount(document.getElementById('stage'), { still: true });
window.out = { png: scene.still(${W}, ${H}), points: scene.points() };
</script>`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/lib/chromium/chromium', args: ['--headless=new', '--use-angle=gl', '--ignore-gpu-blocklist', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
page.on('pageerror', (e) => console.error('pageerror', String(e)));
await page.route('**/__poster.html', (route) => route.fulfill({ contentType: 'text/html', body: html }));
await page.goto(root + '/jarvis/hero3d/__poster.html');
await page.waitForFunction(() => window.out, null, { timeout: 60000 });
const out = await page.evaluate(() => window.out);
writeFileSync(join(work, 'still.png'), Buffer.from(out.png.split(',')[1], 'base64'));
for (const k of Object.keys(out.points)) console.log(`room ${k}: --x: ${out.points[k][0].toFixed(4)}; --y: ${out.points[k][1].toFixed(4)}`);
await browser.close();
