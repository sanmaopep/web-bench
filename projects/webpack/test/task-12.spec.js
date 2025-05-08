const { test, expect } = require('@playwright/test')
const path = require('node:path')
const fs = require('node:fs')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`console.log should be removed`, async ({ page }) => {
  const files = globSync(
    ['dist/**/*.js'],
    {
      cwd,
      absolute: true,
    }
  )

  expect(
    files.every(file => !fs.readFileSync(file, 'utf8').includes('console.log'))
  ).toBe(true)
})