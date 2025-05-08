import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#cube1', async ({ page }) => {
  await expect(page.locator('#cube1')).toHaveText('8')
})

test('#cube2', async ({ page }) => {
  await expect(page.locator('#cube2')).toHaveText('8')
})
