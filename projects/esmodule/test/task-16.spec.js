import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('importmap', async ({ page }) => {
  await expect(page.locator('script[type="importmap"]')).toBeAttached()
})

test('#shape2', async ({ page }) => {
  await expect(page.locator('#shape2')).toHaveText('0')
})
