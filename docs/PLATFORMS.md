# Platform status (consoles repo)

Last updated 2026-11-03.

| Console | Where | Game | State |
|---|---|---|---|
| iPhone (live line) | old repo `ZC-Zombie-Smash`, build 142 | 7.62.4 | In App Review. Untouched. |
| iPhone 1.1 (new line) | `phone/` here | 7.62.4 | Not started. Needs workflow + upgrade test from 142 (same bundle id, same saved data). |
| Android | `phone/android` | 7.62.4 | Debug APK builds on GitHub (workflow "Android debug APK", run 2, about 110 MB). Not yet installed or played on a real phone. Play bundle workflow not yet run (needs Play account and upload key). |
| Web (zc2.quest) | old repo `main` / Vercel | **7.22.7 live (stale)** | Waiting for approval to update; later served from this repo. |
| Meta Quest VR | old repo `quest-build` | Godot port | Continues separately. Joins here later. |

## Verified so far
- Assembling `phone/www` from the cartridge is byte-for-byte identical to the current game's www (227 files, plus `cartridge.json`).
- Game tests (6) and console tests (9) pass on GitHub Actions, in both repos.
- The game repo publishes release `v7.62.4`; the consoles pin it in `cartridge.lock.json`.

## Console revisions
- c1 (2026-11-03): BACKGROUND setting (Wallpaper default, Console colour, Black) for the space around the console on tall phones and tablets. Wallpaper made by `phone/scripts/make-wallpaper.py` from the cartridge art. Service-worker cache is now `zombie-smash-v<game version>-c<console revision>`; raise the c-number whenever only the console changes.

## Next
1. Install the debug APK on an Android phone and play-test it.
2. Set up the Play developer account and upload key; run the signed bundle workflow; start closed testing.
3. Move game flow still inside `game.js` into the cartridge (see game repo spec "Known gaps").
4. iPhone 1.1 pipeline and upgrade-from-142 test.
5. VR trial: run the cartridge engine inside Godot and check it against the golden run.
