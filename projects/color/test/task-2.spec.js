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
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('change props to change bg', async ({ page }) => {
  await page.locator('.rgb .prop').nth(0).fill('128')
  await expect(page.locator('.rgb .result').nth(0)).toContainText('128')
  let style = await getComputedStyleByLocator(page.locator('.rgb'))
  await expect(style.backgroundColor).toBe('rgb(128, 0, 0)')

  await page.locator('.rgb .prop').nth(1).fill('128')
  await expect(page.locator('.rgb .result').nth(1)).toContainText('128')
  style = await getComputedStyleByLocator(page.locator('.rgb'))
  await expect(style.backgroundColor).toBe('rgb(128, 128, 0)')

  await page.locator('.rgb .prop').nth(2).fill('128')
  await expect(page.locator('.rgb .result').nth(2)).toContainText('128')
  style = await getComputedStyleByLocator(page.locator('.rgb'))
  await expect(style.backgroundColor).toBe('rgb(128, 128, 128)')
})

test('change props to change bg | alpha', async ({ page }) => {
  await page.locator('.rgb .prop').nth(3).fill('0.5')
  await expect(page.locator('.rgb .result').nth(3)).toContainText('0.5')
  let style = await getComputedStyleByLocator(page.locator('.rgb'))
  await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)')
})
