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
