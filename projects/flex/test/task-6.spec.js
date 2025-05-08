const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 800px', () => {
  test.use({ viewport: { width: 800, height: 720 } })

  test('menu items at right', async ({ page }) => {
    await expect(page.locator('.menu')).toBeVisible()
  })

  test('logo visible', async ({ page }) => {
    await expect(page.locator('.logo')).toBeVisible()
  })
})

test.describe('page width 799px', () => {
  test.use({ viewport: { width: 799, height: 720 } })

  test('logo not visible', async ({ page }) => {
    await expect(page.locator('.logo')).toBeAttached()
    await expect(page.locator('.logo')).not.toBeVisible()
  })

  test('menu items space-evenly', async ({ page }) => {
    const offset = await getOffset(page, '.menu > *:nth-child(2)')
    const menuWidth = (await getOffset(page, '.menu')).width
    
    // nearly at the center
    expect(offset.centerX / menuWidth).toBeGreaterThan(0.4)
    expect(offset.centerX / menuWidth).toBeLessThan(0.6)
  })
})
