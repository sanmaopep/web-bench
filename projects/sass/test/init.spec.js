const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test('initial files', async ({ page }) => {
  await expect(isExisted('design.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('design.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('preview.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('preview.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('design page', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('body')).toBeAttached()
  await expect(page.locator('form')).toBeAttached()
})

test('preview page', async ({ page }) => {
  await page.goto('/preview.html')
  await expect(page.locator('body')).toBeAttached()
  await expect(page.locator('form')).toBeAttached()
  await expect(page.locator('form')).toHaveAttribute('action', 'submit')
  await expect(page.locator('form button[type="submit"]')).toBeVisible()
})
