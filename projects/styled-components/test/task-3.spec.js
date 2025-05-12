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
const { getComputedStyle, getOffsetByLocator, parseColorToHex } = require('@web-bench/test-util')
const { checkExists, checkFileHasContent } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Button File', async () => {
  checkExists('components/Button.tsx')
  checkFileHasContent('components/Button.tsx', 'styled.button')
})

test('Check Buttons are aligned to right of Header', async ({ page }) => {
  const header = page.locator('.site-header')
  const headerOffset = await getOffsetByLocator(header)

  const buttonsLocator = header.locator('button')

  expect(buttonsLocator).toHaveCount(3)
  const buttons = await buttonsLocator.all()

  for (const button of buttons) {
    const offset = await getOffsetByLocator(button)
    expect(offset.centerX).toBeGreaterThan(headerOffset.centerX)
  }
})

test('Check Button Background Color', async ({ page }) => {
  const header = page.locator('.site-header')

  const style1 = await getComputedStyle(header, 'button:has-text("Add Blog")')
  expect(parseColorToHex(style1.backgroundColor)).toBe('#0064fa')

  const style2 = await getComputedStyle(header, 'button:has-text("Read Blogs")')
  expect(parseColorToHex(style2.backgroundColor)).toBe('#0095ee')

  const style3 = await getComputedStyle(header, 'button:has-text("Theme")')
  expect(parseColorToHex(style3.backgroundColor)).toBe('#d52515')
})
