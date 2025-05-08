const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('clear button has 3 columns', async ({ page }) => {
  await expect(page.locator('button[style*="grid-column: span 3"]')).toBeVisible()
})
