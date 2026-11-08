# Layout ideas for tall phones (kept for later)

**Chosen and built: B, the cover banner** (see `phone/game.js` `fit()` and the `#coverBanner` rules in `phone/game.css`).
The console is pinned to the bottom of the screen and the spare height above it becomes a game-box cover banner
(game art, title, JW EDS logo). The console is never resized; no spare height means no banner and the console stays centred.
Banner shows from 64 px of spare height and is capped at 190 px. Previews: `layout-ideas/option-B-cover-banner-mockup.webp`.

The two ideas below are **not built**. They are parked here in case one becomes the preferred look.

## A: taller console that fills the whole screen
`layout-ideas/option-A-taller-console.webp`
- The LED announcement strip gets taller (room for two lines of dot-matrix text).
- The game window gets extra height **below** the playfield: the real map is mirrored and fades to black as it moves down.
- Joey's movement line and the camp line stay exactly the same distance from the top of the playfield, so zombies run no further and the
  playfield keeps its size and proportions. The extra area is decoration only (no spawns, no collisions).
- Rough build: `renderer.js` (game repo) draws the mirrored, faded strip below world y = 412 for any extra canvas height; the console
  stretches the nine-slice screen window and the LED slot by the spare height; `console-layout.js` gets an "extra height" variable.
  Needs a game release (renderer) and a console cartridge-lock bump, and the layout-lock baseline re-recorded.
- Sensible limits: LED up to about +16 px, extension up to about 130 px (more makes Joey look like he is floating in a huge arena).

## C: A and B together
`layout-ideas/option-C-banner-plus-taller-console.webp`
- Spare height is shared: banner first (about 40% of the spare height, capped around 110 px), then the LED, then the map extension with the remainder.
- Small phones: no banner and no extension (identical to today). Tablets and very tall screens: both hit their caps and the wallpaper fills the rest.
- Everything in A applies, plus the banner code that already exists.

## Rules every variant must keep
- The 343 x 412 playfield is never rescaled or re-proportioned; the console scales uniformly by `min(width / 375, height / 667)` as now.
- Respect the safe areas (notch above the banner, home bar below the console).
- `phone/scripts/layout-lock.cjs` is the proof: sizes and scale must stay identical at every screen size; only intended vertical positions change.
