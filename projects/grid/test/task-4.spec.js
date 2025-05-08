const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.logo', async ({ page }) => {
  await expect(page.locator('.logo')).toBeVisible()
})

test('.logo position', async ({ page }) => {
  const offset = await getOffset(page, '.logo')
  const bodyWidth = (await getOffset(page, 'body')).width
  expect(offset.centerX / bodyWidth).toBeLessThan(0.5)
})
