const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('compound selector', async ({ page }) => {
  await expect(css).toContain('p.class1#id1')
  await expect(page.locator('p.class1#id1')).toHaveCSS('font-size', /15px/i)
})
