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
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('pseudo class 1', async ({ page }) => {
  await page.locator('#form input').nth(0).focus()
  await expect(page.locator('#form input').nth(0)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(1)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(7)).toHaveCSS('font-size', '20px')
})

test('pseudo class 2', async ({ page }) => {
  await page.locator('#form input').nth(7).focus()
  await expect(page.locator('#form input').nth(0)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(1)).toHaveCSS('font-size', '20px')
  await expect(page.locator('#form input').nth(7)).toHaveCSS('font-size', '20px')
})
