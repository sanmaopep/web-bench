const { test, expect } = require('@playwright/test')

test(`Should variable replacement work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello v1.0.0')).toBeVisible()
})