const { test, expect } = require('@playwright/test')
const {
  expectTolerance,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('config panel', async ({ page }) => {
  await expect(page.locator('#configPanel')).toBeVisible()
})

test('tailEnabled checkbox', async ({ page }) => {
  await expect(page.locator('#tailEnabled')).toBeVisible()
  await expect(page.locator('#tailEnabled:checked')).toBeVisible()

  await expect(page.locator('.tail').nth(0)).toBeVisible()
  await page.locator('#tailEnabled').uncheck()
  await expect(page.locator('.tail').nth(0)).not.toBeVisible()
})

test('tails | planet-satellites ', async ({ page }) => {
  await expect(page.locator('#tailEnabled:checked')).toBeVisible()
  await page.locator('#tailEnabled').uncheck()
  await expect(page.locator('#tailEnabled:checked')).not.toBeVisible()

  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('.tail').nth(2)).not.toBeVisible()
  await page.locator('#tailEnabled').check()
  await expect(page.locator('.tail').nth(2)).toBeVisible()
})
