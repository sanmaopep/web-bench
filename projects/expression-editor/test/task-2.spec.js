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
const { setTimeout } = require('timers/promises')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Editor height should fit its content', async ({ page }) => {
  const editor = page.locator('#editor')
  const height = await editor.evaluate((el) => {
    return parseInt(getComputedStyle(el).height)
  })
  expect(height).toBe(100)

  for (let i = 0; i < 6; i++) {
    await editor.fill('very_long_content'.repeat(100))
  }

  const textContent = await editor.textContent()

  expect(textContent.match(/very_long_content/g)?.length).toBe(100)

  const newHeight = await editor.evaluate((el) => {
    return parseInt(getComputedStyle(el).height)
  })
  expect(newHeight).toBeGreaterThan(100)
})