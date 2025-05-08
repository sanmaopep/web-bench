const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('<p>', async ({ page }) => {
  await expect(page.locator('p#id1')).toBeVisible()
})

test('type selector', async ({ page }) => {
  await expect(css).toContain('p')
  await expect(page.locator('p#id1')).toHaveCSS('padding', /5px/i)
})

test('class selector', async ({ page }) => {
  await expect(css).toContain('.class1')
  await expect(page.locator('.class1').first()).toHaveCSS('text-decoration', /underline/i)
})

test('id selector', async ({ page }) => {
  await expect(css).toContain('#id1')
  await expect(page.locator('#id1')).toHaveCSS('font-family', /monospace/i)
})
