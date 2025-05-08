import { test, expect } from '@playwright/test'
import path from 'path'
import { isExisted } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('shape/index.js', async ({ page }) => {
  const srcPath = path.join(import.meta.dirname, '../src')
  await expect(isExisted('modules/shape/index.js', srcPath)).toBeTruthy()
})
