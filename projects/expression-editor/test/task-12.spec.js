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
const tinycolor = require('tinycolor2')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test(`Fill "foo and bar"`, async ({ page }) => {
  const editor = page.locator('#editor')

  await editor.pressSequentially('foo and bar', {
    delay: 50,
  })

  await expect(editor).toHaveText('foo and bar')

  expect(await editor.locator('.diagnostic-error').count()).toBe(1)
  await expect(editor.locator('.diagnostic-error').nth(0)).toHaveText('and')

  expect(
    toHexColor(
      await getBorderBottomColor(editor.locator('.diagnostic-error').nth(0))
    )
  ).toBe('#ff0000') // red
})

async function getBorderBottomColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('border-bottom-color')
  })
}

function toHexColor(color) {
  return tinycolor(color).toHexString().toLowerCase()
}