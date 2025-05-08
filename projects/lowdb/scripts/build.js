const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_DIR = process.argv[2] || process.env.EVAL_PROJECT_ROOT || 'src'
const DB_PATH = path.join(PROJECT_DIR, 'db.json')

const envs = {
  ...process.env,
}

if (fs.existsSync(path.join(PROJECT_DIR, '.next'))) {
  fs.rmSync(path.join(PROJECT_DIR, '.next'), { recursive: true })
}

if (fs.existsSync(DB_PATH)) {
  fs.rmSync(DB_PATH)
}

execSync(`npx next build ${PROJECT_DIR} --experimental-build-mode compile`, {
  stdio: 'inherit',
  env: envs,
})
