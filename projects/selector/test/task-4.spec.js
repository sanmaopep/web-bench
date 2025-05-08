const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('#id4', async ({ page }) => {
  await expect(page.locator('#id4')).toBeVisible()
})

test('#id4 children', async ({ page }) => {
  await expect(page.locator('#id4 *')).toHaveCount(5)
  await expect(page.locator('#id4 *').nth(0)).toHaveAttribute('id', 'id4-0')
  await expect(page.locator('#id4 *').nth(4)).toHaveAttribute('id', 'id4-4')
})

test('#id4 child combinator selector', async ({ page }) => {
  await expect(css).toMatch(/#id4\s+>\s+div/i)
  await expect(page.locator('#id4 div').first()).toHaveCSS('color', 'rgb(0, 128, 0)')
})
