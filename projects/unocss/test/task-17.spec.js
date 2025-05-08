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

test('footer info one line', async ({ page }) => {
  await expectOneLine(page, '.footer-info')
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('footer info one line', async ({ page }) => {
    await expectOneLine(page, '.footer-info')
  })

  test('footer width', async ({ page }) => {
    const footer = await getOffset(page, '.footer')
    const body = await getOffset(page, 'body')

    expect(footer.width).toBeCloseTo(body.width, 5)
  })
})
