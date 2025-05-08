const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Close Button place in the right of modal', async ({ page }) => {
  await page.getByText('Add Blog').click()

  const c1 = await getOffset(page, '.close-btn')
  const c2 = await getOffset(page, ':text("Create Blog")')

  expect(c1.centerX).toBeGreaterThan(c2.centerX)
})

test('Check Add Blog Modal, Open And Close', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await expect(page.getByText('Create Blog')).toBeVisible()
  await page.locator('.close-btn').click()
  await expect(page.getByText('Create Blog')).toBeHidden()
})
