const { test, expect } = require('@playwright/test')
const { setTimeout } = require('timers/promises')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Editor height should fit its content', async ({ page }) => {
  const editor = page.locator('#editor')
  const height = await editor.evaluate((el) => {
    return parseInt(getComputedStyle(el).height)
  })
  expect(height).toBe(100)

  for (let i = 0; i < 6; i++) {
    await editor.fill('very_long_content'.repeat(100))
  }

  const textContent = await editor.textContent()

  expect(textContent.match(/very_long_content/g)?.length).toBe(100)

  const newHeight = await editor.evaluate((el) => {
    return parseInt(getComputedStyle(el).height)
  })
  expect(newHeight).toBeGreaterThan(100)
})