const { test, expect } = require('@playwright/test')
const {
  getOffset,
  getComputedStyle,
  getMarginBox,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('content 12 cards', async ({ page }) => {
  await expect(page.locator('.content > .card')).toHaveCount(12)
  await expect(page.locator('.card').nth(0)).toHaveCSS('float', /left|right/i)
})

test('content 3 cards/row', async ({ page }) => {
  const c1 = await getOffset(page, '.card:nth-child(1)')
  const c2 = await getOffset(page, '.card:nth-child(2)')
  const c3 = await getOffset(page, '.card:nth-child(3)')
  const c4 = await getOffset(page, '.card:nth-child(4)')
  expect(c1.centerY).toBe(c2.centerY)
  expect(c2.centerY).toBe(c3.centerY)
  expect(c1.centerX).toBe(c4.centerX)
})

test('content scrollable', async ({ page }) => {
  await expect(page.locator('.content')).toHaveCSS('overflow-y', /auto|scroll/)
})

test('card min-height', async ({ page }) => {
  await expect(page.locator('.card:nth-child(1)')).toHaveCSS('min-height', '100px')

  const offset = await getOffset(page, '.card:nth-child(1)')
  expect(offset.height).toBeGreaterThanOrEqual(100)
})

test('cards height', async ({ page }) => {
  const c1 = await getComputedStyle(page, '.card:nth-child(1)')
  const c4 = await getComputedStyle(page, '.card:nth-child(4)')
  const c7 = await getComputedStyle(page, '.card:nth-child(7)')
  const c10 = await getComputedStyle(page, '.card:nth-child(10)')
  const content = await getOffset(page, '.content')
  expectTolerance(
    getMarginBox(c1).height +
      getMarginBox(c4).height +
      getMarginBox(c7).height +
      getMarginBox(c10).height,
    content.height,
    5
  )
})
