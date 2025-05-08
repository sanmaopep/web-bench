const { test, expect } = require('@playwright/test')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('press enter to edit the selected cell', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await page.keyboard.press('Enter')

  await expect(td).toHaveAttribute('contenteditable', /true/i)
  const text = new Date().getTime() + ''
  await td.clear()
  await td.fill(text)
  await expect(td).toHaveText(text)
})

test('press escape to change editable to selected', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await expect(td).toHaveClass('selected')

  await page.keyboard.press('Enter')
  await expect(td).toHaveClass('selected')
  await expect(td).toHaveAttribute('contenteditable', /true/i)

  await page.keyboard.press('Escape')
  await expect(td).toHaveClass('selected')
  await expect(td).not.toHaveAttribute('contenteditable', /true/i)
})
