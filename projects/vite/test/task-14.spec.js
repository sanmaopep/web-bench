const { test, expect } = require('@playwright/test')

test(`virtual modules should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText(`"files/foo"`)).toBeVisible()
  await expect(page.getByText(`"files/bar"`)).toBeVisible()
})