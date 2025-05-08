const { test, expect } = require('@playwright/test')
const { getOffsetByLocator, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const buttonTexts = ['Add Blog', 'Read Blogs', 'Theme']

test.describe('Check Switch To Pages Animation', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Clicked`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)
      await button.click()

      // site main switched to related Page
      const main = page.locator('.site-main')

      // Get The elements in main
      const h1 = main.locator(`h1:has-text("${buttonText}")`)

      // Page is initially in the right of the screen
      const offset1 = await getOffsetByLocator(h1)
      expect(offset1.centerX).toBeGreaterThan(page.viewportSize().width / 2)

      await sleep(1000)

      // Page is moved from right to left
      const offset2 = await getOffsetByLocator(h1)
      expect(offset2.centerX).toBeLessThan(offset1.centerX)
    })
  }
})
