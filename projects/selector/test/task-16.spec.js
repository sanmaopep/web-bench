const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('h1', async ({ page }) => {
  const items = page.locator(`#id16 h1`)

  await expect(items.nth(0)).toHaveCSS('font-size', '30px')
  await expect(items.nth(1)).toHaveCSS('font-size', '25px')
  await expect(items.nth(2)).toHaveCSS('font-size', '20px')
  await expect(items.nth(3)).toHaveCSS('font-size', '15px')
  await expect(items.nth(4)).toHaveCSS('font-size', '15px')
})
