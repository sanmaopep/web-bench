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

test('links', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await expect(items.nth(0)).toHaveCSS('text-decoration', /underline/i)
  await expect(items.nth(1)).toHaveCSS('text-decoration', /underline/i)
  await expect(items.nth(2)).toHaveCSS('text-decoration', /underline/i)
})

test('click segment links', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await items.nth(0).click()
  await expect(page.locator(`#table`)).toHaveCSS('background-color', 'rgb(144, 238, 144)')

  await items.nth(1).click()
  await expect(page.locator(`#form`)).toHaveCSS('background-color', 'rgb(144, 238, 144)')
})

test('active link', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await items.nth(0).hover()
  await page.mouse.down()
  await expect(items.nth(0)).toHaveCSS('outline-color', 'rgb(0, 0, 255)')
})

// test('click page links', async ({ page }) => {
//   const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

//   await items.nth(2).click()
//   await page.waitForLoadState('load')

//   await expect(page.locator(`#table tr:nth-child(1) td:nth-child(4) a:visited`)).toHaveCount(1)

//   // const [newPage] = await Promise.all([
//   //   page.context().waitForEvent('page'), // Wait for a new page
//   //   items.nth(2).click() // Click the link
//   // ]);
//   // await newPage.waitForLoadState('load'); // Wait for full page load

//   await expect(items.nth(2)).toHaveCSS('text-decoration', /none/i)
// })
