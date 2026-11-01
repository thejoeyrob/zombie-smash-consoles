// Assembles the phone console: cartridge (the game) + console files -> www/ (what Capacitor and the website serve).
// Usage: node scripts/assemble-www.mjs <path-to-cartridge-folder>   (default: ../cartridge, or $ZS_CARTRIDGE)
import { readFileSync, mkdirSync, rmSync, copyFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cart = resolve(process.argv[2] || process.env.ZS_CARTRIDGE || join(root, '..', 'cartridge'));
const out = join(root, 'www');
const lock = JSON.parse(readFileSync(join(root, '..', 'cartridge.lock.json'), 'utf8'));

const manifest = JSON.parse(readFileSync(join(cart, 'cartridge.json'), 'utf8'));
if (manifest.id !== 'zombie-smash') throw new Error('Not a Zombie Smash cartridge');
if (manifest.api !== lock.api) throw new Error(`Cartridge api ${manifest.api} but this console needs api ${lock.api}`);
if (lock.version && manifest.version !== lock.version) throw new Error(`Cartridge is ${manifest.version} but cartridge.lock.json pins ${lock.version}`);
for (const [f, h] of Object.entries(manifest.files)) {
  if (createHash('sha256').update(readFileSync(join(cart, f))).digest('hex') !== h) throw new Error('Cartridge file damaged: ' + f);
}

// Console files = everything the sw.js cache list names that the cartridge does not supply, plus the pages around it.
const sw = readFileSync(join(root, 'sw.js'), 'utf8').match(/const ASSETS\s*=\s*\[(.*?)\];/s);
if (!sw) throw new Error('Could not find the ASSETS list in sw.js');
const listed = [...sw[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1].replace(/^\.\//, ''));
const consoleFiles = new Set(listed.filter(f => !manifest.files[f] && f !== 'sw.js'));
for (const extra of ['index.html', 'manifest.webmanifest', 'privacy.html', 'support.html']) if (existsSync(join(root, extra))) consoleFiles.add(extra);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
const missing = [];
for (const f of Object.keys(manifest.files)) copyFileSync(join(cart, f), join(out, f));
copyFileSync(join(cart, 'cartridge.json'), join(out, 'cartridge.json')); // the game's header travels with the console (version, hashes)
for (const f of consoleFiles) {
  const src = join(root, f);
  if (!existsSync(src)) { missing.push(f); continue; }
  mkdirSync(dirname(join(out, f)), { recursive: true });
  copyFileSync(src, join(out, f));
}
// Every file the offline cache expects must now exist.
for (const f of listed) if (f !== 'sw.js' && !existsSync(join(out, f))) missing.push(f);
if (missing.length) throw new Error('Listed in sw.js but not found in console or cartridge: ' + [...new Set(missing)].join(', '));
console.log(`www/ ready: cartridge ${manifest.version} (${Object.keys(manifest.files).length} files) + ${consoleFiles.size} console files`);
