const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const testCases = [
  {
    button: 'Add Blog',
    tooltip: '🪄',
  },
  {
    button: 'Read Blogs',
    tooltip: '🍉',
  },
  {
    button: 'Theme',
    tooltip: '🎨',
  },
]

for (const testCase of testCases) {
  test.describe(`Test ${testCase.button} Tooltip`, () => {
    let btn

    test.beforeEach(async ({ page }) => {
      btn = page.locator(`header button:has-text("${testCase.button}")`)
      await btn.hover()
    })

    test('Check Tooltip Visible With Text', async ({ page }) => {
      const tooltip = page.locator('.tooltip')
      await expect(tooltip).toHaveText(testCase.tooltip)
    })

    test('Check Tooltip Appended to Body', async ({ page }) => {
      const parentIsBody = await page.evaluate(() => {
        const tooltip = document.querySelector('.tooltip')
        return (
          tooltip.parentElement === document.body ||
          // For some reason, tooltip is wrapped by a div
          tooltip.parentElement?.parentElement === document.body
        )
      })

      expect(parentIsBody).toBe(true)
    })

    test('Check Tooltip Position', async ({ page }) => {
      const c1 = await getOffsetByLocator(btn)
      const c2 = await getOffsetByLocator(page.locator('.tooltip'))
      const deltaY = c2.top - c1.bottom
      const deltaX = c2.centerX - c1.centerX

      expect(deltaY).toBeLessThanOrEqual(100)
      expect(deltaX).toBeLessThanOrEqual(100)
    })
  })
}
