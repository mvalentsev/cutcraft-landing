#!/usr/bin/env node
/**
 * Generate sitemap.xml with current date
 * This script runs during build to ensure lastmod is always up-to-date
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cutcraft.cc/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

// Write to public directory
const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outputPath, sitemap, 'utf8');

console.log(`✅ Sitemap generated with date: ${currentDate}`);
