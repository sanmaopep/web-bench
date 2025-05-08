const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  page.setDefaultTimeout(2000)
})

test('Check Blog Length', async ({ page }) => {
  await page.getByText('🔀').click()
  await expect(page.locator('.blog-list-len')).toContainText('100003')
})

test('Check Random Blogs will not stuck pages', async ({ page }) => {
  await page.getByText('🔀').click()

  await page.getByText('Add Blog').click()
  await expect(page.getByText('Create Blog')).toBeVisible()
})

test('Check Search will not stuck in large blog list', async ({ page }) => {
  await page.getByText('🔀').click()
  await page.getByText('🔀').click()
  await page.getByText('🔀').click()

  await page.getByPlaceholder('Search Blogs').fill('Random')
  await expect(page.locator('.list-item:has-text("Random")').first()).toBeVisible()
})
