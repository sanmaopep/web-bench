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
const {
  getOffsetByLocator,
  parseColorToHex,
  getComputedStyleByLocator,
  sleep,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Button in Footer', async ({ page }) => {
  const footer = page.locator('.site-footer')
  const button = footer.locator('button:has-text("My Friends")')

  await expect(button).toBeVisible()

  const style = await getComputedStyleByLocator(button)

  expect(parseColorToHex(style.color)).toBe('#0095ee')
  // backgroundColor is transparent
  expect(parseColorToHex(style.backgroundColor)).not.toBe('#0095ee')
})

test.describe('Check Button in Footer has the same behavior as previous Header', () => {
  let button

  test.beforeEach(async ({ page }) => {
    const footer = page.locator('.site-footer')
    button = footer.locator('button:has-text("My Friends")')
  })

  test('Check Button Hovered', async () => {
    await button.hover()
    // Transition Added, slow down the test
    await sleep(1000)

    const style = await getComputedStyleByLocator(button)

    expect(Number(style.opacity)).toBeCloseTo(0.7)
  })

  test('Check Button Focused', async () => {
    const beforeSize = await getOffsetByLocator(button)
    await button.focus()

    // Transition Added, slow down the test
    await sleep(1000)

    const afterSize = await getOffsetByLocator(button)

    expect(afterSize.width).toBeCloseTo(beforeSize.width * 1.2)
    expect(afterSize.height).toBeCloseTo(beforeSize.height * 1.2)
  })
})
