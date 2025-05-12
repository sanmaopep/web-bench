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

test('#form', async ({ page }) => {
  await expect(page.locator('#form')).toBeVisible()
  await expect(page.locator('#form *')).toHaveCount(8)
  await expect(page.locator('#form *').first()).toBeVisible()
  await expect(page.locator('#form *').last()).toBeVisible()
})

test('#form child combinator selector', async ({ page }) => {
  await expect(css).toMatch(/#form\s+input/i)
  await expect(page.locator('#form input').first()).toHaveCSS('color', 'rgb(0, 128, 0)')
})

test('#form subsequent-sibling combinator selector', async ({ page }) => {
  await expect(css).toMatch(/#form\s+input:nth-child\(3\)\s+\~\s+input/i)
})

test('#form colors', async ({ page }) => {
  await expect(page.locator('#form input').nth(0)).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(page.locator('#form input').nth(1)).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(page.locator('#form input').nth(2)).toHaveCSS('color', 'rgb(0, 128, 0)')
  await expect(page.locator('#form input').nth(3)).toHaveCSS('color', 'rgb(0, 0, 255)')
  await expect(page.locator('#form input').nth(4)).toHaveCSS('color', 'rgb(0, 0, 255)')
  await expect(page.locator('#form input').nth(5)).toHaveCSS('color', 'rgb(255, 255, 0)')
  await expect(page.locator('#form input').nth(6)).toHaveCSS('color', 'rgb(0, 0, 255)')
  await expect(page.locator('#form input').nth(7)).toHaveCSS('color', 'rgb(0, 0, 255)')
})
