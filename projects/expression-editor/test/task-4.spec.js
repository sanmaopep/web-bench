const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Uppercase in toolbar', async ({ page }) => {
  const editor = page.locator('#editor')
  
  await editor.pressSequentially('foo', { delay: 10 })

  expect(await page.getByText('foo', { exact: true }).count()).toBeGreaterThanOrEqual(1)

  await page.keyboard.press('Shift+ArrowLeft+ArrowLeft+ArrowLeft')

  await page.getByText('Uppercase').click()

  await expect(page.getByText('foo', { exact: true })).not.toBeVisible()
  expect(await page.getByText('FOO', { exact: true }).count()).toBeGreaterThanOrEqual(1)
})