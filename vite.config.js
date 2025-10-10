import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { compression } from 'vite-plugin-compression2';
import { execSync } from 'child_process';

/**
 * Get git commit hash and build version for cache busting
 * Format: v2.0.0 (a1b2c3d) • 2025-10-09
 */
function getVersion() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const date = new Date().toISOString().split('T')[0];
    return `v2.0.0 (${commitHash}) • ${date}`;
  } catch {
    // Fallback if git is not available (e.g., in CI without git history)
    const date = new Date().toISOString().split('T')[0];
    return `v2.0.0 • ${date}`;
  }
}

const version = getVersion();

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Brotli compression (better than gzip, ~20% smaller)
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024, // Only compress files > 1KB
      deleteOriginalAssets: false,
    }),
    // Gzip compression (fallback for older servers)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
      deleteOriginalAssets: false,
    }),
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

    // Modern 2025: Minification with esbuild (20-40x faster than terser)
    minify: 'esbuild',

    // Modern 2025: Asset inlining threshold (inline assets < 4KB)
    assetsInlineLimit: 4096, // 4KB threshold for base64 inline

    // Module preload configuration
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps) => {
        // Preload all dependencies for critical paths
        return deps;
      },
    },

    // Multiple entry points for SPA routing
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

    // Report compressed size
    reportCompressedSize: true,

    // Increase chunk size warning limit (default: 500 KB)
    chunkSizeWarningLimit: 600,
  },
});
