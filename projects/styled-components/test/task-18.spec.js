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
const { getBackgroundHexColor } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.site-header')
  const button = header.locator('button:has-text("Theme")')
  await button.click()
})

test('Check Header Theme Changed', async ({ page }) => {
  await page.locator('input.header-background').fill('#ff0000')
  expect(await getBackgroundHexColor(page.locator('header'))).toBe('#ff0000')

  await page.locator('input.header-background').fill('#00ff00')
  expect(await getBackgroundHexColor(page.locator('header'))).toBe('#00ff00')
})

test('Check Footer Theme Changed', async ({ page }) => {
  await page.locator('input.footer-background').fill('#ff0000')
  expect(await getBackgroundHexColor(page.locator('footer'))).toBe('#ff0000')

  await page.locator('input.footer-background').fill('#00ff00')
  expect(await getBackgroundHexColor(page.locator('footer'))).toBe('#00ff00')
})
