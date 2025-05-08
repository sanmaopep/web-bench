const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('toggle button position', async ({ page }) => {
  const text = await page.locator('button#toggle').textContent()
  await expect(text?.toLowerCase() === 'light').toBeTruthy()
})
