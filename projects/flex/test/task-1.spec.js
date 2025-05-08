const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.root flex', async ({ page }) => {
  const style = await getComputedStyle(page, '.root')
  expect(style.display).toBe('flex')
  expect(style.flexDirection).toBe('column')
})

test('.header fixed top', async ({ page }) => {
  const offset = await getOffset(page, '.header')
  expect(offset.top).toEqual(0)
  expect(offset.left).toEqual(0)
})

test('.footer fixed bottom', async ({ page }) => {
  const offset = await getOffset(page, '.footer')
  const bodyHeight = (await getOffset(page, 'body')).height
  expect(offset.left).toEqual(0)
  expect(offset.top + offset.height).toEqual(bodyHeight)
})

test('.main flex > 0', async ({ page }) => {
  const style = await getComputedStyle(page, '.main')
  expect(parseFloat(style.flexGrow)).toBeGreaterThan(0)
})
