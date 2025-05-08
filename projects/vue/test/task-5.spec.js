const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Record open Modal times', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await expect(page.locator('.visible-count')).toContainText('1')
  await page.locator('.close-btn').click()

  await page.getByText('Add Blog').click()
  await expect(page.locator('.visible-count')).toContainText('2')
  await page.locator('.close-btn').click()

  await page.getByText('Add Blog').click()
  await expect(page.locator('.visible-count')).toContainText('3')
  await page.locator('.close-btn').click()
})

test('Check .visible-count in the top left of Modal', async ({ page }) => {
  await page.getByText('Add Blog').click()

  const c1 = await getOffset(page, '.visible-count')
  const c2 = await getOffset(page, ':text("Create Blog")')

  expect(c1.centerX).toBeLessThanOrEqual(c2.centerX)
})
