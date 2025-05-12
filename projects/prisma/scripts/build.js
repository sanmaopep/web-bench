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
const fs = require('fs')
const path = require('path')

const PROJECT_DIR = process.argv[2] || process.env.EVAL_PROJECT_ROOT || 'src'

const envs = {
  ...process.env,
}
// remove .next cache
if (fs.existsSync(path.join(PROJECT_DIR, '.next'))) {
  fs.rmSync(path.join(PROJECT_DIR, '.next'), { recursive: true })
}

// Generate Prisma client
if (fs.existsSync(path.join(PROJECT_DIR, 'generated'))) {
  fs.rmSync(path.join(PROJECT_DIR, 'generated'), { recursive: true })
}
execSync(`npx prisma generate --schema ${path.join(PROJECT_DIR, 'prisma/schema.prisma')}`, {
  stdio: 'inherit',
})

// Push Prisma client to DB
const DB_PATH = path.join(PROJECT_DIR, 'test.sqlite')
if (fs.existsSync(DB_PATH) && process.env.TEST) {
  fs.rmSync(DB_PATH)
}
execSync(`npx prisma db push --schema ${path.join(PROJECT_DIR, 'prisma/schema.prisma')}`, {
  stdio: 'inherit',
})

// Run Prisma seed
execSync(`npx node ${path.join(PROJECT_DIR, 'prisma/seed.js')}`, {
  stdio: 'inherit',
})

execSync(`npx next build ${PROJECT_DIR} --experimental-build-mode compile`, {
  stdio: 'inherit',
  env: envs,
})
