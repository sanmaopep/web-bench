const { test, expect } = require('@playwright/test')
const { getCSSText, getCssRawText } = require('./util/index')
const {
  getComputedStyleByLocator,
  getOffsetByLocator,
  getViewport,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('relative color', async ({ page }) => {
  const css = await getCssRawText(page)
  // console.log('[css]', css)

  await expect(/hsl\s*\(\s*from/i.test(css)).toBeTruthy()
})
