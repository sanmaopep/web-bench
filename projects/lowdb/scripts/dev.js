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

const DB_PATH = path.join(PROJECT_DIR, 'db.json')

const envs = {
  ...process.env,
  DB_PATH,
}

try {
  if (!process.env.TEST) {
    execSync(`npx next dev ${PROJECT_DIR} -p ${PORT}`, {
      stdio: 'inherit',
      env: envs,
    })
  } else {
    // EVAL will run build previously
    if (!process.env.EVAL) {
      execSync(`node ${path.join(__dirname, 'build.js')} ${PROJECT_DIR}`, {
        stdio: 'inherit',
        env: envs,
      })
    }
    execSync(`npx next start ${PROJECT_DIR} -p ${PORT}`, {
      stdio: 'inherit',
      env: envs,
    })
  }
} catch (error) {
  console.error('Error running:', error)
  process.exit(1)
}
