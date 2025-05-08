const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.header flex', async ({ page }) => {
  const style = await getComputedStyle(page, '.header')
  expect(style.display).toBe('flex')
  expect(style.flexDirection).toBe('row')
})

test('.menu flex', async ({ page }) => {
  const style = await getComputedStyle(page, '.menu')
  expect(style.display).toBe('flex')
  expect(style.flexDirection).toBe('row')
})

test('.menu items', async ({ page }) => {
  await expect(page.locator('.menu > *:nth-child(1)')).toBeVisible()
  await expect(page.locator('.menu > *:nth-child(2)')).toBeVisible()
  await expect(page.locator('.menu > *:nth-child(3)')).toBeVisible()
})

test('.menu has 3 items', async ({ page }) => {
  await expect(page.locator('.menu > *')).toHaveCount(3)
})

test('.menu item3 position', async ({ page }) => {
  const offset = await getOffset(page, '.menu > *:nth-child(3)')
  const bodyWidth = (await getOffset(page, 'body')).width
  expect(offset.centerX / bodyWidth).toBeGreaterThan(0.5)
})
