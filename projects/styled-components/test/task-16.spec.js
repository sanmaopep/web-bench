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
const { getOffsetByLocator, getComputedStyleByLocator } = require('@web-bench/test-util')
const { checkFileHasContent } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  const footer = page.locator('.site-footer')
  const button = footer.locator('button:has-text("My Friends")')
  await button.hover()
})

test('Check styled(Tooltip) in Footer.tsx exists', () => {
  checkFileHasContent('components/Footer.tsx', 'styled(Tooltip)')
})

test('Check Footer Tooltip Visible With Text', async ({ page }) => {
  const tooltip = page.locator('.tooltip')
  await expect(tooltip).toHaveText('🐶🐱🐭🐹🐰🦊🐻🐼')
})

test('Check Footer Tooltip FontSize', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.tooltip'))
  expect(style.fontSize).toBe('50px')
})

test('Check Footer Tooltip Position (Top of button)', async ({ page }) => {
  const footer = page.locator('.site-footer')
  const button = footer.locator('button:has-text("My Friends")')

  const c1 = await getOffsetByLocator(button)
  const c2 = await getOffsetByLocator(page.locator('.tooltip'))

  const deltaY = c2.bottom - c1.top
  const deltaX = c2.centerX - c1.centerX

  expect(deltaY).toBeLessThanOrEqual(100)
  expect(deltaX).toBeLessThanOrEqual(100)
})
