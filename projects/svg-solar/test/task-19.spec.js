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

test('bg', async ({ page }) => {
  await expect(page.locator('image#bg')).toBeAttached()
  try {
    await expect(page.locator('image#bg')).toHaveAttribute('href', /assets\/bg\.png/i)
  } catch {
    await expect(page.locator('image#bg')).toHaveAttribute('xlink:href', /assets\/bg\.png/i)
  }
  await expect(page.locator('image#bg')).not.toBeVisible()
})

test('bgEnabled', async ({ page }) => {
  await expect(page.locator('input#bgEnabled')).toBeVisible()
  await expect(page.locator('#bgEnabled:checked')).not.toBeVisible()
  await page.locator('input#bgEnabled').check()
  await expect(page.locator('image#bg')).toBeVisible()
})
