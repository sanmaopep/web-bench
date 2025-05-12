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
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/Contents.js', async ({ page }) => {
  await expect(isExisted('common/Contents.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('.contents', async ({ page }) => {
  await expect(page.locator('.contents')).toBeVisible()
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(10)
})

test('click .contents-item', async ({ page }) => {
  // await expect(page.locator('.q').last()).not.toBeInViewport()
  await page.locator('.contents .contents-item').last().click()
  await expect(page.locator('.q').last()).toBeInViewport()
  
  await page.locator('.contents .contents-item').first().click()
  await expect(page.locator('.q').first()).toBeInViewport()
})
