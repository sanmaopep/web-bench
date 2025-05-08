const { exec } = require('child_process')

const PROJECT_DIR = process.argv[2] || 'src'
const PORT = process.argv[3] || 3005

const DB_HOST = PROJECT_DIR + '/test.sqlite'
const ROOT_FILE = PROJECT_DIR + '/index.js'

const child = exec(`node ${ROOT_FILE}`, {
  env: {
    ...process.env,
    PORT,
    DB_HOST: DB_HOST,
  },
})

child.stdout.on('data', (data) => {
  process.stdout.write(data.toString())
})
child.stderr.on('data', (data) => {
  process.stderr.write(data.toString())
})

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`)
})
