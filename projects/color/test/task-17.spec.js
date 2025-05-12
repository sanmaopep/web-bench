// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { test, expect } = require('@playwright/test')
const { getCSSText, getCssRawText, rgb2hsl, rgbString2hsl, lchString2lch } = require('./util/index')
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
  await expect(page.locator('.color.lch-wheel .l')).toBeAttached()
  await expect(page.locator('.color.lch-wheel .l')).toHaveValue('50')
  await expect(page.locator('.color.lch-wheel .c')).toBeAttached()
  await expect(page.locator('.color.lch-wheel .c')).toHaveValue('50')
})

test('.wheel | only change .l .c', async ({ page }) => {
  await page.locator('.color.lch-wheel .l').fill('70')
  await page.locator('.color.lch-wheel .c').fill('30')
  const { backgroundColor } = await getComputedStyleByLocator(page.locator('.lch-wheel'))
  const lch = lchString2lch(backgroundColor)
  await expect(lch[0]).toBe(70)
  await expect(lch[1]).toBe(30)
  await expect(lch[2]).toBe(0)
})

test('.wheel | .l === 70 | hue === 0', async ({ page }) => {
  await page.locator('.color.lch-wheel .l').fill('70')

  const [data, width] = await page
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
  await expectTolerance(l, 70, 5)
})

test('.wheel | .l === 30 | hue === 90', async ({ page }) => {
  await page.locator('.color.lch-wheel .l').fill('30')

  const [data, width, height] = await page
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
  await expectTolerance(l, 30, 5)
})

test('.wheel | .l === 70 | hue === 0 | click', async ({ page }) => {
  await page.locator('.color.lch-wheel .l').fill('70')
  await page.locator('.color.lch-wheel .c').fill('30')

  const wheel = page.locator('.lch-wheel .wheel')
  const { width } = await getOffsetByLocator(wheel)
  const radius = Math.floor(width / 2)
  const y = radius
  let l = 0
  let c = 0
  let h = 0
  const step = 10
  for (let x = 0; x < radius; x += step) {
    await wheel.click({ position: { x, y } })
    const { backgroundColor } = await getComputedStyleByLocator(page.locator('.lch-wheel'))
    // console.log({ x, y, backgroundColor })
    const lch = lchString2lch(backgroundColor)
    l += lch[0]
    c += lch[1]
    h += lch[2]
  }
  l /= radius / step
  c /= radius / step
  h /= radius / step
  // console.log({ h, s, l })
  await expectTolerance(l, 70, 15)
  await expectTolerance(c, 30, 15)
  await expectTolerance(h, 0, 15)
})
