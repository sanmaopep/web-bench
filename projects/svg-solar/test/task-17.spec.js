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

test('orbitEnabled checkbox', async ({ page }) => {
  await expect(page.locator('#orbitEnabled')).toBeVisible()
  await expect(page.locator('#orbitEnabled:checked')).toBeVisible()

  await expect(page.locator('.orbit').nth(0)).toBeVisible()
  await page.locator('#orbitEnabled').uncheck()
  await expect(page.locator('.orbit').nth(0)).not.toBeVisible()
})

test('orbits | planet-satellites ', async ({ page }) => {
  await expect(page.locator('#orbitEnabled:checked')).toBeVisible()
  await page.locator('#orbitEnabled').uncheck()
  await expect(page.locator('#orbitEnabled:checked')).not.toBeVisible()

  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('.orbit').nth(2)).not.toBeVisible()
  await page.locator('#orbitEnabled').check()
  await expect(page.locator('.orbit').nth(2)).toBeVisible()
})

test('orbits | planet-satellites | star-planets ', async ({ page }) => {
  await page.locator('#orbitEnabled').uncheck()
  
  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  await expect(page.locator('.orbit').nth(2)).not.toBeVisible()
  await page.locator('#orbitEnabled').check()
  await expect(page.locator('.orbit').nth(2)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.locator('.orbit').nth(2)).toBeVisible()
  await page.locator('#orbitEnabled').uncheck()
  await expect(page.locator('.orbit').nth(2)).not.toBeVisible()
})
