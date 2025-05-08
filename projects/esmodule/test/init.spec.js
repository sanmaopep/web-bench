import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.log', async ({ page }) => {
  await expect(page.locator('.log')).toBeAttached()
})
