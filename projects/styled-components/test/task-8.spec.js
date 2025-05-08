const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  // goto Read Blogs Page
  const header = page.locator('.site-header')
  const button = header.locator(`button:has-text("Read Blogs")`)
  await button.click()
})

test('Check Morning Exists', async ({ page }) => {
  await expect(page.locator(`.list-item:has-text("Morning")`)).toBeVisible()
})

test('Check Travel Exists', async ({ page }) => {
  await expect(page.locator(`.list-item:has-text("Travel")`)).toBeVisible()
})
