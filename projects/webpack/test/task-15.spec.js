const { test, expect } = require('@playwright/test')

test(`Mock dev server should work`, async ({ page }) => {
  await page.goto(`/index.html`)
  await expect(page.getByText('hello mock')).toBeVisible()
})