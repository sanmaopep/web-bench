const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('required suffix', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#table tr:nth-child(1) td:nth-child(3) input:required')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::after')
    return {
      content: style.getPropertyValue('content'),
    }
  })

  await expect(before.content.trim()).toEqual('"*"')
})

test('controls', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(3) input`)
  await expect(items.nth(0)).toHaveCSS('background-color', 'rgb(255, 255, 0)')
  await expect(items.nth(1)).toHaveCSS('background-color', 'rgb(0, 128, 0)')
  await expect(items.nth(2)).toHaveCSS('background-color', 'rgb(255, 0, 0)')
})
