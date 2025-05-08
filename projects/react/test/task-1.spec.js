const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Hello World Existed', async ({ page }) => {
  await expect(page.getByText('Hello Blog')).toBeVisible()
})

test('Check Blog Existed', async ({ page }) => {
  await expect(page.locator('.blog-title:has-text("Morning")')).toBeVisible()
  await expect(page.getByText('Morning My Friends')).toBeVisible()
})

test('Check Header is on the top of Main', async ({ page }) => {
  const c1 = await getOffset(page, ':text("Hello Blog")')
  const c2 = await getOffset(page, ':text("Morning")')

  expect(c1.bottom).toBeLessThanOrEqual(c2.top)
})

test('Check blog-title fit-content', async ({ page }) => {
  const blogTitle = page.locator('.blog-title')

  await expect(blogTitle).toBeVisible()

  const titleBox = await getOffset(page, '.blog-title')
  expect(titleBox.width).toBeLessThanOrEqual(200)
})
