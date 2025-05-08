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
