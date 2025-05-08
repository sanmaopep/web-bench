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

test('click .wheel', async ({ page }) => {
  await page.locator('.hsl-wheel .wheel').click()
  await expect(page.locator('.hsl-wheel')).toHaveCSS('background-color', 'rgb(128, 128, 128)')
})

test('click .block', async ({ page }) => {
  await expect(page.locator('.hsl-wheel .block')).not.toBeVisible()

  const wheel = await getOffsetByLocator(page.locator('.hsl-wheel .wheel'))
  await page
    .locator('.hsl-wheel .wheel')
    .click({ position: { x: wheel.width / 2, y: wheel.height / 2 } })
  await expect(page.locator('.hsl-wheel .block')).toBeVisible()
  const block = await getOffsetByLocator(page.locator('.hsl-wheel .block'))

  // console.log({ wheel, block })
  await expect(block.centerX).toBe(wheel.centerX)
  await expect(block.centerY).toBe(wheel.centerY)
})

test('.wheel | hue === 0', async ({ page }) => {
  const wheel = page.locator('.hsl-wheel .wheel')
  const { width } = await getOffsetByLocator(wheel)
  const radius = Math.floor(width / 2)
  const y = radius
  let h = 0
  let s = 0
  let l = 0
  const step = 10
  for (let x = 0; x < radius; x += step) {
    await wheel.click({ position: { x, y } })
    const { backgroundColor } = await getComputedStyleByLocator(page.locator('.hsl-wheel'))
    // console.log({ x, y, backgroundColor })
    const hsl = rgbString2hsl(backgroundColor)
    h += hsl[0]
    s += hsl[1]
    l += hsl[2]
  }
  h /= radius / step
  s /= radius / step
  l /= radius / step
  // console.log({ h, s, l })
  await expectTolerance(h, 0, 15)
  await expectTolerance(s, 50, 15)
  await expectTolerance(l, 50, 15)
})

test('.wheel | hue === 180', async ({ page }) => {
  const wheel = page.locator('.hsl-wheel .wheel')
  const { width } = await getOffsetByLocator(wheel)
  const radius = Math.floor(width / 2)
  const y = radius
  let h = 0
  let s = 0
  let l = 0
  const step = 10
  for (let x = radius; x < width; x += step) {
    await wheel.click({ position: { x, y } })
    const { backgroundColor } = await getComputedStyleByLocator(page.locator('.hsl-wheel'))
    // console.log({ x, y, backgroundColor })
    const hsl = rgbString2hsl(backgroundColor)
    h += hsl[0]
    s += hsl[1]
    l += hsl[2]
  }
  h /= radius / step
  s /= radius / step
  l /= radius / step
  // console.log({ h, s, l })
  await expectTolerance(h, 180, 15)
  await expectTolerance(s, 50, 15)
  await expectTolerance(l, 50, 15)
})
