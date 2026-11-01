# Zombie Smash: consoles

The consoles are the "machines" that play the Zombie Smash game cartridge (`thejoeyrob/zombie-smash-game`).

| Folder | Console | Ships as |
|---|---|---|
| `phone/` | Retro handheld | iPhone app, Android app, the web version |
| `vr/` | VR arcade (Godot) | Meta Quest app (moves here from the archive repo later) |

A console supplies the screen look, sound output, controls, packaging and store pages. It never contains game rules. `cartridge.lock.json` says which game version these consoles are built against.

Start with `docs/OWNERS-GUIDE.md` (plain English) and `docs/SETUP.md` (one-time GitHub steps).

```
cd phone
npm ci
node scripts/assemble-www.mjs ../../zombie-smash-game/dist/cartridge   # builds www/ from the cartridge
npm test
```
The history of everything before these repositories is in `thejoeyrob/ZC-Zombie-Smash` (archive).
