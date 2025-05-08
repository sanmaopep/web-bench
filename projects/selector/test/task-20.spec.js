const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('h1', async ({ page }) => {
  const items = page.locator(`#id18 h1`)

  await expect(items.nth(0)).toHaveCSS('font-style', 'normal')
  await expect(items.nth(0)).toHaveCSS('font-weight', '700')
  await expect(items.nth(1)).toHaveCSS('font-style', 'italic')
  await expect(items.nth(1)).toHaveCSS('font-weight', '700')
  await expect(items.nth(2)).toHaveCSS('font-style', 'normal')
  await expect(items.nth(2)).toHaveCSS('font-weight', '700')
  await expect(items.nth(3)).toHaveCSS('font-style', 'normal')
  await expect(items.nth(3)).toHaveCSS('font-weight', '400')
  await expect(items.nth(4)).toHaveCSS('font-style', 'normal')
  await expect(items.nth(4)).toHaveCSS('font-weight', '400')
})
