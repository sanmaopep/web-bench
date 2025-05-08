const path = require('node:path')
const { test, expect } = require('@playwright/test')
const { execa } = require('execa')
const fs = require('node:fs')
const { glob } = require('tinyglobby')

const cwd = process.env.EVAL_PROJECT_ROOT

test(`dev and build should be added in scripts`, async () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, `package.json`), 'utf8'))
  expect(pkg.scripts.dev).toBeDefined()
  expect(pkg.scripts.build).toBeDefined()
})

test(`build should work`, async () => {
  await execa({ cwd })`npm run build`

  expect(() => {
    fs.readFileSync(path.join(cwd, `dist/index.html`))
  }).not.toThrowError()

  // public path
  const indexHTML = fs.readFileSync(path.join(cwd, `dist/index.html`), 'utf8')
  expect(indexHTML).toContain('src="./')
})

test(`dev should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.locator('#app')).toBeDefined()
})

test(`expose to LAN`, async ({ page }) => {
  await page.goto(`http://0.0.0.0:${process.env.EVAL_PROJECT_PORT}/index.html`)

  await expect(page.getByText('hello world').first()).toBeVisible()
})