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
