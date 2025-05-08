const { test, expect } = require('@playwright/test')
const fs = require('node:fs')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`Browser compatibility`, async ({ page }) => {
  const files = globSync(
    ['dist/**/*.js'],
    {
      cwd,
      absolute: true,
    }
  )

  expect(
    files.some(file => fs.readFileSync(file, 'utf8').includes('?.field'))
  ).toBe(true)
})