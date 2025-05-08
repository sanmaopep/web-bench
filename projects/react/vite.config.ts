import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PROJECT_DIR = process.env.EVAL_PROJECT_ROOT || 'src'
const PORT = process.env.EVAL_PROJECT_PORT || 3211

// https://vite.dev/config/
export default defineConfig({
  root: PROJECT_DIR,
  server: {
    port: +PORT,
    host: 'localhost',
    watch: process.env.EVAL ? null : undefined,
  },
  build: {
    rollupOptions: {
      input: PROJECT_DIR + '/index.html',
    },
  },
  plugins: [react()],
})
