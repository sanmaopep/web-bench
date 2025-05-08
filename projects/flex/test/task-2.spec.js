const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.main flex', async ({ page }) => {
  const style = await getComputedStyle(page, '.main')
  expect(style.display).toBe('flex')
  expect(style.flexDirection).toBe('row')
})

test('.leftbar fixed left', async ({ page }) => {
  const offset = await getOffset(page, '.leftbar')
  expect(offset.left).toEqual(0)
})

test('.rightbar fixed right', async ({ page }) => {
  const offset = await getOffset(page, '.rightbar')
  const bodyWidth = (await getOffset(page, 'body')).width
  expect(offset.left + offset.width).toEqual(bodyWidth)
})

test('.content flex > 0', async ({ page }) => {
  const style = await getComputedStyle(page, '.content')
  expect(parseFloat(style.flexGrow)).toBeGreaterThan(0)
})
