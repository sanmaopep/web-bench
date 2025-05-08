const { test, expect } = require('@playwright/test')
const {
  getComputedStyleByLocator,
  getOffsetByLocator,
  getViewport,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('#changeTheme', async ({ page }) => {
  const button = page.locator('#changeTheme')
  await expect(button).toBeVisible()

  const buttonOffset = await getOffsetByLocator(button)
  const viewport = await getViewport(page)
  await expectTolerance(buttonOffset.centerX, viewport.width / 2)
  await expectTolerance(buttonOffset.centerY, viewport.height - buttonOffset.height)
})

test('light-dark()', async ({ page }) => {
  const css = await page.evaluate(() => {
    function getActiveStylesheetContent() {
      let cssText = ''
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          if (sheet.disabled) return
          Array.from(sheet.cssRules || sheet.rules).forEach((rule) => {
            cssText += rule.cssText + '\n'
          })
        } catch (e) {
          console.warn(`Could not access stylesheet: ${sheet.href}`, e)
        }
      })

      return cssText
    }

    return getActiveStylesheetContent()
  })

  // console.log('[css]', css)
  await expect(css.includes('color-scheme')).toBeTruthy()
  await expect(css.includes('light-dark')).toBeTruthy()
})

test('click #changeTheme', async ({ page }) => {
  await page.locator('body').evaluate((body) => {
    body.style.transition = 'none'
  })
  const body0 = await getComputedStyleByLocator(page.locator('body'))

  await page.locator('#changeTheme').click()
  const body1 = await getComputedStyleByLocator(page.locator('body'))

  await page.locator('#changeTheme').click()
  const body2 = await getComputedStyleByLocator(page.locator('body'))

  await expect(body0.backgroundColor).not.toBe(body1.backgroundColor)
  await expect(body2.backgroundColor).not.toBe(body1.backgroundColor)
  await expect(body2.backgroundColor).toBe(body0.backgroundColor)
})
