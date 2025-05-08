const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 M+ 2 + MR =', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M+")')
  await expect(page.locator('#display')).toHaveValue('')

  await page.click('button:text("2")')
  await page.click('button:text("+")')
  await page.click('button:text("MR")')
  await page.click('button:text("=")')
  await expect(page.locator('#display')).toHaveValue('3')
})

test('1 M+ 2 M+ 3 M+ MR', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M+")')
  await page.click('button:text("2")')
  await page.click('button:text("M+")')
  await page.click('button:text("3")')
  await page.click('button:text("M+")')
  await page.click('button:text("MR")')
  await expect(page.locator('#display')).toHaveValue('6')
})

test('M+/MR at modes', async ({ page }) => {
  await expect(page.locator('button:text("MR")')).toBeVisible()
  await expect(page.locator('button:text("M+")')).toBeVisible()

  await page.click('#mode')

  await expect(page.locator('button:text("MR")')).not.toBeVisible()
  await expect(page.locator('button:text("M+")')).not.toBeVisible()
})
