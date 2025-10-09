#!/bin/bash
# QR Code Optimization Script
# Requires: imagemagick or cwebp
# Usage: ./scripts/optimize-qr.sh

set -e

INPUT="public/qr-code.png"
OUTPUT_WEBP="public/qr-code.webp"
OUTPUT_PNG="public/qr-code-optimized.png"

echo "Optimizing QR code..."

# Check for available tools
if command -v cwebp &> /dev/null; then
  echo "Using cwebp for WebP conversion..."
  cwebp -q 85 "$INPUT" -o "$OUTPUT_WEBP"
  echo "Created: $OUTPUT_WEBP"
elif command -v magick &> /dev/null; then
  echo "Using ImageMagick for optimization..."
  magick "$INPUT" -quality 85 "$OUTPUT_WEBP"
  magick "$INPUT" -strip -quality 85 "$OUTPUT_PNG"
  echo "Created: $OUTPUT_WEBP and $OUTPUT_PNG"
elif command -v convert &> /dev/null; then
  echo "Using ImageMagick convert for optimization..."
  convert "$INPUT" -quality 85 "$OUTPUT_WEBP"
  convert "$INPUT" -strip -quality 85 "$OUTPUT_PNG"
  echo "Created: $OUTPUT_WEBP and $OUTPUT_PNG"
else
  echo "Error: No image optimization tools found!"
  echo "Please install: imagemagick or webp"
  echo "  Ubuntu/Debian: sudo apt install imagemagick webp"
  echo "  macOS: brew install imagemagick webp"
  exit 1
fi

# Show file sizes
echo ""
echo "File sizes:"
ls -lh "$INPUT" "$OUTPUT_WEBP" 2>/dev/null || true
ls -lh "$OUTPUT_PNG" 2>/dev/null || true

echo ""
echo "Optimization complete!"
echo "Update index.html to use <picture> element with WebP fallback"
