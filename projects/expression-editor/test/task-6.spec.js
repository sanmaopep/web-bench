const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Paren auto closing', async ({ page }) => {
  const editor = page.locator('#editor')
  await editor.click()
  await editor.press('(')
  expect(await editor.textContent()).toBe('()')
})