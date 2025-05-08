const { execSync } = require('child_process')

const PROJECT_DIR = process.argv[2] || 'src'
const PORT = process.argv[3] || 3005

const DB_HOST = PROJECT_DIR + '/test.sqlite'
const ROOT_FILE = PROJECT_DIR + '/index.ts'

execSync(`npx tsx ${ROOT_FILE}`, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT,
    DB_HOST,
  },
})
