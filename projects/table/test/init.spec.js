const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('initial files', async ({ page }) => {
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.css', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('.table', async ({ page }) => {
  await expect(page.locator('.table')).toBeVisible()
})

test('.table structure', async ({ page }) => {
  await expect(page.locator('.table thead')).toBeAttached()
  await expect(page.locator('.table tbody')).toBeAttached()

  await expect(page.locator('.table tr')).toHaveCount(3)
  await expect(page.locator('.table tr:nth-child(1) th')).toHaveCount(3)
  await expect(page.locator('.table tr:nth-child(1) td')).toHaveCount(3)

  await expect(page.locator('.table th')).toHaveCount(3)
  await expect(page.locator('.table td')).toHaveCount(6)
})
