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

test('<p>', async ({ page }) => {
  await expect(page.locator('p#id1')).toBeVisible()
})

test('type selector', async ({ page }) => {
  await expect(css).toContain('p')
  await expect(page.locator('p#id1')).toHaveCSS('padding', /5px/i)
})

test('class selector', async ({ page }) => {
  await expect(css).toContain('.class1')
  await expect(page.locator('.class1').first()).toHaveCSS('text-decoration', /underline/i)
})

test('id selector', async ({ page }) => {
  await expect(css).toContain('#id1')
  await expect(page.locator('#id1')).toHaveCSS('font-family', /monospace/i)
})
