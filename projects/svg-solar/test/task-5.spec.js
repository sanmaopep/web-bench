const { test, expect } = require('@playwright/test')
const { isExisted, expectTolerance, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('jupiter fill', async ({ page }) => {
  const jupiter = page.locator('.planet').nth(4)
  const gradient = page.locator('#gradient-jupiter')
  await expect(jupiter).toHaveAttribute('fill', /url\(#gradient-jupiter\)/i)
  await expect(gradient).toBeAttached()
  await expect(gradient.locator('stop')).toHaveCount(7)

  const stop0 = gradient.locator('stop').nth(0)
  await expect(stop0).toHaveAttribute('offset', '0%')
  await expect(stop0).toHaveAttribute('stop-color', '#9A9185')
  await expect(stop0).toHaveAttribute('stop-opacity', '1')
  const stop3 = gradient.locator('stop').nth(3)
  await expect(stop3).toHaveAttribute('offset', '50%')
  await expect(stop3).toHaveAttribute('stop-color', '#B7B6A6')
  await expect(stop3).toHaveAttribute('stop-opacity', '1')
})

test('saturn fill', async ({ page }) => {
  const saturn = page.locator('.planet').nth(5)
  const gradient = page.locator('#gradient-saturn')
  await expect(saturn).toHaveAttribute('fill', /url\(#gradient-saturn\)/i)
  await expect(gradient).toBeAttached()
  await expect(gradient.locator('stop')).toHaveCount(7)

  const stop0 = gradient.locator('stop').nth(0)
  await expect(stop0).toHaveAttribute('offset', '0%')
  await expect(stop0).toHaveAttribute('stop-color', '#6B6D60')
  await expect(stop0).toHaveAttribute('stop-opacity', '1')
  const stop3 = gradient.locator('stop').nth(6)
  await expect(stop3).toHaveAttribute('offset', '100%')
  await expect(stop3).toHaveAttribute('stop-color', '#6B6D60')
  await expect(stop3).toHaveAttribute('stop-opacity', '1')
})
