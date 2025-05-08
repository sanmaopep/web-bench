import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import path from 'path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('files', async ({ page }) => {
  const __dirname = import.meta.dirname
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/data.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/res.svg', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/config.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/LineChart.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

// test('viewport', async ({ page }) => {
//   const viewport = await getViewport(page)
//   // await expect(viewport).toEqual({ width: 1280, height: 1280 })
//   await expect(viewport.width).toEqual(viewport.height)
// })
