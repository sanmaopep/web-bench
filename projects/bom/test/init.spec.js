import { test, expect } from '@playwright/test'
import { getMarginBoxByLocator, getViewport, isExisted } from '@web-bench/test-util'
import path from 'node:path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('initial files', async ({ page }) => {
  await expect(isExisted('index.js', path.join(import.meta.dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.css', path.join(import.meta.dirname, '../src'))).toBeTruthy()
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.browser', async ({ page }) => {
  await expect(page.locator('.browser')).toBeAttached()
  const viewport = await getViewport(page)
  const browser = await getMarginBoxByLocator(page.locator('.browser'))
  await expect(browser.width).toBeCloseTo(viewport.width)
  await expect(browser.height).toBeCloseTo(viewport.height)
})
