const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Fill fo"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('fo', {
    delay: 50,
  })

  expect(await page.getByText('foo', { exact: true }).count()).toBe(1)
  expect(await page.getByText('fooooo', { exact: true }).count()).toBe(1)

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo')

  await editor.pressSequentially(' an', {
    delay: 50,
  })

  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo AND')

  await editor.pressSequentially(' ba', {
    delay: 50,
  })

  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Enter')

  await expect(editor).toHaveText('foo AND barrrr')
})