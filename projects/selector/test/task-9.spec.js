const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('pseudo class 1', async ({ page }) => {
  await page.locator('#form input').nth(0).focus()
  await expect(page.locator('#form input').nth(0)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(1)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(7)).toHaveCSS('font-size', '20px')
})

test('pseudo class 2', async ({ page }) => {
  await page.locator('#form input').nth(7).focus()
  await expect(page.locator('#form input').nth(0)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(1)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(7)).toHaveCSS('font-size', '20px')
})
