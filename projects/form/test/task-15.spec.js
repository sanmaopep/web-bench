const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/Survey.js', async ({ page }) => {
  await expect(isExisted('common/Survey.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('survey structure', async ({ page }) => {
  const qcount = await page.locator('form .q').count()
  await expect(qcount).toBeGreaterThanOrEqual(10)
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(10)
})
