const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('toggle button position', async ({ page }) => {
  const toggleOffset = await (
    await page.locator('button#toggle')
  ).evaluate((element) => {
    /** @see https://stackoverflow.com/a/28222246/1835843 */
    function getOffset(el) {
      const rect = el.getBoundingClientRect()
      return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      }
    }
    return getOffset(element)
  })

  // https://playwright.dev/docs/api/class-browser#browser-new-context-option-viewport
  // default viewport is { width: 1280, height: 720 }
  const bodyStyle = await (
    await page.locator('body')
  ).evaluate((element) => window.getComputedStyle(element))
  const bodyWidth = parseFloat(bodyStyle.width)
  const bodyHeight = parseFloat(bodyStyle.height)

  // console.log('toggleOffset', toggleOffset)
  // console.log('body.width/height', bodyWidth, bodyHeight)
  await expect(toggleOffset.top / bodyHeight > 0.5).toBeTruthy()
})
