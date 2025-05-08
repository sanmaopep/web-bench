const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('click history-items', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("+")')
  await page.click('button:text("2")')
  await page.click('button:text("=")')

  await expect(page.locator('#clicks')).toHaveText('=2+1')

  await page.click('.history-item:text("+")')
  await page.click('.history-item:text("1")')
  await page.click('.history-item:text("=")')
  // await page.click('.history-item:text("+")')
  // await page.click('.history-item:text("2")')
  // await page.click('.history-item:text("=")')

  await expect(page.locator('#display')).toHaveValue('4')
})
