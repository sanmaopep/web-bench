const { test, expect } = require('@playwright/test')
const { getComputedStyle, getOffset, getHtmlElement } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test.describe('page width 400px', () => {
  test.use({ viewport: { width: 400, height: 720 } })

  test('rightbar at the right of main block', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')

    expect(contentStyle.left).toBe(0)
    expect(contentStyle.right).toBe(rightbarStyle.left)
  })

  test('rightbar + content === page width', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')
    const bodyStyle = await getOffset(page, 'body')

    expect(rightbarStyle.width + contentStyle.width).toBe(bodyStyle.width)
  })
})

test.describe('page width 399px', () => {
  test.use({ viewport: { width: 399, height: 720 } })

  test('rightbar at the bottom of main block', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')

    expect(rightbarStyle.left).toBe(0)
    expect(contentStyle.left).toBe(0)
    expect(rightbarStyle.top).toBe(contentStyle.bottom)
  })

  test('rightbar and content has page width', async ({ page }) => {
    const rightbarStyle = await getOffset(page, '.rightbar')
    const contentStyle = await getOffset(page, '.content')
    const bodyStyle = await getOffset(page, 'body')

    expect(contentStyle.width).toBe(rightbarStyle.width)
    expect(contentStyle.width).toBe(bodyStyle.width)
  })
})
