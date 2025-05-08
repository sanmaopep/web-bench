const { test, expect } = require('@playwright/test')
const { getOffsetByLocator, getComputedStyleByLocator, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const buttonTexts = ['Add Blog', 'Read Blogs', 'Theme']

test.describe('Check Button Hovered', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Hovered`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)

      await button.hover()

      // Transition Added, slow down the test
      await sleep(1000)

      const style = await getComputedStyleByLocator(button)

      expect(Number(style.opacity)).toBeCloseTo(0.7)
    })
  }
})

test.describe('Check Button Focused', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Focused`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)

      const beforeSize = await getOffsetByLocator(button)

      await button.focus()

      // Transition Added, slow down the test
      await sleep(1000)

      const afterSize = await getOffsetByLocator(button)

      expect(afterSize.width).toBeCloseTo(beforeSize.width * 1.2)
      expect(afterSize.height).toBeCloseTo(beforeSize.height * 1.2)
    })
  }
})
