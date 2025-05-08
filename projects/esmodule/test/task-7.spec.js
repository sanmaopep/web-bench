import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#langs', async ({ page }) => {
  await expect(page.locator('#langs')).toHaveText('en,zh,fr')
})
