const { test, expect } = require('@playwright/test')

test(`proxy should work`, async ({ page }) => {
  await page.goto('/index.html')

  await expect(page.getByText('hello proxy')).toBeVisible()
})