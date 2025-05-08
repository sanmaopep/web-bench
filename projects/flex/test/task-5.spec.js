const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 800px', () => {
  test.use({ viewport: { width: 800, height: 720 } })

  test('leftbar visible', async ({ page }) => {
    await expect(page.locator('.leftbar')).toBeVisible()
  })
})

test.describe('page width 799px', () => {
  test.use({ viewport: { width: 799, height: 720 } })

  test('leftbar not visible', async ({ page }) => {
    await expect(page.locator('.leftbar')).toBeAttached()
    await expect(page.locator('.leftbar')).not.toBeVisible()
  })
})
