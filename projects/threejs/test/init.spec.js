const { test, expect } = require('@playwright/test')
const { getOffset, getViewport } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()

  await expect(page.locator('#root')).toBeAttached()
})