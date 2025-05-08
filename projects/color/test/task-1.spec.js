const { test, expect } = require('@playwright/test')
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('default bg', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.color.rgb'))
  await expect(style.backgroundColor).toBe('rgb(0, 0, 0)')
})

test('change props to show result', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.locator('.rgb .prop').nth(0).fill('128')
    await expect(page.locator('.rgb .result').nth(0)).toContainText('128')
  }

  await page.locator('.rgb .prop').nth(3).fill('0.5')
  await expect(page.locator('.rgb .result').nth(3)).toContainText('0.5')
})
