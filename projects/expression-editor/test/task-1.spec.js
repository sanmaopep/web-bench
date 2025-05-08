const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

const delay = 10

test('Initialize', async ({ page }) => {
  const editor = page.locator('#editor')
  await expect(editor).toBeVisible()
  await editor.pressSequentially('hello', {
    delay,
  })
  await expect(editor).toHaveText('hello')
})