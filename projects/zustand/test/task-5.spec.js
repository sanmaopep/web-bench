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

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Check API fetching logic', async () => {
  test.describe.configure({ mode: 'serial' })

  let page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
  })

  test('Check Loading', async ({ page }) => {
    await expect(page.getByText('Blog is loading')).toBeVisible()
    await expect(page.getByText('Add Blog')).toBeDisabled()
  })

  test('Check Loading End', async ({ page }) => {
    await page.waitForTimeout(1000)
    await expect(page.getByText('Blog is loading')).not.toBeVisible()
  })

  test('Check Blog fetched from API Existed', async ({ page }) => {
    await expect(page.getByText('API Blog')).toBeVisible()
  })

  test('Check API Blog Selected', async ({ page }) => {
    const apiBlogListItem = page.locator('.list-item:has-text("API Blog")')
    await apiBlogListItem.click()
    await expect(page.getByText('This is a blog fetched from API')).toBeVisible()
  })
})
