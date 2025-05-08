import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import sourceMapMover from './plugins/sourcemap-mover.mjs'
import licenseExtractor from './plugins/license-extractor.mjs'
import virtualFiles from './plugins/virtual-files.mjs'
import mock from './plugins/mock.mjs'
import imagemin from './plugins/imagemin.mjs'
import markdown from './plugins/markdown.mjs'
import removeConsoleLog from './plugins/remove-console-log.mjs'

export default defineConfig({
  server: {
    port: process.env.PROJECT_PORT,
    host: true,  
    historyApiFallback: true,
    proxy: {
      '/postman': {
        target: 'https://postman-echo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/postman/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: '.',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]'
      }
    },
    target: 'es2020'
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') 
    }
  },
  define: {
    __VERSION__: JSON.stringify('v1.0.0')
  },
  assetsInclude: ['**/*.png', '**/*.svg'],
  plugins: [
    vue(),
    react(),
    sourceMapMover(),
    licenseExtractor(),
    virtualFiles(),
    mock(),
    imagemin(),
    removeConsoleLog(),
    markdown({
      language: 'zh'
    }),
  ]
})