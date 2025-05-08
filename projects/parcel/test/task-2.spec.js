const { test, expect } = require('@playwright/test')

test(`Should path alias work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello alias')).toBeVisible()
})