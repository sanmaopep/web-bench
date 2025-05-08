const { test, expect } = require('@playwright/test')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('delete 1 cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await page.keyboard.press('Delete')
  await expect(td).toHaveText('')
})

test('backspace 1 cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(2)')
  const td = row1.locator('td:nth-child(2)')
  await td.click()
  await page.keyboard.press('Backspace')
  await expect(td).toHaveText('')
})

test('delete row cells', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  await row1.locator('td:nth-child(1)').click({ button: 'right' })
  await page.locator('.menu-item-select-row').click()

  await page.keyboard.press('Delete')
  await expect(row1.locator('td:nth-child(1)')).toHaveText('')
  await expect(row1.locator('td:nth-child(2)')).toHaveText('')
  await expect(row1.locator('td:nth-child(3)')).toHaveText('')
})

test('delete col cells', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await row1.locator('th:nth-child(1)').click({ button: 'right' })
  await page.locator('.menu-item-select-col').click()

  await page.keyboard.press('Delete')
  await expect(row1.locator('th:nth-child(1)')).toHaveText('')
  await expect(row2.locator('td:nth-child(1)')).toHaveText('')
  await expect(row3.locator('td:nth-child(1)')).toHaveText('')
})
