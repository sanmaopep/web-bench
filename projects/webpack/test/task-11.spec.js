const { test, expect } = require('@playwright/test')
const path = require('node:path')
const fs = require('node:fs')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`*.map should be moved to sourcemaps`, async ({ page }) => {
  const distMaps = globSync(
    ['dist/**/*.map'],
    {
      cwd,
    }
  )
  expect(distMaps.length).toBe(0)

  const movedMaps = globSync(
    ['sourcemaps/**/*.map'],
    {
      cwd,
    }
  )
  expect(movedMaps.length).toBeGreaterThan(0)

  const files = globSync(
    ['dist/**/*.js'],
    {
      cwd,
      absolute: true,
    }
  )
  expect(
    files.every(file => {
      return fs.readFileSync(file, 'utf8')
        .includes(`https://internal.com/sourcemaps/${path.relative(path.join(cwd, 'dist'), file)}.map`)
    })
  ).toBe(true)
})