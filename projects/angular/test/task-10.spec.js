const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Search Input is on the top of List', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')
  const c2 = await getOffset(page, '.list-item')
  expect(c1.centerY).toBeLessThan(c2.centerY)
})

test('Filter Blogs', async ({ page }) => {
  await page.getByPlaceholder('Search Blogs').fill('Tr')
  await expect(page.locator('.blog-list-len')).toContainText('2')
  await expect(page.locator('.list-item:has-text("Morning")')).toBeHidden()
  await expect(page.locator('.list-item:has-text("Travel")')).toBeVisible()
})

test('Add New Blog And Filter It', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('TestAdd')
  await page.getByLabel('detail').fill('TestAdd Content')
  await page.locator('.submit-btn').click()

  await page.getByPlaceholder('Search Blogs').fill('TestAdd')
  await expect(page.locator('.list-item:has-text("Morning")')).toBeHidden()
  await expect(page.locator('.list-item:has-text("Travel")')).toBeHidden()
  await expect(page.locator('.list-item:has-text("TestAdd")')).toBeVisible()
})

test('Search Input width should be less than the size of component: 200px', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')

  expect(c1.width).toBeLessThanOrEqual(200)
})
