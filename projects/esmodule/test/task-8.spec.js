import { test, expect } from '@playwright/test'
import path from 'path'
import { isExisted } from '@web-bench/test-util'

const srcPath = path.join(import.meta.dirname, '../src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('util/log.js', async ({ page }) => {
  await expect(isExisted('modules/util/log.js', srcPath)).toBeTruthy()
})

test('util/math.js', async ({ page }) => {
  await expect(isExisted('modules/util/math.js', srcPath)).toBeTruthy()
})

test('util/lang.js', async ({ page }) => {
  await expect(isExisted('modules/util/lang.js', srcPath)).toBeTruthy()
})
