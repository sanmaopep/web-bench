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

test('elements', async ({ page }) => {
  await expect(await page.locator(`#id17 > :is(section, article, aside, nav)`).count()).toBe(1)
  await expect(
    await page
      .locator(`#id17 > :is(section, article, aside, nav) > :is(section, article, aside, nav)`)
      .count()
  ).toBe(1)
  await expect(
    await page
      .locator(`#id17 > :is(section, article, aside, nav) > :is(section, article, aside, nav) > :is(section, article, aside, nav)`)
      .count()
  ).toBe(1)
})

test('h1', async ({ page }) => {
  const items = page.locator(`#id17 h1`)

  await expect(items.nth(0)).toHaveCSS('font-size', '30px')
  await expect(items.nth(1)).toHaveCSS('font-size', '25px')
  await expect(items.nth(2)).toHaveCSS('font-size', '20px')
  await expect(items.nth(3)).toHaveCSS('font-size', '20px')
})
