const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('#form attribute selector | equal & not equal', async ({ page }) => {
  await expect(css).toMatch(/#form\s+:not\(input\[name\]\)/i)
  await expect(css).toMatch(/#form\s+input\[name=['"]form-1['"]\]/i)
})

test('#form attribute selectors | contains', async ({ page }) => {
  await expect(css).toMatch(/#form\s+input\[name\^=['"]form['"]\]/i)
  await expect(css).toMatch(/#form\s+input\[name\$=['"]end['"]\]/i)
  await expect(css).toMatch(/#form\s+input\[name\*=['"]unique['"]\]/i)
})

test('#form bg colors', async ({ page }) => {
  const inputs = page.locator('#form > input')
  try {
    await expect(inputs.nth(0)).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(inputs.nth(1)).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(inputs.nth(2)).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(inputs.nth(3)).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(inputs.nth(4)).toHaveCSS('background-color', 'rgb(0, 0, 255)')
    await expect(inputs.nth(5)).toHaveCSS('background-color', 'rgb(255, 0, 0)')
    await expect(inputs.nth(6)).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(inputs.nth(7)).toHaveCSS('background-color', 'rgb(255, 255, 0)')
  } catch (error) {
    const items = await inputs.all()
    for (const item of items) {
      await expect(item).toHaveCSS('background-color', 'rgb(255, 192, 203)')
    }
  }
})
