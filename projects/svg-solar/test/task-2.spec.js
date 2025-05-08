const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('data', async ({ page }) => {
  await expect(starData).toMatchObject({ r: 8, color: '#ffff00' })
})

test('sun', async ({ page }) => {
  await expect(page.locator('circle.sun')).toBeVisible()
})

test('sun attributes', async ({ page }) => {
  await expect(page.locator('.sun')).toHaveAttribute('r', `${starData.r}`)
  await expect(page.locator('.sun')).toHaveAttribute('fill', starData.color)
})

test('sun layout', async ({ page }) => {
  const offset = await getOffsetByLocator(page.locator('.sun'))
  await expect(offset).toMatchObject({ centerX: 80 * density, centerY: 80 * density })
})
