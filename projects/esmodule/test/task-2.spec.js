import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('import all math exports #PI', async ({ page }) => {
  await expect(page.locator('#PI')).toHaveText('3.1415926')
})

test('import all math exports #square', async ({ page }) => {
  await expect(page.locator('#square')).toHaveText('4')
})

