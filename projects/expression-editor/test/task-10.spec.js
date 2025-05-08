const { test, expect } = require('@playwright/test')
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Syntax highlight should work - foo AND bar`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo AND bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo AND bar')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
  expect(
    toHexColor(
      await getColor(editor.getByText(/AND/))
    )
  ).toBe('#00ff00') // green
  expect(
    toHexColor(
      await getColor(editor.getByText(/bar/))
    )
  ).toBe('#0000ff') // blue
})

test(`Syntax highlight should work - foo and bar`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo and bar')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
  expect(
    toHexColor(
      await getColor(editor.getByText(/bar/))
    )
  ).toBe('#0000ff') // blue
})

async function getColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color')
  })
}

function toHexColor(color) {
  return tinycolor(color).toHexString().toLowerCase()
}