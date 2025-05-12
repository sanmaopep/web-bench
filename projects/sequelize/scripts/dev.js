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

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const execAsync = (...args) =>
  new Promise((resolve, reject) => {
    const child = exec(...args)

    child.stdout.on('data', (data) => {
      process.stdout.write(data.toString())
    })
    child.stderr.on('data', (data) => {
      process.stderr.write(data.toString())
    })

    child.on('close', (code) => {
      console.log(`Child process exited with code ${code}`)
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Process exited with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })

;(async () => {
  const PROJECT_DIR = process.argv[2] || 'src'
  const PORT = process.argv[3] || 3005
  const DB_HOST = PROJECT_DIR + '/test.sqlite'

  let dbExists = fs.existsSync(DB_HOST)

  console.log('DB_HOST:', DB_HOST)

  if (dbExists && process.env.TEST) {
    fs.rmSync(DB_HOST)
    dbExists = false
  }

  const envs = {
    ...process.env,
    DB_HOST,
  }

  const canBuild = () => {
    const layoutExists = fs.existsSync(path.join(PROJECT_DIR, 'app/layout.tsx'))
    return layoutExists
  }

  try {
    if (!process.env.TEST || process.env.EVAL) {
      // In eval task 1, we will run `npx next build`, it will fails because layout.tsx is not exists
      await execAsync(`npx next dev ${PROJECT_DIR} -p ${PORT}`, {
        env: envs,
      })
    } else {
      await execAsync(`npx next build ${PROJECT_DIR}`, {
        env: envs,
      })
      await execAsync(`npx next start ${PROJECT_DIR} -p ${PORT}`, {
        env: envs,
      })
    }
  } catch (error) {
    console.error('Error running:', error)
    process.exit(1)
  }
})()
