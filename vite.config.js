import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Get git hash and version for cache busting
 * Format: v{version} ({hash}) • {date}
 */
function getVersion() {
  const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
  const version = packageJson.version;

  try {
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const date = new Date().toISOString().split('T')[0];
    return `v${version} (${commitHash}) • ${date}`;
  } catch {
    const date = new Date().toISOString().split('T')[0];
    return `v${version} • ${date}`;
  }
}

const version = getVersion();

export default defineConfig({
  // GitHub Pages base URL
  base: '/',

  plugins: [
    tailwindcss(),
    // GitHub Pages plugin - copy .nojekyll and process sw.js with version injection
    {
      name: 'github-pages-setup',
      closeBundle() {
        // Copy .nojekyll
        const nojekyllPath = resolve(__dirname, 'public', '.nojekyll');
        const distNojekyllPath = resolve(__dirname, 'dist', '.nojekyll');
        try {
          copyFileSync(nojekyllPath, distNojekyllPath);
          console.log('✅ Copied .nojekyll to dist/');
        } catch (error) {
          console.warn('⚠️  Could not copy .nojekyll:', error.message);
        }

        // Process sw.js with dynamic version injection
        const swSourcePath = resolve(__dirname, 'public', 'sw.js');
        const swDistPath = resolve(__dirname, 'dist', 'sw.js');
        try {
          let swContent = readFileSync(swSourcePath, 'utf8');
          // Replace hardcoded version with dynamic version from package.json
          swContent = swContent.replace(
            /const CACHE_NAME = ['"]cutcraft-landing-v[\d.]+['"];/,
            `const CACHE_NAME = 'cutcraft-landing-${version}';`
          );
          writeFileSync(swDistPath, swContent, 'utf8');
          console.log(`✅ Processed sw.js with version: ${version}`);
        } catch (error) {
          console.warn('⚠️  Could not process sw.js:', error.message);
        }
      },
    },
  ],

  // Development server (Vite 7+)
  server: {
    // Warmup critical files for faster initial HMR
    warmup: {
      clientFiles: ['./src/app.js', './src/main.css', './index.html'],
    },
  },

  // Inject version as global constant
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },

  build: {
    // Vite 7 target: Baseline Widely Available (Chrome 107+, Edge 107+, Firefox 104+, Safari 16+)
    target: 'baseline-widely-available',

    // Rolldown (Vite 7 experimental):
    // To use Rolldown instead of Rollup/esbuild for 5-10x faster builds:
    // 1. npm install rolldown-vite (or bun add rolldown-vite)
    // 2. Replace 'vite' with 'rolldown-vite' in package.json
    // 3. No config changes needed - drop-in replacement
    // See: https://rolldown.rs/

    cssCodeSplit: false, // Single CSS file for better caching on small sites
    cssMinify: 'lightningcss', // Vite 7: Lightning CSS (faster than esbuild for CSS)
    minify: 'esbuild', // esbuild for JS (20-40x faster than terser)
    modulePreload: { polyfill: false }, // Not needed for modern browsers
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64

    rollupOptions: {
      input: {
        main: '/index.html',
        404: '/404.html',
      },
      output: {
        manualChunks: undefined, // No chunking for small sites
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    reportCompressedSize: 'gzip', // Report gzipped sizes
    chunkSizeWarningLimit: 150, // Warn if chunk > 150KB
  },
});
