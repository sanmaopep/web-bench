const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('#id4 subsequent-sibling combinator selector', async ({ page }) => {
  await expect(css).toMatch(/#id4-1\s+\~\s+div/i)
  await expect(page.locator('#id4 div').nth(0)).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(page.locator('#id4 div').nth(1)).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(page.locator('#id4 div').nth(2)).toHaveCSS('color', 'rgb(0, 0, 255)')
  await expect(page.locator('#id4 div').nth(3)).toHaveCSS('color', 'rgb(0, 0, 255)')
})

test('#id4 next-sibling combinator selector', async ({ page }) => {
  await expect(css).toMatch(/#id4-3\s+\+\s+div/i)
  await expect(page.locator('#id4 div').nth(4)).toHaveCSS('color', 'rgb(255, 255, 0)')
})
