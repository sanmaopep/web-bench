const { test, expect } = require('@playwright/test')
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Fill "foo and bar"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo and bar')

  expect(await editor.locator('.diagnostic-error').count()).toBe(1)
  await expect(editor.locator('.diagnostic-error').nth(0)).toHaveText('and')

  expect(
    toHexColor(
      await getBorderBottomColor(editor.locator('.diagnostic-error').nth(0))
    )
  ).toBe('#ff0000') // red
})

async function getBorderBottomColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border-bottom-color')
  })
}

function toHexColor(color) {
  return tinycolor(color).toHexString().toLowerCase()
}