const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolkit', async ({ page }) => {
  await expect(page.locator('.toolkit')).toBeAttached()
})

test('.canvas', async ({ page }) => {
  await expect(page.locator('svg.canvas')).toBeAttached()
})

test('.shape', async ({ page }) => {
  await expect(page.locator('.toolkit .shape')).toBeAttached()
})

test('.operation', async ({ page }) => {
  await expect(page.locator('.toolkit .operation')).toBeAttached()
})

test('.prop', async ({ page }) => {
  await expect(page.locator('.toolkit .prop')).toBeAttached()
})

test('.line-width', async ({ page }) => {
  await expect(page.locator('.prop .line-width')).toBeVisible()
  await expect(page.locator('.line-width')).toHaveValue('9')
  await expect(page.locator('.line-width')).toHaveAttribute('max', '21')
  await expect(page.locator('.line-width')).toHaveAttribute('min', '1')
})

test('.color', async ({ page }) => {
  await expect(page.locator('.prop .color')).toBeVisible()
  await expect(page.locator('.color')).toHaveValue('#000000')
})