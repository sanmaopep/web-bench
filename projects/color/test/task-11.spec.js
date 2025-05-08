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

function getLightness(color) {
  // Extract RGB values from "rgb(r, g, b)" format
  const rgb = color.match(/\d+/g).map(Number)

  // Convert RGB to HSL
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])

  // Return the lightness value (0-100)
  return hsl[2]
}

function rgbToHsl(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return [0, 0, l * 100] // No saturation, grayscale color
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    (max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60

  return [h, s * 100, l * 100] // Return [Hue, Saturation, Lightness]
}

test('color contrast ratio', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.result').first())
  // console.log(style.color, style.backgroundColor)
  const colorLightness = getLightness(style.color)
  const bgLightness = getLightness(style.backgroundColor)
  const contrast = Math.max(colorLightness, bgLightness) / Math.min(colorLightness, bgLightness)
  // console.log({ contrast, colorLightness, bgLightness })

  await expect(contrast).toBeGreaterThan(4.5)
})

test('color contrast ratio | dark', async ({ page }) => {
  await page.locator('#changeTheme').click()

  const style = await getComputedStyleByLocator(page.locator('.result').first())
  const colorLightness = getLightness(style.color)
  const bgLightness = getLightness(style.backgroundColor)
  const contrast = Math.max(colorLightness, bgLightness) / Math.min(colorLightness, bgLightness)
  // console.log({ contrast, colorLightness, bgLightness })

  await expect(contrast).toBeGreaterThan(4.5)
})
