# Platform status (consoles repo)

Last updated 2026-11-03.

| Console | Where | Game | State |
|---|---|---|---|
| iPhone (live line) | old repo `ZC-Zombie-Smash`, app `com.thejoeyrob.zombiesmash2`, build 144 | 7.62.4 | Fresh app record created 2026-11-06 (the first record, `com.thejoeyrob.zombiesmash`, build 142, was removed after 19 days unreviewed). Build 144 submitted for review 2026-11-06 (owner-reported). Listing, notes and screenshots pushed by the old repo's `App Store listing` workflow. |
| iPhone 1.1 (new line) | `phone/` here | 7.62.4 | Not started. Needs workflow + upgrade test from 142 (same bundle id, same saved data). |
| Android | `phone/android` | 7.62.4 | Debug APK builds on GitHub (workflow "Android debug APK", run 2, about 110 MB). Not yet installed or played on a real phone. Play bundle workflow not yet run (needs Play account and upload key). |
| Web (zc2.quest) | old repo `main` / Vercel | **7.22.7 live (stale)** | Waiting for approval to update; later served from this repo. |
| Meta Quest VR | old repo `quest-build` | Godot port | Continues separately. Joins here later. |

## Verified so far
- Assembling `phone/www` from the cartridge is byte-for-byte identical to the current game's www (227 files, plus `cartridge.json`).
- Game tests (6) and console tests (9) pass on GitHub Actions, in both repos.
- The game repo publishes release `v7.62.4`; the consoles pin it in `cartridge.lock.json`.

## Console revisions
- c2 (2026-11-07): hidden screen diagnostics (tap the top-right corner of the screen 5 times within 3 seconds; tap the box to close). Used to find out what size window a phone really gives the app.
- c1 (2026-11-03, brightened same day): BACKGROUND setting (Wallpaper default, Console colour, Black) for the space around the console on tall phones and tablets. Wallpaper made by `phone/scripts/make-wallpaper.py` from the cartridge art. Service-worker cache is now `zombie-smash-v<game version>-c<console revision>`; raise the c-number whenever only the console changes.

## Android version codes
Workflows use `run number + 100`, so builds start at 101 and always beat the first uploaded bundle (version code 2). Never reuse a code; Play rejects duplicates.

## Next
1. Install the debug APK on an Android phone and play-test it.
2. Set up the Play developer account and upload key; run the signed bundle workflow; start closed testing.
3. Move game flow still inside `game.js` into the cartridge (see game repo spec "Known gaps").
4. iPhone 1.1 pipeline and upgrade-from-142 test.
5. VR trial: run the cartridge engine inside Godot and check it against the golden run.

## IDs to remember
- iPhone bundle ID: `com.thejoeyrob.zombiesmash2` (new). The old `com.thejoeyrob.zombiesmash` record is gone.
- Android application ID: `com.thejoeyrob.zombiesmash` (Google Play). They do not have to match across stores.
- The iOS and listing workflows (old repo, branch `claude/zombie-smash-deployment-stores-mk88wq`) default to the new iOS bundle ID.
