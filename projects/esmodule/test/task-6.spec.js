import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#global1', async ({ page }) => {
  await expect(page.locator('#global1')).toHaveText('celsius')
})
