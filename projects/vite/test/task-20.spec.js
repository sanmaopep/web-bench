const { test, expect } = require('@playwright/test')

test(`language="zh" should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('你好 markdown')).toBeVisible()
})