import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('data/*.json', async ({ page }) => {
  await expect(isExisted('modules/data/zh.json', srcPath)).toBeTruthy()
  await expect(isExisted('modules/data/fr.json', srcPath)).toBeTruthy()
  await expect(isExisted('modules/data/en.json', srcPath)).toBeTruthy()
})

test('import all data', async ({ page }) => {
  const data = JSON.parse((await page.locator('#data').textContent()) ?? '{}')
  await expect(data).toEqual({ en: 1, fr: 1, zh: 1 })
})
