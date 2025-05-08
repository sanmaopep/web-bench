const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 2 Clear sin history', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("2")')
  await expect(page.locator('#clicks')).toHaveText('21')

  await page.click('button:text("3")')
  await page.click('button:text("4")')
  await page.click('button:text("5")')
  await page.click('button:text("6")')
  await expect(page.locator('#clicks')).toHaveText('65432')
})

test('history at modes', async ({ page }) => {
  await expect(page.locator('#clicks')).toBeVisible()

  await page.click('#mode')
  
  await expect(page.locator('#clicks')).not.toBeVisible()
})
