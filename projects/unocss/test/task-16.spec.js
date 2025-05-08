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

test('cards order', async ({ page }) => {
  const card11 = await getComputedStyle(page, '.content > .card:nth-child(11)')
  const card12 = await getComputedStyle(page, '.content > .card:nth-child(12)')
  expect(parseFloat(card11.order)).toBeGreaterThan(parseFloat(card12.order))
})

test('cards position', async ({ page }) => {
  const card11 = await getOffset(page, '.content > .card:nth-child(11)')
  const card12 = await getOffset(page, '.content > .card:nth-child(12)')

  expect(card11.centerX).toBeGreaterThan(card12.centerX)
})
