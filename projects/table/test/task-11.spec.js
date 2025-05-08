const { test, expect } = require('@playwright/test')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('click selected cell to edit', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await td.click()
  
  await expect(td).toHaveAttribute('contenteditable', /true/i)
  const text = new Date().getTime() + ''
  await td.clear()
  await td.fill(text)
  await expect(td).toHaveText(text)
})

test('doouble click unselected cell to edit', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.dblclick()
  
  await expect(td).toHaveAttribute('contenteditable', /true/i)
  const text = new Date().getTime() + ''
  await td.clear()
  await td.fill(text)
  await expect(td).toHaveText(text)
})

test('doouble click selected cell to edit', async ({ page }) => {
  const row1 = page.locator('.table tbody tr:nth-child(1)')
  const td = row1.locator('td:nth-child(1)')
  await td.click()
  await td.dblclick()
  
  await expect(td).toHaveAttribute('contenteditable', /true/i)
  const text = new Date().getTime() + ''
  await td.clear()
  await td.fill(text)
  await expect(td).toHaveText(text)
})
