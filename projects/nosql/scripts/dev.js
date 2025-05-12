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

const { MongoMemoryServer } = require('mongodb-memory-server')

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
  const MONGO_FILE_DIR = PROJECT_DIR + '/.mongo'

  let mongoExists = fs.existsSync(MONGO_FILE_DIR)

  if (mongoExists && process.env.TEST) {
    // When in Test, force recreate the Mongo File Dir
    fs.rmSync(MONGO_FILE_DIR, { recursive: true })
    mongoExists = false
  }

  // create Mongo File Dir using fs
  if (!mongoExists) {
    console.log(`MongoDB FILE_DIR ${MONGO_FILE_DIR} not exists, create it.`)
    fs.mkdirSync(MONGO_FILE_DIR)
  }

  const mongod = await MongoMemoryServer.create({
    instance: {
      dbPath: MONGO_FILE_DIR,
    },
  })

  const MONGO_URI = mongod.getUri()
  console.log(`MongoDB URI: ${MONGO_URI} (${MONGO_FILE_DIR});`)

  try {
    await execAsync(`npx next dev ${PROJECT_DIR} -p ${PORT}`, {
      env: {
        ...process.env,
        MONGO_URI,
      },
    })
  } catch (error) {
    console.error('Error running:', error)
    process.exit(1)
  } finally {
    await mongod.stop()
  }
})()
