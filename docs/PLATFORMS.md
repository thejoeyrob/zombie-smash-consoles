# Platform status (consoles repo)

Last updated 2026-11-01.

| Console | Where | Game | State |
|---|---|---|---|
| iPhone (live line) | old repo `ZC-Zombie-Smash`, build 142 | 7.62.4 | In App Review. Untouched. |
| iPhone 1.1 (new line) | `phone/` here | 7.62.4 | Not started. Needs workflow + upgrade test from 142 (same bundle id, same saved data). |
| Android | `phone/android` | 7.62.4 | Project and icons generated, tests pass on the assembled console. Bundle workflow not yet run on GitHub. Needs Play account and upload key. |
| Web (zc2.quest) | old repo `main` / Vercel | **7.22.7 live (stale)** | Waiting for approval to update; later served from this repo. |
| Meta Quest VR | old repo `quest-build` | Godot port | Continues separately. Joins here later. |

## Verified so far
- Assembling `phone/www` from the cartridge is byte-for-byte identical to the current game's www (227 files, plus `cartridge.json`).
- Game tests (4) and console tests (9) pass. The golden run is recorded.

## Next
1. Push both repos (needs the empty repos, `docs/SETUP.md`).
2. Run the Android workflow; fix first-run issues; set up the Play account and closed test.
3. Move game flow still inside `game.js` into the cartridge (see game repo spec "Known gaps").
4. iPhone 1.1 pipeline and upgrade-from-142 test.
5. VR trial: run the cartridge engine inside Godot and check it against the golden run.
