const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/table.js', async ({ page }) => {
  await expect(isExisted('common/table.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('select th', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const th12 = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const th11Selected = page.locator('.table thead tr:nth-child(1) th:nth-child(1).selected')

  await expect(th11Selected).not.toBeAttached()

  await th11.click()
  await expect(th11Selected).toBeAttached()

  await th12.click()
  await expect(th11Selected).not.toBeAttached()
})

test('select td', async ({ page }) => {
  const td11 = page.locator('.table tbody tr:nth-child(1) td:nth-child(1)')
  const td12 = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const td11Selected = page.locator('.table tbody tr:nth-child(1) td:nth-child(1).selected')

  await expect(td11Selected).not.toBeAttached()

  await td11.click()
  await expect(td11Selected).toBeAttached()

  await td12.click()
  await expect(td11Selected).not.toBeAttached()
})
