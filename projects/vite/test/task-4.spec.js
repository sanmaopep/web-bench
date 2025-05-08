const { test, expect } = require('@playwright/test')

test(`SPA fallback should work`, async ({ page }) => {
  await page.goto('/other')

  await expect(page.getByText('hello').first()).toBeVisible()
})