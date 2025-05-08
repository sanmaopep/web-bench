const { test, expect } = require('@playwright/test')

test(`import .md should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('markdown')).toBeVisible()
})