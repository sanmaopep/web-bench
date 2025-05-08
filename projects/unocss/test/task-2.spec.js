const { test, expect } = require('@playwright/test')
const {
  getComputedStyle,
  getOffset,
  getHtmlElement,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.leftbar .rightbar visible', async ({ page }) => {
  await expect(page.locator('.leftbar')).toBeVisible()
  await expect(page.locator('.rightbar')).toBeVisible()
})

test('.leftbar fixed left', async ({ page }) => {
  const offset = await getOffset(page, '.leftbar')
  // const body = await getOffset(page, 'body')
  expect(offset.left).toEqual(0)
  // expect(offset.width).toEqual(Math.min(200, body.width * 0.2)) // 200
})

test('.rightbar fixed right', async ({ page }) => {
  const offset = await getOffset(page, '.rightbar')
  const body = await getOffset(page, 'body')
  expect(offset.right).toEqual(body.width)
  // expect(offset.width).toBeCloseTo(Math.max(200, body.width * 0.2)) // 256
})

test('.content uses remaining width', async ({ page }) => {
  const leftbar = await getOffset(page, '.leftbar')
  const rightbar = await getOffset(page, '.rightbar')
  const content = await getOffset(page, '.content')
  const body = await getOffset(page, 'body')
  expectTolerance(leftbar.width + rightbar.width + content.width, body.width, 1)
})
