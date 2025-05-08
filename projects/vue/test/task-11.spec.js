const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  page.setDefaultTimeout(500)
})

test('Check Blog Length', async ({ page }) => {
  await page.getByText('Random Blogs').click()
  await expect(page.locator('.blog-list-len')).toContainText('100002')
})

test('Check Random Blogs will not stuck pages', async ({ page }) => {
  await page.getByText('Random Blogs').click()

  await page.getByText('Add Blog').click()
  await expect(page.getByText('Create Blog')).toBeVisible()
})

test('Check Search will not stuck in large blog list', async ({ page }) => {
  await page.getByText('Random Blogs').click()
  await page.getByText('Random Blogs').click()
  await page.getByText('Random Blogs').click()

  await page.getByPlaceholder('Search Blogs').fill('Random')
  await expect(page.locator('.list-item:has-text("Random")').first()).toBeVisible()
})
