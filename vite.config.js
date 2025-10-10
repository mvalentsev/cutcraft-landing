import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';
import { copyFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Get git commit hash and build version for cache busting
 * Format: v{version} ({hash}) • {date}
 * Version is read from package.json (DRY principle)
 */
function getVersion() {
  // Read version from package.json
  const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
  const version = packageJson.version;

  try {
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const date = new Date().toISOString().split('T')[0];
    return `v${version} (${commitHash}) • ${date}`;
  } catch {
    // Fallback if git is not available (e.g., in CI without git history)
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
    // GitHub Pages plugin - copy .nojekyll to dist
    {
      name: 'github-pages-setup',
      closeBundle() {
        const nojekyllPath = resolve(__dirname, 'public', '.nojekyll');
        const distPath = resolve(__dirname, 'dist', '.nojekyll');
        try {
          copyFileSync(nojekyllPath, distPath);
          console.log('✅ Copied .nojekyll to dist/');
        } catch (error) {
          console.warn('⚠️  Could not copy .nojekyll:', error.message);
        }
      },
    },
  ],

  // Development server optimization (Vite 7.0+)
  server: {
    // Warmup frequently used files for faster HMR
    warmup: {
      clientFiles: ['./src/app.js', './src/main.css'],
    },
  },

  // Inject version as global constant
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },

  build: {
    // Vite 7.0+ default target: Baseline Widely Available (2025-05-01)
    // Targets: Chrome 107+, Edge 107+, Firefox 104+, Safari 16+
    target: 'baseline-widely-available',

    // Disable CSS code splitting for small sites (better caching)
    cssCodeSplit: false,

    // Modern 2025 Vite 7: Lightning CSS for minification (faster than esbuild for CSS)
    cssMinify: 'lightningcss',

    // Modern 2025: Minification with esbuild for JS (20-40x faster than terser)
    minify: 'esbuild',

    // Disable modulePreload polyfill (not needed for modern browsers)
    modulePreload: {
      polyfill: false,
    },

    // Modern 2025: Asset inlining threshold (inline assets < 4KB)
    assetsInlineLimit: 4096, // 4KB threshold for base64 inline

    // Multiple entry points for proper routing
    rollupOptions: {
      input: {
        main: '/index.html',
        404: '/404.html',
      },
      output: {
        // Manual chunks for better caching (small site: no chunking needed)
        manualChunks: undefined,
        // Asset naming with hash for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    // Report compressed size with gzip (Vite 7+)
    reportCompressedSize: 'gzip',

    // Strict chunk size limit for landing page (150 KB = realistic for small sites)
    chunkSizeWarningLimit: 150,
  },
});
