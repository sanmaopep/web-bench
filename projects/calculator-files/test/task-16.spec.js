const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 M+ 2 M+ memory', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("M+")')
  await expect(page.locator('#memory')).toHaveText('1')
  
  await page.click('button:text("2")')
  await page.click('button:text("M+")')
  await expect(page.locator('#memory')).toHaveText('3')
})

test('memory at modes', async ({ page }) => {
  await expect(page.locator('#memory')).toBeVisible()

  await page.click('#mode')
  
  await expect(page.locator('#memory')).not.toBeVisible()
})
