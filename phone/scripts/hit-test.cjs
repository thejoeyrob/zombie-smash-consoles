// Touch-area check for the default console skin: which control owns each point of the control deck.
// Usage (from phone/, after assembling www/): node scripts/hit-test.cjs [port]   Needs Playwright. Exits 1 on any failure.
// Points are in console coordinates (375x667). Update them only when a control's touch area is changed on purpose.
const { spawn } = require('node:child_process'), path = require('node:path');
const port = process.argv[2] || '8796';
const srv = spawn('python3', ['-m', 'http.server', port], { cwd: path.join(__dirname, '..', 'www'), stdio: 'ignore' });
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true });
  const p = await ctx.newPage();
  await new Promise(r => setTimeout(r, 1200)); await p.goto(`http://127.0.0.1:${port}/index.html`); await p.waitForTimeout(6500);
  // points in console coordinates (375x667), and which control should own them
  const cases = [
    ['inside the stick drawing', 83, 571, 'joystick'], ['left of the stick, near the shell edge', 18, 580, 'joystick'], ['above the stick', 80, 498, 'joystick'],
    ['below the stick', 80, 632, 'joystick'], ['right of the stick', 136, 560, 'joystick'], ['lower-left corner of the pad', 24, 626, 'joystick'], ['upper-left corner of the pad', 24, 502, 'joystick'], ['upper-right corner of the pad', 130, 502, 'joystick'], ['lower-right corner of the pad', 130, 626, 'joystick'],
    ['grenade button centre', 187, 543, 'grenadeButton'], ['MENU button centre', 187, 606, 'menuButton'], ['just right of the pad, on MENU', 146, 606, 'menuButton'],
    ['FIRE button centre', 293, 571, 'fireButton'], ['game screen bottom (weapon rack row)', 190, 471, 'NOT joystick'], ['bezel above the pad is not the stick', 80, 470, 'NOT joystick'],
  ];
  const out = await p.evaluate((cases) => {
    const cab = document.getElementById('cabinet').getBoundingClientRect(); const k = cab.width / 375;
    return cases.map(([name, x, y, want]) => { const e = document.elementFromPoint(cab.left + x * k, cab.top + y * k); const id = e ? (e.closest('#joystick,#grenadeButton,#menuButton,#fireButton')?.id || e.id || e.tagName) : 'none'; return [name, id, want]; });
  }, cases);
  let bad = 0;
  for (const [name, id, want] of out) { const ok = want.startsWith('NOT ') ? id !== want.slice(4) : id === want; if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + name + ' -> ' + id); }
  console.log(bad ? bad + ' failures' : 'all hit tests pass');
  await b.close(); srv.kill(); process.exit(bad ? 1 : 0);
})();
