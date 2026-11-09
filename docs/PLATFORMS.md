# Platform status (consoles repo)

Last updated 2026-11-08.

| Console | Where | Game | State |
|---|---|---|---|
| iPhone (live line) | old repo `ZC-Zombie-Smash`, app `com.thejoeyrob.zombiesmash2`, build 144 | 7.62.4 | Fresh app record created 2026-11-06 (the first record, `com.thejoeyrob.zombiesmash`, build 142, was removed after 19 days unreviewed). Build 144 submitted for review 2026-11-06 (owner-reported). **Approved by Apple 2026-11-07** (In Review, then Pending Developer Release, per the owner's App Store Connect screenshot 2026-11-08). The owner must press Release; the store page goes live within about a day after that. Listing, notes and screenshots pushed by the old repo's `App Store listing` workflow. |
| iPhone 1.1 (new line) | `phone/` here | 7.62.4 | Not started. Needs workflow + upgrade test from 142 (same bundle id, same saved data). |
| Android | `phone/android` | 7.62.4 | Debug APK builds on GitHub (workflow "Android debug APK", run 2, about 110 MB). Not yet installed or played on a real phone. Play bundle workflow not yet run (needs Play account and upload key). |
| Web (zc2.quest) | old repo `main` / Vercel | **7.22.7 live (stale)** | Waiting for approval to update; later served from this repo. |
| Meta Quest VR | old repo `quest-build` | Godot port | Continues separately. Joins here later. |

## Verified so far
- Assembling `phone/www` from the cartridge is byte-for-byte identical to the current game's www (227 files, plus `cartridge.json`).
- Game tests (6) and console tests (9) pass on GitHub Actions, in both repos.
- The game repo publishes release `v7.62.4`; the consoles pin it in `cartridge.lock.json`.

## Console revisions
- c5 (2026-11-08): boss music routing in the phone console's sound output. The `fight` event now starts the boss theme at stage 1 (before, the warning track stayed on through all of stage 1 and the boss theme only arrived at the stage 2 change). The victory jingle hands over to the wave music and the defeat music to the game-over music, so the boss theme no longer comes back after the jingle. Sound output only; no game rules. The VR console needs the same routing. Found and checked by replaying a boss fight in a browser with a spy on the music calls (before: warning, then boss at stage 2; after: boss from stage 1).
- c4 (2026-11-07): bigger joystick touch pad on the default skin (about 126x142 console points instead of 94x94, a rounded rectangle reaching the shell edge, the speaker strip and just under the screen). The drawn stick, the stick travel and every other control are unchanged; `phone/scripts/hit-test.cjs` proves which control owns each point. Other skins keep their old pad.
- c3 (2026-11-07): joystick and FIRE hardening for Android (and iPhone/iPad): a new finger takes over a stale stick; a watchdog releases the stick or FIRE when the phone has quietly dropped the touch; they release when the app goes to the background; a rejected pointer capture releases instead of leaving the stick held. Verified with real touch events in a browser; not yet on a real phone.
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

## Console c6 (2026-11-08, branch `feat/cover-banner-c6`, not merged)
Owner's wide banner (`phone/cover-banner.webp`) shows above the console on tall screens (only when the spare height fits the whole banner: about 430x932, 390x844, 412x915, 1080x2400). The console and game screen are not resized; they only sit lower. Layout lock baseline re-recorded for that owner-requested shift; sizes and x positions unchanged. Not yet shipped to any store.
