const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('√ ^2', async ({ page }) => {
  await expect(page.locator('button:text("√") + button:text("^2")')).toBeVisible()
})

test('3 ^2 = 9', async ({ page }) => {
  await page.click('button:text("3")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('9')
})

test('2 ^2 ^2 ^2 ^2 = 32', async ({ page }) => {
  await page.click('button:text("2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('65536')
})

test('10 ^2 = 100', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("0")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('100')
})

test('-2 ^2 = 4', async ({ page }) => {
  await page.click('button:text("-")')
  await page.click('button:text("2")')
  await page.click('button:text("^2")')

  await expect(page.locator('#display')).toHaveValue('4')
})