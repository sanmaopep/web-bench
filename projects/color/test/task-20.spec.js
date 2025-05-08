const { test, expect } = require('@playwright/test')
const { getCSSText, getCssRawText, rgb2hsl, rgbString2hsl } = require('./util/index')
const {
  getComputedStyleByLocator,
  getOffsetByLocator,
  getViewport,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.hwb-wheel', async ({ page }) => {
  await expect(page.locator('.color.hwb-wheel .w')).toBeAttached()
  await expect(page.locator('.color.hwb-wheel .w')).toHaveValue('0')
  await expect(page.locator('.color.hwb-wheel .b')).toBeAttached()
  await expect(page.locator('.color.hwb-wheel .b')).toHaveValue('0')
})

test('.wheel | only change .l .c', async ({ page }) => {
  await page.locator('.color.hwb-wheel .w').fill('10')
  await page.locator('.color.hwb-wheel .b').fill('20')
  await expect(page.locator('.hwb-wheel')).toHaveCSS('background-color', 'rgb(204, 26, 26)')
})

test('.wheel | hue === 90', async ({ page }) => {
  await page.locator('.color.hwb-wheel .w').fill('10')
  await page.locator('.color.hwb-wheel .b').fill('20')

  const color = page.locator('.hwb-wheel')
  const wheel = page.locator('.hwb-wheel .wheel')

  await wheel.click({ position: { x: 0, y: 100 } })
  await expect(color).toHaveCSS('background-color', 'rgb(204, 26, 26)')
  
  await wheel.click({ position: { x: 100, y: 0 } })
  await expect(color).toHaveCSS('background-color', 'rgb(115, 204, 26)')
  
  await wheel.click({ position: { x: 180, y: 100 } })
  await expect(color).toHaveCSS('background-color', 'rgb(26, 204, 204)')
  
  await wheel.click({ position: { x: 100, y: 180 } })
  await expect(color).toHaveCSS('background-color', 'rgb(115, 26, 204)')
})
