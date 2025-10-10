#!/bin/bash
# Generate PWA icons from SVG favicon
# Requires: imagemagick (apt install imagemagick)

set -e

echo "🎨 Generating PWA icons from SVG..."

# Check if convert command exists
if ! command -v convert &> /dev/null; then
  echo "❌ Error: ImageMagick is not installed"
  echo "   Install: sudo apt install imagemagick"
  exit 1
fi

# Source and target paths
SOURCE="public/favicon.svg"
OUTPUT_DIR="public"

# Check if source exists
if [ ! -f "$SOURCE" ]; then
  echo "❌ Error: $SOURCE not found"
  exit 1
fi

# Generate 192x192 PNG (maskable)
echo "  → Generating 192x192 icon..."
convert -background none -resize 192x192 "$SOURCE" "$OUTPUT_DIR/icon-192.png"

# Generate 512x512 PNG (maskable)
echo "  → Generating 512x512 icon..."
convert -background none -resize 512x512 "$SOURCE" "$OUTPUT_DIR/icon-512.png"

# Optimize with pngquant if available
if command -v pngquant &> /dev/null; then
  echo "  → Optimizing PNGs with pngquant..."
  pngquant --force --quality=85-95 --output "$OUTPUT_DIR/icon-192.png" "$OUTPUT_DIR/icon-192.png" 2>/dev/null || true
  pngquant --force --quality=85-95 --output "$OUTPUT_DIR/icon-512.png" "$OUTPUT_DIR/icon-512.png" 2>/dev/null || true
fi

# Display file sizes
echo ""
echo "✅ Icons generated successfully!"
echo "   192x192: $(du -h "$OUTPUT_DIR/icon-192.png" | cut -f1)"
echo "   512x512: $(du -h "$OUTPUT_DIR/icon-512.png" | cut -f1)"
