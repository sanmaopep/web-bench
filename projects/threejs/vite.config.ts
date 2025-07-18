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
    // Change chunk size warning prompt to 1M
    chunkSizeWarningLimit: 1024,
  },
  plugins: [htmlScriptInject()],
})
