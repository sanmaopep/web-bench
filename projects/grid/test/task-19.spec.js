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

test('left-drag <<', async ({ page }) => {
  await page.locator('.content').hover()
  await page.locator('.left-drag').hover()
  const initialOffset = await getOffset(page, '.leftbar')

  // drag
  await page.mouse.down()
  await page.mouse.move(initialOffset.width / 2, 0)
  await page.mouse.move(initialOffset.width / 4, 0)
  await page.mouse.move(initialOffset.width / 8, 0)
  await page.mouse.up()
  const finalOffset = await getOffset(page, '.leftbar')
  expect(initialOffset.width).toBeGreaterThan(finalOffset.width)
})

test('left-drag >>', async ({ page }) => {
  await page.locator('.content').hover()
  await page.locator('.left-drag').hover()
  const initialOffset = await getOffset(page, '.leftbar')

  // drag
  await page.mouse.down()
  await page.mouse.move(initialOffset.width * 1.1, 0)
  await page.mouse.move(initialOffset.width * 1.5, 0)
  await page.mouse.move(initialOffset.width * 2.0, 0)
  await page.mouse.up()
  const finalOffset = await getOffset(page, '.leftbar')
  expect(initialOffset.width).toBeLessThan(finalOffset.width)
})

test('right-drag >>', async ({ page }) => {
  await page.locator('.content').hover()
  await page.locator('.right-drag').hover()
  const initialOffset = await getOffset(page, '.rightbar')

  // drag
  await page.mouse.down()
  await page.mouse.move(initialOffset.left + initialOffset.width / 2, 0)
  await page.mouse.move(initialOffset.left + initialOffset.width / 4, 0)
  await page.mouse.move(initialOffset.left + initialOffset.width / 8, 0)
  await page.mouse.up()
  const finalOffset = await getOffset(page, '.rightbar')
  expect(initialOffset.width).toBeGreaterThan(finalOffset.width)
})

test('right-drag <<', async ({ page }) => {
  await page.locator('.content').hover()
  await page.locator('.right-drag').hover()
  const initialOffset = await getOffset(page, '.rightbar')

  // drag
  await page.mouse.down()
  await page.mouse.move(initialOffset.left - initialOffset.width * 1.1, 0)
  await page.mouse.move(initialOffset.left - initialOffset.width * 1.5, 0)
  await page.mouse.move(initialOffset.left - initialOffset.width * 2.0, 0)
  await page.mouse.up()
  const finalOffset = await getOffset(page, '.rightbar')
  expect(initialOffset.width).toBeLessThan(finalOffset.width)
})
