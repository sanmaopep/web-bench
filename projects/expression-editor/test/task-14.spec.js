const { test, expect } = require('@playwright/test')

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

  await editor.locator('.diagnostic-error').nth(0).hover()

  expect(await page.getByText(/Operator should be uppercase/).count()).toBe(1)
})