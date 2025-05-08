const { exec } = require('child_process')

const PROJECT_DIR = process.argv[2] || process.env.EVAL_PROJECT_ROOT || 'src'
const PORT = process.env.EVAL_PROJECT_PORT || 3005

const child = exec(`cd ${PROJECT_DIR} && npx ng serve --port ${PORT}`, {
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

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
  process.exit(code)
})
