import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

/**
 * Get git commit hash and build version for cache busting
 * Format: v2.0.0 (a1b2c3d) • 2025-10-09
 */
function getVersion() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    const date = new Date().toISOString().split('T')[0]
    return `v2.0.0 (${commitHash}) • ${date}`
  } catch (error) {
    // Fallback if git is not available (e.g., in CI without git history)
    const date = new Date().toISOString().split('T')[0]
    return `v2.0.0 • ${date}`
  }
}

const version = getVersion()

export default defineConfig({
  plugins: [tailwindcss()],

  // Inject version as global constant
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },

  build: {
    // Multiple entry points for SPA routing
    rollupOptions: {
      input: {
        main: '/index.html',
        404: '/404.html'
      }
    }
  }
})
