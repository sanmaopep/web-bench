const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Documentation in toolbar', async ({ page }) => {
  await page.getByText('Documentation').click()
  await expect(page.getByText('WIP')).toBeVisible()
  await expect(page.getByText('Close')).toBeVisible()

  await page.getByText('Close').click()
  await expect(page.getByText('WIP')).not.toBeVisible()
  await expect(page.getByText('Close')).not.toBeVisible()
})