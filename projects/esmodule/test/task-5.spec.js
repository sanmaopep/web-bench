import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#circle1', async ({ page }) => {
  await expect(page.locator('#circle1')).toHaveText('3.1415926')
})

test('#circle2', async ({ page }) => {
  await expect(page.locator('#circle2')).toHaveText('12.5663704')
})
