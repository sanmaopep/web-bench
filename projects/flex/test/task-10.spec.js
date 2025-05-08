const { test, expect } = require('@playwright/test')
const {
  getComputedStyle,
  getOffset,
  getHtmlElement,
  getBox,
  expectBetween,
  getMarginBox,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('rightbar 2 columns', async ({ page }) => {
  const c1 = await getOffset(page, '.rightbar > *:nth-child(1)')
  const c2 = await getOffset(page, '.rightbar > *:nth-child(2)')
  expect(c1.centerY).toBe(c2.centerY)
})

test('rightbar 20 * 2 cells', async ({ page }) => {
  const count = await page.locator('.rightbar > *').count()
  expect(count).toBe(40)
})

test('rightbar height', async ({ page }) => {
  const body = await getOffset(page, 'body')
  const header = await getOffset(page, '.header')
  const footer = await getOffset(page, '.footer')
  const rightbar = await getOffset(page, '.rightbar')
  expect(header.height + rightbar.height + footer.height).toBe(body.height)
})

test('rightbar items width', async ({ page }) => {
  const rightbar = await getOffset(page, '.rightbar')
  const c1 = getMarginBox(await getComputedStyle(page, '.rightbar > *:nth-child(1)'))
  const c2 = getMarginBox(await getComputedStyle(page, '.rightbar > *:nth-child(2)'))
  expectTolerance(c1.width + c2.width, rightbar.width, 5)
})

test('rightbar items height', async ({ page }) => {
  const leftbar = await getOffset(page, '.rightbar')
  const itemStyle = await getComputedStyle(page, '.rightbar > *')
  const itemSpaceHeight = getMarginBox(itemStyle).height
  expectTolerance(itemSpaceHeight * 20, leftbar.height, 5)
})
