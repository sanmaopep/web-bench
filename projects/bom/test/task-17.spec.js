import { test, devices, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('network default', async ({ page }) => {
  await expect(page.locator('.network')).toHaveClass(/online/i)
})

test('network online', async ({ page }) => {
  page.context().setOffline(true)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).not.toHaveClass(/online/i)
})

test('network offline', async ({ page }) => {
  page.context().setOffline(true)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).not.toHaveClass(/online/i)
  page.context().setOffline(false)
  await page.waitForTimeout(10)
  await expect(page.locator('.network')).toHaveClass(/online/i)
})
