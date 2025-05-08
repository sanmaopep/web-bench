const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 M- MC 2 + MR =', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M-")')
  await expect(page.locator('#display')).toHaveValue('')

  await page.click('button:text("MC")')
  await page.click('button:text("2")')
  await page.click('button:text("+")')
  await page.click('button:text("MR")')
  await page.click('button:text("=")')
  await expect(page.locator('#display')).toHaveValue('2')
})

test('1 M+ MC MC MR', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M+")')
  await page.click('button:text("MC")')
  await page.click('button:text("MC")')
  await page.click('button:text("MR")')
  await expect(page.locator('#display')).toHaveValue('0')
})

test('MC at modes', async ({ page }) => {
  await expect(page.locator('button:text("MC")')).toBeVisible()

  await page.click('#mode')

  await expect(page.locator('button:text("MC")')).not.toBeVisible()
})
