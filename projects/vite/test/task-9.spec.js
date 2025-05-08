const { test, expect } = require('@playwright/test')

test(`import ts should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello ts')).toBeVisible()
})