const { test, expect } = require('@playwright/test')
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

const delay = 10

test(`undo/redo`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo a', {
    delay,
  })

  await page.keyboard.press(`Enter`)

  await expect(editor).toHaveText('foo AND')

  await page.keyboard.press(`ControlOrMeta+z`)

  await expect(editor).toHaveText('foo a')

  await page.keyboard.press(`ControlOrMeta+z`)

  await expect(editor).toHaveText('foo ')

  await page.keyboard.press(`ControlOrMeta+y`)

  await expect(editor).toHaveText('foo a')

  await page.keyboard.press(`ControlOrMeta+y`)

  await expect(editor).toHaveText('foo AND')
})

test(`highlight should work after undo`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo a', {
    delay,
  })

  await page.keyboard.press(`Enter`)

  await expect(editor).toHaveText('foo AND')

  await page.keyboard.press(`ControlOrMeta+z`)

  await expect(editor).toHaveText('foo a')

  expect(
    toHexColor(
      await getColor(editor.getByText(/foo/))
    )
  ).toBe('#0000ff') // blue
})

test(`cursor should work correctly after undo`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo a', {
    delay,
  })

  await page.keyboard.press(`Enter`)

  await expect(editor).toHaveText('foo AND')

  await page.keyboard.press(`ControlOrMeta+z`)

  await expect(editor).toHaveText('foo a')

  await page.keyboard.press(`b`)

  await expect(editor).toHaveText('foo ab')
})

async function getColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color')
  })
}

function toHexColor(color) {
  return tinycolor(color).toHexString().toLowerCase()
}