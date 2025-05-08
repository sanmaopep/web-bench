import { defineConfig, PluginOption } from 'vite'

function htmlScriptInject(): PluginOption {
  return {
    name: 'html-script-inject',
    transformIndexHtml: {
      order: 'pre',
      transform(html: string) {
        const index = html.lastIndexOf('<script')
        const injectCode = `
          <script type="module">
            import * as THREE from 'three'
            window.THREE = THREE;
          </script>
        `
        const result = html.slice(0, index) + injectCode + html.slice(index)
        return result
      },
    },
  }
}

const PROJECT_DIR = process.env.EVAL_PROJECT_ROOT || './src'
const PORT = process.env.EVAL_PROJECT_PORT || 3211

export default defineConfig({
  root: PROJECT_DIR,
  server: {
    port: +PORT,
    host: 'localhost',
    watch: process.env.EVAL ? null : undefined,
  },
  build: {
    // chunk size warning 提示改为 1M
    chunkSizeWarningLimit: 1024,
  },
  plugins: [htmlScriptInject()],
})
