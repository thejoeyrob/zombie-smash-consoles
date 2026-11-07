// Layout lock: proves the console and the game screen keep exactly the same position and scale on every screen size.
// Usage (from phone/, after assembling www/):  node scripts/layout-lock.cjs [port]
// Needs Playwright. Compares against tests/layout-lock-baseline.json (measured on console c1, 2026-11-07) and exits 1 on any difference.
// Re-record the baseline ONLY when a layout change is intended: node scripts/layout-lock.cjs 8780 --record
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs'), path = require('node:path');
const port = process.argv[2] || '8780', record = process.argv.includes('--record');
const www = path.join(__dirname, '..', 'www'), baselineFile = path.join(__dirname, '..', 'tests', 'layout-lock-baseline.json');
const SIZES = [[375,667],[360,640],[390,844],[412,915],[430,932],[600,1024],[820,1180],[1024,1366],[1080,2400]];
const IDS = ['cabinet','joystick','fireButton','grenadeButton','menuButton','powerLed','weaponLed','ledBar'];
const srv = spawn('python3', ['-m', 'http.server', port], { cwd: www, stdio: 'ignore' });
(async () => {
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch(); const res = {};
  for (const [w, h] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}/index.html`); await p.waitForTimeout(6500);
    res[`${w}x${h}`] = await p.evaluate((ids) => {
      const rd = (el) => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map(v => Math.round(v * 100) / 100); };
      const o = { scale: getComputedStyle(document.documentElement).getPropertyValue('--console-scale').trim() };
      for (const id of ids) { const el = document.getElementById(id); o[id] = el ? rd(el) : null; }
      document.querySelectorAll('canvas').forEach((c, i) => { o['canvas' + i + (c.id ? '#' + c.id : '')] = rd(c); });
      const scr = document.querySelector('.screen'); if (scr) o.screen = rd(scr);
      return o;
    }, IDS);
    await ctx.close();
  }
  await b.close(); srv.kill();
  if (record) { fs.writeFileSync(baselineFile, JSON.stringify(res, null, 1)); console.log('baseline recorded'); return; }
  const base = JSON.parse(fs.readFileSync(baselineFile, 'utf8')); let diffs = 0, n = 0;
  for (const size of Object.keys(base)) for (const k of Object.keys(base[size])) { n++; if (JSON.stringify(base[size][k]) !== JSON.stringify(res[size]?.[k])) { diffs++; console.log('DIFF', size, k, base[size][k], res[size]?.[k]); } }
  console.log(`layout lock: ${n} measurements, ${diffs} differences`); process.exit(diffs ? 1 : 0);
})();
