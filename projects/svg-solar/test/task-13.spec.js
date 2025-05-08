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

test('detailPanel | click planet', async ({ page }) => {
  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/earth/i)

  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)

  await detail.getByText('earth').click()
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})

test('detailPanel | click satellite', async ({ page }) => {
  const detail = page.locator('#detailPanel')
  await expect(detail).toContainText(/earth/i)

  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)

  await detail.getByText('earth').click()
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(1)

  await detail.getByText('moon').click()
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})
