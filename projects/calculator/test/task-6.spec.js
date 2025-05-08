const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('π sin', async ({ page }) => {
  await expect(page.locator('button:text("π") + button:text("sin")')).toBeVisible()
})

test('1/x π', async ({ page }) => {
  await expect(page.locator('button:text("1/x") + button:text("π")')).toBeVisible()
})