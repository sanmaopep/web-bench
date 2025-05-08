const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_DIR = process.argv[2] || 'src'
const DB_HOST = PROJECT_DIR + '/test.sqlite'

const PORT = process.env.PORT || '3005'

const envs = {
  ...process.env,
  DB_HOST: DB_HOST,
}

if (!process.env.TEST || process.env.EVAL) {
  // In eval task 1, we will run `npx next build`, it will fails because layout.tsx is not exists
  execSync(`npx next dev ${PROJECT_DIR} -p ${PORT}`, { stdio: 'inherit', env: envs })
} else {
  execSync(`npx next build ${PROJECT_DIR}`, { stdio: 'inherit', env: envs })
  execSync(`npx next start ${PROJECT_DIR} -p ${PORT}`, {
    stdio: 'inherit',
    env: envs,
  })
}
