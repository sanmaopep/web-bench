const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('fix display width', async ({ page }) => {
  const displayWidth = await (
    await page.locator('#display')
  ).evaluate((element) => {
    const style = window.getComputedStyle(element)
    return style.boxSizing === 'border-box'
      ? parseFloat(style.width)
      : parseFloat(style.width) +
          parseFloat(style.paddingLeft) +
          parseFloat(style.paddingRight) +
          parseFloat(style.borderLeftWidth) +
          parseFloat(style.borderRightWidth)
  })

  const buttonsWidth = await (
    await page.locator('.buttons')
  ).evaluate((element) => {
    return parseFloat(window.getComputedStyle(element).width)
  })

  // console.log('displayWidth', displayWidth)
  // console.log('buttonsWidth', buttonsWidth)
  await expect(displayWidth).toBe(buttonsWidth)
})
