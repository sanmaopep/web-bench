import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('log()', async ({ page }) => {
  await expect(page.locator('#log')).toHaveText('hello esmodule')
})
