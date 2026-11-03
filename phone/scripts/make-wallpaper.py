#!/usr/bin/env python3
"""Builds backdrop-wall.webp: a dim "find the characters" wallpaper from the game's own art.
Usage: python3 scripts/make-wallpaper.py <cartridge-folder>   (seeded, so the same inputs give the same image)"""
import sys, glob, random, os
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

cart = sys.argv[1]
W, H = 1600, 2400
rnd = random.Random(762)  # fixed seed

# 1. scenery: six boss arenas tiled 2x3 with feathered edges over a dark base
base = Image.new('RGB', (W, H), (10, 12, 14))
arenas = sorted(glob.glob(os.path.join(cart, 'arena-*.webp')))[:6]
tile = 800
mask = Image.new('L', (tile, tile), 255)
fe = 90
px = mask.load()
for y in range(tile):
    for x in range(tile):
        d = min(x, y, tile - 1 - x, tile - 1 - y)
        if d < fe:
            px[x, y] = int(255 * d / fe)
for i, f in enumerate(arenas):
    im = ImageOps.fit(Image.open(f).convert('RGB'), (tile, tile), Image.LANCZOS)
    base.paste(im, ((i % 2) * tile, (i // 2) * tile), mask)
base = ImageEnhance.Color(base).enhance(0.7)
base = ImageEnhance.Brightness(base).enhance(0.85)

# 2. characters: bosses, zombies, Joey, pickups scattered at varied sizes
names = []
names += sorted(glob.glob(os.path.join(cart, 'boss-*-stage1.webp'))) * 2
names += sorted(glob.glob(os.path.join(cart, 'zombie-*.webp'))) * 3
names += [os.path.join(cart, f) for f in ('player-transparent.webp', 'player-victory.webp', 'player-fire.webp')] * 2
names += sorted(glob.glob(os.path.join(cart, 'pickup-*.webp'))) + sorted(glob.glob(os.path.join(cart, 'weapon-*.webp')))[:8]
rnd.shuffle(names)
placed = []
canvas = base.convert('RGBA')
for f in names:
    sp = Image.open(f).convert('RGBA')
    big = 'boss-' in f or 'player-' in f
    size = rnd.randint(190, 300) if big else (rnd.randint(110, 190) if 'zombie-' in f else rnd.randint(60, 100))
    sp.thumbnail((size, size), Image.LANCZOS)
    sp = sp.rotate(rnd.uniform(-22, 22), expand=True, resample=Image.BICUBIC)
    if rnd.random() < 0.5:
        sp = ImageOps.mirror(sp)
    for _ in range(40):  # find a spot that does not sit on another character
        x, y = rnd.randint(-20, W - sp.width + 20), rnd.randint(-20, H - sp.height + 20)
        cx, cy = x + sp.width / 2, y + sp.height / 2
        if all((cx - px_) ** 2 + (cy - py_) ** 2 > (0.62 * (sp.width + pw)) ** 2 / 4 * 1.0 for px_, py_, pw in placed):
            break
    placed.append((cx, cy, sp.width))
    shadow = Image.new('RGBA', sp.size, (0, 0, 0, 0))
    shadow.putalpha(sp.getchannel('A').filter(ImageFilter.GaussianBlur(10)).point(lambda a: int(a * 0.6)))
    canvas.alpha_composite(shadow, (x + 8, y + 12)) if 0 <= x and 0 <= y else canvas.paste(shadow, (x + 8, y + 12), shadow)
    canvas.alpha_composite(sp, (x, y)) if 0 <= x and 0 <= y and x + sp.width <= W and y + sp.height <= H else canvas.paste(sp, (x, y), sp)

# 3. dim it so it never competes with the game
img = canvas.convert('RGB')
img = ImageEnhance.Brightness(img).enhance(1.0)
img = ImageEnhance.Color(img).enhance(0.95)
out = os.path.join(os.path.dirname(__file__), '..', 'backdrop-wall.webp')
img.save(out, 'WEBP', quality=62, method=6)
print('wrote', os.path.abspath(out), os.path.getsize(out) // 1024, 'KB,', len(placed), 'characters')
