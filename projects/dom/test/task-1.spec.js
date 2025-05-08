const { test, expect } = require('@playwright/test')
const { getViewport, getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('tools panel', async ({ page }) => {
  await expect(page.locator('.leftbar > .tools')).toBeVisible()
})

test('tools panel buttons', async ({ page }) => {
  await expect(page.locator('.tools button:text("file")')).toBeVisible()
  await expect(page.locator('.tools button:text("dir")')).toBeVisible()
  await expect(page.locator('.tools button:text("del")')).toBeVisible()
})

test('tools panel buttons position', async ({ page }) => {
  const leftbar = await getOffset(page, '.leftbar')
  const button3 = await getOffset(page, '.tools button:last-child')
  expect(button3.centerX/leftbar.width).toBeGreaterThan(0.5)
})

test('entries panel', async ({ page }) => {
  await expect(page.locator('.leftbar > .entries')).toBeAttached()
})

// test('tools panel size', async ({ page }) => {
//   const leftbar = await getOffset(page, '.leftbar')
//   const tools = await getOffset(page, '.tools')
//   const entries = await getOffset(page, '.entries')
//   expect(entries.width).toBeCloseTo(tools.width)
//   expect(tools.height + entries.height).toBeCloseTo(leftbar.height)
// })
