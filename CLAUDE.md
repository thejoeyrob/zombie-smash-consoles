# Rules for Claude chats in zombie-smash-consoles

Read `README.md`, `docs/OWNERS-GUIDE.md` and `docs/PLATFORMS.md` first.

1. **No game rules here.** Rules, bosses, balance, art, music and scenes belong to `thejoeyrob/zombie-smash-game`. If a change affects how the game plays, stop and ask the owner to make it in the game repo.
2. A console only changes screen look, sound output, controls, packaging, store assets and listings.
3. Platform-only behaviour goes behind a platform check (for example `window.Capacitor.getPlatform()`), so it cannot affect the other platforms.
4. Take a game update by changing `cartridge.lock.json` on purpose, running the tests, then building. Never edit files copied from the cartridge.
5. **iPhone build 142 (old repo) is in App Review.** Do not run iOS workflows against the App Store record, and do not touch the old repo's iOS files, until the owner says Apple has finished.
6. Secrets (Apple keys, Android upload key, tokens) live in GitHub secrets only, never in files, commits or chat. Never commit `*.keystore`, `*.jks`, `*.p8`.
7. Work on a branch; merge to `main` when `npm test` passes. Do not open pull requests unless asked.
8. Update `docs/PLATFORMS.md` when you finish work.
