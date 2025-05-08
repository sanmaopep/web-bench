const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('<q>', async ({ page }) => {
  await expect(css).toContain('*')
  await expect(page.locator('q#id3')).toBeVisible()
})

test('selector list', async ({ page }) => {
  await expect(css).toMatch(/\.class1,\s+/i)
  await expect(page.locator('#id3')).toHaveCSS('text-decoration', /underline/i)
})

test('universal selector', async ({ page }) => {
  await expect(css).toContain('*')
  await expect(page.locator('#id1')).toHaveCSS('color', /rgb\(255, 0, 0\)/i)
  await expect(page.locator('#id3')).toHaveCSS('color', /rgb\(255, 0, 0\)/i)
})
