const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('#form children', async ({ page }) => {
  const items = await page.locator(`#form > input`).all()
  for (const item of items) {
    await expect(item).toHaveCSS('background-color', 'rgb(255, 192, 203)')
  }
})
