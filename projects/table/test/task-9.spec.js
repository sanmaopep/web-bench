const { test, expect } = require('@playwright/test')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('select start(1, 1) end(1, 3)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')
})

test('select start(1, 3) end(1, 1)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')
})

test('select start(1, 1) end(3, 3)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row3.locator('td:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')

  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')

  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
})

test('select start(3, 3) end(1, 1)', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')
  const row2 = page.locator('.table tbody tr:nth-child(1)')
  const row3 = page.locator('.table tbody tr:nth-child(2)')

  await row3.locator('td:nth-child(3)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.up('Shift')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).toHaveClass('selected')

  await expect(row2.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row2.locator('td:nth-child(3)')).toHaveClass('selected')

  await expect(row3.locator('td:nth-child(1)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(2)')).toHaveClass('selected')
  await expect(row3.locator('td:nth-child(3)')).toHaveClass('selected')
})

test('select cells and click', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await row1.locator('th:nth-child(1)').click()

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).not.toHaveClass('selected')
})

test('select cells and arrow key', async ({ page }) => {
  const row1 = page.locator('.table thead tr:nth-child(1)')

  await row1.locator('th:nth-child(1)').click()
  await page.keyboard.down('Shift')
  await row1.locator('th:nth-child(3)').click()
  await page.keyboard.up('Shift')

  await page.keyboard.press('ArrowLeft')

  await expect(row1.locator('th:nth-child(1)')).toHaveClass('selected')
  await expect(row1.locator('th:nth-child(2)')).not.toHaveClass('selected')
  await expect(row1.locator('th:nth-child(3)')).not.toHaveClass('selected')
})
