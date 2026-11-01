# Owner's guide (new structure)

Plain English. Read this one first.

## The picture

```
 zombie-smash-game        = THE GAME (the "cartridge")
        |  pinned version in cartridge.lock.json
        v
 zombie-smash-consoles    = THE MACHINES that play it
     phone/  -> iPhone app, Android app, website
     vr/     -> Meta Quest arcade
 ZC-Zombie-Smash (old)    = THE ARCHIVE + the live iPhone build 142 line
```

Players see no difference. The change is behind the scenes: the game is made once, and each machine plays it.

## Which chat for what

| I want to... | Chat |
|---|---|
| Change how the game plays (bosses, balance, art, music, scenes) | **Game chat** (works in `zombie-smash-game`) |
| Change the phone handheld's look, controls, sound output, Android/iPhone packaging | **Phone console chat** (works in `zombie-smash-consoles/phone`) |
| Anything VR | **VR chat** (still in the old repo for now; moves to `consoles/vr` later) |
| Website, support page, email | **Phone console chat**, or ask in this chat |
| Answer Apple about build 142 | This chat (old repo) |

## When the game changes
1. Game chat makes the change, tests pass, version goes up (say 7.63.0) and gets tagged.
2. You tell the console chats: "take game 7.63.0".
3. They change one line (`cartridge.lock.json`), run the tests and build. Android and iPhone both get it from that one step; each store still reviews the new app version.

## Safety net
Every game release includes a **golden run**: a fixed play-through whose results are recorded. A console or port must reproduce it exactly. This is how we prove VR plays the same as the phone.

## Rules that keep it tidy
- Game rules only ever live in the game repo.
- Each store has its own build number; the game has one version.
- Secrets stay in GitHub settings. Never paste keys into chat.
- iPhone build 142 stays untouched in the old repo until Apple finishes.
