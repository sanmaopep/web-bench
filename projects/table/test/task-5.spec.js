const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/key.js', async ({ page }) => {
  await expect(isExisted('common/key.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('no selected cell, arrowleft', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await page.keyboard.press('ArrowLeft')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})

test('no selected cell, arrowright', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await page.keyboard.press('ArrowRight')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})

test('no selected cell, arrowup', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await page.keyboard.press('ArrowUp')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})

test('no selected cell, arrowdown', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')
  await page.keyboard.press('ArrowDown')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')
})
test('arrowleft/right', async ({ page }) => {
  const headerRow = page.locator('.table thead tr:nth-child(1)')

  await headerRow.locator('th:nth-child(1)').click()
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowLeft')
  await expect(headerRow.locator('th:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowRight')
  await expect(headerRow.locator('th:nth-child(1)')).not.toHaveClass('selected')
  await expect(headerRow.locator('th:nth-child(2)')).toHaveClass('selected')

  await page.keyboard.press('ArrowRight')
  await expect(headerRow.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(headerRow.locator('th:nth-child(3)')).toHaveClass('selected')

  await page.keyboard.press('ArrowRight')
  await expect(headerRow.locator('th:nth-child(3)')).toHaveClass('selected')
})

test('arrowup/down', async ({ page }) => {
  const table = page.locator('.table')
  await table.locator('tbody tr:nth-child(2) td:nth-child(1)').click()
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowUp')
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).not.toHaveClass('selected')
  await expect(table.locator('tbody tr:nth-child(1) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowUp')
  await expect(table.locator('thead tr:nth-child(1) th:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowUp')
  await expect(table.locator('thead tr:nth-child(1) th:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowDown')
  await expect(table.locator('tbody tr:nth-child(1) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowDown')
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).toHaveClass('selected')

  await page.keyboard.press('ArrowDown')
  await expect(table.locator('tbody tr:nth-child(2) td:nth-child(1)')).toHaveClass('selected')
})
