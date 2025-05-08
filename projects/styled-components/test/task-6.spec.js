const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const buttonTexts = ['Add Blog', 'Read Blogs', 'Theme']

test.describe('Check Switch To Pages', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Clicked`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)
      await button.click()

      // site main switched to related Page
      const main = page.locator('.site-main')
      await expect(main.locator(`h1:has-text("${buttonText}")`)).toBeVisible()
    })
  }
})
