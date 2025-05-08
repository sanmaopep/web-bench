const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('system', async ({ page }) => {
  await expect(page.locator('svg.system')).toBeAttached()
})

test('system viewBox', async ({ page }) => {
  await expect(page.locator('.system')).toHaveAttribute('viewBox', '0 0 160 160')
})

test('systemDefs', async ({ page }) => {
  await expect(page.locator('.system #systemDefs')).toBeAttached()
})

test('systemRoot', async ({ page }) => {
  await expect(page.locator('.system #systemRoot')).toBeAttached()
})
