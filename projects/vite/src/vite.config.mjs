// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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