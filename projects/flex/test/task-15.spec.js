const { test, expect } = require('@playwright/test')
const {
  getOffset,
  getComputedStyle,
  getMarginBox,
  expectTolerance,
  expectOneLine,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test("content 12 card's children", async ({ page }) => {
  await expect(page.locator('.card-image')).toHaveCount(12)
  await expect(page.locator('.card-title')).toHaveCount(12)
  await expect(page.locator('.card-price')).toHaveCount(12)
})

test('content 12 card', async ({ page }) => {
  await expectOneLine(page, '.card-title')
})

test.describe('page width 899px', () => {
  test.use({ viewport: { width: 899, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})

test.describe('page width 799px', () => {
  test.use({ viewport: { width: 799, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})

test.describe('page width 699px', () => {
  test.use({ viewport: { width: 699, height: 720 } })

  test('content 2 cards/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerY).toBe(c2.centerY)
    expect(c1.centerX).toBe(c3.centerX)
  })
})
