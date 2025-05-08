const { test, expect } = require('@playwright/test')
const { getOffset, getComputedStyle, getMarginBox, expectTolerance } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 999px', () => {
  test.use({ viewport: { width: 999, height: 720 } })

  test('content 12 cards', async ({ page }) => {
    await expect(page.locator('.content > .card')).toHaveCount(12)
  })
  
  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})
