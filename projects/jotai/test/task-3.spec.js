const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Select List Item', async ({ page }) => {
  const travelListItem = page.locator('.list-item:has-text("Travel")')
  await travelListItem.click()
  await expect(page.getByText('I love traveling!')).toBeVisible()

  const morningListItem = page.locator('.list-item:has-text("Morning")')
  await morningListItem.click()
  await expect(page.getByText('Morning My Friends')).toBeVisible()

  await expect(page.getByText('I love traveling!')).toBeHidden()
})
