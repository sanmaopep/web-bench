const { test, expect } = require('@playwright/test')
const {
  getOffset,
  getComputedStyle,
  getMarginBox,
  expectTolerance,
  expectOneLine,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('cards reverse', async ({ page }) => {
  await expect(page.locator('.content')).toHaveCSS('flex-wrap', 'wrap-reverse')
})
