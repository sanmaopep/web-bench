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
  await page.locator('.hwb-wheel .wheel').click()
  await expect(page.locator('.hwb-wheel')).toHaveCSS('background-color', 'rgb(0, 255, 255)')
})

test('click .block', async ({ page }) => {
  await expect(page.locator('.hwb-wheel .block')).not.toBeVisible()
  await page.locator('.hwb-wheel .wheel').click()
  await expect(page.locator('.hwb-wheel .block')).toBeVisible()

  const block = await getOffsetByLocator(page.locator('.hwb-wheel .block'))
  const wheel = await getOffsetByLocator(page.locator('.hwb-wheel .wheel'))

  await expect(block.centerX).toBe(wheel.centerX)
  await expect(block.centerY).toBe(wheel.centerY)
})

test('.wheel | hue === 0', async ({ page }) => {
  const wheel = page.locator('.hwb-wheel .wheel')
  const { width } = await getOffsetByLocator(wheel)
  const radius = Math.floor(width / 2)
  const y = radius
  let h = 0
  let l = 0
  const step = 10
  for (let x = 0; x < radius; x += step) {
    await wheel.click({ position: { x, y } })
    const { backgroundColor } = await getComputedStyleByLocator(page.locator('.hwb-wheel'))
    // console.log({ x, y, backgroundColor })
    const hsl = rgbString2hsl(backgroundColor)
    h += hsl[0]
    l += hsl[2]
  }
  h /= radius / step
  l /= radius / step
  // console.log({ h, l })
  await expectTolerance(h, 0, 15)
  await expectTolerance(l, 50, 10)
})

test('.wheel | hue === 180', async ({ page }) => {
  const wheel = page.locator('.hwb-wheel .wheel')
  const { width } = await getOffsetByLocator(wheel)
  const radius = Math.floor(width / 2)
  const y = radius
  let h = 0
  let l = 0
  const step = 10
  for (let x = radius; x < width; x += step) {
    await wheel.click({ position: { x, y } })
    const { backgroundColor } = await getComputedStyleByLocator(page.locator('.hwb-wheel'))
    // console.log({ x, y, backgroundColor })
    const hsl = rgbString2hsl(backgroundColor)
    h += hsl[0]
    l += hsl[2]
  }
  h /= radius / step
  l /= radius / step
  // console.log({ h, s, l })
  await expectTolerance(h, 180, 15)
  await expectTolerance(l, 50, 10)
})
