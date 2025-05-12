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
const { getOffsetByLocator, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const buttonTexts = ['Add Blog', 'Read Blogs', 'Theme']

test.describe('Check Switch To Pages Animation', () => {
  for (const buttonText of buttonTexts) {
    test(`Check Button ${buttonText} Clicked`, async ({ page }) => {
      const header = page.locator('.site-header')
      const button = header.locator(`button:has-text("${buttonText}")`)
      await button.click()

      // site main switched to related Page
      const main = page.locator('.site-main')

      // Get The elements in main
      const h1 = main.locator(`h1:has-text("${buttonText}")`)

      // Page is initially in the right of the screen
      const offset1 = await getOffsetByLocator(h1)
      expect(offset1.centerX).toBeGreaterThan(page.viewportSize().width / 2)

      await sleep(1000)

      // Page is moved from right to left
      const offset2 = await getOffsetByLocator(h1)
      expect(offset2.centerX).toBeLessThan(offset1.centerX)
    })
  }
})
