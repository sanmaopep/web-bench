import { test, expect } from '@playwright/test'
import { getBoxByLocator, getContentBoxByLocator, getMarginBoxByLocator, isExisted } from '@web-bench/test-util'
import path from 'node:path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.topbar', async ({ page }) => {
  await expect(page.locator('.browser .topbar')).toBeAttached()
})

test('.content', async ({ page }) => {
  await expect(page.locator('.browser iframe.content[name="content"]')).toBeAttached()
})

test('.topbar .content together fill .browser', async ({ page }) => {
  const browser = await getContentBoxByLocator(page.locator('.browser'))
  const topbar = await getMarginBoxByLocator(page.locator('.topbar'))
  const content = await getMarginBoxByLocator(page.locator('.content'))
  await expect(topbar.width).toBeCloseTo(browser.width)
  await expect(content.width).toBeCloseTo(browser.width)
  await expect(topbar.height + content.height).toBeCloseTo(browser.height)
})
