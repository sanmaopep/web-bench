import { test, expect } from '@playwright/test'
import { getBoxByLocator, getContentBoxByLocator, getMarginBoxByLocator, isExisted } from '@web-bench/test-util'
import path from 'node:path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolbar', async ({ page }) => {
  await expect(page.locator('.topbar .toolbar')).toBeAttached()
})

test('.address', async ({ page }) => {
  await expect(page.locator('.topbar select.address')).toBeAttached()
})

test('.setting', async ({ page }) => {
  await expect(page.locator('.topbar .setting')).toBeAttached()
})

// test('elements together fill .topbar', async ({ page }) => {
//   const topbar = await getContentBoxByLocator(page.locator('.topbar'))
//   const toolbar = await getMarginBoxByLocator(page.locator('.toolbar'))
//   const address = await getMarginBoxByLocator(page.locator('.address'))
//   const setting = await getMarginBoxByLocator(page.locator('.setting'))
//   // await expect(toolbar.height).toBeCloseTo(topbar.height) // maybe empty
//   // await expect(address.height).toBeCloseTo(topbar.height)
//   // await expect(setting.height).toBeCloseTo(topbar.height)
//   await expect(toolbar.width + address.width + setting.width).toBeLessThanOrEqual(topbar.width)
// })
