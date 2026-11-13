#!/usr/bin/env bash
# The hero's model, light bakes and bundle. Usage: tools/hero3d/build.sh <work dir> [atlas size] [samples]
set -euo pipefail
cd "$(dirname "$0")/../.."
W="${1:?work dir}"; SIZE="${2:-4096}"; SAMPLES="${3:-512}"
OUT=public/jarvis/hero3d
mkdir -p "$W" "$OUT"
blender -b --factory-startup -P tools/hero3d/build_scene.py -- --out "$W" --bake "$SIZE" --samples "$SAMPLES" --export > "$W/build.log" 2>&1
grep -E "HERO3D|Traceback|Error" "$W/build.log" || true
for s in on off; do
  magick "$W/atlas-$s.png" -resize 4096x4096 -quality 86 -define webp:method=6 "$OUT/atlas-$s-4096.webp"
  magick "$W/atlas-$s.png" -resize 2048x2048 -quality 84 -define webp:method=6 "$OUT/atlas-$s-2048.webp"
done
cp "$W/shop.bin" "$OUT/shop.bin"
npm run -s hero3d:build
