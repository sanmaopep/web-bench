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

test('.lch-wheel', async ({ page }) => {
  await expect(page.locator('.color.lch-wheel')).toBeAttached()
})

test('.wheel | hue === 0', async ({ page }) => {
  await expect(page.locator('.lch-wheel canvas.wheel')).toBeAttached()

  const [data, width, height] = await page
    .locator('.lch-wheel canvas.wheel')
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
    const lch = rgb2hsl(data[k], data[k + 1], data[k + 2])
    h += lch[0]
    s += lch[1]
    l += lch[2]
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
  await expect(page.locator('.lch-wheel canvas.wheel')).toBeAttached()

  const [data, width] = await page
    .locator('.lch-wheel canvas.wheel')
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
    const lch = rgb2hsl(data[k], data[k + 1], data[k + 2])
    h += lch[0]
    s += lch[1]
    l += lch[2]
  }
  h /= radius
  s /= radius
  l /= radius
  // console.log({ h, s, l })
  await expectTolerance(h, 90, 5)
  await expectTolerance(s, 100, 5)
  await expectTolerance(l, 50, 5)
})
