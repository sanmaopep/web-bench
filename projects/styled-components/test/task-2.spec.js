const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')
const { checkExists } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Header Footer Main File', async () => {
  checkExists('components/Header.tsx')
  checkExists('components/Footer.tsx')
  checkExists('components/Main.tsx')
})

test('Check Header aligned to top', async ({ page }) => {
  const offset = await getOffset(page, '.site-header')
  expect(offset.top).toEqual(0)
  expect(offset.left).toEqual(0)
})

test('Check Footer aligned to bottom', async ({ page }) => {
  const viewportSize = page.viewportSize()
  const offset = await getOffset(page, '.site-footer')

  expect(offset.bottom).toEqual(viewportSize.height)
  expect(offset.left).toEqual(0)
})

test('Check Header Text', async ({ page }) => {
  await expect(page.locator('.site-header')).toContainText('Hello Blog')
})

test('Check Main Text', async ({ page }) => {
  await expect(page.locator('.site-main')).toContainText('Welcome to Blog System')
})
