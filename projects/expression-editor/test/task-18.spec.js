const { test, expect } = require('@playwright/test')
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Autocompletion`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and ba', {
    delay: 50,
  })

  expect(await page.getByText('bar', { exact: true }).count()).toBe(1)
  expect(await page.getByText('barrrr', { exact: true }).count()).toBe(1)

  await page.getByText('barrrr').click()

  await expect(editor).toHaveText('foo and barrrr')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
  expect(
    toHexColor(
      await getColor(editor.getByText(/and/))
    )
  ).toBe('#00ff00') // green
  expect(
    toHexColor(
      await getColor(editor.getByText(/barrrr/))
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