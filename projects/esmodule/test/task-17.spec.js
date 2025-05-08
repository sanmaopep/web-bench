import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('importmap shape/', async ({ page }) => {
  const map = await page.locator('script[type="importmap"]').textContent()
  await expect(map?.includes('shape/')).toBeTruthy()
})

test('#shape3', async ({ page }) => {
  await expect(page.locator('#shape3')).toHaveText('0')
})
