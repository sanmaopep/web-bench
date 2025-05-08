const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/Question.js', async ({ page }) => {
  await expect(isExisted('common/Question.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('Question', async ({ page }) => {
  await expect(page.locator('legend:text("sample empty question")')).toBeVisible()
  await expect(page.locator('fieldset legend:text("sample empty question")')).toBeVisible()
  await expect(page.locator('legend:text("sample empty question") + .q-body')).toBeAttached()
})
