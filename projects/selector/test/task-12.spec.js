const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('td count', async ({ page }) => {
  await expect(page.locator(`#table tr td:has(> p)`)).toHaveCount(4)
})

test('td bg', async ({ page }) => {
  const tds = await page.locator(`#table tr td:has(> p)`).all()
  for (const td of tds) {
    await expect(td).toHaveCSS('background-color', 'rgb(255, 255, 0)')
  }
})
