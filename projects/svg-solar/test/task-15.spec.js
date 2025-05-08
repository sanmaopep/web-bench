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

test('tails | path or polyline', async ({ page }) => {
  const c1 = await page.locator('path.tail').count()
  const c2 = await page.locator('polyline.tail').count()
  await expect(c1 + c2).toBe(8)
})

test('tails | star-planets ', async ({ page }) => {
  await expect(page.locator('.tail')).toHaveCount(8)
  const tail = page.locator('.tail').nth(2)
  await expect(tail).toBeVisible()
})

test('tails | planet-satellites ', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('.tail')).toHaveCount(5)
  const tail = page.locator('.tail').nth(2)
  await expect(tail).toBeVisible()
})
