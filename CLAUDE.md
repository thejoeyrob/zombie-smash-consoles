# Rules for Claude chats in zombie-smash-consoles

Read `README.md`, `docs/OWNERS-GUIDE.md` and `docs/PLATFORMS.md` first.

1. **No game rules here.** Rules, bosses, balance, art, music and scenes belong to `thejoeyrob/zombie-smash-game`. If a change affects how the game plays, stop and ask the owner to make it in the game repo.
2. A console only changes screen look, sound output, controls, packaging, store assets and listings.
3. Platform-only behaviour goes behind a platform check (for example `window.Capacitor.getPlatform()`), so it cannot affect the other platforms.
4. Take a game update by changing `cartridge.lock.json` on purpose, running the tests, then building. Never edit files copied from the cartridge.
5. **The iPhone app (old repo, bundle `com.thejoeyrob.zombiesmash2`, build 144) was approved by Apple on 2026-11-07.** Do not run iOS build or listing workflows, or change its App Store page, unless the owner asks. Any iPhone change is a new version that goes through Apple review again.
6. Secrets (Apple keys, Android upload key, tokens) live in GitHub secrets only, never in files, commits or chat. Never commit `*.keystore`, `*.jks`, `*.p8`.
7. Work on a branch; merge to `main` when `npm test` passes. Do not open pull requests unless asked.
8. Update `docs/PLATFORMS.md` when you finish work.
9. **Layout lock.** The console (375x667) and the game screen inside it scale together as one unit; characters, menus and controls never scale separately and the game's aspect ratio never changes. Anything outside that unit (background, window handling, extra panels) may change, but before you push a console change run `node scripts/layout-lock.cjs` in `phone/` (needs Playwright and an assembled `www/`); it must report 0 differences. Re-record the baseline only for a layout change the owner asked for.
