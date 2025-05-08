const { exec } = require('child_process')

const PROJECT_DIR = process.argv[2] || process.env.EVAL_PROJECT_ROOT || 'src'

const child = exec(`cd ${PROJECT_DIR} && npx ng build`, {
  env: {
    ...process.env,
  },
})

child.stdout.on('data', (data) => {
  process.stdout.write(data.toString())
})
child.stderr.on('data', (data) => {
  process.stderr.write(data.toString())
})

child.on('error', (error) => {
  throw error
})

child.on('close', (code) => {
  process.exit(code)
})
