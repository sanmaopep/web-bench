import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const PROJECT_DIR = process.env.PROJECT_DIR || process.env.EVAL_PROJECT_ROOT || path.join(__dirname, 'src')
const CLIENT_DIR = path.join(PROJECT_DIR, 'client')

// https://vite.dev/config/
export default defineConfig({
  root: CLIENT_DIR,
  build: {
    outDir: '../public',
    rollupOptions: {
      input: CLIENT_DIR + '/index.html',
    },
    emptyOutDir: true,
  },
  plugins: [react()],
})
