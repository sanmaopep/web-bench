const { test, expect } = require('@playwright/test')
const { getBackgroundHexColor } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.site-header')
  const button = header.locator('button:has-text("Theme")')
  await button.click()
})

test('Check Header Theme Changed', async ({ page }) => {
  await page.locator('input.header-background').fill('#ff0000')
  expect(await getBackgroundHexColor(page.locator('header'))).toBe('#ff0000')

  await page.locator('input.header-background').fill('#00ff00')
  expect(await getBackgroundHexColor(page.locator('header'))).toBe('#00ff00')
})

test('Check Footer Theme Changed', async ({ page }) => {
  await page.locator('input.footer-background').fill('#ff0000')
  expect(await getBackgroundHexColor(page.locator('footer'))).toBe('#ff0000')

  await page.locator('input.footer-background').fill('#00ff00')
  expect(await getBackgroundHexColor(page.locator('footer'))).toBe('#00ff00')
})
