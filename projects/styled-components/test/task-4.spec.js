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
const { getOffsetByLocator, getComputedStyleByLocator, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const buttonTexts = ['Add Blog', 'Read Blogs', 'Theme']

test.describe('Check Button Hovered', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Hovered`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)

      await button.hover()

      // Transition Added, slow down the test
      await sleep(1000)

      const style = await getComputedStyleByLocator(button)

      expect(Number(style.opacity)).toBeCloseTo(0.7)
    })
  }
})

test.describe('Check Button Focused', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Focused`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)

      const beforeSize = await getOffsetByLocator(button)

      await button.focus()

      // Transition Added, slow down the test
      await sleep(1000)

      const afterSize = await getOffsetByLocator(button)

      expect(afterSize.width).toBeCloseTo(beforeSize.width * 1.2)
      expect(afterSize.height).toBeCloseTo(beforeSize.height * 1.2)
    })
  }
})
