const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROJECT_DIR = process.argv[2] || process.env.EVAL_PROJECT_ROOT || 'src'

const envs = {
  ...process.env,
}
// remove .next cache
if (fs.existsSync(path.join(PROJECT_DIR, '.next'))) {
  fs.rmSync(path.join(PROJECT_DIR, '.next'), { recursive: true })
}

// Generate Prisma client
if (fs.existsSync(path.join(PROJECT_DIR, 'generated'))) {
  fs.rmSync(path.join(PROJECT_DIR, 'generated'), { recursive: true })
}
execSync(`npx prisma generate --schema ${path.join(PROJECT_DIR, 'prisma/schema.prisma')}`, {
  stdio: 'inherit',
})

// Push Prisma client to DB
const DB_PATH = path.join(PROJECT_DIR, 'test.sqlite')
if (fs.existsSync(DB_PATH) && process.env.TEST) {
  fs.rmSync(DB_PATH)
}
execSync(`npx prisma db push --schema ${path.join(PROJECT_DIR, 'prisma/schema.prisma')}`, {
  stdio: 'inherit',
})

// Run Prisma seed
execSync(`npx node ${path.join(PROJECT_DIR, 'prisma/seed.js')}`, {
  stdio: 'inherit',
})

execSync(`npx next build ${PROJECT_DIR} --experimental-build-mode compile`, {
  stdio: 'inherit',
  env: envs,
})
