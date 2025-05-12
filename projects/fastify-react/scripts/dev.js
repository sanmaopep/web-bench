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

const { execSync } = require('child_process')
const path = require('path')

const PROJECT_DIR = process.argv[2] || 'src'
const PORT = process.argv[3] || 3005

const DB_HOST = path.join(PROJECT_DIR, 'test.sqlite')
const ROOT_FILE = path.join(PROJECT_DIR, 'index.ts')

execSync(`npx vite build`, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PROJECT_DIR,
  },
})

execSync(`npx tsx ${ROOT_FILE}`, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT,
    DB_HOST,
  },
})
