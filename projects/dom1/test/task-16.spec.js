// @ts-nocheck
const { test, expect } = require('@playwright/test')
const { getCmdKey, getCmdKeyText } = require('./util/index')
const { getViewport, getOffset, getComputedStyle, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('gen 100 entries', async ({ page }) => {
  await page.locator('.tools button:text("gen")').click()

  await expect(page.locator('.entries > .entry')).toHaveCount(100)
})

test('gen 100 entries and leftbar height', async ({ page }) => {
  await page.locator('.tools button:text("gen")').click()

  const leftbar = await getOffset(page, '.leftbar')
  const viewport = await getViewport(page)
  expect(leftbar.height).toBeCloseTo(viewport.height)
})