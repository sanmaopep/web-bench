const { test, expect } = require('@playwright/test')
const path = require('node:path')
const fs = require('node:fs/promises')
const { globSync } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`png file in output directory should be compressed`, async ({ page }) => {
  const srcPngFiles = globSync(['src/**/*.png'], {
    cwd,
    absolute: true,
  })

  const distPngFiles = globSync(['dist/**/*.png'], {
    cwd,
    absolute: true,
  })

  const distPngSize = (await fs.readFile(distPngFiles[0])).buffer.byteLength
  const originalPngSize = (await fs.readFile(srcPngFiles[0])).buffer.byteLength

  expect(distPngSize).toBeLessThan(originalPngSize)
})