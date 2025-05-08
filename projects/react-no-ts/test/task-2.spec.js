const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check List Item', async ({ page }) => {
  await expect(page.locator('.list-item:has-text("Morning")')).toBeVisible()

  const c1 = await getOffset(page, '.list-item:has-text("Morning")')

  // height of list item is 40px
  expect(c1.height).toBe(40)
  // width of list item is less than 300px (the size of list container)
  expect(c1.width).toBeLessThanOrEqual(300)
})

test('Check Travel Item', async ({ page }) => {
  await expect(page.locator('.list-item:has-text("Travel")')).toBeVisible()
  await expect(page.getByText('I love traveling!')).toBeHidden()

  const c1 = await getOffset(page, '.list-item:has-text("Travel")')

  // height of list item is 40px
  expect(c1.height).toBe(40)
  // width of list item is less than 300px (the size of list container)
  expect(c1.width).toBeLessThanOrEqual(300)
})

test('Check List Layout from Left to Right', async ({ page }) => {
  const c1 = await getOffset(page, '.list-item:has-text("Morning")')
  const c2 = await getOffset(page, '.blog-title:has-text("Morning")')

  expect(c1.right).toBeLessThanOrEqual(c2.left)
})
