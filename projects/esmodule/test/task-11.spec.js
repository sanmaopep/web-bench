import { test, expect } from '@playwright/test'
import path from 'path'
import { isExisted } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('style.css', async ({ page }) => {
  const srcPath = path.join(import.meta.dirname, '../src')
  await expect(isExisted('modules/resource/style.css', srcPath)).toBeTruthy()
})

test('import style.css', async ({ page }) => {
  await expect(page.locator('#style')).toHaveText('.log')
})
