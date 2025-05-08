const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})
