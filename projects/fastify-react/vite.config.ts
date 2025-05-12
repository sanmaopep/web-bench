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
