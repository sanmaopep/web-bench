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
const { getComputedStyleByLocator, parseColorToHex, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  const header = page.locator('.site-header')
  const button = header.locator(`button:has-text("Add Blog")`)
  await button.click()

  await page.getByPlaceholder('Title').fill('TestBlog')
  await page.getByPlaceholder('Content').fill(`
# hello1
## hello2
### hello3
#### hello4
    `)

  await page.locator('.preview-btn').click()

  // Wait for animation
  await sleep(1000)
})

test('Test Modal Overlay Style', async ({ page }) => {
  const overlay = page.locator('.modal-overlay')
  const overlayStyle = await getComputedStyleByLocator(overlay)

  expect(parseColorToHex(overlayStyle.backgroundColor)).toBe('#999999')
  expect(overlayStyle.opacity).toBe('0.3')
})

test('Test Modal Title', async ({ page }) => {
  const modal = page.locator('.modal')
  await expect(modal).toContainText('Preview Blog Markdown')
})

test('Test Modal Content', async ({ page }) => {
  const modal = page.locator('.modal')

  const h1 = modal.locator(`h1:has-text("hello1")`)
  await expect(h1).toBeVisible()
  expect(parseColorToHex((await getComputedStyleByLocator(h1)).color)).toBe('#000000')

  const h2 = modal.locator(`h2:has-text("hello2")`)
  await expect(h2).toBeVisible()
  expect(parseColorToHex((await getComputedStyleByLocator(h2)).color)).toBe('#333333')

  const h3 = modal.locator(`h3:has-text("hello3")`)
  await expect(h3).toBeVisible()
  expect(parseColorToHex((await getComputedStyleByLocator(h3)).color)).toBe('#666666')

  const h4 = modal.locator(`h4:has-text("hello4")`)
  await expect(h4).toBeVisible()
  expect(parseColorToHex((await getComputedStyleByLocator(h4)).color)).toBe('#999999')
})
