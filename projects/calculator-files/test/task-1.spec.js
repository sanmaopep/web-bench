const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('Clear √', async ({ page }) => {
  await expect(page.locator('button:text("Clear") + button:text("√")')).toBeVisible()
})

test('9 √ = 3', async ({ page }) => {
  await page.click('button:text("9")')
  await page.click('button:text("√")')

  await expect(page.locator('#display')).toHaveValue('3')
})

test('1 6 √ √ = 2', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("6")')
  await page.click('button:text("√")')
  await page.click('button:text("√")')

  await expect(page.locator('#display')).toHaveValue('2')
})
