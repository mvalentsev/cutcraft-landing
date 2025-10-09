import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

// Get git hash and version for debugging
function getVersion() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    const date = new Date().toISOString().split('T')[0]
    return `v2.0.0 (${commitHash}) • ${date}`
  } catch (error) {
    const date = new Date().toISOString().split('T')[0]
    return `v2.0.0 • ${date}`
  }
}

const version = getVersion()

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    // Inject version for console.log or HTML footer
    __APP_VERSION__: JSON.stringify(version),
  },
})
