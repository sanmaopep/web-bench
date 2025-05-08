const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolkit shapes', async ({ page }) => {
  await expect(page.locator('.toolkit .line')).toBeVisible()
  await expect(page.locator('.toolkit .rect')).toBeVisible()
  await expect(page.locator('.toolkit .ellipse')).toBeVisible()
})

test('.toolkit operations', async ({ page }) => {
  await expect(page.locator('.toolkit .move')).toBeVisible()
  await expect(page.locator('.toolkit .rotate')).toBeVisible()
  await expect(page.locator('.toolkit .zoom')).toBeVisible()
  await expect(page.locator('.toolkit .copy')).toBeVisible()
  await expect(page.locator('.toolkit .delete')).toBeVisible()
  await expect(page.locator('.toolkit .fill')).toBeVisible()
})

test('.toolkit check', async ({ page }) => {
  // await expect(page.locator('input[name="operation"]:checked')).not.toBeAttached()

  await page.locator('.rect').click()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('rect')

  await page.locator('.rotate').click()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('rotate')
})
