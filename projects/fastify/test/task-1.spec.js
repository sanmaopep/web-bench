const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check HomePage', async ({ page }) => {
  await expect(page.getByText('Welcome to Shopping Mart')).toBeVisible()
})

test('Check LoginPage', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByText('💡 Please Login First')).toBeVisible()
})
