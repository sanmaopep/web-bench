const { test, expect } = require('@playwright/test')
const { isExisted, getViewport } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('files', async ({ page }) => {
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/config.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/System.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/data.json', path.join(__dirname, '../src'))).toBeTruthy()
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

test('viewport', async ({ page }) => {
  const viewport = await getViewport(page)
  // await expect(viewport).toEqual({ width: 1280, height: 1280 })
  await expect(viewport.width).toEqual(viewport.height)
})
