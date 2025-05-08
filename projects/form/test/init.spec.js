const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('initial files', async ({ page }) => {
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.css', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('form', async ({ page }) => {
  await expect(page.locator('form')).toBeAttached()
  await expect(page.locator('form')).toHaveAttribute('action', /submit/i)
  await expect(page.locator('button[type="submit"]').first()).toBeAttached()
})

test('submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams, url) => {
    await expect(url.pathname === '/submit').toBeTruthy()
  })

  await submit(page)
})
