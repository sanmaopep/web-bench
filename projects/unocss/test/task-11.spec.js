const { test, expect } = require('@playwright/test')
const {
  getComputedStyle,
  getOffset,
  getHtmlElement,
  getBox,
  getMarginBox,
  expectBetween,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('rightbar 2 columns', async ({ page }) => {
    const c1 = await getOffset(page, '.rightbar > *:nth-child(1)')
    const c2 = await getOffset(page, '.rightbar > *:nth-child(2)')
    expect(c1.centerY).toBe(c2.centerY)
  })

  test('rightbar 3 rows', async ({ page }) => {
    const c1 = await getOffset(page, '.rightbar > *:nth-child(1)')
    const c3 = await getOffset(page, '.rightbar > *:nth-child(3)')
    const c5 = await getOffset(page, '.rightbar > *:nth-child(5)')
    expect(c1.centerX).toBe(c3.centerX)
    expect(c3.centerX).toBe(c5.centerX)
  })

  test('rightbar top 6 cells visible', async ({ page }) => {
    const elements = await page.locator('.rightbar > *').all()
    for (let i = 0; i < elements.length; i++) {
      if (i < 6) await expect(elements[i]).toBeVisible()
      else {
        await expect(elements[i]).toBeAttached()
        await expect(elements[i]).not.toBeVisible()
      }
    }
  })

  test('rightbar 3 rows height', async ({ page }) => {
    const c1 = await getComputedStyle(page, '.rightbar > *:nth-child(1)')
    const c3 = await getComputedStyle(page, '.rightbar > *:nth-child(3)')
    const c5 = await getComputedStyle(page, '.rightbar > *:nth-child(5)')
    const rightbar = await getOffset(page, '.rightbar')
    expectTolerance(
      getMarginBox(c1).height + getMarginBox(c3).height + getMarginBox(c5).height,
      rightbar.height,
      5
    )
  })
})
