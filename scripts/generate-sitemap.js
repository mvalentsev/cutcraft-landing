#!/usr/bin/env node
/**
 * Generate sitemap.xml with current date and image extensions
 * Modern 2025: Includes image:image for better SEO
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://cutcraft.cc/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://cutcraft.cc/og-image.png</image:loc>
      <image:title>CutCraft - AI Content Creation Bot</image:title>
      <image:caption>AI генерация видео, изображений и текста в Telegram</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://cutcraft.cc/qr-code.webp</image:loc>
      <image:title>QR-код для быстрого доступа к боту CutCraft</image:title>
    </image:image>
  </url>
</urlset>
`;

// Write to public directory
const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outputPath, sitemap, 'utf8');

console.log(`✅ Sitemap generated with date: ${currentDate} (with image extensions)`);
