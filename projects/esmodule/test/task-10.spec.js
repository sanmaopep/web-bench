import { test, expect } from '@playwright/test'
import path from 'path'
import { isExisted } from '@web-bench/test-util'

const srcPath = path.join(import.meta.dirname, '../src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('config.json', async ({ page }) => {
  await expect(isExisted('modules/resource/config.json', srcPath)).toBeTruthy()
})

test('import config.json', async ({ page }) => {
  await expect(page.locator('#config')).toHaveText('{"version":1}')
})
