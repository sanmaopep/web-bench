const { test, expect } = require('@playwright/test')
const { expectTolerance, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()
})

test('press Escape', async ({ page }) => {
  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(5)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})

test('jump to planet again', async ({ page }) => {
  await page.keyboard.press('Escape')

  const offset = await getOffsetByLocator(page.locator('.earth'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.earth').click()

  await expect(page.locator('.star')).toHaveCount(0)
  await expect(page.locator('.planet')).toHaveCount(1)
  await expect(page.locator('.satellite')).toHaveCount(1)

  await page.keyboard.press('Escape')
  await expect(page.locator('.star')).toHaveCount(1)
  await expect(page.locator('.planet')).toHaveCount(8)
  await expect(page.locator('.satellite')).toHaveCount(0)
})
