const { test, expect } = require('@playwright/test')
const { getOffset, getComputedStyle, getMarginBox, expectTolerance } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 599px', () => {
  test.use({ viewport: { width: 599, height: 720 } })

  test('content 12 cards', async ({ page }) => {
    await expect(page.locator('.content > .card')).toHaveCount(12)
  })

  test('content 1 card/row', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const c2 = await getOffset(page, '.content > *:nth-child(2)')
    const c3 = await getOffset(page, '.content > *:nth-child(3)')
    expect(c1.centerX).toBe(c2.centerX)
    expect(c2.centerX).toBe(c3.centerX)
  })

  test('content scroll', async ({ page }) => {
    const c1 = await getOffset(page, '.content > *:nth-child(1)')
    const content = page.locator('.content')
    // scroll
    const scroll = await content.evaluate((el) => {
      el.scrollTo(0, 400)

      return {
        top: el.scrollTop,
        left: el.scrollLeft,
        scrollHeight: el.scrollHeight,
      }
    })

    // expect(scroll.left).toBe(0)
    // FIXME why scroll.top === 0
    // expect(scroll.top).toBe(400)
    expectTolerance(c1.height * 12, scroll.scrollHeight, 5)
  })
})
