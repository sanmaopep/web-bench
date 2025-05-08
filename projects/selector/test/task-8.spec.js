const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('hover pseudo class', async ({ page }) => {
  try {
    await expect(css).toMatch(/&:hover/i)
  } catch (error) {
    await expect(css).toMatch(/&\s+input:hover/i)
  }

  let input = page.locator('#form input').nth(0)
  await input.hover()
  await expect(input).toHaveCSS('outline-color', 'rgb(255, 0, 0)')

  input = page.locator('#form input').nth(5)
  await input.hover()
  await expect(input).toHaveCSS('outline-color', 'rgb(255, 0, 0)')
})

test('focus pseudo class', async ({ page }) => {
  try {
    await expect(css).toMatch(/&:focus/i)
  } catch (error) {
    await expect(css).toMatch(/&\s+input:focus/i)
  }

  let input = page.locator('#form input').nth(0)
  await input.focus()
  await expect(input).toHaveCSS('background-color', 'rgb(0, 0, 0)')

  input = page.locator('#form input').nth(5)
  await input.focus()
  await expect(input).toHaveCSS('background-color', 'rgb(0, 0, 0)')
})
