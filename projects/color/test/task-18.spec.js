const { test, expect } = require('@playwright/test')
const { getCSSText, getCssRawText, rgb2hsl } = require('./util/index')
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
  await expect(page.locator('.color.hwb-wheel')).toBeAttached()
})

test('.wheel | hue === 0', async ({ page }) => {
  await expect(page.locator('.hwb-wheel canvas.wheel')).toBeAttached()

  const [data, width, height] = await page
    .locator('.hwb-wheel canvas.wheel')
    .evaluate((/** @type {HTMLCanvasElement} */ canvas) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return [[], 0, 0]

      return [ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height]
    })

  const radius = Math.floor(width / 2)
  const i = radius * width * 4
  let h = 0
  let s = 0
  let l = 0
  for (let j = 0; j < radius; j++) {
    const k = i + j * 4
    const hsl = rgb2hsl(data[k], data[k + 1], data[k + 2])
    h += hsl[0]
    s += hsl[1]
    l += hsl[2]
  }
  h /= radius
  s /= radius
  l /= radius
  // console.log({ h, s, l })
  await expectTolerance(h, 0, 5)
  await expectTolerance(s, 100, 5)
  await expectTolerance(l, 50, 5)
})

test('.wheel | hue === 90', async ({ page }) => {
  await expect(page.locator('.hwb-wheel canvas.wheel')).toBeAttached()

  const [data, width] = await page
    .locator('.hwb-wheel canvas.wheel')
    .evaluate((/** @type {HTMLCanvasElement} */ canvas) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return [[], 0, 0]

      return [ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height]
    })

  const radius = Math.floor(width / 2)
  const i = radius
  let h = 0
  let s = 0
  let l = 0
  for (let j = 0; j < radius; j++) {
    const k = (i + j * width) * 4
    const hsl = rgb2hsl(data[k], data[k + 1], data[k + 2])
    h += hsl[0]
    s += hsl[1]
    l += hsl[2]
  }
  h /= radius
  s /= radius
  l /= radius
  // console.log({ h, s, l })
  await expectTolerance(h, 90, 5)
  await expectTolerance(s, 100, 5)
  await expectTolerance(l, 50, 5)
})
