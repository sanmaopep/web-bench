// @ts-nocheck
const { test, expect } = require('@playwright/test')
const { getCmdKey, getCmdKeyText } = require('./util/index')
const { getViewport, getOffset, getComputedStyle, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/resizer.js', async ({ page }) => {
  await expect(isExisted('common/resizer.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('resizer', async ({ page }) => {
  await expect(page.locator('.resizer')).toBeAttached()
})

test('leftbar hover', async ({ page }) => {
  await page.hover('.leftbar')
  await expect(page.locator('.resizer')).toBeVisible()
})

test('leftbar and drags style', async ({ page }) => {
  await expect(page.locator('.leftbar')).toHaveCSS('position', /relative|absolute/)
  await expect(page.locator('.resizer')).toHaveCSS('position', /absolute/)

  const resizer = await getComputedStyle(page, '.resizer')
  expect(parseInt(resizer.right ?? '0', 10)).toBe(0)
})
