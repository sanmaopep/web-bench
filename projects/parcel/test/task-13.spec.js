const { test, expect } = require('@playwright/test')
const path = require('node:path')
const fs = require('node:fs')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`vendor-licenses.txt should be generated`, async ({ page }) => {
  expect(() => {
    fs.readFileSync(path.join(cwd, `dist/vendor-licenses.txt`), 'utf8')
  }).not.toThrowError()

  const code = fs.readFileSync(path.join(cwd, `dist/vendor-licenses.txt`), 'utf8')

  expect(code).toContain('react-dom')
  expect(code).toContain('vue')
})