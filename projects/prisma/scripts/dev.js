const { execSync } = require('child_process')
const path = require('path')

const PROJECT_DIR = process.argv[2] || 'src'
const PORT = process.argv[3] || 3005

const envs = {
  ...process.env,
}

try {
  if (!process.env.TEST) {
    execSync(`npx next dev ${PROJECT_DIR} -p ${PORT}`, {
      stdio: 'inherit',
      env: envs,
    })
  } else {
    // EVAL will run build previously
    if (!process.env.EVAL) {
      execSync(`node ${path.join(__dirname, 'build.js')} ${PROJECT_DIR}`, {
        stdio: 'inherit',
        env: envs,
      })
    }
    execSync(`npx next start ${PROJECT_DIR} -p ${PORT}`, {
      stdio: 'inherit',
      env: envs,
    })
  }
} catch (error) {
  console.error('Error running:', error)
  process.exit(1)
}
