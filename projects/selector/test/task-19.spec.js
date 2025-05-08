const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('h1', async ({ page }) => {
  const items = page.locator(`#id18 h1`)

  await expect(items.nth(0)).toHaveCSS('text-indent', '0px')
  await expect(items.nth(1)).toHaveCSS('text-indent', '10px')
  await expect(items.nth(2)).toHaveCSS('text-indent', '20px')
  await expect(items.nth(3)).toHaveCSS('text-indent', '30px')
  await expect(items.nth(4)).toHaveCSS('text-indent', '30px')
})
