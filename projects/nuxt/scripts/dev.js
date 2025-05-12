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

const { exec, execSync } = require('child_process')

const PROJECT_DIR = process.argv[2] || 'src'

const DB_HOST = PROJECT_DIR + '/test.sqlite'

const PORT = process.env.PORT || '3005'

const envs = {
  ...process.env,
  PORT,
  DB_HOST,
}

if (!process.env.TEST) {
  execSync(`npx nuxt dev ${PROJECT_DIR} --port ${PORT}`, {
    stdio: 'inherit',
    env: envs,
  })
} else {
  execSync(`npx nuxt build ${PROJECT_DIR}`, { stdio: 'inherit', env: envs })
  execSync(`node ${PROJECT_DIR}/.output/server/index.mjs`, {
    stdio: 'inherit',
    env: envs,
  })
}
