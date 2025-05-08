import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#shape1', async ({ page }) => {
  await expect(page.locator('#shape1')).toHaveText('0')
})

test('#rectangle1', async ({ page }) => {
  await expect(page.locator('#rectangle1')).toHaveText('6')
})
