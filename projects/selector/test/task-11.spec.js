const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('do not use !important', async ({ page }) => {
  await expect(css).not.toContain('!important')
})

test('no content', async ({ page }) => {
  const before = await page.evaluate(() => {
    const element = document.querySelector('#table tr td')
    // @ts-ignore
    const style = window.getComputedStyle(element, '::before')
    return {
      content: style.getPropertyValue('content'),
    }
  })

  await expect(before.content.trim()).toEqual('"><"')
})

test('td', async ({ page }) => {
  await expect(page.locator(`#table tr:nth-child(4) td:nth-child(3)`)).toHaveCSS(
    'background-color',
    'rgb(211, 211, 211)'
  )
})
