const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Check API fetching logic', async () => {
  test.describe.configure({ mode: 'serial' })

  let page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
  })

  test('Check Loading', async ({ page }) => {
    await expect(page.getByText('Blog is loading')).toBeVisible()
    await expect(page.getByText('Add Blog')).toBeDisabled()
  })

  test('Check Loading End', async ({ page }) => {
    await page.waitForTimeout(1000)
    await expect(page.getByText('Blog is loading')).not.toBeVisible()
  })

  test('Check Blog fetched from API Existed', async ({ page }) => {
    await expect(page.getByText('API Blog')).toBeVisible()
  })

  test('Check API Blog Selected', async ({ page }) => {
    const apiBlogListItem = page.locator('.list-item:has-text("API Blog")')
    await apiBlogListItem.click()
    await expect(page.getByText('This is a blog fetched from API')).toBeVisible()
  })
})
